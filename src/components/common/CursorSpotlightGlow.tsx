import React, { useEffect, useState } from 'react';

interface CursorSpotlightGlowProps {
  darkMode?: boolean;
  subtle?: boolean;
}

export const CursorSpotlightGlow: React.FC<CursorSpotlightGlowProps> = ({
  darkMode = false,
  subtle = false,
}) => {
  const [mousePos, setMousePos] = useState<{ x: number; y: number; visible: boolean }>({
    x: -1000,
    y: -1000,
    visible: false,
  });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: e.clientX,
        y: e.clientY + window.scrollY,
        visible: true,
      });
    };

    const handleMouseLeave = () => {
      setMousePos((prev) => ({ ...prev, visible: false }));
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  if (!mousePos.visible) return null;

  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden transition-opacity duration-500"
      style={{
        opacity: mousePos.visible ? (subtle ? 0.7 : 1) : 0,
      }}
      aria-hidden="true"
    >
      {/* 1. Dynamic Cursor Spotlight (Follows mouse cursor smoothly) */}
      <div
        className="absolute inset-0 transition-all duration-75 ease-out"
        style={{
          background: subtle
            ? darkMode
              ? `radial-gradient(420px circle at ${mousePos.x}px ${mousePos.y}px, rgba(6, 182, 212, 0.07), rgba(14, 165, 233, 0.02) 40%, transparent 70%)`
              : `radial-gradient(380px circle at ${mousePos.x}px ${mousePos.y}px, rgba(14, 165, 233, 0.05), rgba(99, 102, 241, 0.02) 35%, transparent 65%)`
            : darkMode
            ? `radial-gradient(650px circle at ${mousePos.x}px ${mousePos.y}px, rgba(6, 182, 212, 0.12), rgba(14, 165, 233, 0.05) 45%, transparent 75%)`
            : `radial-gradient(550px circle at ${mousePos.x}px ${mousePos.y}px, rgba(14, 165, 233, 0.09), rgba(99, 102, 241, 0.04) 40%, transparent 70%)`,
        }}
      />

      {/* 2. Interactive Dot Matrix Grid illuminated by the cursor */}
      <div
        className={`absolute inset-0 transition-opacity duration-200 ${
          subtle ? 'opacity-20 dark:opacity-15' : 'opacity-40 dark:opacity-30'
        }`}
        style={{
          backgroundImage: darkMode
            ? 'radial-gradient(rgba(56, 189, 248, 0.25) 1px, transparent 1px)'
            : 'radial-gradient(rgba(100, 116, 139, 0.22) 1px, transparent 1px)',
          backgroundSize: subtle ? '32px 32px' : '28px 28px',
          maskImage: `radial-gradient(${subtle ? 280 : 400}px circle at ${mousePos.x}px ${mousePos.y}px, black 25%, transparent 80%)`,
          WebkitMaskImage: `radial-gradient(${subtle ? 280 : 400}px circle at ${mousePos.x}px ${mousePos.y}px, black 25%, transparent 80%)`,
        }}
      />
    </div>
  );
};
