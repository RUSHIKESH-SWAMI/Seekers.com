import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import AppLayout from './components/layout/AppLayout';

import Home from './pages/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

import StudentDashboard from './pages/student/Dashboard';
import StudentJobList from './pages/student/JobList';
import StudentMyApplications from './pages/student/MyApplications';
import StudentProfile from './pages/student/Profile';
import BookInterview from './pages/student/BookInterview';
import StudentMyInterviews from './pages/student/MyInterviews';
import MeetingRoom from './pages/student/MeetingRoom';

import CompanyDashboard from './pages/company/Dashboard';
import CreateJob from './pages/company/CreateJob';
import MyJobs from './pages/company/MyJobs';
import Applicants from './pages/company/Applicants';

import InterviewerDashboard from './pages/interviewer/Dashboard';
import Availability from './pages/interviewer/Availability';
import InterviewerMyInterviews from './pages/interviewer/MyInterviews';
import Earnings from './pages/interviewer/Earnings';
import InterviewerProfile from './pages/interviewer/Profile';
import InterviewerMeetingRoom from './pages/interviewer/MeetingRoom';

import { ROLES } from './utils/constants';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Student routes */}
          <Route element={<ProtectedRoute roles={[ROLES.STUDENT]} />}>
            <Route element={<AppLayout />}>
              <Route path="/student/dashboard" element={<StudentDashboard />} />
              <Route path="/student/jobs" element={<StudentJobList />} />
              <Route path="/student/applications" element={<StudentMyApplications />} />
              <Route path="/student/profile" element={<StudentProfile />} />
              <Route path="/student/interviews/book" element={<BookInterview />} />
              <Route path="/student/interviews" element={<StudentMyInterviews />} />
              <Route path="/student/meeting/:id" element={<MeetingRoom />} />
            </Route>
          </Route>

          {/* Company routes */}
          <Route element={<ProtectedRoute roles={[ROLES.COMPANY]} />}>
            <Route element={<AppLayout />}>
              <Route path="/company/dashboard" element={<CompanyDashboard />} />
              <Route path="/company/jobs/new" element={<CreateJob />} />
              <Route path="/company/jobs" element={<MyJobs />} />
              <Route path="/company/jobs/:jobId/applicants" element={<Applicants />} />
            </Route>
          </Route>

          {/* Interviewer routes */}
          <Route element={<ProtectedRoute roles={[ROLES.INTERVIEWER]} />}>
            <Route element={<AppLayout />}>
              <Route path="/interviewer/dashboard" element={<InterviewerDashboard />} />
              <Route path="/interviewer/availability" element={<Availability />} />
              <Route path="/interviewer/interviews" element={<InterviewerMyInterviews />} />
              <Route path="/interviewer/earnings" element={<Earnings />} />
              <Route path="/interviewer/profile" element={<InterviewerProfile />} />
              <Route path="/interviewer/meeting/:id" element={<InterviewerMeetingRoom />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
