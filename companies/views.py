
# Create your views here.
from django.shortcuts import render,redirect
from django.contrib.auth.decorators import login_required

@login_required
def company_dashboard(request):
    if request.user.role != 'company':
        return redirect('login')
    return render(request, 'companies/dashboard.html')
