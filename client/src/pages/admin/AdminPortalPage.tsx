import React, { useState, useEffect } from 'react';
import { adminApi } from '../../services/api';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Eye,
  Clock,
  Filter,
  Search,
  AlertCircle,
  Users,
  Settings,
  X,
  History,
} from 'lucide-react';

export const AdminPortalPage: React.FC = () => {
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  // Modals / Actions state
  const [selectedSlipUrl, setSelectedSlipUrl] = useState<string | null>(null);
  const [selectedAuditLog, setSelectedAuditLog] = useState<any[] | null>(null);

  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [cancelReason, setCancelReason] = useState('');

  const [capacityInput, setCapacityInput] = useState(50);
  const [updatingCapacity, setUpdatingCapacity] = useState(false);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      const [regRes, statsRes] = await Promise.all([
        adminApi.getRegistrations(filterStatus, searchTerm),
        adminApi.getStats(),
      ]);

      if (regRes.success) {
        setRegistrations(regRes.registrations);
      }
      if (statsRes.success) {
        setStats(statsRes.stats);
        setCapacityInput(statsRes.stats.capacity);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [filterStatus]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchData();
  };

  const handleVerify = async (id: string) => {
    try {
      const res = await adminApi.verifyPayment(id);
      setActionMessage(res.message);
      fetchData();
    } catch (err: any) {
      alert(err.message || 'Verification failed');
    }
  };

  const handleReject = async (id: string) => {
    if (!rejectReason.trim()) return;
    try {
      const res = await adminApi.rejectPayment(id, rejectReason.trim());
      setActionMessage(res.message);
      setRejectingId(null);
      setRejectReason('');
      fetchData();
    } catch (err: any) {
      alert(err.message || 'Rejection failed');
    }
  };

  const handleCancel = async (id: string) => {
    if (!cancelReason.trim()) return;
    try {
      const res = await adminApi.cancelRegistration(id, cancelReason.trim());
      setActionMessage(res.message);
      setCancellingId(null);
      setCancelReason('');
      fetchData();
    } catch (err: any) {
      alert(err.message || 'Cancellation failed');
    }
  };

  const handleUpdateCapacity = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdatingCapacity(true);
    try {
      await adminApi.updateCampConfig({ capacity: Number(capacityInput) });
      setActionMessage(`Camp capacity updated to ${capacityInput}.`);
      fetchData();
    } catch (err: any) {
      alert(err.message || 'Failed to update capacity');
    } finally {
      setUpdatingCapacity(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Admin Title & Capacity Control */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-sand/70 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-1.5 rounded-lg bg-terracotta/10 text-terracotta">
              <ShieldCheck className="w-5 h-5" />
            </span>
            <h1 className="font-serif text-3xl font-bold text-deepBrown">
              Administrative Queue & Verification
            </h1>
          </div>
          <p className="text-xs text-secondaryText mt-0.5">
            Fair First-Come-First-Served seat allocation, secure slip inspection, and waitlist promotion.
          </p>
        </div>

        {/* Quick Capacity Update Form */}
        <form onSubmit={handleUpdateCapacity} className="flex items-center space-x-2">
          <label className="text-xs font-semibold text-deepBrown whitespace-nowrap">
            Camp Capacity:
          </label>
          <input
            type="number"
            min={1}
            max={500}
            value={capacityInput}
            onChange={(e) => setCapacityInput(Number(e.target.value))}
            className="w-20 px-2 py-1 text-xs rounded-lg border border-sand bg-cream/40 text-deepBrown text-center font-bold"
          />
          <button
            type="submit"
            disabled={updatingCapacity}
            className="px-3 py-1 text-xs font-semibold rounded-lg bg-deepBrown text-white hover:bg-deepBrown/90 transition-colors"
          >
            {updatingCapacity ? '...' : 'Save'}
          </button>
        </form>
      </div>

      {actionMessage && (
        <div className="p-4 rounded-xl bg-sage-light/40 border border-sage text-xs text-deepBrown flex items-center justify-between">
          <span>{actionMessage}</span>
          <button onClick={() => setActionMessage(null)} className="text-secondaryText hover:text-deepBrown">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Real-time Queue Stats */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-6 gap-3 text-xs">
          <div className="p-4 rounded-2xl bg-cream/60 border border-sand">
            <span className="text-secondaryText block">Total Submissions</span>
            <span className="font-serif text-xl font-bold text-deepBrown">{stats.total}</span>
          </div>

          <div className="p-4 rounded-2xl bg-sage-light/30 border border-sage">
            <span className="text-secondaryText block">Confirmed Seats</span>
            <span className="font-serif text-xl font-bold text-deepBrown">
              {stats.confirmed} / {stats.capacity}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-ivory border border-sand">
            <span className="text-secondaryText block">Pending Review</span>
            <span className="font-serif text-xl font-bold text-terracotta">{stats.pending}</span>
          </div>

          <div className="p-4 rounded-2xl bg-ivory border border-sand">
            <span className="text-secondaryText block">Waitlisted</span>
            <span className="font-serif text-xl font-bold text-deepBrown">{stats.waitlisted}</span>
          </div>

          <div className="p-4 rounded-2xl bg-ivory border border-sand">
            <span className="text-secondaryText block">Payment Rejected</span>
            <span className="font-serif text-xl font-bold text-errorDark">{stats.rejected}</span>
          </div>

          <div className="p-4 rounded-2xl bg-ivory border border-sand">
            <span className="text-secondaryText block">Cancelled</span>
            <span className="font-serif text-xl font-bold text-gray-500">{stats.cancelled}</span>
          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-2">
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <span className="text-secondaryText mr-1">Status:</span>
          {['ALL', 'PENDING_PAYMENT_VERIFICATION', 'CONFIRMED', 'WAITLISTED', 'PAYMENT_REJECTED', 'CANCELLED'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 rounded-full transition-colors ${
                filterStatus === st
                  ? 'bg-terracotta text-white font-medium'
                  : 'bg-cream/70 border border-sand text-secondaryText hover:text-deepBrown'
              }`}
            >
              {st === 'ALL'
                ? 'All'
                : st === 'PENDING_PAYMENT_VERIFICATION'
                ? 'Pending Review'
                : st === 'CONFIRMED'
                ? 'Confirmed'
                : st === 'WAITLISTED'
                ? 'Waitlisted'
                : st === 'PAYMENT_REJECTED'
                ? 'Rejected'
                : 'Cancelled'}
            </button>
          ))}
        </div>

        <form onSubmit={handleSearch} className="flex space-x-2">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search participant / ref..."
            className="px-3 py-1.5 text-xs rounded-xl border border-sand bg-ivory text-deepBrown placeholder-secondaryText/60"
          />
          <button
            type="submit"
            className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-sand/80 hover:bg-sand text-deepBrown"
          >
            Search
          </button>
        </form>
      </div>

      {/* Registrations Queue Table */}
      <div className="bg-ivory border border-sand rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-cream/80 border-b border-sand/70 text-secondaryText uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-3 px-4">Queue #</th>
                <th className="py-3 px-4">Ref Code</th>
                <th className="py-3 px-4">Participant</th>
                <th className="py-3 px-4">Institution</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Seat</th>
                <th className="py-3 px-4">Slip</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sand/50">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-secondaryText">
                    Loading queue records...
                  </td>
                </tr>
              ) : registrations.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-secondaryText">
                    No registrations found matching criteria.
                  </td>
                </tr>
              ) : (
                registrations.map((reg) => (
                  <tr key={reg._id} className="hover:bg-cream/30 transition-colors">
                    <td className="py-3 px-4 font-serif font-bold text-terracotta">
                      #{reg.sequenceNumber}
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px] font-medium text-deepBrown">
                      {reg.reference}
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-semibold text-deepBrown">{reg.fullName}</p>
                      <p className="text-[11px] text-secondaryText">{reg.email}</p>
                    </td>
                    <td className="py-3 px-4">
                      <p className="text-deepBrown">{reg.collegeName}</p>
                      <p className="text-[10px] text-secondaryText">{reg.collegeYear}</p>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold ${
                          reg.registrationStatus === 'CONFIRMED'
                            ? 'bg-sage-light/60 text-deepBrown'
                            : reg.registrationStatus === 'WAITLISTED'
                            ? 'bg-sand text-deepBrown'
                            : reg.registrationStatus === 'PAYMENT_REJECTED'
                            ? 'bg-rose-dusty/40 text-errorDark'
                            : reg.registrationStatus === 'CANCELLED'
                            ? 'bg-gray-200 text-gray-700'
                            : 'bg-cream text-secondaryText'
                        }`}
                      >
                        {reg.registrationStatus === 'PENDING_PAYMENT_VERIFICATION'
                          ? 'Pending'
                          : reg.registrationStatus}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-semibold text-deepBrown">
                      {reg.allocatedSeatNumber ? `#${reg.allocatedSeatNumber}` : '—'}
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() =>
                          setSelectedSlipUrl(`/api/admin/registrations/${reg._id}/payment-slip`)
                        }
                        className="inline-flex items-center space-x-1 text-terracotta hover:underline font-medium"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect</span>
                      </button>
                    </td>
                    <td className="py-3 px-4 text-right space-x-2">
                      {reg.paymentStatus !== 'VERIFIED' && reg.registrationStatus !== 'CANCELLED' && (
                        <button
                          onClick={() => handleVerify(reg._id)}
                          className="px-2.5 py-1 rounded-lg bg-terracotta text-white hover:bg-terracotta-dark text-[11px] font-semibold transition-colors"
                        >
                          Verify Payment
                        </button>
                      )}

                      {reg.registrationStatus !== 'PAYMENT_REJECTED' &&
                        reg.registrationStatus !== 'CANCELLED' && (
                          <button
                            onClick={() => setRejectingId(reg._id)}
                            className="px-2 py-1 rounded-lg text-errorDark hover:bg-rose-dusty/20 text-[11px] font-medium"
                          >
                            Reject
                          </button>
                        )}

                      {reg.registrationStatus !== 'CANCELLED' && (
                        <button
                          onClick={() => setCancellingId(reg._id)}
                          className="px-2 py-1 rounded-lg text-secondaryText hover:text-errorDark text-[11px]"
                        >
                          Cancel
                        </button>
                      )}

                      <button
                        onClick={() => setSelectedAuditLog(reg.auditLog)}
                        className="p-1 text-secondaryText hover:text-deepBrown"
                        title="View Audit Trail"
                      >
                        <History className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Reject Payment Modal Dialog */}
      {rejectingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-deepBrown/40 backdrop-blur-sm">
          <div className="bg-cream p-6 rounded-3xl max-w-md w-full border border-sand space-y-4 shadow-lg">
            <h3 className="font-serif text-lg font-bold text-deepBrown">
              Reject Payment Submission
            </h3>
            <p className="text-xs text-secondaryText">
              Please enter the audit reason for rejecting this payment slip (e.g. unreadable screenshot, incorrect transaction amount).
            </p>
            <textarea
              rows={3}
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Enter mandatory rejection reason..."
              className="w-full p-3 text-xs rounded-xl border border-sand bg-ivory text-deepBrown"
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => {
                  setRejectingId(null);
                  setRejectReason('');
                }}
                className="px-4 py-2 text-xs text-secondaryText hover:text-deepBrown"
              >
                Cancel
              </button>
              <button
                onClick={() => handleReject(rejectingId)}
                disabled={!rejectReason.trim()}
                className="px-4 py-2 text-xs font-semibold rounded-xl bg-errorDark text-white hover:bg-errorDark/90 disabled:opacity-50"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Registration Modal Dialog */}
      {cancellingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-deepBrown/40 backdrop-blur-sm">
          <div className="bg-cream p-6 rounded-3xl max-w-md w-full border border-sand space-y-4 shadow-lg">
            <h3 className="font-serif text-lg font-bold text-deepBrown">
              Cancel Registration & Promote Waitlist
            </h3>
            <p className="text-xs text-secondaryText">
              Cancelling a confirmed registration will automatically promote the earliest eligible waitlisted student. Enter an audit reason:
            </p>
            <textarea
              rows={3}
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              placeholder="e.g. Student requested cancellation via email"
              className="w-full p-3 text-xs rounded-xl border border-sand bg-ivory text-deepBrown"
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => {
                  setCancellingId(null);
                  setCancelReason('');
                }}
                className="px-4 py-2 text-xs text-secondaryText hover:text-deepBrown"
              >
                Close
              </button>
              <button
                onClick={() => handleCancel(cancellingId)}
                disabled={!cancelReason.trim()}
                className="px-4 py-2 text-xs font-semibold rounded-xl bg-errorDark text-white hover:bg-errorDark/90 disabled:opacity-50"
              >
                Cancel Registration
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Secure Slip Inspection Modal */}
      {selectedSlipUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-deepBrown/60 backdrop-blur-sm">
          <div className="bg-cream p-6 rounded-3xl max-w-2xl w-full border border-sand space-y-4 shadow-xl">
            <div className="flex items-center justify-between pb-2 border-b border-sand">
              <h3 className="font-serif text-lg font-bold text-deepBrown">
                Private Payment Slip Inspection
              </h3>
              <button
                onClick={() => setSelectedSlipUrl(null)}
                className="p-1 rounded-full text-secondaryText hover:text-deepBrown"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="min-h-[300px] max-h-[500px] overflow-auto flex items-center justify-center bg-ivory rounded-2xl p-4 border border-sand">
              <iframe
                src={selectedSlipUrl}
                title="Payment Slip"
                className="w-full h-[450px] border-none rounded-xl"
              />
            </div>
            <p className="text-[11px] text-secondaryText">
              Served over authenticated admin stream. Never exposed via public URLs.
            </p>
          </div>
        </div>
      )}

      {/* Audit Log Modal */}
      {selectedAuditLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-deepBrown/50 backdrop-blur-sm">
          <div className="bg-cream p-6 rounded-3xl max-w-lg w-full border border-sand space-y-4 shadow-xl">
            <div className="flex items-center justify-between pb-2 border-b border-sand">
              <h3 className="font-serif text-lg font-bold text-deepBrown">
                Audit Trail Log
              </h3>
              <button
                onClick={() => setSelectedAuditLog(null)}
                className="p-1 text-secondaryText hover:text-deepBrown"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="max-h-[350px] overflow-y-auto space-y-3">
              {selectedAuditLog.map((log: any, i: number) => (
                <div key={i} className="p-3 rounded-xl bg-ivory border border-sand text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-deepBrown">{log.action}</span>
                    <span className="text-[10px] text-secondaryText">
                      {new Date(log.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-secondaryText">{log.notes}</p>
                  <p className="text-[10px] text-terracotta">
                    By: {log.performerName || log.performerRole || 'System'}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
