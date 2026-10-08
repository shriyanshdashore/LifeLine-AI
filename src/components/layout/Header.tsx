import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { LifeLineLogo } from '../common/LifeLineLogo';
import {
  AlertTriangle,
  Bell,
  CheckCircle2,
  HelpCircle,
  PhoneCall,
  RefreshCw,
  Sliders,
  Sparkles,
  Volume2,
  LogOut,
  Sun,
  Moon,
  Plus,
  Activity,
  Home,
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    patientProfile,
    currentUser,
    logout,
    notifications,
    markNotificationRead,
    safetyAlerts,
    elderlyMode,
    setElderlyMode,
    darkMode,
    setDarkMode,
    setAddMedicationModalOpen,
    triggerPanicAlert,
    resetDemoData,
    demoWalkthroughStep,
    setDemoWalkthroughStep,
    nextDemoStep,
    setActiveTab,
  } = useApp();

  const [showNotifications, setShowNotifications] = useState(false);
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header className="sticky top-0 z-40 bg-white/80 dark:bg-[#080e18]/80 backdrop-blur-md border-b border-slate-200/70 dark:border-slate-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Animated LifeLine Logo */}
          <div className="flex items-center space-x-3">
            <div
              className="cursor-pointer flex items-center space-x-2"
              onClick={() => setActiveTab('landing')}
              title="Go to Front Page"
            >
              <LifeLineLogo size="md" />
            </div>

            <button
              onClick={() => setActiveTab('dashboard')}
              className="hidden lg:inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              Dashboard
            </button>
          </div>

          {/* Center: Guided Demo Bar (Clean & Minimal) */}
          <div className="hidden md:flex items-center space-x-2">
            <button
              onClick={() => {
                if (demoWalkthroughStep === null) {
                  setDemoWalkthroughStep(1);
                  setActiveTab('dashboard');
                } else {
                  nextDemoStep();
                }
              }}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-slate-100/80 hover:bg-slate-200/80 dark:bg-slate-800/80 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition"
            >
              <Sparkles className="w-3.5 h-3.5 text-sky-500" />
              <span>
                {demoWalkthroughStep === null
                  ? 'Demo Tour'
                  : `Step ${demoWalkthroughStep}/10 →`}
              </span>
            </button>

            <button
              onClick={resetDemoData}
              title="Reset Demo Data"
              className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Right Action Controls - Minimal & Airy */}
          <div className="flex items-center space-x-1.5 sm:space-x-2">
            {/* + Add Med Button */}
            <button
              onClick={() => setAddMedicationModalOpen(true)}
              className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-900 dark:bg-white hover:bg-slate-800 dark:hover:bg-slate-100 text-white dark:text-slate-900 shadow-xs transition active:scale-95"
              title="Add New Medicine"
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Add Med</span>
            </button>

            {/* MINIMAL THEME TOGGLE (Clean Single Icon) */}
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

            {/* Elderly Toggle */}
            <button
              onClick={() => setElderlyMode(!elderlyMode)}
              title="Large Text Mode for Elderly"
              className={`p-2 rounded-xl text-xs font-semibold transition ${
                elderlyMode
                  ? 'bg-amber-100 text-amber-900 font-bold border border-amber-300'
                  : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Sliders className="w-4 h-4" />
            </button>

            {/* Notification Icon */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 relative transition"
                aria-label="Notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full" />
                )}
              </button>

              {/* Notification Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-3 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                    <h3 className="font-bold text-slate-800 dark:text-white text-xs flex items-center space-x-1.5">
                      <Bell className="w-3.5 h-3.5 text-sky-600" />
                      <span>Notifications ({notifications.length})</span>
                    </h3>
                    <span className="text-[10px] text-slate-400">Live Updates</span>
                  </div>

                  <div className="max-h-72 overflow-y-auto space-y-1.5 mt-2 divide-y divide-slate-50 dark:divide-slate-800/60">
                    {notifications.length === 0 ? (
                      <p className="text-xs text-slate-400 py-4 text-center">No notifications yet.</p>
                    ) : (
                      notifications.map((notif) => (
                        <div
                          key={notif.id}
                          onClick={() => markNotificationRead(notif.id)}
                          className={`pt-2 p-2 rounded-xl cursor-pointer transition text-left ${
                            notif.read ? 'opacity-60' : 'bg-slate-50 dark:bg-slate-800/60'
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">{notif.title}</span>
                            <span className="text-[10px] text-slate-400">{notif.timestamp}</span>
                          </div>
                          <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">{notif.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* User Badge */}
            {currentUser && (
              <div
                onClick={() => setActiveTab('profile')}
                className="hidden sm:flex items-center space-x-1.5 bg-slate-100/70 hover:bg-slate-200/70 dark:bg-slate-800/70 dark:hover:bg-slate-700/70 px-2.5 py-1.5 rounded-xl text-xs cursor-pointer transition"
                title="Profile Settings"
              >
                <span>{currentUser.role === 'patient' ? '👴' : '👨‍👦'}</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200 truncate max-w-20">
                  {currentUser.name}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    logout();
                  }}
                  title="Sign Out"
                  className="p-0.5 text-slate-400 hover:text-rose-600 transition ml-0.5"
                >
                  <LogOut className="w-3 h-3" />
                </button>
              </div>
            )}

            {/* HIGH VISIBILITY PANIC BUTTON (CALLS 112 & CAREGIVER) */}
            <button
              onClick={triggerPanicAlert}
              title="Emergency SOS: Calls 112 & alerts Caregiver"
              className="relative bg-red-600 hover:bg-red-700 text-white font-black px-3.5 py-1.5 rounded-xl text-xs flex items-center space-x-1.5 shadow-sm active:scale-95 transition shrink-0 overflow-hidden"
            >
              <span className="absolute -inset-1 rounded-xl bg-red-500/50 animate-sonar-ring pointer-events-none" />
              <AlertTriangle className="w-3.5 h-3.5 text-white relative z-10 animate-pulse" />
              <span className="relative z-10">112 SOS</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
