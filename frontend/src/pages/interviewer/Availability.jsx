import { useState } from 'react';
import { interviewsApi } from '../../api/interviews';
import { getErrorMessage } from '../../api/client';
import { useAsyncData } from '../../context/AuthContext';
import PageHeader from '../../components/ui/PageHeader';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Alert from '../../components/ui/Alert';
import Spinner from '../../components/ui/Spinner';
import EmptyState from '../../components/ui/EmptyState';
import { formatDate, formatTime } from '../../utils/format';

export default function Availability() {
  const { data, loading, error, reload } = useAsyncData(async () => {
    const { data: res } = await interviewsApi.mySlots();
    return res.slots;
  }, []);

  const [form, setForm] = useState({ date: '', time: '' });
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!form.date || !form.time) {
      setMessage({ type: 'error', text: 'Date and time are required.' });
      return;
    }
    setSaving(true);
    try {
      await interviewsApi.createSlot(form);
      setForm({ date: '', time: '' });
      setMessage({ type: 'success', text: 'Slot added.' });
      reload();
    } catch (err) {
      setMessage({ type: 'error', text: getErrorMessage(err) });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (slotId) => {
    setDeletingId(slotId);
    try {
      await interviewsApi.deleteSlot(slotId);
      reload();
    } catch (err) {
      setMessage({ type: 'error', text: getErrorMessage(err) });
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) return <Spinner />;
  if (error) return <Alert variant="error">{error}</Alert>;

  const slots = data || [];

  return (
    <>
      <PageHeader title="Availability" subtitle="Add time slots for students to book interviews" />
      {message.text && <Alert variant={message.type}>{message.text}</Alert>}

      <Card style={{ marginBottom: '2rem' }}>
        <form onSubmit={handleAdd} style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <Input label="Date" name="date" type="date" value={form.date} onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))} className="" style={{ flex: 1, minWidth: 160, marginBottom: 0 }} />
          <Input label="Time" name="time" type="time" value={form.time} onChange={(e) => setForm((p) => ({ ...p, time: e.target.value }))} style={{ flex: 1, minWidth: 120, marginBottom: 0 }} />
          <Button type="submit" variant="primary" loading={saving}>
            Add slot
          </Button>
        </form>
      </Card>

      {slots.length === 0 ? (
        <EmptyState title="No slots yet" description="Add your first availability slot above." />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {slots.map((slot) => (
            <Card key={slot.id}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>
                  {formatDate(slot.date)} at {formatTime(slot.time)}
                  {slot.is_booked && (
                    <span style={{ marginLeft: '0.5rem', fontSize: '0.75rem', color: 'var(--color-accent)' }}>
                      (Booked)
                    </span>
                  )}
                </span>
                {!slot.is_booked && (
                  <Button variant="ghost" size="sm" loading={deletingId === slot.id} onClick={() => handleDelete(slot.id)}>
                    Delete
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
