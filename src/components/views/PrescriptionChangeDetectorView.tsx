import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { comparePrescriptions } from '../../services/comparisonEngine';
import {
  GitCompare,
  CheckCircle2,
  PlusCircle,
  MinusCircle,
  AlertTriangle,
  ArrowRight,
  FileText,
  Calendar,
  Sparkles,
  Info,
} from 'lucide-react';

export const PrescriptionChangeDetectorView: React.FC = () => {
  const { prescriptions, elderlyMode } = useApp();

  // Default to comparing Prescription #2 (Oct 1) vs Prescription #3 (Oct 8)
  const [oldRxId, setOldRxId] = useState<string>(
    prescriptions[1]?.id || prescriptions[0]?.id || ''
  );
  const [newRxId, setNewRxId] = useState<string>(
    prescriptions[2]?.id || prescriptions[0]?.id || ''
  );

  const oldRx = prescriptions.find((p) => p.id === oldRxId) || prescriptions[0];
  const newRx = prescriptions.find((p) => p.id === newRxId) || prescriptions[prescriptions.length - 1];

  const diff = useMemo(() => {
    if (!oldRx || !newRx) return { continued: [], added: [], removed: [], changed: [] };
    return comparePrescriptions(oldRx, newRx);
  }, [oldRx, newRx]);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
        <div>
          <h1 className={`font-extrabold text-slate-900 dark:text-white tracking-tight ${elderlyMode ? 'text-3xl' : 'text-2xl sm:text-3xl'}`}>
            Prescription Change Detector
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Identify medication additions, discontinuations, and dosage alterations between visits
          </p>
        </div>

        {/* Doctor Verification Notice Pill */}
        <div className="px-3.5 py-2 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 text-xs text-amber-800 dark:text-amber-300 flex items-center space-x-2 max-w-sm self-start sm:self-auto">
          <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
          <span className="leading-tight">Verify all regimen changes with your doctor before altering intake.</span>
        </div>
      </div>

      {/* SELECTOR BAR (Old Prescription vs New Prescription) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 space-y-3">
        <h2 className="text-xs font-bold uppercase text-slate-400 dark:text-slate-500 tracking-wider">
          Select Prescriptions to Compare
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Old Prescription Dropdown */}
          <div className="bg-slate-50/60 dark:bg-slate-800/40 rounded-xl p-3.5 border border-slate-200/80 dark:border-slate-700/80 space-y-1.5">
            <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase">
              Baseline / Old Prescription:
            </label>
            <select
              value={oldRxId}
              onChange={(e) => setOldRxId(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold text-xs sm:text-sm text-slate-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-sky-500"
            >
              {prescriptions.map((rx) => (
                <option key={rx.id} value={rx.id}>
                  {rx.title} ({rx.date}) — {rx.doctorName}
                </option>
              ))}
            </select>
            <div className="text-[11px] text-slate-500 dark:text-slate-400">
              Contains {oldRx?.items.length || 0} prescribed medications
            </div>
          </div>

          {/* New Prescription Dropdown */}
          <div className="bg-slate-50/60 dark:bg-slate-800/40 rounded-xl p-3.5 border border-slate-200/80 dark:border-slate-700/80 space-y-1.5">
            <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase">
              Follow-Up / New Prescription:
            </label>
            <select
              value={newRxId}
              onChange={(e) => setNewRxId(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold text-xs sm:text-sm text-slate-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-sky-500"
            >
              {prescriptions.map((rx) => (
                <option key={rx.id} value={rx.id}>
                  {rx.title} ({rx.date}) — {rx.doctorName}
                </option>
              ))}
            </select>
            <div className="text-[11px] text-slate-500 dark:text-slate-400">
              Contains {newRx?.items.length || 0} prescribed medications
            </div>
          </div>
        </div>
      </div>

      {/* COMPARISON RESULTS / DIFF CARDS */}
      <div className="space-y-5">
        <div className="flex items-center justify-between pb-2 border-b border-slate-200/80 dark:border-slate-800">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
            Prescription Changes Summary
          </h2>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            {diff.continued.length} Continued • {diff.added.length} Added • {diff.removed.length} Removed • {diff.changed.length} Changed
          </span>
        </div>

        {/* 1. ⚠️ CHANGED MEDICATIONS */}
        {diff.changed.length > 0 && (
          <div className="space-y-2.5">
            <div className="flex items-center space-x-1.5 text-amber-600 dark:text-amber-400 font-bold text-xs uppercase tracking-wider">
              <AlertTriangle className="w-4 h-4" />
              <span>Changed ({diff.changed.length})</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {diff.changed.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/60 rounded-xl p-4 space-y-2 shadow-2xs"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                      💊 {item.newMed.name}
                    </h3>
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-200 dark:bg-amber-900/60 text-amber-900 dark:text-amber-200">
                      Dosage Modified
                    </span>
                  </div>

                  <div className="space-y-1">
                    {item.changes.map((ch, cIdx) => (
                      <p key={cIdx} className="text-xs font-semibold text-amber-900 dark:text-amber-200 bg-white/80 dark:bg-slate-800/80 px-2.5 py-1 rounded-lg border border-amber-200/60 dark:border-amber-800/40">
                        {ch}
                      </p>
                    ))}
                  </div>

                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Old: {item.oldMed.strength} ({item.oldMed.frequency}) → New: {item.newMed.strength} ({item.newMed.frequency})
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 2. 🆕 ADDED MEDICATIONS */}
        {diff.added.length > 0 && (
          <div className="space-y-2.5">
            <div className="flex items-center space-x-1.5 text-sky-600 dark:text-sky-400 font-bold text-xs uppercase tracking-wider">
              <PlusCircle className="w-4 h-4" />
              <span>Added ({diff.added.length})</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {diff.added.map((item) => (
                <div
                  key={item.id}
                  className="bg-sky-50/50 dark:bg-sky-950/20 border border-sky-200 dark:border-sky-800/60 rounded-xl p-4 space-y-1.5 shadow-2xs"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                      💊 {item.name}
                    </h3>
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-sky-200 dark:bg-sky-900/60 text-sky-900 dark:text-sky-200">
                      New Medication
                    </span>
                  </div>

                  <p className="text-xs font-semibold text-sky-900 dark:text-sky-200">
                    {item.strength} • {item.dosage} • {item.frequency}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Instructions: {item.instructions || 'Follow doctor directions'}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 3. 🔴 REMOVED MEDICATIONS */}
        {diff.removed.length > 0 && (
          <div className="space-y-2.5">
            <div className="flex items-center space-x-1.5 text-rose-600 dark:text-rose-400 font-bold text-xs uppercase tracking-wider">
              <MinusCircle className="w-4 h-4" />
              <span>Removed / Discontinued ({diff.removed.length})</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {diff.removed.map((item) => (
                <div
                  key={item.id}
                  className="bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-800/60 rounded-xl p-4 space-y-1.5 shadow-2xs"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white line-through opacity-75">
                      💊 {item.name}
                    </h3>
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-rose-200 dark:bg-rose-900/60 text-rose-900 dark:text-rose-200">
                      Discontinued
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Previously prescribed: {item.strength} ({item.frequency}). Not present in new prescription.
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. 🟢 CONTINUED MEDICATIONS */}
        {diff.continued.length > 0 && (
          <div className="space-y-2.5">
            <div className="flex items-center space-x-1.5 text-emerald-600 dark:text-emerald-400 font-bold text-xs uppercase tracking-wider">
              <CheckCircle2 className="w-4 h-4" />
              <span>Continued Unchanged ({diff.continued.length})</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {diff.continued.map((item) => (
                <div
                  key={item.id}
                  className="bg-emerald-50/40 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/60 rounded-xl p-3.5 space-y-1 shadow-2xs"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                      💊 {item.name}
                    </h3>
                    <span className="text-[10px] font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-900/60 px-2 py-0.5 rounded-md">
                      Continued
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {item.strength} • {item.frequency}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Reminder Callout */}
      <div className="p-4 rounded-2xl bg-slate-900 dark:bg-slate-800/80 border border-slate-800 dark:border-slate-700 text-white flex items-center justify-between gap-4">
        <div className="space-y-0.5 text-xs sm:text-sm">
          <div className="font-bold text-amber-400">Clinical Verification Reminder</div>
          <p className="text-slate-300 text-xs">
            Please verify all prescription changes with your healthcare professional before adjusting medicine schedules.
          </p>
        </div>
      </div>
    </div>
  );
};
