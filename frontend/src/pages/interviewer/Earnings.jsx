import { IndianRupee, CheckCircle2 } from 'lucide-react';
import { profilesApi } from '../../api/profiles';
import { useAsyncData } from '../../context/AuthContext';
import PageHeader from '../../components/ui/PageHeader';
import Card from '../../components/ui/Card';
import Alert from '../../components/ui/Alert';
import Spinner from '../../components/ui/Spinner';
import EmptyState from '../../components/ui/EmptyState';
import { formatDateTime } from '../../utils/format';
import './Earnings.css';

export default function Earnings() {
  const { data, loading, error } = useAsyncData(async () => {
    const { data: res } = await profilesApi.earnings();
    return res;
  }, []);

  if (loading) return <Spinner />;
  if (error) return <Alert variant="error">{error}</Alert>;

  return (
    <>
      <PageHeader title="Earnings" subtitle="₹100 credited for each completed interview" />

      <div className="earnings-stats">
        <Card className="earnings-stat earnings-stat--primary">
          <div className="earnings-stat__icon">
            <IndianRupee size={22} />
          </div>
          <p className="earnings-stat__label">Total earnings</p>
          <p className="earnings-stat__value">₹{data?.total_earnings ?? 0}</p>
        </Card>
        <Card className="earnings-stat earnings-stat--secondary">
          <div className="earnings-stat__icon">
            <CheckCircle2 size={22} />
          </div>
          <p className="earnings-stat__label">Completed interviews</p>
          <p className="earnings-stat__value">{data?.total_interviews ?? 0}</p>
        </Card>
      </div>

      {(data?.completed_interviews || []).length === 0 ? (
        <EmptyState title="No completed interviews" description="Complete interviews to start earning." />
      ) : (
        <div className="earnings-list">
          {data.completed_interviews.map((interview) => (
            <Card key={interview.id} interactive>
              <div className="earnings-list__row">
                <div>
                  <p className="earnings-list__name">{interview.student_username}</p>
                  <p className="earnings-list__date">{formatDateTime(interview.scheduled_at)}</p>
                </div>
                <span className="earnings-list__amount">+₹100</span>
              </div>
            </Card>
          ))}
        </div>
      )}
    </>
  );
}
