import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { LifeLineLogo } from '../common/LifeLineLogo';
import {
  ShieldAlert,
  PhoneCall,
  KeyRound,
  Mail,
  User,
  Users,
  AlertOctagon,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Lock,
  Eye,
  EyeOff,
  Sliders,
  HeartPulse,
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login, setActiveTab, elderlyMode, setElderlyMode } = useApp();

  const [authMethod, setAuthMethod] = useState<'demo' | 'phone' | 'email'>('demo');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState(['', '', '', '']);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [roleSelection, setRoleSelection] = useState<'patient' | 'caregiver'>('patient');

  // Quick Demo Logins
  const handleDemoPatientLogin = () => {
    login({
      id: 'u-raj',
      name: 'Raj Sharma',
      role: 'patient',
      phone: '+91 98765 43210',
      email: 'raj.sharma@example.com',
    });
    setActiveTab('dashboard');
  };

  const handleDemoCaregiverLogin = () => {
    login({
      id: 'u-amit',
      name: 'Amit Sharma',
      role: 'caregiver',
      phone: '+91 98765 43210',
      email: 'amit.sharma@example.com',
    });
    setActiveTab('caregiver');
  };

  // Paramedic Emergency Bypass (Direct to Health Brief without password)
  const handleParamedicBypass = () => {
    login({
      id: 'u-paramedic',
      name: 'Emergency First Responder',
      role: 'paramedic',
      phone: '112',
      email: 'dispatch@emergency.gov.in',
    });
    setActiveTab('emergency');
  };

  // Phone OTP Flow
  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber || phoneNumber.length < 8) return;
    setOtpSent(true);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    login({
      id: `u-${Date.now()}`,
      name: roleSelection === 'patient' ? 'Raj Sharma' : 'Amit Sharma',
      role: roleSelection,
      phone: `+91 ${phoneNumber}`,
      email: roleSelection === 'patient' ? 'raj.sharma@example.com' : 'amit.sharma@example.com',
    });
    setActiveTab(roleSelection === 'patient' ? 'dashboard' : 'caregiver');
  };

  // Email / Password Flow
  const handleEmailLogin = (e: React.FormEvent) => {
    e.preventDefault();
    login({
      id: `u-${Date.now()}`,
      name: roleSelection === 'patient' ? 'Raj Sharma' : 'Amit Sharma',
      role: roleSelection,
      phone: '+91 98765 43210',
      email: email || 'raj.sharma@example.com',
    });
    setActiveTab(roleSelection === 'patient' ? 'dashboard' : 'caregiver');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-sky-950 to-slate-900 flex flex-col justify-between p-4 sm:p-6 lg:p-8 text-white relative overflow-hidden">
      {/* Decorative ambient gradients */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Top Header Bar */}
      <header className="max-w-6xl w-full mx-auto flex items-center justify-between pb-6 relative z-10">
        <div className="flex items-center space-x-3">
          <LifeLineLogo size="md" textColor="text-white" />
          <span className="hidden sm:inline-flex px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            v2.0 MVP
          </span>
        </div>

        {/* Accessibility & Paramedic Quick Bypass */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          <button
            onClick={() => setElderlyMode(!elderlyMode)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition ${
              elderlyMode
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'bg-white/10 text-slate-300 hover:bg-white/15'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>{elderlyMode ? 'Elder Mode: ON' : 'Elder Mode'}</span>
          </button>

          <button
            onClick={handleParamedicBypass}
            className="px-3.5 py-1.5 rounded-xl bg-red-600/90 hover:bg-red-600 text-white font-extrabold text-xs flex items-center space-x-1.5 shadow-lg shadow-red-600/30 transition active:scale-95"
            title="Open Emergency Health Card without password"
          >
            <AlertOctagon className="w-4 h-4 animate-pulse" />
            <span className="hidden sm:inline">Paramedic Bypass</span>
            <span className="sm:hidden">112 Access</span>
          </button>
        </div>
      </header>

      {/* Main Authentication Card */}
      <main className="max-w-xl w-full mx-auto bg-white/95 backdrop-blur-xl text-slate-900 rounded-3xl p-6 sm:p-10 shadow-2xl border border-white/20 relative z-10 my-4">
        {/* Title */}
        <div className="text-center space-y-2 mb-6">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-sky-100 text-sky-800 text-xs font-bold">
            <Lock className="w-3.5 h-3.5" />
            <span>Secure Patient & Caregiver Access</span>
          </div>
          <h1 className={`font-black tracking-tight text-slate-900 ${elderlyMode ? 'text-3xl' : 'text-2xl sm:text-3xl'}`}>
            Welcome to LifeLine AI
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-sm mx-auto">
            Sign in to access your daily schedule, verify prescriptions, or manage caregiver safety alerts.
          </p>
        </div>

        {/* Auth Method Navigation Tabs */}
        <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 rounded-2xl mb-6">
          {[
            { id: 'demo', label: '⚡ 1-Tap Demo', icon: Sparkles },
            { id: 'phone', label: '📱 Mobile OTP', icon: PhoneCall },
            { id: 'email', label: '✉️ Email / Pass', icon: Mail },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setAuthMethod(tab.id as any)}
              className={`py-2 px-1 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1 ${
                authMethod === tab.id
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* TAB 1: 1-TAP HACKATHON DEMO LOGINS */}
        {authMethod === 'demo' && (
          <div className="space-y-4 animate-in fade-in">
            <div className="text-center pb-1">
              <span className="text-xs font-extrabold uppercase tracking-wider text-sky-700 bg-sky-50 px-3 py-1 rounded-full border border-sky-200">
                One-Click Instant Access for Evaluators
              </span>
            </div>

            {/* Patient Option */}
            <button
              onClick={handleDemoPatientLogin}
              className="w-full p-4 rounded-2xl border-2 border-slate-200 hover:border-sky-500 bg-slate-50/80 hover:bg-sky-50/40 transition text-left flex items-center justify-between group shadow-xs active:scale-98"
            >
              <div className="flex items-center space-x-3.5">
                <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center text-2xl shrink-0 group-hover:scale-105 transition">
                  👴
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="font-black text-slate-900 text-base">
                      Raj Sharma
                    </h3>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-sky-200 text-sky-900">
                      Patient (68 Yrs)
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Pre-populated with 3 active medicines, 1 safety warning & timetable
                  </p>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-sky-600 group-hover:translate-x-1 transition shrink-0" />
            </button>

            {/* Caregiver Option */}
            <button
              onClick={handleDemoCaregiverLogin}
              className="w-full p-4 rounded-2xl border-2 border-slate-200 hover:border-teal-500 bg-slate-50/80 hover:bg-teal-50/40 transition text-left flex items-center justify-between group shadow-xs active:scale-98"
            >
              <div className="flex items-center space-x-3.5">
                <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center text-2xl shrink-0 group-hover:scale-105 transition">
                  👨‍👦
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="font-black text-slate-900 text-base">
                      Amit Sharma
                    </h3>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-teal-200 text-teal-900">
                      Son & Caregiver
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Pre-configured Safety Circle guardian view with live escalation alerts
                  </p>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-teal-600 group-hover:translate-x-1 transition shrink-0" />
            </button>
          </div>
        )}

        {/* TAB 2: ELDERLY-FRIENDLY MOBILE OTP LOGIN */}
        {authMethod === 'phone' && (
          <div className="space-y-4 animate-in fade-in">
            {/* Role Switcher */}
            <div className="flex items-center space-x-2 pb-1">
              <span className="text-xs font-bold text-slate-500">I am a:</span>
              <button
                type="button"
                onClick={() => setRoleSelection('patient')}
                className={`px-3 py-1 rounded-lg text-xs font-bold ${
                  roleSelection === 'patient'
                    ? 'bg-sky-600 text-white'
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                Patient
              </button>
              <button
                type="button"
                onClick={() => setRoleSelection('caregiver')}
                className={`px-3 py-1 rounded-lg text-xs font-bold ${
                  roleSelection === 'caregiver'
                    ? 'bg-teal-600 text-white'
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                Caregiver
              </button>
            </div>

            {!otpSent ? (
              <form onSubmit={handleSendOtp} className="space-y-4">
                <div>
                  <label className="block text-xs font-extrabold uppercase text-slate-600 mb-1.5">
                    Mobile Phone Number
                  </label>
                  <div className="flex rounded-2xl border-2 border-slate-300 overflow-hidden focus-within:border-sky-500 focus-within:ring-2 focus-within:ring-sky-500/20">
                    <span className="bg-slate-100 px-3.5 py-3 text-slate-700 font-bold text-sm flex items-center border-r border-slate-200">
                      🇮🇳 +91
                    </span>
                    <input
                      type="tel"
                      required
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="98765 43210"
                      className="flex-1 px-4 py-3 bg-white font-black text-base text-slate-900 focus:outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-2xl bg-sky-600 hover:bg-sky-700 text-white font-black text-sm shadow-md transition active:scale-98 flex items-center justify-center space-x-2"
                >
                  <span>Send Verification Code (OTP)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="block text-xs font-extrabold uppercase text-slate-600">
                      Enter 4-Digit Code Sent to +91 {phoneNumber}
                    </label>
                    <button
                      type="button"
                      onClick={() => setOtpSent(false)}
                      className="text-xs font-bold text-sky-600 hover:underline"
                    >
                      Change Number
                    </button>
                  </div>

                  <div className="flex justify-center space-x-3">
                    {[0, 1, 2, 3].map((idx) => (
                      <input
                        key={idx}
                        id={`otp-${idx}`}
                        type="text"
                        maxLength={1}
                        value={otpCode[idx]}
                        onChange={(e) => {
                          const val = e.target.value;
                          const next = [...otpCode];
                          next[idx] = val;
                          setOtpCode(next);
                          if (val && idx < 3) {
                            const nextInput = document.getElementById(`otp-${idx + 1}`);
                            nextInput?.focus();
                          }
                        }}
                        className="w-14 h-14 rounded-2xl border-2 border-slate-300 text-center font-black text-2xl text-slate-900 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                      />
                    ))}
                  </div>

                  {/* Quick Auto-fill button */}
                  <div className="text-center pt-1">
                    <button
                      type="button"
                      onClick={() => setOtpCode(['1', '2', '3', '4'])}
                      className="text-xs font-bold text-sky-600 bg-sky-50 px-3 py-1 rounded-full border border-sky-200 hover:bg-sky-100"
                    >
                      ⚡ Quick Fill Demo OTP: 1234
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm shadow-md transition active:scale-98 flex items-center justify-center space-x-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Verify Code & Continue</span>
                </button>
              </form>
            )}
          </div>
        )}

        {/* TAB 3: TRADITIONAL EMAIL / PASSWORD LOGIN */}
        {authMethod === 'email' && (
          <form onSubmit={handleEmailLogin} className="space-y-4 animate-in fade-in">
            {/* Role Switcher */}
            <div className="flex items-center space-x-2 pb-1">
              <span className="text-xs font-bold text-slate-500">Role:</span>
              <button
                type="button"
                onClick={() => setRoleSelection('patient')}
                className={`px-3 py-1 rounded-lg text-xs font-bold ${
                  roleSelection === 'patient'
                    ? 'bg-sky-600 text-white'
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                Patient
              </button>
              <button
                type="button"
                onClick={() => setRoleSelection('caregiver')}
                className={`px-3 py-1 rounded-lg text-xs font-bold ${
                  roleSelection === 'caregiver'
                    ? 'bg-teal-600 text-white'
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                Caregiver
              </button>
            </div>

            <div>
              <label className="block text-xs font-extrabold uppercase text-slate-600 mb-1">
                Email Address
              </label>
              <div className="flex items-center rounded-2xl border-2 border-slate-300 px-3.5 bg-white focus-within:border-sky-500">
                <Mail className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="raj.sharma@example.com"
                  className="w-full py-2.5 text-sm font-semibold text-slate-900 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-extrabold uppercase text-slate-600 mb-1">
                Password
              </label>
              <div className="flex items-center rounded-2xl border-2 border-slate-300 px-3.5 bg-white focus-within:border-sky-500">
                <Lock className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full py-2.5 text-sm font-semibold text-slate-900 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-slate-400 hover:text-slate-600 ml-2"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
              <label className="flex items-center space-x-1.5 cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded text-sky-600" />
                <span>Remember this device</span>
              </label>
              <span className="text-sky-600 hover:underline cursor-pointer">Forgot password?</span>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-black text-sm shadow-md transition active:scale-98 flex items-center justify-center space-x-2"
            >
              <span>Sign In</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* BOTTOM EMERGENCY ACCESS CALLOUT */}
        <div className="mt-6 pt-5 border-t border-slate-200 text-center">
          <div className="flex items-center justify-center space-x-2 text-xs text-slate-500">
            <HeartPulse className="w-4 h-4 text-red-500 shrink-0" />
            <span>Emergency medical responders don't need a password:</span>
          </div>
          <button
            onClick={handleParamedicBypass}
            className="mt-2 text-xs font-bold text-red-600 hover:text-red-700 hover:underline"
          >
            🚨 Open Emergency Health Brief directly →
          </button>
        </div>
      </main>

      {/* Footer Branding */}
      <footer className="max-w-6xl w-full mx-auto text-center pt-4 text-xs text-slate-500 relative z-10">
        <p>LifeLine AI • PS6 Prescription Safety Verification & Emergency Assistance Platform</p>
      </footer>
    </div>
  );
};
