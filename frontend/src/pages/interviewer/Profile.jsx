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

export default function InterviewerProfile() {
  const [form, setForm] = useState({ full_name: '', experience: 0, expertise: '', bio: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    profilesApi.interviewer
      .get()
      .then(({ data }) => setForm(data.profile))
      .catch((err) => setMessage({ type: 'error', text: getErrorMessage(err) }))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: name === 'experience' ? Number(value) : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await profilesApi.interviewer.update(form);
      setMessage({ type: 'success', text: 'Profile updated successfully.' });
    } catch (err) {
      setMessage({ type: 'error', text: getErrorMessage(err) });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Spinner />;

  return (
    <>
      <PageHeader title="Profile" subtitle="Tell students about your experience and expertise" />
      {message.text && <Alert variant={message.type}>{message.text}</Alert>}

      <Card>
        <form onSubmit={handleSubmit}>
          <Input label="Full name" name="full_name" value={form.full_name} onChange={handleChange} required />
          <Input label="Years of experience" name="experience" type="number" min="0" value={form.experience} onChange={handleChange} />
          <Input label="Expertise" name="expertise" value={form.expertise} onChange={handleChange} />
          <Textarea label="Bio" name="bio" value={form.bio} onChange={handleChange} rows={5} />
          <Button type="submit" variant="primary" loading={saving}>
            Save changes
          </Button>
        </form>
      </Card>
    </>
  );
}
