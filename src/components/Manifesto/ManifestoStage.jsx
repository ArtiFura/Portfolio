import React, { useState, useEffect, useRef } from 'react';
import TextDisorientation from '../Typography/TextDisorientation';
import { SECTIONS } from '../../config/sections';

// Section 04 Tools
const TECHNOLOGIES = [
  { name: 'PYTHON', role: 'CORE RUNTIME // DISTRIBUTED LOGIC' },
  { name: 'DJANGO', role: 'ROBUST ENTERPRISE ARCHITECTURE' },
  { name: 'REACT', role: 'REACTIVE CLIENT INTERFACES' },
  { name: '.NET', role: 'HIGH-THROUGHPUT COMPILATION' },
  { name: 'AI', role: 'MACHINE INTELLIGENCE & EMBEDDINGS' },
  { name: 'CLOUD', role: 'GLOBAL SERVERLESS INFRASTRUCTURE' },
];

// Section 05 Projects
const PROJECTS = [
  {
    id: '01',
    title: 'DIGITAL PRODUCT',
    subtitle: 'NEXT-GEN CONSUMER OPERATING INTERFACE',
    year: '2025 // ACTIVE',
    spec: 'REACT / WEBGL / ZERO-LATENCY PROTOCOL',
    description: 'A bespoke high-performance interaction substrate engineered for spatial data consumption. Eliminates cognitive friction through predictive state transitions and custom micro-gesture kinematics.',
    metrics: ['0.4ms FRAME TIME', '100% REHYDRATION EFFICIENCY', 'END-TO-END CRYPTOGRAPHIC INTEGRITY']
  },
  {
    id: '02',
    title: 'SOFTWARE SYSTEM',
    subtitle: 'AUTONOMOUS ENTERPRISE ORCHESTRATION ENGINE',
    year: '2025-2026',
    spec: 'PYTHON / .NET / DISTRIBUTED MESH',
    description: 'A high-throughput distributed pipeline processing asynchronous telemetry across multi-region infrastructure. Built with self-healing failover mechanics and fault-tolerant consensus.',
    metrics: ['120,000 EVENTS/SEC', '99.999% SLA UPTIME', 'SUB-5MS GLOBAL DISPATCH']
  },
  {
    id: '03',
    title: 'TECHNOLOGY',
    subtitle: 'NEURAL EMBEDDINGS & COGNITIVE INFRASTRUCTURE',
    year: '2026',
    spec: 'AI COMPILATION / VECTOR RETRIEVAL / CLOUD',
    description: 'Proprietary semantic routing matrices designed to harmonize heterogeneous machine intelligence agents with deterministic human verification gates.',
    metrics: ['ZERO CLUTTER ARCHITECTURE', 'DYNAMIC VECTOR SPACES', 'PRECISION INFERENCE PIPELINES']
  }
];

export default function ManifestoStage({
  activeSectionIndex = 0,
  outgoingIndex = null,
  incomingIndex = null,
  transitionProgress = 0,
  isTransitioning = false,
  direction = 1,
  velocity = 0,
}) {
  const [activeTechIdx, setActiveTechIdx] = useState(0);
  const [selectedProject, setSelectedProject] = useState(null);
  const [copied, setCopied] = useState(false);
  const canvasRef = useRef(null);

  // Section 04: tech cycle rotation when in section 04
  useEffect(() => {
    if (activeSectionIndex !== 3) return;
    const interval = setInterval(() => {
      setActiveTechIdx((prev) => (prev + 1) % TECHNOLOGIES.length);
    }, 2400);
    return () => clearInterval(interval);
  }, [activeSectionIndex]);

  // Section 03: network canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = canvas.offsetWidth;
    let height = canvas.offsetHeight;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    const handleResize = () => {
      width = canvas.offsetWidth;
      height = canvas.offsetHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    const nodes = Array.from({ length: 14 }, () => ({
      x: width * 0.2 + Math.random() * width * 0.6,
      y: height * 0.2 + Math.random() * height * 0.6,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      phase: Math.random() * Math.PI * 2,
    }));

    let animId;
    let time = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      time += 0.012;

      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      const bronzeLine = isDark ? 'rgba(201, 162, 39, ' : 'rgba(122, 91, 16, ';

      nodes.forEach((n) => {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < width * 0.15 || n.x > width * 0.85) n.vx *= -1;
        if (n.y < height * 0.15 || n.y > height * 0.85) n.vy *= -1;
      });

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 180) {
            const pulse = Math.sin(time + nodes[i].phase) * 0.5 + 0.5;
            const alpha = ((1 - dist / 180) * 0.22 * pulse).toFixed(3);

            ctx.strokeStyle = `${bronzeLine}${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }

      nodes.forEach((n) => {
        const nodeAlpha = (Math.sin(time * 1.5 + n.phase) * 0.25 + 0.35).toFixed(3);
        ctx.fillStyle = `${bronzeLine}${nodeAlpha})`;
        ctx.beginPath();
        ctx.arc(n.x, n.y, 1.8, 0, Math.PI * 2);
        ctx.fill();
      });

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
    };
  }, []);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('hello@artifura.com');
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const currentSection = SECTIONS[activeSectionIndex] || SECTIONS[0];
  const outgoingSection = outgoingIndex !== null ? SECTIONS[outgoingIndex] : null;
  const incomingSection = incomingIndex !== null ? SECTIONS[incomingIndex] : null;

  return (
    <div
      className="manifesto-stage-container"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100svh',
        minHeight: '100svh',
        maxHeight: '100svh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: 'var(--z-content)',
      }}
    >
      {/* Subtle Micro-Tag above Central Statement */}
      <div 
        style={{
          position: 'absolute',
          top: 'clamp(72px, 12vh, 100px)',
          left: '50%',
          transform: 'translateX(-50%)',
          textAlign: 'center',
          pointerEvents: 'none',
        }}
      >
        <span className="type-micro-dim">{currentSection.telemetryLeft}</span>
      </div>

      {/* Section 03 Background Network (Visible when Section 03 is in view) */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          opacity: activeSectionIndex === 2 ? 1 : 0,
          transition: 'opacity 0.6s ease',
          zIndex: 'var(--z-canvas)',
        }}
        aria-hidden="true"
      />

      {/* Central Statement Overlap Area (Always Centered with Generous Breathing Room) */}
      <div
        className="statement-stage holo-refract"
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '1200px',
          padding: '0 clamp(40px, 8vw, 120px)',
          minHeight: 'clamp(180px, 25vh, 280px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: 'auto',
        }}
      >
        {isTransitioning && outgoingSection && incomingSection ? (
          <>
            {/* Outgoing Statement (Disorients upward & dissolves) */}
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              <TextDisorientation
                lines={outgoingSection.lines}
                role="outgoing"
                progress={transitionProgress}
                velocity={velocity}
                direction={direction}
                seed={outgoingSection.seed}
              />
            </div>

            {/* Incoming Statement (Emerges from below & reassembles) */}
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              <TextDisorientation
                lines={incomingSection.lines}
                role="incoming"
                progress={transitionProgress}
                velocity={velocity}
                direction={direction}
                seed={incomingSection.seed}
              />
            </div>
          </>
        ) : (
          /* Single Resting Statement */
          <div
            style={{
              position: 'relative',
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <TextDisorientation
              lines={currentSection.lines}
              role="resting"
              seed={currentSection.seed}
            />
          </div>
        )}
      </div>

      {/* Section 04: Dynamic Technology Sub-display */}
      {activeSectionIndex === 3 && (
        <div
          style={{
            position: 'absolute',
            bottom: 'clamp(90px, 15vh, 140px)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            pointerEvents: 'auto',
            animation: 'fadeIn 0.4s ease',
          }}
        >
          <div
            className="statement-editorial"
            style={{
              fontSize: 'clamp(1.6rem, 3.5vw, 2.8rem)',
              color: 'var(--color-gold-bright)',
              letterSpacing: '0.04em',
              transition: 'opacity 0.2s ease',
            }}
          >
            {TECHNOLOGIES[activeTechIdx].name}
          </div>
          <div
            style={{
              marginTop: '6px',
              fontFamily: 'var(--font-mono)',
              fontSize: 'clamp(9px, 0.75vw, 11px)',
              letterSpacing: '0.24em',
              color: 'var(--color-gold-muted)',
            }}
          >
            {TECHNOLOGIES[activeTechIdx].role}
          </div>
        </div>
      )}

      {/* Section 05: Emerging Project Identifiers */}
      {activeSectionIndex === 4 && (
        <div
          style={{
            position: 'absolute',
            bottom: 'clamp(85px, 14vh, 130px)',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: 'clamp(16px, 3vw, 40px)',
            pointerEvents: 'auto',
            animation: 'fadeIn 0.4s ease',
          }}
        >
          {PROJECTS.map((proj) => (
            <button
              key={proj.id}
              type="button"
              onClick={() => setSelectedProject(proj)}
              className="interactive"
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 14px',
                transition: 'all 0.3s ease',
              }}
              aria-label={`View details for ${proj.title}`}
            >
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '10px',
                  letterSpacing: '0.24em',
                  color: 'var(--color-gold-muted)',
                }}
              >
                {proj.id}
              </span>
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 'clamp(10px, 0.9vw, 12px)',
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  color: 'var(--color-gold-bright)',
                  borderBottom: '1px solid var(--color-gold-hairline)',
                  paddingBottom: '2px',
                }}
              >
                {proj.title} →
              </span>
            </button>
          ))}
        </div>
      )}

      {/* Section 06: Traveling Bronze Beam Line */}
      {activeSectionIndex === 5 && (
        <div
          className="bronze-beam"
          style={{
            position: 'absolute',
            top: '50%',
            left: '15%',
            width: '70%',
            animation: 'beamScan 3s infinite alternate ease-in-out',
          }}
        />
      )}

      {/* Section 07: Supporting Metadata */}
      {activeSectionIndex === 6 && (
        <div
          style={{
            position: 'absolute',
            bottom: 'clamp(90px, 15vh, 140px)',
            fontFamily: 'var(--font-mono)',
            fontSize: 'clamp(10px, 0.85vw, 12px)',
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            color: 'var(--color-gold-muted)',
            animation: 'fadeIn 0.4s ease',
          }}
        >
          EST. 2026 // INDIA
        </div>
      )}

      {/* Section 08: Contact Action */}
      {activeSectionIndex === 7 && (
        <div
          style={{
            position: 'absolute',
            bottom: 'clamp(85px, 14vh, 130px)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '10px',
            pointerEvents: 'auto',
            animation: 'fadeIn 0.4s ease',
          }}
        >
          <button
            type="button"
            onClick={handleCopyEmail}
            className="type-cta interactive"
            style={{ padding: '8px 20px', fontSize: '11px' }}
            aria-label="Contact Artifura via email"
          >
            {copied ? '[COPIED: HELLO@ARTIFURA.COM]' : "LET'S TALK →"}
          </button>
          <a
            href="mailto:hello@artifura.com"
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '10px',
              letterSpacing: '0.22em',
              color: 'var(--color-gold-muted)',
              textDecoration: 'none',
              opacity: 0.75,
            }}
            className="interactive"
          >
            hello@artifura.com
          </a>
        </div>
      )}

      {/* Section 05 Project Detail Modal */}
      {selectedProject && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={selectedProject.title}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'var(--nav-bg)',
            backdropFilter: 'blur(24px)',
            zIndex: 'var(--z-modal)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 'clamp(24px, 5vw, 64px)',
            pointerEvents: 'auto',
          }}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '820px',
              border: '1px solid var(--color-gold-hairline)',
              backgroundColor: 'var(--card-bg)',
              padding: 'clamp(32px, 5vw, 56px)',
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              gap: '24px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <div style={{ display: 'flex', gap: '14px', alignItems: 'baseline' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'var(--color-gold-muted)' }}>
                  {selectedProject.id} //
                </span>
                <span
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 'clamp(1.6rem, 3vw, 2.4rem)',
                    fontWeight: 600,
                    letterSpacing: '0.04em',
                    textTransform: 'uppercase',
                  }}
                >
                  {selectedProject.title}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedProject(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11px',
                  letterSpacing: '0.22em',
                  color: 'var(--color-gold-bright)',
                  cursor: 'pointer',
                  padding: '6px 12px',
                }}
              >
                [CLOSE]
              </button>
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.2em', color: 'var(--color-gold-muted)' }}>
              {selectedProject.subtitle}
              <div style={{ marginTop: '6px', color: 'var(--color-gold-hairline-bright)' }}>
                SPEC: {selectedProject.spec} // {selectedProject.year}
              </div>
            </div>
            <p
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: 'clamp(14px, 1.1vw, 17px)',
                lineHeight: 1.7,
                color: 'var(--text-main)',
                maxWidth: '700px',
              }}
            >
              {selectedProject.description}
            </p>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                gap: '16px',
                borderTop: '1px solid var(--color-gold-hairline)',
                paddingTop: '20px',
              }}
            >
              {selectedProject.metrics.map((metric, i) => (
                <div
                  key={i}
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '10.5px',
                    letterSpacing: '0.18em',
                    color: 'var(--color-gold-bright)',
                  }}
                >
                  ▸ {metric}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
