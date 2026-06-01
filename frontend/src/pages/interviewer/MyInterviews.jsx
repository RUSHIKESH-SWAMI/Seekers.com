import { useState } from 'react';
import { Link } from 'react-router-dom';
import { interviewsApi } from '../../api/interviews';
import { getErrorMessage } from '../../api/client';
import { useAsyncData } from '../../context/AuthContext';
import PageHeader from '../../components/ui/PageHeader';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Textarea from '../../components/ui/Textarea';
import Alert from '../../components/ui/Alert';
import Spinner from '../../components/ui/Spinner';
import EmptyState from '../../components/ui/EmptyState';
import { formatDateTime } from '../../utils/format';

export default function InterviewerMyInterviews() {
  const { data, loading, error, reload } = useAsyncData(async () => {
    const { data: res } = await interviewsApi.mine();
    return res.interviews;
  }, []);

  const [feedbackId, setFeedbackId] = useState(null);
  const [feedbackText, setFeedbackText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleFeedback = async (id) => {
    if (!feedbackText.trim()) {
      setMessage({ type: 'error', text: 'Please enter feedback.' });
      return;
    }
    setSubmitting(true);
    try {
      await interviewsApi.feedback(id, feedbackText);
      setFeedbackId(null);
      setFeedbackText('');
      setMessage({ type: 'success', text: 'Feedback submitted.' });
      reload();
    } catch (err) {
      setMessage({ type: 'error', text: getErrorMessage(err) });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Spinner />;
  if (error) return <Alert variant="error">{error}</Alert>;

  const interviews = data || [];

  return (
    <>
      <PageHeader title="My interviews" subtitle="Conduct sessions and provide feedback" />
      {message.text && <Alert variant={message.type}>{message.text}</Alert>}

      {interviews.length === 0 ? (
        <EmptyState title="No interviews scheduled" description="Students will appear here once they book your slots." />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {interviews.map((interview) => (
            <Card key={interview.id}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <h3 className="card-header__title">With {interview.student_username}</h3>
                  <p className="card-header__subtitle">{formatDateTime(interview.scheduled_at)}</p>
                  {interview.feedback && (
                    <p style={{ fontSize: '0.875rem', marginTop: '0.75rem', color: 'var(--color-text-secondary)' }}>
                      Feedback: {interview.feedback}
                    </p>
                  )}
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <Badge status={interview.status} />
                  {interview.status === 'booked' && (
                    <Link to={`/interviewer/meeting/${interview.id}`}>
                      <Button variant="primary" size="sm">
                        Join meeting
                      </Button>
                    </Link>
                  )}
                  {interview.status === 'booked' && feedbackId !== interview.id && (
                    <Button variant="secondary" size="sm" onClick={() => setFeedbackId(interview.id)}>
                      Add feedback
                    </Button>
                  )}
                </div>
              </div>
              {feedbackId === interview.id && (
                <div style={{ marginTop: '1rem', borderTop: '1px solid var(--color-border)', paddingTop: '1rem' }}>
                  <Textarea
                    label="Feedback"
                    value={feedbackText}
                    onChange={(e) => setFeedbackText(e.target.value)}
                    rows={3}
                  />
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <Button variant="primary" size="sm" loading={submitting} onClick={() => handleFeedback(interview.id)}>
                      Submit
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => setFeedbackId(null)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </>
  );
}
