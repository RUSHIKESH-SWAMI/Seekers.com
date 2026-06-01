import { Calendar, Clock, User, Wallet } from 'lucide-react';
import PageHeader from '../../components/ui/PageHeader';
import ActionCard from '../../components/ui/ActionCard';
import { useAuth } from '../../context/AuthContext';

export default function InterviewerDashboard() {
  const { user } = useAuth();

  return (
    <>
      <PageHeader
        title={`Hello, ${user?.username}`}
        subtitle="Manage your availability, interviews, and earnings."
      />
      <div className="grid-2">
        <ActionCard
          icon={Clock}
          title="Availability"
          subtitle="Set time slots for students to book."
          to="/interviewer/availability"
          buttonLabel="Manage slots"
          accent="indigo"
        />
        <ActionCard
          icon={Calendar}
          title="My interviews"
          subtitle="View upcoming sessions and add feedback."
          to="/interviewer/interviews"
          buttonLabel="View interviews"
          variant="secondary"
          accent="violet"
        />
        <ActionCard
          icon={Wallet}
          title="Earnings"
          subtitle="Track completed interviews and payouts."
          to="/interviewer/earnings"
          buttonLabel="View earnings"
          variant="secondary"
          accent="emerald"
        />
        <ActionCard
          icon={User}
          title="Profile"
          subtitle="Update your expertise and bio."
          to="/interviewer/profile"
          buttonLabel="Edit profile"
          variant="ghost"
          accent="amber"
        />
      </div>
    </>
  );
}
