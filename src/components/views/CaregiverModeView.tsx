import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Users,
  ShieldCheck,
  UserPlus,
  Bell,
  PhoneCall,
  Mail,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Sparkles,
} from 'lucide-react';
import { Caregiver } from '../../types';

export const CaregiverModeView: React.FC = () => {
  const {
    caregivers,
    addCaregiver,
    schedule,
    safetyAlerts,
    patientProfile,
    elderlyMode,
  } = useApp();

  const [addModalOpen, setAddModalOpen] = useState<boolean>(false);
  const [newCgName, setNewCgName] = useState('');
  const [newCgRelation, setNewCgRelation] = useState('Daughter');
  const [newCgPhone, setNewCgPhone] = useState('');
  const [newCgEmail, setNewCgEmail] = useState('');

  // Patient Status Breakdown
  const morningDoses = schedule.filter((s) => s.period === 'morning');
  const afternoonDoses = schedule.filter((s) => s.period === 'afternoon');
  const nightDoses = schedule.filter((s) => s.period === 'night');

  const morningTaken = morningDoses.every((s) => s.status === 'taken');
  const afternoonTaken = afternoonDoses.length === 0 || afternoonDoses.every((s) => s.status === 'taken');
  const nightPending = nightDoses.some((s) => s.status === 'upcoming' || s.status === 'pending');

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCgName || !newCgPhone) return;

    addCaregiver({
      name: newCgName,
      relation: newCgRelation,
      phone: newCgPhone,
      email: newCgEmail || `${newCgName.toLowerCase().replace(/\s+/g, '')}@example.com`,
      notifyOnMissed: true,
      notifyOnPanic: true,
      dailySummary: true,
    });

    setNewCgName('');
    setNewCgPhone('');
    setNewCgEmail('');
    setAddModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
        <div>
          <h1 className={`font-extrabold text-slate-900 dark:text-white tracking-tight ${elderlyMode ? 'text-3xl' : 'text-2xl sm:text-3xl'}`}>
            Caregiver Mode
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Keep trusted family members and caregivers synchronized with medication status and alerts
          </p>
        </div>

        <button
          onClick={() => setAddModalOpen(true)}
          className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white font-semibold text-xs flex items-center space-x-1.5 shadow-xs transition active:scale-95 shrink-0 self-start sm:self-auto"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add Caregiver</span>
        </button>
      </div>

      {/* RAJ'S MEDICATION STATUS (Caregiver Perspective Dashboard) */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200/70 dark:border-slate-800 shadow-2xs space-y-3.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-2.5 border-b border-slate-100 dark:border-slate-800">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
              Live Patient Telemetry
            </span>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mt-0.5">
              {patientProfile.name}'s Medication Status
            </h2>
          </div>

          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700">
              Safety Alerts: ⚠️ {safetyAlerts.length}
            </span>
          </div>
        </div>

        {/* Status Blocks (Morning, Afternoon, Night) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {/* Morning */}
          <div className="bg-slate-50/70 dark:bg-slate-800/40 rounded-xl p-3.5 border border-slate-200/60 dark:border-slate-700/60 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Morning Regimen</span>
            <div className="flex items-center space-x-1.5 text-emerald-600 dark:text-emerald-400 font-bold text-sm">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              <span>Taken</span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Metformin 500mg, Telmisartan 40mg confirmed.
            </p>
          </div>

          {/* Afternoon */}
          <div className="bg-slate-50/70 dark:bg-slate-800/40 rounded-xl p-3.5 border border-slate-200/60 dark:border-slate-700/60 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Afternoon Regimen</span>
            <div className="flex items-center space-x-1.5 text-emerald-600 dark:text-emerald-400 font-bold text-sm">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              <span>On Schedule</span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              No midday doses missed or unconfirmed.
            </p>
          </div>

          {/* Night */}
          <div className="bg-slate-50/70 dark:bg-slate-800/40 rounded-xl p-3.5 border border-slate-200/60 dark:border-slate-700/60 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Night Regimen</span>
            <div className="flex items-center space-x-1.5 text-amber-600 dark:text-amber-400 font-bold text-sm">
              <Clock className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
              <span>Pending</span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Glimepiride 1mg due with dinner (08:00 PM).
            </p>
          </div>
        </div>
      </div>

      {/* SAFETY CIRCLE MEMBERS */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Safety Circle Members
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Configured family members receiving escalation alerts
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {caregivers.map((cg) => (
            <div
              key={cg.id}
              className="p-4 rounded-xl bg-slate-50/60 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/80 space-y-3"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-xl bg-sky-100 dark:bg-sky-950/60 text-sky-800 dark:text-sky-300 font-bold text-base flex items-center justify-center shrink-0">
                    {cg.relation.includes('Son') ? '👨' : cg.relation.includes('Daughter') ? '👩' : '🧑‍⚕️'}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                      {cg.name}
                    </h3>
                    <span className="text-[11px] font-semibold text-sky-700 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/60 px-2 py-0.2 rounded-md">
                      {cg.relation}
                    </span>
                  </div>
                </div>

                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300">
                  Connected
                </span>
              </div>

              <div className="space-y-1 text-xs text-slate-600 dark:text-slate-400 pt-0.5">
                <div className="flex items-center space-x-2">
                  <PhoneCall className="w-3.5 h-3.5 text-slate-400" />
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{cg.phone}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span>{cg.email}</span>
                </div>
              </div>

              {/* Preferences */}
              <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700/60 flex flex-wrap gap-1.5 text-[10px] font-medium text-slate-500 dark:text-slate-400">
                <span className={`px-2 py-0.5 rounded-md ${cg.notifyOnMissed ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300' : 'bg-slate-100 dark:bg-slate-800'}`}>
                  Missed Dose Alerts: {cg.notifyOnMissed ? 'Yes' : 'No'}
                </span>
                <span className={`px-2 py-0.5 rounded-md ${cg.notifyOnPanic ? 'bg-red-50 dark:bg-red-950/60 text-red-700 dark:text-red-300' : 'bg-slate-100 dark:bg-slate-800'}`}>
                  Panic Alarms: {cg.notifyOnPanic ? 'Yes' : 'No'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ADD CAREGIVER MODAL */}
      {addModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleAddSubmit}
            className="bg-white dark:bg-slate-900 rounded-2xl max-w-sm w-full p-6 shadow-xl border border-slate-200 dark:border-slate-800 space-y-4 animate-in zoom-in-95"
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-base text-slate-900 dark:text-white">Add to Safety Circle</h3>
              <button
                type="button"
                onClick={() => setAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase mb-1 text-[11px]">Full Name</label>
                <input
                  type="text"
                  required
                  value={newCgName}
                  onChange={(e) => setNewCgName(e.target.value)}
                  placeholder="e.g. Sister Mary / Brother Rohit"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase mb-1 text-[11px]">Relationship</label>
                <select
                  value={newCgRelation}
                  onChange={(e) => setNewCgRelation(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-sky-500"
                >
                  <option value="Son">Son</option>
                  <option value="Daughter">Daughter</option>
                  <option value="Spouse">Spouse</option>
                  <option value="Caregiver">Caregiver / Nurse</option>
                  <option value="Neighbor">Neighbor / Guardian</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase mb-1 text-[11px]">Phone Number</label>
                <input
                  type="tel"
                  required
                  value={newCgPhone}
                  onChange={(e) => setNewCgPhone(e.target.value)}
                  placeholder="+91 98XXX XXXXX"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase mb-1 text-[11px]">Email (Optional)</label>
                <input
                  type="email"
                  value={newCgEmail}
                  onChange={(e) => setNewCgEmail(e.target.value)}
                  placeholder="contact@example.com"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-sky-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setAddModalOpen(false)}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white font-bold text-xs shadow-xs"
              >
                Add to Circle
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
