import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Mic,
  MicOff,
  Send,
  Volume2,
  Sparkles,
  MessageSquare,
  Bot,
  User,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { processVoiceCommand, speakText } from '../../services/speechAssistant';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  actionTag?: string;
}

export const VoiceAssistantView: React.FC = () => {
  const {
    schedule,
    safetyAlerts,
    patientProfile,
    markDose,
    triggerPanicAlert,
    setActiveTab,
    elderlyMode,
  } = useApp();

  const [inputQuery, setInputQuery] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm1',
      sender: 'assistant',
      text: `Namaste ${patientProfile.name} ji! Main LifeLine Assistant hoon. Aap mujhse bolkar ya type karke pooch sakte hain: "Meri next medicine kab hai?", "Medicine le li", ya "Safety alerts check karo".`,
      timestamp: 'Just now',
    },
  ]);

  const recognitionRef = useRef<any>(null);

  // Initialize Web Speech Recognition if available
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = patientProfile.preferredLanguage === 'hi' ? 'hi-IN' : 'en-IN';

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        handleExecuteQuery(transcript);
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, [patientProfile.preferredLanguage]);

  const toggleMic = () => {
    if (!recognitionRef.current) {
      // Fallback: If browser speech recognition is not supported in this environment
      handleExecuteQuery('meri next medicine kab hai?');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (e) {
        setIsListening(false);
      }
    }
  };

  const handleExecuteQuery = (queryText: string) => {
    if (!queryText.trim()) return;

    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: queryText,
      timestamp: timeStr,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');

    // Process using Speech Assistant Engine
    const result = processVoiceCommand(
      queryText,
      schedule,
      safetyAlerts,
      patientProfile.name
    );

    let actionLabel: string | undefined = undefined;

    // Apply real application state changes if user commanded an action!
    if (result.actionTaken === 'marked_taken' && result.affectedSlotId) {
      markDose(result.affectedSlotId, 'taken');
      actionLabel = 'Updated Medication State: Taken';
    } else if (result.actionTaken === 'opened_emergency') {
      triggerPanicAlert();
      actionLabel = 'Activated Emergency Mode';
    } else if (result.actionTaken === 'showed_safety') {
      actionLabel = 'Consulted Safety Matrix';
    }

    setTimeout(() => {
      const assistantMsg: ChatMessage = {
        id: `a-${Date.now()}`,
        sender: 'assistant',
        text: result.response,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actionTag: actionLabel,
      };
      setMessages((prev) => [...prev, assistantMsg]);
    }, 400);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
        <div>
          <h1 className={`font-extrabold text-slate-900 dark:text-white tracking-tight ${elderlyMode ? 'text-3xl' : 'text-2xl sm:text-3xl'}`}>
            Voice Assistant
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Voice and conversational helper for schedules, dosage confirmations, and safety (Hindi / English / Hinglish)
          </p>
        </div>

        {/* Guardrail Note */}
        <div className="text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 px-3.5 py-2 rounded-xl max-w-sm self-start sm:self-auto">
          LifeLine Assistant strictly handles schedules & alerts. Does not diagnose diseases.
        </div>
      </div>

      {/* QUICK VOICE PROMPT PILLS */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 space-y-2">
        <span className="text-[11px] font-bold uppercase text-slate-400 dark:text-slate-500 tracking-wider">
          One-Tap Sample Voice Queries:
        </span>
        <div className="flex flex-wrap gap-2 pt-0.5">
          {[
            'meri next medicine kab hai?',
            'Medicine le li',
            'Safety alerts kya hain?',
            'Emergency help',
            'When is my next dose?',
          ].map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleExecuteQuery(prompt)}
              className="px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 hover:bg-sky-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs flex items-center space-x-1.5 transition active:scale-95"
            >
              <Sparkles className="w-3 h-3 text-sky-500 dark:text-sky-400" />
              <span>"{prompt}"</span>
            </button>
          ))}
        </div>
      </div>

      {/* CHAT LOG DRAWER */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col h-[460px] overflow-hidden">
        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-3.5">
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <div
                key={msg.id}
                className={`flex items-start space-x-2.5 ${
                  isUser ? 'flex-row-reverse space-x-reverse' : ''
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-white font-bold text-xs ${
                    isUser ? 'bg-slate-900 dark:bg-slate-700' : 'bg-sky-600 dark:bg-sky-500'
                  }`}
                >
                  {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                <div
                  className={`max-w-md rounded-2xl p-3.5 text-xs sm:text-sm ${
                    isUser
                      ? 'bg-slate-900 dark:bg-slate-800 text-white font-medium'
                      : 'bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-slate-100 border border-slate-200/80 dark:border-slate-700'
                  }`}
                >
                  <p className="leading-relaxed">{msg.text}</p>
                  {msg.actionTag && (
                    <div className="mt-2 pt-2 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center space-x-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{msg.actionTag}</span>
                    </div>
                  )}
                  <div className="text-[10px] mt-1 text-slate-400 dark:text-slate-500">
                    {msg.timestamp}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Input Bar */}
        <div className="p-3.5 bg-slate-50 dark:bg-slate-900/80 border-t border-slate-100 dark:border-slate-800 flex items-center space-x-2">
          {/* Microphone Button */}
          <button
            onClick={toggleMic}
            className={`p-2.5 rounded-xl transition ${
              isListening
                ? 'bg-red-600 text-white animate-pulse'
                : 'bg-sky-600 hover:bg-sky-700 text-white'
            }`}
            title="Speak or Toggle Voice Recognition"
          >
            {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>

          {/* Text Input */}
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleExecuteQuery(inputQuery);
            }}
            placeholder={
              isListening
                ? 'Listening... Speak now...'
                : 'Ask a question or speak (e.g. "meri next medicine kab hai?")...'
            }
            className="flex-1 px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-sky-500"
          />

          {/* Send Button */}
          <button
            onClick={() => handleExecuteQuery(inputQuery)}
            className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white transition active:scale-95"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
