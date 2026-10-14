import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { User, ShieldCheck, Mail, Calendar, Heart } from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="space-y-2 border-b border-sand/70 pb-4">
        <h1 className="font-serif text-3xl font-bold text-deepBrown">
          My Account
        </h1>
        <p className="text-xs sm:text-sm text-secondaryText">
          Your private NeuroSage identity and preferences.
        </p>
      </div>

      <div className="bg-cream/60 border border-sand rounded-3xl p-8 space-y-6 shadow-sm">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 rounded-2xl bg-terracotta text-white flex items-center justify-center font-serif text-2xl font-bold shadow-sm">
            {user?.name?.charAt(0) || 'U'}
          </div>
          <div>
            <h2 className="font-serif text-2xl font-bold text-deepBrown">{user?.name}</h2>
            <div className="flex items-center space-x-2 text-xs text-secondaryText mt-0.5">
              <span>{user?.email}</span>
              <span className="inline-flex items-center space-x-1 text-terracotta">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Verified Account</span>
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-sand/60 text-xs">
          <div className="p-4 rounded-2xl bg-ivory border border-sand">
            <span className="text-secondaryText block">Platform Role</span>
            <span className="font-semibold text-deepBrown capitalize">{user?.role}</span>
          </div>

          <div className="p-4 rounded-2xl bg-ivory border border-sand">
            <span className="text-secondaryText block">Privacy Status</span>
            <span className="font-semibold text-deepBrown">Encrypted & Confidential</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-ivory border border-sand flex items-start space-x-3 text-xs text-secondaryText leading-relaxed">
          <Heart className="w-4 h-4 text-terracotta flex-shrink-0 mt-0.5" />
          <span>
            NeuroSage never sells your reflection history, focus logs, or uploaded documents. Your data remains strictly your own.
          </span>
        </div>
      </div>
    </div>
  );
};
