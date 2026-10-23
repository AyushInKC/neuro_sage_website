import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { QuoteTicker } from '../../components/dashboard/QuoteTicker';
import { useAuth } from '../../contexts/AuthContext';
import { campApi } from '../../services/api';
import { Registration } from '../../types';
import {
  Sparkles,
  Focus,
  Tent,
  ArrowRight,
  Heart,
  Calendar,
  CheckCircle2,
  Clock,
  Compass,
  Pill,
  Stethoscope,
  BookOpen,
} from 'lucide-react';

export const DashboardOverviewPage: React.FC = () => {
  const { user } = useAuth();
  const firstName = user?.name ? user.name.split(' ')[0] : 'Friend';

  const [myRegistration, setMyRegistration] = useState<Registration | null>(null);
  const [dailyIntention, setDailyIntention] = useState(() => {
    return localStorage.getItem(`neurosage_intention_${user?.id}`) || '';
  });
  const [intentionSaved, setIntentionSaved] = useState(false);

  useEffect(() => {
    campApi.getMyRegistrations().then((res) => {
      if (res.success && res.registrations?.length > 0) {
        setMyRegistration(res.registrations[0]);
      }
    }).catch(() => {});
  }, []);

  const handleSaveIntention = (e: React.FormEvent) => {
    e.preventDefault();
    if (user?.id) {
      localStorage.setItem(`neurosage_intention_${user.id}`, dailyIntention);
      setIntentionSaved(true);
      setTimeout(() => setIntentionSaved(false), 2500);
    }
  };

  return (
    <div className="space-y-10">
      {/* Personalized Greeting Header */}
      <div className="space-y-2 border-b border-sand/70 pb-6">
        <div className="inline-flex items-center space-x-2 text-xs font-medium text-terracotta bg-cream px-3 py-1 rounded-full border border-sand">
          <Heart className="w-3.5 h-3.5" />
          <span>A calm moment for yourself</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl text-deepBrown">
          Hello, {firstName}. Take today one step at a time.
        </h1>
        <p className="text-secondaryText text-sm sm:text-base max-w-2xl leading-relaxed">
          You don't have to figure everything out today. Start with one small thing that feels manageable.
        </p>
      </div>
{/* Quote Ticker */}
<QuoteTicker />

      {/* Prominent Brainwell Camp Section */}
      <div className="bg-cream/70 border border-sand rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-sm">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center space-x-2.5">
              <span className="p-2 bg-terracotta/10 text-terracotta rounded-xl">
                <Tent className="w-5 h-5" />
              </span>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-sand/80 text-deepBrown">
                Featured Event
              </span>
            </div>

            <div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-deepBrown">
                Brainwell Camp
              </h2>
              <p className="font-serif italic text-sm text-terracotta">
                “Revive your mind.”
              </p>
            </div>

            <p className="text-xs sm:text-sm text-secondaryText leading-relaxed">
              NeuroSage's flagship mental-wellness camp designed to encourage mindful habits, peer connection, and burnout recovery. ₹49 per participant.
            </p>

            {myRegistration ? (
              <div className="pt-2 flex items-center space-x-3 text-xs">
                <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-ivory border border-sand font-medium text-deepBrown">
                  <Clock className="w-3.5 h-3.5 text-terracotta" />
                  <span>
                    Status:{' '}
                    <strong>
                      {myRegistration.registrationStatus === 'CONFIRMED'
                        ? `Confirmed (Seat #${myRegistration.allocatedSeatNumber})`
                        : myRegistration.registrationStatus === 'WAITLISTED'
                        ? `Waitlisted (#${myRegistration.queueStats?.waitlistPosition || 1})`
                        : 'Awaiting Payment Verification'}
                    </strong>
                  </span>
                </div>
                <Link
                  to="/dashboard/my-registrations"
                  className="text-terracotta hover:underline font-semibold"
                >
                  View Details & Queue →
                </Link>
              </div>
            ) : (
              <p className="text-xs text-secondaryText">
                Registration is subject to payment verification and fair first-come-first-served capacity.
              </p>
            )}
          </div>

          <div className="flex-shrink-0">
            {myRegistration ? (
              <Link
                to="/dashboard/my-registrations"
                className="px-6 py-3 rounded-full text-sm font-semibold bg-terracotta text-white hover:bg-terracotta-dark transition-colors inline-flex items-center space-x-2"
              >
                <span>My Registration Details</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <Link
                to="/dashboard/camps/brainwell/register"
                className="px-6 py-3 rounded-full text-sm font-semibold bg-terracotta text-white hover:bg-terracotta-dark shadow-sm transition-all inline-flex items-center space-x-2"
              >
                <span>Register for Brainwell Camp — ₹49</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Quick Action Pillars: Body Doubling & AI Companion */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Quick Action: Body Doubling */}
        <div className="p-6 sm:p-8 rounded-2xl bg-ivory border border-sand hover:border-terracotta/40 transition-all flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="p-2.5 w-fit rounded-xl bg-sage/20 text-deepBrown">
              <Focus className="w-5 h-5 text-deepBrown" />
            </div>
            <h3 className="font-serif text-2xl font-bold text-deepBrown">
              ADHD Focus Zone - Body Doubling Workspace
            </h3>
            <p className="text-xs sm:text-sm text-secondaryText leading-relaxed">
              Stuck on an assignment or feeling overwhelmed by a task? Focus alongside gentle ambient soundscapes, a quiet timer, and a short, manageable checklist.
            </p>
          </div>
          <div className="pt-2">
            <Link
              to="/dashboard/body-doubling"
              className="inline-flex items-center space-x-2 text-sm font-semibold text-terracotta hover:underline"
            >
              <span>Start focus session</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Quick Action: AI Companion */}
        <div className="p-6 sm:p-8 rounded-2xl bg-ivory border border-sand hover:border-terracotta/40 transition-all flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="p-2.5 w-fit rounded-xl bg-rose-dusty/30 text-deepBrown">
              <Sparkles className="w-5 h-5 text-deepBrown" />
            </div>
            <h3 className="font-serif text-2xl font-bold text-deepBrown">
              AI Wellness Companion
            </h3>
            <p className="text-xs sm:text-sm text-secondaryText leading-relaxed">
              A private, unhurried space for emotional reflection, de-escalating exam anxiety, and guided CBT grounding.
            </p>
          </div>
          <div className="pt-2">
            <Link
              to="/dashboard/companion"
              className="inline-flex items-center space-x-2 text-sm font-semibold text-terracotta hover:underline"
            >
              <span>Open quiet chat</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* User-Controlled Daily Intention Note */}
      <div className="bg-ivory border border-sand rounded-2xl p-6 sm:p-8 space-y-4">
        <div className="flex items-center space-x-2 text-sm font-semibold text-deepBrown">
          <Compass className="w-4 h-4 text-terracotta" />
          <span>My Intention for Today</span>
        </div>
        <p className="text-xs text-secondaryText">
          What is one gentle anchor or realistic boundary you'd like to hold for yourself today?
        </p>
        <form onSubmit={handleSaveIntention} className="space-y-3">
          <input
            type="text"
            value={dailyIntention}
            onChange={(e) => setDailyIntention(e.target.value)}
            placeholder="e.g. Taking 10 minutes to walk outside without my phone, and allowing myself to rest."
            className="w-full px-4 py-3 rounded-xl border border-sand bg-cream/30 text-sm text-deepBrown placeholder-secondaryText/60 focus:border-terracotta focus:ring-1 focus:ring-terracotta"
          />
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold rounded-lg bg-sand/70 hover:bg-sand text-deepBrown transition-colors"
            >
              Save intention
            </button>
            {intentionSaved && (
              <span className="text-xs text-terracotta flex items-center space-x-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Saved for your day</span>
              </span>
            )}
          </div>
        </form>
      </div>

      {/* Upcoming Services Section */}
      <div className="space-y-4 pt-4 border-t border-sand/60">
        <div className="flex items-center justify-between">
          <h4 className="font-serif text-lg text-deepBrown font-bold">Upcoming Services</h4>
          <span className="text-xs text-secondaryText">In development for NeuroSage</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link
            to="/dashboard/pharmacy"
            className="p-4 rounded-xl bg-cream/40 border border-sand/70 hover:bg-cream transition-colors block"
          >
            <div className="flex items-center space-x-2 text-xs font-semibold text-deepBrown">
              <Pill className="w-4 h-4 text-secondaryText" />
              <span>Wellness Pharmacy</span>
            </div>
            <p className="text-[11px] text-secondaryText mt-1">Coming soon • Essential wellness supplies</p>
          </Link>

          <Link
            to="/dashboard/doctors"
            className="p-4 rounded-xl bg-cream/40 border border-sand/70 hover:bg-cream transition-colors block"
          >
            <div className="flex items-center space-x-2 text-xs font-semibold text-deepBrown">
              <Stethoscope className="w-4 h-4 text-secondaryText" />
              <span>Wellness Professionals</span>
            </div>
            <p className="text-[11px] text-secondaryText mt-1">Coming soon • Verified therapist directory</p>
          </Link>

          <Link
            to="/dashboard/books"
            className="p-4 rounded-xl bg-cream/40 border border-sand/70 hover:bg-cream transition-colors block"
          >
            <div className="flex items-center space-x-2 text-xs font-semibold text-deepBrown">
              <BookOpen className="w-4 h-4 text-secondaryText" />
              <span>Library for the Mind</span>
            </div>
            <p className="text-[11px] text-secondaryText mt-1">Coming soon • Curated wellness literature</p>
          </Link>
        </div>
      </div>
    </div>
  );
};
