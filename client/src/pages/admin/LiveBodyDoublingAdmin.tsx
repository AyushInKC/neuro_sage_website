import React, { useEffect, useState } from 'react';
import { liveAdminApi } from '../../services/api';
import { Link } from 'react-router-dom';

export const LiveBodyDoublingAdmin: React.FC = () => {
  const [payments, setPayments] = useState<any[]>([]);
  const [sessions, setSessions] = useState<any[]>([]);
  const [message, setMessage] = useState('');

  const load = async () => {
    try {
      const [paymentResult, sessionResult] = await Promise.all([liveAdminApi.getPayments(), liveAdminApi.getSessions()]);
      setPayments(paymentResult.payments);
      setSessions(sessionResult.sessions);
    } catch (err: any) { setMessage(err.message || 'Unable to load live session administration.'); }
  };
  useEffect(() => { load(); }, []);

  const approve = async (id: string) => { await liveAdminApi.approvePayment(id); setMessage('Payment approved.'); load(); };
  const reject = async (id: string) => { const reason = window.prompt('Reason for rejection:'); if (!reason) return; await liveAdminApi.rejectPayment(id, reason); setMessage('Payment rejected.'); load(); };
  const start = async () => { await liveAdminApi.createSession(); setMessage('Live session started.'); load(); };

  return <section className="space-y-5 border-t border-sand pt-8">
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <div><h2 className="font-serif text-2xl font-bold text-deepBrown">Live Body Doubling</h2><p className="text-xs text-secondaryText">Verify UPI payments and facilitate active sessions.</p></div>
      <button onClick={start} className="px-4 py-2 rounded-xl bg-terracotta text-white text-xs font-semibold">Start live session</button>
    </div>
    {message && <p className="text-xs text-terracotta">{message}</p>}
    <div className="bg-cream/60 border border-sand rounded-2xl p-5">
      <h3 className="font-semibold text-deepBrown text-sm mb-3">Pending payments</h3>
      <div className="space-y-2">{payments.length === 0 ? <p className="text-xs text-secondaryText">No pending payments.</p> : payments.map((payment) => <div key={payment._id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-ivory rounded-xl border border-sand text-xs"><span><strong>{payment.userId?.name || 'Patient'}</strong> · ₹{payment.amount} · UTR {payment.utr}</span><span className="flex gap-2"><button onClick={() => approve(payment._id)} className="px-3 py-1.5 rounded-lg bg-sage text-deepBrown font-semibold">Approve</button><button onClick={() => reject(payment._id)} className="px-3 py-1.5 rounded-lg bg-rose-dusty/30 text-errorDark font-semibold">Reject</button></span></div>)}</div>
    </div>
    <div className="bg-cream/60 border border-sand rounded-2xl p-5">
      <h3 className="font-semibold text-deepBrown text-sm mb-3">Active sessions</h3>
      {sessions.length === 0 ? <p className="text-xs text-secondaryText">No active sessions.</p> : sessions.map((session) => <div key={session._id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-ivory rounded-xl border border-sand text-xs"><span><strong>Session {session.sessionId}</strong> · {session.participants?.length || 0} participant(s) · started {new Date(session.startedAt).toLocaleString()}</span><Link to={`/dashboard/body-doubling/live?session=${session._id}`} className="px-3 py-1.5 rounded-lg bg-deepBrown text-white font-semibold text-center">Monitor session</Link></div>)}
    </div>
  </section>;
};
