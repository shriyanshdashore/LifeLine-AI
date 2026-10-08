import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Clock,
  CheckCircle2,
  XCircle,
  BellRing,
  AlertTriangle,
  UserCheck,
  Send,
  Sparkles,
  Calendar,
  Volume2,
  Plus,
} from 'lucide-react';
import { playAlertChime } from '../../services/speechAssistant';

export const ScheduleTimelineView: React.FC = () => {
  const {
    schedule,
    markDose,
    escalateMissedDose,
    caregivers,
    addNotification,
    requestNotificationPermission,
    elderlyMode,
    setAddMedicationModalOpen,
  } = useApp();

  const [activeTabPeriod, setActiveTabPeriod] = useState<string>('all');
  const [reminderSimulated, setReminderSimulated] = useState<boolean>(false);

  // Group by periods
  const periods = [
    { id: 'all', label: 'All Doses' },
    { id: 'morning', label: 'Morning (08:00 AM)' },
    { id: 'afternoon', label: 'Afternoon (01:00 PM)' },
    { id: 'night', label: 'Night (08:00 PM)' },
  ];

  const filteredSchedule = schedule.filter((s) => {
    if (activeTabPeriod === 'all') return true;
    return s.period === activeTabPeriod;
  });

  // Test Reminder Simulation (Requirement #10 & Demo Step 6)
  const handleTriggerSimulatedReminder = () => {
    playAlertChime('reminder');
    setReminderSimulated(true);
    addNotification(
      '🔔 Medicine Reminder: Glimepiride 1 mg',
      'It is time to take your evening dose of Glimepiride 1 mg with your dinner.',
      'reminder'
    );
    setTimeout(() => setReminderSimulated(false), 5000);
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      {/* Minimal Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/60 dark:border-slate-800">
        <div>
          <h1 className={`font-extrabold text-slate-900 dark:text-white tracking-tight ${elderlyMode ? 'text-3xl' : 'text-2xl'}`}>
            Today's Schedule
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Track confirmed doses, snooze reminders, and dispatch caregiver alerts
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex items-center space-x-2 shrink-0">
          <button
            onClick={() => setAddMedicationModalOpen(true)}
            className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 font-semibold text-xs flex items-center space-x-1 transition active:scale-95 shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Dose</span>
          </button>
          <button
            onClick={async () => {
              await requestNotificationPermission();
              handleTriggerSimulatedReminder();
            }}
            className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-medium text-xs flex items-center space-x-1.5 transition active:scale-95"
          >
            <BellRing className="w-3.5 h-3.5 text-sky-500" />
            <span>Test Reminder</span>
          </button>
        </div>
      </div>

      {/* SIMULATED REMINDER TOAST BANNER */}
      {reminderSimulated && (
        <div className="bg-slate-900 text-white p-4 rounded-2xl shadow-lg border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 animate-in slide-in-from-top-2">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
              <BellRing className="w-5 h-5 text-sky-400 animate-pulse" />
            </div>
            <div>
              <div className="text-xs font-bold">🔔 Reminder: Time for Glimepiride</div>
              <p className="text-[11px] text-slate-300">1 tablet (1 mg) with evening dinner.</p>
            </div>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <button
              onClick={() => {
                const target = schedule.find((s) => s.medicationName.includes('Glimepiride')) || schedule[0];
                markDose(target.id, 'taken');
                setReminderSimulated(false);
              }}
              className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition"
            >
              ✓ Taken
            </button>
            <button
              onClick={() => {
                const target = schedule.find((s) => s.medicationName.includes('Glimepiride')) || schedule[0];
                markDose(target.id, 'snoozed');
                setReminderSimulated(false);
              }}
              className="px-3 py-1.5 rounded-lg bg-white/15 hover:bg-white/25 text-white font-medium text-xs transition"
            >
              Remind Later
            </button>
          </div>
        </div>
      )}

      {/* FILTER BUTTONS */}
      <div className="flex flex-wrap items-center gap-1.5">
        {periods.map((p) => (
          <button
            key={p.id}
            onClick={() => setActiveTabPeriod(p.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTabPeriod === p.id
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* TIMELINE SLOTS */}
      <div className="space-y-3">
        {filteredSchedule.map((slot) => {
          const isTaken = slot.status === 'taken';
          const isPending = slot.status === 'pending';
          const isUpcoming = slot.status === 'upcoming';
          const isSkipped = slot.status === 'skipped';
          const isSnoozed = slot.status === 'snoozed';

          return (
            <div
              key={slot.id}
              className={`rounded-2xl p-4 sm:p-5 border transition flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                isTaken
                  ? 'bg-slate-50/70 dark:bg-slate-800/40 border-slate-200/60 dark:border-slate-800'
                  : isSkipped
                  ? 'bg-slate-50 dark:bg-slate-900 border-slate-200/40 dark:border-slate-800 opacity-60'
                  : isSnoozed
                  ? 'bg-amber-50/40 dark:bg-amber-950/20 border-amber-200/80 dark:border-amber-800/60'
                  : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-2xs'
              }`}
            >
              <div className="flex items-start space-x-3.5">
                {/* Time Indicator */}
                <div className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-center shrink-0">
                  <span className="text-[10px] font-semibold text-slate-400 block uppercase">Time</span>
                  <span className="text-xs font-bold text-slate-900 dark:text-white block mt-0.5">
                    {slot.scheduledTime}
                  </span>
                </div>

                {/* Info */}
                <div className="space-y-0.5">
                  <div className="flex items-center space-x-1.5">
                    <span className="text-base">💊</span>
                    <h2 className={`font-bold text-slate-900 dark:text-white ${elderlyMode ? 'text-xl' : 'text-base'}`}>
                      {slot.medicationName}
                    </h2>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                    <span>{slot.strength}</span>
                    <span>•</span>
                    <span>{slot.dosage}</span>
                    {slot.notes && (
                      <>
                        <span>•</span>
                        <span className="italic">{slot.notes}</span>
                      </>
                    )}
                  </div>

                  {/* Overdue Warning Callout (Requirement #11) */}
                  {(isPending || isUpcoming) && (
                    <div className="pt-1 flex items-center space-x-2">
                      <span className="text-[11px] text-slate-500 dark:text-slate-400">
                        {isUpcoming ? '⏳ Scheduled' : '⚠️ Unconfirmed'}
                      </span>
                      {slot.escalatedToCaregiver && (
                        <span className="text-[10px] font-semibold text-indigo-700 dark:text-cyan-300 bg-indigo-50 dark:bg-cyan-950/60 px-2 py-0.2 rounded-full flex items-center space-x-1">
                          <Send className="w-3 h-3 text-indigo-600 dark:text-cyan-400" />
                          <span>Caregiver Notified ({slot.escalatedAt})</span>
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* ACTION BUTTONS */}
              <div className="flex flex-wrap items-center gap-2 shrink-0 self-end md:self-center">
                {isTaken ? (
                  <div className="px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-semibold text-xs border border-emerald-200/60 dark:border-emerald-800 flex items-center space-x-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span>Taken at {slot.takenAt || '08:05 AM'}</span>
                  </div>
                ) : (
                  <>
                    {/* Mark Taken Button */}
                    <button
                      onClick={() => markDose(slot.id, 'taken')}
                      className={`font-semibold rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 shadow-2xs transition active:scale-95 flex items-center space-x-1.5 ${
                        elderlyMode ? 'px-4 py-2 text-sm' : 'px-3 py-1.5 text-xs'
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Mark Taken</span>
                    </button>

                    {/* Snooze / Remind Later */}
                    <button
                      onClick={() => markDose(slot.id, 'snoozed')}
                      className="px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium text-xs transition"
                    >
                      Snooze 15m
                    </button>

                    {/* Skip */}
                    <button
                      onClick={() => markDose(slot.id, 'skipped')}
                      className="px-2 py-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 font-medium text-xs transition"
                    >
                      Skip
                    </button>

                    {/* Escalate to Caregiver (Requirement #11) */}
                    {!slot.escalatedToCaregiver && (
                      <button
                        onClick={() => escalateMissedDose(slot.id)}
                        title="Alert primary caregiver of missed or delayed dose"
                        className="px-2.5 py-1.5 rounded-xl bg-indigo-50 dark:bg-cyan-950/60 hover:bg-indigo-100 dark:hover:bg-cyan-900/60 text-indigo-700 dark:text-cyan-300 font-medium text-xs flex items-center space-x-1 transition"
                      >
                        <UserCheck className="w-3.5 h-3.5" />
                        <span>Notify Caregiver</span>
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* CAREGIVER ESCALATION INFO FOOTER */}
      <div className="bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 text-xs text-slate-600 dark:text-slate-400 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-2">
          <UserCheck className="w-4 h-4 text-indigo-600 dark:text-cyan-400 shrink-0" />
          <span>
            Caregiver escalation active: <strong>{caregivers[0]?.name} ({caregivers[0]?.relation})</strong> will be notified if doses remain unconfirmed past 60 minutes.
          </span>
        </div>
        <span className="text-[11px] text-slate-400 dark:text-slate-500">
          The system does not make automated diagnostic assumptions from missed doses.
        </span>
      </div>
    </div>
  );
};
