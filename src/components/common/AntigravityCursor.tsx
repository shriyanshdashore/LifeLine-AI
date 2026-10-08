import React, { useState, useEffect } from 'react';

interface Waypoint {
  x: number; // percentage
  y: number; // percentage
  title: string;
  action: string;
  click?: boolean;
}

const WAYPOINTS: Waypoint[] = [
  {
    x: 24,
    y: 18,
    title: '✦ Antigravity AI',
    action: 'Prescription OCR Verified (3 Active)',
    click: true,
  },
  {
    x: 52,
    y: 46,
    title: '🛡️ Safety Engine',
    action: 'Screening Metformin + Ramipril Interaction...',
    click: true,
  },
  {
    x: 26,
    y: 78,
    title: '💊 Timetable Copilot',
    action: 'Marking 08:00 AM Dose as Confirmed ✓',
    click: true,
  },
  {
    x: 82,
    y: 18,
    title: '🚨 112 Dual Dispatch',
    action: 'Ambulance 112 & Caregiver SOS Armed',
    click: true,
  },
];

export const AntigravityCursor: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isClicking, setIsClicking] = useState(false);
  const [showRipple, setShowRipple] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      // Trigger click animation right before moving to next waypoint
      setIsClicking(true);
      setShowRipple(true);

      const clickTimeout = setTimeout(() => {
        setIsClicking(false);
      }, 350);

      const rippleTimeout = setTimeout(() => {
        setShowRipple(false);
      }, 700);

      // Advance waypoint
      setCurrentStep((prev) => (prev + 1) % WAYPOINTS.length);

      return () => {
        clearTimeout(clickTimeout);
        clearTimeout(rippleTimeout);
      };
    }, 3200);

    return () => clearInterval(interval);
  }, []);

  const point = WAYPOINTS[currentStep];

  return (
    <div
      className="absolute pointer-events-none z-30 transition-all duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] select-none hidden sm:block"
      style={{
        left: `${point.x}%`,
        top: `${point.y}%`,
        transform: `translate(-6px, -6px) scale(${isClicking ? 0.88 : 1})`,
      }}
    >
      {/* Click Ripple Wave */}
      {showRipple && (
        <span
          className="absolute -top-3 -left-3 w-10 h-10 rounded-full border-2 border-cyan-400 bg-cyan-400/20 animate-ripple pointer-events-none"
          aria-hidden="true"
        />
      )}

      {/* Modern Antigravity Vector Cursor Pointer */}
      <svg
        className="w-6 h-6 drop-shadow-md transition-transform duration-200"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M4.5 3L11.5 21L14.5 14L21.5 11.5L4.5 3Z"
          className="fill-slate-900 dark:fill-cyan-400 stroke-white dark:stroke-slate-950 stroke-[1.8]"
          strokeLinejoin="round"
        />
      </svg>

      {/* Floating Agent Badge */}
      <div className="absolute left-5 top-4 whitespace-nowrap space-y-1">
        <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-slate-900/90 dark:bg-slate-950/95 backdrop-blur-md text-white border border-slate-700/80 dark:border-cyan-500/40 shadow-xl">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
          <span className="text-[11px] font-bold text-cyan-300 tracking-wide">
            {point.title}
          </span>
        </div>

        {/* Action description pill */}
        <div className="px-2 py-0.5 rounded-md bg-white/95 dark:bg-slate-900/95 backdrop-blur-md text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-800 text-[10px] font-semibold shadow-md max-w-xs truncate animate-in fade-in duration-300">
          {point.action}
        </div>
      </div>
    </div>
  );
};
