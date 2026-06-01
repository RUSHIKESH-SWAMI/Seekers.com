import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jobsApi } from '../../api/jobs';
import { getErrorMessage } from '../../api/client';
import { validateJob, hasErrors } from '../../utils/validation';
import PageHeader from '../../components/ui/PageHeader';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Textarea from '../../components/ui/Textarea';
import Button from '../../components/ui/Button';
import Alert from '../../components/ui/Alert';

export default function CreateJob() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '',
    description: '',
    skills_required: '',
    location: '',
  });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [e.target.name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validation = validateJob(form);
    if (hasErrors(validation)) {
      setErrors(validation);
      return;
    }

    setLoading(true);
    setApiError('');
    try {
      await jobsApi.create(form);
      navigate('/company/jobs');
    } catch (err) {
      const data = err?.response?.data;
      if (data?.errors) setErrors(data.errors);
      setApiError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageHeader title="Post a job" subtitle="Fill in the details for your new opening" />
      {apiError && <Alert variant="error">{apiError}</Alert>}

      <Card>
        <form onSubmit={handleSubmit}>
          <Input label="Job title" name="title" value={form.title} onChange={handleChange} error={errors.title} />
          <Textarea label="Description" name="description" value={form.description} onChange={handleChange} error={errors.description} rows={6} />
          <Input label="Required skills" name="skills_required" value={form.skills_required} onChange={handleChange} error={errors.skills_required} hint="Comma-separated" />
          <Input label="Location" name="location" value={form.location} onChange={handleChange} error={errors.location} />
          <Button type="submit" variant="primary" loading={loading}>
            Publish job
          </Button>
        </form>
      </Card>
    </>
  );
}
