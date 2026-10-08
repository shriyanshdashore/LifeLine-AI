import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Info,
  CheckCircle2,
  FileText,
  ExternalLink,
  PhoneCall,
  Search,
} from 'lucide-react';
import { SafetySeverity } from '../../types';

export const SafetyEngineView: React.FC = () => {
  const { safetyAlerts, medications, patientProfile, elderlyMode } = useApp();
  const [filterSeverity, setFilterSeverity] = useState<string>('all');

  const filteredAlerts = safetyAlerts.filter((a) => {
    if (filterSeverity === 'all') return true;
    return a.severity === filterSeverity;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Minimal Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/60 dark:border-slate-800">
        <div>
          <h1 className={`font-extrabold text-slate-900 dark:text-white tracking-tight ${elderlyMode ? 'text-3xl' : 'text-2xl'}`}>
            Medication Safety Engine
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Prescription verification for drug-drug interactions & allergen sensitivities
          </p>
        </div>

        {/* Screening Status */}
        <div className="flex items-center space-x-2 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 px-3.5 py-2 rounded-xl shrink-0 text-xs shadow-2xs">
          <div className={`w-2.5 h-2.5 rounded-full ${safetyAlerts.length > 0 ? 'bg-amber-500' : 'bg-emerald-500'}`} />
          <span className="font-semibold text-slate-800 dark:text-slate-200">
            {safetyAlerts.length === 0 ? 'All Clear' : `${safetyAlerts.length} Flagged`}
          </span>
          <span className="text-slate-400">({medications.length} screened)</span>
        </div>
      </div>

      {/* MINIMAL MEDICAL SAFETY RULE CALLOUT */}
      <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 text-xs text-slate-600 dark:text-slate-400 flex items-start space-x-3">
        <Info className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <span className="font-bold text-slate-900 dark:text-white block">
            Clinical Verification Notice
          </span>
          <p className="leading-relaxed">
            Screened against RxNorm pharmacopeia guidelines. Never independently stop or change prescribed medication without direct consultation with your prescribing doctor or pharmacist.
          </p>
        </div>
      </div>

      {/* FILTER TABS & COUNTS */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center space-x-2">
          {[
            { id: 'all', label: 'All Warnings', count: safetyAlerts.length },
            { id: 'high', label: '🔴 Important Warnings', count: safetyAlerts.filter(a => a.severity === 'high').length },
            { id: 'moderate', label: '🟡 Potential Interactions', count: safetyAlerts.filter(a => a.severity === 'moderate').length },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterSeverity(tab.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${
                filterSeverity === tab.id
                  ? 'bg-slate-900 text-white shadow-xs dark:bg-cyan-500 dark:text-slate-950 font-black'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200 dark:bg-slate-900/80 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${filterSeverity === tab.id ? 'bg-white/20 text-white dark:bg-slate-950/30 dark:text-slate-950 font-black' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'}`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">
          Source: RxNorm Clinical Safety Matrix
        </span>
      </div>

      {/* ALERTS LIST */}
      <div className="space-y-3.5">
        {filteredAlerts.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-10 text-center border border-slate-200/70 dark:border-slate-800 space-y-2.5 shadow-2xs">
            <div className="w-12 h-12 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-slate-900 dark:text-white">
              🟢 No Major Warning Found
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
              All {medications.length} active medications have been verified with zero acute drug-drug interactions or allergen conflicts detected.
            </p>
          </div>
        ) : (
          filteredAlerts.map((alert) => {
            const isHigh = alert.severity === 'high';
            const isModerate = alert.severity === 'moderate';

            return (
              <div
                key={alert.id}
                className={`rounded-2xl p-4 sm:p-5 border transition shadow-2xs space-y-3 ${
                  isHigh
                    ? 'bg-white dark:bg-slate-900 border-red-200 dark:border-red-900/60'
                    : isModerate
                    ? 'bg-white dark:bg-slate-900 border-amber-200 dark:border-amber-900/60'
                    : 'bg-white dark:bg-slate-900 border-slate-200/70 dark:border-slate-800'
                }`}
              >
                {/* Header Tag */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 pb-2.5 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm">
                      {isHigh ? '🔴' : isModerate ? '🟡' : '🟢'}
                    </span>
                    <span className={`text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                      isHigh
                        ? 'bg-red-50 text-red-700 dark:bg-red-950/60 dark:text-red-300'
                        : 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                    }`}>
                      {isHigh ? 'Important Warning' : 'Potential Interaction'}
                    </span>
                  </div>

                  <span className="text-[11px] text-slate-400">
                    Source: {alert.source}
                  </span>
                </div>

                {/* Title & Involved Medicines */}
                <div>
                  <h3 className={`font-bold text-slate-900 dark:text-white ${elderlyMode ? 'text-xl' : 'text-base'}`}>
                    {alert.title}
                  </h3>
                  <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                    <span className="text-xs text-slate-400">Involved:</span>
                    {alert.involvedMeds.map((med, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 font-semibold text-xs text-slate-800 dark:text-slate-200"
                      >
                        💊 {med}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Why Flagged (Clear Typography) */}
                <div className="space-y-1 text-xs">
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
                    {alert.explanation}
                  </p>
                  <p className="text-[11px] text-slate-400 italic">
                    Mechanism: {alert.mechanism}
                  </p>
                </div>

                {/* Recommended Action Callout */}
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800 flex items-start space-x-2.5 text-xs">
                  <CheckCircle2 className="w-4 h-4 text-sky-600 dark:text-sky-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-800 dark:text-slate-200 mr-1">
                      Recommended Action:
                    </span>
                    <span className="text-slate-600 dark:text-slate-300">
                      {alert.recommendedAction}
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* USER DOCUMENTED ALLERGY PROFILE OVERVIEW */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200/70 dark:border-slate-800 shadow-2xs space-y-2.5">
        <h3 className="font-bold text-slate-900 dark:text-white text-sm flex items-center space-x-2">
          <span>🛡️ Documented Patient Allergen Matrix</span>
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          The safety engine monitors all prescriptions against Raj Sharma's documented allergies:
        </p>

        <div className="flex flex-wrap gap-2 pt-0.5">
          {patientProfile.allergies.map((allergy, idx) => (
            <span
              key={idx}
              className="px-2.5 py-1 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200/70 dark:border-rose-900 text-rose-800 dark:text-rose-300 font-semibold text-xs flex items-center space-x-1.5"
            >
              <span>⚠️ Known Allergy:</span>
              <span className="underline">{allergy}</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
