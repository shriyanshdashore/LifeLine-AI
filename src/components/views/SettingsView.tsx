import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Settings,
  PhoneCall,
  Sliders,
  ShieldAlert,
  Globe,
  Bell,
  Key,
  Save,
  CheckCircle2,
  RefreshCw,
} from 'lucide-react';
import { Language } from '../../types';

export const SettingsView: React.FC = () => {
  const {
    patientProfile,
    setPatientProfile,
    elderlyMode,
    setElderlyMode,
    requestNotificationPermission,
    resetDemoData,
    addNotification,
  } = useApp();

  const [emergencyPhone, setEmergencyPhone] = useState(patientProfile.emergencyPhone);
  const [preferredLang, setPreferredLang] = useState<Language>(patientProfile.preferredLanguage);
  const [allergiesText, setAllergiesText] = useState(patientProfile.allergies.join(', '));
  const [conditionsText, setConditionsText] = useState(patientProfile.userConditions.join(', '));
  const [geminiKey, setGeminiKey] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setPatientProfile((prev) => ({
      ...prev,
      emergencyPhone: emergencyPhone.trim() || '112',
      preferredLanguage: preferredLang,
      allergies: allergiesText.split(',').map((s) => s.trim()).filter(Boolean),
      userConditions: conditionsText.split(',').map((s) => s.trim()).filter(Boolean),
    }));

    if (geminiKey) {
      localStorage.setItem('lifeline_gemini_api_key', geminiKey);
    }

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
    addNotification('⚙️ Settings Saved', 'Emergency numbers and patient preferences updated.', 'system');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
        <div>
          <h1 className={`font-extrabold text-slate-900 dark:text-white tracking-tight ${elderlyMode ? 'text-3xl' : 'text-2xl sm:text-3xl'}`}>
            Settings & Preferences
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Configure emergency dispatch numbers, elder accessibility mode, and clinical parameters
          </p>
        </div>

        <button
          onClick={resetDemoData}
          className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs flex items-center space-x-1.5 transition shrink-0 self-start sm:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Reset Demo State</span>
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-4">
        {/* Emergency Services Configuration */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
          <div className="flex items-center space-x-2.5 text-red-600 dark:text-red-400">
            <PhoneCall className="w-4 h-4" />
            <div>
              <h2 className="font-bold text-sm text-slate-900 dark:text-white">
                Emergency Dispatch Number
              </h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                National emergency dispatch target (Default: 112 for India)
              </p>
            </div>
          </div>

          <div className="max-w-xs">
            <label className="block text-[11px] font-bold uppercase text-slate-500 dark:text-slate-400 mb-1">
              Emergency Number
            </label>
            <input
              type="text"
              value={emergencyPhone}
              onChange={(e) => setEmergencyPhone(e.target.value)}
              placeholder="112"
              className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold text-base text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-sky-500"
            />
          </div>
        </div>

        {/* Accessibility & Voice Settings */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
          <div className="flex items-center space-x-2.5 text-indigo-600 dark:text-indigo-400">
            <Sliders className="w-4 h-4" />
            <div>
              <h2 className="font-bold text-sm text-slate-900 dark:text-white">
                Accessibility & Language
              </h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Elderly-friendly display scaling and preferred voice dialect
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Elder Mode Toggle */}
            <div className="p-3.5 rounded-xl bg-slate-50/60 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/80 flex items-center justify-between">
              <div>
                <span className="font-bold text-xs text-slate-900 dark:text-white block">
                  Elderly Accessibility Mode
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  Enlarges buttons and typography for maximum legibility
                </span>
              </div>
              <button
                type="button"
                onClick={() => setElderlyMode(!elderlyMode)}
                className={`w-12 h-6 rounded-full transition-colors p-0.5 ${
                  elderlyMode ? 'bg-amber-500' : 'bg-slate-300 dark:bg-slate-700'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform ${
                    elderlyMode ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Preferred Language */}
            <div className="p-3.5 rounded-xl bg-slate-50/60 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/80 space-y-1">
              <label className="block text-[11px] font-bold uppercase text-slate-500 dark:text-slate-400">
                Voice Assistant Language
              </label>
              <select
                value={preferredLang}
                onChange={(e) => setPreferredLang(e.target.value as Language)}
                className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-sky-500"
              >
                <option value="en">English (India)</option>
                <option value="hi">Hindi (हिंदी)</option>
                <option value="hinglish">Hinglish (Conversational)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Patient Clinical Profile */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
          <div className="flex items-center space-x-2.5 text-emerald-600 dark:text-emerald-400">
            <ShieldAlert className="w-4 h-4" />
            <div>
              <h2 className="font-bold text-sm text-slate-900 dark:text-white">
                User-Provided Medical Information
              </h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Explicitly separated from AI-extracted information in emergency brief
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold uppercase text-slate-500 dark:text-slate-400 mb-1">
                Known Personal Allergies (Comma Separated)
              </label>
              <input
                type="text"
                value={allergiesText}
                onChange={(e) => setAllergiesText(e.target.value)}
                placeholder="Penicillin, Sulfa Antibiotics"
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-sky-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase text-slate-500 dark:text-slate-400 mb-1">
                Diagnosed Conditions (Comma Separated)
              </label>
              <input
                type="text"
                value={conditionsText}
                onChange={(e) => setConditionsText(e.target.value)}
                placeholder="Type 2 Diabetes, Hypertension"
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-sky-500"
              />
            </div>
          </div>
        </div>

        {/* Optional Gemini API Key */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
          <div className="flex items-center space-x-2.5 text-sky-600 dark:text-sky-400">
            <Key className="w-4 h-4" />
            <div>
              <h2 className="font-bold text-sm text-slate-900 dark:text-white">
                Gemini Vision API Key (Optional)
              </h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Provide a key for live multimodal cloud OCR alongside offline demo parser
              </p>
            </div>
          </div>

          <div className="max-w-md">
            <input
              type="password"
              value={geminiKey}
              onChange={(e) => setGeminiKey(e.target.value)}
              placeholder="AIzaSy..."
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-sky-500"
            />
          </div>
        </div>

        {/* Save Bar */}
        <div className="flex items-center justify-end space-x-3 pt-2">
          {savedSuccess && (
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center space-x-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Saved!</span>
            </span>
          )}

          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white font-bold text-xs shadow-xs transition active:scale-95 flex items-center space-x-1.5"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Preferences</span>
          </button>
        </div>
      </form>
    </div>
  );
};
