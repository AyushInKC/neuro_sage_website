import { config } from '../config/index.js';

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface AIServiceResponse {
  reply: string;
  suggestedGrounding?: boolean;
  crisisHelplineTriggered?: boolean;
}

// ---------------------------------------------------------------------------
// Wellness system prompt — kept on the backend, never exposed to the client.
// ---------------------------------------------------------------------------
const SYSTEM_PROMPT = `You are the NeuroSage Mental Wellness Companion — a gentle, warm, and supportive AI space designed for university students and individuals.
Your mission is to provide empathetic reflection, emotional grounding, and practical self-care suggestions.

Core Guidelines:
1. Tone: Calm, patient, warm, compassionate, and grounded. Never judgmental or robotic.
2. Boundaries: You are a supportive reflective companion, NOT a medical doctor, psychiatrist, or diagnostic clinical tool. Explicitly encourage consulting a qualified professional when clinical symptoms or medical questions arise. Never diagnose, prescribe, or claim to replace a licensed mental health professional.
3. Brevity & Space: Give thoughtful, digestible responses with natural paragraph spacing. Avoid overwhelming walls of text or bullet-point overloads.
4. Active Listening: Validate the user's feelings first ("It sounds like you've been carrying a lot...", "That feels really heavy...").
5. Practical Wellness Tools: When helpful, gently offer a grounding technique (such as the 5-4-3-2-1 sensory check, box breathing, or a mindful pause).
6. Professional Support: Encourage professional support when topics go beyond general wellbeing — mention counselling services, campus mental health resources, or trusted adults when appropriate.
7. Safety First: If the user expresses thoughts of self-harm, suicide, severe depression, or acute crisis, respond with deep compassion and immediately provide crisis contact details:
   - India: Tele-MANAS (Toll-Free 14416 / 1800-891-4416), KIRAN (1800-599-0019), Vandrevala Foundation (+91 9999 666 555)
   - US / Global: 988 Lifeline, or local emergency services.
   Urge them to speak to someone they trust right now.`;

// ---------------------------------------------------------------------------
// Ollama request timeout (ms).  Keep generous enough for a local LLM cold-start
// but short enough to avoid hanging indefinitely.
// ---------------------------------------------------------------------------
const OLLAMA_TIMEOUT_MS = 30_000;

export class AIService {
  /**
   * Generates a compassionate, reflective response using a locally-running Ollama
   * instance.  Falls back to a high-quality rule-based engine if Ollama is
   * unavailable so the companion is never completely silent.
   */
  public static async generateResponse(
    conversationHistory: ChatMessage[],
    userMessage: string
  ): Promise<AIServiceResponse> {
    // --- Crisis detection: always handled locally, before any LLM call ----------
    if (this.detectCrisisKeywords(userMessage)) {
      return {
        reply: `I hear how much pain you're in right now, and I want you to know you don't have to carry this alone. Please take a gentle breath with me.\n\nBecause I care about your safety and I am an AI companion, please reach out directly to someone who can truly support you right now:\n\n• **Tele-MANAS (Govt of India)**: Call **14416** or **1800-891-4416** (24/7, Toll-Free)\n• **KIRAN Mental Health Helpline**: **1800-599-0019**\n• **Vandrevala Foundation**: **+91 9999 666 555**\n• **International (US/Canada)**: Call or text **988**\n\nIf you are in immediate danger, please contact a trusted friend, family member, or campus counselor right now. You matter, and there is support for you.`,
        crisisHelplineTriggered: true,
      };
    }

    // --- Attempt Ollama inference -----------------------------------------------
    try {
      const reply = await this.callOllama(conversationHistory, userMessage);
      if (reply) {
        return {
          reply,
          suggestedGrounding:
            reply.toLowerCase().includes('breath') ||
            reply.toLowerCase().includes('grounding'),
        };
      }
    } catch (err: any) {
      // Log a warning but do NOT expose internals to the client.
      console.warn('[AIService] Ollama call failed, using reflective fallback:', err?.message);
    }

    // --- High-quality reflective rule-based fallback ----------------------------
    const fallbackReply = this.generateReflectiveFallback(userMessage, conversationHistory);
    return {
      reply: fallbackReply,
      suggestedGrounding:
        userMessage.toLowerCase().includes('stress') ||
        userMessage.toLowerCase().includes('anxious'),
    };
  }

  // ---------------------------------------------------------------------------
  // Ollama chat completion via local HTTP API
  // ---------------------------------------------------------------------------
  private static async callOllama(
    conversationHistory: ChatMessage[],
    userMessage: string
  ): Promise<string> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), OLLAMA_TIMEOUT_MS);

    const messages = [
      { role: 'system', content: SYSTEM_PROMPT },
      // Include up to the last 6 turns for context without flooding the context window.
      ...conversationHistory.slice(-6).map((m) => ({ role: m.role, content: m.content })),
      { role: 'user', content: userMessage },
    ];

    let response: Response;
    try {
      response = await fetch(`${config.ollamaBaseUrl}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: config.ollamaModel,
          messages,
          stream: false,
          options: {
            temperature: 0.7,
            num_predict: 512,
          },
        }),
        signal: controller.signal,
      });
    } finally {
      clearTimeout(timeoutId);
    }

    if (!response.ok) {
      throw new Error(`Ollama returned HTTP ${response.status}`);
    }

    const data = (await response.json()) as {
      message?: { content?: string };
      error?: string;
    };

    if (data.error) {
      throw new Error(`Ollama error: ${data.error}`);
    }

    const text = data.message?.content?.trim();
    if (!text) {
      throw new Error('Ollama returned an empty response');
    }

    return text;
  }

  // ---------------------------------------------------------------------------
  // Crisis keyword detection
  // ---------------------------------------------------------------------------
  private static detectCrisisKeywords(text: string): boolean {
    const lower = text.toLowerCase();
    const crisisPatterns = [
      'suicide',
      'kill myself',
      'end my life',
      'want to die',
      'self harm',
      'cutting myself',
      'hurt myself',
      'no reason to live',
      'better off dead',
    ];
    return crisisPatterns.some((pattern) => lower.includes(pattern));
  }

  // ---------------------------------------------------------------------------
  // Rule-based reflective fallback — used when Ollama is unavailable
  // ---------------------------------------------------------------------------
  private static generateReflectiveFallback(
    message: string,
    history: ChatMessage[]
  ): string {
    const lower = message.toLowerCase();

    if (
      lower.includes('exam') ||
      lower.includes('study') ||
      lower.includes('college') ||
      lower.includes('assignment')
    ) {
      return `College and academic deadlines can create so much unspoken pressure. When everything feels urgent, our nervous system stays in high alert.\n\nTry giving yourself permission to pause for just 3 minutes. What is the single smallest, lowest-effort step you could focus on next? And remember, your worth as a person is not defined by your productivity.`;
    }

    if (
      lower.includes('anxious') ||
      lower.includes('anxiety') ||
      lower.includes('panic') ||
      lower.includes('overwhelmed')
    ) {
      return `I hear you, and it is completely understandable that you're feeling overwhelmed right now. Anxiety has a way of magnifying every future possibility all at once.\n\nLet's try a small moment of grounding together:\n\n1. Notice your feet touching the floor beneath you.\n2. Inhale gently through your nose for 4 seconds.\n3. Hold for 4 seconds.\n4. Exhale slowly for 4 seconds.\n\nYou don't have to resolve everything today. Take it one breath at a time.`;
    }

    if (
      lower.includes('sad') ||
      lower.includes('depress') ||
      lower.includes('lonely') ||
      lower.includes('tired') ||
      lower.includes('exhausted')
    ) {
      return `It takes courage to express feeling this way. Feeling drained or heavy is your mind's way of asking for gentle rest, not self-criticism.\n\nPlease be kind to yourself today. Have you had a glass of water or stepped away from screens recently? What is one comforting thing—even something very simple like a warm cup of tea or fresh air—that would feel gentle right now?`;
    }

    if (
      lower.includes('sleep') ||
      lower.includes('insomnia') ||
      lower.includes('night') ||
      lower.includes('cant sleep')
    ) {
      return `Rest can be elusive when the mind is still sorting through thoughts from the day. Instead of forcing sleep, see if you can simply give your body permission to rest comfortably.\n\nDim your screen, soften your shoulders, unclench your jaw, and take five slow, quiet exhales. The world can wait until morning.`;
    }

    if (
      lower.includes('camp') ||
      lower.includes('brainwell') ||
      lower.includes('register')
    ) {
      return `Brainwell Camp is a space created by NeuroSage specifically to help you disconnect from everyday burnout, reconnect with mindful habits, and meet a supportive community. It's just ₹49 per participant, and you can explore registration right here in your dashboard.`;
    }

    return `Thank you for sharing that with me. It takes real vulnerability to put thoughts into words.\n\nWhatever you are navigating today, remember to be kind to your mind. You don't have to carry every responsibility all at once. What feels like the most supportive thing you could do for yourself in this moment?`;
  }
}
