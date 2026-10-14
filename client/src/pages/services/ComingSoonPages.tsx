import React, { useState } from 'react';
import { Pill, Stethoscope, BookOpen, Bell, CheckCircle2, Heart } from 'lucide-react';

interface ComingSoonProps {
  type: 'pharmacy' | 'doctors' | 'books';
}

export const PharmacyPage: React.FC = () => {
  const [notified, setNotified] = useState(() => {
    return localStorage.getItem('neurosage_interest_pharmacy') === 'true';
  });

  const handleToggleInterest = () => {
    const next = !notified;
    setNotified(next);
    localStorage.setItem('neurosage_interest_pharmacy', String(next));
  };

  return (
    <div className="max-w-3xl mx-auto py-8 space-y-8">
      <div className="bg-cream/60 border border-sand rounded-3xl p-8 sm:p-12 space-y-6 text-center sm:text-left">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <span className="p-3 rounded-2xl bg-terracotta/10 text-terracotta">
              <Pill className="w-6 h-6" />
            </span>
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-sand/70 text-deepBrown">
              Coming Soon
            </span>
          </div>
        </div>

        <div className="space-y-3">
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-deepBrown">
            Wellness Pharmacy
          </h1>
          <p className="text-sm sm:text-base text-secondaryText leading-relaxed max-w-xl">
            NeuroSage is developing an accessible, transparent pathway for essential nutritional supplements, sleep hygiene aids, and verified campus wellness necessities.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-ivory border border-sand text-xs text-secondaryText leading-relaxed space-y-2">
          <p className="font-semibold text-deepBrown">Transparent Platform Note:</p>
          <p>
            This service is currently in development. NeuroSage does not sell or distribute prescription medications or medical drugs online. All future offerings will strictly adhere to verified healthcare regulations.
          </p>
        </div>

        <div className="pt-2">
          <button
            onClick={handleToggleInterest}
            className={`inline-flex items-center space-x-2 px-6 py-3 rounded-full text-xs font-semibold transition-all ${
              notified
                ? 'bg-sage-light/60 text-deepBrown border border-sage'
                : 'bg-terracotta text-white hover:bg-terracotta-dark shadow-sm'
            }`}
          >
            {notified ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-deepBrown" />
                <span>You're on the interest notification list</span>
              </>
            ) : (
              <>
                <Bell className="w-4 h-4" />
                <span>Notify me when Pharmacy launches</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export const DoctorsPage: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto py-8 space-y-8">
      <div className="bg-cream/60 border border-sand rounded-3xl p-8 sm:p-12 space-y-6 text-center sm:text-left">
        <div className="flex items-center space-x-3">
          <span className="p-3 rounded-2xl bg-sage/20 text-deepBrown">
            <Stethoscope className="w-6 h-6" />
          </span>
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-sand/70 text-deepBrown">
            Coming Soon
          </span>
        </div>

        <div className="space-y-3">
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-deepBrown">
            Mental Wellness Professionals
          </h1>
          <p className="text-sm sm:text-base text-secondaryText leading-relaxed max-w-xl">
            A future verified directory of licensed clinical psychologists, student counselors, and psychiatric professionals who understand student life.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-ivory border border-sand text-xs text-secondaryText leading-relaxed space-y-2">
          <p className="font-semibold text-deepBrown">Clear Medical Notice:</p>
          <p>
            Professional appointments and medical consultations are not yet available through NeuroSage. We do not display fabricated doctors or false credentials.
          </p>
          <p className="pt-1">
            If you need urgent assistance today, please reach out directly to <strong>Tele-MANAS (14416)</strong> or your campus health center.
          </p>
        </div>
      </div>
    </div>
  );
};

export const BooksPage: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto py-8 space-y-8">
      <div className="bg-cream/60 border border-sand rounded-3xl p-8 sm:p-12 space-y-6 text-center sm:text-left">
        <div className="flex items-center space-x-3">
          <span className="p-3 rounded-2xl bg-rose-dusty/30 text-deepBrown">
            <BookOpen className="w-6 h-6" />
          </span>
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-sand/70 text-deepBrown">
            Coming Soon
          </span>
        </div>

        <div className="space-y-3">
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-deepBrown">
            A Library for the Mind
          </h1>
          <p className="text-sm sm:text-base text-secondaryText leading-relaxed max-w-xl">
            A thoughtfully curated reading sanctuary featuring bibliotherapy, gentle psychology literature, and mindful guides crafted to support young adults.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-ivory border border-sand text-xs text-secondaryText leading-relaxed space-y-2">
          <p className="font-semibold text-deepBrown">Reading Philosophy:</p>
          <p>
            Books can offer language to emotions that once felt impossible to express. Our upcoming library will focus on compassionate, evidence-informed reading rather than generic self-help tropes.
          </p>
        </div>
      </div>
    </div>
  );
};
