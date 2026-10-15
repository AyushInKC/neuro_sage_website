import React from 'react';
import styles from './QuoteTicker.module.css';

// Array of mental‑wellness quotes
const quotes = [
  "You don't have to figure everything out today.",
  "Small steps are still progress.",
  "Rest is part of the journey, not a reward for finishing it.",
  "Your worth is not measured by your productivity.",
  "One gentle step is enough to begin.",
  "You are allowed to take things at your own pace.",
  "Progress doesn't have to be perfect to be meaningful.",
  "Starting small is still starting.",
  "Your mind deserves patience, not punishment.",
  "A difficult day does not define your whole journey.",
  "Asking for help is a form of strength.",
  "Be kind to yourself while you figure things out.",
];

export const QuoteTicker: React.FC = () => {
  // Duplicate quotes for seamless looping
  const quotedItems = [...quotes, ...quotes];

  return (
    <div className="mt-6">
      <p className="text-sm text-terracotta mb-1">Words for your mind</p>
      <div className="overflow-hidden whitespace-nowrap bg-ivory py-2 rounded-lg" aria-label="mental wellness quotes ticker">
        <div className={styles.marquee} aria-hidden="true">
          {quotedItems.map((quote, idx) => (
            <span
              key={idx}
              className="inline-block mr-8 text-deepBrown whitespace-nowrap"
            >
              {quote}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
