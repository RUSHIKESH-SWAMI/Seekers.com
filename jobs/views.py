from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from .models import Job, JobApplication
from .forms import JobForm
from accounts.decorators import role_required

@login_required
@role_required('company')
def create_job(request):
    if request.user.role != 'company':
        return redirect('login')

    if request.method == 'POST':
        form = JobForm(request.POST)
        if form.is_valid():
            job = form.save(commit=False)
            job.company = request.user
            job.save()
            return redirect('company_dashboard')
    else:
        form = JobForm()

    return render(request, 'jobs/create_job.html', {'form': form})


@login_required
# jobs/views.py
def job_list(request):
    jobs = Job.objects.all()

    applied_job_ids = []
    if request.user.is_authenticated and request.user.role == 'student':
        applied_job_ids = JobApplication.objects.filter(
            student=request.user
        ).values_list('job_id', flat=True)

    return render(request, 'jobs/job_list.html', {
        'jobs': jobs,
        'applied_job_ids': applied_job_ids
    })

@login_required
@role_required('student')
def apply_job(request, job_id):
    if request.user.role != 'student':
        return redirect('login')

    job = get_object_or_404(Job, id=job_id)

    exists = JobApplication.objects.filter(
        job=job,
        student=request.user
    ).exists()

    if not exists:
        JobApplication.objects.create(
            job=job,
            student=request.user
        )

    return redirect('job_list')


@login_required
def job_applicants(request, job_id):
    if request.user.role != 'company':
        return redirect('login')

    job = get_object_or_404(Job, id=job_id, company=request.user)
    applications = JobApplication.objects.select_related('student', 'student__profile').filter(job=job)

    return render(request, 'jobs/applicants.html', {
        'job': job,
        'applications': applications
    })



@login_required
def company_jobs(request):
    if request.user.role != 'company':
        return redirect('login')

    jobs = Job.objects.filter(company=request.user)
    return render(request, 'jobs/company_jobs.html', {'jobs': jobs})


@login_required
@role_required('student')
def my_applications(request):
    if request.user.role != 'student':
        return redirect('login')

    applications = JobApplication.objects.filter(student=request.user)
    return render(request, 'jobs/my_applications.html', {
        'applications': applications
    })


@login_required
@role_required('company')
def update_application_status(request, app_id, status):
    if request.user.role != 'company':
        return redirect('login')

    application = get_object_or_404(JobApplication, id=app_id)

    if application.job.company == request.user:
        application.status = status
        application.save()

    return redirect('job_applicants', job_id=application.job.id)
