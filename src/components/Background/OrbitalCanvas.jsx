import React, { useEffect, useRef } from 'react';

/**
 * OrbitalCanvas
 * Renders quiet, architectural orbital circles, intersecting arcs, reticles,
 * and micro-particles that subtly react to mouse parallax and scroll velocity.
 */
export default function OrbitalCanvas({ velocity = 0, mousePos = { normX: 0, normY: 0 } }) {
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const velocityRef = useRef(velocity);
  const mouseRef = useRef(mousePos);

  velocityRef.current = velocity;
  mouseRef.current = mousePos;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let width = window.innerWidth;
    let height = window.innerHeight;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    // Micro-particles setup (controlled count: 45 particles)
    const particleCount = width < 768 ? 20 : 45;
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.18,
      vy: (Math.random() - 0.5) * 0.18,
      radius: Math.random() * 1.2 + 0.6,
      baseAlpha: Math.random() * 0.25 + 0.1,
    }));

    let baseAngle = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Check current theme colors
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      const bronzeColor = isDark ? 'rgba(201, 162, 39, ' : 'rgba(122, 91, 16, ';
      const darkColor = isDark ? 'rgba(244, 232, 193, ' : 'rgba(22, 19, 13, ';

      const currentVel = velocityRef.current;
      const targetMouse = mouseRef.current;

      // Parallax center
      const centerX = width * 0.5 + (prefersReducedMotion ? 0 : targetMouse.normX * 22);
      const centerY = height * 0.5 + (prefersReducedMotion ? 0 : targetMouse.normY * 22);

      // Slow rotation increment
      if (!prefersReducedMotion) {
        baseAngle += 0.0006 + currentVel * 0.002;
      }

      // 1. Draw Subtle Concentric Orbital Rings
      const ringRadii = [
        Math.min(width, height) * 0.22,
        Math.min(width, height) * 0.36,
        Math.min(width, height) * 0.48,
      ];

      ctx.save();
      ctx.lineWidth = 0.75;

      ringRadii.forEach((radius, idx) => {
        const ringAlpha = (0.08 + idx * 0.03 + currentVel * 0.08).toFixed(3);
        ctx.strokeStyle = `${bronzeColor}${ringAlpha})`;

        // Main circle
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.stroke();

        // Intersecting orbital arc fragments with micro ticks
        const arcStart = baseAngle * (idx % 2 === 0 ? 1 : -1) + (idx * Math.PI) / 3;
        const arcEnd = arcStart + Math.PI * 0.35;

        ctx.strokeStyle = `${bronzeColor}${(parseFloat(ringAlpha) * 1.8).toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, arcStart, arcEnd);
        ctx.stroke();

        // Micro ticks on outer ring
        if (idx === 1) {
          const tickCount = 12;
          for (let i = 0; i < tickCount; i++) {
            const angle = (i * Math.PI * 2) / tickCount + baseAngle * 0.5;
            const x1 = centerX + Math.cos(angle) * (radius - 3);
            const y1 = centerY + Math.sin(angle) * (radius - 3);
            const x2 = centerX + Math.cos(angle) * (radius + 3);
            const y2 = centerY + Math.sin(angle) * (radius + 3);

            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();
          }
        }
      });

      // 2. Central Subtle Reticle
      ctx.strokeStyle = `${bronzeColor}${(0.12 + currentVel * 0.05).toFixed(3)})`;
      ctx.beginPath();
      ctx.moveTo(centerX - 16, centerY);
      ctx.lineTo(centerX + 16, centerY);
      ctx.moveTo(centerX, centerY - 16);
      ctx.lineTo(centerX, centerY + 16);
      ctx.stroke();

      ctx.restore();

      // 3. Render Architectural Micro-Particles & Transient Connections
      ctx.save();
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        if (!prefersReducedMotion) {
          p.x += p.vx + (currentVel > 0 ? (Math.random() - 0.5) * currentVel * 0.8 : 0);
          p.y += p.vy - currentVel * 1.2; // Gentle upward drift with scroll momentum

          if (p.x < 0) p.x = width;
          if (p.x > width) p.x = 0;
          if (p.y < 0) p.y = height;
          if (p.y > height) p.y = 0;
        }

        // Draw particle
        const pAlpha = (p.baseAlpha * (1 + currentVel * 0.6)).toFixed(3);
        ctx.fillStyle = `${darkColor}${pAlpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();

        // Faint connecting lines between close neighbors
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const distSq = dx * dx + dy * dy;

          if (distSq < 7000) { // ~83px
            const lineAlpha = (0.07 * (1 - Math.sqrt(distSq) / 84)).toFixed(3);
            ctx.strokeStyle = `${bronzeColor}${lineAlpha})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }
      ctx.restore();

      animRef.current = requestAnimationFrame(render);
    };

    animRef.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 'var(--z-canvas)',
      }}
      aria-hidden="true"
    />
  );
}
