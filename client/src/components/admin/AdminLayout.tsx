import React from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { BookOpen, CalendarDays, LogOut, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export const AdminLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login', { replace: true });
  };

  return (
    <div className="min-h-screen bg-ivory flex">
      <aside className="w-64 fixed inset-y-0 flex flex-col bg-cream border-r border-sand">
        <div className="p-6 border-b border-sand/70">
          <Link to="/admin" className="flex items-center gap-3">
            <img src="/neurosage-logo.png" alt="NeuroSage" className="h-9 w-auto" />
            <div>
              <h1 className="font-serif text-xl font-bold text-deepBrown">NeuroSage</h1>
              <p className="text-[11px] text-secondaryText">Administrator</p>
            </div>
          </Link>
        </div>
        <nav className="flex-1 p-4">
          <NavLink
            to="/admin"
            end
            className={({ isActive }) =>
              `flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium ${
                isActive ? 'bg-sand/60 text-terracotta font-semibold' : 'text-secondaryText hover:bg-sand/30'
              }`
            }
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Admin Panel</span>
          </NavLink>
          <NavLink
            to="/admin/library"
            className={({ isActive }) =>
              `mt-1 flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium ${
                isActive ? 'bg-sand/60 text-terracotta font-semibold' : 'text-secondaryText hover:bg-sand/30'
              }`
            }
          >
            <BookOpen className="w-4 h-4" />
            <span>Library for the Mind</span>
          </NavLink>
          <NavLink
            to="/admin/events"
            className={({ isActive }) =>
              `mt-1 flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium ${
                isActive ? 'bg-sand/60 text-terracotta font-semibold' : 'text-secondaryText hover:bg-sand/30'
              }`
            }
          >
            <CalendarDays className="w-4 h-4" />
            <span>Events</span>
          </NavLink>
        </nav>
        <div className="p-4 border-t border-sand/70">
          <p className="text-xs font-semibold text-deepBrown truncate">{user?.name}</p>
          <p className="text-[11px] text-secondaryText truncate mb-3">{user?.email}</p>
          <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium text-secondaryText hover:text-errorDark rounded-md">
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign out</span>
          </button>
        </div>
      </aside>
      <main className="flex-1 ml-64 p-4 sm:p-8 max-w-6xl w-full">{<Outlet />}</main>
    </div>
  );
};
