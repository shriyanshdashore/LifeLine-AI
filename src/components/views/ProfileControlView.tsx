import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  User,
  ShieldAlert,
  HeartPulse,
  PhoneCall,
  Activity,
  MapPin,
  Lock,
  Plus,
  Trash2,
  CheckCircle2,
  Save,
  Download,
  RefreshCw,
  QrCode,
  FileBadge,
  Sliders,
  ExternalLink,
  Copy,
  Check,
  Users,
} from 'lucide-react';
import { EmergencyContact } from '../../types';

export const ProfileControlView: React.FC = () => {
  const {
    patientProfile,
    setPatientProfile,
    medications,
    safetyAlerts,
    elderlyMode,
    addNotification,
    resetDemoData,
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'vitals' | 'allergies' | 'contacts' | 'privacy'>('vitals');
  const [copiedAbha, setCopiedAbha] = useState(false);
  const [savedToast, setSavedToast] = useState(false);

  // Form State
  const [name, setName] = useState(patientProfile.name);
  const [age, setAge] = useState(patientProfile.age);
  const [gender, setGender] = useState(patientProfile.gender);
  const [bloodGroup, setBloodGroup] = useState(patientProfile.bloodGroup);
  const [heightCm, setHeightCm] = useState(patientProfile.heightCm || 172);
  const [weightKg, setWeightKg] = useState(patientProfile.weightKg || 74);
  const [abhaId, setAbhaId] = useState(patientProfile.abhaId || '91-4281-9920-1124');
  const [insurance, setInsurance] = useState(patientProfile.insurancePolicy || '');
  const [physician, setPhysician] = useState(patientProfile.physicianName || '');
  const [physicianPhone, setPhysicianPhone] = useState(patientProfile.physicianPhone || '');
  const [address, setAddress] = useState(patientProfile.lastKnownLocation?.address || '');
  const [emergencyNotes, setEmergencyNotes] = useState(patientProfile.emergencyNotes || '');

  // Allergies & Conditions tags
  const [allergies, setAllergies] = useState<string[]>([...patientProfile.allergies]);
  const [newAllergyInput, setNewAllergyInput] = useState('');
  const [conditions, setConditions] = useState<string[]>([...patientProfile.userConditions]);
  const [newConditionInput, setNewConditionInput] = useState('');

  // Emergency Contacts
  const [contacts, setContacts] = useState<EmergencyContact[]>([...patientProfile.emergencyContacts]);
  const [newContactName, setNewContactName] = useState('');
  const [newContactRelation, setNewContactRelation] = useState('Daughter');
  const [newContactPhone, setNewContactPhone] = useState('');
  const [showAddContact, setShowAddContact] = useState(false);

  // Privacy toggles
  const [locationConsent, setLocationConsent] = useState(patientProfile.locationConsent);

  // Calculated BMI
  const bmi = heightCm > 0 ? (weightKg / ((heightCm / 100) * (heightCm / 100))).toFixed(1) : '24.2';

  // Copy ABHA
  const handleCopyAbha = () => {
    navigator.clipboard.writeText(abhaId);
    setCopiedAbha(true);
    setTimeout(() => setCopiedAbha(false), 2000);
  };

  // Add Allergy
  const handleAddAllergy = (allergen: string) => {
    const trimmed = allergen.trim();
    if (!trimmed || allergies.some((a) => a.toLowerCase() === trimmed.toLowerCase())) return;
    setAllergies((prev) => [...prev, trimmed]);
    setNewAllergyInput('');
  };

  const handleRemoveAllergy = (item: string) => {
    setAllergies((prev) => prev.filter((a) => a !== item));
  };

  // Add Condition
  const handleAddCondition = (cond: string) => {
    const trimmed = cond.trim();
    if (!trimmed || conditions.some((c) => c.toLowerCase() === trimmed.toLowerCase())) return;
    setConditions((prev) => [...prev, trimmed]);
    setNewConditionInput('');
  };

  const handleRemoveCondition = (item: string) => {
    setConditions((prev) => prev.filter((c) => c !== item));
  };

  // Contact management
  const handleSetPrimaryContact = (contactId: string) => {
    setContacts((prev) =>
      prev.map((c) => ({
        ...c,
        isPrimary: c.id === contactId,
      }))
    );
  };

  const handleRemoveContact = (contactId: string) => {
    if (contacts.length <= 1) return;
    setContacts((prev) => prev.filter((c) => c.id !== contactId));
  };

  const handleAddContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContactName || !newContactPhone) return;
    const newEntry: EmergencyContact = {
      id: `c-${Date.now()}`,
      name: newContactName,
      relation: newContactRelation,
      phone: newContactPhone,
      isPrimary: contacts.length === 0,
    };
    setContacts((prev) => [...prev, newEntry]);
    setNewContactName('');
    setNewContactPhone('');
    setShowAddContact(false);
  };

  // Switch Multi-patient profile (Raj Sharma vs Kanta Sharma demo)
  const handleSwitchToSpouse = () => {
    setName('Kanta Sharma');
    setAge(64);
    setGender('Female');
    setBloodGroup('O+');
    setHeightCm(160);
    setWeightKg(62);
    setAbhaId('91-1192-8821-4451');
    setAllergies(['Aspirin / NSAIDs']);
    setConditions(['Osteoarthritis', 'Mild Hypothyroidism']);
    addNotification('🔄 Profile Switched', 'Viewing Kanta Sharma (Mother / Spouse).', 'system');
  };

  const handleSwitchToRaj = () => {
    setName('Raj Sharma');
    setAge(68);
    setGender('Male');
    setBloodGroup('B+');
    setHeightCm(172);
    setWeightKg(74);
    setAbhaId('91-4281-9920-1124');
    setAllergies(['Penicillin', 'Sulfa Antibiotics']);
    setConditions(['Type 2 Diabetes Mellitus', 'Essential Hypertension', 'Mild Hyperlipidemia']);
    addNotification('🔄 Profile Switched', 'Viewing Raj Sharma (Primary Patient).', 'system');
  };

  // Save all profile changes
  const handleSaveAll = () => {
    setPatientProfile((prev) => ({
      ...prev,
      name,
      age: Number(age) || 68,
      gender,
      bloodGroup,
      heightCm: Number(heightCm) || 172,
      weightKg: Number(weightKg) || 74,
      abhaId,
      insurancePolicy: insurance,
      physicianName: physician,
      physicianPhone,
      allergies,
      userConditions: conditions,
      locationConsent,
      emergencyContacts: contacts,
      emergencyNotes,
      lastKnownLocation: prev.lastKnownLocation
        ? { ...prev.lastKnownLocation, address }
        : { address, lat: 12.9279, lng: 77.6771, timestamp: new Date().toLocaleTimeString() },
    }));

    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 3000);
    addNotification(
      '👤 Health Profile Updated',
      'All personal vitals, allergens, and emergency contacts saved.',
      'system'
    );
  };

  // Export Profile JSON
  const handleExportJson = () => {
    const exportData = {
      patientProfile: {
        ...patientProfile,
        name,
        age,
        gender,
        bloodGroup,
        allergies,
        userConditions: conditions,
        emergencyContacts: contacts,
      },
      activeMedications: medications,
      activeSafetyAlerts: safetyAlerts,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `lifeline_health_profile_${name.toLowerCase().replace(/\s+/g, '_')}.json`;
    a.click();
    addNotification('📁 Health Profile Exported', 'Downloaded secure JSON profile backup.', 'system');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Banner & Multi-Patient Profile Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
        <div>
          <h1 className={`font-extrabold text-slate-900 dark:text-white tracking-tight ${elderlyMode ? 'text-3xl' : 'text-2xl sm:text-3xl'}`}>
            Patient Health Profile
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Manage personal health vitals, documented clinical allergens, emergency contacts, and digital health records
          </p>
        </div>

        {/* Multi-Patient Family Switcher */}
        <div className="flex items-center space-x-1.5 bg-slate-100 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 p-1 rounded-xl shrink-0 self-start sm:self-auto">
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 pl-1.5">Profile:</span>
          <button
            onClick={handleSwitchToRaj}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${
              name.includes('Raj')
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            👴 Raj (68y)
          </button>
          <button
            onClick={handleSwitchToSpouse}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${
              name.includes('Kanta')
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            👵 Kanta (64y)
          </button>
        </div>
      </div>

      {/* DIGITAL HEALTH CARD SUMMARY BADGE */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200/70 dark:border-slate-800 shadow-2xs text-slate-900 dark:text-white">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start space-x-3.5">
            <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200/70 dark:border-slate-700 flex items-center justify-center text-2xl shrink-0">
              {gender === 'Female' ? '👵' : '👴'}
            </div>
            <div className="space-y-0.5">
              <div className="flex items-center space-x-2">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">{name}</h2>
                <span className="px-2 py-0.2 rounded-md text-[10px] font-bold bg-rose-500 text-white">
                  {bloodGroup}
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                {age} Years • {gender} • {heightCm} cm • {weightKg} kg (BMI: {bmi})
              </p>
              <div className="flex items-center space-x-2 pt-0.5 text-xs text-slate-500 dark:text-slate-400">
                <span>ABHA ID:</span>
                <span className="font-mono text-xs font-semibold text-slate-800 dark:text-sky-300 bg-slate-100 dark:bg-white/10 px-1.5 py-0.2 rounded">
                  {abhaId}
                </span>
                <button
                  onClick={handleCopyAbha}
                  className="p-1 hover:text-slate-900 dark:hover:text-white transition"
                  title="Copy ABHA ID"
                >
                  {copiedAbha ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                </button>
              </div>
            </div>
          </div>

          <div className="flex sm:flex-col items-end justify-between gap-2 shrink-0">
            <button
              onClick={handleSaveAll}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-xs transition active:scale-95 flex items-center space-x-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Changes</span>
            </button>
            <button
              onClick={handleExportJson}
              className="px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 text-[11px] font-medium flex items-center space-x-1 transition"
            >
              <Download className="w-3 h-3" />
              <span>Export JSON</span>
            </button>
          </div>
        </div>
      </div>

      {/* PROFILE SUB-TABS NAVIGATION */}
      <div className="flex flex-wrap items-center gap-1.5 pb-1 border-b border-slate-200/80 dark:border-slate-800">
        {[
          { id: 'vitals', label: '👤 Vitals & Bio' },
          { id: 'allergies', label: '🛡️ Allergies & Conditions', badge: allergies.length + conditions.length },
          { id: 'contacts', label: '📞 Emergency Contacts', badge: contacts.length },
          { id: 'privacy', label: '🔐 Privacy & Security' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveSubTab(tab.id as any)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition flex items-center space-x-1.5 ${
              activeSubTab === tab.id
                ? 'bg-slate-900 dark:bg-slate-800 text-white shadow-xs'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-800'
            }`}
          >
            <span>{tab.label}</span>
            {tab.badge !== undefined && (
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${activeSubTab === tab.id ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'}`}>
                {tab.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* TAB 1: PERSONAL & VITALS */}
      {activeSubTab === 'vitals' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4 animate-in fade-in">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">Personal Demographics & Clinical Vitals</h2>
            <span className="text-xs text-slate-400">Used across prescriptions & emergency brief</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {/* Full Name */}
            <div>
              <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-sky-500"
              />
            </div>

            {/* Age */}
            <div>
              <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Age (Years)</label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-sky-500"
              />
            </div>

            {/* Gender */}
            <div>
              <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Gender</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-sky-500"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Blood Group */}
            <div>
              <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Blood Group</label>
              <select
                value={bloodGroup}
                onChange={(e) => setBloodGroup(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold text-xs sm:text-sm text-rose-600 dark:text-rose-400 focus:outline-none focus:ring-1 focus:ring-sky-500"
              >
                {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((bg) => (
                  <option key={bg} value={bg}>{bg}</option>
                ))}
              </select>
            </div>

            {/* Height */}
            <div>
              <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Height (cm)</label>
              <input
                type="number"
                value={heightCm}
                onChange={(e) => setHeightCm(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-sky-500"
              />
            </div>

            {/* Weight */}
            <div>
              <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Weight (kg)</label>
              <input
                type="number"
                value={weightKg}
                onChange={(e) => setWeightKg(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-sky-500"
              />
            </div>

            {/* ABHA Digital Health ID */}
            <div>
              <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">ABHA Health ID</label>
              <input
                type="text"
                value={abhaId}
                onChange={(e) => setAbhaId(e.target.value)}
                placeholder="91-XXXX-XXXX-XXXX"
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono font-semibold text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-sky-500"
              />
            </div>

            {/* Primary Physician */}
            <div>
              <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Attending Physician</label>
              <input
                type="text"
                value={physician}
                onChange={(e) => setPhysician(e.target.value)}
                placeholder="Dr. Anita Desai, MD"
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-sky-500"
              />
            </div>

            {/* Physician Phone */}
            <div>
              <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Doctor Phone</label>
              <input
                type="tel"
                value={physicianPhone}
                onChange={(e) => setPhysicianPhone(e.target.value)}
                placeholder="+91 98450 11223"
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-sky-500"
              />
            </div>

            {/* Home Address */}
            <div className="sm:col-span-2 lg:col-span-3">
              <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Home Address (Emergency Dispatch)</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Full residential address for emergency dispatch"
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-sky-500"
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: CLINICAL ALLERGIES & CHRONIC CONDITIONS */}
      {activeSubTab === 'allergies' && (
        <div className="space-y-4 animate-in fade-in">
          {/* Allergens Control */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center space-x-2 text-rose-600 dark:text-rose-400">
                <ShieldAlert className="w-4 h-4" />
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">Documented Drug & Food Allergies</h2>
              </div>
              <span className="text-[10px] font-bold text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/60 px-2 py-0.5 rounded-full border border-rose-200 dark:border-rose-900">
                Active Screen ({allergies.length})
              </span>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              Prescription scans are cross-checked in real time against these documented allergens.
            </p>

            {/* Existing Allergies Tags */}
            <div className="flex flex-wrap gap-2 pt-1">
              {allergies.map((allergy, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 font-bold text-xs flex items-center space-x-1.5 border border-rose-200 dark:border-rose-800 shadow-2xs"
                >
                  <span>⚠️ {allergy}</span>
                  <button
                    onClick={() => handleRemoveAllergy(allergy)}
                    className="p-0.5 rounded-full hover:bg-rose-200 dark:hover:bg-rose-900 text-rose-600 dark:text-rose-400 transition"
                    title="Remove allergy"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>

            {/* Add Allergy Input */}
            <div className="pt-2 flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={newAllergyInput}
                onChange={(e) => setNewAllergyInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddAllergy(newAllergyInput);
                  }
                }}
                placeholder="Type allergy name (e.g. Aspirin, Amoxicillin)..."
                className="flex-1 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-rose-500"
              />
              <button
                type="button"
                onClick={() => handleAddAllergy(newAllergyInput)}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs flex items-center justify-center space-x-1 transition"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Allergy</span>
              </button>
            </div>
          </div>

          {/* Chronic Conditions Control */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center space-x-2 text-indigo-600 dark:text-indigo-400">
                <HeartPulse className="w-4 h-4" />
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">Documented Chronic Conditions</h2>
              </div>
              <span className="text-[10px] font-bold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded-full border border-indigo-200 dark:border-indigo-900">
                {conditions.length} Conditions
              </span>
            </div>

            {/* Condition Tags */}
            <div className="flex flex-wrap gap-2 pt-1">
              {conditions.map((cond, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-800 dark:text-indigo-300 font-bold text-xs flex items-center space-x-1.5 border border-indigo-200 dark:border-indigo-800 shadow-2xs"
                >
                  <span>🩺 {cond}</span>
                  <button
                    onClick={() => handleRemoveCondition(cond)}
                    className="p-0.5 rounded-full hover:bg-indigo-200 dark:hover:bg-indigo-900 text-indigo-600 dark:text-indigo-400 transition"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>

            {/* Add Condition Input */}
            <div className="pt-2 flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={newConditionInput}
                onChange={(e) => setNewConditionInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddCondition(newConditionInput);
                  }
                }}
                placeholder="Add condition (e.g. Asthma, Hypertension)..."
                className="flex-1 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
              <button
                type="button"
                onClick={() => handleAddCondition(newConditionInput)}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs flex items-center justify-center space-x-1 transition"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Condition</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: EMERGENCY CONTACTS */}
      {activeSubTab === 'contacts' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4 animate-in fade-in">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">Emergency Contacts & Guardians</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Speed-dial targets in PANIC mode and automated caregiver escalations</p>
            </div>

            <button
              onClick={() => setShowAddContact(!showAddContact)}
              className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white font-semibold text-xs flex items-center space-x-1 transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Contact</span>
            </button>
          </div>

          {/* Add Contact Drawer */}
          {showAddContact && (
            <form onSubmit={handleAddContactSubmit} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700 space-y-3">
              <h3 className="font-bold text-xs uppercase text-slate-600 dark:text-slate-300">New Emergency Contact</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input
                  type="text"
                  required
                  value={newContactName}
                  onChange={(e) => setNewContactName(e.target.value)}
                  placeholder="Full Name (e.g. Priya Sharma)"
                  className="px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white"
                />
                <select
                  value={newContactRelation}
                  onChange={(e) => setNewContactRelation(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white"
                >
                  <option value="Son">Son</option>
                  <option value="Daughter">Daughter</option>
                  <option value="Spouse">Spouse</option>
                  <option value="Caregiver">Caregiver / Nurse</option>
                  <option value="Doctor">Primary Doctor</option>
                  <option value="Neighbor">Neighbor</option>
                </select>
                <input
                  type="tel"
                  required
                  value={newContactPhone}
                  onChange={(e) => setNewContactPhone(e.target.value)}
                  placeholder="+91 98XXX XXXXX"
                  className="px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white"
                />
              </div>
              <div className="flex justify-end space-x-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowAddContact(false)}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3.5 py-1.5 rounded-xl bg-slate-900 dark:bg-slate-800 text-white text-xs font-bold"
                >
                  Save Contact
                </button>
              </div>
            </form>
          )}

          {/* Contact Cards */}
          <div className="space-y-2.5">
            {contacts.map((contact) => (
              <div
                key={contact.id}
                className="p-3.5 sm:p-4 rounded-xl bg-slate-50/60 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-xl bg-sky-100 dark:bg-sky-950/60 text-sky-800 dark:text-sky-300 font-bold text-sm flex items-center justify-center shrink-0">
                    {contact.relation.includes('Son') ? '👨' : contact.relation.includes('Daughter') ? '👩' : '🧑‍⚕️'}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="font-bold text-sm text-slate-900 dark:text-white">{contact.name}</h3>
                      <span className="text-[10px] font-semibold text-sky-700 dark:text-sky-300 bg-sky-50 dark:bg-sky-950/60 px-2 py-0.2 rounded-md">
                        {contact.relation}
                      </span>
                      {contact.isPrimary && (
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300">
                          Primary
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 flex items-center space-x-1">
                      <PhoneCall className="w-3 h-3 text-slate-400" />
                      <span>{contact.phone}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2 shrink-0 self-end sm:self-center">
                  {!contact.isPrimary && (
                    <button
                      onClick={() => handleSetPrimaryContact(contact.id)}
                      className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium border border-slate-200 dark:border-slate-700 transition"
                    >
                      Make Primary
                    </button>
                  )}
                  {contacts.length > 1 && (
                    <button
                      onClick={() => handleRemoveContact(contact.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition"
                      title="Delete contact"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: PRIVACY, LOCATION & SECURITY */}
      {activeSubTab === 'privacy' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4 animate-in fade-in">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">Privacy & Telemetry Controls</h2>
            <span className="text-xs text-slate-400">Manage consent and emergency bypass access</span>
          </div>

          <div className="space-y-3">
            {/* GPS Location Consent */}
            <div className="p-4 rounded-xl bg-slate-50/60 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/80 flex items-center justify-between">
              <div>
                <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white block">Emergency GPS Location Sharing</span>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  Transmits GPS coordinates to emergency services and caregiver briefly during active PANIC mode.
                </span>
              </div>
              <button
                type="button"
                onClick={() => setLocationConsent(!locationConsent)}
                className={`w-12 h-6 rounded-full transition-colors p-0.5 ${
                  locationConsent ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-700'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform ${
                    locationConsent ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Paramedic Emergency Bypass */}
            <div className="p-4 rounded-xl bg-slate-50/60 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/80 flex items-center justify-between">
              <div>
                <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white block">Paramedic Quick QR Bypass</span>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  Allows first responders to scan QR code on lock screen without needing account credentials.
                </span>
              </div>
              <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-full">
                Enabled
              </span>
            </div>

            {/* Reset Data */}
            <div className="p-4 rounded-xl bg-rose-50/60 dark:bg-rose-950/20 border border-rose-200/80 dark:border-rose-900/60 flex items-center justify-between">
              <div>
                <span className="font-bold text-xs sm:text-sm text-rose-900 dark:text-rose-200 block">Reset Patient Data to Demo Baseline</span>
                <span className="text-xs text-rose-700 dark:text-rose-300">
                  Restores initial Raj Sharma profile, 3 active medicines, and sample prescriptions.
                </span>
              </div>
              <button
                type="button"
                onClick={resetDemoData}
                className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs transition"
              >
                Reset Demo
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Save Bar */}
      <div className="flex items-center justify-between p-4 bg-slate-900 dark:bg-slate-800/90 text-white rounded-2xl shadow-sm border border-slate-800 dark:border-slate-700">
        <div className="flex items-center space-x-2 text-xs text-slate-300">
          <Save className="w-3.5 h-3.5 text-emerald-400" />
          <span>Profile changes sync across prescriptions and emergency brief.</span>
        </div>

        <div className="flex items-center space-x-3">
          {savedToast && (
            <span className="text-xs font-bold text-emerald-400 flex items-center space-x-1 animate-pulse">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Saved!</span>
            </span>
          )}
          <button
            onClick={handleSaveAll}
            className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-xs transition active:scale-95"
          >
            Save All Changes
          </button>
        </div>
      </div>
    </div>
  );
};
