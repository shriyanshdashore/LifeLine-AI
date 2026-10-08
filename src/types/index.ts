export type MedicationStatus = 'active' | 'discontinued' | 'paused';
export type DoseStatus = 'taken' | 'upcoming' | 'pending' | 'skipped' | 'snoozed';
export type SafetySeverity = 'low' | 'moderate' | 'high';
export type Language = 'en' | 'hi' | 'hinglish';

export interface AuthUser {
  id: string;
  name: string;
  role: 'patient' | 'caregiver' | 'paramedic';
  phone: string;
  email: string;
}

export interface EmergencyContact {
  id: string;
  name: string;
  relation: string;
  phone: string;
  isPrimary: boolean;
}

export interface PatientProfile {
  id: string;
  name: string;
  age: number;
  gender: string;
  bloodGroup: string;
  preferredLanguage: Language;
  emergencyPhone: string; // default 112
  emergencyContacts: EmergencyContact[];
  allergies: string[]; // User-provided
  userConditions: string[]; // User-provided
  locationConsent: boolean;
  heightCm?: number;
  weightKg?: number;
  abhaId?: string; // Ayushman Bharat Health Account ID
  insurancePolicy?: string;
  physicianName?: string;
  physicianPhone?: string;
  emergencyNotes?: string;
  lastKnownLocation?: {
    address: string;
    lat: number;
    lng: number;
    timestamp: string;
  };
}

export interface Medication {
  id: string;
  name: string;
  genericName?: string;
  strength: string;
  dosage: string;
  frequency: string;
  timings: string[]; // ["08:00", "20:00"]
  durationDays: number;
  instructions: string;
  prescribedBy?: string;
  prescriptionId?: string;
  prescriptionDate?: string;
  confidence?: number; // 0 to 1
  needsVerification?: boolean;
  status: MedicationStatus;
  source: 'user_confirmed' | 'ai_extracted';
  notes?: string;
}

export interface ScheduleSlot {
  id: string;
  medicationId: string;
  medicationName: string;
  strength: string;
  dosage: string;
  scheduledTime: string; // e.g. "08:00 AM"
  period: 'morning' | 'afternoon' | 'evening' | 'night';
  status: DoseStatus;
  takenAt?: string;
  notes?: string;
  escalatedToCaregiver?: boolean;
  escalatedAt?: string;
}

export interface SafetyAlert {
  id: string;
  type: 'drug_interaction' | 'dosage_warning' | 'allergy_warning' | 'timing_conflict';
  severity: SafetySeverity; // low=green, moderate=yellow, high=red
  title: string;
  involvedMeds: string[];
  mechanism: string;
  explanation: string;
  recommendedAction: string;
  source: string;
  verifiedDate: string;
}

export interface Caregiver {
  id: string;
  name: string;
  relation: string;
  phone: string;
  email: string;
  notifyOnMissed: boolean;
  notifyOnPanic: boolean;
  dailySummary: boolean;
  status: 'connected' | 'pending';
  lastNotified?: string;
}

export interface Prescription {
  id: string;
  title: string;
  date: string;
  doctorName: string;
  clinic: string;
  imageUrl?: string;
  items: Medication[];
  notes?: string;
  status: 'active' | 'archived';
}

export interface AppNotification {
  id: string;
  type: 'reminder' | 'escalation' | 'safety' | 'panic' | 'system';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionPayload?: {
    slotId?: string;
    medicationId?: string;
  };
}

export interface AuditLog {
  id: string;
  timestamp: string;
  action: string;
  category: 'medication' | 'safety' | 'panic' | 'caregiver' | 'prescription';
  details: string;
  actor: 'patient' | 'caregiver' | 'system';
}

export interface PrescriptionDiff {
  continued: Medication[];
  added: Medication[];
  removed: Medication[];
  changed: {
    oldMed: Medication;
    newMed: Medication;
    changes: string[];
  }[];
}
