from django.shortcuts import get_object_or_404
from django.views.decorators.http import require_http_methods

from jobs.models import Job, JobApplication
from api.utils import (
    application_to_dict,
    job_to_dict,
    json_error,
    json_response,
    login_required_api,
    parse_json_body,
    role_required_api,
)


@require_http_methods(['GET'])
@login_required_api
def job_list(request):
    jobs = Job.objects.select_related('company').order_by('-created_at')
    applied_ids = []
    if request.user.role == 'student':
        applied_ids = list(
            JobApplication.objects.filter(student=request.user).values_list('job_id', flat=True)
        )
    return json_response({
        'jobs': [job_to_dict(j, include_company=True) for j in jobs],
        'applied_job_ids': applied_ids,
    })


@require_http_methods(['GET'])
@role_required_api('company')
def my_jobs(request):
    jobs = Job.objects.filter(company=request.user).order_by('-created_at')
    return json_response({'jobs': [job_to_dict(j) for j in jobs]})


@require_http_methods(['POST'])
@role_required_api('company')
def create_job(request):
    data = parse_json_body(request)
    if data is None:
        return json_error('Invalid JSON body')

    errors = {}
    for field in ('title', 'description', 'skills_required', 'location'):
        if not (data.get(field) or '').strip():
            errors[field] = f'{field.replace("_", " ").title()} is required'

    if errors:
        return json_error('Validation failed', status=400, errors=errors)

    job = Job.objects.create(
        company=request.user,
        title=data['title'].strip(),
        description=data['description'].strip(),
        skills_required=data['skills_required'].strip(),
        location=data['location'].strip(),
    )
    return json_response({'job': job_to_dict(job)}, status=201)


@require_http_methods(['POST'])
@role_required_api('student')
def apply_job(request, job_id):
    job = get_object_or_404(Job, id=job_id)
    app, created = JobApplication.objects.get_or_create(job=job, student=request.user)
    if not created:
        return json_error('You have already applied to this job', status=400)
    return json_response({'application': application_to_dict(app, include_job=True)}, status=201)


@require_http_methods(['GET'])
@role_required_api('student')
def my_applications(request):
    apps = JobApplication.objects.filter(student=request.user).select_related('job', 'job__company')
    return json_response({
        'applications': [application_to_dict(a, include_job=True) for a in apps],
    })


@require_http_methods(['GET'])
@role_required_api('company')
def job_applicants(request, job_id):
    job = get_object_or_404(Job, id=job_id, company=request.user)
    apps = JobApplication.objects.filter(job=job).select_related('student', 'student__profile')
    return json_response({
        'job': job_to_dict(job),
        'applications': [application_to_dict(a, include_student=True) for a in apps],
    })


@require_http_methods(['PATCH', 'POST'])
@role_required_api('company')
def update_application_status(request, app_id):
    application = get_object_or_404(JobApplication, id=app_id, job__company=request.user)
    data = parse_json_body(request)
    if data is None:
        return json_error('Invalid JSON body')

    status = data.get('status')
    if status not in ('shortlisted', 'rejected', 'applied'):
        return json_error('Status must be shortlisted, rejected, or applied', status=400)

    application.status = status
    application.save()
    return json_response({'application': application_to_dict(application, include_student=True)})
