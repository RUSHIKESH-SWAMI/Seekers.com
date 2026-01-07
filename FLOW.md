# Seekers.com - Complete Project Flow Documentation

## 📋 Table of Contents
1. [Project Overview](#project-overview)
2. [Django Project Structure](#django-project-structure)
3. [User Roles & Authentication](#user-roles--authentication)
4. [Database Models](#database-models)
5. [URL Routing System](#url-routing-system)
6. [Views & Business Logic](#views--business-logic)
7. [Templates & UI](#templates--ui)
8. [Complete User Flows](#complete-user-flows)
9. [Key Features Explained](#key-features-explained)
10. [How Everything Connects](#how-everything-connects)

---

## 🎯 Project Overview

**Seekers.com** is a job portal platform that connects three types of users:
- **Students**: Looking for jobs and interview practice
- **Companies**: Posting jobs and hiring candidates
- **Interviewers**: Conducting mock interviews and earning money

### Core Features:
1. **Job Management**: Companies post jobs, students apply
2. **Mock Interviews**: Students book practice sessions with interviewers
3. **Profile Management**: Each user type has specific profile requirements
4. **Application Tracking**: Students track job applications, companies manage candidates

---

## 🏗️ Django Project Structure

```
Seekers/                          # Root project directory
├── manage.py                     # Django's command-line utility
├── db.sqlite3                    # SQLite database file
├── seekers/                      # Main project configuration
│   ├── __init__.py
│   ├── settings.py               # Project settings (database, apps, etc.)
│   ├── urls.py                   # Main URL routing
│   ├── views.py                  # Project-level views
│   ├── wsgi.py                   # Web server gateway interface
│   └── asgi.py                   # Async server gateway interface
├── accounts/                     # User authentication & profiles
├── students/                     # Student-specific functionality
├── companies/                    # Company-specific functionality
├── interviewers/                 # Interviewer-specific functionality
├── jobs/                         # Job posting & application system
├── interviews/                   # Mock interview system
├── adminpanel/                   # Admin functionality
├── templates/                    # HTML templates
├── static/                       # CSS, JS, images
└── media/                        # User uploaded files (resumes, etc.)
```

### Why This Structure?
- **Separation of Concerns**: Each app handles specific functionality
- **Reusability**: Apps can be reused in other projects
- **Maintainability**: Easy to find and modify specific features
- **Scalability**: Can add new apps without affecting existing ones

---

## 👥 User Roles & Authentication

### 1. User Model (`accounts/models.py`)
```python
class User(AbstractUser):
    ROLE_CHOICES = (
        ('student', 'Student'),
        ('company', 'Company'),
        ('interviewer', 'Interviewer'),
        ('admin', 'Admin'),
    )
    role = models.CharField(max_length=20, choices=ROLE_CHOICES)
```

**Why Custom User Model?**
- Django's default User model doesn't have role field
- We need to distinguish between different user types
- Easier to add role-specific functionality

### 2. Profile Model (`accounts/models.py`)
```python
class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES)
    skills = models.TextField(blank=True)
    resume = models.FileField(upload_to='resumes/', blank=True, null=True)
```

**Why Separate Profile?**
- Keeps User model clean
- Can store role-specific data
- OneToOne relationship ensures each user has exactly one profile

### 3. Authentication Flow

#### Registration Process:
1. User visits `/accounts/register/`
2. Fills registration form with username, email, password, role
3. `UserRegisterForm` validates data
4. `register` view creates User and Profile
5. User redirected to login page

#### Login Process:
1. User visits `/accounts/login/`
2. Enters username/password
3. `custom_login` view authenticates user
4. `role_redirect` function sends user to appropriate dashboard
5. Session created, user stays logged in

#### Role-Based Access:
```python
@role_required('student')
def student_dashboard(request):
    # Only students can access this view
```

---

## 🗄️ Database Models

### 1. User-Related Models

#### User (Built-in Django + Custom)
- **Purpose**: Store login credentials and role
- **Fields**: username, email, password, role
- **Relationships**: OneToOne with Profile

#### Profile (accounts/models.py)
- **Purpose**: Store additional user information
- **Fields**: skills, resume file
- **Why**: Separates auth data from profile data

### 2. Student-Specific Models

#### StudentProfile (students/models.py)
```python
class StudentProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    full_name = models.CharField(max_length=100)
    education = models.CharField(max_length=200)
    skills = models.TextField()
    resume = models.FileField(upload_to='resumes/')
```
- **Purpose**: Detailed student information
- **Why Separate**: Students need more detailed profiles than other users

### 3. Company-Specific Models

#### Job (jobs/models.py)
```python
class Job(models.Model):
    company = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    description = models.TextField()
    skills_required = models.CharField(max_length=500)
    location = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)
```
- **Purpose**: Store job postings
- **ForeignKey**: Links job to company that posted it

#### JobApplication (jobs/models.py)
```python
class JobApplication(models.Model):
    job = models.ForeignKey(Job, on_delete=models.CASCADE)
    student = models.ForeignKey(User, on_delete=models.CASCADE)
    status = models.CharField(max_length=20, default='pending')
    applied_at = models.DateTimeField(auto_now_add=True)
```
- **Purpose**: Track job applications
- **Many-to-Many**: Students can apply to many jobs, jobs can have many applicants

### 4. Interviewer-Specific Models

#### InterviewerProfile (interviewers/models.py)
```python
class InterviewerProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    full_name = models.CharField(max_length=100)
    experience = models.PositiveIntegerField()
    expertise = models.CharField(max_length=200)
    bio = models.TextField()
```

#### InterviewerAvailability (interviews/models.py)
```python
class InterviewerAvailability(models.Model):
    interviewer = models.ForeignKey(User, on_delete=models.CASCADE)
    date = models.DateField()
    time = models.TimeField()
    is_booked = models.BooleanField(default=False)
```
- **Purpose**: Store available time slots for interviews

#### InterviewBooking (interviews/models.py)
```python
class InterviewBooking(models.Model):
    student = models.ForeignKey(User, related_name='student_interviews')
    interviewer = models.ForeignKey(User, related_name='interviewer_interviews')
    scheduled_at = models.DateTimeField()
    status = models.CharField(max_length=20, default='booked')
    feedback = models.TextField(blank=True)
```
- **Purpose**: Track booked interviews and feedback

---

## 🛣️ URL Routing System

### 1. Main URLs (`seekers/urls.py`)
```python
urlpatterns = [
    path('admin/', admin.site.urls),
    path('', views.home, name='home'),
    path('accounts/', include('accounts.urls')),
    path('students/', include('students.urls')),
    path('companies/', include('companies.urls')),
    path('interviewers/', include('interviewers.urls')),
    path('jobs/', include('jobs.urls')),
    path('interviews/', include('interviews.urls')),
]
```

**How URL Routing Works:**
1. User visits `http://127.0.0.1:8000/students/dashboard/`
2. Django checks main `urls.py`
3. Finds `path('students/', include('students.urls'))`
4. Looks in `students/urls.py` for `dashboard/`
5. Finds matching view and executes it

### 2. App-Specific URLs

#### Accounts URLs (`accounts/urls.py`)
```python
urlpatterns = [
    path('login/', views.custom_login, name='login'),
    path('register/', views.register, name='register'),
    path('logout/', views.logout_view, name='logout'),
    path('edit-profile/', views.edit_profile, name='edit_profile'),
]
```

#### Jobs URLs (`jobs/urls.py`)
```python
urlpatterns = [
    path('create/', views.create_job, name='create_job'),
    path('list/', views.job_list, name='job_list'),
    path('apply/<int:job_id>/', views.apply_job, name='apply_job'),
    path('applicants/<int:job_id>/', views.job_applicants, name='job_applicants'),
]
```

**URL Parameters:**
- `<int:job_id>`: Captures integer from URL and passes to view
- Example: `/jobs/apply/5/` → `apply_job(request, job_id=5)`

---

## 🎯 Views & Business Logic

### 1. Function-Based Views (FBV)

#### Simple View Example:
```python
def home(request):
    return render(request, 'home.html')
```
- **Purpose**: Display homepage
- **Process**: Takes request, renders template, returns response

#### Complex View Example:
```python
@login_required
@role_required('student')
def apply_job(request, job_id):
    job = get_object_or_404(Job, id=job_id)
    
    # Check if already applied
    exists = JobApplication.objects.filter(
        job=job, student=request.user
    ).exists()
    
    if not exists:
        JobApplication.objects.create(
            job=job, student=request.user
        )
    
    return redirect('job_list')
```

**What This Does:**
1. **Decorators**: Ensure user is logged in and is a student
2. **Get Job**: Fetch job or return 404 if not found
3. **Check Duplicate**: Prevent multiple applications
4. **Create Application**: Save to database
5. **Redirect**: Send user back to job list

### 2. Form Handling Views

#### GET Request (Display Form):
```python
def register(request):
    if request.method == 'POST':
        # Handle form submission
    else:
        form = UserRegisterForm()  # Empty form
    return render(request, 'register.html', {'form': form})
```

#### POST Request (Process Form):
```python
if request.method == 'POST':
    form = UserRegisterForm(request.POST)
    if form.is_valid():
        user = form.save(commit=False)
        user.set_password(form.cleaned_data['password1'])
        user.save()
        return redirect('login')
```

**Form Processing Flow:**
1. User submits form (POST request)
2. Create form instance with submitted data
3. Validate form (check required fields, format, etc.)
4. If valid: save to database, redirect
5. If invalid: show form with errors

---

## 🎨 Templates & UI

### 1. Template Inheritance

#### Base Template (`templates/base.html`)
```html
<!DOCTYPE html>
<html>
<head>
    <title>{% block title %}Seekers{% endblock %}</title>
    <!-- Bootstrap CSS, custom styles -->
</head>
<body>
    <nav><!-- Navigation bar --></nav>
    
    <main>
        {% block content %}
        {% endblock %}
    </main>
    
    <footer><!-- Footer --></footer>
</body>
</html>
```

#### Child Template (`templates/students/dashboard.html`)
```html
{% extends 'base.html' %}

{% block title %}Student Dashboard{% endblock %}

{% block content %}
    <h1>Welcome, {{ user.username }}!</h1>
    <!-- Dashboard content -->
{% endblock %}
```

**Why Template Inheritance?**
- **DRY Principle**: Don't repeat navigation/footer code
- **Consistency**: All pages have same structure
- **Maintainability**: Change base template affects all pages

### 2. Template Context

#### Passing Data to Templates:
```python
def student_dashboard(request):
    context = {
        'user': request.user,
        'applications_count': JobApplication.objects.filter(student=request.user).count()
    }
    return render(request, 'students/dashboard.html', context)
```

#### Using Data in Templates:
```html
<h1>Welcome, {{ user.username }}!</h1>
<p>You have {{ applications_count }} applications</p>

{% if user.profile.resume %}
    <p>Resume uploaded ✓</p>
{% else %}
    <p>Please upload your resume</p>
{% endif %}
```

### 3. Template Tags & Filters

#### Built-in Tags:
- `{% if %}`: Conditional logic
- `{% for %}`: Loops
- `{% url %}`: Generate URLs
- `{% csrf_token %}`: Security token for forms

#### Built-in Filters:
- `{{ text|truncatewords:10 }}`: Limit text length
- `{{ date|date:"M d, Y" }}`: Format dates
- `{{ name|title }}`: Capitalize text

---

## 🔄 Complete User Flows

### 1. Student Job Application Flow

#### Step 1: Registration
1. Visit `/accounts/register/?role=student`
2. Fill form: username, email, password, role=student
3. Submit → `register` view creates User + Profile
4. Redirect to login page

#### Step 2: Login & Profile Setup
1. Visit `/accounts/login/`
2. Enter credentials → `custom_login` view authenticates
3. Redirect to `/students/dashboard/`
4. See warning: "Upload resume"
5. Click "Upload Resume" → `/accounts/edit-profile/`
6. Upload resume file → saved to `media/resumes/`

#### Step 3: Browse & Apply for Jobs
1. From dashboard, click "Browse Jobs"
2. Visit `/jobs/list/` → `job_list` view shows all jobs
3. See jobs posted by companies
4. Click "Apply" → `/jobs/apply/5/` (job_id=5)
5. `apply_job` view creates JobApplication record
6. Redirect back to job list with success message

#### Step 4: Track Applications
1. From dashboard, click "My Applications"
2. Visit `/jobs/my-applications/`
3. `my_applications` view shows all student's applications
4. See status: Pending, Shortlisted, Rejected

### 2. Company Hiring Flow

#### Step 1: Registration & Login
1. Register with role=company
2. Login → redirect to `/companies/dashboard/`

#### Step 2: Post Job
1. Click "Create Job" → `/jobs/create/`
2. Fill form: title, description, skills, location
3. Submit → `create_job` view saves Job with company=current_user
4. Redirect to company dashboard

#### Step 3: Manage Applications
1. Click "My Jobs" → see list of posted jobs
2. Click "View Applicants" → `/jobs/applicants/5/`
3. `job_applicants` view shows all applications for that job
4. See student profiles and resumes
5. Click "Shortlist" or "Reject" → updates application status

### 3. Interviewer Earning Flow

#### Step 1: Setup Profile
1. Register with role=interviewer
2. Login → redirect to `/interviewers/dashboard/`
3. Click "My Profile" → complete profile with experience, skills, bio

#### Step 2: Set Availability
1. Click "Set Availability" → `/interviews/set-availability/`
2. Add date/time slots when available
3. `set_availability` view creates InterviewerAvailability records

#### Step 3: Conduct Interviews
1. Students book available slots
2. InterviewBooking created with status='booked'
3. Interviewer sees booking in "My Interviews"
4. After interview, click "Add Feedback"
5. Fill feedback form → status changes to 'completed'
6. Earn ₹100 per completed interview

### 4. Student Interview Practice Flow

#### Step 1: Browse Available Slots
1. From dashboard, click "Book Interview"
2. Visit `/interviews/available-slots/`
3. See available interviewers with their profiles
4. Choose suitable interviewer and time slot

#### Step 2: Book Interview
1. Click "Book Slot" → `/interviews/book/3/`
2. `book_interview` view creates InterviewBooking
3. Slot marked as booked (is_booked=True)
4. Redirect to "My Interviews"

#### Step 3: View Feedback
1. After interview completion, visit "My Interviews"
2. See interview status changed to "Completed"
3. Click "View Feedback" → modal shows interviewer's feedback
4. Use feedback to improve interview skills

---

## 🔧 Key Features Explained

### 1. Authentication & Authorization

#### Login Required Decorator:
```python
@login_required
def student_dashboard(request):
    # Only logged-in users can access
```

#### Role-Based Access:
```python
@role_required('student')
def apply_job(request, job_id):
    # Only students can apply for jobs
```

#### Custom Decorator (`accounts/decorators.py`):
```python
def role_required(role):
    def decorator(view_func):
        def wrapper(request, *args, **kwargs):
            if request.user.role != role:
                return redirect('login')
            return view_func(request, *args, **kwargs)
        return wrapper
    return decorator
```

### 2. File Upload System

#### Model Field:
```python
resume = models.FileField(upload_to='resumes/', blank=True, null=True)
```

#### Form Handling:
```python
if 'resume' in request.FILES:
    profile.resume = request.FILES['resume']
    profile.save()
```

#### Template Display:
```html
{% if user.profile.resume %}
    <a href="{{ user.profile.resume.url }}" target="_blank">View Resume</a>
{% endif %}
```

#### File Storage:
- Files saved to `media/resumes/`
- URL: `/media/resumes/filename.pdf`
- Served by Django in development

### 3. Database Relationships

#### One-to-One (User ↔ Profile):
```python
profile = models.OneToOneField(User, on_delete=models.CASCADE)
# Each user has exactly one profile
```

#### One-to-Many (Company → Jobs):
```python
company = models.ForeignKey(User, on_delete=models.CASCADE)
# One company can have many jobs
```

#### Many-to-Many (Students ↔ Jobs via Applications):
```python
# Through JobApplication model
student = models.ForeignKey(User, ...)
job = models.ForeignKey(Job, ...)
# Students can apply to many jobs, jobs can have many applicants
```

### 4. Form Processing

#### Django Forms:
```python
class JobForm(forms.ModelForm):
    class Meta:
        model = Job
        fields = ['title', 'description', 'skills_required', 'location']
```

#### Form Validation:
```python
def clean(self):
    cleaned_data = super().clean()
    p1 = cleaned_data.get("password1")
    p2 = cleaned_data.get("password2")
    if p1 != p2:
        raise forms.ValidationError("Passwords do not match")
```

#### CSRF Protection:
```html
<form method="post">
    {% csrf_token %}  <!-- Prevents cross-site request forgery -->
    {{ form.as_p }}
</form>
```

---

## 🔗 How Everything Connects

### 1. Request-Response Cycle

```
1. User clicks link/submits form
   ↓
2. Browser sends HTTP request to Django
   ↓
3. Django URL dispatcher finds matching URL pattern
   ↓
4. Calls corresponding view function
   ↓
5. View processes request (database queries, form validation, etc.)
   ↓
6. View renders template with context data
   ↓
7. Django sends HTML response back to browser
   ↓
8. Browser displays the page
```

### 2. Database Query Flow

#### Example: Showing Student's Applications
```python
# In view
applications = JobApplication.objects.filter(student=request.user)

# Django ORM generates SQL:
# SELECT * FROM jobs_jobapplication WHERE student_id = 1;

# Pass to template
context = {'applications': applications}

# In template
{% for app in applications %}
    <p>{{ app.job.title }} - {{ app.status }}</p>
{% endfor %}
```

### 3. Authentication Flow

```
1. User submits login form
   ↓
2. Django checks username/password against database
   ↓
3. If valid, creates session and sets session cookie
   ↓
4. Future requests include session cookie
   ↓
5. Django recognizes user as authenticated
   ↓
6. request.user contains User object
   ↓
7. Views can access user data and check permissions
```

### 4. File Upload Flow

```
1. User selects file in form
   ↓
2. Form submitted with enctype="multipart/form-data"
   ↓
3. Django receives file in request.FILES
   ↓
4. View saves file to media directory
   ↓
5. File path stored in database
   ↓
6. Template generates URL to access file
   ↓
7. User can download/view file via URL
```

---

## 🎯 Key Django Concepts Explained

### 1. Models (Data Layer)
- **Purpose**: Define database structure
- **ORM**: Object-Relational Mapping (Python objects ↔ Database tables)
- **Migrations**: Track database schema changes
- **Relationships**: ForeignKey, OneToOne, ManyToMany

### 2. Views (Logic Layer)
- **Purpose**: Handle business logic
- **Types**: Function-based views (FBV), Class-based views (CBV)
- **Decorators**: Add functionality (login_required, role_required)
- **Context**: Data passed to templates

### 3. Templates (Presentation Layer)
- **Purpose**: Generate HTML dynamically
- **Inheritance**: Reuse common structure
- **Tags**: Control logic (if, for, url)
- **Filters**: Format data (date, truncate)

### 4. URLs (Routing Layer)
- **Purpose**: Map URLs to views
- **Patterns**: Regular expressions or path converters
- **Namespacing**: Organize URLs by app
- **Parameters**: Pass data from URL to view

### 5. Forms (Input Layer)
- **Purpose**: Handle user input
- **Validation**: Check data format and rules
- **Security**: CSRF protection
- **Rendering**: Generate HTML form fields

---

## 🚀 Project Workflow Summary

### Development Process:
1. **Plan Features**: Define what each user type needs
2. **Create Models**: Design database structure
3. **Make Migrations**: Update database schema
4. **Create Forms**: Handle user input
5. **Write Views**: Implement business logic
6. **Design Templates**: Create user interface
7. **Configure URLs**: Set up routing
8. **Test Features**: Ensure everything works
9. **Style UI**: Make it look professional

### Data Flow:
```
User Input (Forms) → Views (Process) → Models (Store) → Database
                                    ↓
Templates (Display) ← Views (Retrieve) ← Models (Fetch) ← Database
```

### Security Measures:
- **Authentication**: Login required for sensitive actions
- **Authorization**: Role-based access control
- **CSRF Protection**: Prevent malicious form submissions
- **Input Validation**: Check all user input
- **File Upload Security**: Validate file types and sizes

---

## 📚 Learning Path for Django Beginners

### 1. Start Here:
- Understand MVC/MVT pattern
- Learn Python basics (classes, functions, decorators)
- Study HTTP request/response cycle

### 2. Core Django:
- Models and database relationships
- Views and URL routing
- Templates and template inheritance
- Forms and form validation

### 3. Advanced Features:
- User authentication and permissions
- File uploads and media handling
- Admin interface customization
- Deployment and production settings

### 4. Best Practices:
- Code organization and app structure
- Security considerations
- Performance optimization
- Testing strategies

---

This documentation covers the complete flow of the Seekers.com project. Each section builds upon the previous ones to give you a comprehensive understanding of how Django web applications work. Start with the basics and gradually work your way through the more complex features!