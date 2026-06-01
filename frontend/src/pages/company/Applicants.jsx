import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { jobsApi } from '../../api/jobs';
import { getErrorMessage } from '../../api/client';
import { useAsyncData } from '../../context/AuthContext';
import PageHeader from '../../components/ui/PageHeader';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Alert from '../../components/ui/Alert';
import Spinner from '../../components/ui/Spinner';
import EmptyState from '../../components/ui/EmptyState';
import { formatDate } from '../../utils/format';

export default function Applicants() {
  const { jobId } = useParams();
  const { data, loading, error, reload } = useAsyncData(async () => {
    const { data: res } = await jobsApi.applicants(jobId);
    return res;
  }, [jobId]);

  const [updatingId, setUpdatingId] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleStatus = async (appId, status) => {
    setUpdatingId(appId);
    try {
      await jobsApi.updateStatus(appId, status);
      setMessage({ type: 'success', text: `Application ${status}.` });
      reload();
    } catch (err) {
      setMessage({ type: 'error', text: getErrorMessage(err) });
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) return <Spinner />;
  if (error) return <Alert variant="error">{error}</Alert>;

  const applications = data?.applications || [];

  return (
    <>
      <PageHeader
        title={`Applicants — ${data?.job?.title}`}
        subtitle={data?.job?.location}
        action={
          <Link to="/company/jobs">
            <Button variant="ghost">Back to jobs</Button>
          </Link>
        }
      />

      {message.text && <Alert variant={message.type}>{message.text}</Alert>}

      {applications.length === 0 ? (
        <EmptyState title="No applicants yet" description="Share your job listing to attract candidates." />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {applications.map((app) => (
            <Card key={app.id} interactive>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <h3 className="card-header__title">{app.student?.username}</h3>
                  <p className="card-header__subtitle">{app.student?.email}</p>
                  {app.student?.skills && (
                    <p style={{ fontSize: '0.8125rem', marginTop: '0.5rem' }}>Skills: {app.student.skills}</p>
                  )}
                  <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '0.5rem' }}>
                    Applied {formatDate(app.applied_at)}
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                  <Badge status={app.status} />
                  {app.status === 'applied' && (
                    <>
                      <Button
                        variant="primary"
                        size="sm"
                        loading={updatingId === app.id}
                        onClick={() => handleStatus(app.id, 'shortlisted')}
                      >
                        Shortlist
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleStatus(app.id, 'rejected')}
                      >
                        Reject
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </>
  );
}
