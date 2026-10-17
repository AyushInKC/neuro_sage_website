import React, { useState } from 'react';
import { Pill, Stethoscope, BookOpen, Bell, CheckCircle2, ExternalLink } from 'lucide-react';

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

// ─── Books for the Mind ──────────────────────────────────────────────────────


const books = [
  {
    title: "Unmasking Autism",
    author: "Devon Price, PhD",
    description:
      "A deep look at what it costs to hide who you are. Covers masking, late diagnosis and autistic burnout, and how to build a life that doesn't need a performance.",
    readIf:
      "you've spent years acting 'normal' and feel exhausted by it.",
    cover:
      "https://covers.openlibrary.org/b/isbn/9780593235072-L.jpg?default=false",
    link: "https://www.goodreads.com/book/show/58985053-unmasking-autism",
    tag: "Autism",
    tagColor: "bg-purple-100 text-purple-700",
  },
  {
    title: "ADHD 2.0",
    author: "Edward Hallowell & John Ratey",
    description:
      "The authors of the classic return with new science and practical strategies. ADHD is treated as a brain wired differently, with real strengths to build on.",
    readIf: "you want a modern, strengths-based view of ADHD.",
    cover:
      "https://covers.openlibrary.org/b/isbn/9780399178740-L.jpg?default=false",
    link: "https://www.goodreads.com/book/show/53231851-adhd-2-0",
    tag: "ADHD",
    tagColor: "bg-blue-100 text-blue-700",
  },
  {
    title: "How to ADHD",
    author: "Jessica McCabe",
    description:
      "Built on the popular YouTube channel. Warm, practical and full of tools, with the message that you work with your brain rather than against it.",
    readIf: "you want strategies you can try this week.",
    cover:
      "https://covers.openlibrary.org/b/isbn/9780593578940-L.jpg?default=false",
    link: "https://www.goodreads.com/book/show/198839438-how-to-adhd",
    tag: "ADHD",
    tagColor: "bg-blue-100 text-blue-700",
  },
  {
    title: "NeuroTribes",
    author: "Steve Silberman",
    description:
      "A sweeping history of autism and neurodiversity. Challenges the idea that neurological difference is a defect, and reframes it as part of human diversity.",
    readIf:
      "you want to understand the history and science behind neurodiversity.",
    cover:
      "https://covers.openlibrary.org/b/isbn/9781592408191-L.jpg?default=false",
    link: "https://www.goodreads.com/book/show/22514020-neurotribes",
    tag: "Neurodiversity",
    tagColor: "bg-green-100 text-green-700",
  },
  {
    title: "Driven to Distraction",
    author: "Edward Hallowell & John Ratey",
    description:
      "The book that put adult ADHD on the map. Told through patient stories, it helps you recognise the pattern and understand what's going on.",
    readIf:
      "you're just starting to wonder, 'could this be me?'",
    cover:
      "https://covers.openlibrary.org/b/isbn/9780679423294-L.jpg?default=false",
    link: "https://www.goodreads.com/book/show/108593.Driven_to_Distraction",
    tag: "ADHD",
    tagColor: "bg-blue-100 text-blue-700",
  },
  {
    title: "Laziness Does Not Exist",
    author: "Devon Price, PhD",
    description:
      "Challenges the idea that struggling means you're lazy. Looks at burnout, shame and the hustle culture that quietly feeds them.",
    readIf:
      "you call yourself lazy more often than you'd call a friend that.",
    cover:
      "https://covers.openlibrary.org/b/isbn/9781982140106-L.jpg?default=false",
    link: "https://www.goodreads.com/book/show/54304084-laziness-does-not-exist",
    tag: "Mental Health",
    tagColor: "bg-rose-100 text-rose-700",
  },
  {
    title: "Order from Chaos",
    author: "Jaclyn Paul",
    description:
      "A practical, compassionate guide to managing a home and daily life with ADHD. Written by someone with ADHD, for people with ADHD.",
    readIf:
      "clutter and disorganisation are affecting your mental health.",
    cover:
      "https://covers.openlibrary.org/b/isbn/9781684033645-L.jpg?default=false",
    link: "https://www.goodreads.com/book/show/41058567-order-from-chaos",
    tag: "ADHD",
    tagColor: "bg-blue-100 text-blue-700",
  },
  {
    title: "Thinking in Pictures",
    author: "Temple Grandin",
    description:
      "Temple Grandin's firsthand account of life with autism and how visual thinking shapes her experience of the world — a landmark memoir.",
    readIf: "you want to understand autism from the inside.",
    cover:
      "https://covers.openlibrary.org/b/isbn/9780307275653-L.jpg?default=false",
    link: "https://www.goodreads.com/book/show/18719.Thinking_in_Pictures",
    tag: "Autism",
    tagColor: "bg-purple-100 text-purple-700",
  },
];


export const BooksPage: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto py-8 space-y-10">
      {/* Header */}
      <div className="bg-cream/60 border border-sand rounded-3xl p-8 sm:p-10 space-y-4 text-center sm:text-left">
        <div className="flex items-center space-x-3">
          <span className="p-3 rounded-2xl bg-rose-dusty/30 text-deepBrown">
            <BookOpen className="w-6 h-6" />
          </span>
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-sand/70 text-deepBrown">
            Books for the Mind
          </span>
        </div>

        <div className="space-y-2">
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-deepBrown">
            A Library for the Mind
          </h1>
          <p className="text-sm sm:text-base text-secondaryText leading-relaxed max-w-2xl">
            A thoughtfully curated reading sanctuary featuring bibliotherapy, gentle psychology literature,
            and mindful guides crafted to support young adults navigating neurodiversity.
          </p>
        </div>
      </div>

      {/* Books Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {books.map((book) => (
          <a
            key={book.title}
            href={book.link}
            target="_blank"
            rel="noopener noreferrer"
            className="group bg-cream/70 border border-sand rounded-2xl overflow-hidden hover:shadow-lg hover:border-terracotta/40 transition-all duration-300 flex flex-col"
          >
            {/* Book Cover */}
            <div className="relative bg-ivory flex items-center justify-center p-4 pt-6 min-h-[210px]">
              <img
                src={book.cover}
                alt={`${book.title} cover`}
                className="h-44 w-auto object-contain rounded-lg shadow-md group-hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    `https://placehold.co/150x220/f5ebe0/7c5c48?text=${encodeURIComponent(book.title)}`;
                }}
              />
              <span
                className={`absolute top-3 left-3 text-[10px] font-semibold px-2 py-0.5 rounded-full ${book.tagColor}`}
              >
                {book.tag}
              </span>
            </div>

            {/* Book Info */}
            <div className="p-4 flex flex-col flex-1 space-y-3">
              <div>
                <h3 className="font-serif text-base font-bold text-deepBrown leading-snug group-hover:text-terracotta transition-colors">
                  {book.title}
                </h3>
                <p className="text-xs text-secondaryText mt-0.5 italic">{book.author}</p>
              </div>

              <p className="text-xs text-secondaryText leading-relaxed flex-1">
                {book.description}
              </p>

              {/* Read it if... */}
              <div className="rounded-xl bg-terracotta/10 border border-terracotta/20 px-3 py-2">
                <p className="text-[10px] font-semibold text-terracotta uppercase tracking-wide mb-0.5">
                  Read it if…
                </p>
                <p className="text-xs text-deepBrown leading-snug">{book.readIf}</p>
              </div>

              {/* Link */}
              <div className="flex items-center justify-end pt-1">
                <span className="inline-flex items-center gap-1 text-[11px] text-terracotta font-medium group-hover:underline">
                  View on Goodreads <ExternalLink className="w-3 h-3" />
                </span>
              </div>
            </div>
          </a>
        ))}
      </div>

      {/* Reading philosophy note */}
      <div className="p-5 rounded-2xl bg-ivory border border-sand text-xs text-secondaryText leading-relaxed space-y-2">
        <p className="font-semibold text-deepBrown">Reading Philosophy:</p>
        <p>
          Books can offer language to emotions that once felt impossible to express. This list focuses on
          compassionate, evidence-informed reading — not generic self-help tropes. Each title was chosen
          because it sees neurodiversity as a difference, not a deficit.
        </p>
      </div>
    </div>
  );
};
