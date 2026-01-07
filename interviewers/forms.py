from django import forms
from .models import InterviewerProfile

class InterviewerProfileForm(forms.ModelForm):
    full_name = forms.CharField(
        widget=forms.TextInput(attrs={
            'class': 'form-control form-control-lg',
            'placeholder': 'Enter your full name'
        }),
        label='Full Name'
    )
    
    experience = forms.IntegerField(
        widget=forms.NumberInput(attrs={
            'class': 'form-control',
            'placeholder': 'Years of experience',
            'min': '0',
            'max': '50'
        }),
        label='Years of Experience'
    )
    
    expertise = forms.CharField(
        widget=forms.TextInput(attrs={
            'class': 'form-control',
            'placeholder': 'e.g. Python, Java, System Design, Frontend'
        }),
        label='Areas of Expertise'
    )
    
    bio = forms.CharField(
        widget=forms.Textarea(attrs={
            'class': 'form-control',
            'rows': 4,
            'placeholder': 'Tell students about your background, experience, and what you can help them with...'
        }),
        label='Professional Bio'
    )
    
    class Meta:
        model = InterviewerProfile
        fields = ['full_name', 'experience', 'expertise', 'bio']