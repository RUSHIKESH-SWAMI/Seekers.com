from django.urls import path

from api.utils import csrf_token
from api.views import auth, interviews, jobs, profiles

urlpatterns = [
    path('csrf/', csrf_token, name='api_csrf'),

    # Auth
    path('auth/register/', auth.register, name='api_register'),
    path('auth/login/', auth.api_login, name='api_login'),
    path('auth/logout/', auth.api_logout, name='api_logout'),
    path('auth/me/', auth.me, name='api_me'),

    # Student profile
    path('students/profile/', profiles.student_profile, name='api_student_profile'),

    # Interviewer profile & earnings
    path('interviewers/profile/', profiles.interviewer_profile, name='api_interviewer_profile'),
    path('interviewers/earnings/', profiles.interviewer_earnings, name='api_interviewer_earnings'),

    # Jobs
    path('jobs/', jobs.job_list, name='api_job_list'),
    path('jobs/create/', jobs.create_job, name='api_create_job'),
    path('jobs/mine/', jobs.my_jobs, name='api_my_jobs'),
    path('jobs/<int:job_id>/apply/', jobs.apply_job, name='api_apply_job'),
    path('jobs/<int:job_id>/applicants/', jobs.job_applicants, name='api_job_applicants'),
    path('applications/mine/', jobs.my_applications, name='api_my_applications'),
    path('applications/<int:app_id>/status/', jobs.update_application_status, name='api_update_status'),

    # Interviews
    path('interviews/slots/', interviews.availability_slots, name='api_availability'),
    path('interviews/slots/available/', interviews.available_slots, name='api_available_slots'),
    path('interviews/slots/<int:slot_id>/', interviews.delete_slot, name='api_delete_slot'),
    path('interviews/book/', interviews.book_slot, name='api_book_slot'),
    path('interviews/', interviews.my_interviews, name='api_my_interviews'),
    path('interviews/<int:interview_id>/', interviews.meeting_detail, name='api_meeting'),
    path('interviews/<int:interview_id>/feedback/', interviews.add_feedback, name='api_feedback'),
]
