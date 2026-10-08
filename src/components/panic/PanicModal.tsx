import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  AlertTriangle,
  PhoneCall,
  FileText,
  HeartPulse,
  X,
  ShieldAlert,
  MapPin,
  ExternalLink,
  Volume2,
  VolumeX,
  CheckCircle2,
  Users,
  Radio,
} from 'lucide-react';
import { playAlertChime } from '../../services/speechAssistant';

export const PanicModal: React.FC = () => {
  const {
    panicModalOpen,
    setPanicModalOpen,
    patientProfile,
    setActiveTab,
    addNotification,
  } = useApp();

  const [sirenPlaying, setSirenPlaying] = useState<boolean>(true);
  const [call112Status, setCall112Status] = useState<'dialing' | 'connected'>('dialing');
  const [caregiverStatus, setCaregiverStatus] = useState<'alerted' | 'calling'>('alerted');

  const primaryContact =
    patientProfile.emergencyContacts.find((c) => c.isPrimary) ||
    patientProfile.emergencyContacts[0] ||
    { name: 'Amit Sharma', relation: 'Son', phone: '+91 98765 43210' };

  // Loop siren audio while emergency modal is active if sirenPlaying is true
  useEffect(() => {
    if (!panicModalOpen) return;

    let sirenInterval: any = null;
    if (sirenPlaying) {
      playAlertChime('panic');
      sirenInterval = setInterval(() => {
        playAlertChime('panic');
      }, 2500);
    }

    return () => {
      if (sirenInterval) clearInterval(sirenInterval);
    };
  }, [panicModalOpen, sirenPlaying]);

  if (!panicModalOpen) return null;

  const handleDial112 = () => {
    setCall112Status('dialing');
    addNotification(
      '🚑 Dialing 112',
      `Manual redial requested for Emergency Services (${patientProfile.emergencyPhone || '112'}).`,
      'panic'
    );
    window.location.href = `tel:${patientProfile.emergencyPhone || '112'}`;
  };

  const handleDialCaregiver = () => {
    setCaregiverStatus('calling');
    addNotification(
      '👨‍👦 Calling Caregiver',
      `Direct call placed to ${primaryContact.name} (${primaryContact.phone}).`,
      'panic'
    );
    window.location.href = `tel:${primaryContact.phone}`;
  };

  const handleDualCallBoth = () => {
    playAlertChime('panic');
    addNotification(
      '🚨 Dual-Call Sequential Trigger',
      `Triggering National Emergency 112 and Caregiver ${primaryContact.name} simultaneously.`,
      'panic'
    );
    // Trigger 112 first then prompt caregiver call
    window.open(`tel:${patientProfile.emergencyPhone || '112'}`, '_self');
    setTimeout(() => {
      window.location.href = `tel:${primaryContact.phone}`;
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-red-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-in fade-in">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border-4 border-red-500 overflow-hidden text-center my-4">
        {/* Header Ribbon */}
        <div className="bg-red-600 text-white p-5 sm:p-7 flex flex-col items-center relative">
          <button
            onClick={() => {
              setSirenPlaying(false);
              setPanicModalOpen(false);
            }}
            className="absolute top-4 right-4 p-2 rounded-full bg-red-700/70 hover:bg-red-800 text-white transition active:scale-95"
            aria-label="Close Emergency Window"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="w-16 h-16 rounded-full bg-white/20 border-2 border-white flex items-center justify-center mb-2 animate-bounce">
            <AlertTriangle className="w-10 h-10 text-white" />
          </div>

          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-red-700/80 text-red-100 text-xs font-black uppercase tracking-wider mb-1">
            <Radio className="w-3.5 h-3.5 animate-pulse text-white" />
            <span>Active Emergency Protocol Initiated</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            🚨 PANIC: 112 & CAREGIVER DUAL CALL
          </h2>
          <p className="text-red-100 text-xs sm:text-sm mt-1 max-w-md font-medium">
            Emergency call to <strong>112</strong> has been placed and live SOS broadcast sent to <strong>{primaryContact.name} ({primaryContact.relation})</strong>.
          </p>
        </div>

        {/* Action Controls Body */}
        <div className="p-5 sm:p-7 space-y-4 text-left">
          {/* DUAL CALL CARDS: 112 & CAREGIVER */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* CALL 1: 112 Emergency Services */}
            <div className="bg-red-50 dark:bg-red-950/40 border-2 border-red-300 dark:border-red-800/80 rounded-2xl p-4.5 space-y-2.5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-black uppercase tracking-wider text-red-700 dark:text-red-300 flex items-center space-x-1">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-ping inline-block mr-1"></span>
                    Call 1 • National Emergency
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-200 dark:bg-red-900/80 text-red-900 dark:text-red-200">
                    Dialed: 112
                  </span>
                </div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white mt-1">
                  🚑 112 Ambulance & Police
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  Government Emergency Response & Paramedic Dispatch line.
                </p>
              </div>

              <button
                onClick={handleDial112}
                className="w-full py-2.5 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black text-xs sm:text-sm flex items-center justify-center space-x-2 shadow-md active:scale-95 transition"
              >
                <PhoneCall className="w-4 h-4 animate-pulse" />
                <span>📞 Redial 112 Now</span>
              </button>
            </div>

            {/* CALL 2: Primary Caregiver */}
            <div className="bg-emerald-50 dark:bg-emerald-950/40 border-2 border-emerald-300 dark:border-emerald-800/80 rounded-2xl p-4.5 space-y-2.5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-black uppercase tracking-wider text-emerald-700 dark:text-emerald-300 flex items-center space-x-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping inline-block mr-1"></span>
                    Call 2 • Caregiver Circle
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-200 dark:bg-emerald-900/80 text-emerald-900 dark:text-emerald-200">
                    SOS Sent
                  </span>
                </div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white mt-1">
                  👨‍👦 {primaryContact.name} ({primaryContact.relation})
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 truncate">
                  Phone: {primaryContact.phone}
                </p>
              </div>

              <button
                onClick={handleDialCaregiver}
                className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs sm:text-sm flex items-center justify-center space-x-2 shadow-md active:scale-95 transition"
              >
                <PhoneCall className="w-4 h-4" />
                <span>📞 Call {primaryContact.relation} ({primaryContact.phone})</span>
              </button>
            </div>
          </div>

          {/* MASTER ACTION: DUAL CALL BOTH SIMULTANEOUSLY */}
          <button
            onClick={handleDualCallBoth}
            className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 hover:from-red-700 hover:to-amber-700 text-white font-black text-base sm:text-lg flex items-center justify-between shadow-xl shadow-red-600/30 active:scale-98 transition group"
          >
            <div className="flex items-center space-x-3 text-left">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                <PhoneCall className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <div>🚨 AUTO-CALL BOTH: 112 + CAREGIVER</div>
                <div className="text-xs text-red-100 font-normal">
                  Sequentially dials 112 & opens Caregiver {primaryContact.name}'s line
                </div>
              </div>
            </div>
            <ExternalLink className="w-5 h-5 opacity-80 group-hover:opacity-100" />
          </button>

          {/* SIREN AUDIO TOGGLE & GPS LOCATION */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            {/* Siren Alarm Toggle */}
            <div className="p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                {sirenPlaying ? (
                  <Volume2 className="w-5 h-5 text-red-600 dark:text-red-400 animate-pulse" />
                ) : (
                  <VolumeX className="w-5 h-5 text-slate-400" />
                )}
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">
                    Emergency Audio Siren
                  </div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">
                    {sirenPlaying ? 'Wailing alarm active' : 'Muted'}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSirenPlaying(!sirenPlaying)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                  sirenPlaying
                    ? 'bg-red-600 text-white'
                    : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                {sirenPlaying ? 'Mute' : 'Sound Siren'}
              </button>
            </div>

            {/* GPS Location Transmitted */}
            <div className="p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-center space-x-2.5">
              <MapPin className="w-5 h-5 text-red-500 shrink-0" />
              <div className="text-xs">
                <span className="font-bold text-slate-900 dark:text-white block">
                  Live GPS Broadcast Active
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 truncate block">
                  {patientProfile.lastKnownLocation?.address || 'Bengaluru, India (12.9716° N, 77.5946° E)'}
                </span>
              </div>
            </div>
          </div>

          {/* SECONDARY EMERGENCY SHORTCUTS */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <button
              onClick={() => {
                setSirenPlaying(false);
                setPanicModalOpen(false);
                setActiveTab('emergency');
              }}
              className="py-3 px-4 rounded-xl bg-sky-50 dark:bg-cyan-950/40 hover:bg-sky-100 text-sky-900 dark:text-cyan-300 font-bold text-xs border border-sky-300 dark:border-cyan-800 flex items-center justify-center space-x-1.5 transition"
            >
              <FileText className="w-4 h-4" />
              <span>Paramedic Brief</span>
            </button>

            <button
              onClick={() => {
                setSirenPlaying(false);
                setPanicModalOpen(false);
                setActiveTab('firstaid');
              }}
              className="py-3 px-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 text-amber-900 dark:text-amber-300 font-bold text-xs border border-amber-300 dark:border-amber-800 flex items-center justify-center space-x-1.5 transition"
            >
              <HeartPulse className="w-4 h-4" />
              <span>First-Aid (CPR)</span>
            </button>
          </div>

          {/* CANCEL FALSE ALARM */}
          <div className="pt-2 text-center">
            <button
              onClick={() => {
                setSirenPlaying(false);
                setPanicModalOpen(false);
              }}
              className="text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white hover:underline transition"
            >
              Cancel / False Alarm • Close Window
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
