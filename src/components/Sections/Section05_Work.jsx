import React, { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

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

export default function Section05_Work() {
  const sectionRef = useRef(null);
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && selectedProject) {
        setSelectedProject(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedProject]);

  return (
    <section id="section-05" ref={sectionRef} className="manifesto-section">
      {/* Perimeter Telemetry */}
      <div 
        className="perimeter-telemetry"
        style={{ top: 'clamp(90px, 12vh, 130px)', left: 'clamp(24px, 5vw, 80px)' }}
      >
        <span className="type-micro">05 // ARTIFACTS</span>
      </div>

      <div 
        className="perimeter-telemetry"
        style={{ top: 'clamp(90px, 12vh, 130px)', right: 'clamp(24px, 5vw, 80px)' }}
      >
        <span className="type-micro-dim">STATUS: PROVEN ARCHITECTURE</span>
      </div>

      {/* Central Statement */}
      <div className="statement-stage holo-refract">
        <h2 className="statement-monument" style={{ filter: 'url(#artifura-holo)' }}>
          WE MAKE THINGS<br />
          THAT WORK.
        </h2>

        {/* Subtle Emerging Project Identifiers */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: 'clamp(20px, 4vw, 56px)',
            marginTop: 'clamp(36px, 6vh, 64px)',
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
                gap: '8px',
                padding: '12px 18px',
                transition: 'all 0.3s ease',
              }}
              aria-label={`View project details for ${proj.title}`}
            >
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11px',
                  letterSpacing: '0.24em',
                  color: 'var(--color-gold-muted)',
                }}
              >
                {proj.id}
              </span>

              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 'clamp(11px, 1vw, 13px)',
                  letterSpacing: '0.22em',
                  textTransform: 'uppercase',
                  color: 'var(--color-gold-bright)',
                  borderBottom: '1px solid var(--color-gold-hairline)',
                  paddingBottom: '4px',
                  transition: 'border-color 0.25s ease',
                }}
              >
                {proj.title} →
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Perimeter Bottom Label */}
      <div 
        className="perimeter-telemetry"
        style={{ bottom: 'clamp(32px, 5vh, 64px)', left: '50%', transform: 'translateX(-50%)' }}
      >
        <span className="type-micro-dim">CLICK IDENTIFIER FOR TECHNICAL ARCHIVE</span>
      </div>

      {/* Quiet Architectural Project View Modal */}
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
            {/* Header */}
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
                aria-label="Close Project View"
              >
                [CLOSE]
              </button>
            </div>

            {/* Subtitle & Spec */}
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.2em', color: 'var(--color-gold-muted)' }}>
              {selectedProject.subtitle}
              <div style={{ marginTop: '6px', color: 'var(--color-gold-hairline-bright)' }}>
                SPEC: {selectedProject.spec} // {selectedProject.year}
              </div>
            </div>

            {/* Description */}
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

            {/* Architectural Metrics */}
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
