import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, CalendarDays, Pencil, Plus, Trash2, X } from 'lucide-react';
import { eventApi } from '../../services/api';
import { Event } from '../../types';

type EventForm = {
  eventName: string;
  registrationFee: string;
  location: string;
  mode: 'virtual' | 'live';
  poster: File | null;
};

const emptyForm: EventForm = { eventName: '', registrationFee: '0', location: '', mode: 'live', poster: null };
const API_BASE = import.meta.env.VITE_API_URL || '/api';

export const EventAdminPage: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [form, setForm] = useState<EventForm>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const loadEvents = async () => {
    const result = await eventApi.list();
    if (result.success) setEvents(result.events);
  };

  useEffect(() => {
    loadEvents().catch((error) => setMessage(error.message)).finally(() => setLoading(false));
  }, []);

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(true);
  };

  const openEdit = (event: Event) => {
    setEditingId(event.id);
    setForm({ eventName: event.eventName, registrationFee: String(event.registrationFee), location: event.location, mode: event.mode, poster: null });
    setShowForm(true);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingId && !form.poster) {
      setMessage('A poster is required when creating an event.');
      return;
    }
    setSaving(true);
    const data = new FormData();
    data.append('eventName', form.eventName);
    data.append('registrationFee', form.registrationFee);
    data.append('location', form.location);
    data.append('mode', form.mode);
    if (form.poster) data.append('poster', form.poster);
    try {
      if (editingId) await eventApi.update(editingId, data);
      else await eventApi.create(data);
      setMessage(editingId ? 'Event updated successfully.' : 'Event created successfully.');
      setShowForm(false);
      await loadEvents();
    } catch (error: any) {
      setMessage(error.message || 'Unable to save event.');
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: string) => {
    if (!window.confirm('Delete this event?')) return;
    try {
      await eventApi.remove(id);
      setMessage('Event deleted successfully.');
      await loadEvents();
    } catch (error: any) {
      setMessage(error.message || 'Unable to delete event.');
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-sand/70 pb-5">
        <div>
          <Link to="/admin" className="inline-flex items-center gap-1 text-xs text-terracotta hover:underline mb-3"><ArrowLeft className="w-3.5 h-3.5" /> Admin panel</Link>
          <h1 className="font-serif text-4xl font-bold text-deepBrown flex items-center gap-2"><CalendarDays className="w-7 h-7 text-terracotta" /> Events</h1>
          <p className="text-sm text-secondaryText mt-2">Publish and manage the live events shown to users.</p>
        </div>
        <button onClick={openCreate} className="inline-flex items-center justify-center gap-2 rounded-full bg-terracotta px-5 py-3 text-sm font-semibold text-white hover:bg-terracotta-dark"><Plus className="w-4 h-4" /> Create Event</button>
      </div>

      {message && <div className="flex items-center justify-between rounded-xl border border-sand bg-cream/70 p-4 text-sm text-deepBrown"><span>{message}</span><button onClick={() => setMessage('')}><X className="w-4 h-4" /></button></div>}

      {showForm && (
        <form onSubmit={submit} className="rounded-3xl border border-sand bg-cream/60 p-6 space-y-4">
          <h2 className="font-serif text-2xl font-bold text-deepBrown">{editingId ? 'Update Event' : 'Create Event'}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="text-xs font-semibold text-deepBrown">Event name<input required value={form.eventName} onChange={(e) => setForm({ ...form, eventName: e.target.value })} className="mt-1 w-full rounded-lg border border-sand bg-ivory p-2.5 text-sm font-normal" /></label>
            <label className="text-xs font-semibold text-deepBrown">Registration fee (₹)<input required type="number" min="0" value={form.registrationFee} onChange={(e) => setForm({ ...form, registrationFee: e.target.value })} className="mt-1 w-full rounded-lg border border-sand bg-ivory p-2.5 text-sm font-normal" /></label>
            <label className="text-xs font-semibold text-deepBrown">Location<input required value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className="mt-1 w-full rounded-lg border border-sand bg-ivory p-2.5 text-sm font-normal" /></label>
            <label className="text-xs font-semibold text-deepBrown">Event type<select value={form.mode} onChange={(e) => setForm({ ...form, mode: e.target.value as EventForm['mode'] })} className="mt-1 w-full rounded-lg border border-sand bg-ivory p-2.5 text-sm font-normal"><option value="live">Live</option><option value="virtual">Virtual</option></select></label>
          </div>
          <label className="block text-xs font-semibold text-deepBrown">Poster {editingId && <span className="font-normal text-secondaryText">(optional when updating)</span>}<input required={!editingId} type="file" accept="image/png,image/jpeg" onChange={(e) => setForm({ ...form, poster: e.target.files?.[0] || null })} className="mt-1 block w-full text-sm font-normal" /></label>
          <div className="flex gap-3"><button disabled={saving} className="rounded-full bg-deepBrown px-5 py-2.5 text-sm font-semibold text-white">{saving ? 'Saving...' : editingId ? 'Update Event' : 'Create Event'}</button><button type="button" onClick={() => setShowForm(false)} className="rounded-full border border-sand px-5 py-2.5 text-sm font-semibold text-deepBrown">Cancel</button></div>
        </form>
      )}

      {loading ? <p className="text-sm text-secondaryText">Loading events...</p> : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {events.map((event) => <article key={event.id} className="overflow-hidden rounded-3xl border border-sand bg-ivory">
            <img src={`${API_BASE.replace(/\/api$/, '')}${event.posterUrl}`} alt={event.eventName} className="h-48 w-full object-cover" />
            <div className="p-5"><div className="flex items-start justify-between gap-3"><div><h2 className="font-serif text-xl font-bold text-deepBrown">{event.eventName}</h2><p className="mt-1 text-xs text-secondaryText">{event.location} · ₹{event.registrationFee} · {event.mode}</p></div><div className="flex gap-1"><button title="Edit event" onClick={() => openEdit(event)} className="rounded-lg p-2 text-terracotta hover:bg-cream"><Pencil className="w-4 h-4" /></button><button title="Delete event" onClick={() => remove(event.id)} className="rounded-lg p-2 text-errorDark hover:bg-rose-dusty/20"><Trash2 className="w-4 h-4" /></button></div></div></div>
          </article>)}
          {events.length === 0 && <div className="col-span-full rounded-3xl border border-sand bg-cream/50 p-10 text-center text-secondaryText">No events created yet.</div>}
        </div>
      )}
    </div>
  );
};
