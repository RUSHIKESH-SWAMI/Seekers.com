from django.conf import settings
from django.db import models

User = settings.AUTH_USER_MODEL

class InterviewerProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    full_name = models.CharField(max_length=100)
    experience = models.PositiveIntegerField(help_text="Years of experience")
    expertise = models.CharField(max_length=200)
    bio = models.TextField()

    def __str__(self):
        return self.full_name



class Availability(models.Model):
    interviewer = models.ForeignKey(User, on_delete=models.CASCADE)
    date = models.DateField()
    time = models.TimeField()
    is_booked = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.date} {self.time}"
