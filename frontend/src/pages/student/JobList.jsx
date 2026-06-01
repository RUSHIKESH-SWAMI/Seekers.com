import { useState } from 'react';
import { jobsApi } from '../../api/jobs';
import { getErrorMessage } from '../../api/client';
import { useAsyncData } from '../../context/AuthContext';
import PageHeader from '../../components/ui/PageHeader';
import Card, { CardHeader } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Alert from '../../components/ui/Alert';
import Spinner from '../../components/ui/Spinner';
import EmptyState from '../../components/ui/EmptyState';
import { formatDate } from '../../utils/format';

export default function JobList() {
  const { data, loading, error, reload } = useAsyncData(async () => {
    const { data: res } = await jobsApi.list();
    return res;
  }, []);

  const [applyingId, setApplyingId] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleApply = async (jobId) => {
    setApplyingId(jobId);
    setMessage({ type: '', text: '' });
    try {
      await jobsApi.apply(jobId);
      setMessage({ type: 'success', text: 'Application submitted successfully.' });
      reload();
    } catch (err) {
      setMessage({ type: 'error', text: getErrorMessage(err) });
    } finally {
      setApplyingId(null);
    }
  };

  if (loading) return <Spinner />;
  if (error) return <Alert variant="error">{error}</Alert>;

  const jobs = data?.jobs || [];
  const appliedIds = new Set(data?.applied_job_ids || []);

  return (
    <>
      <PageHeader title="Browse jobs" subtitle="Find your next opportunity" />

      {message.text && <Alert variant={message.type}>{message.text}</Alert>}

      {jobs.length === 0 ? (
        <EmptyState title="No jobs yet" description="Check back later for new openings." />
      ) : (
        <div className="grid-2">
          {jobs.map((job) => (
            <Card key={job.id} interactive>
              <CardHeader
                title={job.title}
                subtitle={`${job.company_username} · ${job.location}`}
              />
              <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', marginBottom: '1rem' }}>
                {job.description.slice(0, 160)}
                {job.description.length > 160 ? '…' : ''}
              </p>
              <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', marginBottom: '1rem' }}>
                Skills: {job.skills_required}
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                  Posted {formatDate(job.created_at)}
                </span>
                {appliedIds.has(job.id) ? (
                  <Badge status="applied">Applied</Badge>
                ) : (
                  <Button
                    variant="primary"
                    size="sm"
                    loading={applyingId === job.id}
                    onClick={() => handleApply(job.id)}
                  >
                    Apply
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </>
  );
}
