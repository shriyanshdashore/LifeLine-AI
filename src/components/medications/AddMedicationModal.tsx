import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Pill,
  X,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  Calendar,
  FileText,
  User,
  ShieldAlert,
} from 'lucide-react';
import { evaluateMedicationSafety } from '../../services/safetyEngine';
import { Medication } from '../../types';

export const AddMedicationModal: React.FC = () => {
  const {
    addMedicationModalOpen,
    setAddMedicationModalOpen,
    addNewMedication,
    medications,
    patientProfile,
    elderlyMode,
  } = useApp();

  const [name, setName] = useState('');
  const [genericName, setGenericName] = useState('');
  const [strength, setStrength] = useState('500 mg');
  const [dosage, setDosage] = useState('1 tablet');
  const [frequency, setFrequency] = useState('Twice daily');
  const [timings, setTimings] = useState<string[]>(['08:00 AM', '08:00 PM']);
  const [durationDays, setDurationDays] = useState(30);
  const [instructions, setInstructions] = useState('Take with or immediately after meals.');
  const [prescribedBy, setPrescribedBy] = useState('Dr. Anita Desai, MD');
  const [notes, setNotes] = useState('');

  if (!addMedicationModalOpen) return null;

  // Preset quick picks
  const quickPicks = [
    {
      name: 'Paracetamol (Dolo)',
      strength: '650 mg',
      dosage: '1 tablet',
      freq: 'As needed (max 3 times/day)',
      timings: ['02:00 PM'],
      instructions: 'For fever or mild pain. Do not exceed 2000mg/day.',
    },
    {
      name: 'Pantoprazole',
      strength: '40 mg',
      dosage: '1 tablet',
      freq: 'Once daily before breakfast',
      timings: ['07:30 AM'],
      instructions: 'Take on empty stomach with a glass of water.',
    },
    {
      name: 'Amlodipine',
      strength: '5 mg',
      dosage: '1 tablet',
      freq: 'Once daily in morning',
      timings: ['08:00 AM'],
      instructions: 'For blood pressure control.',
    },
    {
      name: 'Metformin Hydrochloride',
      strength: '500 mg',
      dosage: '1 tablet',
      freq: 'Twice daily with meals',
      timings: ['08:00 AM', '08:00 PM'],
      instructions: 'With meals to avoid stomach upset.',
    },
  ];

  const applyQuickPick = (pick: typeof quickPicks[0]) => {
    setName(pick.name);
    setStrength(pick.strength);
    setDosage(pick.dosage);
    setFrequency(pick.freq);
    setTimings(pick.timings);
    setInstructions(pick.instructions);
  };

  const toggleTiming = (timeStr: string) => {
    if (timings.includes(timeStr)) {
      if (timings.length > 1) {
        setTimings(timings.filter((t) => t !== timeStr));
      }
    } else {
      setTimings([...timings, timeStr]);
    }
  };

  // Immediate clinical conflict check preview
  const previewMed: Medication = {
    id: 'preview',
    name,
    strength,
    dosage,
    frequency,
    timings,
    durationDays,
    instructions,
    status: 'active',
    source: 'user_confirmed',
  };

  const potentialAlerts = name
    ? evaluateMedicationSafety([...medications, previewMed], patientProfile.allergies).filter(
        (a) => a.involvedMeds.some((m) => m.toLowerCase().includes(name.toLowerCase()))
      )
    : [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    addNewMedication({
      name: name.trim(),
      genericName: genericName.trim() || undefined,
      strength: strength.trim(),
      dosage: dosage.trim(),
      frequency: frequency.trim(),
      timings,
      durationDays: Number(durationDays) || 30,
      instructions: instructions.trim(),
      prescribedBy: prescribedBy.trim() || 'Prescribing Physician',
      notes: notes.trim(),
      confidence: 1.0,
      needsVerification: false,
    });

    setAddMedicationModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
      <div className="relative w-full max-w-2xl bg-white dark:bg-[#0c1626] rounded-3xl shadow-2xl border-2 border-slate-200 dark:border-cyan-500/30 overflow-hidden text-slate-900 dark:text-slate-100 my-6">
        {/* Top Header */}
        <div className="bg-gradient-to-r from-sky-600 via-teal-600 to-sky-700 dark:from-[#0a2540] dark:via-[#0e3b5e] dark:to-[#0a2540] text-white p-6 flex items-center justify-between border-b border-white/10">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 dark:bg-cyan-500/20 dark:border dark:border-cyan-400/40 flex items-center justify-center text-xl shadow-inner">
              💊
            </div>
            <div>
              <h2 className={`font-black tracking-tight ${elderlyMode ? 'text-2xl' : 'text-xl'}`}>
                Add New Medication
              </h2>
              <p className="text-xs text-sky-100 dark:text-cyan-200">
                Direct clinical entry with real-time interaction screening
              </p>
            </div>
          </div>

          <button
            onClick={() => setAddMedicationModalOpen(false)}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Picks Banner */}
        <div className="bg-slate-50 dark:bg-[#08121f] px-6 py-3.5 border-b border-slate-200 dark:border-slate-800 space-y-2">
          <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-500 dark:text-cyan-400">
            <Sparkles className="w-3.5 h-3.5 text-sky-500 dark:text-cyan-400" />
            <span>Popular Prescriptions Quick-Pick:</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {quickPicks.map((pick) => (
              <button
                key={pick.name}
                type="button"
                onClick={() => applyQuickPick(pick)}
                className="px-2.5 py-1 rounded-xl text-xs font-bold bg-white dark:bg-[#0e2238] border border-slate-200 dark:border-cyan-500/30 text-slate-700 dark:text-cyan-200 hover:border-sky-400 dark:hover:border-cyan-400 transition"
              >
                + {pick.name} ({pick.strength})
              </button>
            ))}
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-5 max-h-[70vh] overflow-y-auto">
          {/* Medicine Name & Strength */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-300 mb-1">
                Medicine Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Paracetamol, Metformin, Pantoprazole"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-[#0e1d30] border border-slate-300 dark:border-slate-700 font-bold text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500 dark:focus:ring-cyan-400"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-300 mb-1">
                Strength *
              </label>
              <input
                type="text"
                required
                value={strength}
                onChange={(e) => setStrength(e.target.value)}
                placeholder="e.g. 500 mg, 40 mg"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-[#0e1d30] border border-slate-300 dark:border-slate-700 font-bold text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500 dark:focus:ring-cyan-400"
              />
            </div>
          </div>

          {/* Dosage Form & Frequency */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-300 mb-1">
                Dosage Form
              </label>
              <select
                value={dosage}
                onChange={(e) => setDosage(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#0e1d30] border border-slate-300 dark:border-slate-700 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none"
              >
                <option value="1 tablet">1 tablet</option>
                <option value="2 tablets">2 tablets</option>
                <option value="1 capsule">1 capsule</option>
                <option value="5 ml syrup">5 ml syrup</option>
                <option value="10 ml syrup">10 ml syrup</option>
                <option value="1 puff inhaler">1 puff inhaler</option>
                <option value="2 drops">2 drops</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-300 mb-1">
                Frequency
              </label>
              <select
                value={frequency}
                onChange={(e) => setFrequency(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#0e1d30] border border-slate-300 dark:border-slate-700 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none"
              >
                <option value="Once daily">Once daily</option>
                <option value="Twice daily">Twice daily</option>
                <option value="Thrice daily">Thrice daily</option>
                <option value="Once at bedtime">Once at bedtime</option>
                <option value="As needed">As needed (SOS)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-300 mb-1">
                Duration (Days)
              </label>
              <input
                type="number"
                value={durationDays}
                onChange={(e) => setDurationDays(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#0e1d30] border border-slate-300 dark:border-slate-700 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none"
              />
            </div>
          </div>

          {/* Daily Timetable Slots */}
          <div>
            <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-300 mb-2">
              Daily Schedule Timings (Click to toggle)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { time: '08:00 AM', label: 'Morning Dose' },
                { time: '01:00 PM', label: 'Afternoon Dose' },
                { time: '05:00 PM', label: 'Evening Dose' },
                { time: '08:00 PM', label: 'Night Dose' },
              ].map((slot) => {
                const isSelected = timings.includes(slot.time);
                return (
                  <button
                    key={slot.time}
                    type="button"
                    onClick={() => toggleTiming(slot.time)}
                    className={`p-3 rounded-2xl border-2 text-left transition ${
                      isSelected
                        ? 'bg-sky-50 dark:bg-cyan-950/40 border-sky-500 dark:border-cyan-400 text-sky-900 dark:text-cyan-200'
                        : 'bg-slate-50 dark:bg-[#0e1d30] border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <div className="text-xs font-black">{slot.time}</div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400">{slot.label}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Food Instructions */}
          <div>
            <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-300 mb-1">
              Food & Administration Instructions
            </label>
            <input
              type="text"
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="e.g. Take with or after food, With glass of water"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-[#0e1d30] border border-slate-300 dark:border-slate-700 text-sm font-medium text-slate-900 dark:text-white focus:outline-none"
            />
          </div>

          {/* Prescribing Doctor */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-300 mb-1">
                Prescribing Doctor (Optional)
              </label>
              <input
                type="text"
                value={prescribedBy}
                onChange={(e) => setPrescribedBy(e.target.value)}
                placeholder="Dr. Anita Desai, MD"
                className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-[#0e1d30] border border-slate-300 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-300 mb-1">
                Clinical Reason / Notes
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. For fever control, routine refill"
                className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-[#0e1d30] border border-slate-300 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none"
              />
            </div>
          </div>

          {/* LIVE SAFETY CONFLICT ALERT PREVIEW */}
          {potentialAlerts.length > 0 && (
            <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border-2 border-amber-300 dark:border-amber-600/40 text-amber-900 dark:text-amber-200 text-xs space-y-1 animate-in shake">
              <div className="font-extrabold flex items-center space-x-1.5 text-amber-800 dark:text-amber-300">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Clinical Interaction Warning Detected!</span>
              </div>
              <p className="font-medium">
                {potentialAlerts[0].title}: {potentialAlerts[0].explanation}
              </p>
              <p className="text-[11px] font-bold text-amber-700 dark:text-amber-400">
                Recommendation: {potentialAlerts[0].recommendedAction}
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setAddMedicationModalOpen(false)}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm shadow-md transition active:scale-95 flex items-center space-x-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>✓ Add Medicine to Timetable</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
