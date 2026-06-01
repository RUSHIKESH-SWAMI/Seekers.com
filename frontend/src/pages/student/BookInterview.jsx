import { useState } from 'react';
import { interviewsApi } from '../../api/interviews';
import { getErrorMessage } from '../../api/client';
import { useAsyncData } from '../../context/AuthContext';
import PageHeader from '../../components/ui/PageHeader';
import Card, { CardHeader } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Alert from '../../components/ui/Alert';
import Spinner from '../../components/ui/Spinner';
import EmptyState from '../../components/ui/EmptyState';
import { formatDate, formatTime } from '../../utils/format';

export default function BookInterview() {
  const { data, loading, error, reload } = useAsyncData(async () => {
    const { data: res } = await interviewsApi.availableSlots();
    return res.slots;
  }, []);

  const [bookingId, setBookingId] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleBook = async (slotId) => {
    setBookingId(slotId);
    try {
      await interviewsApi.book(slotId);
      setMessage({ type: 'success', text: 'Interview booked! View it under My Interviews.' });
      reload();
    } catch (err) {
      setMessage({ type: 'error', text: getErrorMessage(err) });
    } finally {
      setBookingId(null);
    }
  };

  if (loading) return <Spinner />;
  if (error) return <Alert variant="error">{error}</Alert>;

  const slots = data || [];

  return (
    <>
      <PageHeader title="Book interview" subtitle="Choose an available slot with an interviewer" />
      {message.text && <Alert variant={message.type}>{message.text}</Alert>}

      {slots.length === 0 ? (
        <EmptyState title="No slots available" description="Interviewers haven't posted availability yet." />
      ) : (
        <div className="grid-2">
          {slots.map((slot) => (
            <Card key={slot.id} interactive>
              <CardHeader
                title={slot.interviewer?.full_name || slot.interviewer?.username}
                subtitle={slot.interviewer?.expertise}
              />
              <p style={{ fontSize: '0.875rem', marginBottom: '1rem' }}>
                {formatDate(slot.date)} at {formatTime(slot.time)}
              </p>
              <Button
                variant="primary"
                size="sm"
                loading={bookingId === slot.id}
                onClick={() => handleBook(slot.id)}
              >
                Book slot
              </Button>
            </Card>
          ))}
        </div>
      )}
    </>
  );
}
