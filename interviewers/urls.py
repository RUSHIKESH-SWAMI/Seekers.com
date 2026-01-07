from django.urls import path
from . import views

urlpatterns = [
    path('my-interviews/', views.my_interviews, name='my_interviews'),
    path('earnings/', views.earnings, name='interviewer_earnings'),
    path('dashboard/', views.dashboard, name='interviewer_dashboard'),  
    path('profile/', views.interviewer_profile, name='interviewer_profile'),

]
