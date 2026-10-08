# LifeLine AI 🛡️
> **Right Medicine. Right Time. Right Help.**  
> *AI-Powered Medication Safety & Emergency Assistance Platform for Patients and Caregivers.*  
> **Problem Statement:** PS6 — Platform for Patient Prescription Safety Verification

---

## 🌟 Product Overview

LifeLine AI is a production-quality healthcare SaaS platform designed for elderly patients, polypharmacy users, and caregivers. Built with an accessible, high-contrast design system, LifeLine AI bridges the gap between complex doctor prescriptions, daily medication adherence, and life-saving emergency response.

### Core Workflow
```
SCAN → UNDERSTAND → SAFETY CHECK → SCHEDULE → REMIND → TRACK → ESCALATE → EMERGENCY
```

---

## ✨ Key Features & Highlights

### 1. 📷 Optical Prescription Scanner & AI Extraction
* **Multi-Input**: Drag-and-drop file upload, camera snapshot simulation, and **1-click pre-loaded demo prescriptions** for hackathon evaluation.
* **Structured JSON Extraction**: Captures Medicine Name, Strength, Dosage, Frequency, Daily Timings, Duration, and Food Advice.
* **Confidence Scoring**: Flags OCR uncertainty with a prominent **"Needs verification"** badge.
* **Strict Verification Guardrail**: Extracted information is presented in editable review cards. AI-generated medicines are **never silently added** to the patient profile.

### 2. 🛡️ Medication Safety Engine (PS6 Core)
* **Clinical Verification**: Evaluates combinations using a trusted clinical interaction dataset based on NLM / RxNorm standards.
* **Clear Severity Badging**:
  * 🟢 **No major warning found**
  * 🟡 **Potential interaction / synergy**
  * 🔴 **Important warning to review**
* **Plain-Language Explanations**: Details clinical mechanisms in simple terms alongside user-provided allergen cross-checks.
* **Mandatory Medical Disclaimer**: Prominently advises users to verify all findings with their prescribing doctor or pharmacist before modifying medication.

### 3. ⏰ Today's Schedule & Missed Dose Escalation
* Converts verified prescriptions into scheduled morning, afternoon, and evening slots.
* Interactive status controls: `✓ Mark as Taken`, `Skip`, and `Remind Later (15m)`.
* **Escalation Protocol**: Unconfirmed doses trigger an overdue alert with a **"Notify Caregiver"** speed dispatch button.
* Includes a **"Simulate Reminder Notification"** button for immediate judge testing of in-app and browser notifications.

### 4. 🔄 Prescription Change Detector
* Compares previous clinical visits (e.g. Prescription #2 vs Prescription #3).
* Generates clear visual diffs:
  * 🟢 **Continued**
  * 🆕 **Added**
  * 🔴 **Removed / Discontinued**
  * ⚠️ **Changed** (Dosage / frequency adjusted)

### 5. 🚨 PANIC Mode & Emergency Assistance
* Distinct, high-visibility red PANIC button with intentional confirmation to avoid accidental calls.
* **Four Immediate Pathways**:
  1. **CALL EMERGENCY SERVICES**: Direct native dial to **112** (Default for India, customizable in Settings).
  2. **CALL EMERGENCY CONTACT**: One-tap speed dial to primary guardian (Amit Sharma - Son).
  3. **OPEN EMERGENCY HEALTH BRIEF**: Responder-ready summary.
  4. **FIRST-AID GUIDANCE**: Life-saving triage steps.

### 6. 📋 Emergency Health Brief & Offline Health Card
* Clean, high-contrast emergency screen designed for paramedics.
* Explicitly separates **User-Provided Information** (Allergies: Penicillin, Chronic Conditions: Diabetes, Hypertension) from **AI-Extracted Data**.
* Shows blood group (B+), active medications, last confirmed dose time (08:05 AM), and GPS coordinates with explicit consent toggle.
* Features: Web Share API, Paramedic QR code modal, and printable brief.
* **100% Offline Capability**: Cached in LocalStorage for zero-network situations.

### 7. 🩹 First-Aid Guidance
* Action protocols for: Unconscious, Heart Attack, Difficulty Breathing, Severe Bleeding, Choking, and Seizures.
* Critical dispatcher disclaimers: Emphasizes that AI is not a substitute for 112 emergency dispatchers or trained medical professionals.

### 8. 🎙️ LifeLine Voice Assistant (English / Hindi / Hinglish)
* Web Speech API integration (`SpeechRecognition` + `speechSynthesis`) with conversational parsing.
* Natural queries:
  * *"meri next medicine kab hai?"* → Speaks next upcoming dose.
  * *"Medicine le li"* → Automatically marks dose as Taken and updates dashboard in real time!
  * *"Safety alerts kya hain?"* → Outlines active drug interactions.
* Includes one-tap quick voice buttons for testing without a microphone.

### 9. 👨‍👩‍👦 Caregiver Mode & Safety Circle
* Family circle view for Amit Sharma (Son) and Priya Sharma (Daughter).
* Live patient telemetry breakdown (Morning ✅ Taken, Afternoon ✅ Taken, Night ⏳ Pending).
* Audit log tracking automated escalations.

### 10. 🎯 10-Step Guided Demo Tour
* Built-in tour guide bar in the top navigation allowing hackathon judges to step through the entire product story in 2–3 minutes:
  `Dashboard → Scan → Verify → Safety → Timeline → Reminder → Change Detector → Panic → Emergency Brief → Speed Dial`.

---

## 🚀 Running the Application

### Prerequisites
* Node.js v18+ (Node.js v24 LTS installed)

### Development Server
```bash
# Navigate to the project directory
cd "C:\Users\shriy\.gemini\antigravity\scratch\lifeline-ai"

# Start the Vite development server
npm run dev
```
Open **[http://127.0.0.1:5173](http://127.0.0.1:5173)** in your browser.

### Production Build
```bash
npm run build
```

---

## 🔒 Security, Ethics & Medical Disclaimers
* **Healthcare Support Product**: LifeLine AI is an assistive verification tool and does not provide medical diagnoses or replace a physician.
* **No Medical Assumptions**: The app never instructs users to independently start or stop prescribed medicines.
* **Data Privacy**: Pre-populated demo uses fictional patient "Raj Sharma" (68). Sensitive data is stored locally and securely.
