
**Seekers.com** is a job portal platform that connects three types of users:
- **Students**: Looking for jobs and interview practice
- **Companies**: Posting jobs and hiring candidates
- **Interviewers**: Conducting mock interviews and earning money

### Core Features:
1. **Job Management**: Companies post jobs, students apply
2. **Mock Interviews**: Students book practice sessions with interviewers
3. **Profile Management**: Each user type has specific profile requirements
4. **Application Tracking**: Students track job applications, companies manage candidates


##  Django Project Structure

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


##User Roles & Authentication

### 1. User Model (`accounts/models.py`)
class User(AbstractUser):
    ROLE_CHOICES = (
        ('student', 'Student'),
        ('company', 'Company'),
        ('interviewer', 'Interviewer'),
        ('admin', 'Admin'),
    )
    role = models.CharField(max_length=20, choices=ROLE_CHOICES)


**Why Custom User Model?**
- Django's default User model doesn't have role field
- We need to distinguish between different user types
- Easier to add role-specific functionality

### 2. Profile Model (`accounts/models.py`)

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES)
    skills = models.TextField(blank=True)
    resume = models.FileField(upload_to='resumes/', blank=True, null=True)


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

@role_required('student')
def student_dashboard(request):
    # Only students can access this view


##Database Models

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
class StudentProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    full_name = models.CharField(max_length=100)
    education = models.CharField(max_length=200)
    skills = models.TextField()
    resume = models.FileField(upload_to='resumes/')
    
- **Purpose**: Detailed student information
- **Why Separate**: Students need more detailed profiles than other users

### 3. Company-Specific Models


#### Job (jobs/models.py)

class Job(models.Model):
    company = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    description = models.TextField()
    skills_required = models.CharField(max_length=500)
    location = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)
- **Purpose**: Store job postings
- **ForeignKey**: Links job to company that posted it

#### JobApplication (jobs/models.py)

class JobApplication(models.Model):
    job = models.ForeignKey(Job, on_delete=models.CASCADE)
    student = models.ForeignKey(User, on_delete=models.CASCADE)
    status = models.CharField(max_length=20, default='pending')
    applied_at = models.DateTimeField(auto_now_add=True)
- **Purpose**: Track job applications
- **Many-to-Many**: Students can apply to many jobs, jobs can have many applicants

### 4. Interviewer-Specific Models

#### InterviewerProfile (interviewers/models.py)

class InterviewerProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    full_name = models.CharField(max_length=100)
    experience = models.PositiveIntegerField()
    expertise = models.CharField(max_length=200)
    bio = models.TextField()

#### InterviewerAvailability (interviews/models.py)
class InterviewerAvailability(models.Model):
    interviewer = models.ForeignKey(User, on_delete=models.CASCADE)
    date = models.DateField()
    time = models.TimeField()
    is_booked = models.BooleanField(default=False)
    
 **Purpose**: Store available time slots for interviews

#### InterviewBooking (interviews/models.py)

class InterviewBooking(models.Model):
    student = models.ForeignKey(User, related_name='student_interviews')
    interviewer = models.ForeignKey(User, related_name='interviewer_interviews')
    scheduled_at = models.DateTimeField()
    status = models.CharField(max_length=20, default='booked')
    feedback = models.TextField(blank=True)

 **Purpose**: Track booked interviews and feedback




How to Run :

Python3 manage.py runserver


