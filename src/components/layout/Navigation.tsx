import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Home,
  LayoutDashboard,
  Camera,
  Pill,
  Clock,
  ShieldAlert,
  GitCompare,
  History,
  Users,
  AlertOctagon,
  HeartPulse,
  MessageSquare,
  Settings,
  User,
} from 'lucide-react';

export const Navigation: React.FC = () => {
  const { activeTab, setActiveTab, safetyAlerts, elderlyMode } = useApp();

  const navItems = [
    { id: 'landing', label: 'Front Page', icon: Home },
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'scanner', label: 'Scan Prescription', icon: Camera },
    { id: 'medicines', label: 'My Medicines', icon: Pill },
    { id: 'schedule', label: "Today's Schedule", icon: Clock },
    {
      id: 'safety',
      label: 'Safety Alerts',
      icon: ShieldAlert,
      badge: safetyAlerts.length > 0 ? safetyAlerts.length : undefined,
      badgeColor: 'bg-amber-500',
    },
    { id: 'compare', label: 'Change Detector', icon: GitCompare },
    { id: 'history', label: 'History & Adherence', icon: History },
    { id: 'caregiver', label: 'Caregiver Mode', icon: Users },
    { id: 'emergency', label: 'Emergency Brief', icon: AlertOctagon, special: true },
    { id: 'firstaid', label: 'First-Aid Guide', icon: HeartPulse },
    { id: 'assistant', label: 'Voice & Assistant', icon: MessageSquare },
    { id: 'profile', label: 'Profile & Health ID', icon: User },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <>
      {/* Desktop & Tablet Sidebar */}
      <aside className="hidden md:flex flex-col w-60 lg:w-64 bg-white/50 dark:bg-[#080e18]/50 border-r border-slate-200/60 dark:border-slate-800/80 shrink-0 p-3.5 space-y-4 transition-colors">
        <div className="space-y-1">
          <nav className="space-y-0.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs sm:text-sm font-medium text-left transition ${
                    elderlyMode ? 'text-base py-2.5' : ''
                  } ${
                    isActive
                      ? item.special
                        ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 font-semibold'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex items-center space-x-2.5 truncate">
                    <Icon
                      className={`w-4 h-4 shrink-0 ${
                        isActive
                          ? item.special
                            ? 'text-rose-600 dark:text-rose-400'
                            : 'text-slate-900 dark:text-white'
                          : 'text-slate-400 dark:text-slate-500'
                      }`}
                    />
                    <span className="truncate">{item.label}</span>
                  </div>

                  {item.badge && (
                    <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-rose-500 text-white shrink-0">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Prescription Verification PS6 Badge & Hospital Status */}
        <div className="mt-auto p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 space-y-1">
          <div className="flex items-center space-x-1.5 font-semibold text-slate-700 dark:text-slate-300 text-[11px]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            <span>PS6 Safety Active</span>
          </div>
          <p className="text-[10px] leading-relaxed text-slate-400 dark:text-slate-500">
            Real-time drug interaction monitoring online.
          </p>
        </div>
      </aside>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#070f1d]/95 backdrop-blur-md border-t border-slate-200 dark:border-cyan-500/20 px-2 py-1.5 flex items-center justify-around shadow-lg">
        {[
          { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
          { id: 'scanner', label: 'Scan', icon: Camera },
          { id: 'schedule', label: 'Schedule', icon: Clock },
          { id: 'safety', label: 'Safety', icon: ShieldAlert, badge: safetyAlerts.length },
          { id: 'emergency', label: 'Emergency', icon: AlertOctagon, special: true },
        ].map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center py-1 px-2 rounded-lg text-xs font-semibold relative transition ${
                isActive
                  ? item.special
                    ? 'text-rose-600 dark:text-rose-400 font-bold'
                    : 'text-sky-600 dark:text-cyan-400 font-bold'
                  : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              <Icon className="w-5 h-5 mb-0.5" />
              <span>{item.label}</span>
              {item.badge !== undefined && item.badge > 0 && (
                <span className="absolute top-0 right-1 w-2 h-2 rounded-full bg-amber-500"></span>
              )}
            </button>
          );
        })}
      </nav>
    </>
  );
};
