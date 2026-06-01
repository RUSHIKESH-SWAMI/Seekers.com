import { List, PlusCircle } from 'lucide-react';
import PageHeader from '../../components/ui/PageHeader';
import ActionCard from '../../components/ui/ActionCard';
import { useAuth } from '../../context/AuthContext';

export default function CompanyDashboard() {
  const { user } = useAuth();

  return (
    <>
      <PageHeader
        title={`Welcome, ${user?.username}`}
        subtitle="Post jobs and manage applicants from your dashboard."
      />
      <div className="grid-2">
        <ActionCard
          icon={PlusCircle}
          title="Post a job"
          subtitle="Create a new opening for students to apply."
          to="/company/jobs/new"
          buttonLabel="Create job"
          accent="indigo"
        />
        <ActionCard
          icon={List}
          title="My jobs"
          subtitle="View listings and review applicants."
          to="/company/jobs"
          buttonLabel="View jobs"
          variant="secondary"
          accent="violet"
        />
      </div>
    </>
  );
}
