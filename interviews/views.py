from django.shortcuts import get_object_or_404, render, redirect
from django.contrib.auth.decorators import login_required
from accounts.decorators import role_required
from .models import InterviewerAvailability, InterviewBooking
from django.utils import timezone


@login_required
@role_required('interviewer')
def set_availability(request):               
    if request.method == 'POST':
        InterviewerAvailability.objects.create(
            interviewer=request.user,
            date=request.POST['date'],
            time=request.POST['time']
        )
        return redirect('set_availability')
    slots = InterviewerAvailability.objects.filter(interviewer=request.user)
    return render(request, 'interviews/set_availability.html', {'slots': slots})

@login_required
@role_required('student')
def available_slots(request):
    slots = InterviewerAvailability.objects.filter(
        is_booked=False
    ).select_related(
        'interviewer',
        'interviewer__interviewerprofile'
    )

    return render(request, 'interviews/available_slots.html', {
        'slots': slots
    })


@login_required
@role_required('student')
def book_interview(request, slot_id):
    slot = InterviewerAvailability.objects.get(id=slot_id, is_booked=False)
    InterviewBooking.objects.create(
        student=request.user,
        interviewer=slot.interviewer,
        scheduled_at=timezone.make_aware(timezone.datetime.combine(slot.date, slot.time))
    )
    slot.is_booked = True
    slot.save()
    return redirect('my_interviews')

@login_required
def my_interviews(request):
    if not hasattr(request.user, 'profile'):
        interviews = []
    elif request.user.profile.role == 'student':
        interviews = InterviewBooking.objects.filter(student=request.user)
    elif request.user.profile.role == 'interviewer':
        interviews = InterviewBooking.objects.filter(interviewer=request.user)
    else:
        interviews = []

    return render(request, 'interviews/my_interviews.html', {
        'interviews': interviews
    })

@login_required
@role_required('interviewer')
def add_feedback(request, interview_id):
    interview = InterviewBooking.objects.get(id=interview_id)
    if request.method == 'POST':
        interview.feedback = request.POST['feedback']
        interview.status = 'completed'
        interview.save()
        return redirect('my_interviews')
    return render(request, 'interviews/add_feedback.html', {'interview': interview})

@login_required
def delete_slot(request, slot_id):
    slot = get_object_or_404(InterviewerAvailability, id=slot_id, interviewer=request.user)
    if request.method == 'POST':
        slot.delete()
    return redirect('set_availability')

@login_required
def meeting_room(request, interview_id):
    interview = get_object_or_404(InterviewBooking, id=interview_id)
    if request.user != interview.student and request.user != interview.interviewer:
        return redirect('my_interviews')
    return render(request, 'interviews/meeting_room.html', {'interview': interview})





