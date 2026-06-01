import { useParams } from 'react-router-dom';
import { interviewsApi } from '../../api/interviews';
import { useAsyncData } from '../../context/AuthContext';
import PageHeader from '../../components/ui/PageHeader';
import Card from '../../components/ui/Card';
import Alert from '../../components/ui/Alert';
import Spinner from '../../components/ui/Spinner';
import { formatDateTime } from '../../utils/format';
import './MeetingRoom.css';

export default function MeetingRoom() {
  const { id } = useParams();
  const { data, loading, error } = useAsyncData(async () => {
    const { data: res } = await interviewsApi.detail(id);
    return res.interview;
  }, [id]);

  if (loading) return <Spinner />;
  if (error) return <Alert variant="error">{error}</Alert>;

  const interview = data;
  const roomName = `seekers-interview-${interview.id}`;
  const jitsiUrl = `https://meet.jit.si/${roomName}`;

  return (
    <>
      <PageHeader
        title="Meeting room"
        subtitle={`Interview with ${interview.interviewer_username} · ${formatDateTime(interview.scheduled_at)}`}
      />
      <Card padding={false} className="meeting-card">
        <iframe
          title="Interview meeting"
          src={jitsiUrl}
          className="meeting-iframe"
          allow="camera; microphone; fullscreen; display-capture"
        />
      </Card>
      {interview.meeting_link && (
        <p style={{ marginTop: '1rem', fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
          Alternate link:{' '}
          <a href={interview.meeting_link} target="_blank" rel="noreferrer">
            {interview.meeting_link}
          </a>
        </p>
      )}
    </>
  );
}
