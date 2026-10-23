import React, { useState, useEffect, useRef } from 'react';
import { bodyDoublingApi, liveBodyDoublingApi } from '../../services/api';
import { useNavigate } from 'react-router-dom';
import { BodyDoublingSession, TaskItem } from '../../types';
import {
  Focus,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  CheckCircle2,
  Circle,
  Plus,
  Trash2,
  Users,
  Check,
  LockKeyhole,
} from 'lucide-react';

export const BodyDoublingPage: React.FC = () => {
  const [session, setSession] = useState<BodyDoublingSession | null>(null);
  const [duration, setDuration] = useState(25);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [soundChoice, setSoundChoice] = useState<'none' | 'rain' | 'waves' | 'brown'>('none');

  const [intention, setIntention] = useState('');
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [newTaskText, setNewTaskText] = useState('');
  const [reflection, setReflection] = useState('');
  const [liveAccess, setLiveAccess] = useState({ approved: false, pending: false });
  const [paymentInfo, setPaymentInfo] = useState({ amount: 299, currency: 'INR', qrImageUrl: '', upiId: '' });
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [utr, setUtr] = useState('');
  const [paymentMessage, setPaymentMessage] = useState('');
  const navigate = useNavigate();

  // Web Audio Context for synthesizer soundscapes
  const audioCtxRef = useRef<AudioContext | null>(null);
  const soundNodeRef = useRef<any>(null);

  useEffect(() => {
    bodyDoublingApi
      .getActiveSession()
      .then((res) => {
        if (res.success && res.session) {
          setSession(res.session);
          setIntention(res.session.intention || '');
          setTasks(res.session.tasks || []);
          setDuration(res.session.durationMinutes || 25);
          setTimeLeft((res.session.durationMinutes || 25) * 60);
          setReflection(res.session.reflectionNotes || '');
        }
      })
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    Promise.all([liveBodyDoublingApi.getEntitlement(), liveBodyDoublingApi.getPaymentInfo()])
      .then(([entitlement, info]) => {
        setLiveAccess({ approved: entitlement.approved, pending: entitlement.pending });
        setPaymentInfo({ amount: info.amount, currency: info.currency, qrImageUrl: info.qrImageUrl, upiId: info.upiId });
      })
      .catch(() => {});
  }, []);

  const openLiveSession = async () => {
    try {
      const result = await liveBodyDoublingApi.getActiveSession();
      navigate(`/dashboard/body-doubling/live?session=${result.session.id}`);
    } catch (err: any) {
      setPaymentMessage(err.message || 'No live session is currently available.');
    }
  };

  const submitPayment = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const result = await liveBodyDoublingApi.submitPayment(utr);
      setPaymentMessage(result.message);
      setLiveAccess({ approved: false, pending: true });
      setUtr('');
      setPaymentOpen(false);
    } catch (err: any) {
      setPaymentMessage(err.message || 'Payment could not be submitted.');
    }
  };

  // Timer tick
  useEffect(() => {
    let interval: any = null;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      setIsRunning(false);
      stopSound();
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  // Ambient sound generation using Web Audio API
  const startSound = (type: string) => {
    stopSound();
    if (type === 'none') return;

    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;

      const bufferSize = ctx.sampleRate * 2;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);

      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        if (type === 'brown') {
          data[i] = (lastOut + 0.02 * white) / 1.02;
          lastOut = data[i];
          data[i] *= 3.5;
        } else if (type === 'rain') {
          data[i] = (lastOut + 0.05 * white) / 1.05;
          lastOut = data[i];
          data[i] *= 1.8;
        } else {
          // Waves
          data[i] = (lastOut + 0.03 * white) / 1.03;
          lastOut = data[i];
          data[i] *= 2.0;
        }
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      noise.loop = true;

      const gain = ctx.createGain();
      gain.gain.value = 0.08;

      noise.connect(gain);
      gain.connect(ctx.destination);
      noise.start(0);

      soundNodeRef.current = { ctx, noise };
    } catch (e) {
      console.warn('Audio synthesis not supported:', e);
    }
  };

  const stopSound = () => {
    if (soundNodeRef.current) {
      try {
        soundNodeRef.current.noise.stop();
        soundNodeRef.current.ctx.close();
      } catch (e) {}
      soundNodeRef.current = null;
    }
  };

  const handleSoundChange = (choice: 'none' | 'rain' | 'waves' | 'brown') => {
    setSoundChoice(choice);
    if (choice === 'none') {
      stopSound();
    } else {
      startSound(choice);
    }
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskText.trim()) return;
    const item: TaskItem = {
      id: Date.now().toString(),
      text: newTaskText.trim(),
      completed: false,
    };
    const updated = [...tasks, item];
    setTasks(updated);
    setNewTaskText('');
    saveSession({ tasks: updated });
  };

  const handleToggleTask = (id: string) => {
    const updated = tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t));
    setTasks(updated);
    saveSession({ tasks: updated });
  };

  const handleDeleteTask = (id: string) => {
    const updated = tasks.filter((t) => t.id !== id);
    setTasks(updated);
    saveSession({ tasks: updated });
  };

  const saveSession = (overrides: Partial<BodyDoublingSession> = {}) => {
    if (!session?._id) return;
    bodyDoublingApi
      .updateSession(session._id, {
        intention,
        tasks,
        durationMinutes: duration,
        soundAmbience: soundChoice,
        reflectionNotes: reflection,
        ...overrides,
      })
      .catch((err) => console.error(err));
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-sand/70 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-1.5 rounded-lg bg-sage/20 text-deepBrown">
              <Focus className="w-4 h-4" />
            </span>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-deepBrown">
              Body Doubling Workspace
            </h1>
          </div>
          <p className="text-xs text-secondaryText mt-0.5">
            Focus gently alongside a calm partner. Overcome friction with simple steps and sensory sound.
          </p>
        </div>

        {/* Live Community Doubling Status */}
        <div className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-cream border border-sand text-xs text-deepBrown">
          <span className="w-2 h-2 rounded-full bg-sage animate-ping" />
          <Users className="w-3.5 h-3.5 text-secondaryText" />
          <span><strong>14 members</strong> focusing right now</span>
        </div>
      </div>

      {/* Main Grid: Timer on Left, Tasks on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Focus Timer */}
        <div className="lg:col-span-7 space-y-6">
          {/* Timer Card */}
          <div className="bg-cream/60 border border-sand rounded-3xl p-8 text-center space-y-6 shadow-sm">
            {/* Intention banner */}
            <div className="max-w-md mx-auto">
              <input
                type="text"
                value={intention}
                onChange={(e) => setIntention(e.target.value)}
                onBlur={() => saveSession({ intention })}
                placeholder="What is your focus for this block? (e.g. Draft 1 paragraph)"
                className="w-full text-center px-4 py-2 rounded-full border border-sand bg-ivory text-xs sm:text-sm text-deepBrown placeholder-secondaryText/60 focus:border-terracotta focus:ring-1 focus:ring-terracotta"
              />
            </div>

            {/* Big Calm Timer Display */}
            <div className="py-4">
              <span className="font-serif text-6xl sm:text-7xl font-bold tracking-tight text-deepBrown">
                {formatTime(timeLeft)}
              </span>
              <p className="text-xs text-secondaryText mt-2 font-medium">
                {isRunning ? 'Currently focusing in flow' : 'Session paused — ready when you are'}
              </p>
            </div>

            {/* Timer Controls */}
            <div className="flex items-center justify-center space-x-4">
              <button
                onClick={() => setIsRunning(!isRunning)}
                className="flex items-center space-x-2 px-8 py-3.5 rounded-full text-sm font-semibold bg-terracotta text-white hover:bg-terracotta-dark shadow-sm transition-all"
              >
                {isRunning ? (
                  <>
                    <Pause className="w-4 h-4" />
                    <span>Pause</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 ml-0.5" />
                    <span>Start Focus</span>
                  </>
                )}
              </button>

              <button
                onClick={() => {
                  setIsRunning(false);
                  setTimeLeft(duration * 60);
                  stopSound();
                }}
                className="p-3.5 rounded-full bg-ivory text-secondaryText hover:text-deepBrown border border-sand hover:bg-sand/30 transition-colors"
                title="Reset timer"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            {/* Duration presets */}
            <div className="flex justify-center items-center space-x-2 pt-2 text-xs">
              {[15, 25, 45, 60].map((mins) => (
                <button
                  key={mins}
                  onClick={() => {
                    setDuration(mins);
                    setTimeLeft(mins * 60);
                    setIsRunning(false);
                    saveSession({ durationMinutes: mins });
                  }}
                  className={`px-3 py-1.5 rounded-full transition-colors ${
                    duration === mins
                      ? 'bg-deepBrown text-white font-medium'
                      : 'bg-ivory border border-sand text-secondaryText hover:text-deepBrown'
                  }`}
                >
                  {mins}m
                </button>
              ))}
            </div>

            {/* Ambient Soundscape Controls */}
            <div className="pt-4 border-t border-sand/60 flex flex-wrap items-center justify-center gap-2 text-xs">
              <span className="text-secondaryText font-medium mr-1 flex items-center space-x-1">
                {soundChoice === 'none' ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-terracotta" />}
                <span>Soundscape:</span>
              </span>
              {[
                { id: 'none', label: 'Silence' },
                { id: 'rain', label: 'Gentle Rain' },
                { id: 'waves', label: 'Ocean Waves' },
                { id: 'brown', label: 'Deep Brown Noise' },
              ].map((s) => (
                <button
                  key={s.id}
                  onClick={() => handleSoundChange(s.id as any)}
                  className={`px-3 py-1 rounded-full text-xs transition-colors ${
                    soundChoice === s.id
                      ? 'bg-terracotta text-white font-medium'
                      : 'bg-ivory border border-sand text-secondaryText hover:text-deepBrown'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: Manageable Tasks Checklist */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-ivory border border-sand rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
            <div className="space-y-1">
              <h2 className="font-serif text-xl font-bold text-deepBrown">
                Session Checklist
              </h2>
              <p className="text-xs text-secondaryText">
                Keep it bite-sized. Aim for 2 or 3 tiny, concrete actions.
              </p>
            </div>

            {/* Add Task Form */}
            <form onSubmit={handleAddTask} className="flex space-x-2">
              <input
                type="text"
                value={newTaskText}
                onChange={(e) => setNewTaskText(e.target.value)}
                placeholder="Add a manageable micro-step..."
                className="flex-1 px-3.5 py-2.5 rounded-xl border border-sand bg-cream/30 text-xs text-deepBrown placeholder-secondaryText/60 focus:border-terracotta focus:ring-1 focus:ring-terracotta"
              />
              <button
                type="submit"
                disabled={!newTaskText.trim()}
                className="p-2.5 rounded-xl bg-terracotta text-white hover:bg-terracotta-dark disabled:opacity-50 transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </form>

            {/* Task list */}
            <div className="space-y-2 min-h-[140px]">
              {tasks.length === 0 ? (
                <div className="text-center py-8 text-xs text-secondaryText italic border border-dashed border-sand rounded-xl p-4">
                  No tasks added yet. Start with one simple thing you can finish in 10 minutes.
                </div>
              ) : (
                tasks.map((task) => (
                  <div
                    key={task.id}
                    className={`flex items-center justify-between p-3 rounded-xl border transition-colors ${
                      task.completed
                        ? 'bg-cream/40 border-sand text-secondaryText line-through'
                        : 'bg-ivory border-sand text-deepBrown hover:border-terracotta/40'
                    }`}
                  >
                    <button
                      onClick={() => handleToggleTask(task.id)}
                      className="flex items-center space-x-2.5 text-xs text-left flex-1"
                    >
                      {task.completed ? (
                        <CheckCircle2 className="w-4 h-4 text-terracotta flex-shrink-0" />
                      ) : (
                        <Circle className="w-4 h-4 text-secondaryText flex-shrink-0" />
                      )}
                      <span>{task.text}</span>
                    </button>
                    <button
                      onClick={() => handleDeleteTask(task.id)}
                      className="p-1 text-secondaryText/60 hover:text-errorDark"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Post-session Reflection */}
            <div className="pt-4 border-t border-sand/60 space-y-2">
              <label className="block text-xs font-semibold text-deepBrown">
                Session Reflection Note
              </label>
              <textarea
                rows={2}
                value={reflection}
                onChange={(e) => setReflection(e.target.value)}
                onBlur={() => saveSession({ reflectionNotes: reflection })}
                placeholder="How did this focus block feel? What went well?"
                className="w-full p-3 rounded-xl border border-sand bg-cream/30 text-xs text-deepBrown placeholder-secondaryText/60 focus:border-terracotta focus:ring-1 focus:ring-terracotta"
              />
            </div>
          </div>

          <section className="bg-cream/70 border border-sand rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2">
                <LockKeyhole className="w-5 h-5 text-terracotta" />
                <h2 className="font-serif text-xl font-bold text-deepBrown">Live Body Doubling</h2>
              </div>
              <p className="text-sm text-secondaryText mt-2">Work alongside others with a live NeuroSage facilitator.</p>
              <p className="text-xs text-secondaryText mt-1">Includes access to live guided body-doubling sessions with NeuroSage facilitators.</p>
              {paymentMessage && <p className="text-xs text-terracotta mt-3">{paymentMessage}</p>}
            </div>
            {liveAccess.approved ? (
              <button onClick={openLiveSession} className="px-5 py-3 rounded-xl bg-terracotta text-white text-sm font-semibold hover:bg-terracotta-dark">
                Join Live Body Doubling
              </button>
            ) : liveAccess.pending ? (
              <span className="px-5 py-3 rounded-xl bg-sand/60 text-deepBrown text-sm font-semibold">Your payment is awaiting verification.</span>
            ) : (
              <button onClick={() => setPaymentOpen(true)} className="px-5 py-3 rounded-xl bg-terracotta text-white text-sm font-semibold hover:bg-terracotta-dark">
                Unlock Live Body Doubling - ₹299
              </button>
            )}
          </section>

          {paymentOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-deepBrown/50 backdrop-blur-sm">
              <form onSubmit={submitPayment} className="bg-cream border border-sand rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-xl">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif text-xl font-bold text-deepBrown">Unlock Live Body Doubling</h3>
                  <button type="button" onClick={() => setPaymentOpen(false)} className="text-secondaryText">Close</button>
                </div>
                <p className="text-2xl font-serif text-deepBrown">₹{paymentInfo.amount}</p>
                {paymentInfo.qrImageUrl ? <img src={paymentInfo.qrImageUrl} alt="UPI payment QR code" className="w-48 h-48 mx-auto object-contain border border-sand rounded-xl bg-white" /> : <div className="h-32 rounded-xl border border-dashed border-sand flex items-center justify-center text-xs text-secondaryText">QR code will appear here</div>}
                <p className="text-xs text-secondaryText text-center">Scan using any UPI app. UPI ID: <strong>{paymentInfo.upiId || 'Configured by NeuroSage'}</strong></p>
                <p className="text-xs text-secondaryText">After completing the payment, enter your UTR / transaction reference number below.</p>
                <input required minLength={6} value={utr} onChange={(event) => setUtr(event.target.value)} placeholder="Enter UTR / Transaction ID" className="w-full px-3 py-2.5 rounded-xl border border-sand bg-ivory text-sm" />
                <button type="submit" className="w-full py-3 rounded-xl bg-terracotta text-white text-sm font-semibold">I've Completed Payment</button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
