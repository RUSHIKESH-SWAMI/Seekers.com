/**
 * Axios client configured for Django session + CSRF authentication.
 * Call initCsrf() once on app load before authenticated requests.
 */
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api';

const client = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

/** Read CSRF token from cookie set by Django */
function getCsrfToken() {
  const match = document.cookie.match(/csrftoken=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : null;
}

client.interceptors.request.use((config) => {
  const token = getCsrfToken();
  if (token) {
    config.headers['X-CSRFToken'] = token;
  }
  return config;
});

/** Fetch CSRF cookie from Django */
export async function initCsrf() {
  await client.get('/csrf/');
}

/** Extract user-friendly error message from API response */
export function getErrorMessage(error) {
  const data = error?.response?.data;
  if (!data) return error?.message || 'Something went wrong';
  if (data.error) return data.error;
  if (data.errors) {
    const first = Object.values(data.errors)[0];
    return Array.isArray(first) ? first[0] : first;
  }
  return 'Request failed';
}

export default client;
