import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Activity,
  Check,
  Headphones,
  Info,
  Pause,
  Play,
  RotateCcw,
  Volume2,
  VolumeX,
  Wind,
  Zap,
} from 'lucide-react';

type BreathPhaseType = 'Inhale' | 'Hold' | 'Exhale';
type AudioMode = 'mute' | 'metronome' | 'guide';
type HoldVolume = 'high' | 'low';

type BreathPhase = {
  type: BreathPhaseType;
  duration: number;
  volume?: HoldVolume;
};

type BreathingTechnique = {
  id: string;
  name: string;
  description: string;
  significance: string;
  phases: BreathPhase[];
};

export const BREATHING_TECHNIQUES: BreathingTechnique[] = [
  {
    id: 'box',
    name: 'Box Breathing',
    description: 'A steady four-part rhythm for grounding and focus.',
    significance:
      'Box breathing gives the nervous system a predictable rhythm: equal inhales, holds, and exhales can support calmer autonomic regulation and reduce the sense of urgency. It is a useful reset before focused work, during a stressful moment, or whenever you want a simple, repeatable anchor.',
    phases: [
      { type: 'Inhale', duration: 4 },
      { type: 'Hold', duration: 4, volume: 'high' },
      { type: 'Exhale', duration: 4 },
      { type: 'Hold', duration: 4, volume: 'low' },
    ],
  },
  {
    id: '478',
    name: '4-7-8 Calm',
    description: 'A longer exhale to invite a slower, quieter pace.',
    significance:
      'The 4-7-8 pattern emphasizes a long exhale and a spacious pause, which may help shift attention away from racing thoughts and toward a calmer breathing rhythm. Use it for an evening wind-down, pre-sleep relaxation, or a deliberate pause after an emotionally demanding moment; never force the breath or hold if it feels uncomfortable.',
    phases: [
      { type: 'Inhale', duration: 4 },
      { type: 'Hold', duration: 7, volume: 'high' },
      { type: 'Exhale', duration: 8 },
    ],
  },
  {
    id: 'coherent',
    name: 'Coherent Breathing',
    description: 'A balanced five-second rhythm for sustained attention.',
    significance:
      'Coherent breathing uses a comfortable, balanced pace that can support steady attention and a sense of emotional regulation without demanding long breath holds. It works well for meditation, gentle concentration, and longer practice sessions when you want consistency rather than intensity.',
    phases: [
      { type: 'Inhale', duration: 5 },
      { type: 'Exhale', duration: 5 },
    ],
  },
];

const INITIAL_TECHNIQUE = BREATHING_TECHNIQUES[0];
const phaseLabel = (phase: BreathPhase) =>
  phase.type === 'Hold' && phase.volume === 'low' ? 'Rest' : phase.type;

export const BreathingExercisePage: React.FC = () => {
  const [techniqueId, setTechniqueId] = useState(INITIAL_TECHNIQUE.id);
  const [isRunning, setIsRunning] = useState(false);
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [secondsRemaining, setSecondsRemaining] = useState(INITIAL_TECHNIQUE.phases[0].duration);
  const [phaseProgress, setPhaseProgress] = useState(0);
  const [loopCount, setLoopCount] = useState(0);
  const [audioMode, setAudioMode] = useState<AudioMode>('guide');
  const [hapticsEnabled, setHapticsEnabled] = useState(false);
  const [hapticsAvailable, setHapticsAvailable] = useState(false);
  const [audioAvailable, setAudioAvailable] = useState(false);

  const audioContextRef = useRef<AudioContext | null>(null);
  const audioNodesRef = useRef<OscillatorNode[]>([]);
  const phaseIndexRef = useRef(0);
  const phaseStartedAtRef = useRef(0);
  const lastSecondRef = useRef<number | null>(null);
  const pendingAudioTimeoutsRef = useRef<number[]>([]);
  const audioModeRef = useRef<AudioMode>(audioMode);
  const hapticsEnabledRef = useRef(hapticsEnabled);

  const technique = useMemo(
    () => BREATHING_TECHNIQUES.find((item) => item.id === techniqueId) || INITIAL_TECHNIQUE,
    [techniqueId]
  );
  const phase = technique.phases[phaseIndex] || technique.phases[0];

  useEffect(() => {
    audioModeRef.current = audioMode;
  }, [audioMode]);

  useEffect(() => {
    hapticsEnabledRef.current = hapticsEnabled;
  }, [hapticsEnabled]);

  useEffect(() => {
    setHapticsAvailable(typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function');
    setAudioAvailable(
      typeof window !== 'undefined' &&
        Boolean(window.AudioContext || (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext)
    );
  }, []);

  const stopAudio = () => {
    audioNodesRef.current.forEach((node) => {
      try {
        node.stop();
      } catch {
        // Oscillators that have already ended do not need further cleanup.
      }
      node.disconnect();
    });
    audioNodesRef.current = [];
    pendingAudioTimeoutsRef.current.forEach((timeout) => window.clearTimeout(timeout));
    pendingAudioTimeoutsRef.current = [];
  };

  const getAudioContext = () => {
    if (audioContextRef.current) return audioContextRef.current;
    const AudioContextConstructor =
      window.AudioContext ||
      (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextConstructor) return null;
    audioContextRef.current = new AudioContextConstructor();
    return audioContextRef.current;
  };

  const playTone = (frequency: number, duration: number, endFrequency?: number) => {
    const context = getAudioContext();
    if (!context) return;
    if (context.state === 'suspended') void context.resume();

    const oscillator = context.createOscillator();
    const gain = context.createGain();
    const now = context.currentTime;
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(frequency, now);
    if (endFrequency) oscillator.frequency.exponentialRampToValueAtTime(endFrequency, now + duration);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.09, now + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start(now);
    oscillator.stop(now + duration + 0.03);
    audioNodesRef.current.push(oscillator);
    const cleanup = window.setTimeout(() => {
      audioNodesRef.current = audioNodesRef.current.filter((node) => node !== oscillator);
      oscillator.disconnect();
    }, (duration + 0.1) * 1000);
    pendingAudioTimeoutsRef.current.push(cleanup);
  };

  const playPhaseCue = (nextPhase: BreathPhase) => {
    if (audioModeRef.current === 'mute') return;
    if (audioModeRef.current === 'metronome') {
      playTone(660, 0.08);
      return;
    }
    if (nextPhase.type === 'Inhale') playTone(330, 0.45, 660);
    if (nextPhase.type === 'Hold') playTone(440, 0.28);
    if (nextPhase.type === 'Exhale') playTone(660, 0.55, 260);
  };

  const triggerBoundaryFeedback = (nextPhase: BreathPhase) => {
    playPhaseCue(nextPhase);
    if (hapticsEnabledRef.current && hapticsAvailable) navigator.vibrate([60]);
  };

  const resetExercise = () => {
    phaseIndexRef.current = 0;
    setPhaseIndex(0);
    setSecondsRemaining(technique.phases[0].duration);
    setPhaseProgress(0);
    setLoopCount(0);
    lastSecondRef.current = null;
  };

  useEffect(() => {
    setIsRunning(false);
    stopAudio();
    resetExercise();
    // Technique changes intentionally reset the current exercise.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [techniqueId]);

  useEffect(() => {
    if (!isRunning) return;
    phaseStartedAtRef.current = performance.now();
    lastSecondRef.current = null;
    if (audioModeRef.current !== 'mute') playPhaseCue(technique.phases[phaseIndexRef.current]);

    const interval = window.setInterval(() => {
      const now = performance.now();
      let currentIndex = phaseIndexRef.current;
      let phaseStartedAt = phaseStartedAtRef.current;
      let elapsed = now - phaseStartedAt;
      let currentPhase = technique.phases[currentIndex];

      while (elapsed >= currentPhase.duration * 1000) {
        elapsed -= currentPhase.duration * 1000;
        currentIndex = (currentIndex + 1) % technique.phases.length;
        if (currentIndex === 0) setLoopCount((count) => count + 1);
        currentPhase = technique.phases[currentIndex];
        phaseStartedAt = now - elapsed;
        triggerBoundaryFeedback(currentPhase);
      }

      phaseIndexRef.current = currentIndex;
      phaseStartedAtRef.current = phaseStartedAt;
      const progress = Math.min(elapsed / (currentPhase.duration * 1000), 1);
      const remaining = Math.max(1, Math.ceil(currentPhase.duration - elapsed / 1000));
      setPhaseIndex(currentIndex);
      setPhaseProgress(progress);
      setSecondsRemaining(remaining);

      if (audioModeRef.current === 'metronome' && lastSecondRef.current !== remaining) {
        lastSecondRef.current = remaining;
        playTone(520, 0.045);
      }
    }, 50);

    return () => window.clearInterval(interval);
  }, [hapticsAvailable, isRunning, technique]);

  useEffect(() => {
    return () => {
      stopAudio();
      if (hapticsAvailable) navigator.vibrate(0);
      if (audioContextRef.current) void audioContextRef.current.close();
    };
  }, [hapticsAvailable]);

  const selectTechnique = (id: string) => setTechniqueId(id);

  const toggleExercise = () => {
    if (isRunning) {
      setIsRunning(false);
      stopAudio();
      return;
    }
    phaseStartedAtRef.current = performance.now();
    setIsRunning(true);
  };

  const visualScale =
    phase.type === 'Inhale'
      ? 0.6 + phaseProgress * 0.7
      : phase.type === 'Exhale'
        ? 1.3 - phaseProgress * 0.7
        : phase.volume === 'low'
          ? 0.6
          : 1.3;

  const circleStyle = {
    transform: `scale(${visualScale})`,
    transition: isRunning ? 'transform 50ms linear' : 'transform 300ms ease-out',
  } as React.CSSProperties;

  return (
    <div className="max-w-5xl mx-auto space-y-7">
      <header className="border-b border-sand/70 pb-5">
        <div className="flex items-center space-x-2">
          <span className="p-1.5 rounded-lg bg-rose-dusty/30 text-terracotta">
            <Wind className="w-4 h-4" />
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-deepBrown">
            Breathing Exercises
          </h1>
        </div>
        <p className="text-xs text-secondaryText mt-1 max-w-2xl">
          Choose a rhythm that fits this moment. Move gently, never force a breath, and stop if you feel lightheaded.
        </p>
      </header>

      <section aria-labelledby="technique-heading" className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 id="technique-heading" className="font-serif text-xl font-bold text-deepBrown">
            Choose your practice
          </h2>
          <span className="text-[11px] text-secondaryText">{loopCount} {loopCount === 1 ? 'cycle' : 'cycles'} completed</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {BREATHING_TECHNIQUES.map((item) => {
            const selected = item.id === technique.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => selectTechnique(item.id)}
                aria-pressed={selected}
                className={`text-left p-4 rounded-2xl border transition-all ${
                  selected
                    ? 'border-terracotta bg-terracotta/10 shadow-sm'
                    : 'border-sand bg-ivory hover:border-terracotta/50 hover:bg-cream/40'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <span className="font-semibold text-sm text-deepBrown">{item.name}</span>
                  {selected && <Check className="w-4 h-4 text-terracotta flex-shrink-0" />}
                </div>
                <p className="text-[11px] text-secondaryText leading-relaxed mt-2">{item.description}</p>
              </button>
            );
          })}
        </div>
      </section>

      <section className="rounded-2xl border border-sand bg-cream/50 p-5 sm:p-6 flex items-start gap-3">
        <Info className="w-4 h-4 text-terracotta flex-shrink-0 mt-0.5" />
        <div>
          <h2 className="text-sm font-semibold text-deepBrown">Why {technique.name}?</h2>
          <p className="text-xs text-secondaryText leading-relaxed mt-1">{technique.significance}</p>
        </div>
      </section>

      <section className="bg-ivory border border-sand rounded-3xl p-5 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <p className="text-[11px] uppercase tracking-[0.18em] text-terracotta font-semibold">Immersive focus core</p>
            <h2 className="font-serif text-2xl font-bold text-deepBrown mt-1">{technique.name}</h2>
            <p className="text-xs text-secondaryText mt-1">{technique.phases.map((item) => `${item.type} ${item.duration}s`).join(' · ')}</p>
          </div>
          <div className={`flex items-center gap-1.5 text-[11px] ${isRunning ? 'text-sage-dark' : 'text-secondaryText'}`}>
            <Activity className="w-3.5 h-3.5" />
            {isRunning ? 'Practice in progress' : 'Ready when you are'}
          </div>
        </div>

        <div className="min-h-[360px] flex flex-col items-center justify-center py-10">
          <div
            className={`w-56 h-56 sm:w-64 sm:h-64 rounded-full flex flex-col items-center justify-center bg-gradient-to-br from-rose-dusty/40 to-sage-light/50 border-2 border-white/70 shadow-[0_12px_45px_rgba(184,117,96,0.18)] ${
              isRunning && phase.type === 'Hold' && phase.volume === 'high' ? 'animate-pulse' : ''
            }`}
            style={circleStyle}
            aria-live="polite"
            aria-label={`${phaseLabel(phase)}, ${secondsRemaining} seconds`}
          >
            <span className="font-serif text-3xl sm:text-4xl font-bold text-deepBrown">{phaseLabel(phase)}</span>
            <span className="text-lg font-semibold text-terracotta mt-1">{secondsRemaining}s</span>
            <span className="text-[10px] text-secondaryText mt-3">
              {isRunning ? 'Follow the rhythm' : 'Press start to begin'}
            </span>
          </div>
        </div>

        <div className="border-t border-sand/70 pt-5 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={toggleExercise}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-terracotta text-white text-sm font-semibold hover:bg-terracotta-dark transition-colors shadow-sm"
            >
              {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              {isRunning ? 'Stop Exercise' : 'Start Exercise'}
            </button>
            <button
              type="button"
              onClick={() => {
                setIsRunning(false);
                stopAudio();
                resetExercise();
              }}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full border border-sand bg-cream text-secondaryText text-xs font-semibold hover:text-deepBrown transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs">
            <div className="flex items-center gap-1.5 text-secondaryText">
              {audioMode === 'mute' ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-terracotta" />}
              <span>Audio</span>
              <select
                value={audioMode}
                onChange={(event) => setAudioMode(event.target.value as AudioMode)}
                disabled={!audioAvailable}
                className="rounded-lg border border-sand bg-cream px-2 py-1.5 text-deepBrown disabled:opacity-50"
                aria-label="Audio guidance"
              >
                <option value="mute">Mute</option>
                <option value="metronome">Metronome Clicks</option>
                <option value="guide">Vocal Guide Tones</option>
              </select>
            </div>
            <button
              type="button"
              onClick={() => setHapticsEnabled((enabled) => !enabled)}
              disabled={!hapticsAvailable}
              aria-pressed={hapticsEnabled}
              className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 transition-colors ${
                hapticsEnabled ? 'border-terracotta bg-terracotta/10 text-deepBrown' : 'border-sand bg-cream text-secondaryText'
              } disabled:opacity-50`}
            >
              <Zap className="w-3.5 h-3.5" />
              Haptic Feedback
            </button>
          </div>
        </div>

        {(!audioAvailable || !hapticsAvailable) && (
          <p className="flex items-center gap-1.5 text-[11px] text-secondaryText mt-4">
            <Headphones className="w-3.5 h-3.5" />
            {[
              !audioAvailable && 'Audio guidance is not supported in this browser.',
              !hapticsAvailable && 'Haptic feedback is not available on this device.',
            ].filter(Boolean).join(' ')}
          </p>
        )}
      </section>
    </div>
  );
};
