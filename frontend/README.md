# Seekers Frontend

Modern React SPA for the Seekers hiring and interview platform.

## Stack

- React 19 (functional components + hooks)
- Vite
- React Router
- Axios (session + CSRF auth against Django API)

## Setup

```bash
cd frontend
npm install
cp .env.example .env   # adjust API URL if needed
npm run dev
```

Runs at [http://localhost:5173](http://localhost:5173).

## Backend

Start the Django server (from project root):

```bash
source venv/bin/activate
python manage.py runserver
```

API base: `http://127.0.0.1:8000/api/`

## Environment

| Variable | Description |
|----------|-------------|
| `VITE_API_BASE_URL` | Django API prefix (default `http://127.0.0.1:8000/api`) |
| `VITE_MEDIA_BASE_URL` | Django origin for resume/media URLs |

## Scripts

- `npm run dev` — development server
- `npm run build` — production build
- `npm run preview` — preview production build
