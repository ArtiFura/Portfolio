import React, { useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import GlassPanel from './GlassPanel';
import '../styles/about.css';

gsap.registerPlugin(ScrollTrigger);

const NODES_DATA = [
  { id: 'data', name: 'DATA', x: 90, y: 90 },
  { id: 'logic', name: 'LOGIC', x: 310, y: 90 },
  { id: 'interface', name: 'INTERFACE', x: 320, y: 310 },
  { id: 'scale', name: 'SCALE', x: 80, y: 300 },
  { id: 'synthesis', name: 'SYNTHESIS', x: 200, y: 200 }
];

export default function About() {
  const sectionRef = useRef(null);
  const pinRef = useRef(null);
  const line1Ref = useRef(null);
  const line2Ref = useRef(null);
  const line3Ref = useRef(null);
  const line4Ref = useRef(null);
  const ruleRef = useRef(null);
  const accent1Ref = useRef(null);
  const accent2Ref = useRef(null);

  // System Map SVG Refs
  const mapContainerRef = useRef(null);
  const sysLine1Ref = useRef(null);
  const sysLine2Ref = useRef(null);
  const sysLine3Ref = useRef(null);
  const sysLine4Ref = useRef(null);
  const perimeterRef = useRef(null);
  const altChord1Ref = useRef(null);
  const altChord2Ref = useRef(null);

  // Node Element Refs (Data, Logic, Interface, Scale, Synthesis)
  const nodeRefs = useRef([]);
  const haloRefs = useRef([]);
  const textRefs = useRef([]);

  // Dynamic tether lines during cursor hijack
  const dynamicTetherRef = useRef(null);

  // Autonomous state tracking (Zero React re-renders)
  const idleTimelineRef = useRef(null);
  const isHijackedRef = useRef(false);
  const mapStatusRef = useRef(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();

    // -------------------------------------------------------------
    // 1. AUTONOMOUS SELF-ASSEMBLY & DISASSEMBLY IDLE LOOP (10s)
    // -------------------------------------------------------------
    const idleTl = gsap.timeline({ repeat: -1 });

    // Step A: Lines progressively connect (0 to 3.5s)
    idleTl.fromTo([sysLine1Ref.current, sysLine2Ref.current],
      { strokeDashoffset: 350, opacity: 0.3 },
      { strokeDashoffset: 0, opacity: 1, duration: 2.2, ease: 'power2.out' },
      0
    )
    .fromTo([sysLine3Ref.current, sysLine4Ref.current],
      { strokeDashoffset: 350, opacity: 0.3 },
      { strokeDashoffset: 0, opacity: 1, duration: 2.2, ease: 'power2.out' },
      0.6
    )
    .fromTo(perimeterRef.current,
      { opacity: 0.15 },
      { opacity: 0.6, duration: 2, ease: 'power1.inOut' },
      1.0
    )
    // Step B: Hold cohesive state (3.5s to 5.5s)
    .to([haloRefs.current], {
      scale: 1.25,
      transformOrigin: 'center center',
      duration: 1.5,
      yoyo: true,
      repeat: 1
    }, 2.5)
    // Step C: Disconnect and dissolve (5.5s to 7.5s)
    .to([sysLine1Ref.current, sysLine2Ref.current, sysLine3Ref.current, sysLine4Ref.current, perimeterRef.current], {
      opacity: 0.12,
      duration: 1.4,
      ease: 'power2.in'
    }, 5.5)
    // Step D: Reorganize via alternate diagonal chords (7.5s to 10s)
    .fromTo(altChord1Ref.current,
      { strokeDashoffset: 450, opacity: 0 },
      { strokeDashoffset: 0, opacity: 0.7, duration: 1.8, ease: 'power2.out' },
      6.8
    )
    .fromTo(altChord2Ref.current,
      { strokeDashoffset: 450, opacity: 0 },
      { strokeDashoffset: 0, opacity: 0.7, duration: 1.8, ease: 'power2.out' },
      7.2
    )
    .to([altChord1Ref.current, altChord2Ref.current], {
      opacity: 0,
      duration: 1.2
    }, 9.0);

    idleTimelineRef.current = idleTl;

    // Viewport Culling: Pause topological self-assembly loop when offscreen
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
    // 2. SCROLL CHOREOGRAPHY (Pinned Storytelling)
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

      tl.fromTo(line1Ref.current, 
        { x: -35, opacity: 0.5 },
        { x: 0, opacity: 1, duration: 1.8, ease: 'power2.out' },
        0
      )
      .fromTo(line2Ref.current,
        { x: 40, opacity: 0.5 },
        { x: 0, opacity: 1, duration: 1.8, ease: 'power2.out' },
        0.2
      )
      .fromTo(ruleRef.current,
        { strokeDashoffset: 800 },
        { strokeDashoffset: 0, duration: 2, ease: 'power2.inOut' },
        0.3
      )
      .fromTo(line3Ref.current,
        { x: -25, opacity: 0.5 },
        { x: 0, opacity: 1, duration: 1.8, ease: 'power2.out' },
        0.4
      )
      .fromTo(line4Ref.current,
        { x: 30, opacity: 0.5 },
        { x: 0, opacity: 1, duration: 1.8, ease: 'power2.out' },
        0.6
      );

      tl.to([accent1Ref.current, accent2Ref.current], {
        color: 'var(--color-gold-bright)',
        scale: 1.02,
        duration: 1.2
      }, 1.6)
      .to([line1Ref.current, line2Ref.current, line3Ref.current, line4Ref.current], {
        x: 0,
        opacity: 1,
        duration: 1.2
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

      tl.fromTo([line1Ref.current, line2Ref.current, line3Ref.current, line4Ref.current],
        { opacity: 0.4, y: 15 },
        { opacity: 1, y: 0, stagger: 0.2, duration: 1.8, ease: 'power2.out' },
        0
      )
      .fromTo(ruleRef.current,
        { strokeDashoffset: 400 },
        { strokeDashoffset: 0, duration: 1.5, ease: 'power2.inOut' },
        0.2
      );
    });

    return () => {
      if (idleTimelineRef.current) idleTimelineRef.current.kill();
      mm.revert();
    };
  }, { scope: sectionRef });

  // -------------------------------------------------------------
  // 3. CURSOR HIJACK EVENT HANDLERS
  // -------------------------------------------------------------
  const activeNodeIndexRef = useRef(4); // default central Synthesis

  const handleMouseEnter = (e) => {
    isHijackedRef.current = true;
    if (idleTimelineRef.current) {
      idleTimelineRef.current.pause();
    }

    // Determine nearest node on entry
    if (mapContainerRef.current) {
      const rect = mapContainerRef.current.getBoundingClientRect();
      const mx = ((e.clientX - rect.left) / rect.width) * 400;
      const my = ((e.clientY - rect.top) / rect.height) * 400;

      let nearestIdx = 4;
      let minDist = Infinity;
      NODES_DATA.forEach((n, idx) => {
        const d = Math.hypot(n.x - mx, n.y - my);
        if (d < minDist) {
          minDist = d;
          nearestIdx = idx;
        }
      });
      activeNodeIndexRef.current = nearestIdx;
      if (mapStatusRef.current) {
        mapStatusRef.current.innerText = `NODE [${NODES_DATA[nearestIdx].name}] // HIJACKED CLUSTER`;
      }
    }

    // Show dynamic tether rays
    if (dynamicTetherRef.current) {
      gsap.to(dynamicTetherRef.current, { opacity: 0.8, duration: 0.3 });
    }
  };

  const handleMouseMove = (e) => {
    if (!mapContainerRef.current) return;
    const rect = mapContainerRef.current.getBoundingClientRect();
    const mx = ((e.clientX - rect.left) / rect.width) * 400;
    const my = ((e.clientY - rect.top) / rect.height) * 400;

    const activeIdx = activeNodeIndexRef.current;
    const activeBase = NODES_DATA[activeIdx];

    // Active hijacked node follows cursor with soft damping
    const activeX = (mx - activeBase.x) * 0.45;
    const activeY = (my - activeBase.y) * 0.45;

    const activeNodeEl = nodeRefs.current[activeIdx];
    const activeHaloEl = haloRefs.current[activeIdx];
    const activeTextEl = textRefs.current[activeIdx];

    if (activeNodeEl) {
      gsap.to(activeNodeEl, { x: activeX, y: activeY, duration: 0.2, overwrite: 'auto', ease: 'power2.out' });
      gsap.to(activeHaloEl, { x: activeX, y: activeY, duration: 0.2, overwrite: 'auto', stroke: '#E6C65C' });
      gsap.to(activeTextEl, { x: activeX, y: activeY, duration: 0.2, overwrite: 'auto', fill: '#E6C65C' });
    }

    // Remaining nodes orbit/reorganize around the active node position
    NODES_DATA.forEach((n, idx) => {
      if (idx === activeIdx) return;
      const angle = Math.atan2(n.y - (activeBase.y + activeY), n.x - (activeBase.x + activeX));
      const satOffset = 22;
      const sx = Math.cos(angle) * satOffset;
      const sy = Math.sin(angle) * satOffset;

      const nodeEl = nodeRefs.current[idx];
      const haloEl = haloRefs.current[idx];
      const textEl = textRefs.current[idx];

      if (nodeEl) {
        gsap.to(nodeEl, { x: sx, y: sy, duration: 0.35, overwrite: 'auto', ease: 'power2.out' });
        gsap.to(haloEl, { x: sx, y: sy, duration: 0.35, overwrite: 'auto' });
        gsap.to(textEl, { x: sx, y: sy, duration: 0.35, overwrite: 'auto' });
      }
    });
  };

  const handleMouseLeave = () => {
    isHijackedRef.current = false;
    if (mapStatusRef.current) {
      mapStatusRef.current.innerText = 'TOPOLOGY: RECOVERING';
    }

    const recoveryDuration = 1.0;

    // Smooth physical return of all nodes to standard anchor coordinates
    NODES_DATA.forEach((_, idx) => {
      const nodeEl = nodeRefs.current[idx];
      const haloEl = haloRefs.current[idx];
      const textEl = textRefs.current[idx];

      if (nodeEl) {
        gsap.to([nodeEl, haloEl, textEl], {
          x: 0,
          y: 0,
          duration: recoveryDuration,
          ease: 'power3.out',
          overwrite: 'auto'
        });
      }
    });

    if (dynamicTetherRef.current) {
      gsap.to(dynamicTetherRef.current, { opacity: 0, duration: 0.4 });
    }

    // Resume autonomous self-assembly
    gsap.delayedCall(recoveryDuration * 0.8, () => {
      if (!isHijackedRef.current && idleTimelineRef.current) {
        idleTimelineRef.current.resume();
        if (mapStatusRef.current) {
          mapStatusRef.current.innerText = 'TOPOLOGY: SELF-ASSEMBLING';
        }
      }
    });
  };

  const handleTouchStart = () => {
    handleMouseEnter({ clientX: window.innerWidth / 2, clientY: window.innerHeight / 2 });
    setTimeout(handleMouseLeave, 1500);
  };

  return (
    <section ref={sectionRef} className="about-section" id="about" aria-label="About Section">
      <div ref={pinRef} className="about-pin-container">
        {/* Section Header */}
        <div className="about-header">
          <div className="about-meta-left">
            <span className="tech-tag">
              <span className="tech-tag-pulse" />
              SYSTEM MAP // 01
            </span>
            <span className="about-label">ARCHITECTURE & PURPOSE</span>
          </div>
          <span className="about-section-indicator">01 / 05</span>
        </div>

        {/* 2-Column Editorial & System Map Stage */}
        <div className="about-stage">
          {/* Left: Scaled Editorial Typography */}
          <div className="about-content-wrap">
            <div className="about-lines-group">
              <span ref={line1Ref} className="about-line">
                Artifura is an <span ref={accent1Ref} className="about-word-accent">independent</span>
              </span>
              <span ref={line2Ref} className="about-line">
                technology company building
              </span>

              {/* Precision SVG Hairline */}
              <svg className="about-rule-svg" viewBox="0 0 800 2" preserveAspectRatio="none" aria-hidden="true">
                <line
                  ref={ruleRef}
                  x1="0"
                  y1="1"
                  x2="800"
                  y2="1"
                  className="about-rule-line"
                  strokeDasharray="800"
                  strokeDashoffset="800"
                />
              </svg>

              <span ref={line3Ref} className="about-line">
                digital systems and <span ref={accent2Ref} className="about-word-accent">experiences</span>
              </span>
              <span ref={line4Ref} className="about-line">
                for the world ahead.
              </span>
            </div>
          </div>

          {/* Right: Floating Glass Viewport for System Map */}
          <GlassPanel
            ref={mapContainerRef}
            variant="medium"
            geometry="brackets"
            tilt={true}
            autonomousFloat={true}
            className="about-system-viewport"
            onMouseEnter={handleMouseEnter}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onTouchStart={handleTouchStart}
            data-cursor="INTERACT"
            aria-label="Artifura Topological System Map Viewport"
          >
            {/* Viewport Top Bar */}
            <div className="viewport-top-bar">
              <div className="viewport-status-tag">
                <span className="viewport-pulse-dot" />
                <span className="tech-micro-label">VIEWPORT // 400x400</span>
              </div>
              <span className="tech-coord">[ LATENCY: 0.8ms ]</span>
            </div>

            <svg className="about-system-svg" viewBox="0 0 400 400">
              {/* Radar guide circles */}
              <circle cx="200" cy="200" r="140" stroke="rgba(201, 162, 39, 0.12)" strokeWidth="1" fill="none" />
              <circle cx="200" cy="200" r="85" stroke="rgba(201, 162, 39, 0.18)" strokeWidth="1" strokeDasharray="3 4" fill="none" />

              {/* Autonomous Assembly Vectors */}
              <g>
                <line
                  ref={sysLine1Ref}
                  x1="200" y1="200" x2="90" y2="90"
                  className="sys-connector-active"
                  strokeDasharray="350" strokeDashoffset="350"
                />
                <line
                  ref={sysLine2Ref}
                  x1="200" y1="200" x2="310" y2="90"
                  className="sys-connector-active"
                  strokeDasharray="350" strokeDashoffset="350"
                />
                <line
                  ref={sysLine3Ref}
                  x1="200" y1="200" x2="320" y2="310"
                  className="sys-connector-active"
                  strokeDasharray="350" strokeDashoffset="350"
                />
                <line
                  ref={sysLine4Ref}
                  x1="200" y1="200" x2="80" y2="300"
                  className="sys-connector-active"
                  strokeDasharray="350" strokeDashoffset="350"
                />

                {/* Perimeter connective chord */}
                <polygon
                  ref={perimeterRef}
                  points="90,90 310,90 320,310 80,300"
                  className="sys-connector-path"
                />

                {/* Alternate dynamic cross-chords for reorganization */}
                <line
                  ref={altChord1Ref}
                  x1="90" y1="90" x2="320" y2="310"
                  stroke="rgba(230, 198, 92, 0.45)"
                  strokeWidth="1"
                  strokeDasharray="450"
                  strokeDashoffset="450"
                  fill="none"
                />
                <line
                  ref={altChord2Ref}
                  x1="310" y1="90" x2="80" y2="300"
                  stroke="rgba(230, 198, 92, 0.45)"
                  strokeWidth="1"
                  strokeDasharray="450"
                  strokeDashoffset="450"
                  fill="none"
                />
              </g>

              {/* Dynamic tether rays during cursor hijack */}
              <g ref={dynamicTetherRef} style={{ opacity: 0 }}>
                <circle cx="200" cy="200" r="110" stroke="rgba(230, 198, 92, 0.3)" strokeWidth="1" strokeDasharray="4 6" fill="none" />
              </g>

              {/* Topological Nodes */}
              <g style={{ transformOrigin: '200px 200px' }}>
                {NODES_DATA.map((node, i) => (
                  <g key={node.id}>
                    <circle
                      ref={(el) => (haloRefs.current[i] = el)}
                      cx={node.x}
                      cy={node.y}
                      r={node.id === 'synthesis' ? 18 : 14}
                      className="sys-node-halo"
                      style={node.id === 'synthesis' ? { stroke: '#E6C65C' } : {}}
                    />
                    <circle
                      ref={(el) => (nodeRefs.current[i] = el)}
                      cx={node.x}
                      cy={node.y}
                      r={node.id === 'synthesis' ? 5.5 : 4}
                      className="sys-node-dot"
                      fill={node.id === 'synthesis' ? '#E6C65C' : '#C9A227'}
                    />
                    <text
                      ref={(el) => (textRefs.current[i] = el)}
                      x={node.x}
                      y={node.y > 200 ? node.y + 24 : node.y - 18}
                      textAnchor="middle"
                      className="sys-node-label"
                      style={node.id === 'synthesis' ? { fill: '#E6C65C' } : {}}
                    >
                      {node.name}
                    </text>
                  </g>
                ))}
              </g>
            </svg>

            {/* Dynamic Map Caption */}
            <div className="about-map-caption">
              <span className="tech-coord">[ 5 HUBS // MESH 1.0 ]</span>
              <span ref={mapStatusRef} className="tech-micro-label">
                TOPOLOGY: SELF-ASSEMBLING
              </span>
            </div>
          </GlassPanel>
        </div>

        {/* Section Footer */}
        <div className="about-footer">
          <span className="about-meta-text">DISCIPLINARY COHESION</span>
          <span className="about-meta-text">01 / 05</span>
        </div>
      </div>
    </section>
  );
}
