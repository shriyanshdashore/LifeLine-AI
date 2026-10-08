import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  History,
  TrendingUp,
  Calendar,
  FileText,
  CheckCircle2,
  AlertTriangle,
  User,
  Clock,
  Eye,
  Info,
} from 'lucide-react';
import { Prescription } from '../../types';

export const HistoryAdherenceView: React.FC = () => {
  const { prescriptions, auditLogs, elderlyMode } = useApp();
  const [selectedRx, setSelectedRx] = useState<Prescription | null>(null);

  // Weekly Adherence Data Mock (Requirement #14)
  const daysOfWeek = [
    { day: 'Mon', scheduled: 3, taken: 3, percent: 100 },
    { day: 'Tue', scheduled: 3, taken: 3, percent: 100 },
    { day: 'Wed', scheduled: 3, taken: 3, percent: 100 },
    { day: 'Thu', scheduled: 3, taken: 2, percent: 67 },
    { day: 'Fri', scheduled: 3, taken: 3, percent: 100 },
    { day: 'Sat', scheduled: 3, taken: 3, percent: 100 },
    { day: 'Sun', scheduled: 3, taken: 2, percent: 67 },
  ];

  const totalScheduled = 21;
  const totalConfirmed = 19;
  const totalMissed = 2;
  const adherenceRate = Math.round((totalConfirmed / totalScheduled) * 100); // 90% ~ 92%

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
        <div>
          <h1 className={`font-extrabold text-slate-900 dark:text-white tracking-tight ${elderlyMode ? 'text-3xl' : 'text-2xl sm:text-3xl'}`}>
            Medication History & Adherence
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Weekly adherence rates and chronological prescription consultation records
          </p>
        </div>

        {/* Disclaimer Pill */}
        <div className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300 flex items-center space-x-1.5 self-start sm:self-auto">
          <Info className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span>Medication adherence, not a medical diagnosis score</span>
        </div>
      </div>

      {/* ADHERENCE DASHBOARD SECTION */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-5">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Weekly Adherence Metrics
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Confirmed intake vs scheduled dosage slots over the past 7 days
            </p>
          </div>
        </div>

        {/* Metric Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="p-4 rounded-xl bg-sky-50/70 dark:bg-sky-950/20 border border-sky-200/80 dark:border-sky-800/60 space-y-0.5">
            <span className="text-[11px] font-bold uppercase text-sky-700 dark:text-sky-300">Adherence Rate</span>
            <div className="text-2xl font-black text-sky-900 dark:text-white">{adherenceRate}%</div>
            <p className="text-[11px] text-sky-600 dark:text-sky-400">Consistent tracking this week</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/80 space-y-0.5">
            <span className="text-[11px] font-bold uppercase text-slate-400 dark:text-slate-500">Scheduled Doses</span>
            <div className="text-2xl font-black text-slate-900 dark:text-white">{totalScheduled}</div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">Planned over 7 days</p>
          </div>

          <div className="p-4 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200/80 dark:border-emerald-800/60 space-y-0.5">
            <span className="text-[11px] font-bold uppercase text-emerald-700 dark:text-emerald-400">Confirmed Taken</span>
            <div className="text-2xl font-black text-emerald-800 dark:text-emerald-300">{totalConfirmed}</div>
            <p className="text-[11px] text-emerald-600 dark:text-emerald-400">Logged on time</p>
          </div>

          <div className="p-4 rounded-xl bg-rose-50/60 dark:bg-rose-950/20 border border-rose-200/80 dark:border-rose-800/60 space-y-0.5">
            <span className="text-[11px] font-bold uppercase text-rose-700 dark:text-rose-400">Missed / Skipped</span>
            <div className="text-2xl font-black text-rose-800 dark:text-rose-300">{totalMissed}</div>
            <p className="text-[11px] text-rose-600 dark:text-rose-400">Reminders escalated</p>
          </div>
        </div>

        {/* 7-Day Adherence Chart */}
        <div className="pt-1 space-y-2">
          <h3 className="text-xs font-bold uppercase text-slate-400 dark:text-slate-500 tracking-wider">
            Past 7 Days Adherence
          </h3>
          <div className="grid grid-cols-7 gap-2">
            {daysOfWeek.map((day, idx) => (
              <div
                key={idx}
                className="bg-slate-50/70 dark:bg-slate-800/40 rounded-xl p-2.5 border border-slate-200/80 dark:border-slate-700/80 text-center space-y-1.5 flex flex-col justify-between"
              >
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">{day.day}</span>
                <div className="w-full bg-slate-200 dark:bg-slate-700 h-14 rounded-lg flex items-end overflow-hidden p-0.5">
                  <div
                    className={`w-full rounded-md transition-all ${
                      day.percent === 100 ? 'bg-emerald-500' : 'bg-amber-400'
                    }`}
                    style={{ height: `${day.percent}%` }}
                  />
                </div>
                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500">
                  {day.taken}/{day.scheduled}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* PRESCRIPTION HISTORY */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Prescription Records
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Chronological doctor consultation records and archived medications
            </p>
          </div>
        </div>

        <div className="space-y-2.5">
          {prescriptions.map((rx) => (
            <div
              key={rx.id}
              className="p-4 rounded-xl bg-slate-50/60 dark:bg-slate-800/30 hover:bg-slate-100/60 dark:hover:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="flex items-start space-x-3.5">
                <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sky-600 dark:text-sky-400 shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                      {rx.title}
                    </h3>
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                      rx.status === 'active'
                        ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300'
                        : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                    }`}>
                      {rx.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Dr. {rx.doctorName} • {rx.clinic}
                  </p>
                  <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">
                    Date: {rx.date} • {rx.items.length} prescribed medications
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedRx(rx)}
                className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-xs border border-slate-200 dark:border-slate-700 self-end sm:self-center transition shadow-2xs"
              >
                View Details →
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* AUDIT LOG TRAIL */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
        <h3 className="font-bold text-xs uppercase tracking-wider text-slate-900 dark:text-white flex items-center space-x-2">
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          <span>Patient Activity Audit Trail</span>
        </h3>
        <div className="max-h-48 overflow-y-auto space-y-2 divide-y divide-slate-100 dark:divide-slate-800 text-xs">
          {auditLogs.map((log) => (
            <div key={log.id} className="pt-2 flex items-start justify-between">
              <div>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{log.action}</span>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">{log.details}</p>
              </div>
              <span className="text-[10px] text-slate-400 shrink-0 ml-4">{log.timestamp}</span>
            </div>
          ))}
        </div>
      </div>

      {/* PRESCRIPTION DETAIL MODAL */}
      {selectedRx && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200 dark:border-slate-800 space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-base text-slate-900 dark:text-white">{selectedRx.title}</h3>
              <button
                onClick={() => setSelectedRx(null)}
                className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 text-xs font-bold"
              >
                ✕ Close
              </button>
            </div>

            <div className="space-y-1 text-xs text-slate-600 dark:text-slate-300">
              <p><strong>Doctor:</strong> {selectedRx.doctorName}</p>
              <p><strong>Clinic:</strong> {selectedRx.clinic}</p>
              <p><strong>Date:</strong> {selectedRx.date}</p>
              {selectedRx.notes && <p><strong>Notes:</strong> {selectedRx.notes}</p>}
            </div>

            <div className="space-y-2 pt-1">
              <h4 className="font-bold text-[11px] uppercase text-slate-400 dark:text-slate-500">Prescribed Medicines</h4>
              <div className="space-y-1.5 max-h-48 overflow-y-auto">
                {selectedRx.items.map((m) => (
                  <div key={m.id} className="p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/80 dark:border-slate-700 text-xs space-y-0.5">
                    <div className="font-bold text-slate-800 dark:text-slate-200">💊 {m.name} ({m.strength})</div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">{m.frequency} • {m.instructions}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
