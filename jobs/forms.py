from django import forms
from .models import Job

class JobForm(forms.ModelForm):
    title = forms.CharField(
        widget=forms.TextInput(attrs={
            'class': 'form-control form-control-lg',
            'placeholder': 'e.g. Senior Software Engineer'
        }),
        label='Job Title'
    )
    
    description = forms.CharField(
        widget=forms.Textarea(attrs={
            'class': 'form-control',
            'rows': 5,
            'placeholder': 'Describe the role, responsibilities, and requirements...'
        }),
        label='Job Description'
    )
    
    skills_required = forms.CharField(
        widget=forms.TextInput(attrs={
            'class': 'form-control',
            'placeholder': 'e.g. Python, Django, React, SQL'
        }),
        label='Required Skills'
    )
    
    location = forms.CharField(
        widget=forms.TextInput(attrs={
            'class': 'form-control',
            'placeholder': 'e.g. Mumbai, Remote, Hybrid'
        }),
        label='Location'
    )
    
    class Meta:
        model = Job
        fields = ['title', 'description', 'skills_required', 'location']
