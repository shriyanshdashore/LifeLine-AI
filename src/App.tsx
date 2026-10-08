import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/layout/Header';
import { Navigation } from './components/layout/Navigation';
import { PanicModal } from './components/panic/PanicModal';
import { DemoTourGuide } from './components/demo/DemoTourGuide';
import { DashboardView } from './components/views/DashboardView';
import { PrescriptionScannerView } from './components/views/PrescriptionScannerView';
import { MedicinesView } from './components/views/MedicinesView';
import { ScheduleTimelineView } from './components/views/ScheduleTimelineView';
import { SafetyEngineView } from './components/views/SafetyEngineView';
import { PrescriptionChangeDetectorView } from './components/views/PrescriptionChangeDetectorView';
import { HistoryAdherenceView } from './components/views/HistoryAdherenceView';
import { CaregiverModeView } from './components/views/CaregiverModeView';
import { EmergencyBriefView } from './components/views/EmergencyBriefView';
import { FirstAidView } from './components/views/FirstAidView';
import { VoiceAssistantView } from './components/views/VoiceAssistantView';
import { SettingsView } from './components/views/SettingsView';
import { ProfileControlView } from './components/views/ProfileControlView';
import { LandingPageView } from './components/views/LandingPageView';
import { LoginPage } from './components/auth/LoginPage';
import { AddMedicationModal } from './components/medications/AddMedicationModal';
import { CursorSpotlightGlow } from './components/common/CursorSpotlightGlow';
import { AntigravityParticleCanvas } from './components/common/AntigravityParticleCanvas';
import { Mic } from 'lucide-react';

const MainLayout: React.FC = () => {
  const { activeTab, setActiveTab, isAuthenticated, darkMode } = useApp();

  if (activeTab === 'landing') {
    return (
      <>
        <LandingPageView />
        <PanicModal />
      </>
    );
  }

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  const renderActiveView = () => {
    switch (activeTab) {
      case 'landing':
        return <LandingPageView />;
      case 'dashboard':
        return <DashboardView />;
      case 'scanner':
        return <PrescriptionScannerView />;
      case 'medicines':
        return <MedicinesView />;
      case 'schedule':
        return <ScheduleTimelineView />;
      case 'safety':
        return <SafetyEngineView />;
      case 'compare':
        return <PrescriptionChangeDetectorView />;
      case 'history':
        return <HistoryAdherenceView />;
      case 'caregiver':
        return <CaregiverModeView />;
      case 'emergency':
        return <EmergencyBriefView />;
      case 'firstaid':
        return <FirstAidView />;
      case 'assistant':
        return <VoiceAssistantView />;
      case 'profile':
        return <ProfileControlView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-150 relative overflow-x-hidden ${darkMode ? 'dark bg-[#080e18] text-slate-100' : 'bg-[#f8fafc] text-slate-900'}`}>
      {/* Subtle Cursor Spotlight Follower across inner pages */}
      <CursorSpotlightGlow darkMode={darkMode} subtle={true} />

      {/* Subtle Ambient Anti-Gravity Particle Field */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <AntigravityParticleCanvas darkMode={darkMode} subtle={true} />
      </div>

      {/* Top Header */}
      <div className="relative z-10">
        <Header />
      </div>

      {/* Main Container */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto pb-20 md:pb-8 relative z-10">
        {/* Navigation Sidebar */}
        <Navigation />

        {/* Viewport Content with smooth tab fade-in */}
        <main key={activeTab} className="flex-1 p-4 sm:p-6 lg:p-8 max-w-5xl overflow-y-auto animate-fade-in">
          {renderActiveView()}
        </main>
      </div>

      {/* Direct Add Medication Modal */}
      <AddMedicationModal />

      {/* Emergency Panic Modal */}
      <PanicModal />

      {/* Demo Tour Guide for Hackathon Judges */}
      <DemoTourGuide />

      {/* Floating Quick Voice Assistant Trigger */}
      {activeTab !== 'assistant' && (
        <button
          onClick={() => setActiveTab('assistant')}
          className="fixed bottom-20 md:bottom-6 right-5 md:right-24 z-30 p-3.5 rounded-full bg-gradient-to-tr from-sky-600 to-teal-500 text-white shadow-xl hover:scale-105 active:scale-95 transition flex items-center justify-center group"
          title="Open Voice Assistant"
        >
          <Mic className="w-5 h-5 group-hover:animate-bounce" />
        </button>
      )}
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
