type BreathPhaseType = 'Inhale' | 'Hold' | 'Exhale';
type HoldVolume = 'high' | 'low';

export type BreathPhase = {
  type: BreathPhaseType;
  duration: number;
  volume?: HoldVolume;
};

export type BreathingTechnique = {
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
