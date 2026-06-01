# Seekers

**Seekers** is a full-stack hiring and interview platform that connects **students**, **companies**, and **interviewers** in one place. Students discover jobs and book mock interviews; companies post roles and manage applicants; interviewers offer practice sessions and track earnings.

The project includes a **Django** backend (server-rendered templates + JSON API) and a modern **React** single-page application in `frontend/`.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [User Roles](#user-roles)
- [API Reference](#api-reference)
- [Environment Variables](#environment-variables)
- [Development](#development)
- [Contributing](#contributing)

---

## Features

| Area | Capabilities |
|------|----------------|
| **Authentication** | Role-based registration (student, company, interviewer), session login, protected routes |
| **Jobs** | Companies create listings; students browse and apply; companies shortlist or reject applicants |
| **Applications** | Students track status (`applied`, `shortlisted`, `rejected`) |
| **Mock interviews** | Interviewers set availability; students book slots; Jitsi-powered meeting rooms |
| **Profiles** | Student and interviewer profiles with skills, education, resume upload |
| **Earnings** | Interviewers view completed sessions and earnings (₹100 per completed interview) |

---

## Tech Stack

### Backend

- **Python 3.10+**
- **Django 5.2** — ORM, auth, admin, templates
- **SQLite** — default database (development)
- **Custom JSON API** (`api/`) — REST-style endpoints for the React app
- **Session + CSRF** authentication with CORS support for local development

### Frontend

- **React 19** — functional components and hooks
- **Vite 8** — dev server and build tooling
- **React Router 7** — client-side navigation
- **Axios** — HTTP client with credentials and CSRF headers
- **Lucide React** — icons

---

## Architecture

```
┌─────────────────┐     HTTP + cookies/CSRF      ┌──────────────────────────┐
│  React SPA      │ ───────────────────────────► │  Django (port 8000)      │
│  localhost:5173 │                              │  • /api/*  → JSON API    │
└─────────────────┘                              │  • /*      → Templates   │
                                                 └────────────┬─────────────┘
                                                              │
                                                 ┌────────────▼─────────────┐
                                                 │  SQLite + media/uploads  │
                                                 └──────────────────────────┘
```

- **Recommended UI:** Run the React app (`frontend/`) against the JSON API at `/api/`.
- **Legacy UI:** Django templates under `templates/` remain available for the same workflows.

---

## Getting Started

### Prerequisites

- Python 3.10 or newer
- Node.js 18+ and npm
- Git

### 1. Clone and set up the backend

```bash
git clone <repository-url>
cd Seekers

python3 -m venv venv
source venv/bin/activate          # Windows: venv\Scripts\activate

pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

Backend runs at **http://127.0.0.1:8000/**

Optional — create a superuser for Django admin:

```bash
python manage.py createsuperuser
```

Admin panel: **http://127.0.0.1:8000/admin/**

### 2. Set up the frontend

In a second terminal:

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

Frontend runs at **http://localhost:5173**

### Quick test flow

1. Open http://localhost:5173 and register as **Student**, **Company**, or **Interviewer**.
2. Sign in and use the role-specific dashboard.
3. As a company, post a job; as a student, apply; as an interviewer, add availability and complete a booked session.

---

## Project Structure

```
Seekers/
├── manage.py                 # Django CLI entry point
├── requirements.txt          # Python dependencies
├── db.sqlite3                # SQLite database (after migrate)
├── seekers/                  # Project settings & root URLs
├── api/                      # JSON API for React (views, CORS middleware)
├── accounts/                 # Custom User model, Profile, auth
├── students/                 # Student profiles & dashboard
├── companies/              # Company dashboard
├── interviewers/           # Interviewer profiles & earnings views
├── jobs/                   # Job postings & applications
├── interviews/             # Availability, bookings, meetings
├── templates/              # Django HTML templates (legacy UI)
├── static/                 # Static assets
├── media/                  # Uploaded resumes and files
└── frontend/               # React SPA (Vite)
    ├── src/
    │   ├── api/            # Axios services
    │   ├── components/     # UI & layout
    │   ├── context/        # Auth state
    │   ├── pages/          # Route pages by role
    │   └── utils/          # Validation, formatting
    ├── .env.example
    └── package.json
```

---

## User Roles

| Role | Description | Main actions |
|------|-------------|--------------|
| **Student** | Job seeker | Browse jobs, apply, manage profile, book mock interviews, join meetings |
| **Company** | Employer | Post jobs, view applicants, shortlist or reject |
| **Interviewer** | Mock interview expert | Set availability, conduct sessions, submit feedback, view earnings |
| **Admin** | Platform admin | Django admin (`/admin/`) |

Authentication uses Django sessions. The React app sends the CSRF token on mutating requests after calling `GET /api/csrf/`.

---

## API Reference

Base URL: `http://127.0.0.1:8000/api/`

All responses are JSON unless noted. Authenticated routes require a valid session cookie.

### Auth

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/csrf/` | Set CSRF cookie |
| `POST` | `/auth/register/` | Create account |
| `POST` | `/auth/login/` | Sign in |
| `POST` | `/auth/logout/` | Sign out |
| `GET` | `/auth/me/` | Current user |

### Jobs

| Method | Endpoint | Role | Description |
|--------|----------|------|-------------|
| `GET` | `/jobs/` | Authenticated | List all jobs |
| `POST` | `/jobs/create/` | Company | Create job |
| `GET` | `/jobs/mine/` | Company | Company's jobs |
| `POST` | `/jobs/<id>/apply/` | Student | Apply to job |
| `GET` | `/jobs/<id>/applicants/` | Company | List applicants |
| `GET` | `/applications/mine/` | Student | My applications |
| `PATCH` | `/applications/<id>/status/` | Company | Update status |

### Interviews

| Method | Endpoint | Role | Description |
|--------|----------|------|-------------|
| `GET` / `POST` | `/interviews/slots/` | Interviewer | List / create availability |
| `DELETE` | `/interviews/slots/<id>/` | Interviewer | Delete slot |
| `GET` | `/interviews/slots/available/` | Student | Bookable slots |
| `POST` | `/interviews/book/` | Student | Book slot |
| `GET` | `/interviews/` | Authenticated | My interviews |
| `GET` | `/interviews/<id>/` | Participant | Meeting details |
| `POST` | `/interviews/<id>/feedback/` | Interviewer | Submit feedback |

### Profiles

| Method | Endpoint | Role | Description |
|--------|----------|------|-------------|
| `GET` / `PATCH` | `/students/profile/` | Student | Profile (multipart for resume) |
| `GET` / `PATCH` | `/interviewers/profile/` | Interviewer | Profile |
| `GET` | `/interviewers/earnings/` | Interviewer | Earnings summary |

---

## Environment Variables

### Frontend (`frontend/.env`)

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_API_BASE_URL` | `http://127.0.0.1:8000/api` | API base URL |
| `VITE_MEDIA_BASE_URL` | `http://127.0.0.1:8000` | Origin for resume/media links |

Copy from the example file:

```bash
cp frontend/.env.example frontend/.env
```

### Backend

CORS allowed origins for the Vite dev server are configured in `seekers/settings.py`:

- `http://localhost:5173`
- `http://127.0.0.1:5173`

---

## Development

### Backend commands

```bash
source venv/bin/activate
python manage.py runserver
python manage.py makemigrations
python manage.py migrate
python manage.py shell
```

### Frontend commands

```bash
cd frontend
npm run dev       # Development server
npm run build     # Production build → frontend/dist/
npm run preview   # Preview production build
npm run lint      # ESLint
```

### Data models (summary)

- **User** — `accounts.User` (extends `AbstractUser`) with `role`
- **Profile** — `accounts.Profile` (skills, resume)
- **StudentProfile** — `students.StudentProfile`
- **Job** / **JobApplication** — `jobs` app
- **InterviewerProfile** — `interviewers` app
- **InterviewerAvailability** / **InterviewBooking** — `interviews` app (includes `meeting_link` for Jitsi)

Application status values: `applied`, `shortlisted`, `rejected`.  
Interview status values: `booked`, `completed`, `cancelled`.

---

## Contributing

1. Fork the repository and create a feature branch.
2. Follow existing code style (PEP 8 for Python, ESLint for React).
3. Test backend migrations and frontend build before opening a pull request.
4. Describe changes clearly in the PR summary.

---

## Acknowledgments

Built with Django and React. Mock interview meetings use [Jitsi Meet](https://jitsi.org/) embeds.

---

<p align="center">
  <sub>Seekers — Connect talent with opportunity.</sub>
</p>
