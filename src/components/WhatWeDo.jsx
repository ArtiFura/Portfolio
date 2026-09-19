import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import GlassPanel from './GlassPanel';
import '../styles/whatWeDo.css';

gsap.registerPlugin(ScrollTrigger);

const MATRIX_NODES = [
  { x: 90, y: 25 }, { x: 210, y: 25 }, { x: 330, y: 25 },
  { x: 90, y: 55 }, { x: 210, y: 55 }, { x: 330, y: 55 }
];

export default function WhatWeDo() {
  const sectionRef = useRef(null);
  const pinRef = useRef(null);
  const row1Ref = useRef(null);
  const row2Ref = useRef(null);
  const row3Ref = useRef(null);

  // -------------------------------------------------------------
  // System 1: SOFTWARE Refs (Zero React State)
  // -------------------------------------------------------------
  const swPacketRef = useRef(null);
  const swAuxLineRef = useRef(null);
  const swIdleTlRef = useRef(null);

  // -------------------------------------------------------------
  // System 2: SYSTEMS Matrix Refs (Zero React State)
  // -------------------------------------------------------------
  const sysMatrixGroupRef = useRef(null);
  const sysBridgeLinesGroupRef = useRef(null);
  const sysBridgeLinesRef = useRef([]);
  const sysHubGroupRef = useRef(null);
  const sysIdleTlRef = useRef(null);

  // -------------------------------------------------------------
  // System 3: DIGITAL EXPERIENCES Refs (Zero React State)
  // -------------------------------------------------------------
  const deViewportCurveRef = useRef(null);
  const deCrosshairRef = useRef(null);
  const deReadoutRef = useRef(null);
  const deStateTextRef = useRef(null);
  const deIdleTlRef = useRef(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();

    // =============================================================
    // 1. AUTONOMOUS TIMELINES FOR ALL THREE VISUAL SYSTEMS
    // =============================================================

    // Software: Continuous Dataflow Loop (Input -> Process -> Output)
    const swTl = gsap.timeline({ repeat: -1 });
    swTl.fromTo(swPacketRef.current,
      { x: 30, opacity: 0 },
      { x: 210, opacity: 1, duration: 1.8, ease: 'power1.inOut' }
    )
    .to('.flow-process-box', { stroke: '#E6C65C', duration: 0.4, yoyo: true, repeat: 1 }, 1.6)
    .to(swPacketRef.current, {
      x: 375,
      opacity: 1,
      duration: 1.6,
      ease: 'power1.inOut'
    })
    .to(swPacketRef.current, { opacity: 0, duration: 0.3 });
    swIdleTlRef.current = swTl;

    // Systems: Continuous Matrix Connection / Disconnection Reorganization
    const sysTl = gsap.timeline({ repeat: -1 });
    sysTl.to('.matrix-cross-trace', { strokeDashoffset: 0, opacity: 0.7, stagger: 0.2, duration: 1.5 })
      .to('.matrix-node', { scale: 1.3, transformOrigin: 'center center', duration: 1, yoyo: true, repeat: 1 }, 1.2)
      .to('.matrix-cross-trace', { opacity: 0.15, duration: 1.2 }, 3.5)
      .to('.matrix-bus-h', { opacity: 0.9, stroke: '#E6C65C', duration: 1.2 }, 4.0)
      .to('.matrix-bus-h', { opacity: 0.4, stroke: 'var(--color-gold-hairline)', duration: 1 }, 5.2);
    sysIdleTlRef.current = sysTl;

    // Digital Experiences: Continuous 3-State Viewport Morph
    const deTl = gsap.timeline({ repeat: -1 });
    deTl.to(deViewportCurveRef.current, {
      attr: { d: 'M 50,40 Q 150,15 210,40 T 370,40' },
      duration: 2.2,
      ease: 'power2.inOut'
    })
    .call(() => { if (deStateTextRef.current) deStateTextRef.current.textContent = 'STATE 01 // HARMONIC WAVE'; }, null, 0)
    .to(deViewportCurveRef.current, {
      attr: { d: 'M 50,55 L 140,55 L 140,25 L 260,25 L 260,55 L 370,55' },
      duration: 2.2,
      ease: 'power2.inOut'
    }, 2.8)
    .call(() => { if (deStateTextRef.current) deStateTextRef.current.textContent = 'STATE 02 // DISCRETE CLOCK'; }, null, 2.8)
    .to(deCrosshairRef.current, { x: 260, y: 25, duration: 1.5, ease: 'power2.out' }, 3.2)
    .to(deViewportCurveRef.current, {
      attr: { d: 'M 50,48 C 110,28 170,64 230,38 S 330,56 370,42' },
      duration: 2.2,
      ease: 'power2.inOut'
    }, 5.6)
    .call(() => { if (deStateTextRef.current) deStateTextRef.current.textContent = 'STATE 03 // PARAMETRIC RES'; }, null, 5.6)
    .to(deCrosshairRef.current, { x: 210, y: 40, duration: 1.5, ease: 'power2.out' }, 6.0);
    deIdleTlRef.current = deTl;

    // =============================================================
    // 2. VIEWPORT CULLING (Pause all 3 autonomous loops when offscreen)
    // =============================================================
    ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top bottom',
      end: 'bottom top',
      onEnter: () => {
        swIdleTlRef.current?.resume();
        sysIdleTlRef.current?.resume();
        deIdleTlRef.current?.resume();
      },
      onLeave: () => {
        swIdleTlRef.current?.pause();
        sysIdleTlRef.current?.pause();
        deIdleTlRef.current?.pause();
      },
      onEnterBack: () => {
        swIdleTlRef.current?.resume();
        sysIdleTlRef.current?.resume();
        deIdleTlRef.current?.resume();
      },
      onLeaveBack: () => {
        swIdleTlRef.current?.pause();
        sysIdleTlRef.current?.pause();
        deIdleTlRef.current?.pause();
      }
    });

    // =============================================================
    // 3. SCROLL CHOREOGRAPHY
    // =============================================================
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

      tl.fromTo(row1Ref.current,
        { x: -30, opacity: 0.5 },
        { x: 0, opacity: 1, duration: 2, ease: 'power2.out' },
        0
      )
      .fromTo(row2Ref.current,
        { x: 30, opacity: 0.5 },
        { x: 0, opacity: 1, duration: 2.2, ease: 'power2.out' },
        0.3
      )
      .fromTo(row3Ref.current,
        { x: -30, opacity: 0.5 },
        { x: 0, opacity: 1, duration: 2.4, ease: 'power2.out' },
        0.6
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

      tl.fromTo([row1Ref.current, row2Ref.current, row3Ref.current],
        { opacity: 0.3, y: 20 },
        { opacity: 1, y: 0, stagger: 0.25, duration: 2, ease: 'power2.out' },
        0
      );
    });

    return () => {
      if (swIdleTlRef.current) swIdleTlRef.current.kill();
      if (sysIdleTlRef.current) sysIdleTlRef.current.kill();
      if (deIdleTlRef.current) deIdleTlRef.current.kill();
      mm.revert();
    };
  }, { scope: sectionRef });

  // -------------------------------------------------------------
  // System 1: SOFTWARE Cursor Hijack Handlers (Direct DOM / Zero Re-renders)
  // -------------------------------------------------------------
  const handleSwMouseEnter = () => {
    if (swIdleTlRef.current) swIdleTlRef.current.pause();
    if (swAuxLineRef.current) {
      swAuxLineRef.current.style.opacity = '1';
    }
  };

  const handleSwMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const mx = ((e.clientX - rect.left) / rect.width) * 420;
    const my = ((e.clientY - rect.top) / rect.height) * 80;

    if (swAuxLineRef.current) {
      swAuxLineRef.current.setAttribute('x1', mx);
      swAuxLineRef.current.setAttribute('y1', my);
    }

    if (swPacketRef.current) {
      gsap.to(swPacketRef.current, {
        x: mx,
        y: my - 40,
        opacity: 1,
        duration: 0.15,
        overwrite: 'auto',
        ease: 'power2.out'
      });
    }
  };

  const handleSwMouseLeave = () => {
    if (swAuxLineRef.current) {
      swAuxLineRef.current.style.opacity = '0';
    }
    if (swPacketRef.current) {
      gsap.to(swPacketRef.current, {
        x: 30,
        y: 0,
        opacity: 0,
        duration: 0.7,
        ease: 'power2.out',
        onComplete: () => {
          if (swIdleTlRef.current) swIdleTlRef.current.resume();
        }
      });
    }
  };

  // -------------------------------------------------------------
  // System 2: SYSTEMS Matrix Cursor Hijack Handlers (Direct DOM / Zero Re-renders)
  // -------------------------------------------------------------
  const handleSysMouseEnter = () => {
    if (sysIdleTlRef.current) sysIdleTlRef.current.pause();
    if (sysBridgeLinesGroupRef.current) {
      sysBridgeLinesGroupRef.current.style.opacity = '1';
    }
    if (sysHubGroupRef.current) {
      sysHubGroupRef.current.style.opacity = '1';
    }
  };

  const handleSysMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const mx = ((e.clientX - rect.left) / rect.width) * 420;
    const my = ((e.clientY - rect.top) / rect.height) * 80;

    // Direct SVG attribute updates (Zero React renders)
    sysBridgeLinesRef.current.forEach((line) => {
      if (line) {
        line.setAttribute('x2', mx);
        line.setAttribute('y2', my);
      }
    });

    if (sysHubGroupRef.current) {
      sysHubGroupRef.current.setAttribute('transform', `translate(${mx}, ${my})`);
    }
  };

  const handleSysMouseLeave = () => {
    if (sysBridgeLinesGroupRef.current) {
      sysBridgeLinesGroupRef.current.style.opacity = '0';
    }
    if (sysHubGroupRef.current) {
      sysHubGroupRef.current.style.opacity = '0';
    }
    gsap.delayedCall(0.7, () => {
      if (sysIdleTlRef.current) sysIdleTlRef.current.resume();
    });
  };

  // -------------------------------------------------------------
  // System 3: DIGITAL EXPERIENCES Handlers (Direct DOM / Zero Re-renders)
  // -------------------------------------------------------------
  const handleDeMouseEnter = () => {
    if (deIdleTlRef.current) deIdleTlRef.current.pause();
    if (deStateTextRef.current) deStateTextRef.current.innerText = 'CURSOR INPUT: ACTIVE';
  };

  const handleDeMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const mx = Math.max(50, Math.min(370, ((e.clientX - rect.left) / rect.width) * 420));
    const my = Math.max(20, Math.min(60, ((e.clientY - rect.top) / rect.height) * 80));

    if (deReadoutRef.current) {
      deReadoutRef.current.textContent = `X: ${Math.round(mx)}  Y: ${Math.round(my)}`;
    }

    if (deCrosshairRef.current) {
      gsap.to(deCrosshairRef.current, { x: mx, y: my, duration: 0.12, overwrite: 'auto', ease: 'power2.out' });
    }

    if (deViewportCurveRef.current) {
      deViewportCurveRef.current.setAttribute('d', `M 50,45 Q ${mx},${my} 370,45`);
    }
  };

  const handleDeMouseLeave = () => {
    const recoveryDuration = 0.85;
    if (deCrosshairRef.current) {
      gsap.to(deCrosshairRef.current, { x: 210, y: 40, duration: recoveryDuration, ease: 'power2.out' });
    }
    if (deViewportCurveRef.current) {
      gsap.to(deViewportCurveRef.current, {
        attr: { d: 'M 50,48 C 110,28 170,64 230,38 S 330,56 370,42' },
        duration: recoveryDuration,
        ease: 'power2.out'
      });
    }
    gsap.delayedCall(recoveryDuration * 0.85, () => {
      if (deIdleTlRef.current) deIdleTlRef.current.resume();
    });
  };

  return (
    <section ref={sectionRef} className="whatwedo-section" id="what-we-do" aria-label="What We Do Section">
      <div ref={pinRef} className="whatwedo-pin-container">
        {/* Header */}
        <div className="whatwedo-header">
          <div className="whatwedo-meta-left">
            <span className="tech-tag">
              <span className="tech-tag-pulse" />
              CAPABILITIES // 04
            </span>
            <span className="tech-micro-label">THREE OPERATING DOMAINS</span>
          </div>
          <span className="tech-coord">[ 04 / 05 ]</span>
        </div>

        {/* Typographic & Visual Systems Stage */}
        <div className="whatwedo-stage">
          {/* Discipline 01: SOFTWARE (Autonomous Pipeline + Cursor Routing Hijack) */}
          <GlassPanel
            ref={row1Ref}
            variant="medium"
            geometry="chamfer"
            tilt={true}
            className="whatwedo-discipline-row whatwedo-glass-module"
            onMouseEnter={handleSwMouseEnter}
            onMouseMove={handleSwMouseMove}
            onMouseLeave={handleSwMouseLeave}
            data-cursor="ROUTING"
          >
            <div className="discipline-info">
              <div className="discipline-tag-row">
                <span className="module-gold-beacon" />
                <span className="tech-micro-label">[ 01 ]</span>
                <span className="tech-coord">ALGORITHMIC FLOW</span>
              </div>
              <h3 className="discipline-word">Software</h3>
            </div>

            <div className="discipline-visual-box">
              <svg className="discipline-svg" viewBox="0 0 420 80">
                <line x1="80" y1="40" x2="160" y2="40" className="flow-line" />
                <line x1="260" y1="40" x2="340" y2="40" className="flow-line" />

                {/* Auxiliary vector from cursor to process box when hijacked */}
                <line
                  ref={swAuxLineRef}
                  x1="0"
                  y1="0"
                  x2="210"
                  y2="40"
                  stroke="#E6C65C"
                  strokeWidth="1.2"
                  strokeDasharray="3 3"
                  style={{ opacity: 0, transition: 'opacity 0.2s ease' }}
                />

                {/* Node Box 1: Input */}
                <rect x="20" y="24" width="60" height="32" rx="2" className="flow-node-box" />
                <text x="50" y="40" className="flow-node-text">INPUT</text>

                {/* Node Box 2: Kernel Process */}
                <rect x="155" y="16" width="110" height="48" rx="3" className="flow-node-box flow-process-box" />
                <text x="210" y="34" className="flow-node-text" style={{ fontWeight: '800', fontSize: '8px' }}>PROCESS</text>
                <text x="210" y="47" className="flow-node-text" style={{ fontSize: '6.2px' }}>CORE ENGINE</text>

                {/* Node Box 3: Output */}
                <rect x="340" y="24" width="65" height="32" rx="2" className="flow-node-box" />
                <text x="372" y="40" className="flow-node-text">OUTPUT</text>

                {/* Dynamic Data Packet */}
                <circle ref={swPacketRef} cx="0" cy="40" r="3.5" fill="#E6C65C" />
              </svg>
            </div>
          </GlassPanel>

          {/* Discipline 02: SYSTEMS (Autonomous Loop + Central Server Hub Hijack) */}
          <GlassPanel
            ref={row2Ref}
            variant="medium"
            geometry="chamfer"
            tilt={true}
            className="whatwedo-discipline-row whatwedo-glass-module"
            onMouseEnter={handleSysMouseEnter}
            onMouseMove={handleSysMouseMove}
            onMouseLeave={handleSysMouseLeave}
            data-cursor="SERVER"
          >
            <div className="discipline-info">
              <div className="discipline-tag-row">
                <span className="module-gold-beacon" />
                <span className="tech-micro-label">[ 02 ]</span>
                <span className="tech-coord">MULTI-TIER TOPOLOGY</span>
              </div>
              <h3 className="discipline-word">Systems</h3>
            </div>

            <div className="discipline-visual-box">
              <svg className="discipline-svg" viewBox="0 0 420 80">
                <g ref={sysMatrixGroupRef}>
                  <line x1="50" y1="25" x2="370" y2="25" className="matrix-line matrix-bus-h" />
                  <line x1="50" y1="55" x2="370" y2="55" className="matrix-line matrix-bus-h" />

                  <line x1="90" y1="25" x2="90" y2="55" className="matrix-line-active" />
                  <line x1="210" y1="25" x2="210" y2="55" className="matrix-line-active" />
                  <line x1="330" y1="25" x2="330" y2="55" className="matrix-line-active" />

                  {/* Diagonal cross traces for autonomous reorganization */}
                  <line x1="90" y1="25" x2="210" y2="55" className="matrix-cross-trace" stroke="rgba(230, 198, 92, 0.3)" strokeWidth="1" strokeDasharray="140" strokeDashoffset="140" fill="none" />
                  <line x1="210" y1="25" x2="330" y2="55" className="matrix-cross-trace" stroke="rgba(230, 198, 92, 0.3)" strokeWidth="1" strokeDasharray="140" strokeDashoffset="140" fill="none" />

                  {/* Dynamic bridge lines to cursor server hub */}
                  <g ref={sysBridgeLinesGroupRef} style={{ opacity: 0, transition: 'opacity 0.2s ease' }}>
                    {MATRIX_NODES.map((node, i) => (
                      <line
                        key={`bridge-${i}`}
                        ref={(el) => (sysBridgeLinesRef.current[i] = el)}
                        x1={node.x}
                        y1={node.y}
                        x2="210"
                        y2="40"
                        stroke="#E6C65C"
                        strokeWidth="1.2"
                        strokeDasharray="2 4"
                      />
                    ))}
                  </g>

                  {/* Active cursor hub node */}
                  <g ref={sysHubGroupRef} transform="translate(210, 40)" style={{ opacity: 0, transition: 'opacity 0.2s ease' }}>
                    <circle cx="0" cy="0" r="10" stroke="#E6C65C" strokeWidth="1" fill="none" />
                    <circle cx="0" cy="0" r="3" fill="#E6C65C" />
                    <text x="12" y="3" className="flow-node-text" style={{ fontSize: '6.5px' }}>
                      CURSOR HUB
                    </text>
                  </g>

                  {/* 6 Fixed Matrix Nodes */}
                  {MATRIX_NODES.map((node, i) => (
                    <circle key={`node-${i}`} cx={node.x} cy={node.y} r="3.5" className="matrix-node" />
                  ))}
                </g>
              </svg>
            </div>
          </GlassPanel>

          {/* Discipline 03: DIGITAL EXPERIENCES (Autonomous State Morph + Precision Device Hijack) */}
          <GlassPanel
            ref={row3Ref}
            variant="medium"
            geometry="chamfer"
            tilt={true}
            className="whatwedo-discipline-row whatwedo-glass-module"
            onMouseEnter={handleDeMouseEnter}
            onMouseMove={handleDeMouseMove}
            onMouseLeave={handleDeMouseLeave}
            data-cursor="PROTOTYPE"
          >
            <div className="discipline-info">
              <div className="discipline-tag-row">
                <span className="module-gold-beacon" />
                <span className="tech-micro-label">[ 03 ]</span>
                <span className="tech-coord">KINETIC INTERFACES</span>
              </div>
              <h3 className="discipline-word">Digital Experiences</h3>
            </div>

            <div className="discipline-visual-box">
              <svg className="discipline-svg" viewBox="0 0 420 80">
                <rect x="30" y="8" width="360" height="64" rx="3" className="viewport-frame" />
                <line x1="30" y1="24" x2="390" y2="24" stroke="var(--color-gold-hairline)" strokeWidth="1" />

                <text ref={deStateTextRef} x="44" y="17" className="flow-node-text de-state-label">
                  STATE 01 // HARMONIC WAVE
                </text>

                {/* Parametric Curve responding to hover */}
                <path
                  ref={deViewportCurveRef}
                  d="M 50,48 C 110,28 170,64 230,38 S 330,56 370,42"
                  className="viewport-curve"
                />

                {/* Tracking Crosshair Device */}
                <g ref={deCrosshairRef} transform="translate(210, 40)">
                  <circle cx="0" cy="0" r="5" className="viewport-cursor" />
                  <circle cx="0" cy="0" r="1.5" fill="#E6C65C" />
                  <line x1="-8" y1="0" x2="8" y2="0" stroke="#E6C65C" strokeWidth="0.8" />
                  <line x1="0" y1="-8" x2="0" y2="8" stroke="#E6C65C" strokeWidth="0.8" />
                  <text ref={deReadoutRef} x="10" y="-3" className="flow-node-text" style={{ fontSize: '6.5px' }}>
                    X: 210  Y: 40
                  </text>
                </g>
              </svg>
            </div>
          </GlassPanel>
        </div>

        {/* Footer */}
        <div className="whatwedo-footer">
          <span className="tech-micro-label">END-TO-END TECHNICAL EXECUTION</span>
          <span className="tech-coord">[ 04 / 05 ]</span>
        </div>
      </div>
    </section>
  );
}
