import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import './AppLayout.css';

export default function AppLayout() {
  return (
    <div className="app-layout app-shell-bg">
      <Sidebar />
      <main className="app-layout__main">
        <div className="container page">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
