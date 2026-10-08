import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  analyzePrescriptionImage,
  DEMO_PRESCRIPTIONS,
  ExtractedMedicationDraft,
  DemoPrescriptionSample,
  KNOWN_MEDICINE_DATABASE,
} from '../../services/aiScanner';
import {
  Upload,
  Camera,
  FileCheck,
  AlertTriangle,
  Plus,
  Trash2,
  CheckCircle2,
  Sparkles,
  Info,
  Clock,
  Eye,
  Loader2,
} from 'lucide-react';

export const PrescriptionScannerView: React.FC = () => {
  const { confirmPrescriptionDrafts, setActiveTab, elderlyMode } = useApp();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedDemoId, setSelectedDemoId] = useState<string>('demo-sample-1');
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanResult, setScanResult] = useState<{
    doctorName: string;
    clinic: string;
    prescriptionDate: string;
    rawNotes: string;
    medications: ExtractedMedicationDraft[];
  } | null>(null);

  const [confirmModalOpen, setConfirmModalOpen] = useState<boolean>(false);

  // Trigger Scan
  const handleStartScan = async (source: string | File) => {
    setIsScanning(true);
    setScanResult(null);
    try {
      const result = await analyzePrescriptionImage(source);
      setScanResult({
        doctorName: result.doctorName,
        clinic: result.clinic,
        prescriptionDate: result.prescriptionDate,
        rawNotes: result.rawNotes,
        medications: result.medications,
      });
    } catch (err) {
      console.error('Scan error', err);
    } finally {
      setIsScanning(false);
    }
  };

  // Field edit handler for draft cards
  const updateDraft = (id: string, field: keyof ExtractedMedicationDraft, value: any) => {
    if (!scanResult) return;
    setScanResult({
      ...scanResult,
      medications: scanResult.medications.map((m) =>
        m.id === id ? { ...m, [field]: value } : m
      ),
    });
  };

  // Quick apply template to draft if medicine name matches known medicine
  const applyMedicineTemplate = (draftId: string, templateName: string) => {
    const tmpl = KNOWN_MEDICINE_DATABASE.find(
      (m) =>
        m.name.toLowerCase() === templateName.toLowerCase() ||
        m.aliases.some((a) => a.toLowerCase() === templateName.toLowerCase())
    );
    if (!tmpl || !scanResult) return;

    setScanResult({
      ...scanResult,
      medications: scanResult.medications.map((m) =>
        m.id === draftId
          ? {
              ...m,
              name: tmpl.name,
              strength: tmpl.defaultStrength,
              dosage: tmpl.dosage,
              frequency: tmpl.frequency,
              timings: tmpl.timings,
              durationDays: tmpl.durationDays,
              instructions: tmpl.instructions,
              confidence: 0.98,
              needsVerification: false,
              notes: tmpl.notes,
            }
          : m
      ),
    });
  };

  // Quick pick directly adds or populates a real medicine
  const handleQuickPick = (template: typeof KNOWN_MEDICINE_DATABASE[0]) => {
    if (!scanResult) {
      setScanResult({
        doctorName: 'Dr. R. K. Sen, MBBS, MD',
        clinic: 'Apollo Medical Center',
        prescriptionDate: new Date().toISOString().split('T')[0],
        rawNotes: `Selected prescribed medicine: ${template.name}`,
        medications: [
          {
            id: `quick-${Date.now()}`,
            name: template.name,
            strength: template.defaultStrength,
            dosage: template.dosage,
            frequency: template.frequency,
            timings: template.timings,
            durationDays: template.durationDays,
            instructions: template.instructions,
            prescribedBy: 'Dr. R. K. Sen, MD',
            confidence: 0.98,
            needsVerification: false,
            notes: template.notes,
          },
        ],
      });
      return;
    }

    const emptyIndex = scanResult.medications.findIndex((m) => !m.name.trim());
    if (emptyIndex >= 0) {
      const targetId = scanResult.medications[emptyIndex].id;
      applyMedicineTemplate(targetId, template.name);
    } else {
      const newDraft: ExtractedMedicationDraft = {
        id: `quick-${Date.now()}`,
        name: template.name,
        strength: template.defaultStrength,
        dosage: template.dosage,
        frequency: template.frequency,
        timings: template.timings,
        durationDays: template.durationDays,
        instructions: template.instructions,
        prescribedBy: scanResult.doctorName,
        confidence: 0.98,
        needsVerification: false,
        notes: template.notes,
      };
      setScanResult({
        ...scanResult,
        medications: [...scanResult.medications, newDraft],
      });
    }
  };

  // Remove draft item
  const removeDraft = (id: string) => {
    if (!scanResult) return;
    setScanResult({
      ...scanResult,
      medications: scanResult.medications.filter((m) => m.id !== id),
    });
  };

  // Add blank manual draft item
  const addBlankDraft = () => {
    if (!scanResult) return;
    const newDraft: ExtractedMedicationDraft = {
      id: `manual-${Date.now()}`,
      name: '',
      strength: '500 mg',
      dosage: '1 tablet',
      frequency: 'Once daily',
      timings: ['08:00 AM'],
      durationDays: 30,
      instructions: '',
      confidence: 1.0,
      needsVerification: false,
    };
    setScanResult({
      ...scanResult,
      medications: [...scanResult.medications, newDraft],
    });
  };

  // Final confirmation action
  const handleFinalConfirm = () => {
    if (!scanResult || scanResult.medications.length === 0) return;
    confirmPrescriptionDrafts(scanResult.medications, {
      doctorName: scanResult.doctorName,
      clinic: scanResult.clinic,
      prescriptionDate: scanResult.prescriptionDate,
      rawNotes: scanResult.rawNotes,
    });
    setConfirmModalOpen(false);
    setActiveTab('safety'); // Step 4 in demo flow!
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* 1. Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
        <div>
          <h1 className={`font-extrabold text-slate-900 dark:text-white tracking-tight ${elderlyMode ? 'text-3xl' : 'text-2xl sm:text-3xl'}`}>
            Scan Prescription
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            AI-powered optical label and prescription extraction with clinical verification
          </p>
        </div>

        {/* Verification Guardrail Pill */}
        <div className="px-3.5 py-2 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 text-xs text-amber-800 dark:text-amber-300 flex items-center space-x-2 max-w-sm self-start sm:self-auto">
          <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
          <span className="leading-tight">AI data is never silently saved. Always reviewed first.</span>
        </div>
      </div>

      {/* 2. Ready-to-Test Demo Prescriptions Selector */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-sky-600 dark:text-sky-400" />
            <h2 className="font-bold text-slate-900 dark:text-white text-sm">
              Quick Test Prescriptions (1-Click Evaluation)
            </h2>
          </div>
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
            Hackathon Evaluator Quick Pick
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {DEMO_PRESCRIPTIONS.map((sample) => {
            const isSelected = selectedDemoId === sample.id;
            return (
              <div
                key={sample.id}
                onClick={() => {
                  setSelectedDemoId(sample.id);
                  handleStartScan(sample.id);
                }}
                className={`p-4 rounded-xl border cursor-pointer transition text-left flex flex-col justify-between ${
                  isSelected
                    ? 'bg-sky-50/60 dark:bg-sky-950/30 border-sky-500/80 dark:border-sky-500 shadow-2xs ring-1 ring-sky-500/20'
                    : 'bg-slate-50/50 dark:bg-slate-800/40 border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                      {sample.doctor}
                    </span>
                    <span className="text-[10px] font-extrabold text-amber-600 dark:text-amber-400">
                      {sample.scenario}
                    </span>
                  </div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white leading-snug">
                    {sample.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                    {sample.description}
                  </p>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-xs">
                  <span className="text-slate-500 dark:text-slate-400 text-[11px]">Select sample</span>
                  <span className="font-bold text-sky-600 dark:text-sky-400">Scan →</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Drag & Drop / Camera Capture Zone */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* File Upload Box */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-dashed border-slate-300 dark:border-slate-700 hover:border-sky-500 dark:hover:border-sky-400 text-center flex flex-col items-center justify-center space-y-3 transition">
          <div className="w-12 h-12 rounded-xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 flex items-center justify-center">
            <Upload className="w-6 h-6" />
          </div>

          <div className="space-y-0.5">
            <h3 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base">
              Upload Prescription or Bottle Label
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs">
              JPG, PNG, or PDF format supported
            </p>
          </div>

          <label className="cursor-pointer px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white font-semibold text-xs shadow-xs transition active:scale-95">
            <span>Browse Files</span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  const file = e.target.files[0];
                  setSelectedFile(file);
                  handleStartScan(file);
                }
              }}
            />
          </label>
        </div>

        {/* Camera Capture Box */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 text-center flex flex-col items-center justify-center space-y-3 shadow-xs">
          <div className="w-12 h-12 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center">
            <Camera className="w-6 h-6" />
          </div>

          <div className="space-y-0.5">
            <h3 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base">
              Camera Snapshot
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs">
              Capture label directly using camera
            </p>
          </div>

          <label className="cursor-pointer px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs shadow-xs transition active:scale-95 inline-flex items-center space-x-1.5">
            <Camera className="w-3.5 h-3.5" />
            <span>Open Camera / Snap</span>
            <input
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  const file = e.target.files[0];
                  setSelectedFile(file);
                  handleStartScan(file);
                }
              }}
            />
          </label>
        </div>
      </div>

      {/* 3.5 Quick Select Real Medicines Strip */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800 space-y-2.5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
            <h3 className="font-bold text-xs text-slate-900 dark:text-white">
              Instant Medicine Quick-Pick (1-Click Real Prescriptions)
            </h3>
          </div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400">
            Click any authentic medicine to immediately populate real clinical dosages
          </span>
        </div>

        <div className="flex flex-wrap gap-2 pt-1">
          {KNOWN_MEDICINE_DATABASE.slice(0, 10).map((tmpl) => (
            <button
              key={tmpl.name}
              type="button"
              onClick={() => handleQuickPick(tmpl)}
              className="px-2.5 py-1.5 rounded-xl bg-slate-50 hover:bg-teal-50 dark:bg-slate-800 dark:hover:bg-teal-950/40 border border-slate-200/70 dark:border-slate-700 hover:border-teal-400 dark:hover:border-teal-600 text-slate-800 dark:text-slate-200 text-xs font-semibold flex items-center space-x-1.5 transition active:scale-95 cursor-pointer"
            >
              <span>💊</span>
              <span>{tmpl.name.split(' (')[0]}</span>
              <span className="text-[10px] font-normal text-slate-500 dark:text-slate-400">({tmpl.defaultStrength})</span>
            </button>
          ))}
        </div>
      </div>

      {/* 4. Scanning Loader */}
      {isScanning && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 text-center border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
          <Loader2 className="w-8 h-8 text-sky-600 dark:text-sky-400 animate-spin mx-auto" />
          <div className="space-y-0.5">
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              AI Vision Model Extracting Medications...
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Detecting drug entities, dosage strengths, administration frequency, and clinical timings.
            </p>
          </div>
        </div>
      )}

      {/* 5. Extracted Results & Review Cards */}
      {scanResult && !isScanning && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-5 animate-in slide-in-from-bottom-2">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 gap-3">
            <div>
              <div className="flex items-center space-x-2">
                <FileCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <h2 className="font-bold text-base sm:text-lg text-slate-900 dark:text-white">
                  Extracted Medications ({scanResult.medications.length})
                </h2>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Prescribed by <strong>{scanResult.doctorName}</strong> ({scanResult.clinic}) • Date: {scanResult.prescriptionDate}
              </p>
            </div>

            <button
              onClick={addBlankDraft}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-xs transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Another Medicine</span>
            </button>
          </div>

          {/* Cards List */}
          <div className="space-y-3">
            {scanResult.medications.map((draft, idx) => {
              return (
                <div
                  key={draft.id}
                  className={`p-4 rounded-xl border transition ${
                    draft.needsVerification
                      ? 'bg-amber-50/50 dark:bg-amber-950/20 border-amber-300 dark:border-amber-800'
                      : 'bg-slate-50/50 dark:bg-slate-800/40 border-slate-200/80 dark:border-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200/60 dark:border-slate-700/60 mb-3">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-slate-400 dark:text-slate-500 text-xs">#{idx + 1}</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200 text-xs">Medicine Card</span>
                      {draft.needsVerification ? (
                        <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-amber-200 dark:bg-amber-900/60 text-amber-900 dark:text-amber-200 flex items-center space-x-1">
                          <AlertTriangle className="w-3 h-3 text-amber-700 dark:text-amber-400" />
                          <span>Needs verification</span>
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 flex items-center space-x-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                          <span>Confidence: {(draft.confidence * 100).toFixed(0)}%</span>
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => removeDraft(draft.id)}
                      className="p-1 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition"
                      title="Remove"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Form fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">
                        Medicine Name
                      </label>
                      <input
                        type="text"
                        list="known-medicines-list"
                        value={draft.name}
                        onChange={(e) => {
                          updateDraft(draft.id, 'name', e.target.value);
                          applyMedicineTemplate(draft.id, e.target.value);
                        }}
                        placeholder="e.g. Dolo 650, Augmentin, Pan 40..."
                        className="w-full px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-sky-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">
                        Strength
                      </label>
                      <input
                        type="text"
                        value={draft.strength}
                        onChange={(e) => updateDraft(draft.id, 'strength', e.target.value)}
                        placeholder="e.g. 500 mg"
                        className="w-full px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-sky-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">
                        Frequency
                      </label>
                      <input
                        type="text"
                        value={draft.frequency}
                        onChange={(e) => updateDraft(draft.id, 'frequency', e.target.value)}
                        placeholder="e.g. Twice daily"
                        className="w-full px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-sky-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">
                        Duration (Days)
                      </label>
                      <input
                        type="number"
                        value={draft.durationDays}
                        onChange={(e) => updateDraft(draft.id, 'durationDays', parseInt(e.target.value, 10) || 30)}
                        className="w-full px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-sky-500"
                      />
                    </div>

                    <div className="sm:col-span-2 lg:col-span-3">
                      <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">
                        Instructions / Food Advice
                      </label>
                      <input
                        type="text"
                        value={draft.instructions}
                        onChange={(e) => updateDraft(draft.id, 'instructions', e.target.value)}
                        placeholder="e.g. Take with food"
                        className="w-full px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-sky-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">
                        Daily Timing
                      </label>
                      <input
                        type="text"
                        value={draft.timings.join(', ')}
                        onChange={(e) =>
                          updateDraft(
                            draft.id,
                            'timings',
                            e.target.value.split(',').map((s) => s.trim())
                          )
                        }
                        placeholder="08:00 AM, 08:00 PM"
                        className="w-full px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-sky-500"
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Raw OCR Extracted Text Preview */}
          {scanResult.rawNotes && (
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60 text-xs space-y-1">
              <div className="flex items-center space-x-1.5 font-bold text-slate-700 dark:text-slate-300">
                <Eye className="w-3.5 h-3.5 text-sky-500" />
                <span>Raw OCR Extracted Content / Notes:</span>
              </div>
              <p className="font-mono text-[11px] text-slate-600 dark:text-slate-400 whitespace-pre-wrap leading-relaxed line-clamp-3">
                {scanResult.rawNotes}
              </p>
            </div>
          )}

          {/* Confirm Actions */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-xs text-slate-500 dark:text-slate-400">
              Review medications above before saving to timetable
            </div>

            <button
              onClick={() => setConfirmModalOpen(true)}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition active:scale-95 flex items-center justify-center space-x-1.5"
            >
              <CheckCircle2 className="w-4 h-4 text-white" />
              <span>Confirm Medicines ({scanResult.medications.length})</span>
            </button>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {confirmModalOpen && scanResult && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200 dark:border-slate-800 space-y-4 animate-in zoom-in-95">
            <div className="flex items-center space-x-2.5 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-5 h-5" />
              <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">
                Confirm Verified Medicines
              </h3>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300">
              Add <strong>{scanResult.medications.length} medication(s)</strong> to medical profile and timetable.
            </p>

            <div className="bg-slate-50 dark:bg-slate-800/60 rounded-xl p-3 border border-slate-200/80 dark:border-slate-700 max-h-36 overflow-y-auto space-y-1 text-xs">
              {scanResult.medications.map((m) => (
                <div key={m.id} className="flex justify-between py-1 border-b border-slate-200/50 dark:border-slate-700/50 last:border-0">
                  <span className="font-bold text-slate-800 dark:text-slate-200">{m.name}</span>
                  <span className="text-slate-500 dark:text-slate-400">{m.strength} • {m.frequency}</span>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-end space-x-2 pt-2">
              <button
                onClick={() => setConfirmModalOpen(false)}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                onClick={handleFinalConfirm}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs"
              >
                Yes, Save to Profile
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Global Datalist for Medicine Autocomplete */}
      <datalist id="known-medicines-list">
        {KNOWN_MEDICINE_DATABASE.map((m) => (
          <option key={m.name} value={m.name}>
            {m.category} • {m.defaultStrength}
          </option>
        ))}
      </datalist>
    </div>
  );
};
