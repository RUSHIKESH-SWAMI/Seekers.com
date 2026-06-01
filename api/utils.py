"""Shared helpers for JSON API views."""
import json
from functools import wraps

from django.http import JsonResponse
from django.views.decorators.csrf import ensure_csrf_cookie


def json_response(data, status=200):
    return JsonResponse(data, status=status, safe=not isinstance(data, list))


def json_error(message, status=400, errors=None):
    payload = {'error': message}
    if errors:
        payload['errors'] = errors
    return json_response(payload, status=status)


def parse_json_body(request):
    try:
        if not request.body:
            return {}
        return json.loads(request.body.decode('utf-8'))
    except json.JSONDecodeError:
        return None


def login_required_api(view_func):
    @wraps(view_func)
    def wrapper(request, *args, **kwargs):
        if not request.user.is_authenticated:
            return json_error('Authentication required', status=401)
        return view_func(request, *args, **kwargs)
    return wrapper


def role_required_api(*roles):
    def decorator(view_func):
        @wraps(view_func)
        def wrapper(request, *args, **kwargs):
            if not request.user.is_authenticated:
                return json_error('Authentication required', status=401)
            if request.user.role not in roles:
                return json_error('Permission denied', status=403)
            return view_func(request, *args, **kwargs)
        return wrapper
    return decorator


def user_to_dict(user):
    profile = getattr(user, 'profile', None)
    return {
        'id': user.id,
        'username': user.username,
        'email': user.email,
        'role': user.role,
        'profile': {
            'skills': profile.skills if profile else '',
            'resume': profile.resume.url if profile and profile.resume else None,
        } if profile else None,
    }


def job_to_dict(job, include_company=False):
    data = {
        'id': job.id,
        'title': job.title,
        'description': job.description,
        'skills_required': job.skills_required,
        'location': job.location,
        'created_at': job.created_at.isoformat(),
        'company_id': job.company_id,
    }
    if include_company:
        data['company_username'] = job.company.username
    return data


def application_to_dict(app, include_job=False, include_student=False):
    data = {
        'id': app.id,
        'job_id': app.job_id,
        'student_id': app.student_id,
        'status': app.status,
        'applied_at': app.applied_at.isoformat(),
    }
    if include_job:
        data['job'] = job_to_dict(app.job, include_company=True)
    if include_student:
        data['student'] = {
            'id': app.student.id,
            'username': app.student.username,
            'email': app.student.email,
            'skills': getattr(app.student.profile, 'skills', '') if hasattr(app.student, 'profile') else '',
        }
    return data


def slot_to_dict(slot, include_interviewer=False):
    data = {
        'id': slot.id,
        'interviewer_id': slot.interviewer_id,
        'date': slot.date.isoformat(),
        'time': slot.time.strftime('%H:%M'),
        'is_booked': slot.is_booked,
    }
    if include_interviewer:
        profile = getattr(slot.interviewer, 'interviewerprofile', None)
        data['interviewer'] = {
            'id': slot.interviewer.id,
            'username': slot.interviewer.username,
            'full_name': profile.full_name if profile else slot.interviewer.username,
            'expertise': profile.expertise if profile else '',
        }
    return data


def interview_to_dict(interview):
    return {
        'id': interview.id,
        'student_id': interview.student_id,
        'student_username': interview.student.username,
        'interviewer_id': interview.interviewer_id,
        'interviewer_username': interview.interviewer.username,
        'scheduled_at': interview.scheduled_at.isoformat(),
        'status': interview.status,
        'feedback': interview.feedback,
        'meeting_link': interview.meeting_link,
        'created_at': interview.created_at.isoformat(),
    }


@ensure_csrf_cookie
def csrf_token(request):
    """Return empty JSON; CSRF cookie is set by the decorator."""
    return json_response({'detail': 'CSRF cookie set'})
