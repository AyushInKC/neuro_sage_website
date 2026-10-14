import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, ShieldAlert, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-cream border-t border-sand mt-24 text-secondaryText text-sm">
      {/* Crisis & Grounding Banner */}
      <div className="bg-rose-dusty/20 border-b border-sand py-4 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between text-xs text-deepBrown gap-2">
          <div className="flex items-center space-x-2">
            <ShieldAlert className="w-4 h-4 text-terracotta flex-shrink-0" />
            <span>
              <strong>Need immediate support?</strong> Tele-MANAS (Govt of India): <strong>14416</strong> | KIRAN: <strong>1800-599-0019</strong> | Vandrevala Foundation: <strong>+91 9999 666 555</strong>
            </span>
          </div>
          <span className="text-secondaryText">Available 24/7, confidential and toll-free</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand info */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center space-x-2.5">
              <img
                src="/neurosage-logo.png"
                alt="NeuroSage"
                className="h-8 w-auto object-contain"
              />
              <span className="font-serif text-xl font-bold text-deepBrown tracking-tight">
                NeuroSage
              </span>
            </div>
            <p className="text-sm leading-relaxed text-secondaryText">
              Be kind to your mind. A welcoming space for mental-wellness awareness, guided focus, supportive reflection, and student camps.
            </p>
            <div className="pt-2 text-xs text-secondaryText">
              <span>Awareness • Support • Kinder Campuses</span>
            </div>
          </div>

          {/* Initiatives & Quick links */}
          <div>
            <h4 className="font-serif text-deepBrown font-semibold text-base mb-4">Explore</h4>
            <ul className="space-y-2.5">
              <li>
                <a href="/#brainwell-camp" className="hover:text-terracotta transition-colors">
                  Brainwell Camp (₹49)
                </a>
              </li>
              <li>
                <a href="/#services" className="hover:text-terracotta transition-colors">
                  Our Services
                </a>
              </li>
              <li>
                <a href="/#awareness" className="hover:text-terracotta transition-colors">
                  Condition Awareness
                </a>
              </li>
              <li>
                <Link to="/dashboard/body-doubling" className="hover:text-terracotta transition-colors">
                  Body Doubling Space
                </Link>
              </li>
              <li>
                <Link to="/dashboard/companion" className="hover:text-terracotta transition-colors">
                  AI Wellness Companion
                </Link>
              </li>
            </ul>
          </div>

          {/* Coming Soon Resources */}
          <div>
            <h4 className="font-serif text-deepBrown font-semibold text-base mb-4">Upcoming</h4>
            <ul className="space-y-2.5">
              <li className="flex items-center space-x-2">
                <span>Wellness Pharmacy</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-sand/60 text-deepBrown">Soon</span>
              </li>
              <li className="flex items-center space-x-2">
                <span>Mental Wellness Doctors</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-sand/60 text-deepBrown">Soon</span>
              </li>
              <li className="flex items-center space-x-2">
                <span>Books & Mind Library</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-sand/60 text-deepBrown">Soon</span>
              </li>
            </ul>
          </div>

          {/* Verified Contact Details from Startup Poster */}
          <div>
            <h4 className="font-serif text-deepBrown font-semibold text-base mb-4">Reach Out</h4>
            <p className="text-xs text-secondaryText mb-3">
              You're not alone. Reach out to the NeuroSage student awareness leads:
            </p>
            <div className="space-y-2.5 text-xs text-deepBrown">
              <div className="flex items-center space-x-2">
                <Phone className="w-3.5 h-3.5 text-terracotta" />
                <span>Yash Chaudhary: <a href="tel:8218030248" className="hover:text-terracotta underline">8218030248</a></span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-3.5 h-3.5 text-terracotta" />
                <span>Ayush Singh: <a href="tel:7307998313" className="hover:text-terracotta underline">7307998313</a></span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-3.5 h-3.5 text-terracotta" />
                <span><a href="mailto:contact@neurosage.org" className="hover:text-terracotta underline">contact@neurosage.org</a></span>
              </div>
            </div>
          </div>
        </div>

        {/* Mental Health Disclaimer */}
        <div className="mt-12 pt-8 border-t border-sand/80 text-xs text-secondaryText leading-relaxed">
          <p className="mb-3">
            <strong>Mental Health Disclaimer:</strong> NeuroSage is an educational awareness, guided focus, and supportive self-reflection platform. Content, reflections, and AI companion responses provided on this platform are for general wellness awareness and personal reflection only, and do not constitute medical diagnosis, clinical treatment, psychiatric advice, or therapy. If you or someone you know is experiencing severe distress or thoughts of self-harm, please contact a qualified healthcare professional or an authorized emergency helpline immediately.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-between text-xs gap-4 mt-6">
            <p>© {new Date().getFullYear()} NeuroSage. All rights reserved. Be kind to your mind.</p>
            <div className="flex space-x-6">
              <a href="#privacy" className="hover:text-deepBrown transition-colors">Privacy Policy</a>
              <a href="#terms" className="hover:text-deepBrown transition-colors">Terms of Service</a>
              <a href="#cookies" className="hover:text-deepBrown transition-colors">Cookie Settings</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
