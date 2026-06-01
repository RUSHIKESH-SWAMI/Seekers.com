import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getErrorMessage } from '../../api/client';
import { validateRegister, hasErrors } from '../../utils/validation';
import Alert from '../../components/ui/Alert';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Card from '../../components/ui/Card';
import Logo from '../../components/ui/Logo';
import './Auth.css';

const ROLE_OPTIONS = [
  { value: 'student', label: 'Student' },
  { value: 'company', label: 'Company' },
  { value: 'interviewer', label: 'Interviewer' },
];

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialRole = searchParams.get('role') || 'student';

  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    password_confirm: '',
    role: initialRole,
  });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [e.target.name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validation = validateRegister(form);
    if (hasErrors(validation)) {
      setErrors(validation);
      return;
    }

    setLoading(true);
    setApiError('');
    try {
      await register(form);
      setSuccess('Account created! Please sign in.');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      const data = err?.response?.data;
      if (data?.errors) setErrors(data.errors);
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
          <h2>Join thousands on Seekers</h2>
          <p>Create your account and start connecting with opportunities today.</p>
          <ul className="auth-page__visual-list">
            <li>Free to get started</li>
            <li>Role-based dashboards</li>
            <li>Secure & simple onboarding</li>
          </ul>
        </div>
      </div>

      <div className="auth-page__form-wrap">
        <Card className="auth-card">
          <h1 className="auth-card__title">Create account</h1>
          <p className="auth-card__subtitle">Choose your role and set up your profile</p>

          {apiError && <Alert variant="error">{apiError}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}

          <form onSubmit={handleSubmit} noValidate>
            <Select
              label="I am a"
              name="role"
              value={form.role}
              onChange={handleChange}
              options={ROLE_OPTIONS}
              error={errors.role}
            />
            <Input
              label="Username"
              name="username"
              value={form.username}
              onChange={handleChange}
              error={errors.username}
            />
            <Input
              label="Email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              error={errors.email}
            />
            <Input
              label="Password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              error={errors.password}
              hint="At least 8 characters"
            />
            <Input
              label="Confirm password"
              name="password_confirm"
              type="password"
              value={form.password_confirm}
              onChange={handleChange}
              error={errors.password_confirm}
            />
            <Button type="submit" variant="primary" loading={loading} className="auth-card__submit">
              Create account
            </Button>
          </form>

          <p className="auth-card__footer">
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </Card>
      </div>
    </div>
  );
}
