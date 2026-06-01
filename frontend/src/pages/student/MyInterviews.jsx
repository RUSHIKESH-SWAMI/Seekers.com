import { Link } from 'react-router-dom';
import { interviewsApi } from '../../api/interviews';
import { useAsyncData } from '../../context/AuthContext';
import PageHeader from '../../components/ui/PageHeader';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Alert from '../../components/ui/Alert';
import Spinner from '../../components/ui/Spinner';
import EmptyState from '../../components/ui/EmptyState';
import { formatDateTime } from '../../utils/format';

export default function StudentMyInterviews() {
  const { data, loading, error } = useAsyncData(async () => {
    const { data: res } = await interviewsApi.mine();
    return res.interviews;
  }, []);

  if (loading) return <Spinner />;
  if (error) return <Alert variant="error">{error}</Alert>;

  const interviews = data || [];

  return (
    <>
      <PageHeader title="My interviews" subtitle="Upcoming and past interview sessions" />

      {interviews.length === 0 ? (
        <EmptyState
          title="No interviews yet"
          description="Book a mock interview to practice with an expert."
          actionLabel="Book interview"
          onAction={() => (window.location.href = '/student/interviews/book')}
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {interviews.map((interview) => (
            <Card key={interview.id}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <h3 className="card-header__title">With {interview.interviewer_username}</h3>
                  <p className="card-header__subtitle">{formatDateTime(interview.scheduled_at)}</p>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <Badge status={interview.status} />
                  {interview.status === 'booked' && (
                    <Link to={`/student/meeting/${interview.id}`}>
                      <Button variant="primary" size="sm">
                        Join meeting
                      </Button>
                    </Link>
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
