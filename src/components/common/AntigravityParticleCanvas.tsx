import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  baseVx: number;
  baseVy: number;
  radius: number;
  color: string;
  alpha: number;
}

interface Spark {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  life: number;
  maxLife: number;
}

interface AntigravityParticleCanvasProps {
  darkMode?: boolean;
  subtle?: boolean;
}

export const AntigravityParticleCanvas: React.FC<AntigravityParticleCanvasProps> = ({
  darkMode = false,
  subtle = false,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef<{ x: number; y: number; active: boolean; lastX: number; lastY: number }>({
    x: -1000,
    y: -1000,
    active: false,
    lastX: -1000,
    lastY: -1000,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.parentElement?.clientWidth || window.innerWidth;
      height = canvas.parentElement?.clientHeight || window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr, dpr);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    // Particle Palette
    const darkPalette = [
      '#06b6d4', // cyan-500
      '#38bdf8', // sky-400
      '#10b981', // emerald-500
      '#a855f7', // purple-500
      '#60a5fa', // blue-400
    ];

    const lightPalette = [
      '#0284c7', // sky-600
      '#0d9488', // teal-600
      '#4f46e5', // indigo-600
      '#059669', // emerald-600
      '#2563eb', // blue-600
    ];

    const palette = darkMode ? darkPalette : lightPalette;

    // Initialize floating anti-gravity particles
    const particleCount = subtle
      ? Math.min(Math.floor((width * height) / 36000), 24)
      : Math.min(Math.floor((width * height) / 14000), 75);
    const particles: Particle[] = [];

    for (let i = 0; i < particleCount; i++) {
      const radius = subtle ? Math.random() * 1.5 + 1.0 : Math.random() * 2.2 + 1.2;
      const baseVx = subtle ? (Math.random() - 0.5) * 0.25 : (Math.random() - 0.5) * 0.45;
      const baseVy = subtle
        ? -(Math.random() * 0.25 + 0.08)
        : -(Math.random() * 0.5 + 0.15); // Naturally drifts upward (anti-gravity float!)
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: baseVx,
        vy: baseVy,
        baseVx,
        baseVy,
        radius,
        color: palette[Math.floor(Math.random() * palette.length)],
        alpha: subtle ? Math.random() * 0.25 + 0.18 : Math.random() * 0.5 + 0.35,
      });
    }

    // Trailing sparks emitted on mouse move
    const sparks: Spark[] = [];

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const currentX = e.clientX - rect.left;
      const currentY = e.clientY - rect.top;

      // Calculate speed
      const dx = currentX - mouseRef.current.lastX;
      const dy = currentY - mouseRef.current.lastY;
      const speed = Math.hypot(dx, dy);

      mouseRef.current.x = currentX;
      mouseRef.current.y = currentY;
      mouseRef.current.active = true;
      mouseRef.current.lastX = currentX;
      mouseRef.current.lastY = currentY;

      // Spawn stardust sparks when moving cursor (toned down in subtle mode)
      if (!subtle && speed > 3 && sparks.length < 60) {
        const count = Math.min(Math.floor(speed / 8), 3);
        for (let k = 0; k < count; k++) {
          const angle = Math.random() * Math.PI * 2;
          const sparkSpeed = Math.random() * 1.5 + 0.5;
          sparks.push({
            x: currentX + (Math.random() - 0.5) * 8,
            y: currentY + (Math.random() - 0.5) * 8,
            vx: Math.cos(angle) * sparkSpeed - dx * 0.1,
            vy: Math.sin(angle) * sparkSpeed - dy * 0.1,
            size: Math.random() * 2.5 + 1.5,
            color: palette[Math.floor(Math.random() * palette.length)],
            alpha: 0.9,
            life: 0,
            maxLife: Math.random() * 25 + 20,
          });
        }
      }
    };

    const handleMouseLeave = () => {
      mouseRef.current.active = false;
      mouseRef.current.x = -1000;
      mouseRef.current.y = -1000;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    // Animation Loop
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const mouseX = mouseRef.current.x;
      const mouseY = mouseRef.current.y;
      const isMouseActive = mouseRef.current.active;
      const repulsionRadius = subtle ? 110 : 150;
      const maxConnectDistance = subtle ? 85 : 110;

      // 1. Draw connecting lines between particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.hypot(dx, dy);

          if (dist < maxConnectDistance) {
            const lineAlpha = (1 - dist / maxConnectDistance) * (darkMode ? (subtle ? 0.12 : 0.2) : (subtle ? 0.08 : 0.12));
            ctx.strokeStyle = darkMode
              ? `rgba(56, 189, 248, ${lineAlpha})`
              : `rgba(2, 132, 199, ${lineAlpha})`;
            ctx.lineWidth = subtle ? 0.6 : 0.8;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // 2. Update and draw anti-gravity particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // MOUSE INTERACTION (ANTI-GRAVITY REPULSION FORCE)
        if (isMouseActive) {
          const dx = p.x - mouseX;
          const dy = p.y - mouseY;
          const dist = Math.hypot(dx, dy);

          if (dist < repulsionRadius && dist > 0) {
            // Stronger push closer to cursor, smoothly falling off
            const force = (1 - dist / repulsionRadius) * (subtle ? 2.2 : 4.2);
            const angle = Math.atan2(dy, dx);
            p.vx += Math.cos(angle) * force;
            p.vy += Math.sin(angle) * force;

            // Draw glowing interactive tether line from cursor to particle!
            const tetherAlpha = (1 - dist / repulsionRadius) * (darkMode ? (subtle ? 0.25 : 0.45) : (subtle ? 0.14 : 0.25));
            ctx.strokeStyle = darkMode
              ? `rgba(6, 182, 212, ${tetherAlpha})`
              : `rgba(14, 165, 233, ${tetherAlpha})`;
            ctx.lineWidth = subtle ? 0.9 : 1.2;
            ctx.beginPath();
            ctx.moveTo(mouseX, mouseY);
            ctx.lineTo(p.x, p.y);
            ctx.stroke();
          }
        }

        // Return velocity smoothly toward natural ambient float (dampening)
        p.vx += (p.baseVx - p.vx) * 0.05;
        p.vy += (p.baseVy - p.vy) * 0.05;

        // Move particle
        p.x += p.vx;
        p.y += p.vy;

        // Boundary wrap-around (drift upward out of top, re-enter at bottom)
        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        } else if (p.y > height + 10) {
          p.y = -10;
          p.x = Math.random() * width;
        }
        if (p.x < -10) {
          p.x = width + 10;
        } else if (p.x > width + 10) {
          p.x = -10;
        }

        // Draw particle node
        ctx.save();
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        if (darkMode) {
          ctx.shadowBlur = 8;
          ctx.shadowColor = p.color;
        }
        ctx.fill();
        ctx.restore();
      }

      // 3. Update and draw trailing cursor stardust sparks
      for (let s = sparks.length - 1; s >= 0; s--) {
        const spark = sparks[s];
        spark.x += spark.vx;
        spark.y += spark.vy;
        spark.vx *= 0.94;
        spark.vy *= 0.94;
        spark.life++;

        const progress = spark.life / spark.maxLife;
        const currentAlpha = (1 - progress) * spark.alpha;

        if (progress >= 1) {
          sparks.splice(s, 1);
          continue;
        }

        ctx.save();
        ctx.beginPath();
        ctx.arc(spark.x, spark.y, spark.size * (1 - progress * 0.5), 0, Math.PI * 2);
        ctx.fillStyle = spark.color;
        ctx.globalAlpha = Math.max(0, currentAlpha);
        if (darkMode) {
          ctx.shadowBlur = 10;
          ctx.shadowColor = spark.color;
        }
        ctx.fill();
        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [darkMode, subtle]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-10 w-full h-full"
      aria-hidden="true"
    />
  );
};
