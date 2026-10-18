import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  LayoutDashboard,
  Sparkles,
  Focus,
  Tent,
  Pill,
  Stethoscope,
  BookOpen,
  ClipboardList,
  User as UserIcon,
  ShieldCheck,
  LogOut,
  Menu,
  X,
  Heart,
} from 'lucide-react';

export const DashboardLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navItems = [
    { label: 'Overview', path: '/dashboard', icon: LayoutDashboard, end: true },
    { label: 'AI Wellness Companion', path: '/dashboard/companion', icon: Sparkles },
    { label: 'Body Doubling', path: '/dashboard/body-doubling', icon: Focus },
    { label: 'Mental Wellness Camps', path: '/dashboard/camps', icon: Tent },
    { label: 'My Registrations', path: '/dashboard/my-registrations', icon: ClipboardList },
    { label: 'Wellness Pharmacy', path: '/dashboard/pharmacy', icon: Pill, tag: 'Soon' },
    { label: 'Mental Wellness Doctors', path: '/dashboard/doctors', icon: Stethoscope, tag: 'Soon' },
    { label: 'Books for the Mind', path: '/dashboard/books', icon: BookOpen},
    { label: 'My Profile', path: '/dashboard/profile', icon: UserIcon },
  ];

  if (user?.role === 'admin') {
    navItems.push({ label: 'Admin Panel', path: '/admin', icon: ShieldCheck });
  }

  const sidebarContent = (
    <div className="flex flex-col h-full bg-cream border-r border-sand">
      {/* Brand Header */}
      <div className="p-6 border-b border-sand/70">
        <Link to="/" className="flex items-center space-x-3 group">
          <img
            src="/neurosage-logo.png"
            alt="NeuroSage Logo"
            className="h-9 w-auto object-contain transition-transform group-hover:scale-105"
          />
          <div>
            <h1 className="font-serif text-xl font-bold text-deepBrown tracking-tight leading-none">
              NeuroSage
            </h1>
            <p className="text-[11px] text-secondaryText tracking-wide mt-1">Be kind to your mind</p>
          </div>
        </Link>
      </div>

      {/* Navigation links */}
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              onClick={() => setMobileSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-sand/60 text-terracotta shadow-sm font-semibold'
                    : 'text-secondaryText hover:text-deepBrown hover:bg-sand/30'
                }`
              }
            >
              <div className="flex items-center space-x-3">
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span className="truncate">{item.label}</span>
              </div>
              {item.tag && (
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-sand/70 text-secondaryText">
                  {item.tag}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* User info & Logout */}
      <div className="p-4 border-t border-sand/70 bg-ivory/50">
        <div className="flex items-center justify-between mb-3 px-1">
          <div className="truncate">
            <p className="text-xs font-semibold text-deepBrown truncate">{user?.name}</p>
            <p className="text-[11px] text-secondaryText truncate">{user?.email}</p>
          </div>
          {user?.role === 'admin' && (
            <span className="text-[10px] bg-terracotta/15 text-terracotta px-1.5 py-0.5 rounded font-medium">
              Admin
            </span>
          )}
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center space-x-2 px-3 py-2 text-xs font-medium text-secondaryText hover:text-errorDark hover:bg-rose-dusty/20 rounded-md transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign out</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-ivory flex">
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden md:flex md:w-64 md:flex-col fixed inset-y-0 z-30">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div
            className="fixed inset-0 bg-deepBrown/40 backdrop-blur-sm"
            onClick={() => setMobileSidebarOpen(false)}
          />
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-cream">
            <div className="absolute top-0 right-0 -mr-12 pt-4">
              <button
                onClick={() => setMobileSidebarOpen(false)}
                className="p-1 rounded-full text-white hover:text-sand focus:outline-none"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            {sidebarContent}
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col md:pl-64 min-w-0">
        {/* Mobile top bar */}
        <header className="md:hidden sticky top-0 z-20 bg-cream/90 backdrop-blur-md border-b border-sand px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => setMobileSidebarOpen(true)}
            className="p-2 text-secondaryText hover:text-deepBrown focus:outline-none"
          >
            <Menu className="w-6 h-6" />
          </button>
          <div className="flex items-center space-x-2">
            <img src="/neurosage-logo.png" alt="NeuroSage" className="h-7 w-auto" />
            <span className="font-serif font-bold text-deepBrown">NeuroSage</span>
          </div>
          <div className="w-8" />
        </header>

        {/* Page Container */}
        <main className="flex-1 p-4 sm:p-8 max-w-6xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
