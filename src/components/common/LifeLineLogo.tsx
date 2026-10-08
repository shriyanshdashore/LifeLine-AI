import React from 'react';
import { Activity, Heart } from 'lucide-react';

interface LifeLineLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  textColor?: string;
  className?: string;
}

export const LifeLineLogo: React.FC<LifeLineLogoProps> = ({
  size = 'md',
  showText = true,
  textColor,
  className = '',
}) => {
  const badgeSize =
    size === 'sm'
      ? 'w-9 h-9'
      : size === 'lg'
      ? 'w-14 h-14'
      : 'w-11 h-11 sm:w-12 sm:h-12';

  const titleSize =
    size === 'sm'
      ? 'text-base font-extrabold'
      : size === 'lg'
      ? 'text-2xl sm:text-3xl font-black'
      : 'text-lg sm:text-2xl font-black';

  return (
    <div className={`flex items-center space-x-3 select-none ${className}`}>
      {/* Animated Emblem Badge */}
      <div className="relative flex items-center justify-center shrink-0">
        {/* Concentric Sonar Pulse Wave Ring */}
        <div className="absolute inset-0 rounded-2xl bg-teal-400/30 dark:bg-cyan-400/25 animate-sonar-ring pointer-events-none" />

        {/* Heartbeat Badge */}
        <div
          className={`${badgeSize} rounded-2xl bg-gradient-to-tr from-sky-600 via-teal-500 to-emerald-400 p-[1.5px] shadow-lg shadow-sky-500/25 dark:shadow-cyan-500/30 animate-heartbeat transition-transform duration-300 relative z-10 flex items-center justify-center`}
        >
          <div className="w-full h-full bg-slate-950/20 backdrop-blur-xs rounded-[14px] flex items-center justify-center relative overflow-hidden">
            {/* Background Medical Heart Glow */}
            <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-white/30 absolute fill-white/20" />

            {/* Live Animated ECG Rhythm Line */}
            <svg
              viewBox="0 0 36 24"
              className="w-7 h-5 sm:w-8 sm:h-6 relative z-10 text-white"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {/* Ghost background track */}
              <path
                d="M1 12h7l3-7 4 14 3-10 3 6 3-3h11"
                className="opacity-25"
                strokeWidth="2"
              />
              {/* Animated Glowing ECG Stroke */}
              <path
                d="M1 12h7l3-7 4 14 3-10 3 6 3-3h11"
                className="animate-ecg-flow text-cyan-200 drop-shadow-[0_0_4px_#38bdf8]"
                strokeWidth="2.5"
              />
            </svg>

            {/* Glowing Corner Life Cross */}
            <span className="absolute top-1 right-1 text-[9px] font-black text-emerald-300 leading-none">
              +
            </span>
          </div>
        </div>
      </div>

      {/* Brand Typography */}
      {showText && (
        <div className="leading-tight">
          <div className="flex items-center space-x-1.5">
            <span className={`${titleSize} tracking-tight ${textColor || 'text-slate-900 dark:text-white'}`}>
              LifeLine
            </span>
            <span className={`${titleSize} tracking-tight text-sky-600 dark:text-cyan-400 drop-shadow-xs`}>
              AI
            </span>
            {/* Real-time Heartbeat Monitor Beacon */}
            <span className="relative flex h-2 w-2 ml-1">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-cyan-400/80 font-medium hidden sm:block">
            Prescription Safety & Emergency Companion
          </p>
        </div>
      )}
    </div>
  );
};
