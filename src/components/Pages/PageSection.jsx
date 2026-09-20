import React, { useState, useEffect, useRef } from 'react';
import TextDisorientation from '../Typography/TextDisorientation';

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

export default function PageSection({ section, pageNumber, velocity = 0 }) {
  const [activeTechIdx, setActiveTechIdx] = useState(0);
  const [selectedProject, setSelectedProject] = useState(null);
  const [copied, setCopied] = useState(false);
  const canvasRef = useRef(null);
  const sectionRef = useRef(null);

  // Section 04 Tech Rotation
  useEffect(() => {
    if (!section.hasStackCycler) return;
    const interval = setInterval(() => {
      setActiveTechIdx((prev) => (prev + 1) % TECHNOLOGIES.length);
    }, 2400);
    return () => clearInterval(interval);
  }, [section.hasStackCycler]);

  // Section 02 Network Canvas
  useEffect(() => {
    if (!section.hasNetworkCanvas) return;
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
  }, [section.hasNetworkCanvas]);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('hello@artifura.com');
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <section
      ref={sectionRef}
      id={section.id}
      className="page-section manifesto-section"
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '100svh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'clamp(60px, 10vh, 120px) clamp(24px, 6vw, 120px)',
        boxSizing: 'border-box',
      }}
    >
      {/* Network Canvas (Section 02.1) */}
      {section.hasNetworkCanvas && (
        <canvas
          ref={canvasRef}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            zIndex: 'var(--z-canvas)',
          }}
          aria-hidden="true"
        />
      )}

      {/* Internal Section Number & Label */}
      <div
        style={{
          marginBottom: 'clamp(16px, 3vh, 32px)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '6px',
          zIndex: 'var(--z-content)',
        }}
      >
        <span className="type-micro" style={{ letterSpacing: '0.28em' }}>
          {section.number} // {section.label}
        </span>
        <span className="type-micro-dim">
          {section.subtitle}
        </span>
      </div>

      {/* Central Statement Stage */}
      <div
        className="statement-stage holo-refract"
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '1200px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 'var(--z-content)',
        }}
      >
        <TextDisorientation
          lines={section.lines}
          role="resting"
          seed={parseInt(pageNumber, 10) * 3 + (section.number.charCodeAt(3) || 1)}
          velocity={velocity}
        />
      </div>

      {/* Traveling Bronze Beam Line (Section 06.1) */}
      {section.hasBeam && (
        <div
          className="bronze-beam"
          style={{
            position: 'absolute',
            top: '50%',
            left: '15%',
            width: '70%',
            animation: 'beamScan 3s infinite alternate ease-in-out',
            zIndex: 'var(--z-content)',
          }}
        />
      )}

      {/* Section 04: Dynamic Technology Cycler */}
      {section.hasStackCycler && (
        <div
          style={{
            marginTop: 'clamp(28px, 5vh, 48px)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            zIndex: 'var(--z-content)',
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
      {section.hasProjects && (
        <div
          style={{
            marginTop: 'clamp(32px, 5vh, 56px)',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: 'clamp(16px, 3vw, 40px)',
            zIndex: 'var(--z-content)',
          }}
        >
          {PROJECTS.map((proj) => (
            <button
              key={proj.id}
              type="button"
              onClick={() => setSelectedProject(proj)}
              className="interactive"
              style={{
                background: 'rgba(245, 243, 237, 0.3)',
                border: '1px solid var(--color-gold-hairline)',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 16px',
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

      {/* Section 08: Contact Action */}
      {section.hasContactCta && (
        <div
          style={{
            marginTop: 'clamp(32px, 5vh, 56px)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '12px',
            zIndex: 'var(--z-content)',
          }}
        >
          <button
            type="button"
            onClick={handleCopyEmail}
            className="type-cta interactive"
            style={{ padding: '10px 24px', fontSize: '11px' }}
            aria-label="Contact Artifura via email"
          >
            {copied ? '[COPIED: HELLO@ARTIFURA.COM]' : "LET'S TALK →"}
          </button>
          <a
            href="mailto:hello@artifura.com"
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '10.5px',
              letterSpacing: '0.22em',
              color: 'var(--color-gold-muted)',
              textDecoration: 'none',
              opacity: 0.8,
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
    </section>
  );
}
