import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { campApi } from '../../services/api';
import { Registration } from '../../types';
import {
  ClipboardList,
  CheckCircle2,
  Clock,
  AlertCircle,
  XCircle,
  Calendar,
  Tent,
  ArrowRight,
  ShieldCheck,
  History,
} from 'lucide-react';

export const MyRegistrationsPage: React.FC = () => {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [cancelReason, setCancelReason] = useState('');
  const [cancelLoading, setCancelLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const fetchRegistrations = async () => {
    try {
      const res = await campApi.getMyRegistrations();
      if (res.success) {
        setRegistrations(res.registrations);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const handleCancel = async (id: string) => {
    if (!cancelReason.trim()) return;
    setCancelLoading(true);
    try {
      await campApi.cancelRegistration(id, cancelReason);
      setMessage('Registration has been successfully cancelled.');
      setCancellingId(null);
      setCancelReason('');
      fetchRegistrations();
    } catch (err: any) {
      alert(err.message || 'Failed to cancel registration');
    } finally {
      setCancelLoading(false);
    }
  };

  const getStatusBadge = (status: string, seat?: number | null) => {
    switch (status) {
      case 'CONFIRMED':
        return (
          <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-semibold bg-sage-light/50 text-deepBrown border border-sage">
            <CheckCircle2 className="w-3.5 h-3.5 text-deepBrown" />
            <span>Confirmed Seat #{seat}</span>
          </span>
        );
      case 'WAITLISTED':
        return (
          <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-semibold bg-sand/60 text-deepBrown border border-sand">
            <Clock className="w-3.5 h-3.5 text-terracotta" />
            <span>Waitlisted</span>
          </span>
        );
      case 'PENDING_PAYMENT_VERIFICATION':
        return (
          <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-semibold bg-cream text-deepBrown border border-sand">
            <Clock className="w-3.5 h-3.5 text-secondaryText" />
            <span>Pending Payment Verification</span>
          </span>
        );
      case 'PAYMENT_REJECTED':
        return (
          <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-semibold bg-rose-dusty/30 text-errorDark border border-errorDark/20">
            <XCircle className="w-3.5 h-3.5 text-errorDark" />
            <span>Payment Rejected</span>
          </span>
        );
      case 'CANCELLED':
        return (
          <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-semibold bg-gray-200 text-gray-700">
            <span>Cancelled</span>
          </span>
        );
      default:
        return <span>{status}</span>;
    }
  };

  if (loading) {
    return (
      <div className="py-16 text-center space-y-3">
        <div className="w-8 h-8 border-2 border-terracotta border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs text-secondaryText">Loading registrations...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="space-y-2 border-b border-sand/70 pb-4">
        <h1 className="font-serif text-3xl font-bold text-deepBrown">
          My Camp Registrations
        </h1>
        <p className="text-xs sm:text-sm text-secondaryText">
          View your fair queue position, payment verification status, and audit trail.
        </p>
      </div>

      {message && (
        <div className="p-4 rounded-xl bg-sage-light/30 border border-sage text-xs text-deepBrown">
          {message}
        </div>
      )}

      {registrations.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-cream/40 border border-sand space-y-4">
          <Tent className="w-10 h-10 text-terracotta/70 mx-auto" />
          <h3 className="font-serif text-xl font-bold text-deepBrown">No Registrations Yet</h3>
          <p className="text-xs text-secondaryText max-w-sm mx-auto leading-relaxed">
            You haven't registered for any NeuroSage wellness camps yet. Check out Brainwell Camp!
          </p>
          <div className="pt-2">
            <Link
              to="/dashboard/camps"
              className="px-6 py-2.5 rounded-full text-xs font-semibold bg-terracotta text-white hover:bg-terracotta-dark transition-colors inline-flex items-center space-x-1.5"
            >
              <span>Explore Brainwell Camp</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {registrations.map((reg) => (
            <div
              key={reg.id}
              className="p-6 sm:p-8 rounded-3xl bg-cream/60 border border-sand shadow-sm space-y-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-sand/60">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-serif text-xl font-bold text-deepBrown">
                      {reg.camp?.title || 'Brainwell Camp'}
                    </span>
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-ivory border border-sand text-deepBrown">
                      {reg.reference}
                    </span>
                  </div>
                  <p className="text-xs text-secondaryText mt-0.5">
                    Submitted on {new Date(reg.createdAt).toLocaleString()}
                  </p>
                </div>

                <div>{getStatusBadge(reg.registrationStatus, reg.allocatedSeatNumber)}</div>
              </div>

              {/* Queue Statistics Overview */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                <div className="p-3.5 rounded-2xl bg-ivory border border-sand">
                  <span className="text-secondaryText block">FCFS Sequence</span>
                  <span className="font-serif text-lg font-bold text-terracotta">
                    #{reg.sequenceNumber}
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-ivory border border-sand">
                  <span className="text-secondaryText block">Queue Position</span>
                  <span className="font-serif text-lg font-bold text-deepBrown">
                    {reg.queueStats?.queuePosition || reg.sequenceNumber}
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-ivory border border-sand">
                  <span className="text-secondaryText block">Payment Proof</span>
                  <span className="font-semibold text-deepBrown">
                    {reg.paymentStatus === 'VERIFIED'
                      ? 'Verified'
                      : reg.paymentStatus === 'REJECTED'
                      ? 'Rejected'
                      : 'Pending Review'}
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-ivory border border-sand">
                  <span className="text-secondaryText block">Allocated Seat</span>
                  <span className="font-serif text-lg font-bold text-deepBrown">
                    {reg.allocatedSeatNumber ? `#${reg.allocatedSeatNumber}` : '—'}
                  </span>
                </div>
              </div>

              {/* Status Explanation */}
              <div className="p-4 rounded-xl bg-ivory border border-sand text-xs text-secondaryText space-y-1">
                {reg.registrationStatus === 'PENDING_PAYMENT_VERIFICATION' && (
                  <p>
                    Your ₹49 payment slip has been uploaded and is waiting for organizer verification. Seats are allocated strictly in queue order upon verification.
                  </p>
                )}
                {reg.registrationStatus === 'CONFIRMED' && (
                  <p className="text-deepBrown font-medium">
                    Congratulations! Your payment has been verified and Seat #{reg.allocatedSeatNumber} is confirmed for you.
                  </p>
                )}
                {reg.registrationStatus === 'WAITLISTED' && (
                  <p>
                    You are in waitlist position #{reg.queueStats?.waitlistPosition || 1}. If any confirmed seat opens up, you will be automatically promoted based on your sequence number #{reg.sequenceNumber}.
                  </p>
                )}
                {reg.registrationStatus === 'PAYMENT_REJECTED' && (
                  <p className="text-errorDark font-medium">
                    Rejection reason: {reg.rejectionReason || 'Payment could not be verified'}.
                  </p>
                )}
                {reg.registrationStatus === 'CANCELLED' && (
                  <p className="text-secondaryText">This registration was cancelled.</p>
                )}
              </div>

              {/* Participant Details */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-secondaryText pt-2">
                <div>
                  <span className="text-deepBrown font-medium">Participant: </span>
                  <span>{reg.fullName}</span>
                </div>
                <div>
                  <span className="text-deepBrown font-medium">Institution: </span>
                  <span>{reg.collegeName}</span>
                </div>
                <div>
                  <span className="text-deepBrown font-medium">Academic Year: </span>
                  <span>{reg.collegeYear}</span>
                </div>
              </div>

              {/* Cancellation Dialog / Action */}
              {reg.registrationStatus !== 'CANCELLED' && (
                <div className="pt-2 border-t border-sand/60">
                  {cancellingId === reg.id ? (
                    <div className="p-4 rounded-xl bg-ivory border border-sand space-y-3">
                      <p className="text-xs font-semibold text-deepBrown">
                        Reason for cancelling registration:
                      </p>
                      <input
                        type="text"
                        value={cancelReason}
                        onChange={(e) => setCancelReason(e.target.value)}
                        placeholder="e.g. Schedule conflict or exam dates"
                        className="w-full px-3 py-2 text-xs rounded-lg border border-sand bg-cream/40 text-deepBrown"
                      />
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => handleCancel(reg.id)}
                          disabled={cancelLoading || !cancelReason.trim()}
                          className="px-4 py-2 text-xs font-semibold rounded-lg bg-errorDark text-white hover:bg-errorDark/90 disabled:opacity-50"
                        >
                          {cancelLoading ? 'Cancelling...' : 'Confirm Cancellation'}
                        </button>
                        <button
                          onClick={() => setCancellingId(null)}
                          className="px-4 py-2 text-xs text-secondaryText hover:text-deepBrown"
                        >
                          Nevermind
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => setCancellingId(reg.id)}
                      className="text-xs text-secondaryText hover:text-errorDark underline"
                    >
                      Cancel this registration
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
