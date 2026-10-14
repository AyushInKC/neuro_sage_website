import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { authApi } from '../../services/api';
import { ArrowLeft, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';

export const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await authApi.forgotPassword(email);
      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-ivory flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link
          to="/login"
          className="inline-flex items-center space-x-1.5 text-xs text-secondaryText hover:text-deepBrown mb-6"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Login</span>
        </Link>

        <h2 className="font-serif text-3xl font-bold tracking-tight text-deepBrown">
          Reset password
        </h2>
        <p className="mt-1 text-sm text-secondaryText">
          Enter your email address and we will send you instructions to reset your password.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-cream/60 py-8 px-6 shadow-sm border border-sand rounded-2xl sm:px-10 space-y-6">
          {submitted ? (
            <div className="text-center space-y-4 py-4">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-sage/20 text-deepBrown">
                <CheckCircle2 className="h-6 w-6 text-terracotta" />
              </div>
              <h3 className="font-serif text-xl font-bold text-deepBrown">Check your inbox</h3>
              <p className="text-xs text-secondaryText leading-relaxed">
                If an account exists for <strong>{email}</strong>, we have sent a password reset link. Please check your spam folder if it doesn't appear shortly.
              </p>
              <div className="pt-4">
                <Link
                  to="/login"
                  className="inline-flex items-center space-x-1.5 text-xs font-semibold text-terracotta hover:underline"
                >
                  <span>Return to login</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ) : (
            <form className="space-y-4" onSubmit={handleSubmit}>
              {error && (
                <div className="p-3 rounded-lg bg-rose-dusty/20 border border-errorDark/20 text-xs text-errorDark flex items-start space-x-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

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

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-xl text-sm font-semibold text-white bg-terracotta hover:bg-terracotta-dark focus:outline-none disabled:opacity-50 transition-all shadow-sm"
              >
                <span>{loading ? 'Sending link...' : 'Send reset link'}</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
