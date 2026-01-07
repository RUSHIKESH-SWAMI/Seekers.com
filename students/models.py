from django.conf import settings
from django.db import models

User = settings.AUTH_USER_MODEL

class StudentProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    full_name = models.CharField(max_length=100)
    education = models.CharField(max_length=200)
    skills = models.TextField(help_text="Comma separated skills")
    resume = models.FileField(upload_to='resumes/')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.full_name
    
    
