import React, { useState, useEffect, useRef } from 'react';
import { aiApi } from '../../services/api';
import { ChatMessage } from '../../types';
import {
  Sparkles,
  Send,
  Trash2,
  ShieldAlert,
  Compass,
  Heart,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';

export const AICompanionPage: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [crisisAlert, setCrisisAlert] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    aiApi
      .getHistory()
      .then((res) => {
        if (res.success && res.messages) {
          setMessages(res.messages);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setInitialLoading(false));
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userText = input.trim();
    setInput('');
    setLoading(true);

    const tempUserMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: userText,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, tempUserMsg]);

    try {
      const res = await aiApi.sendMessage(userText);
      if (res.success && res.assistantMessage) {
        setMessages((prev) => [...prev, res.assistantMessage]);
        if (res.crisisHelplineTriggered) {
          setCrisisAlert(true);
        }
      }
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content:
          'I am taking a slow breath right now. Please allow me a moment and try sending your thought again.',
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearHistory = async () => {
    if (!window.confirm('Would you like to gently clear your reflective chat history?')) return;
    try {
      await aiApi.clearHistory();
      setMessages([]);
      setCrisisAlert(false);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto flex flex-col h-[calc(100vh-8rem)]">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-sand/70 flex-shrink-0">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-1.5 rounded-lg bg-rose-dusty/30 text-terracotta">
              <Sparkles className="w-4 h-4" />
            </span>
            <h1 className="font-serif text-2xl font-bold text-deepBrown">
              AI Wellness Companion
            </h1>
          </div>
          <p className="text-xs text-secondaryText mt-0.5">
            A quiet, confidential space for reflection, stress grounding, and mindful check-ins.
          </p>
        </div>

        {messages.length > 0 && (
          <button
            onClick={handleClearHistory}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-secondaryText hover:text-errorDark hover:bg-rose-dusty/20 transition-colors"
            title="Clear conversation"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear space</span>
          </button>
        )}
      </div>

      {/* Non-Diagnostic Disclaimer Banner */}
      <div className="my-3 p-3 rounded-xl bg-cream/70 border border-sand/80 flex items-start space-x-2 text-[11px] text-secondaryText flex-shrink-0">
        <Compass className="w-4 h-4 text-terracotta flex-shrink-0 mt-0.5" />
        <span>
          <strong>Reflective Companion:</strong> This is a supportive AI tool designed for self-care and gentle exploration. It is not a therapist, doctor, or diagnostic service. If you are experiencing acute distress, call <strong>Tele-MANAS (14416)</strong> or <strong>KIRAN (1800-599-0019)</strong>.
        </span>
      </div>

      {/* Chat Messages Stream */}
      <div className="flex-1 overflow-y-auto py-4 px-2 space-y-6">
        {initialLoading ? (
          <div className="text-center py-12 text-xs text-secondaryText">
            Opening your quiet space...
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center py-12 max-w-md mx-auto space-y-4">
            <div className="w-12 h-12 rounded-full bg-cream border border-sand flex items-center justify-center mx-auto text-terracotta">
              <Heart className="w-6 h-6" />
            </div>
            <h2 className="font-serif text-xl font-bold text-deepBrown">
              Take a quiet moment.
            </h2>
            <p className="text-xs text-secondaryText leading-relaxed">
              How is your mind feeling today? You can share whatever is on your mind—exam worries, feeling overwhelmed, or just needing a mindful pause.
            </p>
            <div className="pt-2 flex flex-wrap justify-center gap-2">
              {[
                'I have an upcoming exam and feel anxious',
                'Can we try a quick grounding exercise?',
                'I feel drained and unmotivated today',
                'Tell me more about Brainwell Camp',
              ].map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => {
                    setInput(prompt);
                  }}
                  className="px-3 py-1.5 rounded-full text-xs bg-cream/60 hover:bg-cream border border-sand text-deepBrown transition-colors"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${
                msg.role === 'user' ? 'items-end' : 'items-start'
              }`}
            >
              <div
                className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-5 py-3.5 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap ${
                  msg.role === 'user'
                    ? 'bg-terracotta text-white rounded-br-none shadow-sm'
                    : 'bg-cream/70 border border-sand text-deepBrown rounded-bl-none shadow-sm'
                }`}
              >
                {msg.content}
              </div>
              <span className="text-[10px] text-secondaryText/70 mt-1 px-1">
                {new Date(msg.timestamp).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>
          ))
        )}

        {loading && (
          <div className="flex flex-col items-start space-y-1">
            <div className="bg-cream/70 border border-sand rounded-2xl rounded-bl-none px-4 py-3 flex items-center space-x-2 text-xs text-secondaryText">
              <span className="w-2 h-2 rounded-full bg-terracotta animate-pulse" />
              <span>Thinking with care...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Box */}
      <div className="pt-3 border-t border-sand/70 flex-shrink-0">
        <form onSubmit={handleSend} className="relative flex items-center">
          <textarea
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend(e);
              }
            }}
            placeholder="Share what is on your mind... (Press Enter to send)"
            className="w-full resize-none pr-14 pl-4 py-3 text-xs sm:text-sm rounded-2xl border border-sand bg-cream/30 text-deepBrown placeholder-secondaryText/60 focus:border-terracotta focus:ring-1 focus:ring-terracotta"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="absolute right-2 p-2.5 rounded-xl bg-terracotta text-white hover:bg-terracotta-dark disabled:opacity-40 transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
