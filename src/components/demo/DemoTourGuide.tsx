import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Sparkles,
  ChevronRight,
  ChevronLeft,
  X,
  CheckCircle2,
  Info,
} from 'lucide-react';

export const DemoTourGuide: React.FC = () => {
  const {
    demoWalkthroughStep,
    setDemoWalkthroughStep,
    nextDemoStep,
    prevDemoStep,
    resetDemoData,
  } = useApp();

  if (demoWalkthroughStep === null) return null;

  const stepsInfo: { [key: number]: { title: string; desc: string; targetAction: string } } = {
    1: {
      title: 'Step 1: Dashboard Overview',
      desc: 'Notice Raj Sharma (68 yrs). Today’s medication shows 2/3 completed, 1 active safety alert, and primary action cards.',
      targetAction: 'Review the high-contrast dashboard metrics and progress ring.',
    },
    2: {
      title: 'Step 2: AI Prescription Scanner',
      desc: 'We are on the Scan page. Select any of the 3 realistic demo prescriptions or upload a custom image. AI extracts structured dosage & frequency.',
      targetAction: 'Click "Load Demo Sample" to run AI OCR extraction.',
    },
    3: {
      title: 'Step 3: Verify & Confirm Medicines',
      desc: 'Extracted results appear in editable cards. If confidence is low, "Needs verification" is flagged. AI never silently saves.',
      targetAction: 'Review fields and click "Confirm & Add Medicines".',
    },
    4: {
      title: 'Step 4: Medication Safety Engine',
      desc: 'The clinical safety engine scans for drug-drug interactions and user allergies. Notice the 🟡 Moderate synergy warning with plain-language rationale.',
      targetAction: 'Notice the clear medical disclaimer: "Verify with doctor/pharmacist".',
    },
    5: {
      title: 'Step 5: Daily Schedule Timeline',
      desc: 'Confirmed prescriptions automatically generate scheduled daily slots: Morning (08:00 AM), Afternoon, and Night.',
      targetAction: 'View the timeline status chips and upcoming doses.',
    },
    6: {
      title: 'Step 6: Dose Tracking & Notifications',
      desc: 'Simulate or mark a dose as "Taken". Notice real-time adherence updates, confetti feedback, and in-app notifications.',
      targetAction: 'Click "✓ Mark as Taken" on an upcoming dose.',
    },
    7: {
      title: 'Step 7: Prescription Change Detector',
      desc: 'Compare old vs new prescriptions side-by-side. Highlights: 🟢 Continued, 🆕 Added, 🔴 Removed, and ⚠️ Changed dosages.',
      targetAction: 'Inspect the diff breakdown showing exact dosage adjustments.',
    },
    8: {
      title: 'Step 8: High-Visibility PANIC Mode',
      desc: 'Tap the prominent red 🚨 PANIC button. An intentional confirmation sheet prevents accidental 911/112 dials.',
      targetAction: 'Review the 4 core emergency triage pathways.',
    },
    9: {
      title: 'Step 9: Emergency Health Brief',
      desc: 'High-contrast summary for paramedics: Allergies, current medicines, blood group B+, GPS location, and offline card capability.',
      targetAction: 'Review the instant QR code and shareable emergency brief.',
    },
    10: {
      title: 'Step 10: Speed Dialing & Dispatch Assistance',
      desc: 'One-tap direct calling to 112 emergency services and primary contact (Son Amit Sharma) using native telephony.',
      targetAction: 'Congratulations! You completed the full 10-step hackathon demo flow.',
    },
  };

  const currentInfo = stepsInfo[demoWalkthroughStep] || stepsInfo[1];

  return (
    <aside
      aria-label="Demo walkthrough guide"
      className="fixed bottom-16 md:bottom-6 right-4 sm:right-6 z-50 max-w-sm sm:max-w-md w-full bg-slate-900 text-white rounded-2xl shadow-2xl border-2 border-sky-400 p-4 sm:p-5 animate-in slide-in-from-bottom-5"
    >
      <div className="flex items-center justify-between pb-3 border-b border-slate-700">
        <div className="flex items-center space-x-2">
          <div className="p-1 rounded-lg bg-sky-500/20 text-sky-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-sky-400">
            Demo Walkthrough • {demoWalkthroughStep} / 10
          </span>
        </div>
        <button
          onClick={() => setDemoWalkthroughStep(null)}
          className="text-slate-400 hover:text-white transition"
          aria-label="Close demo walkthrough"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="py-3 space-y-1.5">
        <h3 className="font-extrabold text-base sm:text-lg text-white">
          {currentInfo.title}
        </h3>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          {currentInfo.desc}
        </p>
        <div className="flex items-center space-x-1.5 text-xs text-sky-300 font-semibold pt-1">
          <Info className="w-3.5 h-3.5 shrink-0" />
          <span>{currentInfo.targetAction}</span>
        </div>
      </div>

      {/* Progress Dots */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-800">
        <div className="flex space-x-1">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((step) => (
            <button
              key={step}
              onClick={() => {
                // Navigate directly to that step
                if (step === 1) prevDemoStep();
                else nextDemoStep();
              }}
              className={`w-2 h-2 rounded-full transition ${
                step === demoWalkthroughStep
                  ? 'bg-sky-400 scale-125'
                  : step < demoWalkthroughStep
                  ? 'bg-emerald-400'
                  : 'bg-slate-700'
              }`}
            />
          ))}
        </div>

        <div className="flex items-center space-x-2">
          {demoWalkthroughStep > 1 && (
            <button
              onClick={prevDemoStep}
              className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center space-x-1 transition"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          )}

          <button
            onClick={nextDemoStep}
            className="px-3 py-1.5 rounded-lg text-xs font-bold bg-sky-500 hover:bg-sky-400 text-slate-950 flex items-center space-x-1 transition shadow-sm"
          >
            <span>{demoWalkthroughStep === 10 ? 'Finish Tour' : 'Next Step'}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
};
