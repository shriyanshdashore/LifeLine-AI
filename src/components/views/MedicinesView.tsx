import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Pill,
  Clock,
  Plus,
  CheckCircle2,
  Calendar,
  Camera,
} from 'lucide-react';

export const MedicinesView: React.FC = () => {
  const { medications, setActiveTab, setAddMedicationModalOpen, elderlyMode } = useApp();

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Minimal Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/60 dark:border-slate-800">
        <div>
          <h1 className={`font-extrabold text-slate-900 dark:text-white tracking-tight ${elderlyMode ? 'text-3xl' : 'text-2xl'}`}>
            My Medicines ({medications.length})
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Confirmed prescriptions actively managed in your daily timetable
          </p>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          <button
            onClick={() => setAddMedicationModalOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 font-semibold text-xs flex items-center space-x-1.5 transition active:scale-95 shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Medicine</span>
          </button>

          <button
            onClick={() => setActiveTab('scanner')}
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-medium text-xs flex items-center space-x-1.5 transition active:scale-95"
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Scan Rx</span>
          </button>
        </div>
      </div>

      {/* Medication Cards Grid (Clean Minimal Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {medications.map((med) => (
          <div
            key={med.id}
            className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-3 hover:border-slate-300 dark:hover:border-slate-700 transition"
          >
            <div className="flex items-start justify-between pb-2.5 border-b border-slate-100 dark:border-slate-800/70">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 flex items-center justify-center text-lg shrink-0">
                  💊
                </div>
                <div>
                  <h3 className={`font-bold text-slate-900 dark:text-white ${elderlyMode ? 'text-xl' : 'text-base'}`}>
                    {med.name}
                  </h3>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    {med.strength} • {med.dosage}
                  </div>
                </div>
              </div>

              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800 flex items-center space-x-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                <span>Confirmed</span>
              </span>
            </div>

            <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
              <div className="flex items-center space-x-2">
                <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>Frequency: {med.frequency}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>Timings: {med.timings.join(', ')}</span>
              </div>
              {med.instructions && (
                <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 text-[11px]">
                  {med.instructions}
                </div>
              )}
              {med.prescribedBy && (
                <p className="text-[10px] text-slate-400 pt-0.5">
                  Dr: {med.prescribedBy} • {med.prescriptionDate || 'Active'}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
