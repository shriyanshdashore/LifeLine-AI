import React, { useState, useEffect } from 'react';

export const TypewriterHeadline: React.FC = () => {
  const phrase1 = 'Right Medicine.';
  const phrase2 = ' Right Time.';
  const phrase3 = ' Right Help.';

  const fullText = phrase1 + phrase2 + phrase3;
  const [displayedCount, setDisplayedCount] = useState(0);

  useEffect(() => {
    if (displayedCount < fullText.length) {
      const timeout = setTimeout(() => {
        setDisplayedCount((prev) => prev + 1);
      }, 48); // Smooth natural typing pace
      return () => clearTimeout(timeout);
    }
  }, [displayedCount, fullText.length]);

  // Derive the 3 parts from current typed character count
  const p1Len = phrase1.length;
  const p2Len = phrase2.length;

  const part1 = fullText.slice(0, Math.min(displayedCount, p1Len));
  const part2 = displayedCount > p1Len
    ? fullText.slice(p1Len, Math.min(displayedCount, p1Len + p2Len))
    : '';
  const part3 = displayedCount > p1Len + p2Len
    ? fullText.slice(p1Len + p2Len, displayedCount)
    : '';

  return (
    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.14] select-none min-h-[1.25em]">
      <span>{part1}</span>
      {part2 && (
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 via-teal-500 to-indigo-600 dark:from-sky-400 dark:via-teal-300 dark:to-indigo-400 transition-all duration-150">
          {part2}
        </span>
      )}
      {part3 && (
        <span className="text-slate-900 dark:text-white transition-all duration-150">
          {part3}
        </span>
      )}
      {/* Blinking Typewriter Caret */}
      <span
        className="inline-block w-[3.5px] h-[0.8em] bg-sky-500 dark:bg-cyan-400 ml-1.5 align-middle rounded-full animate-caret shadow-[0_0_8px_rgba(6,182,212,0.6)]"
        aria-hidden="true"
      />
    </h1>
  );
};
