import client from './client';

export const interviewsApi = {
  mySlots: () => client.get('/interviews/slots/'),
  createSlot: (data) => client.post('/interviews/slots/', data),
  deleteSlot: (slotId) => client.delete(`/interviews/slots/${slotId}/`),
  availableSlots: () => client.get('/interviews/slots/available/'),
  book: (slotId) => client.post('/interviews/book/', { slot_id: slotId }),
  mine: () => client.get('/interviews/'),
  detail: (id) => client.get(`/interviews/${id}/`),
  feedback: (id, feedback) => client.post(`/interviews/${id}/feedback/`, { feedback }),
};
