from django.views.decorators.http import require_http_methods

from accounts.models import Profile
from interviewers.models import InterviewerProfile
from interviews.models import InterviewBooking
from students.models import StudentProfile
from api.utils import json_error, json_response, login_required_api, parse_json_body, role_required_api


@require_http_methods(['GET', 'PATCH', 'PUT'])
@role_required_api('student')
def student_profile(request):
    profile, _ = StudentProfile.objects.get_or_create(
        user=request.user,
        defaults={
            'full_name': request.user.username,
            'education': '',
            'skills': '',
        },
    )

    if request.method == 'GET':
        account_profile = getattr(request.user, 'profile', None)
        return json_response({
            'profile': {
                'full_name': profile.full_name,
                'education': profile.education,
                'skills': profile.skills,
                'resume': profile.resume.url if profile.resume else None,
                'account_skills': account_profile.skills if account_profile else '',
                'account_resume': account_profile.resume.url if account_profile and account_profile.resume else None,
            },
        })

    if request.content_type and 'multipart' in request.content_type:
        full_name = request.POST.get('full_name', profile.full_name)
        education = request.POST.get('education', profile.education)
        skills = request.POST.get('skills', profile.skills)
        account_skills = request.POST.get('account_skills')
    else:
        data = parse_json_body(request)
        if data is None:
            return json_error('Invalid JSON body')
        full_name = data.get('full_name', profile.full_name)
        education = data.get('education', profile.education)
        skills = data.get('skills', profile.skills)
        account_skills = data.get('account_skills')

    errors = {}
    if not (full_name or '').strip():
        errors['full_name'] = 'Full name is required'
    if errors:
        return json_error('Validation failed', status=400, errors=errors)

    profile.full_name = full_name.strip()
    profile.education = (education or '').strip()
    profile.skills = (skills or '').strip()
    if request.FILES.get('resume'):
        profile.resume = request.FILES['resume']
    profile.save()

    account_profile, _ = Profile.objects.get_or_create(user=request.user, defaults={'role': 'student'})
    if account_skills is not None:
        account_profile.skills = account_skills
    if request.FILES.get('account_resume'):
        account_profile.resume = request.FILES['account_resume']
    account_profile.save()

    return json_response({
        'message': 'Profile updated',
        'profile': {
            'full_name': profile.full_name,
            'education': profile.education,
            'skills': profile.skills,
            'resume': profile.resume.url if profile.resume else None,
        },
    })


@require_http_methods(['GET', 'PATCH', 'PUT'])
@role_required_api('interviewer')
def interviewer_profile(request):
    profile, created = InterviewerProfile.objects.get_or_create(
        user=request.user,
        defaults={
            'full_name': request.user.username,
            'experience': 0,
            'expertise': '',
            'bio': '',
        },
    )

    if request.method == 'GET':
        return json_response({
            'profile': {
                'full_name': profile.full_name,
                'experience': profile.experience,
                'expertise': profile.expertise,
                'bio': profile.bio,
            },
        })

    data = parse_json_body(request)
    if data is None:
        return json_error('Invalid JSON body')

    errors = {}
    full_name = (data.get('full_name') or '').strip()
    if not full_name:
        errors['full_name'] = 'Full name is required'
    try:
        experience = int(data.get('experience', profile.experience))
        if experience < 0:
            errors['experience'] = 'Experience cannot be negative'
    except (TypeError, ValueError):
        errors['experience'] = 'Experience must be a number'

    if errors:
        return json_error('Validation failed', status=400, errors=errors)

    profile.full_name = full_name
    profile.experience = experience
    profile.expertise = (data.get('expertise') or '').strip()
    profile.bio = (data.get('bio') or '').strip()
    profile.save()

    return json_response({
        'message': 'Profile updated',
        'profile': {
            'full_name': profile.full_name,
            'experience': profile.experience,
            'expertise': profile.expertise,
            'bio': profile.bio,
        },
    })


@require_http_methods(['GET'])
@role_required_api('interviewer')
def interviewer_earnings(request):
    from api.utils import interview_to_dict

    completed = InterviewBooking.objects.filter(interviewer=request.user, status='completed')
    count = completed.count()
    return json_response({
        'total_earnings': count * 100,
        'total_interviews': count,
        'completed_interviews': [interview_to_dict(i) for i in completed],
    })
