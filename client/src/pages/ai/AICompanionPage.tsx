import React from 'react';
import { Sparkles } from 'lucide-react';

export const AICompanionPage: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto py-8">
      <div className="bg-cream/60 border border-sand rounded-3xl p-8 sm:p-12 space-y-6 text-center sm:text-left">
        <div className="flex items-center space-x-3">
          <span className="p-3 rounded-2xl bg-rose-dusty/30 text-terracotta">
            <Sparkles className="w-6 h-6" />
          </span>
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-sand/70 text-deepBrown">
            Coming Soon
          </span>
        </div>

        <div className="space-y-3">
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-deepBrown">
            AI Wellness Companion
          </h1>
          <p className="text-sm sm:text-base text-secondaryText leading-relaxed max-w-xl">
            Our supportive AI chatbot for reflection, stress grounding, and mindful check-ins is currently in development.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-ivory border border-sand text-xs text-secondaryText leading-relaxed">
          NeuroSage is taking the time to build this experience thoughtfully, privately, and responsibly. It will be available here soon.
        </div>
      </div>
    </div>
  );
};
