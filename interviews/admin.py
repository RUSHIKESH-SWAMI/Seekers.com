from django.contrib import admin

# Register your models here.
from .models import InterviewBooking, InterviewerAvailability

admin.site.register(InterviewBooking)
admin.site.register(InterviewerAvailability)