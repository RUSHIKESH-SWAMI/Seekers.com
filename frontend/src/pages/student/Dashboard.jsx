import { Briefcase, CalendarPlus, FileText, User } from 'lucide-react';
import PageHeader from '../../components/ui/PageHeader';
import ActionCard from '../../components/ui/ActionCard';
import { useAuth } from '../../context/AuthContext';

export default function StudentDashboard() {
  const { user } = useAuth();

  return (
    <>
      <PageHeader
        title={`Hello, ${user?.username}`}
        subtitle="Manage your job search and interview preparation from one place."
      />
      <div className="grid-2">
        <ActionCard
          icon={Briefcase}
          title="Browse jobs"
          subtitle="Explore open positions and apply instantly."
          to="/student/jobs"
          buttonLabel="View jobs"
          accent="indigo"
        />
        <ActionCard
          icon={CalendarPlus}
          title="Book an interview"
          subtitle="Schedule a mock interview with an expert."
          to="/student/interviews/book"
          buttonLabel="Find slots"
          variant="secondary"
          accent="violet"
        />
        <ActionCard
          icon={FileText}
          title="My applications"
          subtitle="Track the status of your job applications."
          to="/student/applications"
          buttonLabel="View applications"
          variant="secondary"
          accent="emerald"
        />
        <ActionCard
          icon={User}
          title="Profile"
          subtitle="Update your skills, education, and resume."
          to="/student/profile"
          buttonLabel="Edit profile"
          variant="ghost"
          accent="amber"
        />
      </div>
    </>
  );
}
