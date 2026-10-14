import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Menu, X, ArrowRight, User as UserIcon } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/#about' },
    { label: 'Our services', href: '/#services' },
    { label: 'Brainwell Camp', href: '/#brainwell-camp' },
    { label: 'Awareness', href: '/#awareness' },
    { label: 'Contact', href: '/#contact' },
  ];

  const isActive = (href: string) => {
    if (href === '/') return location.pathname === '/';
    return location.pathname + location.hash === href;
  };

  return (
    <header className="sticky top-0 z-40 bg-ivory/90 backdrop-blur-md border-b border-sand/60 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center space-x-3 group">
            <img
              src="/neurosage-logo.png"
              alt="NeuroSage Logo"
              className="h-10 w-auto object-contain transition-transform group-hover:scale-105"
            />
            <div className="flex flex-col">
              <span className="font-serif text-2xl tracking-tight text-deepBrown font-bold">
                NeuroSage
              </span>
              <span className="text-xs text-secondaryText tracking-wide -mt-1">
                Be kind to your mind
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className={`text-sm tracking-wide transition-colors ${
                  isActive(link.href)
                    ? 'text-terracotta font-medium'
                    : 'text-secondaryText hover:text-deepBrown'
                }`}
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Auth Action Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <Link
                to="/dashboard"
                className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-full text-sm font-medium bg-cream text-deepBrown border border-sand hover:bg-sand/40 transition-colors"
              >
                <UserIcon className="w-4 h-4 text-terracotta" />
                <span>Dashboard</span>
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-sm font-medium text-secondaryText hover:text-deepBrown px-3 py-2 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center space-x-1.5 px-5 py-2.5 rounded-full text-sm font-medium bg-terracotta text-white hover:bg-terracotta-dark shadow-sm transition-all"
                >
                  <span>Get started</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-secondaryText hover:text-deepBrown focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-cream/95 border-b border-sand px-4 pt-3 pb-6 space-y-3">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-base font-medium text-deepBrown hover:text-terracotta rounded-md"
            >
              {link.label}
            </a>
          ))}
          <div className="pt-4 border-t border-sand/60 flex flex-col space-y-2">
            {user ? (
              <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center px-4 py-2.5 rounded-full text-sm font-medium bg-terracotta text-white"
              >
                Open Dashboard
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center px-4 py-2 text-sm font-medium text-deepBrown bg-ivory rounded-full border border-sand"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center px-4 py-2 text-sm font-medium text-white bg-terracotta rounded-full"
                >
                  Get started
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
