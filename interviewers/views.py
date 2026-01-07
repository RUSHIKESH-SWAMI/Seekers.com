from interviews.models import InterviewerAvailability as Slot, InterviewBooking as Interview
from interviews.views import my_interviews  # import from interviews app
from django.contrib.auth.decorators import login_required
from django.shortcuts import render, redirect
from .models import InterviewerProfile
from .forms import InterviewerProfileForm
from accounts.decorators import role_required

def dashboard(request):
    return render(request, 'interviewers/dashboard.html')

@login_required
def earnings(request):
    if not hasattr(request.user, 'role') or request.user.role != 'interviewer':
        return redirect('home')
        
    completed_interviews = Interview.objects.filter(interviewer=request.user, status='completed')
    total_interviews = completed_interviews.count()
    total_earnings = total_interviews * 100
    
    return render(request, 'interviewers/earnings.html', {
        'total_earnings': total_earnings,
        'total_interviews': total_interviews,
        'completed_interviews': completed_interviews
    })





@login_required
def interviewer_profile(request):
    if request.user.role != 'interviewer':
        return redirect('home')

    try:
        profile = InterviewerProfile.objects.get(user=request.user)
        created = False
    except InterviewerProfile.DoesNotExist:
        profile = None
        created = True

    if request.method == 'POST':
        if profile:
            form = InterviewerProfileForm(request.POST, instance=profile)
        else:
            form = InterviewerProfileForm(request.POST)
        
        if form.is_valid():
            profile = form.save(commit=False)
            profile.user = request.user
            profile.save()
            return redirect('interviewer_dashboard')
    else:
        if profile:
            form = InterviewerProfileForm(instance=profile)
        else:
            form = InterviewerProfileForm()

    return render(request, 'interviewers/profile.html', {
        'form': form
    })
