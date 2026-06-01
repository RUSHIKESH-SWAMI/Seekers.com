import { Link } from 'react-router-dom';
import { Briefcase, Building2, GraduationCap, Mic2, Sparkles, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import Logo from '../components/ui/Logo';
import './Home.css';

const FEATURES = [
  {
    icon: GraduationCap,
    title: 'Students',
    description: 'Browse jobs, apply in one click, and book mock interviews with industry experts.',
    accent: 'indigo',
  },
  {
    icon: Building2,
    title: 'Companies',
    description: 'Post openings, review applicants, and shortlist the best candidates effortlessly.',
    accent: 'violet',
  },
  {
    icon: Mic2,
    title: 'Interviewers',
    description: 'Set your availability, conduct sessions, and earn from every completed interview.',
    accent: 'emerald',
  },
];

export default function Home() {
  const { user, dashboardPath } = useAuth();

  return (
    <div className="home">
      <div className="home__bg" aria-hidden />
      <header className="home__nav container">
        <Link to="/">
          <Logo />
        </Link>
        <div className="home__actions">
          {user ? (
            <Link to={dashboardPath}>
              <Button variant="primary">
                Go to Dashboard
                <ArrowRight size={16} />
              </Button>
            </Link>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost">Sign in</Button>
              </Link>
              <Link to="/register">
                <Button variant="primary">Get started</Button>
              </Link>
            </>
          )}
        </div>
      </header>

      <section className="home__hero container">
        <div className="home__badge">
          <Sparkles size={14} />
          <span>Hire smarter. Grow faster.</span>
        </div>
        <h1 className="home__title">
          Connect talent with
          <span className="text-gradient"> opportunity</span>
        </h1>
        <p className="home__subtitle">
          Seekers unifies job discovery, hiring, and mock interviews — one elegant platform for
          students, companies, and interviewers.
        </p>
        {!user && (
          <div className="home__cta">
            <Link to="/register?role=student" className="home__role-card home__role-card--student">
              <GraduationCap size={24} />
              <span className="home__role-label">Student</span>
              <span className="home__role-desc">Find jobs & practice</span>
            </Link>
            <Link to="/register?role=company" className="home__role-card home__role-card--company">
              <Building2 size={24} />
              <span className="home__role-label">Company</span>
              <span className="home__role-desc">Hire top talent</span>
            </Link>
            <Link to="/register?role=interviewer" className="home__role-card home__role-card--interviewer">
              <Mic2 size={24} />
              <span className="home__role-label">Interviewer</span>
              <span className="home__role-desc">Share expertise</span>
            </Link>
          </div>
        )}
      </section>

      <section className="home__stats container">
        <div className="home__stat">
          <Briefcase size={20} />
          <strong>Jobs</strong>
          <span>Post & apply instantly</span>
        </div>
        <div className="home__stat">
          <Mic2 size={20} />
          <strong>Interviews</strong>
          <span>Book mock sessions</span>
        </div>
        <div className="home__stat">
          <Sparkles size={20} />
          <strong>Track</strong>
          <span>Applications & earnings</span>
        </div>
      </section>

      <section className="home__features container">
        <h2 className="home__features-title">Built for everyone in the hiring journey</h2>
        <div className="home__features-grid">
          {FEATURES.map(({ icon: Icon, title, description, accent }) => (
            <article key={title} className={`home__feature home__feature--${accent}`}>
              <div className="home__feature-icon">
                <Icon size={22} strokeWidth={2} />
              </div>
              <h3>{title}</h3>
              <p>{description}</p>
            </article>
          ))}
        </div>
      </section>

      {!user && (
        <section className="home__cta-banner container">
          <div className="home__cta-banner-inner">
            <h2>Ready to get started?</h2>
            <p>Create your free account in under a minute.</p>
            <Link to="/register">
              <Button variant="primary" size="lg">
                Create account
                <ArrowRight size={18} />
              </Button>
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}
