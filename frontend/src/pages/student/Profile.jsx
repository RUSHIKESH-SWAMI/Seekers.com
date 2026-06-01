import { useEffect, useState } from 'react';
import { profilesApi } from '../../api/profiles';
import { getErrorMessage } from '../../api/client';
import PageHeader from '../../components/ui/PageHeader';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Textarea from '../../components/ui/Textarea';
import Button from '../../components/ui/Button';
import Alert from '../../components/ui/Alert';
import Spinner from '../../components/ui/Spinner';

export default function StudentProfile() {
  const [form, setForm] = useState({
    full_name: '',
    education: '',
    skills: '',
    account_skills: '',
  });
  const [resume, setResume] = useState(null);
  const [accountResume, setAccountResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    profilesApi.student
      .get()
      .then(({ data }) => {
        const p = data.profile;
        setForm({
          full_name: p.full_name || '',
          education: p.education || '',
          skills: p.skills || '',
          account_skills: p.account_skills || '',
        });
      })
      .catch((err) => setMessage({ type: 'error', text: getErrorMessage(err) }))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });

    const formData = new FormData();
    Object.entries(form).forEach(([k, v]) => formData.append(k, v));
    if (resume) formData.append('resume', resume);
    if (accountResume) formData.append('account_resume', accountResume);

    try {
      await profilesApi.student.updateWithFiles(formData);
      setMessage({ type: 'success', text: 'Profile updated successfully.' });
    } catch (err) {
      const data = err?.response?.data;
      setMessage({ type: 'error', text: getErrorMessage(err) });
      if (data?.errors) {
        /* field errors shown via future enhancement */
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Spinner />;

  return (
    <>
      <PageHeader title="Profile" subtitle="Keep your profile up to date for recruiters" />
      {message.text && <Alert variant={message.type}>{message.text}</Alert>}

      <Card>
        <form onSubmit={handleSubmit}>
          <Input label="Full name" name="full_name" value={form.full_name} onChange={handleChange} required />
          <Input label="Education" name="education" value={form.education} onChange={handleChange} />
          <Textarea label="Skills" name="skills" value={form.skills} onChange={handleChange} hint="Comma-separated" />
          <Textarea label="Account skills" name="account_skills" value={form.account_skills} onChange={handleChange} />
          <div className="form-field">
            <label className="form-field__label">Resume (student profile)</label>
            <input type="file" accept=".pdf,.doc,.docx,.txt" onChange={(e) => setResume(e.target.files[0])} />
          </div>
          <div className="form-field">
            <label className="form-field__label">Resume (account)</label>
            <input type="file" accept=".pdf,.doc,.docx,.txt" onChange={(e) => setAccountResume(e.target.files[0])} />
          </div>
          <Button type="submit" variant="primary" loading={saving}>
            Save changes
          </Button>
        </form>
      </Card>
    </>
  );
}
