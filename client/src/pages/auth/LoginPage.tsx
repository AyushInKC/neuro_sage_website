import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { ArrowLeft, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as any)?.from?.pathname || '/dashboard';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login({ email, password });
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(err.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-ivory flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link
          to="/"
          className="inline-flex items-center space-x-1.5 text-xs text-secondaryText hover:text-deepBrown mb-6"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Home</span>
        </Link>

        <div className="flex items-center space-x-3 mb-2">
          <img src="/neurosage-logo.png" alt="NeuroSage" className="h-10 w-auto" />
          <span className="font-serif text-2xl font-bold text-deepBrown">NeuroSage</span>
        </div>
        <h2 className="font-serif text-3xl font-bold tracking-tight text-deepBrown">
          Welcome back
        </h2>
        <p className="mt-1 text-sm text-secondaryText">
          Take today one step at a time. Enter your credentials to continue.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-cream/60 py-8 px-6 shadow-sm border border-sand rounded-2xl sm:px-10 space-y-6">
          {error && (
            <div className="p-3.5 rounded-lg bg-rose-dusty/20 border border-errorDark/20 flex items-start space-x-2 text-xs text-errorDark">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-xs font-semibold text-deepBrown uppercase tracking-wider">
                Email address
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@institution.edu"
                className="mt-1.5 block w-full px-3.5 py-2.5 rounded-xl border border-sand bg-ivory text-sm text-deepBrown placeholder-secondaryText/60 focus:border-terracotta focus:ring-1 focus:ring-terracotta"
              />
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-xs font-semibold text-deepBrown uppercase tracking-wider"
                >
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-xs text-terracotta hover:underline font-medium"
                >
                  Forgot password?
                </Link>
              </div>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="mt-1.5 block w-full px-3.5 py-2.5 rounded-xl border border-sand bg-ivory text-sm text-deepBrown placeholder-secondaryText/60 focus:border-terracotta focus:ring-1 focus:ring-terracotta"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-xl text-sm font-semibold text-white bg-terracotta hover:bg-terracotta-dark focus:outline-none disabled:opacity-50 transition-all shadow-sm"
            >
              <span>{loading ? 'Verifying credentials...' : 'Sign in to Dashboard'}</span>
              {!loading && <ArrowRight className="w-4 h-4" />}
            </button>
          </form>

          <div className="pt-4 border-t border-sand/70 text-center text-xs text-secondaryText">
            <span>Don't have an account yet? </span>
            <Link to="/register" className="font-semibold text-terracotta hover:underline">
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
