import { Link } from 'react-router-dom';
import { jobsApi } from '../../api/jobs';
import { useAsyncData } from '../../context/AuthContext';
import PageHeader from '../../components/ui/PageHeader';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Alert from '../../components/ui/Alert';
import Spinner from '../../components/ui/Spinner';
import EmptyState from '../../components/ui/EmptyState';
import { formatDate } from '../../utils/format';

export default function MyJobs() {
  const { data, loading, error } = useAsyncData(async () => {
    const { data: res } = await jobsApi.mine();
    return res.jobs;
  }, []);

  if (loading) return <Spinner />;
  if (error) return <Alert variant="error">{error}</Alert>;

  const jobs = data || [];

  return (
    <>
      <PageHeader
        title="My jobs"
        subtitle="Manage your job postings"
        action={
          <Link to="/company/jobs/new">
            <Button variant="primary">Post job</Button>
          </Link>
        }
      />

      {jobs.length === 0 ? (
        <EmptyState
          title="No jobs posted"
          description="Create your first job listing to start receiving applications."
          actionLabel="Post a job"
          onAction={() => (window.location.href = '/company/jobs/new')}
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {jobs.map((job) => (
            <Card key={job.id} interactive>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <h3 className="card-header__title">{job.title}</h3>
                  <p className="card-header__subtitle">{job.location} · Posted {formatDate(job.created_at)}</p>
                </div>
                <Link to={`/company/jobs/${job.id}/applicants`}>
                  <Button variant="secondary" size="sm">
                    View applicants
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      )}
    </>
  );
}
