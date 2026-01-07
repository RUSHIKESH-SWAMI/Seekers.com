from django.urls import path
from django.contrib.auth import views as auth_views
from .views import register, custom_login , logout_view , edit_profile

urlpatterns = [
    path('register/', register, name='register'),
    path('login/', custom_login, name='login'),
    path('logout/', logout_view, name='logout'),
    path('profile/edit/', edit_profile, name='edit_profile'),


]
