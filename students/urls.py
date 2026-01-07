from django.urls import path
from .views import student_dashboard,student_profile

urlpatterns = [
    path('dashboard/', student_dashboard, name='student_dashboard'),
    path('profile/', student_profile, name='student_profile'),
]
