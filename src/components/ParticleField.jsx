import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { getCurrentVelocity } from '../utils/momentumScroll';
import '../styles/particleField.css';

/**
 * ARTIFURA — LIVING BACKGROUND PARTICLE FIELD
 *
 * High-quantity, extremely low-visibility interactive background field.
 * - Single HTML5 canvas with batched rendering passes (75+ FPS)
 * - 5 Particle archetypes (micro dots, sub-mil points, line fragments, crosshairs, orbital nodes)
 * - Procedural faint architectural arcs and coordinate marks
 * - 3 Depth tiers (Far, Mid, Near) with autonomous drift & cluster breathing
 * - Dual-radius cursor repulsion and gravitational swirl
 * - Cursor velocity scaling, directional impulse, and fading trails
 * - Transient local structural connections (reveals hidden structure beneath cursor)
 * - Occasional traveling signal pulses (every 8-15s)
 * - Vector-integrated scroll momentum vertical drift & stretch
 * - Seamless wrap-around viewport bounds
 * - Softens naturally behind dark glassmorphism panels
 */

export default function ParticleField() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    // Accessibility check
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Dynamic Theme Observer (Obsidian Dark vs Alabaster Light)
    let activeTheme = document.documentElement.getAttribute('data-theme') || 'dark';
    const themeObserver = new MutationObserver(() => {
      activeTheme = document.documentElement.getAttribute('data-theme') || 'dark';
    });
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

    let width = window.innerWidth;
    let height = window.innerHeight;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    // Particle memory pool
    let particles = [];
    let technicalMarks = [];
    let geometricArcs = [];

    // Pointer telemetry
    const pointer = {
      x: -1000,
      y: -1000,
      prevX: -1000,
      prevY: -1000,
      vx: 0,
      vy: 0,
      speed: 0,
      smoothedSpeed: 0,
      isActive: false,
      lastActiveTime: 0
    };

    // Signal state (occasional traveling pulse every 8-15s)
    const signalState = {
      active: false,
      startTime: 0,
      duration: 2600,
      nodes: [],
      nextSpawnTime: performance.now() + 6000
    };

    // Autonomous clock
    let autoTime = 0;

    // -------------------------------------------------------------
    // 1. ADAPTIVE QUALITY & PARTICLE INITIALIZATION
    // -------------------------------------------------------------
    const getParticleCount = (w, h) => {
      const area = w * h;
      if (w < 768) return 220; // Mobile
      if (w < 1024) return 380; // Tablet
      if (w < 1440) return 620; // Laptop
      return Math.min(950, Math.floor(area / 2000)); // Large desktop
    };

    const initSimulation = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = getParticleCount(width, height);
      particles = new Array(count);

      // Define 5 density cluster centers in normalized space
      const clusters = [
        { x: 0.22, y: 0.28, radius: 0.18 },
        { x: 0.78, y: 0.22, radius: 0.16 },
        { x: 0.50, y: 0.52, radius: 0.22 },
        { x: 0.18, y: 0.75, radius: 0.18 },
        { x: 0.82, y: 0.78, radius: 0.19 }
      ];

      for (let i = 0; i < count; i++) {
        let x, y;

        // Non-uniform distribution: 40% cluster bias, 40% uniform, 20% diagonal flow
        const distSeed = Math.random();
        if (distSeed < 0.40) {
          const c = clusters[Math.floor(Math.random() * clusters.length)];
          const angle = Math.random() * Math.PI * 2;
          const r = Math.sqrt(Math.random()) * c.radius;
          x = (c.x + Math.cos(angle) * r) * width;
          y = (c.y + Math.sin(angle) * r) * height;
        } else if (distSeed < 0.80) {
          x = Math.random() * width;
          y = Math.random() * height;
        } else {
          // Diagonal flowing stream
          const t = Math.random();
          x = t * width + (Math.random() - 0.5) * 200;
          y = (0.3 * width + t * height * 0.7) % height;
        }

        // Archetype assignment:
        // A: 70% Micro dot, B: 15% Sub-mil point, C: 6% Line frag, D: 6% Crosshair, E: 3% Orbital
        const typeRand = Math.random();
        let type = 'dot';
        let radius = 0.7;
        let lineLength = 0;
        let isVertical = false;

        if (typeRand < 0.70) {
          type = 'dot';
          radius = 0.5 + Math.random() * 0.5; // 0.5 - 1.0px
        } else if (typeRand < 0.85) {
          type = 'point';
          radius = 1.2 + Math.random() * 0.6; // 1.2 - 1.8px
        } else if (typeRand < 0.91) {
          type = 'line';
          lineLength = 8 + Math.random() * 10;
          isVertical = Math.random() > 0.5;
        } else if (typeRand < 0.97) {
          type = 'cross';
          lineLength = 5 + Math.random() * 3;
        } else {
          type = 'orbital';
          radius = 1.0;
        }

        // Depth tier: 70% Far, 20% Mid, 10% Near
        const depthRand = Math.random();
        let depth = 0.35; // Far
        let baseOpacity = 0.04 + Math.random() * 0.04;
        let maxOpacity = 0.40;

        if (depthRand > 0.90) {
          depth = 1.0; // Near
          baseOpacity = 0.09 + Math.random() * 0.08;
          maxOpacity = 0.65;
        } else if (depthRand > 0.70) {
          depth = 0.65; // Mid
          baseOpacity = 0.06 + Math.random() * 0.05;
          maxOpacity = 0.50;
        }

        // Autonomous drift parameters (extremely slow periods: 8-22s)
        const driftSpeed = (0.04 + Math.random() * 0.08) * depth;
        const driftAngle = Math.random() * Math.PI * 2;
        const phase = Math.random() * Math.PI * 2;
        const orbitRadius = type === 'orbital' ? 20 + Math.random() * 35 : 0;
        const orbitSpeed = (Math.random() > 0.5 ? 1 : -1) * (0.003 + Math.random() * 0.005);

        particles[i] = {
          x,
          y,
          originX: x,
          originY: y,
          vx: 0,
          vy: 0,
          type,
          radius,
          lineLength,
          isVertical,
          depth,
          baseOpacity,
          currentOpacity: baseOpacity,
          maxOpacity,
          trailOpacity: 0,
          driftSpeed,
          driftAngle,
          phase,
          orbitRadius,
          orbitSpeed,
          orbitAngle: Math.random() * Math.PI * 2,
          isStatic: depthRand <= 0.70 && type === 'dot' // 70% almost stationary
        };
      }

      // Procedural architectural arcs (2-3 faint subtle background rings)
      geometricArcs = [
        { cx: width * 0.85, cy: height * 0.30, radius: Math.min(width, height) * 0.28, start: 1.2, end: 3.8 },
        { cx: width * 0.15, cy: height * 0.75, radius: Math.min(width, height) * 0.22, start: 4.2, end: 6.0 }
      ];

      // Procedural technical marks (sparse coordinate notations)
      technicalMarks = [
        { text: '01 // GRID REF', x: width * 0.12, y: height * 0.22 },
        { text: 'SYS.04 // RES', x: width * 0.88, y: height * 0.65 },
        { text: '45.8° // PAR', x: width * 0.75, y: height * 0.18 },
        { text: 'LAT.00 // N', x: width * 0.28, y: height * 0.88 }
      ];
    };

    initSimulation();

    // -------------------------------------------------------------
    // 2. POINTER & INPUT TELEMETRY
    // -------------------------------------------------------------
    let lastPointerTime = performance.now();

    const onPointerMove = (e) => {
      const now = performance.now();
      const dt = Math.max(now - lastPointerTime, 8);
      lastPointerTime = now;

      const px = e.clientX;
      const py = e.clientY;

      if (pointer.prevX !== -1000) {
        const dx = px - pointer.prevX;
        const dy = py - pointer.prevY;
        pointer.vx = (dx / dt) * 16.67;
        pointer.vy = (dy / dt) * 16.67;
        pointer.speed = Math.sqrt(pointer.vx * pointer.vx + pointer.vy * pointer.vy);
      }

      pointer.prevX = pointer.x;
      pointer.prevY = pointer.y;
      pointer.x = px;
      pointer.y = py;
      pointer.isActive = true;
      pointer.lastActiveTime = now;
    };

    const onPointerLeave = () => {
      pointer.isActive = false;
      pointer.speed = 0;
      pointer.vx = 0;
      pointer.vy = 0;
    };

    const onTouchMove = (e) => {
      if (e.touches && e.touches[0]) {
        onPointerMove(e.touches[0]);
      }
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    document.addEventListener('mouseleave', onPointerLeave);
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onPointerLeave, { passive: true });

    // -------------------------------------------------------------
    // 3. MAIN SIMULATION & RENDER TICKER (GSAP Heartbeat Synchronized)
    // -------------------------------------------------------------
    const updateAndRender = (_time, deltaTime) => {
      // Pause simulation when tab is hidden
      if (document.hidden) return;

      const dtRatio = Math.min(Math.max(deltaTime / 16.67, 0.2), 2.5);
      autoTime += 0.012 * dtRatio;

      // Smooth pointer speed decay
      pointer.smoothedSpeed += (pointer.speed - pointer.smoothedSpeed) * 0.12;
      pointer.speed *= 0.88; // Decays when pointer rests

      // Read real-time vertical scroll velocity from momentum engine
      const scrollVelocity = getCurrentVelocity();

      // Trigger occasional traveling signals (every 8-15s)
      const now = performance.now();
      if (!signalState.active && now > signalState.nextSpawnTime && particles.length > 50) {
        signalState.active = true;
        signalState.startTime = now;
        signalState.nextSpawnTime = now + 9000 + Math.random() * 6000;

        // Select 4 nearby connected nodes for the signal chain
        const startIdx = Math.floor(Math.random() * particles.length);
        const p1 = particles[startIdx];
        signalState.nodes = [p1];

        for (let step = 0; step < 3; step++) {
          const prev = signalState.nodes[signalState.nodes.length - 1];
          let bestNeighbor = null;
          let bestDist = 180;
          for (let k = 0; k < particles.length; k += 4) {
            const candidate = particles[k];
            if (signalState.nodes.includes(candidate)) continue;
            const d = Math.hypot(candidate.x - prev.x, candidate.y - prev.y);
            if (d > 30 && d < bestDist) {
              bestDist = d;
              bestNeighbor = candidate;
            }
          }
          if (bestNeighbor) signalState.nodes.push(bestNeighbor);
        }
      }

      if (signalState.active && now - signalState.startTime > signalState.duration) {
        signalState.active = false;
        signalState.nodes = [];
      }

      // Dynamic theme color palette
      const isLight = activeTheme === 'light';
      const goldMuted = isLight ? 'rgba(122, 91, 16, ' : 'rgba(201, 162, 39, ';
      const goldBright = isLight ? 'rgba(22, 19, 13, ' : 'rgba(230, 198, 92, ';
      const goldLine = isLight ? 'rgba(122, 91, 16, ' : 'rgba(230, 198, 92, ';

      // Clear canvas
      ctx.clearRect(0, 0, width, height);

      // Draw procedural architectural background arcs (faint, elegant, mysterious)
      ctx.lineWidth = 0.75;
      for (let a = 0; a < geometricArcs.length; a++) {
        const arc = geometricArcs[a];
        ctx.strokeStyle = isLight ? 'rgba(122, 91, 16, 0.055)' : 'rgba(201, 162, 39, 0.035)';
        ctx.beginPath();
        ctx.arc(arc.cx, arc.cy, arc.radius, arc.start, arc.end);
        ctx.stroke();
      }

      // Draw procedural coordinate notations
      ctx.font = '9px "JetBrains Mono", monospace';
      for (let m = 0; m < technicalMarks.length; m++) {
        const mark = technicalMarks[m];
        const distToCursor = Math.hypot(pointer.x - mark.x, pointer.y - mark.y);
        const markAlpha = distToCursor < 180 ? (isLight ? 0.35 : 0.22) : (isLight ? 0.08 : 0.045);
        ctx.fillStyle = `${goldMuted}${markAlpha})`;
        ctx.fillText(mark.text, mark.x, mark.y);
      }

      // Interaction radius thresholds
      const innerRadius = 200; // Repulsion zone
      const outerRadius = 340; // Gravitational swirl zone

      // Arrays for batched drawing passes
      const nearbyInteractiveNodes = [];

      // -----------------------------------------------------------
      // Particle Physics Update Loop
      // -----------------------------------------------------------
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        if (!prefersReducedMotion) {
          // 1. Autonomous Drift & Cluster Breathing (Subtle, non-uniform life)
          if (!p.isStatic) {
            const breathing = Math.sin(autoTime * 0.7 + p.phase) * 0.15;
            p.x += (Math.cos(p.driftAngle + breathing) * p.driftSpeed) * dtRatio;
            p.y += (Math.sin(p.driftAngle + breathing) * p.driftSpeed) * dtRatio;
          }

          // Orbital archetype motion
          if (p.type === 'orbital') {
            p.orbitAngle += p.orbitSpeed * dtRatio;
            p.x = p.originX + Math.cos(p.orbitAngle) * p.orbitRadius;
            p.y = p.originY + Math.sin(p.orbitAngle) * p.orbitRadius;
          }

          // 2. Cursor Disturbance Field (Repulsion + Swirl + Velocity Push)
          if (pointer.isActive) {
            const dx = p.x - pointer.x;
            const dy = p.y - pointer.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < outerRadius && dist > 1) {
              const nx = dx / dist;
              const ny = dy / dist;

              if (dist < innerRadius) {
                // Primary Repulsion
                const force = Math.pow(1 - dist / innerRadius, 2) * 2.4 * p.depth;
                p.vx += nx * force * dtRatio;
                p.vy += ny * force * dtRatio;

                // Brightness excitation near cursor
                p.currentOpacity = Math.min(p.maxOpacity, p.baseOpacity + (1 - dist / innerRadius) * 0.35);

                // Collect for potential local structural connections
                if (dist < 160 && nearbyInteractiveNodes.length < 24) {
                  nearbyInteractiveNodes.push(p);
                }
              } else {
                // Secondary Gravitational Swirl in outer ring
                const swirlForce = (1 - (dist - innerRadius) / (outerRadius - innerRadius)) * 0.35 * p.depth;
                p.vx += -ny * swirlForce * dtRatio;
                p.vy += nx * swirlForce * dtRatio;
              }

              // Fast cursor velocity impulse & directional push
              if (pointer.smoothedSpeed > 8) {
                const velFactor = Math.min(pointer.smoothedSpeed / 60, 2.5) * 0.45 * p.depth;
                p.vx += (pointer.vx * 0.04) * velFactor * dtRatio;
                p.vy += (pointer.vy * 0.04) * velFactor * dtRatio;
                p.trailOpacity = Math.min(0.40, p.trailOpacity + 0.18);
              }
            } else {
              // Return opacity smoothly to baseline
              p.currentOpacity += (p.baseOpacity - p.currentOpacity) * 0.06 * dtRatio;
            }
          } else {
            p.currentOpacity += (p.baseOpacity - p.currentOpacity) * 0.04 * dtRatio;
          }

          // 3. Scroll Momentum Integration (Vertical flow & natural settling)
          if (Math.abs(scrollVelocity) > 0.05) {
            p.y -= scrollVelocity * 0.38 * p.depth * dtRatio;
          }

          // 4. Velocity damping & position integration
          p.x += p.vx * dtRatio;
          p.y += p.vy * dtRatio;
          p.vx *= Math.pow(0.92, dtRatio);
          p.vy *= Math.pow(0.92, dtRatio);

          // Trail opacity decay
          p.trailOpacity *= Math.pow(0.94, dtRatio);
          if (p.trailOpacity < 0.01) p.trailOpacity = 0;

          // 5. Seamless Viewport Wrap-Around
          if (p.x < -30) {
            p.x = width + 30;
            p.originX = p.x;
          } else if (p.x > width + 30) {
            p.x = -30;
            p.originX = p.x;
          }

          if (p.y < -30) {
            p.y = height + 30;
            p.originY = p.y;
          } else if (p.y > height + 30) {
            p.y = -30;
            p.originY = p.y;
          }
        }

        // Compute effective alpha
        const finalAlpha = Math.min(0.65, p.currentOpacity + p.trailOpacity);

        // -----------------------------------------------------------
        // Render Particle by Archetype
        // -----------------------------------------------------------
        if (p.type === 'dot') {
          ctx.fillStyle = `${goldMuted}${finalAlpha})`;
          ctx.fillRect(p.x, p.y, p.radius, p.radius);
        } else if (p.type === 'point') {
          ctx.fillStyle = `${goldBright}${finalAlpha * 1.25})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fill();
        } else if (p.type === 'line') {
          ctx.strokeStyle = `${goldMuted}${finalAlpha})`;
          ctx.lineWidth = 0.75;
          ctx.beginPath();
          if (p.isVertical) {
            ctx.moveTo(p.x, p.y - p.lineLength * 0.5);
            ctx.lineTo(p.x, p.y + p.lineLength * 0.5);
          } else {
            ctx.moveTo(p.x - p.lineLength * 0.5, p.y);
            ctx.lineTo(p.x + p.lineLength * 0.5, p.y);
          }
          ctx.stroke();
        } else if (p.type === 'cross') {
          ctx.strokeStyle = `${goldBright}${finalAlpha * 1.3})`;
          ctx.lineWidth = 0.75;
          const s = p.lineLength * 0.5;
          ctx.beginPath();
          ctx.moveTo(p.x - s, p.y);
          ctx.lineTo(p.x + s, p.y);
          ctx.moveTo(p.x, p.y - s);
          ctx.lineTo(p.x, p.y + s);
          ctx.stroke();
        } else if (p.type === 'orbital') {
          ctx.fillStyle = `${goldBright}${finalAlpha * 1.4})`;
          ctx.fillRect(p.x - 0.75, p.y - 0.75, 1.5, 1.5);
        }
      }

      // -----------------------------------------------------------
      // Local Structural Connections (Cursor Reveals Hidden Structure)
      // -----------------------------------------------------------
      if (nearbyInteractiveNodes.length >= 2) {
        ctx.lineWidth = 0.65;
        let connectionsCount = 0;
        const maxConnections = 16; // Tightly capped to maintain editorial restraint & 120 FPS

        for (let i = 0; i < nearbyInteractiveNodes.length && connectionsCount < maxConnections; i++) {
          const a = nearbyInteractiveNodes[i];
          for (let j = i + 1; j < nearbyInteractiveNodes.length && connectionsCount < maxConnections; j++) {
            const b = nearbyInteractiveNodes[j];
            const d = Math.hypot(a.x - b.x, a.y - b.y);

            if (d < 55) {
              const lineAlpha = (1 - d / 55) * 0.22;
              ctx.strokeStyle = `${goldLine}${lineAlpha})`;
              ctx.beginPath();
              ctx.moveTo(a.x, a.y);
              ctx.lineTo(b.x, b.y);
              ctx.stroke();
              connectionsCount++;
            }
          }
        }
      }

      // -----------------------------------------------------------
      // Occasional Traveling Signal Pulse
      // -----------------------------------------------------------
      if (signalState.active && signalState.nodes.length >= 2) {
        const elapsed = now - signalState.startTime;
        const progress = Math.min(elapsed / signalState.duration, 1);
        const segmentCount = signalState.nodes.length - 1;
        const currentSegment = Math.min(Math.floor(progress * segmentCount), segmentCount - 1);
        const segmentT = (progress * segmentCount) - currentSegment;

        const pA = signalState.nodes[currentSegment];
        const pB = signalState.nodes[currentSegment + 1];

        if (pA && pB) {
          const sigX = pA.x + (pB.x - pA.x) * segmentT;
          const sigY = pA.y + (pB.y - pA.y) * segmentT;
          const sigAlpha = Math.sin(progress * Math.PI) * 0.65;

          // Draw faint trail line between nodes
          ctx.strokeStyle = `${goldLine}${sigAlpha * 0.4})`;
          ctx.lineWidth = 0.85;
          ctx.beginPath();
          ctx.moveTo(pA.x, pA.y);
          ctx.lineTo(sigX, sigY);
          ctx.stroke();

          // Gold signal head
          ctx.fillStyle = `${goldBright}${sigAlpha})`;
          ctx.beginPath();
          ctx.arc(sigX, sigY, 1.8, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    };

    // -------------------------------------------------------------
    // 4. GSAP TICKER BINDING & RESIZE HANDLING
    // -------------------------------------------------------------
    gsap.ticker.add(updateAndRender);

    let resizeTimer;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        initSimulation();
      }, 150);
    };

    window.addEventListener('resize', onResize);

    // Teardown on unmount
    return () => {
      themeObserver.disconnect();
      gsap.ticker.remove(updateAndRender);
      window.removeEventListener('pointermove', onPointerMove);
      document.removeEventListener('mouseleave', onPointerLeave);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onPointerLeave);
      window.removeEventListener('resize', onResize);
      clearTimeout(resizeTimer);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="artifura-particle-canvas"
      aria-hidden="true"
    />
  );
}
