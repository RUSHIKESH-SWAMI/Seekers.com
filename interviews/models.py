from django.db import models
from django.conf import settings

User = settings.AUTH_USER_MODEL

class InterviewerAvailability(models.Model):
    interviewer = models.ForeignKey(User, on_delete=models.CASCADE)
    date = models.DateField()
    time = models.TimeField()
    is_booked = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.interviewer.username} - {self.date} {self.time}"

class InterviewBooking(models.Model):
    student = models.ForeignKey(User, on_delete=models.CASCADE, related_name='student_interviews')
    interviewer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='interviewer_interviews')
    scheduled_at = models.DateTimeField()
    status = models.CharField(max_length=20, choices=[('booked','Booked'),('completed','Completed'),('cancelled','Cancelled')], default='booked')
    feedback = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.student.username} → {self.interviewer.username}"
