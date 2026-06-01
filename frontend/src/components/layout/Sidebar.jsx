import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Briefcase,
  FileText,
  Calendar,
  CalendarPlus,
  User,
  PlusCircle,
  List,
  Clock,
  Wallet,
  LogOut,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Logo from '../ui/Logo';
import './Sidebar.css';

const NAV_BY_ROLE = {
  student: [
    { to: '/student/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/student/jobs', label: 'Browse Jobs', icon: Briefcase },
    { to: '/student/applications', label: 'Applications', icon: FileText },
    { to: '/student/interviews/book', label: 'Book Interview', icon: CalendarPlus },
    { to: '/student/interviews', label: 'My Interviews', icon: Calendar },
    { to: '/student/profile', label: 'Profile', icon: User },
  ],
  company: [
    { to: '/company/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/company/jobs/new', label: 'Post Job', icon: PlusCircle },
    { to: '/company/jobs', label: 'My Jobs', icon: List },
  ],
  interviewer: [
    { to: '/interviewer/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/interviewer/availability', label: 'Availability', icon: Clock },
    { to: '/interviewer/interviews', label: 'Interviews', icon: Calendar },
    { to: '/interviewer/earnings', label: 'Earnings', icon: Wallet },
    { to: '/interviewer/profile', label: 'Profile', icon: User },
  ],
};

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const links = NAV_BY_ROLE[user?.role] || [];

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <aside className="sidebar">
      <div className="sidebar__brand">
        <NavLink to={links[0]?.to || '/'}>
          <Logo light />
        </NavLink>
      </div>

      <nav className="sidebar__nav">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `sidebar__link ${isActive ? 'sidebar__link--active' : ''}`
              }
            >
              <Icon size={18} strokeWidth={2} aria-hidden />
              {link.label}
            </NavLink>
          );
        })}
      </nav>

      <div className="sidebar__footer">
        <div className="sidebar__user">
          <div className="sidebar__avatar">{user?.username?.charAt(0).toUpperCase()}</div>
          <div>
            <span className="sidebar__username">{user?.username}</span>
            <span className="sidebar__role">{user?.role}</span>
          </div>
        </div>
        <button type="button" className="sidebar__logout" onClick={handleLogout}>
          <LogOut size={16} />
          Sign out
        </button>
      </div>
    </aside>
  );
}
