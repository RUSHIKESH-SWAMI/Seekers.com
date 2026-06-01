import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getErrorMessage } from '../../api/client';
import { validateLogin, hasErrors } from '../../utils/validation';
import Alert from '../../components/ui/Alert';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Card from '../../components/ui/Card';
import Logo from '../../components/ui/Logo';
import './Auth.css';

export default function Login() {
  const { login, dashboardPath } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '' });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [e.target.name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validation = validateLogin(form);
    if (hasErrors(validation)) {
      setErrors(validation);
      return;
    }

    setLoading(true);
    setApiError('');
    try {
      await login(form);
      navigate(dashboardPath);
    } catch (err) {
      setApiError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-page__visual">
        <div className="auth-page__visual-content">
          <Logo light />
          <h2>Welcome back to Seekers</h2>
          <p>Sign in to continue your job search, hiring, or interview sessions.</p>
          <ul className="auth-page__visual-list">
            <li>Track applications in real time</li>
            <li>Book mock interviews with experts</li>
            <li>Manage jobs and candidates</li>
          </ul>
        </div>
      </div>

      <div className="auth-page__form-wrap">
        <Card className="auth-card">
          <h1 className="auth-card__title">Sign in</h1>
          <p className="auth-card__subtitle">Enter your credentials to access your account</p>

          {apiError && <Alert variant="error">{apiError}</Alert>}

          <form onSubmit={handleSubmit} noValidate>
            <Input
              label="Username"
              name="username"
              value={form.username}
              onChange={handleChange}
              error={errors.username}
              autoComplete="username"
            />
            <Input
              label="Password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              error={errors.password}
              autoComplete="current-password"
            />
            <Button type="submit" variant="primary" loading={loading} className="auth-card__submit">
              Sign in
            </Button>
          </form>

          <p className="auth-card__footer">
            Don&apos;t have an account? <Link to="/register">Create one</Link>
          </p>
        </Card>
      </div>
    </div>
  );
}
