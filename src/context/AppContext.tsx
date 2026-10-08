import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  PatientProfile,
  Medication,
  ScheduleSlot,
  SafetyAlert,
  Caregiver,
  Prescription,
  AppNotification,
  AuditLog,
  DoseStatus,
  AuthUser,
} from '../types';
import {
  initialPatientProfile,
  initialMedications,
  initialScheduleSlots,
  initialSafetyAlerts,
  initialCaregivers,
  initialPrescriptions,
  initialNotifications,
  initialAuditLogs,
} from '../data/mockData';
import { evaluateMedicationSafety } from '../services/safetyEngine';
import { ExtractedMedicationDraft, convertDraftsToMedications } from '../services/aiScanner';
import { playAlertChime } from '../services/speechAssistant';
import confetti from 'canvas-confetti';

interface AppContextType {
  patientProfile: PatientProfile;
  setPatientProfile: React.Dispatch<React.SetStateAction<PatientProfile>>;
  medications: Medication[];
  schedule: ScheduleSlot[];
  safetyAlerts: SafetyAlert[];
  caregivers: Caregiver[];
  prescriptions: Prescription[];
  notifications: AppNotification[];
  auditLogs: AuditLog[];
  elderlyMode: boolean;
  setElderlyMode: (val: boolean) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  panicModalOpen: boolean;
  setPanicModalOpen: (open: boolean) => void;
  demoWalkthroughStep: number | null;
  setDemoWalkthroughStep: (step: number | null) => void;
  nextDemoStep: () => void;
  prevDemoStep: () => void;
  
  // Actions
  markDose: (slotId: string, status: DoseStatus) => void;
  escalateMissedDose: (slotId: string) => void;
  confirmPrescriptionDrafts: (
    drafts: ExtractedMedicationDraft[],
    meta: { doctorName: string; clinic: string; prescriptionDate: string; rawNotes: string }
  ) => void;
  resetDemoData: () => void;
  addNotification: (title: string, message: string, type: AppNotification['type']) => void;
  markNotificationRead: (id: string) => void;
  currentUser: AuthUser | null;
  isAuthenticated: boolean;
  login: (user: AuthUser) => void;
  logout: () => void;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  addMedicationModalOpen: boolean;
  setAddMedicationModalOpen: (open: boolean) => void;
  addNewMedication: (med: Omit<Medication, 'id' | 'status' | 'source'>) => void;
  requestNotificationPermission: () => Promise<boolean>;
  triggerPanicAlert: () => void;
  addCaregiver: (caregiver: Omit<Caregiver, 'id' | 'status'>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEY = 'lifeline_ai_patient_state_v1';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load state from localStorage or fallback to default mock data
  const loadSavedState = () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Could not parse saved state', e);
    }
    return null;
  };

  const saved = loadSavedState();

  const [patientProfile, setPatientProfile] = useState<PatientProfile>(
    saved?.patientProfile || initialPatientProfile
  );
  const [medications, setMedications] = useState<Medication[]>(
    saved?.medications || initialMedications
  );
  const [schedule, setSchedule] = useState<ScheduleSlot[]>(
    saved?.schedule || initialScheduleSlots
  );
  const [safetyAlerts, setSafetyAlerts] = useState<SafetyAlert[]>(
    saved?.safetyAlerts || initialSafetyAlerts
  );
  const [caregivers, setCaregivers] = useState<Caregiver[]>(
    saved?.caregivers || initialCaregivers
  );
  const [prescriptions, setPrescriptions] = useState<Prescription[]>(
    saved?.prescriptions || initialPrescriptions
  );
  const [notifications, setNotifications] = useState<AppNotification[]>(
    saved?.notifications || initialNotifications
  );
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(
    saved?.auditLogs || initialAuditLogs
  );

  const [elderlyMode, setElderlyMode] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>('landing');
  const [panicModalOpen, setPanicModalOpen] = useState<boolean>(false);
  const [demoWalkthroughStep, setDemoWalkthroughStep] = useState<number | null>(null);

  const defaultDemoUser: AuthUser = {
    id: 'u-raj',
    name: 'Raj Sharma',
    role: 'patient',
    phone: '+91 98765 43210',
    email: 'raj.sharma@example.com',
  };

  const [currentUser, setCurrentUser] = useState<AuthUser | null>(
    saved?.currentUser !== undefined ? saved.currentUser : defaultDemoUser
  );
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    saved?.isAuthenticated !== undefined ? saved.isAuthenticated : true
  );

  const login = (user: AuthUser) => {
    setCurrentUser(user);
    setIsAuthenticated(true);
    addNotification(
      '👋 Welcome to LifeLine AI',
      `Signed in as ${user.name} (${user.role === 'patient' ? 'Patient' : 'Caregiver'}).`,
      'system'
    );
  };

  const logout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    addNotification('🔒 Signed Out', 'You have been securely signed out.', 'system');
  };

  const [darkMode, setDarkMode] = useState<boolean>(saved?.darkMode ?? false);
  const [addMedicationModalOpen, setAddMedicationModalOpen] = useState<boolean>(false);

  // Sync dark mode class to html and body
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
    }
  }, [darkMode]);

  const addNewMedication = (medData: Omit<Medication, 'id' | 'status' | 'source'>) => {
    const medId = `med-${Date.now()}`;
    const newMed: Medication = {
      ...medData,
      id: medId,
      status: 'active',
      source: 'user_confirmed',
    };

    setMedications((prev) => [...prev, newMed]);

    // Generate schedule slots
    const newSlots: ScheduleSlot[] = [];
    const timings = newMed.timings.length > 0 ? newMed.timings : ['08:00 AM'];
    timings.forEach((t) => {
      let period: ScheduleSlot['period'] = 'morning';
      if (t.includes('PM')) {
        const hour = parseInt(t.split(':')[0], 10);
        if (hour >= 1 && hour < 5) period = 'afternoon';
        else if (hour >= 5 && hour < 8) period = 'evening';
        else period = 'night';
      }
      newSlots.push({
        id: `slot-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        medicationId: newMed.id,
        medicationName: newMed.name,
        strength: newMed.strength,
        dosage: newMed.dosage,
        scheduledTime: t,
        period,
        status: 'upcoming',
        notes: newMed.instructions,
      });
    });

    setSchedule((prev) => [...prev, ...newSlots]);

    // Audit Log
    const log: AuditLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toLocaleString(),
      action: 'Medication Added Manually',
      category: 'medication',
      details: `${patientProfile.name} manually added ${newMed.name} (${newMed.strength}) to active regimen.`,
      actor: 'patient',
    };
    setAuditLogs((prev) => [log, ...prev]);

    playAlertChime('success');
    addNotification(
      '💊 Medicine Added',
      `${newMed.name} (${newMed.strength}) added to profile and timetable. Safety screening active.`,
      'system'
    );
  };

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          patientProfile,
          medications,
          schedule,
          safetyAlerts,
          caregivers,
          prescriptions,
          notifications,
          auditLogs,
          currentUser,
          isAuthenticated,
          darkMode,
        })
      );
    } catch (e) {
      console.warn('Storage sync error', e);
    }
  }, [patientProfile, medications, schedule, safetyAlerts, caregivers, prescriptions, notifications, auditLogs, currentUser, isAuthenticated, darkMode]);

  // Update body class on elder-mode change
  useEffect(() => {
    if (elderlyMode) {
      document.body.classList.add('elder-mode');
    } else {
      document.body.classList.remove('elder-mode');
    }
  }, [elderlyMode]);

  // Re-run safety evaluation whenever medications or allergies change
  useEffect(() => {
    const alerts = evaluateMedicationSafety(medications, patientProfile.allergies);
    setSafetyAlerts(alerts);
  }, [medications, patientProfile.allergies]);

  // Send Browser or In-App Notification
  const addNotification = (title: string, message: string, type: AppNotification['type']) => {
    const newNotif: AppNotification = {
      id: `notif-${Date.now()}`,
      type,
      title,
      message,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      read: false,
    };

    setNotifications((prev) => [newNotif, ...prev]);

    // Browser Notification API
    if ('Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification(title, {
          body: message,
          icon: '/favicon.ico',
        });
      } catch (e) {
        console.warn('Web notification dispatch error', e);
      }
    }
  };

  const requestNotificationPermission = async (): Promise<boolean> => {
    if (!('Notification' in window)) return false;
    const res = await Notification.requestPermission();
    return res === 'granted';
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  // Mark Dose action (taken, skipped, snoozed)
  const markDose = (slotId: string, status: DoseStatus) => {
    const slot = schedule.find((s) => s.id === slotId);
    if (!slot) return;

    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setSchedule((prev) =>
      prev.map((s) => {
        if (s.id === slotId) {
          return {
            ...s,
            status,
            takenAt: status === 'taken' ? timeStr : undefined,
          };
        }
        return s;
      })
    );

    if (status === 'taken') {
      playAlertChime('success');
      try {
        confetti({
          particleCount: 40,
          spread: 60,
          origin: { y: 0.8 },
        });
      } catch (e) {}

      // Add audit log
      const newLog: AuditLog = {
        id: `log-${Date.now()}`,
        timestamp: new Date().toLocaleString(),
        action: 'Dose Confirmed Taken',
        category: 'medication',
        details: `${patientProfile.name} marked ${slot.medicationName} (${slot.strength}) as Taken.`,
        actor: 'patient',
      };
      setAuditLogs((prev) => [newLog, ...prev]);

      addNotification(
        '✅ Medication Confirmed',
        `Great job! ${slot.medicationName} (${slot.strength}) marked as taken at ${timeStr}.`,
        'reminder'
      );
    } else if (status === 'skipped') {
      const newLog: AuditLog = {
        id: `log-${Date.now()}`,
        timestamp: new Date().toLocaleString(),
        action: 'Dose Skipped',
        category: 'medication',
        details: `${patientProfile.name} marked ${slot.medicationName} (${slot.strength}) as Skipped.`,
        actor: 'patient',
      };
      setAuditLogs((prev) => [newLog, ...prev]);
    } else if (status === 'snoozed') {
      playAlertChime('reminder');
      addNotification(
        '⏳ Reminder Snoozed',
        `We will remind you about ${slot.medicationName} in 15 minutes.`,
        'reminder'
      );
    }
  };

  // Escalate Missed Dose to Caregiver
  const escalateMissedDose = (slotId: string) => {
    const slot = schedule.find((s) => s.id === slotId);
    if (!slot) return;

    setSchedule((prev) =>
      prev.map((s) =>
        s.id === slotId
          ? {
              ...s,
              escalatedToCaregiver: true,
              escalatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            }
          : s
      )
    );

    const primaryCaregiver = caregivers.find((c) => c.notifyOnMissed) || caregivers[0];
    const caregiverName = primaryCaregiver ? primaryCaregiver.name : 'Emergency Contact';

    const log: AuditLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toLocaleString(),
      action: 'Caregiver Escalation Sent',
      category: 'caregiver',
      details: `Alert dispatched to ${caregiverName} regarding unconfirmed ${slot.medicationName} dose.`,
      actor: 'system',
    };
    setAuditLogs((prev) => [log, ...prev]);

    addNotification(
      '👨‍👩‍👦 Caregiver Escalation Dispatched',
      `Alert notification sent to ${caregiverName} regarding unconfirmed ${slot.medicationName} dose.`,
      'escalation'
    );
  };

  // Confirm Prescriptions Drafts into active profile
  const confirmPrescriptionDrafts = (
    drafts: ExtractedMedicationDraft[],
    meta: { doctorName: string; clinic: string; prescriptionDate: string; rawNotes: string }
  ) => {
    const prescriptionId = `rx-${Date.now()}`;
    const newMeds = convertDraftsToMedications(drafts, prescriptionId, meta.prescriptionDate, meta.doctorName);

    // Update Medications
    setMedications((prev) => [...prev, ...newMeds]);

    // Create New Prescription Record
    const newRx: Prescription = {
      id: prescriptionId,
      title: `Prescription #${prescriptions.length + 1} - ${meta.clinic || 'Verified Clinic'}`,
      date: meta.prescriptionDate || new Date().toISOString().split('T')[0],
      doctorName: meta.doctorName || 'Prescribing Physician',
      clinic: meta.clinic || 'Medical Clinic',
      status: 'active',
      notes: meta.rawNotes,
      items: newMeds,
    };
    setPrescriptions((prev) => [newRx, ...prev]);

    // Generate Schedule Slots for confirmed medications
    const newSlots: ScheduleSlot[] = [];
    newMeds.forEach((m) => {
      m.timings.forEach((t) => {
        let period: ScheduleSlot['period'] = 'morning';
        if (t.includes('PM')) {
          const hour = parseInt(t.split(':')[0], 10);
          if (hour >= 1 && hour < 5) period = 'afternoon';
          else if (hour >= 5 && hour < 8) period = 'evening';
          else period = 'night';
        }
        newSlots.push({
          id: `slot-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          medicationId: m.id,
          medicationName: m.name,
          strength: m.strength,
          dosage: m.dosage,
          scheduledTime: t,
          period,
          status: 'upcoming',
          notes: m.instructions,
        });
      });
    });

    setSchedule((prev) => [...prev, ...newSlots]);

    // Add Audit Log
    const log: AuditLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toLocaleString(),
      action: 'Prescription Confirmed & Saved',
      category: 'prescription',
      details: `User explicitly verified and confirmed ${newMeds.length} new medications from ${meta.doctorName}.`,
      actor: 'patient',
    };
    setAuditLogs((prev) => [log, ...prev]);

    addNotification(
      '📋 Prescription Confirmed',
      `${newMeds.length} medications successfully added to your profile & schedule after verification.`,
      'system'
    );
  };

  // Trigger Panic Alert (Requirement: call 112 & call caregiver)
  const triggerPanicAlert = () => {
    playAlertChime('panic');
    setPanicModalOpen(true);

    const primaryContact =
      patientProfile.emergencyContacts.find((c) => c.isPrimary) ||
      patientProfile.emergencyContacts[0] ||
      { name: 'Amit Sharma', relation: 'Son', phone: '+91 98765 43210' };

    // Trigger direct emergency call to 112 on device
    try {
      window.location.href = `tel:${patientProfile.emergencyPhone || '112'}`;
    } catch (err) {
      console.warn('Emergency dialer trigger error', err);
    }

    const log: AuditLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toLocaleString(),
      action: 'Emergency Dual-Call Triggered (112 & Caregiver)',
      category: 'panic',
      details: `${patientProfile.name} triggered PANIC. Auto-dialed 112 and dispatched urgent SOS to Caregiver ${primaryContact.name} (${primaryContact.phone}).`,
      actor: 'patient',
    };
    setAuditLogs((prev) => [log, ...prev]);

    addNotification(
      '🚨 EMERGENCY DUAL-CALL INITIATED',
      `Calling 112 (National Emergency) & Automated SOS dispatched to Caregiver ${primaryContact.name} (${primaryContact.phone}).`,
      'panic'
    );
  };

  const addCaregiver = (caregiverData: Omit<Caregiver, 'id' | 'status'>) => {
    const newCg: Caregiver = {
      ...caregiverData,
      id: `cg-${Date.now()}`,
      status: 'connected',
    };
    setCaregivers((prev) => [...prev, newCg]);
    addNotification('👨‍👩‍👦 Safety Circle Updated', `${newCg.name} added to your caregiver circle.`, 'system');
  };

  // Reset to initial demo state
  const resetDemoData = () => {
    setPatientProfile(initialPatientProfile);
    setMedications(initialMedications);
    setSchedule(initialScheduleSlots);
    setSafetyAlerts(initialSafetyAlerts);
    setCaregivers(initialCaregivers);
    setPrescriptions(initialPrescriptions);
    setNotifications(initialNotifications);
    setAuditLogs(initialAuditLogs);
    setDemoWalkthroughStep(null);
    localStorage.removeItem(STORAGE_KEY);
    addNotification('🔄 Demo Mode Reset', 'Fictional patient Raj Sharma state restored to baseline.', 'system');
  };

  // Demo flow walkthrough progression (Steps 1 to 10)
  const nextDemoStep = () => {
    if (demoWalkthroughStep === null) {
      setDemoWalkthroughStep(1);
      setActiveTab('dashboard');
    } else if (demoWalkthroughStep < 10) {
      const next = demoWalkthroughStep + 1;
      setDemoWalkthroughStep(next);

      // Auto route to relevant tab for that step
      switch (next) {
        case 1:
          setActiveTab('dashboard');
          break;
        case 2:
        case 3:
          setActiveTab('scanner');
          break;
        case 4:
          setActiveTab('safety');
          break;
        case 5:
        case 6:
          setActiveTab('schedule');
          break;
        case 7:
          setActiveTab('compare');
          break;
        case 8:
          setPanicModalOpen(true);
          break;
        case 9:
        case 10:
          setActiveTab('emergency');
          setPanicModalOpen(false);
          break;
        default:
          break;
      }
    } else {
      setDemoWalkthroughStep(null);
    }
  };

  const prevDemoStep = () => {
    if (demoWalkthroughStep && demoWalkthroughStep > 1) {
      const prev = demoWalkthroughStep - 1;
      setDemoWalkthroughStep(prev);
    } else {
      setDemoWalkthroughStep(null);
    }
  };

  return (
    <AppContext.Provider
      value={{
        patientProfile,
        setPatientProfile,
        medications,
        schedule,
        safetyAlerts,
        caregivers,
        prescriptions,
        notifications,
        auditLogs,
        elderlyMode,
        setElderlyMode,
        activeTab,
        setActiveTab,
        panicModalOpen,
        setPanicModalOpen,
        demoWalkthroughStep,
        setDemoWalkthroughStep,
        nextDemoStep,
        prevDemoStep,
        markDose,
        escalateMissedDose,
        confirmPrescriptionDrafts,
        resetDemoData,
        addNotification,
        markNotificationRead,
        requestNotificationPermission,
        triggerPanicAlert,
        addCaregiver,
        currentUser,
        isAuthenticated,
        login,
        logout,
        darkMode,
        setDarkMode,
        addMedicationModalOpen,
        setAddMedicationModalOpen,
        addNewMedication,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
