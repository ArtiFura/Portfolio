import React, { useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import GlassPanel from './GlassPanel';
import '../styles/philosophy.css';

gsap.registerPlugin(ScrollTrigger);

export default function Philosophy() {
  const sectionRef = useRef(null);
  const pinRef = useRef(null);
  const phaseIndicatorRef = useRef(null);

  // Slide wrappers
  const slide1Ref = useRef(null);
  const slide2Ref = useRef(null);
  const slide3Ref = useRef(null);
  const slide4Ref = useRef(null);

  // Phase 1 SVG refs (Genesis)
  const exp1DotRef = useRef(null);
  const exp1PathRef = useRef(null);
  const exp1LatticeRef = useRef(null);

  // Phase 2 SVG refs (Reduction)
  const exp2ClutterRef = useRef(null);
  const exp2PureRef = useRef(null);

  // Phase 2 Fracture Words Ref
  const fractureWordRefs = useRef([]);
  const textDriftTlRef = useRef(null);

  // Phase 3 SVG refs (Scale)
  const scaleVisualRef = useRef(null);
  const scaleNodesGroupRef = useRef(null);
  const scaleLinesRef = useRef(null);
  const scaleIdleTlRef = useRef(null);
  const isScaleHijackedRef = useRef(false);

  // Phase 4 Box
  const s4BoxRef = useRef(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();

    // -------------------------------------------------------------
    // 1. AUTONOMOUS IDLE TIMELINES
    // -------------------------------------------------------------
    // Autonomous Typography Drift on "Can it be simpler?"
    const driftTl = gsap.timeline({ repeat: -1, yoyo: true });
    driftTl.to(fractureWordRefs.current, {
      x: (i) => (i % 2 === 0 ? 3 : -3),
      duration: 3.5,
      stagger: 0.2,
      ease: 'sine.inOut'
    });
    textDriftTlRef.current = driftTl;

    // Autonomous 1 -> 3 -> 9 Scale Pulse on Slide 3
    const scaleTl = gsap.timeline({ repeat: -1 });
    scaleTl
      // State 1: 1 center node visible
      .to('.scale-satellite', { opacity: 0, scale: 0.5, duration: 1 })
      .to('.scale-center-node', { scale: 1.4, fill: '#E6C65C', duration: 1 }, 0)
      // State 2: 3 center horizontal nodes expand
      .to('.scale-row-center', { opacity: 1, scale: 1, duration: 1.2, ease: 'power2.out' }, 1.8)
      // State 3: Full 9 nodes expand
      .to('.scale-satellite', { opacity: 1, scale: 1, duration: 1.4, ease: 'power2.out' }, 3.5)
      .to(scaleLinesRef.current, { opacity: 0.6, duration: 1.2 }, 3.5)
      // State 4: Contraction back to 1
      .to('.scale-satellite', { opacity: 0, scale: 0.4, duration: 1.4, ease: 'power2.in' }, 5.5)
      .to(scaleLinesRef.current, { opacity: 0, duration: 1 }, 5.5);

    scaleIdleTlRef.current = scaleTl;

    // Viewport Culling: Pause text drift & scale animations when offscreen
    ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top bottom',
      end: 'bottom top',
      onEnter: () => {
        textDriftTlRef.current?.resume();
        scaleIdleTlRef.current?.resume();
      },
      onLeave: () => {
        textDriftTlRef.current?.pause();
        scaleIdleTlRef.current?.pause();
      },
      onEnterBack: () => {
        textDriftTlRef.current?.resume();
        scaleIdleTlRef.current?.resume();
      },
      onLeaveBack: () => {
        textDriftTlRef.current?.pause();
        scaleIdleTlRef.current?.pause();
      }
    });

    // -------------------------------------------------------------
    // 2. SCROLL CHOREOGRAPHY
    // -------------------------------------------------------------
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

      // Phase 1 (0 to 2.2)
      tl.fromTo(slide1Ref.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1.2, ease: 'power2.out' },
        0
      )
      .fromTo(exp1PathRef.current,
        { strokeDashoffset: 500 },
        { strokeDashoffset: 0, duration: 1.8, ease: 'power1.inOut' },
        0.2
      )
      .fromTo(exp1LatticeRef.current,
        { opacity: 0, scale: 0.8 },
        { opacity: 1, scale: 1, duration: 1.6, ease: 'power2.out' },
        0.5
      )
      .call(() => { if (phaseIndicatorRef.current) phaseIndicatorRef.current.textContent = '01 // GENESIS & ORIGIN'; }, null, 0);

      // Transition Slide 1 OUT
      tl.to(slide1Ref.current, {
        opacity: 0,
        y: -40,
        duration: 1,
        ease: 'power2.in'
      }, 2.2);

      // Phase 2 (3.2 to 5.4): Can it be simpler?
      tl.call(() => { if (phaseIndicatorRef.current) phaseIndicatorRef.current.textContent = '02 // REDUCTION & PURITY'; }, null, 3.0)
      .fromTo(slide2Ref.current,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 1.2, ease: 'power2.out' },
        3.2
      )
      .to(exp2ClutterRef.current, {
        opacity: 0,
        scale: 0.9,
        transformOrigin: '150px 150px',
        duration: 1.6,
        ease: 'power2.inOut'
      }, 3.6)
      .fromTo(exp2PureRef.current,
        { strokeDashoffset: 400, opacity: 0.3 },
        { strokeDashoffset: 0, opacity: 1, duration: 1.6, ease: 'power2.out' },
        3.8
      );

      // Transition Slide 2 OUT
      tl.to(slide2Ref.current, {
        opacity: 0,
        y: -40,
        duration: 0.8,
        ease: 'power2.in'
      }, 5.4);

      // Phase 3 (6.2 to 8.0): What happens when it scales?
      tl.call(() => { if (phaseIndicatorRef.current) phaseIndicatorRef.current.textContent = '03 // SYSTEMIC SCALE'; }, null, 6.0)
      .fromTo(slide3Ref.current,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 1.2, ease: 'power2.out' },
        6.2
      );

      // Transition Slide 3 OUT
      tl.to(slide3Ref.current, {
        opacity: 0,
        y: -40,
        duration: 0.6
      }, 8.0);

      // Phase 4 (8.6 to 10.0): Build with intention.
      tl.call(() => { if (phaseIndicatorRef.current) phaseIndicatorRef.current.textContent = '04 // CONVICTION & MANDATE'; }, null, 8.5)
      .fromTo(slide4Ref.current,
        { opacity: 0, scale: 0.94 },
        { opacity: 1, scale: 1, duration: 1.4, ease: 'power3.out' },
        8.6
      )
      .fromTo(s4BoxRef.current,
        { borderColor: 'rgba(201, 162, 39, 0.15)' },
        { borderColor: 'rgba(201, 162, 39, 0.65)', duration: 1.2 },
        8.8
      );
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

      tl.fromTo(slide1Ref.current, { opacity: 0 }, { opacity: 1, duration: 1 }, 0)
      .to(slide1Ref.current, { opacity: 0, duration: 0.8 }, 2.2)
      .fromTo(slide2Ref.current, { opacity: 0 }, { opacity: 1, duration: 1 }, 3.0)
      .to(slide2Ref.current, { opacity: 0, duration: 0.8 }, 5.2)
      .fromTo(slide3Ref.current, { opacity: 0 }, { opacity: 1, duration: 1 }, 6.0)
      .to(slide3Ref.current, { opacity: 0, duration: 0.8 }, 7.8)
      .fromTo(slide4Ref.current, { opacity: 0 }, { opacity: 1, duration: 1 }, 8.5);
    });

    return () => {
      if (textDriftTlRef.current) textDriftTlRef.current.kill();
      if (scaleIdleTlRef.current) scaleIdleTlRef.current.kill();
      mm.revert();
    };
  }, { scope: sectionRef });

  // -------------------------------------------------------------
  // 3. CURSOR HIJACK: WORD FRACTURE (Phase 2)
  // -------------------------------------------------------------
  const handleWordFractureEnter = () => {
    if (textDriftTlRef.current) textDriftTlRef.current.pause();

    // Staggered spatial displacement offsets for "Can" "it" "be" "simpler?"
    const offsets = [
      { x: -34, y: -20, rot: -7 },
      { x: 28, y: -16, rot: 9 },
      { x: -18, y: 22, rot: -5 },
      { x: 38, y: 18, rot: 8 }
    ];

    fractureWordRefs.current.forEach((el, idx) => {
      if (el) {
        gsap.to(el, {
          x: offsets[idx].x,
          y: offsets[idx].y,
          rotation: offsets[idx].rot,
          duration: 0.45,
          ease: 'power3.out',
          overwrite: 'auto'
        });
      }
    });
  };

  const handleWordFractureLeave = () => {
    const recoveryDuration = 0.85;

    fractureWordRefs.current.forEach((el) => {
      if (el) {
        gsap.to(el, {
          x: 0,
          y: 0,
          rotation: 0,
          duration: recoveryDuration,
          ease: 'power3.out',
          overwrite: 'auto'
        });
      }
    });

    gsap.delayedCall(recoveryDuration * 0.9, () => {
      if (textDriftTlRef.current) textDriftTlRef.current.resume();
    });
  };

  // -------------------------------------------------------------
  // 4. CURSOR HIJACK: DYNAMIC SCALE MATRIX (Phase 3)
  // -------------------------------------------------------------
  const handleScaleEnter = () => {
    isScaleHijackedRef.current = true;
    if (scaleIdleTlRef.current) scaleIdleTlRef.current.pause();
    // Make all nodes active for cursor modulation
    gsap.to('.scale-node', { opacity: 1, duration: 0.3 });
    gsap.to(scaleLinesRef.current, { opacity: 0.5, duration: 0.3 });
  };

  const handleScaleMove = (e) => {
    if (!scaleVisualRef.current) return;
    const rect = scaleVisualRef.current.getBoundingClientRect();
    const relX = (e.clientX - rect.left) / rect.width; // 0 to 1

    // Scale factor: left = compress (0.5), center = standard (1.0), right = expand (1.55)
    const dynamicScale = 0.45 + relX * 1.15;

    if (scaleNodesGroupRef.current) {
      gsap.to(scaleNodesGroupRef.current, {
        scale: dynamicScale,
        transformOrigin: '150px 150px',
        duration: 0.2,
        overwrite: 'auto',
        ease: 'power2.out'
      });
    }
  };

  const handleScaleLeave = () => {
    isScaleHijackedRef.current = false;
    const recoveryDuration = 0.9;

    if (scaleNodesGroupRef.current) {
      gsap.to(scaleNodesGroupRef.current, {
        scale: 1,
        transformOrigin: '150px 150px',
        duration: recoveryDuration,
        ease: 'power3.out',
        overwrite: 'auto'
      });
    }

    gsap.delayedCall(recoveryDuration * 0.85, () => {
      if (!isScaleHijackedRef.current && scaleIdleTlRef.current) {
        scaleIdleTlRef.current.resume();
      }
    });
  };

  return (
    <section ref={sectionRef} className="philosophy-section" id="philosophy" aria-label="Philosophy Section">
      <div ref={pinRef} className="philosophy-pin-container">
        {/* Header */}
        <div className="philosophy-header">
          <div className="philosophy-meta-left">
            <span className="tech-tag">
              <span className="tech-tag-pulse" />
              PRINCIPLE // 03
            </span>
            <span className="philosophy-label">INTENTIONAL MOTION STUDIES</span>
          </div>
          <span ref={phaseIndicatorRef} className="philosophy-phase-indicator">
            01 // GENESIS & ORIGIN
          </span>
        </div>

        {/* Dynamic Choreographed Typography & Visual Experiment Stage */}
        <div className="philosophy-stage">
          {/* Phase 1: Why does it need to exist? (Genesis) */}
          <div ref={slide1Ref} className="philo-slide">
            <div className="philo-slide-text">
              <span className="tech-micro-label">[ 01 // FIRST PRINCIPLES ]</span>
              <h2 className="philo-slide-title">
                Why does it need to exist?
              </h2>
              <span className="philo-slide-desc">Originating form only through functional necessity</span>
            </div>
            <div className="philo-slide-visual" data-cursor="EXPLORE">
              <svg className="philo-exp-svg" viewBox="0 0 300 300">
                <g ref={exp1LatticeRef}>
                  <line x1="30" y1="150" x2="270" y2="150" className="exp1-lattice-line" />
                  <line x1="150" y1="30" x2="150" y2="270" className="exp1-lattice-line" />
                  <circle cx="150" cy="150" r="90" className="exp1-lattice-line" />
                </g>
                <path
                  ref={exp1PathRef}
                  d="M 50,150 Q 100,50 150,150 T 250,150"
                  className="exp1-path-active"
                  strokeDasharray="500"
                  strokeDashoffset="500"
                />
                <circle ref={exp1DotRef} cx="50" cy="150" r="4.5" fill="#E6C65C" />
              </svg>
            </div>
          </div>

          {/* Phase 2: Can it be simpler? (Autonomous Drift + Word Fracture Hijack) */}
          <div ref={slide2Ref} className="philo-slide" style={{ opacity: 0 }}>
            <div
              className="philo-slide-text"
              onMouseEnter={handleWordFractureEnter}
              onMouseLeave={handleWordFractureLeave}
              data-cursor="FRACTURE"
            >
              {/* Floating Architectural Glass Fragment Layer */}
              <GlassPanel
                variant="light"
                geometry="chamfer"
                className="philo-glass-fragment"
                aria-hidden="true"
              />

              <span className="tech-micro-label">[ 02 // SUBTRACTIVE DISCIPLINE ]</span>
              <h2 className="philo-slide-title fracture-word-container">
                {['Can', 'it', 'be', 'simpler?'].map((word, i) => (
                  <span
                    key={word}
                    ref={(el) => (fractureWordRefs.current[i] = el)}
                    className="fracture-word"
                  >
                    {word}
                  </span>
                ))}
              </h2>
              <span className="philo-slide-desc">Hover text to disperse thought into components</span>
            </div>

            <div className="philo-slide-visual" data-cursor="EXPLORE">
              <svg className="philo-exp-svg" viewBox="0 0 300 300">
                <g ref={exp2ClutterRef}>
                  <line x1="40" y1="60" x2="260" y2="240" className="exp2-clutter-line" />
                  <line x1="60" y1="240" x2="240" y2="60" className="exp2-clutter-line" />
                  <line x1="30" y1="180" x2="270" y2="120" className="exp2-clutter-line" />
                  <line x1="120" y1="30" x2="180" y2="270" className="exp2-clutter-line" />
                  <rect x="70" y="70" width="160" height="160" className="exp2-clutter-line" />
                </g>
                <ellipse
                  ref={exp2PureRef}
                  cx="150"
                  cy="150"
                  rx="100"
                  ry="55"
                  className="exp2-pure-shape"
                  transform="rotate(-25 150 150)"
                  strokeDasharray="400"
                  strokeDashoffset="400"
                />
              </svg>
            </div>
          </div>

          {/* Phase 3: What happens when it scales? (Autonomous Loop + Cursor Coordinate Hijack) */}
          <div ref={slide3Ref} className="philo-slide" style={{ opacity: 0 }}>
            <div className="philo-slide-text">
              <span className="tech-micro-label">[ 03 // ARCHITECTURAL SCALE ]</span>
              <h2 className="philo-slide-title">
                What happens when it scales?
              </h2>
              <span className="philo-slide-desc">Cursor X controls density: Left (compress) to Right (expand)</span>
            </div>

            <div
              ref={scaleVisualRef}
              className="philo-slide-visual"
              onMouseEnter={handleScaleEnter}
              onMouseMove={handleScaleMove}
              onMouseLeave={handleScaleLeave}
              data-cursor="SCALE"
            >
              <svg className="philo-exp-svg" viewBox="0 0 300 300">
                <g ref={scaleNodesGroupRef}>
                  {/* Grid Lines */}
                  <g ref={scaleLinesRef} style={{ opacity: 0 }}>
                    <line x1="80" y1="80" x2="220" y2="80" className="exp3-grid-line" />
                    <line x1="80" y1="150" x2="220" y2="150" className="exp3-grid-line" />
                    <line x1="80" y1="220" x2="220" y2="220" className="exp3-grid-line" />
                    <line x1="80" y1="80" x2="80" y2="220" className="exp3-grid-line" />
                    <line x1="150" y1="80" x2="150" y2="220" className="exp3-grid-line" />
                    <line x1="220" y1="80" x2="220" y2="220" className="exp3-grid-line" />
                  </g>
                  {/* 3x3 Grid Nodes with classes for autonomous pulse */}
                  {[80, 150, 220].map((x) =>
                    [80, 150, 220].map((y) => {
                      const isCenter = x === 150 && y === 150;
                      const isCenterRow = y === 150;
                      const cls = isCenter
                        ? 'scale-node scale-center-node'
                        : isCenterRow
                        ? 'scale-node scale-row-center scale-satellite'
                        : 'scale-node scale-satellite';
                      return (
                        <circle
                          key={`node-${x}-${y}`}
                          cx={x}
                          cy={y}
                          r={isCenter ? 4.5 : 3.5}
                          className={`exp3-grid-node ${cls}`}
                        />
                      );
                    })
                  )}
                </g>
              </svg>
            </div>
          </div>

          {/* Phase 4: Build with intention. (Culmination) */}
          <div ref={slide4Ref} className="philo-s4-container" style={{ opacity: 0 }}>
            <GlassPanel
              ref={s4BoxRef}
              variant="deep"
              geometry="brackets"
              tilt={true}
              className="philo-s4-box"
              data-cursor="INTERACT"
            >
              <span className="tech-micro-label">// DIRECTIVE 01</span>
              <h2 className="philo-s4-text">
                Build with intention.
              </h2>
              <span className="philo-s4-sub">RADICAL DISCIPLINE & ELEGANCE</span>
            </GlassPanel>
          </div>
        </div>

        {/* Footer */}
        <div className="philosophy-footer">
          <span className="tech-micro-label">SCROLL DRIVES PHILOSOPHICAL REVELATION</span>
          <span className="tech-coord">[ 03 / 05 ]</span>
        </div>
      </div>
    </section>
  );
}
