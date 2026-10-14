import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';
import {
  ArrowRight,
  Sparkles,
  Focus,
  Tent,
  Pill,
  Stethoscope,
  BookOpen,
  CheckCircle2,
  Phone,
  ShieldCheck,
  Heart,
  Calendar,
  Users,
  Compass,
} from 'lucide-react';

const CONDITIONS = [
  {
    num: '1',
    title: 'ADHD',
    category: 'Neurodevelopmental',
    desc: 'A condition involving persistent inattention and/or hyperactivity-impulsivity.',
    symptoms: ['Distractibility', 'Difficulty organizing tasks', 'Restlessness', 'Acting before thinking'],
  },
  {
    num: '2',
    title: 'PHOBIAS',
    category: 'Anxiety',
    desc: 'Intense, persistent fear of a particular object, situation, or social setting.',
    symptoms: ['Specific phobia & social anxiety', 'Strong avoidance', 'Physical symptoms like trembling or nausea'],
  },
  {
    num: '3',
    title: 'DEPRESSION',
    category: 'Mood',
    desc: 'Persistent low mood or loss of interest that affects daily functioning and energy.',
    symptoms: ['Pervasive sadness', 'Low energy & fatigue', 'Changes in sleep/appetite', 'Feelings of hopelessness'],
  },
  {
    num: '4',
    title: 'PTSD',
    category: 'Trauma-Related',
    desc: 'Can develop after experiencing or witnessing distressing, traumatic events.',
    symptoms: ['Intrusive memories & flashbacks', 'Nightmares', 'Emotional avoidance', 'Feeling constantly on guard'],
  },
  {
    num: '5',
    title: 'OCD',
    category: 'Obsessive-Compulsive',
    desc: 'Obsessions and/or compulsions that cause distress or interfere with daily routines.',
    symptoms: ['Repeated checking & washing', 'Counting rituals', 'Intrusive upsetting thoughts'],
  },
  {
    num: '6',
    title: 'BIPOLAR DISORDER',
    category: 'Mood Spectrum',
    desc: 'Involves distinct episodes of low depressive mood and elevated mania or hypomania.',
    symptoms: ['Major energy & sleep shifts', 'Shifting activity levels', 'Changes in thought pacing'],
  },
  {
    num: '7',
    title: 'INSOMNIA',
    category: 'Sleep-Wake',
    desc: 'Ongoing difficulty falling asleep, staying asleep, or achieving restorative rest.',
    symptoms: ['Daytime tiredness & brain fog', 'Poor focus', 'Irritability and low mood'],
  },
  {
    num: '8',
    title: 'SCHIZOPHRENIA',
    category: 'Perception & Cognition',
    desc: 'A complex condition that can affect perception, thought processes, and daily functioning.',
    symptoms: ['Altered sensory perceptions', 'Unusual beliefs', 'Disorganized speech', 'Reduced motivation'],
  },
  {
    num: '9',
    title: 'PARANOIA',
    category: 'Perception',
    desc: 'Strong mistrust or suspicion that can have various causes and is not by itself a diagnosis.',
    symptoms: ['Feeling threatened without evidence', 'Difficulty trusting peers', 'Interpreting neutral actions as hostile'],
  },
  {
    num: '10',
    title: 'PANIC DISORDER',
    category: 'Anxiety',
    desc: 'Recurrent, unexpected panic attacks and acute distress about having future episodes.',
    symptoms: ['Racing heartbeat', 'Shortness of breath', 'Sweating & chest tightness', 'Sudden fear of losing control'],
  },
];

export const LandingPage: React.FC = () => {
  const { user } = useAuth();
  const [selectedCondition, setSelectedCondition] = useState(0);

  return (
    <div className="min-h-screen bg-ivory text-deepBrown flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-32 px-4 sm:px-6 lg:px-8 border-b border-sand/50 overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6">
              {/* Tagline Pill */}
              <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-cream border border-sand text-xs font-medium text-terracotta">
                <Heart className="w-3.5 h-3.5 text-terracotta fill-terracotta/20" />
                <span>Be kind to your mind</span>
              </div>

              {/* Headline */}
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl tracking-tight text-deepBrown leading-[1.12]">
                Your mind deserves <span className="italic font-normal text-terracotta">care</span>, too.
              </h1>

              {/* Supporting Copy */}
              <p className="text-base sm:text-lg text-secondaryText leading-relaxed max-w-xl">
                NeuroSage is a welcoming space to explore mental wellness, build healthier routines, find supportive resources, and take small steps toward a more balanced life.
              </p>

              {/* CTA Group */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
                <Link
                  to={user ? '/dashboard' : '/register'}
                  className="inline-flex items-center justify-center space-x-2 px-7 py-3.5 rounded-full text-sm font-semibold bg-terracotta text-white hover:bg-terracotta-dark shadow-sm hover:shadow transition-all"
                >
                  <span>Begin your journey</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <a
                  href="#brainwell-camp"
                  className="inline-flex items-center justify-center space-x-2 px-7 py-3.5 rounded-full text-sm font-medium bg-cream text-deepBrown border border-sand hover:bg-sand/40 transition-colors"
                >
                  <Tent className="w-4 h-4 text-terracotta" />
                  <span>Explore Brainwell Camp</span>
                </a>
              </div>

              {/* Key Trust Highlights */}
              <div className="pt-6 border-t border-sand/70 grid grid-cols-3 gap-4 text-xs text-secondaryText">
                <div>
                  <p className="font-semibold text-deepBrown text-sm">₹49 Camp</p>
                  <p>Accessible student fee</p>
                </div>
                <div>
                  <p className="font-semibold text-deepBrown text-sm">Fair FCFS</p>
                  <p>Auditable queue system</p>
                </div>
                <div>
                  <p className="font-semibold text-deepBrown text-sm">100% Private</p>
                  <p>Encrypted & confidential</p>
                </div>
              </div>
            </div>

            {/* Visual Column: Authentic Logo & Poster Showcase */}
            <div className="lg:col-span-5 relative flex justify-center">
              <div className="relative w-full max-w-md bg-cream/70 border border-sand p-6 rounded-2xl shadow-sm space-y-5">
                <div className="flex items-center space-x-4 pb-4 border-b border-sand/60">
                  <img
                    src="/neurosage-logo.png"
                    alt="NeuroSage Emblem"
                    className="w-16 h-16 object-contain"
                  />
                  <div>
                    <h2 className="font-serif text-2xl font-bold text-deepBrown leading-tight">
                      NeuroSage
                    </h2>
                    <p className="text-xs text-secondaryText italic">Awareness • Support • Kinder Campuses</p>
                  </div>
                </div>

                <div className="space-y-3 text-sm text-secondaryText leading-relaxed">
                  <p>
                    Mental health struggles in university and young adulthood are deeply common, yet rarely talked about with calm clarity.
                  </p>
                  <p>
                    Whether you are seeking focus through <strong>Body Doubling</strong>, gentle reflection with our <strong>AI Wellness Companion</strong>, or community connection at <strong>Brainwell Camp</strong>, NeuroSage walks with you at your pace.
                  </p>
                </div>

                {/* Subtle Quote Panel */}
                <div className="p-4 rounded-xl bg-ivory border border-sand/70 text-xs italic text-deepBrown">
                  “Different Minds, Same Dreams. A Healthier Mind, Brighter Tomorrows.”
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Introduction Section */}
      <section id="about" className="py-20 px-4 sm:px-6 lg:px-8 bg-ivory border-b border-sand/40">
        <div className="max-w-4xl mx-auto space-y-8 text-center sm:text-left">
          <div className="space-y-3">
            <span className="text-xs uppercase tracking-wider font-semibold text-terracotta">Our Philosophy</span>
            <h2 className="font-serif text-3xl sm:text-4xl text-deepBrown">
              Care designed for real human minds, not clinical checklists.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-base text-secondaryText leading-relaxed">
            <p>
              NeuroSage was founded to create an unhurried, reassuring sanctuary for students and young adults. We reject high-pressure productivity tracking and sterile clinical machinery. Instead, we offer warmth, quiet clarity, and practical focus.
            </p>
            <p>
              Our platform bridges the gap between daily self-care and structured community programs like our flagship <strong>Brainwell Camp</strong>. We openly acknowledge that recovery and mental wellness are not straight lines, and you don’t need to have everything figured out today.
            </p>
          </div>

          {/* Core Non-diagnostic Disclaimer */}
          <div className="p-5 rounded-xl bg-cream border border-sand/80 flex items-start space-x-3.5 text-xs text-secondaryText">
            <Compass className="w-5 h-5 text-terracotta flex-shrink-0 mt-0.5" />
            <p>
              <strong>Important Notice:</strong> NeuroSage is a supportive space for mental wellness education, guided reflection, and mindful habits. It does not cure psychological disorders or replace professional psychiatric or psychotherapeutic medical care.
            </p>
          </div>
        </div>
      </section>

      {/* Services Overview Section */}
      <section id="services" className="py-20 px-4 sm:px-6 lg:px-8 bg-cream/40 border-b border-sand/40">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="max-w-2xl space-y-3">
            <span className="text-xs uppercase tracking-wider font-semibold text-terracotta">Our Services</span>
            <h2 className="font-serif text-3xl sm:text-4xl text-deepBrown">
              Calm resources for your wellness journey.
            </h2>
            <p className="text-base text-secondaryText">
              Every tool and event is built around patient, humane pacing. Available today or coming soon to campus.
            </p>
          </div>

          {/* Editorial Service Panels */}
          <div className="space-y-6">
            {/* 1. Brainwell Camp (Active) */}
            <div className="p-8 rounded-2xl bg-ivory border-2 border-terracotta/30 shadow-sm transition-all hover:border-terracotta/60">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-3 max-w-2xl">
                  <div className="flex items-center space-x-3">
                    <span className="p-2 rounded-lg bg-terracotta/10 text-terracotta">
                      <Tent className="w-5 h-5" />
                    </span>
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-sage-light/40 text-deepBrown">
                      Featured Camp • Active Registration
                    </span>
                  </div>
                  <h3 className="font-serif text-2xl text-deepBrown">Brainwell Camp</h3>
                  <p className="text-sm text-secondaryText leading-relaxed">
                    “Revive your mind.” A hands-on, community-centered wellness initiative designed to encourage mindful habits, supportive peer conversations, and mental-wellness awareness. Available for ₹49 per participant.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row md:flex-col items-start md:items-end justify-between gap-4">
                  <span className="text-xl font-serif font-bold text-deepBrown">₹49 / seat</span>
                  <Link
                    to={user ? '/dashboard/camps/brainwell/register' : '/login'}
                    className="px-6 py-2.5 rounded-full text-sm font-semibold bg-terracotta text-white hover:bg-terracotta-dark transition-colors inline-flex items-center space-x-1.5"
                  >
                    <span>Register now</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>

            {/* 2. Body Doubling (Active) */}
            <div className="p-8 rounded-2xl bg-ivory border border-sand shadow-sm">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-3 max-w-2xl">
                  <div className="flex items-center space-x-3">
                    <span className="p-2 rounded-lg bg-sage/20 text-deepBrown">
                      <Focus className="w-5 h-5" />
                    </span>
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-sage/20 text-deepBrown">
                      Available Now
                    </span>
                  </div>
                  <h3 className="font-serif text-2xl text-deepBrown">Body Doubling Workspace</h3>
                  <p className="text-sm text-secondaryText leading-relaxed">
                    Overcome task paralysis, procrastination, and ADHD friction. Work calmly alongside a structured focus timer, calming ambient soundscapes, sensory box-breathing breaks, and achievable intentions.
                  </p>
                </div>
                <Link
                  to={user ? '/dashboard/body-doubling' : '/login'}
                  className="px-6 py-2.5 rounded-full text-sm font-medium bg-cream text-deepBrown border border-sand hover:bg-sand/40 transition-colors inline-flex items-center space-x-1.5"
                >
                  <span>Open workspace</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* 3. AI Mental Wellness Companion (Active) */}
            <div className="p-8 rounded-2xl bg-ivory border border-sand shadow-sm">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-3 max-w-2xl">
                  <div className="flex items-center space-x-3">
                    <span className="p-2 rounded-lg bg-rose-dusty/30 text-deepBrown">
                      <Sparkles className="w-5 h-5" />
                    </span>
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-rose-dusty/30 text-deepBrown">
                      Available Now • Non-Diagnostic
                    </span>
                  </div>
                  <h3 className="font-serif text-2xl text-deepBrown">AI Mental Wellness Companion</h3>
                  <p className="text-sm text-secondaryText leading-relaxed">
                    A private, compassionate conversational space for reflective thought, gentle CBT grounding exercises, and active de-stressing. Powered by Hugging Face models with built-in crisis helpline detection.
                  </p>
                </div>
                <Link
                  to={user ? '/dashboard/companion' : '/login'}
                  className="px-6 py-2.5 rounded-full text-sm font-medium bg-cream text-deepBrown border border-sand hover:bg-sand/40 transition-colors inline-flex items-center space-x-1.5"
                >
                  <span>Talk with Companion</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* 4. Upcoming Services Row (Pharmacy, Doctors, Books) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
              <div className="p-6 rounded-2xl bg-cream/60 border border-sand/80 space-y-3">
                <div className="flex items-center justify-between">
                  <Pill className="w-5 h-5 text-secondaryText" />
                  <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-sand/60 text-secondaryText">Coming soon</span>
                </div>
                <h4 className="font-serif text-lg text-deepBrown">Wellness Pharmacy</h4>
                <p className="text-xs text-secondaryText leading-relaxed">
                  Supportive access to essential wellness supplements and partner pharmacy resources without clinical jargon.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-cream/60 border border-sand/80 space-y-3">
                <div className="flex items-center justify-between">
                  <Stethoscope className="w-5 h-5 text-secondaryText" />
                  <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-sand/60 text-secondaryText">Coming soon</span>
                </div>
                <h4 className="font-serif text-lg text-deepBrown">Mental Wellness Doctors</h4>
                <p className="text-xs text-secondaryText leading-relaxed">
                  A verified directory of certified therapists, campus counselors, and psychiatric professionals.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-cream/60 border border-sand/80 space-y-3">
                <div className="flex items-center justify-between">
                  <BookOpen className="w-5 h-5 text-secondaryText" />
                  <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-sand/60 text-secondaryText">Coming soon</span>
                </div>
                <h4 className="font-serif text-lg text-deepBrown">A Library for the Mind</h4>
                <p className="text-xs text-secondaryText leading-relaxed">
                  Curated bibliotherapy, mindful literature, and gentle reading lists written for student well-being.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Event: Brainwell Camp Section */}
      <section id="brainwell-camp" className="py-24 px-4 sm:px-6 lg:px-8 bg-ivory border-b border-sand/50">
        <div className="max-w-6xl mx-auto">
          <div className="bg-gradient-to-br from-cream via-cream/80 to-sand/40 border border-sand rounded-3xl p-8 sm:p-12 lg:p-16">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              <div className="lg:col-span-7 space-y-6">
                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-terracotta/10 text-terracotta text-xs font-semibold">
                  <Tent className="w-3.5 h-3.5" />
                  <span>Flagship Event</span>
                </div>

                <div className="space-y-2">
                  <h2 className="font-serif text-4xl sm:text-5xl text-deepBrown">
                    Brainwell Camp
                  </h2>
                  <p className="font-serif italic text-xl text-terracotta">
                    “Revive your mind.”
                  </p>
                </div>

                <p className="text-base text-secondaryText leading-relaxed">
                  Make space to pause, reconnect, and care for your mind. Brainwell Camp is a NeuroSage initiative designed to encourage mental-wellness awareness, mindful habits, and supportive conversations.
                </p>

                <div className="space-y-3 text-sm text-deepBrown">
                  <div className="flex items-center space-x-3">
                    <CheckCircle2 className="w-4 h-4 text-terracotta flex-shrink-0" />
                    <span>Registration fee: <strong>₹49 per participant</strong> (accessible student tier).</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle2 className="w-4 h-4 text-terracotta flex-shrink-0" />
                    <span>Auditable First-Come-First-Served (FCFS) queue allocation.</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle2 className="w-4 h-4 text-terracotta flex-shrink-0" />
                    <span>Registration is subject to payment verification and capacity.</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-4 h-4 text-secondaryText flex-shrink-0" />
                    <span className="text-secondaryText">Venue and date: <em>Details to be announced</em>.</span>
                  </div>
                </div>

                <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
                  <Link
                    to={user ? '/dashboard/camps/brainwell/register' : '/login'}
                    className="inline-flex items-center justify-center space-x-2 px-8 py-3.5 rounded-full text-sm font-semibold bg-terracotta text-white hover:bg-terracotta-dark shadow-sm transition-all"
                  >
                    <span>Register for Brainwell Camp — ₹49</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    to="/dashboard/camps"
                    className="inline-flex items-center justify-center px-6 py-3.5 rounded-full text-sm font-medium bg-ivory text-deepBrown border border-sand hover:bg-sand/30 transition-colors"
                  >
                    View Camp Details
                  </Link>
                </div>
              </div>

              {/* Camp Visual Poster Highlights */}
              <div className="lg:col-span-5 flex justify-center">
                <div className="relative rounded-2xl overflow-hidden shadow-md border border-sand max-w-sm">
                  <img
                    src="/neurosage-poster.jpg"
                    alt="Brainwell Camp & Awareness Poster"
                    className="w-full h-auto object-cover"
                  />
                  <div className="p-4 bg-cream/95 border-t border-sand text-xs text-secondaryText">
                    <p className="font-semibold text-deepBrown">NeuroSage Awareness Drive</p>
                    <p>Listen • Support • Guide • Grow Together</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 10 Psychological Conditions Awareness Section (From Startup Poster) */}
      <section id="awareness" className="py-24 px-4 sm:px-6 lg:px-8 bg-cream/30 border-b border-sand/50">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs uppercase tracking-wider font-semibold text-terracotta">
              Mental Health Matters
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-deepBrown">
              10 Psychological Conditions, Understood.
            </h2>
            <p className="text-base text-secondaryText leading-relaxed">
              Different minds, same dreams. Exploring mental conditions with kindness and education reduces isolation on campus.
            </p>
          </div>

          {/* Interactive Condition Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {CONDITIONS.map((cond, idx) => (
              <div
                key={cond.title}
                className="p-6 rounded-2xl bg-ivory border border-sand hover:border-terracotta/40 transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-serif text-2xl font-bold text-terracotta">{cond.num}</span>
                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-sand/50 text-secondaryText">
                      {cond.category}
                    </span>
                  </div>
                  <h3 className="font-serif text-xl font-bold text-deepBrown">{cond.title}</h3>
                  <p className="text-xs text-secondaryText leading-relaxed">{cond.desc}</p>
                </div>

                <div className="pt-3 border-t border-sand/60">
                  <p className="text-[11px] font-semibold text-deepBrown mb-2">Common signs:</p>
                  <ul className="space-y-1">
                    {cond.symptoms.map((s) => (
                      <li key={s} className="text-xs text-secondaryText flex items-center space-x-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-terracotta flex-shrink-0" />
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          {/* Authentic disclaimer banner from poster */}
          <div className="p-4 rounded-xl bg-ivory border border-sand text-center text-xs text-secondaryText">
            <p>
              <strong>THIS POSTER IS FOR AWARENESS, NOT A DIAGNOSIS.</strong> Symptoms vary; a qualified mental health professional can help.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section: Verified Leads from Poster */}
      <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8 bg-ivory">
        <div className="max-w-4xl mx-auto">
          <div className="text-center space-y-3 mb-12">
            <span className="text-xs uppercase tracking-wider font-semibold text-terracotta">Reach Out</span>
            <h2 className="font-serif text-3xl sm:text-4xl text-deepBrown">
              You're Not Alone.
            </h2>
            <p className="text-base text-secondaryText">
              Connect with our student initiative leads or send us your thoughts.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="p-8 rounded-2xl bg-cream border border-sand space-y-3">
              <h3 className="font-serif text-xl font-bold text-deepBrown">Yash Chaudhary</h3>
              <p className="text-xs text-secondaryText">Student Lead • Campus Outreach</p>
              <div className="pt-2">
                <a
                  href="tel:8218030248"
                  className="inline-flex items-center space-x-2 text-sm font-semibold text-terracotta hover:underline"
                >
                  <Phone className="w-4 h-4" />
                  <span>8218030248</span>
                </a>
              </div>
            </div>

            <div className="p-8 rounded-2xl bg-cream border border-sand space-y-3">
              <h3 className="font-serif text-xl font-bold text-deepBrown">Ayush Singh</h3>
              <p className="text-xs text-secondaryText">Student Lead • Event Coordination</p>
              <div className="pt-2">
                <a
                  href="tel:7307998313"
                  className="inline-flex items-center space-x-2 text-sm font-semibold text-terracotta hover:underline"
                >
                  <Phone className="w-4 h-4" />
                  <span>7307998313</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};
