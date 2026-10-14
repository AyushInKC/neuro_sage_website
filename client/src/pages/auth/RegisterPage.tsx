import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { ArrowLeft, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [consentNonEssential, setConsentNonEssential] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (!agreeTerms) {
      setError('You must agree to the Terms of Service and Privacy Policy.');
      return;
    }

    setLoading(true);

    try {
      await register({
        name,
        email,
        password,
        confirmPassword,
        agreeTerms,
        consentNonEssential,
      });
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please check your information.');
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
          Begin your journey
        </h2>
        <p className="mt-1 text-sm text-secondaryText">
          Create a private account to access student camps, focus tools, and reflection.
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

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="name" className="block text-xs font-semibold text-deepBrown uppercase tracking-wider">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Ayush Singh"
                className="mt-1.5 block w-full px-3.5 py-2.5 rounded-xl border border-sand bg-ivory text-sm text-deepBrown placeholder-secondaryText/60 focus:border-terracotta focus:ring-1 focus:ring-terracotta"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-xs font-semibold text-deepBrown uppercase tracking-wider">
                Email address
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@institution.edu"
                className="mt-1.5 block w-full px-3.5 py-2.5 rounded-xl border border-sand bg-ivory text-sm text-deepBrown placeholder-secondaryText/60 focus:border-terracotta focus:ring-1 focus:ring-terracotta"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-semibold text-deepBrown uppercase tracking-wider">
                Password (minimum 8 characters)
              </label>
              <input
                id="password"
                type="password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="mt-1.5 block w-full px-3.5 py-2.5 rounded-xl border border-sand bg-ivory text-sm text-deepBrown placeholder-secondaryText/60 focus:border-terracotta focus:ring-1 focus:ring-terracotta"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-xs font-semibold text-deepBrown uppercase tracking-wider">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                required
                minLength={8}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="mt-1.5 block w-full px-3.5 py-2.5 rounded-xl border border-sand bg-ivory text-sm text-deepBrown placeholder-secondaryText/60 focus:border-terracotta focus:ring-1 focus:ring-terracotta"
              />
            </div>

            {/* Terms of Service & Privacy Policy Checkbox */}
            <div className="pt-2">
              <label className="flex items-start space-x-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  required
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="mt-0.5 rounded text-terracotta focus:ring-terracotta border-sand"
                />
                <span className="text-xs text-secondaryText leading-relaxed">
                  I agree to the <a href="#terms" className="text-terracotta underline">Terms of Service</a> and <a href="#privacy" className="text-terracotta underline">Privacy Policy</a>, including the non-diagnostic wellness scope of this platform.
                </span>
              </label>
            </div>

            {/* Optional Consent Checkbox */}
            <div>
              <label className="flex items-start space-x-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={consentNonEssential}
                  onChange={(e) => setConsentNonEssential(e.target.checked)}
                  className="mt-0.5 rounded text-terracotta focus:ring-terracotta border-sand"
                />
                <span className="text-xs text-secondaryText leading-relaxed">
                  (Optional) I consent to receiving occasional updates on campus wellness initiatives and Brainwell Camp schedule releases.
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-xl text-sm font-semibold text-white bg-terracotta hover:bg-terracotta-dark focus:outline-none disabled:opacity-50 transition-all shadow-sm mt-4"
            >
              <span>{loading ? 'Creating your account...' : 'Create Account'}</span>
              {!loading && <ArrowRight className="w-4 h-4" />}
            </button>
          </form>

          <div className="pt-4 border-t border-sand/70 text-center text-xs text-secondaryText">
            <span>Already have an account? </span>
            <Link to="/login" className="font-semibold text-terracotta hover:underline">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
