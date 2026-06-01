import { jobsApi } from '../../api/jobs';
import { useAsyncData } from '../../context/AuthContext';
import PageHeader from '../../components/ui/PageHeader';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Alert from '../../components/ui/Alert';
import Spinner from '../../components/ui/Spinner';
import EmptyState from '../../components/ui/EmptyState';
import { formatDate } from '../../utils/format';

export default function MyApplications() {
  const { data, loading, error } = useAsyncData(async () => {
    const { data: res } = await jobsApi.myApplications();
    return res.applications;
  }, []);

  if (loading) return <Spinner />;
  if (error) return <Alert variant="error">{error}</Alert>;

  const applications = data || [];

  return (
    <>
      <PageHeader title="My applications" subtitle="Track your job application status" />

      {applications.length === 0 ? (
        <EmptyState
          title="No applications yet"
          description="Browse jobs and apply to get started."
          actionLabel="Browse jobs"
          onAction={() => (window.location.href = '/student/jobs')}
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {applications.map((app) => (
            <Card key={app.id} interactive>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <h3 className="card-header__title">{app.job?.title}</h3>
                  <p className="card-header__subtitle">
                    {app.job?.company_username} · {app.job?.location}
                  </p>
                  <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', marginTop: '0.5rem' }}>
                    Applied {formatDate(app.applied_at)}
                  </p>
                </div>
                <Badge status={app.status} />
              </div>
            </Card>
          ))}
        </div>
      )}
    </>
  );
}
