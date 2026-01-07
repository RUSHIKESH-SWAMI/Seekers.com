from django.shortcuts import render, redirect
from .forms import UserRegisterForm, CustomAuthenticationForm
from django.contrib.auth import login, logout
from django.views.decorators.http import require_POST
from django.contrib.auth.decorators import login_required
from .decorators import role_required

def register(request):
    role = request.GET.get('role', '')
    if request.method == 'POST':
        form = UserRegisterForm(request.POST)
        if form.is_valid():
            user = form.save(commit=False)
            user.set_password(form.cleaned_data['password1'])
            user.save()
            return redirect('login')
    else:
        form = UserRegisterForm()
        if role:
            form.fields['role'].initial = role
    return render(request, 'accounts/register.html', {'form': form, 'selected_role': role})

def role_redirect(user):
    if user.role == 'student':
        return '/students/dashboard/'
    elif user.role == 'company':
        return '/companies/dashboard/'
    elif user.role == 'interviewer':
        return '/interviewers/dashboard/'
    else:
        return '/'

def custom_login(request):
    if request.method == 'POST':
        form = CustomAuthenticationForm(data=request.POST)
        if form.is_valid():
            user = form.get_user()
            login(request, user)
            return redirect(role_redirect(user))
    else:
        form = CustomAuthenticationForm()
    return render(request, 'accounts/login.html', {'form': form})

@require_POST
def logout_view(request):
    logout(request)
    return redirect('login')

@login_required
@role_required('student')
def edit_profile(request):
    profile = request.user.profile
    if request.method == 'POST':
        profile.skills = request.POST.get('skills')
        if 'resume' in request.FILES:
            profile.resume = request.FILES['resume']
        profile.save()
        return redirect('student_dashboard')
    return render(request, 'accounts/edit_profile.html', {'profile': profile})
        