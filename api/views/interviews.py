from django.shortcuts import get_object_or_404
from django.utils import timezone
from django.views.decorators.http import require_http_methods

from interviews.models import InterviewerAvailability, InterviewBooking
from api.utils import (
    interview_to_dict,
    json_error,
    json_response,
    login_required_api,
    parse_json_body,
    role_required_api,
    slot_to_dict,
)


@require_http_methods(['GET', 'POST'])
@role_required_api('interviewer')
def availability_slots(request):
    if request.method == 'GET':
        slots = InterviewerAvailability.objects.filter(interviewer=request.user).order_by('date', 'time')
        return json_response({'slots': [slot_to_dict(s) for s in slots]})

    data = parse_json_body(request)
    if data is None:
        return json_error('Invalid JSON body')

    date_str = data.get('date')
    time_str = data.get('time')
    errors = {}
    if not date_str:
        errors['date'] = 'Date is required'
    if not time_str:
        errors['time'] = 'Time is required'
    if errors:
        return json_error('Validation failed', status=400, errors=errors)

    slot = InterviewerAvailability.objects.create(
        interviewer=request.user,
        date=date_str,
        time=time_str,
    )
    return json_response({'slot': slot_to_dict(slot)}, status=201)


@require_http_methods(['DELETE', 'POST'])
@role_required_api('interviewer')
def delete_slot(request, slot_id):
    slot = get_object_or_404(InterviewerAvailability, id=slot_id, interviewer=request.user)
    if slot.is_booked:
        return json_error('Cannot delete a booked slot', status=400)
    slot.delete()
    return json_response({'message': 'Slot deleted'})


@require_http_methods(['GET'])
@role_required_api('student')
def available_slots(request):
    slots = InterviewerAvailability.objects.filter(is_booked=False).select_related(
        'interviewer', 'interviewer__interviewerprofile'
    ).order_by('date', 'time')
    return json_response({'slots': [slot_to_dict(s, include_interviewer=True) for s in slots]})


@require_http_methods(['POST'])
@role_required_api('student')
def book_slot(request):
    data = parse_json_body(request)
    if data is None:
        return json_error('Invalid JSON body')

    slot_id = data.get('slot_id')
    if not slot_id:
        return json_error('slot_id is required', status=400)

    slot = get_object_or_404(InterviewerAvailability, id=slot_id, is_booked=False)
    scheduled_at = timezone.make_aware(
        timezone.datetime.combine(slot.date, slot.time)
    )
    interview = InterviewBooking.objects.create(
        student=request.user,
        interviewer=slot.interviewer,
        scheduled_at=scheduled_at,
    )
    slot.is_booked = True
    slot.save()
    return json_response({'interview': interview_to_dict(interview)}, status=201)


@require_http_methods(['GET'])
@login_required_api
def my_interviews(request):
    role = request.user.role
    if role == 'student':
        interviews = InterviewBooking.objects.filter(student=request.user)
    elif role == 'interviewer':
        interviews = InterviewBooking.objects.filter(interviewer=request.user)
    else:
        interviews = InterviewBooking.objects.none()

    interviews = interviews.select_related('student', 'interviewer').order_by('-scheduled_at')
    return json_response({'interviews': [interview_to_dict(i) for i in interviews]})


@require_http_methods(['GET'])
@login_required_api
def meeting_detail(request, interview_id):
    interview = get_object_or_404(InterviewBooking, id=interview_id)
    if request.user not in (interview.student, interview.interviewer):
        return json_error('Permission denied', status=403)
    return json_response({'interview': interview_to_dict(interview)})


@require_http_methods(['POST'])
@role_required_api('interviewer')
def add_feedback(request, interview_id):
    interview = get_object_or_404(InterviewBooking, id=interview_id, interviewer=request.user)
    data = parse_json_body(request)
    if data is None:
        return json_error('Invalid JSON body')

    feedback = (data.get('feedback') or '').strip()
    if not feedback:
        return json_error('Feedback is required', status=400, errors={'feedback': 'Feedback is required'})

    interview.feedback = feedback
    interview.status = 'completed'
    interview.save()
    return json_response({'interview': interview_to_dict(interview)})
