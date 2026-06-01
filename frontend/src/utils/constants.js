/** Application-wide constants */
export const ROLES = {
  STUDENT: 'student',
  COMPANY: 'company',
  INTERVIEWER: 'interviewer',
};

export const APPLICATION_STATUS = {
  APPLIED: 'applied',
  SHORTLISTED: 'shortlisted',
  REJECTED: 'rejected',
};

export const INTERVIEW_STATUS = {
  BOOKED: 'booked',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
};

/** Role-based dashboard paths after login */
export const DASHBOARD_BY_ROLE = {
  [ROLES.STUDENT]: '/student/dashboard',
  [ROLES.COMPANY]: '/company/dashboard',
  [ROLES.INTERVIEWER]: '/interviewer/dashboard',
};
