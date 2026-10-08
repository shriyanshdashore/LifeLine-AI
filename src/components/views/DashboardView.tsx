import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Camera,
  Pill,
  Clock,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  HeartPulse,
  Plus,
} from 'lucide-react';

export const DashboardView: React.FC = () => {
  const {
    patientProfile,
    schedule,
    medications,
    safetyAlerts,
    setActiveTab,
    setAddMedicationModalOpen,
    triggerPanicAlert,
    markDose,
    elderlyMode,
  } = useApp();

  const totalDoses = schedule.length;
  const completedDoses = schedule.filter((s) => s.status === 'taken').length;
  const progressPercent = totalDoses > 0 ? Math.round((completedDoses / totalDoses) * 100) : 0;

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      {/* 1. MINIMAL HEADER GREETING & PROGRESS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1">
        <div>
          <h1 className={`font-extrabold text-slate-900 dark:text-white tracking-tight ${elderlyMode ? 'text-3xl' : 'text-2xl sm:text-3xl'}`}>
            Good Morning, {patientProfile.name} 👋
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Your medication and safety companion
          </p>
        </div>

        {/* Minimal Progress Badge */}
        <div className="flex items-center space-x-3 bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800 px-3.5 py-2 rounded-xl shadow-2xs self-start sm:self-auto">
          <div className="text-right">
            <div className="text-xs font-bold text-slate-900 dark:text-white">
              {completedDoses} of {totalDoses} medicines
            </div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400">
              completed today
            </div>
          </div>
          <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 border-2 border-emerald-500 flex items-center justify-center font-bold text-[11px] text-slate-900 dark:text-white">
            {progressPercent}%
          </div>
        </div>
      </div>

      {/* 2. MINIMAL SAFETY ALERT (If issues detected) */}
      {safetyAlerts.length > 0 && (
        <div
          onClick={() => setActiveTab('safety')}
          className="bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-800/60 rounded-xl p-3.5 flex items-start justify-between cursor-pointer hover:bg-amber-50 dark:hover:bg-amber-950/30 transition shadow-2xs group"
        >
          <div className="flex items-start space-x-3">
            <ShieldAlert className="w-4 h-4 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
            <div className="space-y-0.5 text-xs sm:text-sm">
              <div className="font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                <span>{safetyAlerts[0].title}</span>
                <span className="text-[10px] font-semibold text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-900/60 px-2 py-0.2 rounded-full">
                  Safety Review
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-1">
                {safetyAlerts[0].explanation}
              </p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 dark:text-slate-500 self-center group-hover:translate-x-0.5 transition" />
        </div>
      )}

      {/* 3. TODAY'S MEDICATION CARD */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200/70 dark:border-slate-800 shadow-2xs space-y-3.5">
        <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Today's Medication
            </h2>
            <div className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white mt-0.5">
              {completedDoses} / {totalDoses} doses completed
            </div>
          </div>

          <button
            onClick={() => setAddMedicationModalOpen(true)}
            className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center space-x-1 transition active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Dose</span>
          </button>
        </div>

        {/* Minimal Progress Line */}
        <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
          <div
            className="bg-emerald-500 h-full rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Medication List Items */}
        <div className="space-y-2 pt-0.5">
          {schedule.map((slot) => {
            const isTaken = slot.status === 'taken';
            const isUpcoming = slot.status === 'upcoming';
            const isSkipped = slot.status === 'skipped';

            return (
              <div
                key={slot.id}
                className={`p-3 rounded-xl border transition flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 ${
                  isTaken
                    ? 'bg-slate-50/60 dark:bg-slate-800/30 border-slate-200/50 dark:border-slate-800/60'
                    : isSkipped
                    ? 'bg-slate-50 dark:bg-slate-900 border-slate-200/40 dark:border-slate-800 opacity-50'
                    : 'bg-white dark:bg-slate-900 border-slate-200/70 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="text-center px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-800 shrink-0">
                    <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                      {slot.scheduledTime}
                    </span>
                  </div>

                  <div>
                    <div className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm flex items-center space-x-1.5">
                      <span>💊</span>
                      <span>{slot.medicationName}</span>
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">
                      {slot.strength} • {slot.dosage}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2 shrink-0 self-end sm:self-center">
                  {isTaken ? (
                    <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-800">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Taken</span>
                    </span>
                  ) : isSkipped ? (
                    <span className="text-xs text-slate-400">Skipped</span>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <span className="text-[11px] text-slate-400">
                        {isUpcoming ? 'Upcoming' : 'Pending'}
                      </span>
                      <button
                        onClick={() => markDose(slot.id, 'taken')}
                        className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 text-xs font-semibold shadow-xs transition active:scale-95"
                      >
                        ✓ Mark Taken
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. PRIMARY ACTIONS (Clean & Minimal Tiles) */}
      <div className="space-y-2">
        <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-0.5">
          Primary Actions
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-2.5">
          {/* Action 1: Scan Prescription */}
          <button
            onClick={() => setActiveTab('scanner')}
            className="p-3 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/60 border border-slate-200/70 dark:border-slate-800 transition text-left flex items-center space-x-2.5 group shadow-2xs"
          >
            <div className="w-8 h-8 rounded-lg bg-sky-50 dark:bg-sky-950/50 text-sky-600 dark:text-sky-400 flex items-center justify-center shrink-0">
              <Camera className="w-4 h-4" />
            </div>
            <div className="truncate">
              <div className="font-bold text-slate-900 dark:text-white text-xs truncate">Scan Rx</div>
              <div className="text-[10px] text-slate-400 truncate">AI extractor</div>
            </div>
          </button>

          {/* Action 2: My Medicines */}
          <button
            onClick={() => setActiveTab('medicines')}
            className="p-3 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/60 border border-slate-200/70 dark:border-slate-800 transition text-left flex items-center space-x-2.5 group shadow-2xs"
          >
            <div className="w-8 h-8 rounded-lg bg-teal-50 dark:bg-teal-950/50 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0">
              <Pill className="w-4 h-4" />
            </div>
            <div className="truncate">
              <div className="font-bold text-slate-900 dark:text-white text-xs truncate">Medicines</div>
              <div className="text-[10px] text-slate-400 truncate">{medications.length} active</div>
            </div>
          </button>

          {/* Action 3: Today's Schedule */}
          <button
            onClick={() => setActiveTab('schedule')}
            className="p-3 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/60 border border-slate-200/70 dark:border-slate-800 transition text-left flex items-center space-x-2.5 group shadow-2xs"
          >
            <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
              <Clock className="w-4 h-4" />
            </div>
            <div className="truncate">
              <div className="font-bold text-slate-900 dark:text-white text-xs truncate">Schedule</div>
              <div className="text-[10px] text-slate-400 truncate">Daily timeline</div>
            </div>
          </button>

          {/* Action 4: Safety Alerts */}
          <button
            onClick={() => setActiveTab('safety')}
            className="p-3 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/60 border border-slate-200/70 dark:border-slate-800 transition text-left flex items-center space-x-2.5 group shadow-2xs relative"
          >
            {safetyAlerts.length > 0 && (
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-amber-500" />
            )}
            <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div className="truncate">
              <div className="font-bold text-slate-900 dark:text-white text-xs truncate">Safety</div>
              <div className="text-[10px] text-slate-400 truncate">Drug check</div>
            </div>
          </button>

          {/* Action 5: PANIC (112 & Caregiver) */}
          <button
            onClick={triggerPanicAlert}
            className="col-span-2 sm:col-span-1 p-3 rounded-xl bg-red-600 hover:bg-red-700 text-white transition text-left flex items-center space-x-2.5 shadow-xs active:scale-95 group"
            title="Calls 112 & Caregiver"
          >
            <div className="w-8 h-8 rounded-lg bg-white/20 text-white flex items-center justify-center shrink-0">
              <AlertTriangle className="w-4 h-4 text-white" />
            </div>
            <div className="truncate">
              <div className="font-black text-white text-xs truncate">112 SOS</div>
              <div className="text-[10px] text-red-100 truncate">Emergency</div>
            </div>
          </button>
        </div>
      </div>

      {/* 5. MINIMAL EMERGENCY BRIEF STRIP */}
      <div className="p-3.5 sm:p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800 flex items-center justify-between gap-3 shadow-2xs">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400">
            <HeartPulse className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-900 dark:text-white">Emergency Health Brief Ready</div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400">
              Blood: {patientProfile.bloodGroup} • Allergies: {patientProfile.allergies.join(', ')} • 112 Speed-Dial
            </div>
          </div>
        </div>
        <button
          onClick={() => setActiveTab('emergency')}
          className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold transition shrink-0"
        >
          View Brief →
        </button>
      </div>
    </div>
  );
};
