import React, { useEffect, useRef } from 'react';
import { SectionId } from '../utils/useSectionObserver';

export interface BackgroundSystemProps {
  activeSection: SectionId;
  sectionProgressRef?: React.MutableRefObject<number>;
}

// Particle data structure for HOME section
interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
}

// Node structure for SERVICES, STACK, NETWORK sections
interface SystemNode {
  homeX: number; // Normalized 0..1
  homeY: number; // Normalized 0..1
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  seed: number;
}

// Pulse data structure for network/line transmission
interface Pulse {
  sourceIndex: number;
  targetIndex: number;
  progress: number;
  speed: number;
  color: string;
}

// Architectural frame for WORK section
interface BlueprintFrame {
  relX: number;
  relY: number;
  relW: number;
  relH: number;
  depth: number;
  label: string;
}

export const BackgroundSystem: React.FC<BackgroundSystemProps> = ({
  activeSection,
  sectionProgressRef,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const activeSectionRef = useRef<SectionId>(activeSection);

  useEffect(() => {
    activeSectionRef.current = activeSection;
  }, [activeSection]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    let animationFrameId: number;
    let width = window.innerWidth;
    let height = window.innerHeight;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    let isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let isMobile = width < 768;
    let isTablet = width >= 768 && width < 1024;
    const isLowEndDevice =
      typeof navigator !== 'undefined' &&
      (((navigator.hardwareConcurrency || 4) <= 4) ||
        ((navigator as any).deviceMemory && (navigator as any).deviceMemory <= 4) ||
        isMobile);

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleMotionChange = (e: MediaQueryListEvent) => {
      isReducedMotion = e.matches;
    };
    mediaQuery.addEventListener('change', handleMotionChange);

    // Mouse coordinates (interpolated lerp system)
    const targetMouse = { x: width * 0.5, y: height * 0.35, isInside: false };
    const currentMouse = { x: width * 0.5, y: height * 0.35 };

    const handlePointerMove = (e: PointerEvent) => {
      if (isMobile) return;
      targetMouse.x = e.clientX;
      targetMouse.y = e.clientY;
      targetMouse.isInside = true;
    };

    const handlePointerLeave = () => {
      targetMouse.isInside = false;
    };

    if (!isMobile) {
      window.addEventListener('pointermove', handlePointerMove, { passive: true });
      window.addEventListener('pointerleave', handlePointerLeave, { passive: true });
    }

    let cachedAmbientGrad: CanvasGradient | null = null;
    let cachedGradPulse = -1;

    // Handle resize
    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      isMobile = width < 768;
      isTablet = width >= 768 && width < 1024;
      // On mobile / low-end devices, clamp DPR to 1 to reduce pixel fill rate by 4x and avoid GPU lag
      dpr = isMobile || isLowEndDevice ? 1 : Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
      cachedAmbientGrad = null;
    };

    handleResize();
    window.addEventListener('resize', handleResize, { passive: true });

    // Pre-allocated data structures to prevent GC churn & memory allocations
    const particleCount = isMobile ? 6 : isTablet ? 10 : 16;
    const particles: Particle[] = Array.from({ length: 24 }, (_, i) => ({
      x: (Math.sin(i * 99) * 0.5 + 0.5) * width,
      y: (Math.cos(i * 77) * 0.5 + 0.5) * height,
      vx: (Math.sin(i * 13) * 0.15 + 0.05) * 0.8,
      vy: -(Math.abs(Math.cos(i * 17)) * 0.2 + 0.08),
      size: (i % 3 === 0 ? 1.5 : 1),
      alpha: 0.15 + (i % 5) * 0.04,
    }));

    // Pre-allocated structured nodes
    const maxNodes = isMobile ? 12 : 32;
    const nodes: SystemNode[] = Array.from({ length: 36 }, (_, i) => {
      const col = i % 6;
      const row = Math.floor(i / 6);
      const nx = 0.12 + col * 0.15 + ((i * 17) % 7) * 0.01;
      const ny = 0.15 + row * 0.14 + ((i * 23) % 9) * 0.01;
      return {
        homeX: nx,
        homeY: ny,
        x: nx * width,
        y: ny * height,
        vx: 0,
        vy: 0,
        size: i % 4 === 0 ? 3.5 : 2.5,
        seed: i * 1.618,
      };
    });

    // Pulses
    const pulses: Pulse[] = [
      { sourceIndex: 1, targetIndex: 2, progress: 0.2, speed: 0.006, color: '#ffe08d' },
      { sourceIndex: 7, targetIndex: 8, progress: 0.6, speed: 0.008, color: '#ffe08d' },
      { sourceIndex: 13, targetIndex: 19, progress: 0.8, speed: 0.005, color: '#ffe08d' },
      { sourceIndex: 20, targetIndex: 21, progress: 0.4, speed: 0.007, color: '#ffe08d' },
    ];

    // Horizontal Contact channel pulse
    let contactPulseX = 0;

    // Architectural frames for WORK section
    const blueprintFrames: BlueprintFrame[] = [
      { relX: 0.08, relY: 0.18, relW: 0.38, relH: 0.45, depth: 0.8, label: 'SYS_FRAME // ARCH.01' },
      { relX: 0.52, relY: 0.32, relW: 0.40, relH: 0.52, depth: 1.2, label: 'SYS_FRAME // ARCH.02' },
      { relX: 0.25, relY: 0.68, relW: 0.55, relH: 0.24, depth: 0.5, label: 'BASE_DATUM // AXIS.H' },
    ];

    // Lifecycle progression points (Discover -> Design -> Build -> Deploy -> Scale)
    const lifecycleMilestones = [
      { label: '01 / DISCOVER', normY: 0.18 },
      { label: '02 / DESIGN', normY: 0.36 },
      { label: '03 / BUILD', normY: 0.54 },
      { label: '04 / DEPLOY', normY: 0.72 },
      { label: '05 / SCALE', normY: 0.90 },
    ];

    // Interpolation parameter state
    const currentParams = {
      gridDensity: 80,
      gridOpacity: 0.038,
      cursorGlowRadius: 220,
      cursorGlowOpacity: 0.07,
      homeBlend: 1,
      aboutBlend: 0,
      servicesBlend: 0,
      stackBlend: 0,
      workBlend: 0,
      lifecycleBlend: 0,
      networkBlend: 0,
      contactBlend: 0,
      footerBlend: 0,
    };

    let lastTime = performance.now();
    let lastRenderTime = 0;

    // The Master 60FPS RAF Loop (adaptively throttled to ~30-36 FPS on low-end mobile devices)
    const render = (time: number) => {
      // Pause execution when tab is hidden to conserve battery & CPU
      if (document.hidden) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      // Frame throttle for low-end mobile devices (~33ms target interval = 30 FPS)
      if (isLowEndDevice && time - lastRenderTime < 30) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }
      lastRenderTime = time;

      const dt = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      // 1. Mouse Lerping (smooth physical follow)
      if (isReducedMotion) {
        currentMouse.x = targetMouse.x;
        currentMouse.y = targetMouse.y;
      } else {
        const mouseLerp = isMobile ? 1 : 0.075;
        currentMouse.x += (targetMouse.x - currentMouse.x) * mouseLerp;
        currentMouse.y += (targetMouse.y - currentMouse.y) * mouseLerp;
      }

      // 2. Active Section Target Parameters Configuration
      const active = activeSectionRef.current;
      const isHome = active === 'home' || active === 'hero';
      const isAbout = active === 'about';
      const isServices = active === 'services';
      const isStack = active === 'stack';
      const isWork = active === 'work';
      const isLifecycle = active === 'approach';
      const isNetwork = active === 'network';
      const isContact = active === 'contact';
      const isFooter = active === 'footer';

      const targetParams = {
        gridDensity: isAbout ? 48 : isWork ? 64 : 80,
        gridOpacity: isAbout ? 0.055 : isFooter ? 0.02 : 0.038,
        cursorGlowRadius: isAbout ? 180 : isNetwork ? 260 : 220,
        cursorGlowOpacity: isFooter ? 0.02 : targetMouse.isInside ? 0.08 : 0.04,
        homeBlend: isHome ? 1 : 0,
        aboutBlend: isAbout ? 1 : 0,
        servicesBlend: isServices ? 1 : 0,
        stackBlend: isStack ? 1 : 0,
        workBlend: isWork ? 1 : 0,
        lifecycleBlend: isLifecycle ? 1 : 0,
        networkBlend: isNetwork ? 1 : 0,
        contactBlend: isContact ? 1 : 0,
        footerBlend: isFooter ? 1 : 0,
      };

      // 3. Smooth parameter interpolation (~600-800ms transition duration)
      const blendRate = isReducedMotion ? 0.2 : 0.052;
      currentParams.gridDensity += (targetParams.gridDensity - currentParams.gridDensity) * blendRate;
      currentParams.gridOpacity += (targetParams.gridOpacity - currentParams.gridOpacity) * blendRate;
      currentParams.cursorGlowRadius += (targetParams.cursorGlowRadius - currentParams.cursorGlowRadius) * blendRate;
      currentParams.cursorGlowOpacity += (targetParams.cursorGlowOpacity - currentParams.cursorGlowOpacity) * blendRate;
      currentParams.homeBlend += (targetParams.homeBlend - currentParams.homeBlend) * blendRate;
      currentParams.aboutBlend += (targetParams.aboutBlend - currentParams.aboutBlend) * blendRate;
      currentParams.servicesBlend += (targetParams.servicesBlend - currentParams.servicesBlend) * blendRate;
      currentParams.stackBlend += (targetParams.stackBlend - currentParams.stackBlend) * blendRate;
      currentParams.workBlend += (targetParams.workBlend - currentParams.workBlend) * blendRate;
      currentParams.lifecycleBlend += (targetParams.lifecycleBlend - currentParams.lifecycleBlend) * blendRate;
      currentParams.networkBlend += (targetParams.networkBlend - currentParams.networkBlend) * blendRate;
      currentParams.contactBlend += (targetParams.contactBlend - currentParams.contactBlend) * blendRate;
      currentParams.footerBlend += (targetParams.footerBlend - currentParams.footerBlend) * blendRate;

      // 4. Draw Layer 1: Deep Black / Dark Base
      ctx.fillStyle = '#0c0c0d';
      ctx.fillRect(0, 0, width, height);

      // Draw Layer 3 (Background Ambient Lighting)
      // Soft breathing top-center radial gradient (cached to eliminate per-frame GC allocations)
      const ambientPulse = isReducedMotion ? 1 : 1 + Math.sin(time * 0.0008) * 0.08;
      if (!cachedAmbientGrad || Math.abs(ambientPulse - cachedGradPulse) > 0.04) {
        cachedGradPulse = ambientPulse;
        const ambientRadius = Math.max(width, height) * 0.65 * ambientPulse;
        cachedAmbientGrad = ctx.createRadialGradient(
          width * 0.5,
          height * 0.28,
          0,
          width * 0.5,
          height * 0.28,
          ambientRadius
        );
        cachedAmbientGrad.addColorStop(0, 'rgba(255, 224, 141, 0.032)');
        cachedAmbientGrad.addColorStop(0.5, 'rgba(229, 195, 101, 0.012)');
        cachedAmbientGrad.addColorStop(1, 'rgba(12, 12, 13, 0)');
      }
      ctx.fillStyle = cachedAmbientGrad;
      ctx.fillRect(0, 0, width, height);

      // Cursor Illumination Spotlight (desktop only)
      if (!isMobile && currentParams.cursorGlowOpacity > 0.005) {
        const glowGrad = ctx.createRadialGradient(
          currentMouse.x,
          currentMouse.y,
          0,
          currentMouse.x,
          currentMouse.y,
          currentParams.cursorGlowRadius
        );
        glowGrad.addColorStop(0, `rgba(255, 224, 141, ${currentParams.cursorGlowOpacity})`);
        glowGrad.addColorStop(0.55, `rgba(255, 224, 141, ${currentParams.cursorGlowOpacity * 0.3})`);
        glowGrad.addColorStop(1, 'rgba(255, 224, 141, 0)');
        ctx.fillStyle = glowGrad;
        ctx.fillRect(0, 0, width, height);
      }

      // 5. Draw Layer 2: Subtle Precision Engineering Grid
      const density = isMobile ? currentParams.gridDensity * 1.3 : currentParams.gridDensity;
      const gridOffset = isReducedMotion ? 0 : (time * 0.004) % density;

      ctx.save();
      ctx.lineWidth = 1;
      ctx.strokeStyle = `rgba(255, 224, 141, ${currentParams.gridOpacity})`;

      // Vertical grid lines
      ctx.beginPath();
      for (let x = (gridOffset % density) - density; x <= width + density; x += density) {
        const crispX = Math.floor(x) + 0.5;
        ctx.moveTo(crispX, 0);
        ctx.lineTo(crispX, height);
      }
      // Horizontal grid lines
      for (let y = (gridOffset % density) - density; y <= height + density; y += density) {
        const crispY = Math.floor(y) + 0.5;
        ctx.moveTo(0, crispY);
        ctx.lineTo(width, crispY);
      }
      ctx.stroke();

      // Nearby grid intersection illumination (subtle reaction to cursor)
      if (!isMobile && !isReducedMotion && targetMouse.isInside) {
        const nearestGridX = Math.round((currentMouse.x - gridOffset) / density) * density + gridOffset;
        const nearestGridY = Math.round((currentMouse.y - gridOffset) / density) * density + gridOffset;
        const distToIntersection = Math.hypot(currentMouse.x - nearestGridX, currentMouse.y - nearestGridY);

        if (distToIntersection < density * 0.85) {
          const crossSize = 4;
          const crossAlpha = (1 - distToIntersection / (density * 0.85)) * 0.22;
          ctx.strokeStyle = `rgba(255, 224, 141, ${crossAlpha})`;
          ctx.beginPath();
          ctx.moveTo(nearestGridX - crossSize, nearestGridY);
          ctx.lineTo(nearestGridX + crossSize, nearestGridY);
          ctx.moveTo(nearestGridX, nearestGridY - crossSize);
          ctx.lineTo(nearestGridX, nearestGridY + crossSize);
          ctx.stroke();
        }
      }
      ctx.restore();

      // =========================================================================
      // SECTION 01 — HOME / HERO ("ARTIFURA CORE / SYSTEM INITIALIZATION")
      // =========================================================================
      if (currentParams.homeBlend > 0.01) {
        ctx.save();
        const alpha = currentParams.homeBlend;

        // Data particles
        ctx.fillStyle = `rgba(255, 224, 141, ${0.28 * alpha})`;
        for (let i = 0; i < particleCount; i++) {
          const p = particles[i];
          if (!isReducedMotion) {
            p.x += p.vx;
            p.y += p.vy;
            if (p.y < -10) p.y = height + 10;
            if (p.x > width + 10) p.x = -10;
            if (p.x < -10) p.x = width + 10;
          }

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        }

        // Technical coordinates marker that fades in/out
        const markerAlpha = (0.12 + Math.sin(time * 0.001) * 0.06) * alpha;
        ctx.font = '10px "JetBrains Mono", monospace';
        ctx.fillStyle = `rgba(255, 224, 141, ${markerAlpha})`;
        ctx.fillText('+ [SYS.00_INIT]', width * 0.08, height * 0.88);
        ctx.fillText('13.0827° N, 80.2707° E', width * 0.08, height * 0.88 + 14);

        ctx.restore();
      }

      // =========================================================================
      // SECTION 02 — ABOUT ("PRECISION / ENGINEERING")
      // =========================================================================
      if (currentParams.aboutBlend > 0.01) {
        ctx.save();
        const alpha = currentParams.aboutBlend;

        // Structured coordinate marks & crosshairs at grid intersections
        ctx.strokeStyle = `rgba(255, 224, 141, ${0.16 * alpha})`;
        ctx.fillStyle = `rgba(255, 224, 141, ${0.18 * alpha})`;
        ctx.font = '9px "JetBrains Mono", monospace';

        const stepX = density * 2;
        const stepY = density * 2;

        ctx.beginPath();
        for (let x = stepX; x < width - stepX; x += stepX) {
          for (let y = stepY; y < height - stepY; y += stepY) {
            // Tiny crosshair
            ctx.moveTo(x - 3, y);
            ctx.lineTo(x + 3, y);
            ctx.moveTo(x, y - 3);
            ctx.lineTo(x, y + 3);
          }
        }
        ctx.stroke();

        // Horizontal measurement guide line with length annotation
        const measureY = Math.floor(height * 0.72) + 0.5;
        const mStart = width * 0.15;
        const mEnd = width * 0.85;

        ctx.beginPath();
        ctx.strokeStyle = `rgba(255, 224, 141, ${0.12 * alpha})`;
        ctx.setLineDash([4, 6]);
        ctx.moveTo(mStart, measureY);
        ctx.lineTo(mEnd, measureY);
        ctx.stroke();
        ctx.setLineDash([]);

        // Ticks at measurement ends
        ctx.beginPath();
        ctx.strokeStyle = `rgba(255, 224, 141, ${0.25 * alpha})`;
        ctx.moveTo(mStart, measureY - 5);
        ctx.lineTo(mStart, measureY + 5);
        ctx.moveTo(mEnd, measureY - 5);
        ctx.lineTo(mEnd, measureY + 5);
        ctx.stroke();

        // Dynamic coordinate readout near top right
        const coordXStr = (currentMouse.x * 0.045).toFixed(2).padStart(6, '0');
        const coordYStr = (currentMouse.y * 0.045).toFixed(2).padStart(6, '0');
        ctx.fillText(`X: ${coordXStr}`, width - 140, 95);
        ctx.fillText(`Y: ${coordYStr}`, width - 140, 110);
        ctx.fillText('STATUS: SYNCHRONIZED', width - 140, 125);

        ctx.restore();
      }

      // =========================================================================
      // SECTION 03 — SERVICES ("SYSTEM MODULES")
      // =========================================================================
      if (currentParams.servicesBlend > 0.01) {
        ctx.save();
        const alpha = currentParams.servicesBlend;
        const activeNodeCount = isMobile ? 8 : 14;

        // Position nodes and react subtly to mouse
        for (let i = 0; i < activeNodeCount; i++) {
          const n = nodes[i];
          const homeX = n.homeX * width;
          const homeY = n.homeY * height;

          // Mouse attraction vector
          const dx = currentMouse.x - n.x;
          const dy = currentMouse.y - n.y;
          const dist = Math.hypot(dx, dy);

          if (!isReducedMotion && !isMobile && dist < 240 && dist > 5) {
            const pullForce = (1 - dist / 240) * 18;
            n.vx += (dx / dist) * pullForce * dt;
            n.vy += (dy / dist) * pullForce * dt;
          }

          // Spring back to home
          const hdx = homeX - n.x;
          const hdy = homeY - n.y;
          n.vx += hdx * 4 * dt;
          n.vy += hdy * 4 * dt;
          n.vx *= 0.88;
          n.vy *= 0.88;

          n.x += n.vx;
          n.y += n.vy;

          // Draw modular diamond node
          ctx.strokeStyle = `rgba(255, 224, 141, ${0.28 * alpha})`;
          ctx.fillStyle = `rgba(14, 14, 15, ${0.8 * alpha})`;
          ctx.beginPath();
          const s = 4;
          ctx.moveTo(n.x, n.y - s);
          ctx.lineTo(n.x + s, n.y);
          ctx.lineTo(n.x, n.y + s);
          ctx.lineTo(n.x - s, n.y);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();

          // Connect adjacent modular pairs
          for (let j = i + 1; j < activeNodeCount; j++) {
            const other = nodes[j];
            const distBetween = Math.hypot(n.x - other.x, n.y - other.y);
            if (distBetween < 220) {
              const lineAlpha = (1 - distBetween / 220) * 0.14 * alpha;
              ctx.strokeStyle = `rgba(255, 224, 141, ${lineAlpha})`;
              ctx.lineWidth = 1;
              ctx.beginPath();
              ctx.moveTo(n.x, n.y);
              ctx.lineTo(other.x, other.y);
              ctx.stroke();
            }
          }
        }

        ctx.restore();
      }

      // =========================================================================
      // SECTION 04 — STACK ("TECHNOLOGY ECOSYSTEM")
      // =========================================================================
      if (currentParams.stackBlend > 0.01) {
        ctx.save();
        const alpha = currentParams.stackBlend;
        const stackNodeCount = isMobile ? 10 : 20;

        for (let i = 0; i < stackNodeCount; i++) {
          const n = nodes[i];
          const ambientDriftX = isReducedMotion ? 0 : Math.sin(time * 0.0006 + n.seed) * 12;
          const ambientDriftY = isReducedMotion ? 0 : Math.cos(time * 0.0006 + n.seed) * 12;
          const homeX = n.homeX * width + ambientDriftX;
          const homeY = n.homeY * height + ambientDriftY;

          // Mouse gentle repulsion disturbance
          const dx = currentMouse.x - n.x;
          const dy = currentMouse.y - n.y;
          const dist = Math.hypot(dx, dy);

          if (!isReducedMotion && !isMobile && dist < 140 && dist > 5) {
            const push = (1 - dist / 140) * 22;
            n.vx -= (dx / dist) * push * dt;
            n.vy -= (dy / dist) * push * dt;
          }

          const hdx = homeX - n.x;
          const hdy = homeY - n.y;
          n.vx += hdx * 5 * dt;
          n.vy += hdy * 5 * dt;
          n.vx *= 0.85;
          n.vy *= 0.85;

          n.x += n.vx;
          n.y += n.vy;

          // Draw node point
          ctx.fillStyle = `rgba(255, 224, 141, ${0.25 * alpha})`;
          ctx.beginPath();
          ctx.arc(n.x, n.y, 2, 0, Math.PI * 2);
          ctx.fill();

          // Connect
          for (let j = i + 1; j < stackNodeCount; j++) {
            const other = nodes[j];
            const distBetween = Math.hypot(n.x - other.x, n.y - other.y);
            if (distBetween < 180) {
              const lineAlpha = (1 - distBetween / 180) * 0.12 * alpha;
              ctx.strokeStyle = `rgba(255, 224, 141, ${lineAlpha})`;
              ctx.lineWidth = 0.75;
              ctx.beginPath();
              ctx.moveTo(n.x, n.y);
              ctx.lineTo(other.x, other.y);
              ctx.stroke();
            }
          }
        }

        // Draw traveling data pulses along active links
        if (!isReducedMotion) {
          pulses.forEach((p) => {
            p.progress = (p.progress + p.speed) % 1;
            const src = nodes[p.sourceIndex % stackNodeCount];
            const dst = nodes[p.targetIndex % stackNodeCount];
            if (src && dst) {
              const px = src.x + (dst.x - src.x) * p.progress;
              const py = src.y + (dst.y - src.y) * p.progress;

              ctx.fillStyle = `rgba(255, 224, 141, ${0.65 * alpha})`;
              ctx.beginPath();
              ctx.arc(px, py, 1.8, 0, Math.PI * 2);
              ctx.fill();
            }
          });
        }

        ctx.restore();
      }

      // =========================================================================
      // SECTION 05 — WORK ("BUILT SYSTEMS")
      // =========================================================================
      if (currentParams.workBlend > 0.01) {
        ctx.save();
        const alpha = currentParams.workBlend;

        // Subtle parallax shift influenced by mouse & scroll progress
        const scrollProg = sectionProgressRef?.current || 0;
        const mouseParallaxX = isReducedMotion ? 0 : (currentMouse.x - width * 0.5) * 0.015;
        const mouseParallaxY = isReducedMotion ? 0 : (currentMouse.y - height * 0.5) * 0.015;
        const scrollParallaxY = scrollProg * 30;

        ctx.strokeStyle = `rgba(255, 224, 141, ${0.12 * alpha})`;
        ctx.fillStyle = `rgba(255, 224, 141, ${0.14 * alpha})`;
        ctx.font = '9px "JetBrains Mono", monospace';

        blueprintFrames.forEach((frame) => {
          const fx = frame.relX * width + mouseParallaxX * frame.depth;
          const fy = frame.relY * height + mouseParallaxY * frame.depth - scrollParallaxY * frame.depth;
          const fw = frame.relW * width;
          const fh = frame.relH * height;

          // Architectural blueprint frame boundary
          ctx.strokeRect(fx, fy, fw, fh);

          // Corner bracket ticks
          const tick = 6;
          ctx.beginPath();
          ctx.moveTo(fx - tick, fy);
          ctx.lineTo(fx + tick, fy);
          ctx.moveTo(fx, fy - tick);
          ctx.lineTo(fx, fy + tick);
          ctx.moveTo(fx + fw - tick, fy + fh);
          ctx.lineTo(fx + fw + tick, fy + fh);
          ctx.moveTo(fx + fw, fy + fh - tick);
          ctx.lineTo(fx + fw, fy + fh + tick);
          ctx.stroke();

          // Label
          ctx.fillText(frame.label, fx + 8, fy + 14);
        });

        // Vertical construction datum line
        const datumX = Math.floor(width * 0.48) + 0.5;
        ctx.beginPath();
        ctx.setLineDash([2, 4]);
        ctx.moveTo(datumX, 0);
        ctx.lineTo(datumX, height);
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.restore();
      }

      // =========================================================================
      // SECTION 06 — LIFECYCLE ("SYSTEM EVOLUTION")
      // =========================================================================
      if (currentParams.lifecycleBlend > 0.01) {
        ctx.save();
        const alpha = currentParams.lifecycleBlend;
        const scrollProgress = Math.max(0, Math.min(1, sectionProgressRef?.current || 0));

        const spineX = Math.floor(width * 0.12) + 0.5;
        const totalHeight = height * 0.85;
        const startY = height * 0.10;

        // Full inactive backbone
        ctx.strokeStyle = `rgba(77, 70, 55, ${0.35 * alpha})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(spineX, startY);
        ctx.lineTo(spineX, startY + totalHeight);
        ctx.stroke();

        // Progressive illuminated path driven by scroll progress
        const activePathLength = totalHeight * Math.max(0.08, scrollProgress);
        ctx.strokeStyle = `rgba(255, 224, 141, ${0.45 * alpha})`;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(spineX, startY);
        ctx.lineTo(spineX, startY + activePathLength);
        ctx.stroke();

        // Milestones
        lifecycleMilestones.forEach((m, idx) => {
          const my = startY + totalHeight * (idx / (lifecycleMilestones.length - 1));
          const isPassed = (my - startY) <= activePathLength + 15;
          const isCurrent = Math.abs((my - startY) - activePathLength) < 45;

          // Milestone node
          ctx.beginPath();
          if (isCurrent) {
            ctx.fillStyle = `rgba(255, 224, 141, ${0.9 * alpha})`;
            ctx.arc(spineX, my, 4, 0, Math.PI * 2);
            ctx.fill();
            // Outer pulse ring
            ctx.strokeStyle = `rgba(255, 224, 141, ${0.4 * alpha})`;
            ctx.arc(spineX, my, 8 + Math.sin(time * 0.005) * 2, 0, Math.PI * 2);
            ctx.stroke();
          } else if (isPassed) {
            ctx.fillStyle = `rgba(255, 224, 141, ${0.45 * alpha})`;
            ctx.arc(spineX, my, 2.5, 0, Math.PI * 2);
            ctx.fill();
          } else {
            ctx.fillStyle = `rgba(77, 70, 55, ${0.4 * alpha})`;
            ctx.arc(spineX, my, 2, 0, Math.PI * 2);
            ctx.fill();
          }

          // Milestone label
          ctx.font = '9px "JetBrains Mono", monospace';
          ctx.fillStyle = isCurrent
            ? `rgba(255, 224, 141, ${0.75 * alpha})`
            : isPassed
              ? `rgba(198, 198, 207, ${0.4 * alpha})`
              : `rgba(153, 144, 126, ${0.2 * alpha})`;
          ctx.fillText(m.label, spineX + 16, my + 3);
        });

        // Flowing energy packet along illuminated path
        if (!isReducedMotion) {
          const packetOffset = ((time * 0.0005) % 1) * activePathLength;
          ctx.fillStyle = `rgba(255, 224, 141, ${0.85 * alpha})`;
          ctx.beginPath();
          ctx.arc(spineX, startY + packetOffset, 2.5, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      }

      // =========================================================================
      // SECTION 07 — NETWORK ("CONNECTED SYSTEM")
      // =========================================================================
      if (currentParams.networkBlend > 0.01) {
        ctx.save();
        const alpha = currentParams.networkBlend;
        const netCount = isMobile ? 12 : 28;

        for (let i = 0; i < netCount; i++) {
          const n = nodes[i];
          const homeX = n.homeX * width;
          const homeY = n.homeY * height;

          // Organic physics: gentle cursor attract/repel
          const dx = currentMouse.x - n.x;
          const dy = currentMouse.y - n.y;
          const dist = Math.hypot(dx, dy);

          if (!isReducedMotion && !isMobile && dist < 180 && dist > 5) {
            // Gentle attraction
            const force = (1 - dist / 180) * 15;
            n.vx += (dx / dist) * force * dt;
            n.vy += (dy / dist) * force * dt;
          }

          // Return to home anchor
          n.vx += (homeX - n.x) * 4 * dt;
          n.vy += (homeY - n.y) * 4 * dt;
          n.vx *= 0.86;
          n.vy *= 0.86;

          n.x += n.vx;
          n.y += n.vy;

          // Node draw
          const isNearCursor = !isMobile && dist < 160;
          ctx.fillStyle = isNearCursor
            ? `rgba(255, 224, 141, ${0.65 * alpha})`
            : `rgba(255, 224, 141, ${0.22 * alpha})`;

          ctx.beginPath();
          ctx.arc(n.x, n.y, isNearCursor ? 3.5 : 2, 0, Math.PI * 2);
          ctx.fill();

          // Connect proximate network nodes
          for (let j = i + 1; j < netCount; j++) {
            const other = nodes[j];
            const distBetween = Math.hypot(n.x - other.x, n.y - other.y);
            if (distBetween < 190) {
              const baseAlpha = (1 - distBetween / 190) * 0.16 * alpha;
              const linkBright = isNearCursor ? 1.8 : 1;
              ctx.strokeStyle = `rgba(255, 224, 141, ${Math.min(0.45, baseAlpha * linkBright)})`;
              ctx.lineWidth = isNearCursor ? 1 : 0.75;
              ctx.beginPath();
              ctx.moveTo(n.x, n.y);
              ctx.lineTo(other.x, other.y);
              ctx.stroke();
            }
          }
        }

        ctx.restore();
      }

      // =========================================================================
      // SECTION 08 — CONTACT ("OPEN CHANNEL")
      // =========================================================================
      if (currentParams.contactBlend > 0.01) {
        ctx.save();
        const alpha = currentParams.contactBlend;

        // Thin horizontal communication line across the canvas
        const commY = Math.floor(height * 0.62) + 0.5;

        // Proximity factor to mouse/interaction zone
        const distFromComm = Math.abs(currentMouse.y - commY);
        const commHoverFactor = (!isMobile && distFromComm < 140) ? 1 - distFromComm / 140 : 0;

        // Communication line with subtle edge fade
        const lineGrad = ctx.createLinearGradient(0, commY, width, commY);
        lineGrad.addColorStop(0, 'rgba(255, 224, 141, 0)');
        lineGrad.addColorStop(0.15, `rgba(255, 224, 141, ${(0.14 + commHoverFactor * 0.2) * alpha})`);
        lineGrad.addColorStop(0.85, `rgba(255, 224, 141, ${(0.14 + commHoverFactor * 0.2) * alpha})`);
        lineGrad.addColorStop(1, 'rgba(255, 224, 141, 0)');

        ctx.strokeStyle = lineGrad;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, commY);
        ctx.lineTo(width, commY);
        ctx.stroke();

        // Signal transmission packet gliding periodically across the open channel
        if (!isReducedMotion) {
          contactPulseX = (contactPulseX + (width * 0.15 + commHoverFactor * width * 0.1) * dt) % (width + 40);
          const px = contactPulseX - 20;

          // Glow around signal packet
          const packetGlow = ctx.createRadialGradient(px, commY, 0, px, commY, 14);
          packetGlow.addColorStop(0, `rgba(255, 224, 141, ${(0.7 + commHoverFactor * 0.3) * alpha})`);
          packetGlow.addColorStop(1, 'rgba(255, 224, 141, 0)');
          ctx.fillStyle = packetGlow;
          ctx.beginPath();
          ctx.arc(px, commY, 14, 0, Math.PI * 2);
          ctx.fill();

          // Packet core
          ctx.fillStyle = `rgba(255, 255, 255, ${(0.9 + commHoverFactor * 0.1) * alpha})`;
          ctx.beginPath();
          ctx.arc(px, commY, 2, 0, Math.PI * 2);
          ctx.fill();
        }

        // Channel status annotation
        ctx.font = '9px "JetBrains Mono", monospace';
        ctx.fillStyle = `rgba(255, 224, 141, ${(0.25 + commHoverFactor * 0.25) * alpha})`;
        ctx.fillText('CHANNEL_STATUS // OPEN_RECEPTIVE', width * 0.08, commY - 8);

        ctx.restore();
      }

      // =========================================================================
      // FINAL ARTIFURA / FOOTER STATE ("SYSTEM COMPLETE")
      // =========================================================================
      if (currentParams.footerBlend > 0.01) {
        ctx.save();
        const alpha = currentParams.footerBlend;

        // Centered warm convergence glow
        const footerGlow = ctx.createRadialGradient(
          width * 0.5,
          height * 0.5,
          0,
          width * 0.5,
          height * 0.5,
          Math.min(width, height) * 0.5
        );
        footerGlow.addColorStop(0, `rgba(255, 224, 141, ${0.05 * alpha})`);
        footerGlow.addColorStop(0.7, `rgba(255, 224, 141, ${0.015 * alpha})`);
        footerGlow.addColorStop(1, 'rgba(12, 12, 13, 0)');
        ctx.fillStyle = footerGlow;
        ctx.fillRect(0, 0, width, height);

        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerleave', handlePointerLeave);
      window.removeEventListener('resize', handleResize);
      mediaQuery.removeEventListener('change', handleMotionChange);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[#0c0c0d]"
    >
      {/* High-Performance Canvas Surface */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full block"
      />

      {/* Layer 4: Optional Extremely Subtle Noise/Grain Overlay */}
      <div
        className="absolute inset-0 opacity-[0.022] pointer-events-none mix-blend-screen"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
};
