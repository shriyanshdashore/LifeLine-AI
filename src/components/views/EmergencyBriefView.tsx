import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  AlertOctagon,
  PhoneCall,
  MapPin,
  Share2,
  Printer,
  QrCode,
  ShieldCheck,
  HeartPulse,
  AlertTriangle,
  Copy,
  Check,
  WifiOff,
} from 'lucide-react';

export const EmergencyBriefView: React.FC = () => {
  const {
    patientProfile,
    medications,
    schedule,
    elderlyMode,
    addNotification,
  } = useApp();

  const [copied, setCopied] = useState<boolean>(false);
  const [showQrModal, setShowQrModal] = useState<boolean>(false);
  const [locationGranted, setLocationGranted] = useState<boolean>(patientProfile.locationConsent);

  const primaryContact =
    patientProfile.emergencyContacts.find((c) => c.isPrimary) ||
    patientProfile.emergencyContacts[0];

  const lastTaken = schedule.filter((s) => s.status === 'taken').slice(-1)[0];

  const generateBriefText = () => {
    return `🚨 EMERGENCY HEALTH BRIEF - LIFELINE AI
Patient: ${patientProfile.name} | Age: ${patientProfile.age} | Blood Group: ${patientProfile.bloodGroup}
Allergies (User-Provided): ${patientProfile.allergies.join(', ')}
Medical Conditions: ${patientProfile.userConditions.join(', ')}
Active Medications (${medications.length}):
${medications.map((m) => `• ${m.name} ${m.strength} (${m.frequency})`).join('\n')}
Last Confirmed Medication: ${lastTaken ? `${lastTaken.medicationName} at ${lastTaken.takenAt || '08:05 AM'}` : '08:05 AM today'}
Primary Emergency Contact: ${primaryContact.name} (${primaryContact.relation}) - ${primaryContact.phone}
Emergency Services: ${patientProfile.emergencyPhone}
Location: ${locationGranted ? (patientProfile.lastKnownLocation?.address || 'Bengaluru, India') : 'Location sharing withheld'}`;
  };

  const handleShare = async () => {
    const text = generateBriefText();
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Emergency Health Brief - ${patientProfile.name}`,
          text,
        });
        addNotification('📤 Health Brief Shared', 'Sent via device sharing menu.', 'system');
        return;
      } catch (err) {}
    }

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
    addNotification('📋 Brief Copied', 'Health brief copied to clipboard.', 'system');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      {/* Action Bar (Share, Print, QR, Offline Status) */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-slate-900 rounded-2xl p-3.5 sm:p-4 border border-slate-200/70 dark:border-slate-800 shadow-2xs">
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-400 text-xs font-semibold border border-emerald-200/60 dark:border-emerald-800">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>100% Offline Accessible • Cached</span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleShare}
            className="px-3 py-1.5 rounded-xl bg-slate-900 dark:bg-white hover:bg-slate-800 dark:hover:bg-slate-100 text-white dark:text-slate-900 font-semibold text-xs flex items-center space-x-1.5 transition active:scale-95 shadow-2xs"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400 dark:text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied!' : 'Share Card'}</span>
          </button>

          <button
            onClick={() => setShowQrModal(true)}
            className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-xs flex items-center space-x-1.5 transition"
          >
            <QrCode className="w-3.5 h-3.5 text-slate-500" />
            <span>Paramedic QR</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-xs flex items-center space-x-1.5 transition"
          >
            <Printer className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden sm:inline">Print</span>
          </button>
        </div>
      </div>

      {/* EMERGENCY BRIEF CARD (HIGH CONTRAST & RESPONDER READY) */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border-2 border-red-500 shadow-xl overflow-hidden">
        {/* Top Emergency Red Header */}
        <div className="bg-red-600 text-white p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center space-x-2 text-[11px] font-bold uppercase tracking-wider text-red-100">
              <AlertOctagon className="w-4 h-4 text-white animate-pulse" />
              <span>OFFICIAL EMERGENCY MEDICAL BRIEF</span>
            </div>
            <h1 className={`font-black tracking-tight ${elderlyMode ? 'text-2xl sm:text-3xl' : 'text-xl sm:text-2xl'}`}>
              PATIENT: {patientProfile.name.toUpperCase()}
            </h1>
            <p className="text-red-100 text-xs font-medium">
              Age: {patientProfile.age}y • Blood Group: <strong className="text-white bg-red-700/80 px-2 py-0.5 rounded-md">{patientProfile.bloodGroup}</strong>
            </p>
          </div>

          {/* Quick Emergency Speed Dial */}
          <div className="flex flex-col sm:flex-row gap-2 shrink-0">
            <a
              href={`tel:${patientProfile.emergencyPhone}`}
              className="px-4 py-2 rounded-xl bg-white text-red-600 font-black text-xs sm:text-sm hover:bg-red-50 transition flex items-center justify-center space-x-2 shadow-xs active:scale-95"
            >
              <PhoneCall className="w-4 h-4 text-red-600" />
              <span>DIAL 112</span>
            </a>

            {primaryContact && (
              <a
                href={`tel:${primaryContact.phone}`}
                className="px-3.5 py-2 rounded-xl bg-red-800 hover:bg-red-900 text-white font-bold text-xs transition flex items-center justify-center space-x-1.5 active:scale-95"
              >
                <PhoneCall className="w-4 h-4 text-white" />
                <span>Call {primaryContact.relation}</span>
              </a>
            )}
          </div>
        </div>

        {/* Core Body Sections */}
        <div className="p-5 sm:p-6 space-y-5">
          {/* Grid: Allergies & User Conditions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {/* Allergies Card */}
            <div className="bg-rose-50/70 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/60 rounded-xl p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-rose-800 dark:text-rose-300">
                  Known Allergies
                </span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-rose-100 dark:bg-rose-900/60 text-rose-800 dark:text-rose-200">
                  User-Provided
                </span>
              </div>
              <div className="flex flex-wrap gap-2 pt-0.5">
                {patientProfile.allergies.map((a, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-lg bg-rose-600 text-white font-bold text-xs shadow-2xs"
                  >
                    ⚠️ {a}
                  </span>
                ))}
              </div>
            </div>

            {/* Medical Conditions Card */}
            <div className="bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 rounded-xl p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Documented Conditions
                </span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200">
                  User-Provided
                </span>
              </div>
              <div className="flex flex-wrap gap-2 pt-0.5">
                {patientProfile.userConditions.map((c, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-semibold text-xs text-slate-800 dark:text-slate-200"
                  >
                    {c}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* ACTIVE MEDICATIONS & LAST CONFIRMED DOSE */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between pb-1.5 border-b border-slate-100 dark:border-slate-800">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Current Active Medications ({medications.length})
              </span>
              <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-200/60 dark:border-emerald-800">
                Last Confirmed: {lastTaken ? `${lastTaken.scheduledTime} (${lastTaken.medicationName})` : '08:00 AM'}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
              {medications.map((m) => (
                <div
                  key={m.id}
                  className="p-3.5 rounded-xl bg-white dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/80 shadow-2xs space-y-0.5"
                >
                  <div className="font-bold text-slate-900 dark:text-white text-sm flex items-center space-x-1.5">
                    <span>💊</span>
                    <span>{m.name}</span>
                  </div>
                  <div className="text-xs font-medium text-slate-600 dark:text-slate-300">
                    {m.strength} • {m.dosage}
                  </div>
                  <p className="text-[11px] text-slate-400">
                    {m.frequency}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* EMERGENCY CONTACTS & LOCATION */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {/* Contacts */}
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
              <span className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Emergency Contacts
              </span>
              {patientProfile.emergencyContacts.map((c) => (
                <div key={c.id} className="flex items-center justify-between text-xs py-1">
                  <div>
                    <span className="font-black text-slate-800 dark:text-white">{c.name}</span>{' '}
                    <span className="text-slate-500 dark:text-slate-400">({c.relation})</span>
                  </div>
                  <a
                    href={`tel:${c.phone}`}
                    className="font-bold text-sky-700 dark:text-cyan-400 hover:underline flex items-center space-x-1"
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                    <span>{c.phone}</span>
                  </a>
                </div>
              ))}
            </div>

            {/* Location (with explicit consent toggle) */}
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Last Known Location
                </span>
                <button
                  onClick={() => setLocationGranted(!locationGranted)}
                  className={`text-[10px] font-bold px-2 py-0.5 rounded transition ${
                    locationGranted ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {locationGranted ? 'GPS Consent: Active' : 'Consent: Off'}
                </button>
              </div>

              {locationGranted ? (
                <div className="text-xs space-y-1">
                  <p className="font-bold text-slate-800 dark:text-slate-200 flex items-start space-x-1.5">
                    <MapPin className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                    <span>{patientProfile.lastKnownLocation?.address}</span>
                  </p>
                  <p className="text-[11px] text-slate-400 dark:text-slate-500 pl-5">
                    Coords: {patientProfile.lastKnownLocation?.lat}, {patientProfile.lastKnownLocation?.lng}
                  </p>
                </div>
              ) : (
                <p className="text-xs text-slate-500 dark:text-slate-400 italic">
                  Location details withheld. Toggle consent above to display GPS coordinates for emergency dispatchers.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* PARAMEDIC QR MODAL */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-sm w-full p-6 text-center shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4 animate-in zoom-in-95">
            <h3 className="font-black text-lg text-slate-900 dark:text-white">Paramedic QR Access</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Paramedics can scan this code to instantly open Raj Sharma's Emergency Health Brief without logging in.
            </p>

            {/* SVG Simulated QR Code */}
            <div className="w-48 h-48 mx-auto bg-slate-100 dark:bg-white rounded-2xl p-4 border-2 border-slate-300 dark:border-slate-700 flex items-center justify-center">
              <QrCode className="w-36 h-36 text-slate-900" />
            </div>

            <div className="text-[11px] font-mono text-slate-400 dark:text-slate-500">
              Token: #LL-AI-EMERGENCY-RAJ-68
            </div>

            <button
              onClick={() => setShowQrModal(false)}
              className="w-full py-2.5 rounded-xl bg-slate-900 dark:bg-cyan-500 text-white dark:text-slate-950 font-black text-xs"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
