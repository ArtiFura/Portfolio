import React, { useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import '../styles/systemInterlude.css';

gsap.registerPlugin(ScrollTrigger);

export default function SystemInterlude() {
  const sectionRef = useRef(null);
  const pinRef = useRef(null);
  const stateLabelRef = useRef(null);
  const svgRef = useRef(null);

  // Geometric element groups
  const satellitesGroupRef = useRef(null);
  const vectorsGroupRef = useRef(null);
  const outerRingRef = useRef(null);
  const nucleusRef = useRef(null);

  // Interaction states
  const [activeMode, setActiveMode] = useState('CALM'); // 'CALM' | 'DYNAMIC'

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) * 0.12;
    const dy = (e.clientY - cy) * 0.12;

    if (svgRef.current) {
      gsap.to(svgRef.current, {
        x: dx,
        y: dy,
        duration: 0.22,
        overwrite: 'auto',
        ease: 'power2.out'
      });
    }
  };

  const handleMouseLeave = () => {
    if (svgRef.current) {
      gsap.to(svgRef.current, {
        x: 0,
        y: 0,
        duration: 0.8,
        ease: 'power3.out',
        overwrite: 'auto'
      });
    }
  };

  const handleReset = () => {
    if (svgRef.current) {
      gsap.to(svgRef.current, {
        x: 0,
        y: 0,
        rotation: 0,
        duration: 0.8,
        ease: 'power3.out',
        overwrite: 'auto'
      });
    }
    setActiveMode('CALM');
  };

  useGSAP(() => {
    const mm = gsap.matchMedia();

    mm.add('(min-width: 769px)', () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom bottom',
          pin: pinRef.current,
          scrub: 0,
          anticipatePin: 1
        }
      });

      // Phase 1 (0 to 30%): State 01 - Dispersed components
      tl.to(satellitesGroupRef.current, {
        scale: 0.9,
        duration: 1
      }, 0);

      // Phase 2 (30% to 60%): State 02 - Components connect with center
      tl.call(() => { if (stateLabelRef.current) stateLabelRef.current.textContent = 'STATE 02 // VECTOR CONVERGENCE'; }, null, 1.2)
      .fromTo(vectorsGroupRef.current,
        { opacity: 0, scale: 1.3 },
        { opacity: 0.8, scale: 1, duration: 1.5, ease: 'power2.out' },
        1.2
      )
      .to(outerRingRef.current, {
        strokeDashoffset: 0,
        opacity: 0.5,
        duration: 1.5
      }, 1.4);

      // Phase 3 (60% to 85%): State 03 - Complete geometric system
      tl.call(() => { if (stateLabelRef.current) stateLabelRef.current.textContent = 'STATE 03 // RESONANT GEOMETRIC SYSTEM'; }, null, 2.5)
      .to(satellitesGroupRef.current, {
        rotation: 180,
        transformOrigin: '200px 200px',
        duration: 1.8,
        ease: 'power1.inOut'
      }, 2.5)
      .to(nucleusRef.current, {
        scale: 1.4,
        duration: 1
      }, 2.8);

      // Phase 4 (85% to 100%): State 04 - Collapse into unified ARTIFURA mark
      tl.call(() => { if (stateLabelRef.current) stateLabelRef.current.textContent = 'STATE 04 // COLLAPSE INTO MONOGRAM'; }, null, 3.8)
      .to(satellitesGroupRef.current, {
        scale: 0.35,
        opacity: 0.4,
        transformOrigin: '200px 200px',
        duration: 1.4,
        ease: 'power3.inOut'
      }, 3.8)
      .to(vectorsGroupRef.current, {
        scale: 0.5,
        opacity: 0.3,
        transformOrigin: '200px 200px',
        duration: 1.4
      }, 3.8)
      .to(outerRingRef.current, {
        scale: 0.45,
        transformOrigin: '200px 200px',
        opacity: 0.9,
        duration: 1.4
      }, 3.8)
      .to(nucleusRef.current, {
        scale: 1.8,
        fill: '#E6C65C',
        duration: 1.2
      }, 4.0);
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

      tl.to(satellitesGroupRef.current, {
        rotation: 120,
        transformOrigin: '200px 200px',
        duration: 2
      }, 0)
      .to(vectorsGroupRef.current, {
        opacity: 0.6,
        duration: 1.5
      }, 1)
      .to(satellitesGroupRef.current, {
        scale: 0.4,
        transformOrigin: '200px 200px',
        duration: 1.5
      }, 2.5);
    });

    return () => mm.revert();
  }, { scope: sectionRef });

  return (
    <section
      ref={sectionRef}
      className="interlude-section"
      id="system-interlude"
      aria-label="System Interlude Section"
    >
      <div ref={pinRef} className="interlude-pin-container">
        {/* Header */}
        <div className="interlude-header">
          <div className="interlude-meta-left">
            <span className="tech-tag">
              <span className="tech-tag-pulse" />
              SYSTEM / 001
            </span>
            <span className="tech-micro-label">INTERACTIVE MORPH STUDY</span>
          </div>
          <span className="tech-coord">[ 4 MORPH PHASES ]</span>
        </div>

        {/* Central Dynamic Stage */}
        <div className="interlude-stage">
          <span className="interlude-title-tag">GEOMETRIC STATE EVOLUTION</span>
          <span ref={stateLabelRef} className="interlude-state-badge">
            STATE 01 // DISPERSED PRIMITIVES
          </span>

          {/* Interactive SVG Canvas */}
          <div
            className="interlude-canvas-wrapper"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            data-cursor="MOVE"
            aria-label="Interactive geometric system canvas"
          >
            <svg
              ref={svgRef}
              className={`interlude-svg ${activeMode === 'DYNAMIC' ? 'dynamic-mode' : ''}`}
              viewBox="0 0 400 400"
            >
              {/* Outer Boundary Hairline Ring */}
              <circle
                ref={outerRingRef}
                cx="200"
                cy="200"
                r="160"
                stroke="var(--color-gold-hairline)"
                strokeWidth="1"
                fill="none"
                strokeDasharray="1000"
                strokeDashoffset="1000"
              />

              {/* Radial Coordinate Lines */}
              <g ref={vectorsGroupRef} style={{ opacity: 0.2 }}>
                <line x1="200" y1="200" x2="200" y2="40" className="interlude-vector" />
                <line x1="200" y1="200" x2="360" y2="200" className="interlude-vector" />
                <line x1="200" y1="200" x2="200" y2="360" className="interlude-vector" />
                <line x1="200" y1="200" x2="40" y2="200" className="interlude-vector" />

                <line x1="200" y1="200" x2="313" y2="87" className="interlude-vector" strokeDasharray="4 4" />
                <line x1="200" y1="200" x2="313" y2="313" className="interlude-vector" strokeDasharray="4 4" />
                <line x1="200" y1="200" x2="87" y2="313" className="interlude-vector" strokeDasharray="4 4" />
                <line x1="200" y1="200" x2="87" y2="87" className="interlude-vector" strokeDasharray="4 4" />
              </g>

              {/* Satellite Geometric Primitives */}
              <g ref={satellitesGroupRef}>
                {/* 4 Orbiting Squares */}
                <rect x="192" y="32" width="16" height="16" className="interlude-satellite-square" />
                <rect x="352" y="192" width="16" height="16" className="interlude-satellite-square" />
                <rect x="192" y="352" width="16" height="16" className="interlude-satellite-square" />
                <rect x="32" y="192" width="16" height="16" className="interlude-satellite-square" />

                {/* 4 Diagonal Circles */}
                <circle cx="313" cy="87" r="9" className="interlude-satellite-circle" />
                <circle cx="313" cy="313" r="9" className="interlude-satellite-circle" />
                <circle cx="87" cy="313" r="9" className="interlude-satellite-circle" />
                <circle cx="87" cy="87" r="9" className="interlude-satellite-circle" />

                {/* Concentric Secondary Ring */}
                <circle cx="200" cy="200" r="90" stroke="rgba(201, 162, 39, 0.2)" strokeWidth="1" fill="none" />
              </g>

              {/* Central Nucleus Node */}
              <circle
                ref={nucleusRef}
                cx="200"
                cy="200"
                r="6"
                className="interlude-center-nucleus"
              />
            </svg>
          </div>

          {/* Micro Interactive Controls */}
          <div className="interlude-controls-toolbar">
            <button
              type="button"
              className={`tech-pill-btn ${activeMode === 'CALM' ? 'active' : ''}`}
              onClick={() => setActiveMode('CALM')}
              aria-label="Set Mode Calm"
            >
              ○ CALM
            </button>
            <button
              type="button"
              className={`tech-pill-btn ${activeMode === 'DYNAMIC' ? 'active' : ''}`}
              onClick={() => setActiveMode('DYNAMIC')}
              aria-label="Set Mode Dynamic"
            >
              ● DYNAMIC
            </button>
            <button
              type="button"
              className="tech-pill-btn"
              onClick={handleReset}
              aria-label="Reset Geometry"
            >
              RESET
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="interlude-footer">
          <span className="tech-micro-label">SCROLL DRIVES SYSTEM TRANSITION</span>
          <span className="tech-coord">[ INTERLUDE // 02 ]</span>
        </div>
      </div>
    </section>
  );
}
