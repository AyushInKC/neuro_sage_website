import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { campApi } from '../../services/api';
import { Registration } from '../../types';
import {
  ArrowLeft,
  ArrowRight,
  UploadCloud,
  FileText,
  Image as ImageIcon,
  X,
  AlertCircle,
  CheckCircle2,
  Clock,
  ShieldAlert,
} from 'lucide-react';

export const CampRegisterPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [collegeName, setCollegeName] = useState('');
  const [collegeYear, setCollegeYear] = useState<
    'First year' | 'Second year' | 'Third year' | 'Fourth year' | 'Other'
  >('First year');

  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submittedReg, setSubmittedReg] = useState<Registration | null>(null);

  // Check if user already registered
  useEffect(() => {
    campApi.getMyRegistrations().then((res) => {
      if (res.success && res.registrations?.length > 0) {
        // User has existing registration
        setSubmittedReg(res.registrations[0]);
      }
    }).catch(() => {});
  }, []);

  const handleFileChange = (selectedFile: File | null) => {
    if (!selectedFile) return;

    const allowed = ['image/jpeg', 'image/png', 'application/pdf'];
    if (!allowed.includes(selectedFile.type)) {
      setError('Only authentic PDF, JPG, and PNG files are allowed.');
      return;
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      setError('File size exceeds the 5MB limit.');
      return;
    }

    setError(null);
    setFile(selectedFile);

    if (selectedFile.type.startsWith('image/')) {
      const url = URL.createObjectURL(selectedFile);
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!file) {
      setError('Please upload your ₹49 payment slip before submitting.');
      return;
    }

    if (!collegeName.trim()) {
      setError('Please enter your college or institution name.');
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('fullName', fullName);
      formData.append('email', email);
      formData.append('collegeName', collegeName.trim());
      formData.append('collegeYear', collegeYear);
      formData.append('paymentSlip', file);

      const res = await campApi.register(formData);
      if (res.success && res.registration) {
        setSubmittedReg(res.registration);
      }
    } catch (err: any) {
      setError(err.message || 'Registration submission failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // If already registered or just submitted, show clear, transparent confirmation view
  if (submittedReg) {
    return (
      <div className="max-w-2xl mx-auto space-y-8">
        <Link
          to="/dashboard/camps"
          className="inline-flex items-center space-x-1.5 text-xs text-secondaryText hover:text-deepBrown"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Camp Details</span>
        </Link>

        <div className="bg-cream/70 border border-sand rounded-3xl p-8 sm:p-10 shadow-sm space-y-6">
          <div className="flex items-center space-x-3 text-terracotta">
            <CheckCircle2 className="w-8 h-8 flex-shrink-0" />
            <div>
              <h2 className="font-serif text-2xl font-bold text-deepBrown">
                Registration Received
              </h2>
              <p className="text-xs text-secondaryText">
                Your Brainwell Camp registration has been recorded in the fair queue.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-ivory border border-sand space-y-2 text-xs text-secondaryText leading-relaxed">
            <p className="font-medium text-deepBrown">
              “Your Brainwell Camp registration has been received. Your payment slip is awaiting verification. We will update your registration status once it has been reviewed.”
            </p>
            <p>
              Please note: An uploaded payment slip is pending review and does not automatically guarantee a confirmed seat until verified according to published capacity.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="p-3.5 rounded-xl bg-ivory border border-sand">
              <span className="text-secondaryText block">Registration Reference</span>
              <span className="font-serif text-base font-bold text-deepBrown">{submittedReg.reference}</span>
            </div>

            <div className="p-3.5 rounded-xl bg-ivory border border-sand">
              <span className="text-secondaryText block">FCFS Sequence Number</span>
              <span className="font-serif text-base font-bold text-terracotta">#{submittedReg.sequenceNumber}</span>
            </div>

            <div className="p-3.5 rounded-xl bg-ivory border border-sand">
              <span className="text-secondaryText block">Current Payment Status</span>
              <span className="font-semibold text-deepBrown">
                {submittedReg.paymentStatus === 'VERIFIED' ? 'Verified' : 'Pending Verification'}
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-ivory border border-sand">
              <span className="text-secondaryText block">Registration Status</span>
              <span className="font-semibold text-deepBrown">
                {submittedReg.registrationStatus === 'CONFIRMED'
                  ? `Confirmed (Seat #${submittedReg.allocatedSeatNumber})`
                  : submittedReg.registrationStatus === 'WAITLISTED'
                  ? `Waitlisted (Queue #${submittedReg.queueStats?.waitlistPosition || 1})`
                  : 'Pending Verification'}
              </span>
            </div>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
            <Link
              to="/dashboard/my-registrations"
              className="inline-flex items-center justify-center space-x-2 px-6 py-3 rounded-full text-xs font-semibold bg-terracotta text-white hover:bg-terracotta-dark transition-colors"
            >
              <span>Go to My Registrations</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link
              to="/dashboard"
              className="inline-flex items-center justify-center px-6 py-3 rounded-full text-xs font-medium bg-ivory text-deepBrown border border-sand hover:bg-sand/30 transition-colors"
            >
              Return to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <Link
        to="/dashboard/camps"
        className="inline-flex items-center space-x-1.5 text-xs text-secondaryText hover:text-deepBrown"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Camp Details</span>
      </Link>

      <div className="space-y-2 border-b border-sand/70 pb-4">
        <h1 className="font-serif text-3xl font-bold text-deepBrown">
          Register for Brainwell Camp
        </h1>
        <p className="text-xs sm:text-sm text-secondaryText">
          Registration fee: <strong>₹49 per participant</strong>. Prioritized by fair atomic sequence order.
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-dusty/20 border border-errorDark/20 text-xs text-errorDark flex items-start space-x-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Payment Instructions Panel */}
      <div className="p-6 rounded-2xl bg-cream/70 border border-sand space-y-4 text-xs text-secondaryText">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-lg font-bold text-deepBrown">
            Payment Instructions
          </h2>
          <span className="font-serif font-bold text-terracotta text-base">₹49.00</span>
        </div>

        <p className="leading-relaxed">
          Please complete your ₹49 registration fee using the organizer payment details below, then upload your transaction screenshot or receipt slip as proof of payment:
        </p>

        <div className="p-4 rounded-xl bg-ivory border border-sand space-y-1.5 text-deepBrown font-mono text-xs">
          <p><strong>Payment Purpose:</strong> NeuroSage Brainwell Camp 2026</p>
          <p><strong>Participant Fee:</strong> ₹49 per participant</p>
          <p><strong>Organizer Leads:</strong> Yash Chaudhary (8218030248) | Ayush Singh (7307998313)</p>
          <p className="text-[11px] text-secondaryText font-sans">
            * Pay through your preferred UPI app to the organizer number above or campus desk, and capture a clear slip screenshot.
          </p>
        </div>

        <div className="flex items-start space-x-2 text-[11px] text-secondaryText">
          <ShieldAlert className="w-3.5 h-3.5 text-terracotta flex-shrink-0 mt-0.5" />
          <span>
            A screenshot or uploaded slip is not automatic proof that payment succeeded. An authorized administrator verifies payment before a seat is confirmed.
          </span>
        </div>
      </div>

      {/* Registration Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-deepBrown uppercase tracking-wider">
              Full Name
            </label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="mt-1.5 block w-full px-3.5 py-2.5 rounded-xl border border-sand bg-ivory text-sm text-deepBrown placeholder-secondaryText/60 focus:border-terracotta focus:ring-1 focus:ring-terracotta"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-deepBrown uppercase tracking-wider">
              Verified Email
            </label>
            <input
              type="email"
              required
              value={email}
              readOnly
              className="mt-1.5 block w-full px-3.5 py-2.5 rounded-xl border border-sand bg-cream/40 text-sm text-secondaryText cursor-not-allowed"
            />
            <span className="text-[10px] text-secondaryText mt-1 block">Tied to your authenticated account</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-deepBrown uppercase tracking-wider">
              College or Institution Name
            </label>
            <input
              type="text"
              required
              value={collegeName}
              onChange={(e) => setCollegeName(e.target.value)}
              placeholder="e.g. Delhi University / IIT / BITS"
              className="mt-1.5 block w-full px-3.5 py-2.5 rounded-xl border border-sand bg-ivory text-sm text-deepBrown placeholder-secondaryText/60 focus:border-terracotta focus:ring-1 focus:ring-terracotta"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-deepBrown uppercase tracking-wider">
              Current College Year
            </label>
            <select
              value={collegeYear}
              onChange={(e) => setCollegeYear(e.target.value as any)}
              className="mt-1.5 block w-full px-3.5 py-2.5 rounded-xl border border-sand bg-ivory text-sm text-deepBrown focus:border-terracotta focus:ring-1 focus:ring-terracotta"
            >
              <option value="First year">First year</option>
              <option value="Second year">Second year</option>
              <option value="Third year">Third year</option>
              <option value="Fourth year">Fourth year</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        {/* Payment Slip Upload Area */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-deepBrown uppercase tracking-wider">
            Payment Slip Upload (PDF, JPG, PNG up to 5MB)
          </label>

          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragActive(true);
            }}
            onDragLeave={() => setDragActive(false)}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-2xl p-6 text-center transition-colors cursor-pointer ${
              dragActive
                ? 'border-terracotta bg-cream'
                : file
                ? 'border-sage bg-ivory'
                : 'border-sand hover:border-sand/80 bg-cream/30'
            }`}
            onClick={() => document.getElementById('slip-input')?.click()}
          >
            <input
              id="slip-input"
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              className="hidden"
              onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
            />

            {file ? (
              <div className="flex flex-col items-center space-y-3" onClick={(e) => e.stopPropagation()}>
                {previewUrl ? (
                  <div className="relative">
                    <img
                      src={previewUrl}
                      alt="Slip preview"
                      className="max-h-40 rounded-lg shadow-sm border border-sand object-contain"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setFile(null);
                        setPreviewUrl(null);
                      }}
                      className="absolute -top-2 -right-2 p-1 bg-errorDark text-white rounded-full hover:bg-errorDark/90"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center space-x-3 p-3 bg-ivory rounded-xl border border-sand">
                    <FileText className="w-6 h-6 text-terracotta" />
                    <div className="text-left text-xs">
                      <p className="font-semibold text-deepBrown truncate max-w-xs">{file.name}</p>
                      <p className="text-secondaryText">{(file.size / 1024).toFixed(1)} KB • PDF document</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setFile(null)}
                      className="p-1 text-secondaryText hover:text-errorDark"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
                <p className="text-[11px] text-secondaryText">Click or drag a different file to replace</p>
              </div>
            ) : (
              <div className="space-y-2 py-4">
                <UploadCloud className="w-8 h-8 text-terracotta mx-auto" />
                <p className="text-sm font-medium text-deepBrown">
                  Drop your payment slip here, or <span className="text-terracotta underline">browse</span>
                </p>
                <p className="text-[11px] text-secondaryText">
                  Supports PDF, JPG, or PNG (maximum 5MB). Encrypted private storage.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center space-x-2 py-3.5 px-6 rounded-full text-sm font-semibold text-white bg-terracotta hover:bg-terracotta-dark focus:outline-none disabled:opacity-50 transition-all shadow-sm"
        >
          <span>{loading ? 'Submitting registration...' : 'Submit Brainwell Registration — ₹49'}</span>
          {!loading && <ArrowRight className="w-4 h-4" />}
        </button>
      </form>
    </div>
  );
};
