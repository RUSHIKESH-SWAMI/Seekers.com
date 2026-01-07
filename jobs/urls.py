from django.urls import path
from .views import my_applications,create_job, job_list, apply_job,job_applicants, update_application_status,company_jobs

urlpatterns = [
    path('create/', create_job, name='create_job'),
    path('list/', job_list, name='job_list'),
    path('apply/<int:job_id>/', apply_job, name='apply_job'),
    path('applicants/<int:job_id>/', job_applicants, name='job_applicants'),
    path('status/<int:app_id>/<str:status>/', update_application_status, name='update_status'),
    path('my-jobs/', company_jobs, name='company_jobs'),
    path('my-applications/', my_applications, name='my_applications'),


]
