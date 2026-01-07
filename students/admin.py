from django.contrib import admin
from .models import StudentProfile

class StudentProfileAdmin(admin.ModelAdmin):
    list_display = ('full_name','education','skills','created_at')
    search_fields = ('full_name','education')



# Register your models here.
admin.site.register(StudentProfile,StudentProfileAdmin)
