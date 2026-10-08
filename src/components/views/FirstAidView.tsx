import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { FIRST_AID_TOPICS, FirstAidTopic } from '../../data/firstAidData';
import {
  HeartPulse,
  PhoneCall,
  Activity,
  Wind,
  Droplet,
  AlertCircle,
  Zap,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Info,
} from 'lucide-react';

export const FirstAidView: React.FC = () => {
  const { patientProfile, elderlyMode } = useApp();
  const [selectedTopicId, setSelectedTopicId] = useState<string>('unconscious');

  const selectedTopic =
    FIRST_AID_TOPICS.find((t) => t.id === selectedTopicId) || FIRST_AID_TOPICS[0];

  const getIcon = (id: string) => {
    switch (id) {
      case 'unconscious': return <Activity className="w-5 h-5 text-red-500" />;
      case 'chest-pain': return <HeartPulse className="w-5 h-5 text-red-600" />;
      case 'difficulty-breathing': return <Wind className="w-5 h-5 text-sky-500" />;
      case 'severe-bleeding': return <Droplet className="w-5 h-5 text-rose-600" />;
      case 'choking': return <AlertCircle className="w-5 h-5 text-amber-500" />;
      case 'seizure': return <Zap className="w-5 h-5 text-purple-500" />;
      default: return <HeartPulse className="w-5 h-5 text-red-500" />;
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/60 dark:border-slate-800">
        <div>
          <h1 className={`font-extrabold text-slate-900 dark:text-white tracking-tight ${elderlyMode ? 'text-3xl' : 'text-2xl'}`}>
            First-Aid Guidance
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Immediate safety steps while emergency services are en route
          </p>
        </div>

        {/* Speed Dial Emergency button */}
        <a
          href={`tel:${patientProfile.emergencyPhone}`}
          className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs sm:text-sm flex items-center space-x-2 shadow-xs active:scale-95 transition shrink-0"
        >
          <PhoneCall className="w-4 h-4 animate-pulse" />
          <span>DIAL {patientProfile.emergencyPhone} IMMEDIATELY</span>
        </a>
      </div>

      {/* STRICT CPR & DISPATCHER GUARDRAIL (Requirement #19) */}
      <div className="bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 rounded-xl p-4 text-amber-950 dark:text-amber-200 flex items-start space-x-3 shadow-2xs">
        <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
        <div className="space-y-0.5 text-xs">
          <h2 className="font-bold text-amber-900 dark:text-amber-300">
            Professional Dispatcher Disclaimer
          </h2>
          <p className="text-amber-800 dark:text-amber-200/90 leading-relaxed">
            This tool is <strong>NOT a substitute for emergency dispatchers or paramedics</strong>. Always call <strong>{patientProfile.emergencyPhone}</strong> immediately and follow the live dispatcher instructions.
          </p>
        </div>
      </div>

      {/* TOPIC SELECTION PILLS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
        {FIRST_AID_TOPICS.map((topic) => {
          const isSelected = selectedTopic.id === topic.id;
          return (
            <button
              key={topic.id}
              onClick={() => setSelectedTopicId(topic.id)}
              className={`p-3 rounded-xl border text-left transition flex flex-col justify-between space-y-1.5 ${
                isSelected
                  ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-slate-900 dark:border-white shadow-xs font-bold'
                  : 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <div className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                {getIcon(topic.id)}
              </div>
              <span className="text-xs font-semibold leading-snug truncate">
                {topic.title}
              </span>
            </button>
          );
        })}
      </div>

      {/* ACTIVE TOPIC DETAIL CARD */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-6 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-4">
        {/* Title & Immediate Action Banner */}
        <div className="space-y-2.5">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-red-50 dark:bg-red-950/60 flex items-center justify-center">
              {getIcon(selectedTopic.id)}
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-red-600 dark:text-red-400">
                Priority: {selectedTopic.urgency.toUpperCase()}
              </span>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                {selectedTopic.title}
              </h2>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-red-50/70 dark:bg-red-950/30 border border-red-200/70 dark:border-red-900/60 text-xs font-semibold text-red-900 dark:text-red-300 flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0" />
            <span>Immediate First Action: {selectedTopic.immediateAction}</span>
          </div>
        </div>

        {/* Action Steps */}
        <div className="space-y-2.5">
          <h3 className="text-[11px] font-bold uppercase text-slate-400 dark:text-slate-500 tracking-wider">
            Step-by-Step Action Protocol
          </h3>
          <div className="space-y-2">
            {selectedTopic.steps.map((step, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 flex items-start space-x-2.5 text-xs text-slate-800 dark:text-slate-200"
              >
                <div className="w-5 h-5 rounded-md bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                  {idx + 1}
                </div>
                <p className="font-semibold leading-relaxed pt-0.5">{step}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Critical Do NOTs */}
        <div className="p-5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 space-y-2">
          <h3 className="text-xs font-black uppercase text-rose-800 dark:text-rose-300 tracking-wider flex items-center space-x-1.5">
            <XCircle className="w-4 h-4 text-rose-600 dark:text-rose-400" />
            <span>Critical Warnings: What NOT to Do</span>
          </h3>
          <ul className="space-y-1.5 text-xs sm:text-sm text-rose-900 dark:text-rose-200 font-medium">
            {selectedTopic.doNots.map((item, idx) => (
              <li key={idx} className="flex items-start space-x-2">
                <span className="text-rose-600 dark:text-rose-400 font-bold">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
