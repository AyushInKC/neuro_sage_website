import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { campApi } from '../../services/api';
import { Camp, Registration } from '../../types';
import {
  Tent,
  CheckCircle2,
  Calendar,
  MapPin,
  Clock,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Users,
} from 'lucide-react';

export const CampDetailsPage: React.FC = () => {
  const [camp, setCamp] = useState<Camp | null>(null);
  const [myRegistration, setMyRegistration] = useState<Registration | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      campApi.getInfo(),
      campApi.getMyRegistrations(),
    ])
      .then(([campRes, myRegRes]) => {
        if (campRes.success) setCamp(campRes.camp);
        if (myRegRes.success && myRegRes.registrations.length > 0) {
          setMyRegistration(myRegRes.registrations[0]);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="py-16 text-center space-y-3">
        <div className="w-8 h-8 border-2 border-terracotta border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs text-secondaryText">Loading camp details...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* Camp Header */}
      <div className="bg-cream/70 border border-sand rounded-3xl p-8 sm:p-12 relative overflow-hidden shadow-sm">
        <div className="max-w-3xl space-y-6">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-terracotta/10 text-terracotta text-xs font-semibold">
            <Tent className="w-4 h-4" />
            <span>Featured NeuroSage Event</span>
          </div>

          <div className="space-y-2">
            <h1 className="font-serif text-4xl sm:text-5xl text-deepBrown">
              {camp?.title || 'Brainwell Camp'}
            </h1>
            <p className="font-serif italic text-2xl text-terracotta">
              “{camp?.tagline || 'Revive your mind.'}”
            </p>
          </div>

          <p className="text-base text-secondaryText leading-relaxed">
            {camp?.description ||
              'Make space to pause, reconnect, and care for your mind. Brainwell Camp is a NeuroSage initiative designed to encourage mental-wellness awareness, mindful habits, and supportive conversations.'}
          </p>

          {/* Registration Status or CTA */}
          {myRegistration ? (
            <div className="p-4 rounded-2xl bg-ivory border border-sand space-y-3">
              <div className="flex items-center space-x-2 text-sm font-semibold text-deepBrown">
                <CheckCircle2 className="w-4 h-4 text-terracotta" />
                <span>You have an existing registration</span>
              </div>
              <div className="text-xs text-secondaryText space-y-1">
                <p>Reference: <strong>{myRegistration.reference}</strong> (FCFS Sequence #{myRegistration.sequenceNumber})</p>
                <p>
                  Status:{' '}
                  <span className="font-semibold text-deepBrown">
                    {myRegistration.registrationStatus === 'CONFIRMED'
                      ? `Confirmed Seat #${myRegistration.allocatedSeatNumber}`
                      : myRegistration.registrationStatus === 'WAITLISTED'
                      ? `Waitlisted (Position #${myRegistration.queueStats?.waitlistPosition || 1})`
                      : 'Pending Payment Verification'}
                  </span>
                </p>
              </div>
              <Link
                to="/dashboard/my-registrations"
                className="inline-flex items-center space-x-1.5 text-xs font-semibold text-terracotta hover:underline pt-1"
              >
                <span>View Full Registration Status & Audit Trail</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ) : (
            <div className="pt-2">
              <Link
                to="/dashboard/camps/brainwell/register"
                className="inline-flex items-center space-x-2 px-8 py-3.5 rounded-full text-sm font-semibold bg-terracotta text-white hover:bg-terracotta-dark shadow-sm transition-all"
              >
                <span>Register for Brainwell Camp — ₹49</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Camp Specifics & Policy Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-ivory border border-sand space-y-3">
          <div className="p-2 w-fit rounded-lg bg-cream text-terracotta">
            <Calendar className="w-5 h-5" />
          </div>
          <h3 className="font-serif text-lg font-bold text-deepBrown">Schedule & Date</h3>
          <p className="text-xs text-secondaryText leading-relaxed">
            {camp?.dates || 'Details to be announced'}
          </p>
          <span className="text-[11px] text-terracotta font-medium">Configured by organizers</span>
        </div>

        <div className="p-6 rounded-2xl bg-ivory border border-sand space-y-3">
          <div className="p-2 w-fit rounded-lg bg-cream text-terracotta">
            <MapPin className="w-5 h-5" />
          </div>
          <h3 className="font-serif text-lg font-bold text-deepBrown">Venue</h3>
          <p className="text-xs text-secondaryText leading-relaxed">
            {camp?.venue || 'Details to be announced'}
          </p>
          <span className="text-[11px] text-terracotta font-medium">University campus or partner space</span>
        </div>

        <div className="p-6 rounded-2xl bg-ivory border border-sand space-y-3">
          <div className="p-2 w-fit rounded-lg bg-cream text-terracotta">
            <Users className="w-5 h-5" />
          </div>
          <h3 className="font-serif text-lg font-bold text-deepBrown">Fair Queue Capacity</h3>
          <p className="text-xs text-secondaryText leading-relaxed">
            Capacity: <strong>{camp?.capacity || 50} participants</strong>. Enforced via atomic first-come-first-served sequence ordering.
          </p>
          <span className="text-[11px] text-terracotta font-medium">Automatic waitlist enabled</span>
        </div>
      </div>

      {/* Registration Process & Verification Explanation */}
      <div className="p-8 rounded-2xl bg-cream/40 border border-sand space-y-6">
        <h3 className="font-serif text-2xl font-bold text-deepBrown">
          Registration Process & Fair Queue Policy
        </h3>
        <p className="text-sm text-secondaryText leading-relaxed">
          To ensure fairness and equal opportunity for every university student, registrations are processed under a strict, auditable queue policy:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-xs text-secondaryText">
          <div className="space-y-2">
            <span className="font-serif text-xl font-bold text-terracotta">Step 1</span>
            <p className="font-semibold text-deepBrown">Form Submission</p>
            <p>Fill in your verified student details, college year, and upload your ₹49 payment slip.</p>
          </div>

          <div className="space-y-2">
            <span className="font-serif text-xl font-bold text-terracotta">Step 2</span>
            <p className="font-semibold text-deepBrown">Atomic Sequence</p>
            <p>Our backend assigns you a monotonic sequence number that permanently locks in your fair queue position.</p>
          </div>

          <div className="space-y-2">
            <span className="font-serif text-xl font-bold text-terracotta">Step 3</span>
            <p className="font-semibold text-deepBrown">Payment Verification</p>
            <p>An authorized organizer verifies your payment slip. Seats are allocated strictly in queue order, not admin click order.</p>
          </div>

          <div className="space-y-2">
            <span className="font-serif text-xl font-bold text-terracotta">Step 4</span>
            <p className="font-semibold text-deepBrown">Confirmation or Waitlist</p>
            <p>If capacity is reached, you are waitlisted. If a participant cancels, the earliest eligible waitlisted student is automatically promoted.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
