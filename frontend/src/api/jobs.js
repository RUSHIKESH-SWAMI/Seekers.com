import client from './client';

export const jobsApi = {
  list: () => client.get('/jobs/'),
  create: (data) => client.post('/jobs/create/', data),
  mine: () => client.get('/jobs/mine/'),
  apply: (jobId) => client.post(`/jobs/${jobId}/apply/`),
  applicants: (jobId) => client.get(`/jobs/${jobId}/applicants/`),
  myApplications: () => client.get('/applications/mine/'),
  updateStatus: (appId, status) =>
    client.patch(`/applications/${appId}/status/`, { status }),
};
