from django.shortcuts import render, redirect
from .models import StudentProfile
from .forms import StudentProfileForm

# Create your views here.
from django.shortcuts import render
from django.contrib.auth.decorators import login_required 
from accounts.decorators import role_required

@login_required
@role_required('student')
def student_dashboard(request):
    if request.user.role != 'student':
        return redirect('login')
    return render(request, 'students/dashboard.html')


@login_required
def student_profile(request):
    if request.user.role != 'student':
        return redirect('login')

    profile, created = StudentProfile.objects.get_or_create(user=request.user)

    if request.method == 'POST':
        form = StudentProfileForm(request.POST, request.FILES, instance=profile)
        if form.is_valid():
            form.save()
            return redirect('student_dashboard')
    else:
        form = StudentProfileForm(instance=profile)

        context = {
            'form': form,
        }

    return render(request, 'students/profile.html', context)