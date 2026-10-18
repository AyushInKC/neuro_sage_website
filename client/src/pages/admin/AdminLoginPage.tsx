import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, AlertCircle, ShieldCheck } from 'lucide-react';
import { authApi } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

export const AdminLoginPage: React.FC = () => {
  const { refreshUser } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      const result = await authApi.adminLogin({ username, password });
      if (result.user.role !== 'admin') throw new Error('Administrator access is required.');
      await refreshUser();
      navigate('/admin', { replace: true });
    } catch (err: any) {
      setError(err.message || 'Invalid administrator credentials.');
    } finally {
      setLoading(false);
    }
  };

  return <main className="min-h-screen bg-ivory flex items-center justify-center p-4">
    <div className="w-full max-w-md">
      <Link to="/" className="inline-flex items-center gap-1.5 text-xs text-secondaryText mb-6"><ArrowLeft className="w-3.5 h-3.5" /> Back to NeuroSage</Link>
      <div className="bg-cream/70 border border-sand rounded-3xl p-8 shadow-sm">
        <div className="flex items-center gap-3 mb-2"><ShieldCheck className="w-6 h-6 text-terracotta" /><h1 className="font-serif text-3xl font-bold text-deepBrown">NeuroSage</h1></div>
        <p className="text-sm text-secondaryText mb-7">Administration</p>
        {error && <div className="mb-5 p-3 rounded-xl bg-rose-dusty/20 text-xs text-errorDark flex gap-2"><AlertCircle className="w-4 h-4" />{error}</div>}
        <form onSubmit={submit} className="space-y-5">
          <label className="block text-xs font-semibold text-deepBrown">Username<input required value={username} onChange={(e) => setUsername(e.target.value)} autoComplete="username" className="mt-1.5 w-full px-3.5 py-2.5 rounded-xl border border-sand bg-ivory text-sm" /></label>
          <label className="block text-xs font-semibold text-deepBrown">Password<input required type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" className="mt-1.5 w-full px-3.5 py-2.5 rounded-xl border border-sand bg-ivory text-sm" /></label>
          <button disabled={loading} className="w-full flex justify-center items-center gap-2 py-3 rounded-xl bg-terracotta text-white text-sm font-semibold disabled:opacity-50">{loading ? 'Signing in...' : 'Admin Sign In'}{!loading && <ArrowRight className="w-4 h-4" />}</button>
        </form>
      </div>
    </div>
  </main>;
};
