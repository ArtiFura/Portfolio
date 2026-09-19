import React, { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import GlassPanel from './GlassPanel';
import '../styles/intro.css';

gsap.registerPlugin(ScrollTrigger);

const BASE_NODES = [
  { id: 0, x: 150, y: 26 },
  { id: 1, x: 228, y: 92 },
  { id: 2, x: 228, y: 208 },
  { id: 3, x: 72, y: 208 },
  { id: 4, x: 72, y: 92 }
];

export default function Intro() {
  const sectionRef = useRef(null);
  const pinRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const statement1Ref = useRef(null);
  const statement2Ref = useRef(null);
  const lineHRef = useRef(null);
  const lineVRef = useRef(null);

  // Motion Mark Refs
  const markContainerRef = useRef(null);
  const markGroupRef = useRef(null);
  const nucleusRef = useRef(null);
  const orbitRingRef = useRef(null);
  const statusBadgeRef = useRef(null);

  // Node & Line element refs
  const nodeRefs = useRef([]);
  const lineRefs = useRef([]);
  const polygonRef = useRef(null);

  // Autonomous Idle Timeline Ref
  const idleTimelineRef = useRef(null);
  const isHijackedRef = useRef(false);

  // Autonomous state tracking (Zero React re-renders)
  const isAcceleratedRef = useRef(false);

  useGSAP(() => {
    const mm = gsap.matchMedia();

    // -------------------------------------------------------------
    // 1. AUTONOMOUS IDLE SYSTEM (Continuous, subtle, alive on load)
    // -------------------------------------------------------------
    const idleTl = gsap.timeline({ repeat: -1 });

    // Slow 12s full rotation
    idleTl.to(markGroupRef.current, {
      rotation: 360,
      transformOrigin: '150px 150px',
      duration: 14,
      ease: 'none'
    }, 0);

    // Nucleus gentle breathing oscillation (3.5s cycle)
    idleTl.to(nucleusRef.current, {
      scale: 1.35,
      transformOrigin: '150px 150px',
      duration: 3.5,
      yoyo: true,
      repeat: -1,
      ease: 'sine.inOut'
    }, 0);

    // Subtle breathing of outer dashed ring
    idleTl.to(orbitRingRef.current, {
      rotation: -180,
      transformOrigin: '150px 150px',
      duration: 18,
      repeat: -1,
      ease: 'none'
    }, 0);

    idleTimelineRef.current = idleTl;

    // Viewport Culling: Pause autonomous orbit when scrolled past Hero
    ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top bottom',
      end: 'bottom top',
      onEnter: () => idleTimelineRef.current?.resume(),
      onLeave: () => idleTimelineRef.current?.pause(),
      onEnterBack: () => idleTimelineRef.current?.resume(),
      onLeaveBack: () => idleTimelineRef.current?.pause()
    });

    // -------------------------------------------------------------
    // 2. SCROLL CHOREOGRAPHY (Controls layout hand-off)
    // -------------------------------------------------------------
    mm.add('(min-width: 769px)', () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom bottom',
          pin: pinRef.current,
          scrub: 0,
          anticipatePin: 1,
          onUpdate: (self) => {
            // Debounced velocity reaction: only tweens when state transitions
            const velocity = Math.abs(self.getVelocity());
            if (velocity > 400 && !isAcceleratedRef.current && idleTimelineRef.current && !isHijackedRef.current) {
              isAcceleratedRef.current = true;
              gsap.to(idleTimelineRef.current, { timeScale: 2.2, duration: 0.3, overwrite: 'auto' });
            } else if (velocity <= 400 && isAcceleratedRef.current && idleTimelineRef.current && !isHijackedRef.current) {
              isAcceleratedRef.current = false;
              gsap.to(idleTimelineRef.current, { timeScale: 1, duration: 0.8, overwrite: 'auto' });
            }
          }
        }
      });

      tl.to(titleRef.current, {
        scale: 1.04,
        y: -15,
        duration: 2,
        ease: 'power1.out'
      }, 0)
      .to(lineHRef.current, {
        strokeDashoffset: 0,
        opacity: 0.8,
        duration: 2,
        ease: 'power2.inOut'
      }, 0.2)
      .to(lineVRef.current, {
        strokeDashoffset: 0,
        opacity: 0.5,
        duration: 2.2,
        ease: 'power2.inOut'
      }, 0.3)
      .to(statement1Ref.current, {
        y: '0%',
        duration: 1.8,
        ease: 'power3.out'
      }, 1.4)
      .to(statement2Ref.current, {
        y: '0%',
        duration: 1.8,
        ease: 'power3.out'
      }, 1.8)
      .to(titleRef.current, {
        opacity: 0.45,
        scale: 0.96,
        duration: 1.5
      }, 2.0);
    });

    mm.add('(max-width: 768px)', () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom bottom',
          pin: pinRef.current,
          scrub: 1,
          anticipatePin: 1
        }
      });

      tl.to(titleRef.current, { scale: 1.03, duration: 2 }, 0)
      .to(statement1Ref.current, { y: '0%', duration: 1.4 }, 1.0)
      .to(statement2Ref.current, { y: '0%', duration: 1.4 }, 1.5);
    });

    return () => {
      if (idleTimelineRef.current) idleTimelineRef.current.kill();
      mm.revert();
    };
  }, { scope: sectionRef });

  // -------------------------------------------------------------
  // 3. CURSOR HIJACK EVENT HANDLERS
  // -------------------------------------------------------------
  const handleMouseEnter = () => {
    isHijackedRef.current = true;
    if (statusBadgeRef.current) statusBadgeRef.current.innerText = 'CURSOR HIJACKED // GRAVITATIONAL';
    // Pause autonomous idle timeline cleanly
    if (idleTimelineRef.current) {
      idleTimelineRef.current.pause();
    }
  };

  const handleMouseMove = (e) => {
    if (!markContainerRef.current) return;
    const rect = markContainerRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;

    // Relative mouse coordinate in SVG 300x300 space (center: 150, 150)
    const mx = 150 + ((e.clientX - cx) / (rect.width / 2)) * 110;
    const my = 150 + ((e.clientY - cy) / (rect.height / 2)) * 110;

    // Find closest node to mouse
    let closestIndex = 0;
    let minDistance = Infinity;
    BASE_NODES.forEach((node, idx) => {
      const dist = Math.hypot(node.x - mx, node.y - my);
      if (dist < minDistance) {
        minDistance = dist;
        closestIndex = idx;
      }
    });

    // Attract closest node towards cursor; repel other nodes outward
    nodeRefs.current.forEach((el, idx) => {
      if (!el) return;
      if (idx === closestIndex) {
        // Nearest node attracts
        const targetX = (mx - BASE_NODES[idx].x) * 0.55;
        const targetY = (my - BASE_NODES[idx].y) * 0.55;
        gsap.to(el, { x: targetX, y: targetY, duration: 0.25, overwrite: 'auto', ease: 'power2.out' });
        // Scale up active node
        gsap.to(el, { r: 5.5, fill: '#E6C65C', duration: 0.2, overwrite: 'auto' });
      } else {
        // Other nodes disperse away from cursor
        const angle = Math.atan2(BASE_NODES[idx].y - my, BASE_NODES[idx].x - mx);
        const repelDist = 24;
        const repelX = Math.cos(angle) * repelDist;
        const repelY = Math.sin(angle) * repelDist;
        gsap.to(el, { x: repelX, y: repelY, duration: 0.35, overwrite: 'auto', ease: 'power2.out' });
        gsap.to(el, { r: 3, fill: '#C9A227', duration: 0.2, overwrite: 'auto' });
      }
    });

    // Displace nucleus asymmetrically toward cursor
    if (nucleusRef.current) {
      const nucleusX = (mx - 150) * 0.18;
      const nucleusY = (my - 150) * 0.18;
      gsap.to(nucleusRef.current, { x: nucleusX, y: nucleusY, duration: 0.28, overwrite: 'auto' });
    }
  };

  const handleMouseLeave = () => {
    isHijackedRef.current = false;
    if (statusBadgeRef.current) statusBadgeRef.current.innerText = 'AUTONOMOUS // RECOVERING';

    // Smooth physical recovery: ease nodes and nucleus back to resting coordinates
    const recoveryDuration = 0.95;

    nodeRefs.current.forEach((el) => {
      if (el) {
        gsap.to(el, {
          x: 0,
          y: 0,
          r: 3.5,
          fill: '#E6C65C',
          duration: recoveryDuration,
          ease: 'elastic.out(1, 0.75)',
          overwrite: 'auto'
        });
      }
    });

    if (nucleusRef.current) {
      gsap.to(nucleusRef.current, {
        x: 0,
        y: 0,
        duration: recoveryDuration,
        ease: 'elastic.out(1, 0.75)',
        overwrite: 'auto'
      });
    }

    // Resume autonomous timeline once physical recovery has settled
    gsap.delayedCall(recoveryDuration * 0.85, () => {
      if (!isHijackedRef.current && idleTimelineRef.current) {
        idleTimelineRef.current.resume();
        if (statusBadgeRef.current) statusBadgeRef.current.innerText = 'AUTONOMOUS // ORBITING';
      }
    });
  };

  // Touch handler for mobile
  const handleTouchStart = () => {
    handleMouseEnter();
    setTimeout(handleMouseLeave, 1400);
  };

  return (
    <section ref={sectionRef} className="intro-section" id="intro" aria-label="Intro Section">
      <div ref={pinRef} className="intro-pin-container">
        {/* Architectural Background SVG Guides */}
        <svg
          className="intro-svg-canvas"
          viewBox="0 0 1440 900"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <line
            ref={lineHRef}
            x1="0"
            y1="450"
            x2="1440"
            y2="450"
            className="intro-axis-line"
            strokeDasharray="1440"
            strokeDashoffset="1440"
            style={{ opacity: 0 }}
          />
          <line
            ref={lineVRef}
            x1="520"
            y1="0"
            x2="520"
            y2="900"
            className="intro-axis-line"
            strokeDasharray="900"
            strokeDashoffset="900"
            style={{ opacity: 0 }}
          />
        </svg>

        {/* Top Technical Metadata Bar */}
        <div className="intro-meta-top">
          <div className="intro-meta-left">
            <span className="tech-tag">
              <span className="tech-tag-pulse" />
              SYSTEM // 001
            </span>
            <span className="intro-tag">IDENTITY & PROTOCOL</span>
          </div>
          <span className="intro-coord">28°36'N  77°12'E</span>
        </div>

        {/* Hero Composition */}
        <div className="intro-stage">
          {/* Floating Glass Instrument */}
          <GlassPanel
            variant="medium"
            geometry="pill"
            tilt={true}
            autonomousFloat={true}
            className="intro-floating-instrument"
            data-cursor="TELEMETRY"
          >
            <span className="instrument-gold-dot" />
            <span className="instrument-brand">[ ARTIFURA ]</span>
            <span className="instrument-divider">/</span>
            <span className="instrument-meta">SYSTEM // DIGITAL // 2026</span>
            <span className="instrument-pulse-badge">ACTIVE</span>
          </GlassPanel>

          {/* Left: Scaled Typography */}
          <div className="intro-text-column">
            <div className="intro-title-wrap">
              <h1 ref={titleRef} className="intro-title">
                Artifura
              </h1>
            </div>

            <div className="intro-subtitle-row">
              <span className="intro-subtitle">TECHNOLOGY COMPANY</span>
              <span className="tech-micro-label">// EST. 2026</span>
            </div>

            {/* Emergent Secondary Statement */}
            <div className="intro-statement-wrap" aria-label="We build what comes next">
              <span className="intro-statement-line">
                <span ref={statement1Ref} className="intro-statement-line-inner">
                  We Build
                </span>
              </span>
              <span className="intro-statement-line">
                <span ref={statement2Ref} className="intro-statement-line-inner">
                  What Comes Next.
                </span>
              </span>
            </div>
          </div>

          {/* Right: Abstract Motion Mark with Autonomous + Hijack Engine */}
          <div
            ref={markContainerRef}
            className="intro-mark-wrapper"
            onMouseEnter={handleMouseEnter}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onTouchStart={handleTouchStart}
            data-cursor="INTERACT"
            aria-label="Interactive Artifura Motion Mark"
          >
            <svg
              className="intro-motion-mark-svg"
              viewBox="0 0 300 300"
            >
              {/* Concentric Guide Rings */}
              <circle cx="150" cy="150" r="42" className="mark-orbit-ring" />
              <circle
                ref={orbitRingRef}
                cx="150"
                cy="150"
                r="82"
                className="mark-orbit-ring-dashed"
              />
              <circle cx="150" cy="150" r="124" className="mark-orbit-ring" />

              {/* Rotatable Orbital Vectors and Nodes */}
              <g ref={markGroupRef}>
                {/* Connecting hairline vectors from center to orbital nodes */}
                {BASE_NODES.map((node, i) => (
                  <line
                    key={`line-${i}`}
                    ref={(el) => (lineRefs.current[i] = el)}
                    x1="150"
                    y1="150"
                    x2={node.x}
                    y2={node.y}
                    className="mark-vector-line"
                  />
                ))}

                {/* Perimeter connective polygon */}
                <polygon
                  ref={polygonRef}
                  points="150,26 228,92 228,208 72,208 72,92"
                  fill="none"
                  stroke="rgba(201, 162, 39, 0.2)"
                  strokeWidth="1"
                />

                {/* 5 Orbital Nodes */}
                {BASE_NODES.map((node, i) => (
                  <circle
                    key={`node-${i}`}
                    ref={(el) => (nodeRefs.current[i] = el)}
                    cx={node.x}
                    cy={node.y}
                    r="3.5"
                    className="mark-node"
                  />
                ))}

                {/* Central Nucleus Node */}
                <circle
                  ref={nucleusRef}
                  cx="150"
                  cy="150"
                  r="4.5"
                  className="mark-center-nucleus"
                />
              </g>

              {/* Coordinate axis crosshairs */}
              <line x1="142" y1="150" x2="158" y2="150" stroke="#E6C65C" strokeWidth="1" />
              <line x1="150" y1="142" x2="150" y2="158" stroke="#E6C65C" strokeWidth="1" />
            </svg>

            {/* Dynamic Status Tag in Glass Badge */}
            <GlassPanel
              variant="light"
              geometry="straight"
              className="mark-meta-tag-glass"
            >
              <span ref={statusBadgeRef} className="tech-micro-label">
                AUTONOMOUS // ORBITING
              </span>
              <span className="tech-coord">[ 5 ORBIT VECTORS ]</span>
            </GlassPanel>
          </div>
        </div>

        {/* Bottom Technical Status Bar */}
        <div className="intro-footer">
          <div className="intro-scroll-indicator">
            <span className="intro-scroll-line" />
            <span>SCROLL TO EXPLORE SYSTEM</span>
          </div>
          <div className="intro-footer-detail">
            <span className="tech-micro-label">ENGINE: ACTIVE</span>
            <span>00 / 05</span>
          </div>
        </div>
      </div>
    </section>
  );
}
