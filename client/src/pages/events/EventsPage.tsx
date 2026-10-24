import React, { useEffect, useState } from 'react';
import { CalendarDays, MapPin, Monitor, ArrowUpRight, Ticket } from 'lucide-react';
import { eventApi } from '../../services/api';
import { Event } from '../../types';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

export const EventsPage: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    eventApi.list().then((response) => {
      if (response.success) setEvents(response.events);
    }).catch((error) => console.error('Failed to load events:', error))
      .finally(() => setLoading(false));
  }, []);

  const registrationUrl = 'https://www.neurosage.live/';

  return (
    <div className="space-y-8">
      <div className="border-b border-sand/70 pb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-terracotta/10 text-terracotta text-xs font-semibold">
          <CalendarDays className="w-4 h-4" /> Live events
        </div>
        <h1 className="font-serif text-4xl font-bold text-deepBrown mt-3">Events</h1>
        <p className="text-secondaryText mt-2 max-w-2xl">Discover upcoming NeuroSage events and register securely on neurosage.live.</p>
      </div>

      {loading ? <p className="text-sm text-secondaryText">Loading events...</p> : events.length === 0 ? (
        <div className="p-10 rounded-3xl border border-sand bg-cream/50 text-center text-secondaryText">No live events are published yet.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {events.map((event) => (
            <article key={event.id} className="overflow-hidden rounded-3xl bg-ivory border border-sand shadow-sm">
              <img src={`${API_BASE.replace(/\/api$/, '')}${event.posterUrl}`} alt={event.eventName} className="w-full h-56 object-cover" />
              <div className="p-6 space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <h2 className="font-serif text-2xl font-bold text-deepBrown">{event.eventName}</h2>
                  <span className="shrink-0 rounded-full bg-sage-light/50 px-3 py-1 text-xs font-semibold text-deepBrown">{event.mode === 'virtual' ? 'Virtual' : 'Live'}</span>
                </div>
                <div className="space-y-2 text-sm text-secondaryText">
                  <p className="flex items-center gap-2"><MapPin className="w-4 h-4 text-terracotta" />{event.location}</p>
                  <p className="flex items-center gap-2"><Ticket className="w-4 h-4 text-terracotta" />Registration fee: ₹{event.registrationFee}</p>
                  {event.mode === 'virtual' && <p className="flex items-center gap-2"><Monitor className="w-4 h-4 text-terracotta" />Attend online</p>}
                </div>
                <a href={registrationUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-terracotta px-5 py-3 text-sm font-semibold text-white hover:bg-terracotta-dark">
                  Register for this event <ArrowUpRight className="w-4 h-4" />
                </a>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};
