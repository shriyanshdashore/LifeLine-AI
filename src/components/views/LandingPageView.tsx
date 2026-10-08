import React from 'react';
import { useApp } from '../../context/AppContext';
import { LifeLineLogo } from '../common/LifeLineLogo';
import { TypewriterHeadline } from '../common/TypewriterHeadline';
import { AntigravityCursor } from '../common/AntigravityCursor';
import { AntigravityParticleCanvas } from '../common/AntigravityParticleCanvas';
import { CursorSpotlightGlow } from '../common/CursorSpotlightGlow';
import { InteractiveTiltCard } from '../common/InteractiveTiltCard';
import {
  ArrowRight,
  Camera,
  ShieldAlert,
  Clock,
  PhoneCall,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Users,
  Mic,
  QrCode,
  GitCompare,
  TrendingUp,
  HeartPulse,
  Sliders,
  Sun,
  Moon,
  ShieldCheck,
  ChevronRight,
  Activity,
  FileCheck,
} from 'lucide-react';

export const LandingPageView: React.FC = () => {
  const {
    setActiveTab,
    elderlyMode,
    setElderlyMode,
    darkMode,
    setDarkMode,
    triggerPanicAlert,
    schedule,
    safetyAlerts,
    patientProfile,
  } = useApp();

  const handleLaunchDashboard = () => {
    setActiveTab('dashboard');
  };

  const handleLaunchScanner = () => {
    setActiveTab('scanner');
  };

  const handleLaunchEmergency = () => {
    setActiveTab('emergency');
  };

  const totalDoses = schedule.length;
  const completedDoses = schedule.filter((s) => s.status === 'taken').length;
  const progressPercent = totalDoses > 0 ? Math.round((completedDoses / totalDoses) * 100) : 67;

  return (
    <div className={`min-h-screen transition-colors duration-200 relative overflow-x-hidden ${darkMode ? 'dark bg-[#080e18] text-slate-100' : 'bg-[#f8fafc] text-slate-900'}`}>
      {/* 0. INTERACTIVE MOUSE-FOLLOWING SPOTLIGHT & GLOW */}
      <CursorSpotlightGlow darkMode={darkMode} />

      {/* 1. TOP NAVBAR */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-[#080e18]/80 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <LifeLineLogo size="md" />
            <span className="hidden sm:inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800">
              PS6 Safety Platform
            </span>
          </div>

          {/* Center Links (Desktop) */}
          <nav className="hidden md:flex items-center space-x-6 text-xs font-semibold text-slate-600 dark:text-slate-300">
            <a href="#features" className="hover:text-slate-900 dark:hover:text-white transition">Features</a>
            <a href="#workflow" className="hover:text-slate-900 dark:hover:text-white transition">8-Step Workflow</a>
            <a href="#emergency" className="hover:text-slate-900 dark:hover:text-white transition">Emergency 112</a>
            <button
              onClick={() => setActiveTab('safety')}
              className="hover:text-slate-900 dark:hover:text-white transition"
            >
              Drug Safety Matrix
            </button>
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Minimal Theme Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              aria-label="Toggle theme"
            >
              {darkMode ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-600" />
              )}
            </button>

            {/* Elder Mode Toggle */}
            <button
              onClick={() => setElderlyMode(!elderlyMode)}
              className={`p-2 rounded-xl text-xs font-semibold transition ${
                elderlyMode
                  ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 font-bold border border-amber-300 dark:border-amber-800'
                  : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
              title="Toggle Elderly Display Scaling"
            >
              <Sliders className="w-4 h-4" />
            </button>

            {/* Primary Action Button: GO TO DASHBOARD */}
            <button
              onClick={handleLaunchDashboard}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-950 font-bold text-xs sm:text-sm shadow-xs transition active:scale-95 flex items-center space-x-1.5"
            >
              <span>Go to Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* 2. HERO SECTION */}
      <section className="relative pt-12 pb-16 sm:pt-20 sm:pb-24 overflow-hidden">
        {/* Antigravity Interactive Particle Canvas (Defies gravity & reacts to cursor) */}
        <AntigravityParticleCanvas darkMode={darkMode} />

        {/* Antigravity Floating Ambient Aurora Glow Orbs */}
        <div className="absolute top-1/4 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[520px] h-[360px] bg-gradient-to-tr from-sky-400/20 via-teal-300/15 to-indigo-400/20 rounded-full blur-3xl pointer-events-none animate-float-slow" />
        <div className="absolute top-1/3 right-1/4 translate-x-1/3 -translate-y-1/3 w-[460px] h-[320px] bg-gradient-to-br from-indigo-500/15 via-purple-400/15 to-rose-400/15 rounded-full blur-3xl pointer-events-none animate-float-reverse" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            {/* Innovation Badge */}
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-slate-100/90 dark:bg-slate-800/90 backdrop-blur-md border border-slate-200/80 dark:border-slate-700/80 text-xs font-semibold text-slate-700 dark:text-slate-300 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>PS6: Prescription Safety & Emergency Assistance</span>
              <span className="text-slate-400">•</span>
              <span className="text-sky-600 dark:text-sky-400 font-bold">112 Dispatch Ready</span>
              <span className="hidden md:inline-flex text-[10px] px-2 py-0.5 rounded-full bg-cyan-100 dark:bg-cyan-950/80 text-cyan-800 dark:text-cyan-300 border border-cyan-300 dark:border-cyan-800">
                ✦ Cursor Interactive
              </span>
            </div>

            {/* Main Punchy Tagline with Dynamic Typewriter Animation */}
            <TypewriterHeadline />

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
              LifeLine AI scans doctor prescriptions, verifies dangerous drug interactions, builds an automated daily schedule, and provides one-tap dual calling to <strong>112 emergency services and caregivers</strong>.
            </p>

            {/* Primary Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                onClick={handleLaunchDashboard}
                className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-950 font-extrabold text-sm sm:text-base shadow-md hover:shadow-lg transition active:scale-95 flex items-center justify-center space-x-2 group cursor-pointer"
              >
                <span>Open Patient Dashboard</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition duration-200" />
              </button>

              <button
                onClick={handleLaunchScanner}
                className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-sm border border-slate-200/80 dark:border-slate-800 shadow-2xs transition active:scale-95 flex items-center justify-center space-x-2 cursor-pointer"
              >
                <Camera className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                <span>Scan Prescription</span>
              </button>

              <button
                onClick={triggerPanicAlert}
                className="relative w-full sm:w-auto px-5 py-3.5 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-sm shadow-sm transition active:scale-95 flex items-center justify-center space-x-2 group overflow-hidden cursor-pointer"
                title="Dial 112 and alert Caregiver"
              >
                <span className="absolute -inset-1 rounded-2xl bg-red-500/50 animate-sonar-ring pointer-events-none" />
                <PhoneCall className="w-4 h-4 text-white relative z-10 animate-pulse" />
                <span className="relative z-10">🚨 Test 112 SOS</span>
              </button>
            </div>

            {/* Safety Guardrails Trust Strip */}
            <div className="pt-6 flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs text-slate-500 dark:text-slate-400">
              <span className="flex items-center space-x-1.5 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Zero Silent Saves Guardrail</span>
              </span>
              <span className="flex items-center space-x-1.5 font-medium">
                <ShieldCheck className="w-4 h-4 text-sky-500" />
                <span>Deterministic Drug Safety Matrix</span>
              </span>
              <span className="flex items-center space-x-1.5 font-medium">
                <Activity className="w-4 h-4 text-teal-500" />
                <span>100% Offline Emergency Card</span>
              </span>
            </div>
          </div>

          {/* 3. INTERACTIVE PRODUCT PREVIEW CARD WITH AUTONOMOUS ANTIGRAVITY CURSOR & 3D TILT */}
          <div className="mt-12 sm:mt-16 max-w-4xl mx-auto relative z-20">
            <InteractiveTiltCard maxTilt={5}>
              <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-xl space-y-6 relative overflow-hidden group">
                {/* Autonomous Antigravity AI Agent Cursor Pointer */}
                <AntigravityCursor />
              {/* Preview Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 gap-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-2xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 flex items-center justify-center font-bold text-lg">
                    👴
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
                      {patientProfile.name} • Live Patient Schedule
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Age: {patientProfile.age}y • Blood Group: {patientProfile.bloodGroup} • Emergency Dispatch: 112
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-bold text-xs border border-emerald-200 dark:border-emerald-800">
                    {completedDoses} of {totalDoses} Taken ({progressPercent}%)
                  </span>
                  <button
                    onClick={handleLaunchDashboard}
                    className="px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold transition"
                  >
                    Open App →
                  </button>
                </div>
              </div>

              {/* Safety Alert Flag Preview */}
              {safetyAlerts.length > 0 && (
                <div
                  onClick={() => setActiveTab('safety')}
                  className="bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 rounded-2xl p-4 flex items-center justify-between cursor-pointer hover:bg-amber-50 dark:hover:bg-amber-950/40 transition group"
                >
                  <div className="flex items-center space-x-3">
                    <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
                    <div>
                      <div className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                        {safetyAlerts[0].title}
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                        {safetyAlerts[0].explanation}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-amber-700 dark:text-amber-300 shrink-0 ml-2 group-hover:translate-x-1 transition">
                    View Verification →
                  </span>
                </div>
              )}

              {/* Today's Schedule Rows Preview */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {schedule.slice(0, 3).map((slot) => {
                  const isTaken = slot.status === 'taken';
                  return (
                    <div
                      key={slot.id}
                      className={`p-4 rounded-2xl border transition ${
                        isTaken
                          ? 'bg-slate-50/70 dark:bg-slate-800/40 border-slate-200/80 dark:border-slate-800'
                          : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-100 dark:border-slate-800">
                        <span className="font-bold text-slate-500 dark:text-slate-400">{slot.scheduledTime}</span>
                        <span className={`px-2 py-0.2 rounded-md font-bold text-[10px] ${
                          isTaken
                            ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300'
                            : 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300'
                        }`}>
                          {isTaken ? '✅ Taken' : '⏳ Upcoming'}
                        </span>
                      </div>
                      <div className="pt-2">
                        <div className="font-bold text-sm text-slate-900 dark:text-white">
                          💊 {slot.medicationName}
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                          {slot.dosage} • {slot.period}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
              </div>
            </InteractiveTiltCard>
          </div>
        </div>
      </section>

      {/* 4. THE CORE 8-STEP LIFECYCLE (SCAN → UNDERSTAND → SAFETY → ... → EMERGENCY) */}
      <section id="workflow" className="py-14 sm:py-16 bg-slate-50/50 dark:bg-slate-900/30 border-y border-slate-200/60 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center max-w-xl mx-auto space-y-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400">
              The PS6 Product Journey
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              From Prescription to Dispatch
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              A continuous 8-step clinical safety workflow engineered for elderly care.
            </p>
          </div>

          {/* Sleek 8-Step Pipeline */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 sm:gap-2.5">
            {[
              { num: '01', title: 'SCAN', desc: 'AI Vision OCR captures Rx & label strips', icon: Camera, tab: 'scanner' },
              { num: '02', title: 'UNDERSTAND', desc: 'Structured JSON draft (Zero silent save)', icon: FileCheck, tab: 'scanner' },
              { num: '03', title: 'SAFETY CHECK', desc: 'Drug-drug & allergen matrix check', icon: ShieldAlert, tab: 'safety' },
              { num: '04', title: 'SCHEDULE', desc: 'Automatic daily medication timetable', icon: Clock, tab: 'schedule' },
              { num: '05', title: 'REMIND', desc: 'Gentle voice & chime reminder alerts', icon: Mic, tab: 'assistant' },
              { num: '06', title: 'TRACK', desc: 'One-tap logs: Taken, Skipped, Postponed', icon: CheckCircle2, tab: 'schedule' },
              { num: '07', title: 'ESCALATE', desc: 'Guardian safety circle miss escalation', icon: Users, tab: 'caregiver' },
              { num: '08', title: 'EMERGENCY', desc: 'Dual-call 112 + live Caregiver SOS', icon: PhoneCall, tab: 'emergency' },
            ].map((step, idx) => {
              const StepIcon = step.icon;
              return (
                <div
                  key={idx}
                  onClick={() => setActiveTab(step.tab)}
                  className="group p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800 hover:border-sky-400 dark:hover:border-sky-600 hover:-translate-y-1 hover:shadow-md cursor-pointer transition-all duration-200 text-left flex flex-col justify-between space-y-2 shadow-2xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] font-bold text-sky-600 dark:text-sky-400">
                      {step.num}
                    </span>
                    <StepIcon className="w-3.5 h-3.5 text-slate-400 group-hover:text-sky-500 group-hover:scale-110 transition-all duration-200" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xs text-slate-900 dark:text-white truncate">
                      {step.title}
                    </h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 mt-0.5 leading-tight">
                      {step.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. SIX HERO DIFFERENTIATORS */}
      <section id="features" className="py-14 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center max-w-xl mx-auto space-y-1.5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
            Hackathon MVP Highlights
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Key Innovations Built for Patients
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Modern clinical assistance designed for seamless ease of use.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 sm:gap-4">
          {/* Card 1: Prescription Change Detector */}
          <div
            onClick={() => setActiveTab('compare')}
            className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/70 dark:border-slate-800 hover:border-teal-400 dark:hover:border-teal-500 hover:-translate-y-1 hover:shadow-md cursor-pointer transition-all duration-200 space-y-2.5 group shadow-2xs"
          >
            <div className="w-9 h-9 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
              <GitCompare className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              Prescription Change Detector
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Compares baseline prescriptions with follow-up visits. Highlights Continued, Added, Discontinued, and Dosage changes.
            </p>
            <div className="pt-1 flex items-center text-xs font-semibold text-teal-600 dark:text-teal-400 group-hover:translate-x-1 transition-transform duration-200">
              <span>View Rx Diff Tracker →</span>
            </div>
          </div>

          {/* Card 2: Dual-Calling Emergency SOS */}
          <div
            onClick={() => setActiveTab('emergency')}
            className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/70 dark:border-slate-800 hover:border-red-400 dark:hover:border-red-500 hover:-translate-y-1 hover:shadow-md cursor-pointer transition-all duration-200 space-y-2.5 group shadow-2xs"
          >
            <div className="w-9 h-9 rounded-xl bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400 flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
              <PhoneCall className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              Dual-Calling PANIC SOS
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Triggers instant call to 112 Ambulance and sends live GPS coordinates to Caregiver Amit Sharma simultaneously.
            </p>
            <div className="pt-1 flex items-center text-xs font-semibold text-red-600 dark:text-red-400 group-hover:translate-x-1 transition-transform duration-200">
              <span>Open Emergency Brief →</span>
            </div>
          </div>

          {/* Card 3: Hindi/English Voice Assistant */}
          <div
            onClick={() => setActiveTab('assistant')}
            className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/70 dark:border-slate-800 hover:border-sky-400 dark:hover:border-sky-500 hover:-translate-y-1 hover:shadow-md cursor-pointer transition-all duration-200 space-y-2.5 group shadow-2xs"
          >
            <div className="w-9 h-9 rounded-xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
              <Mic className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              Elderly Voice Assistant
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Ask naturally: <em>"meri next medicine kab hai?"</em>. Provides audio voice feedback in Hindi, Hinglish, and English.
            </p>
            <div className="pt-1 flex items-center text-xs font-semibold text-sky-600 dark:text-sky-400 group-hover:translate-x-1 transition-transform duration-200">
              <span>Try Voice Assistant →</span>
            </div>
          </div>

          {/* Card 4: Adherence Tracker */}
          <div
            onClick={() => setActiveTab('history')}
            className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/70 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-500 hover:-translate-y-1 hover:shadow-md cursor-pointer transition-all duration-200 space-y-2.5 group shadow-2xs"
          >
            <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
              <TrendingUp className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              Weekly Adherence Tracker
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Tracks 7-day adherence rates (92% benchmark) labeled strictly as medication adherence, not a medical score.
            </p>
            <div className="pt-1 flex items-center text-xs font-semibold text-indigo-600 dark:text-indigo-400 group-hover:translate-x-1 transition-transform duration-200">
              <span>View Adherence Dashboard →</span>
            </div>
          </div>

          {/* Card 5: Offline Paramedic QR Card */}
          <div
            onClick={() => setActiveTab('emergency')}
            className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/70 dark:border-slate-800 hover:border-emerald-400 dark:hover:border-emerald-500 hover:-translate-y-1 hover:shadow-md cursor-pointer transition-all duration-200 space-y-2.5 group shadow-2xs"
          >
            <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
              <QrCode className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              Paramedic Quick QR Card
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              First responders can scan an offline QR code on the patient's lock screen to access emergency medical data instantly.
            </p>
            <div className="pt-1 flex items-center text-xs font-semibold text-emerald-600 dark:text-emerald-400 group-hover:translate-x-1 transition-transform duration-200">
              <span>Preview Paramedic Brief →</span>
            </div>
          </div>

          {/* Card 6: Multi-Patient Profile Control */}
          <div
            onClick={() => setActiveTab('profile')}
            className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/70 dark:border-slate-800 hover:border-purple-400 dark:hover:border-purple-500 hover:-translate-y-1 hover:shadow-md cursor-pointer transition-all duration-200 space-y-2.5 group shadow-2xs"
          >
            <div className="w-9 h-9 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
              <Users className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              Family & Caregiver Circle
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Switch between family profiles and configure escalation preferences for missed doses.
            </p>
            <div className="pt-1 flex items-center text-xs font-semibold text-purple-600 dark:text-purple-400 group-hover:translate-x-1 transition-transform duration-200">
              <span>Open Profile Control →</span>
            </div>
          </div>
        </div>
      </section>

      {/* 6. CALL TO ACTION STRIP */}
      <section className="py-16 sm:py-20 bg-slate-900 text-white relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 relative z-10">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 text-teal-300 text-xs font-bold">
            <HeartPulse className="w-3.5 h-3.5" />
            <span>Protecting Patients & Empowering Caregivers</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight">
            Ready to explore LifeLine AI in action?
          </h2>

          <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto">
            Experience the complete patient workflow with fictional pre-loaded data for 68-year-old Raj Sharma.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={handleLaunchDashboard}
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-white hover:bg-slate-100 text-slate-950 font-black text-sm shadow-lg transition active:scale-95 flex items-center justify-center space-x-2"
            >
              <span>Launch Dashboard Now</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={handleLaunchScanner}
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm border border-white/20 transition active:scale-95"
            >
              Try Prescription Scanner
            </button>
          </div>
        </div>
      </section>

      {/* 7. MINIMAL FOOTER */}
      <footer className="py-8 border-t border-slate-200/80 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <LifeLineLogo size="sm" />
            <span>• PS6 Medication Safety & Emergency Assistance</span>
          </div>

          <div className="flex items-center space-x-4">
            <button onClick={handleLaunchDashboard} className="hover:underline">Dashboard</button>
            <button onClick={handleLaunchScanner} className="hover:underline">Scanner</button>
            <button onClick={handleLaunchEmergency} className="hover:underline">112 Panic</button>
            <button onClick={() => setActiveTab('settings')} className="hover:underline">Settings</button>
          </div>

          <div>
            Emergency Services Default: <strong className="text-slate-800 dark:text-slate-200">112 (India)</strong>
          </div>
        </div>
      </footer>
    </div>
  );
};
