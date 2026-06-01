import client from './client';

export const profilesApi = {
  student: {
    get: () => client.get('/students/profile/'),
    update: (data) => client.patch('/students/profile/', data),
    updateWithFiles: (formData) =>
      client.patch('/students/profile/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      }),
  },
  interviewer: {
    get: () => client.get('/interviewers/profile/'),
    update: (data) => client.patch('/interviewers/profile/', data),
  },
  earnings: () => client.get('/interviewers/earnings/'),
};
