import React, { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const TECHNOLOGIES = [
  { name: 'PYTHON', role: 'CORE RUNTIME // DISTRIBUTED LOGIC' },
  { name: 'DJANGO', role: 'ROBUST ENTERPRISE ARCHITECTURE' },
  { name: 'REACT', role: 'REACTIVE CLIENT INTERFACES' },
  { name: '.NET', role: 'HIGH-THROUGHPUT COMPILATION' },
  { name: 'AI', role: 'MACHINE INTELLIGENCE & EMBEDDINGS' },
  { name: 'CLOUD', role: 'GLOBAL SERVERLESS INFRASTRUCTURE' },
];

export default function Section04_Stack() {
  const containerRef = useRef(null);
  const pinRef = useRef(null);
  const [activeTechIndex, setActiveTechIndex] = useState(0);
  const [transitionProgress, setTransitionProgress] = useState(0);

  useEffect(() => {
    const container = containerRef.current;
    const pinEl = pinRef.current;
    if (!container || !pinEl) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: container,
        start: 'top top',
        end: '+=300%',
        pin: pinEl,
        scrub: 0.6,
        onUpdate: (self) => {
          const p = self.progress;
          // Calculate active index across 6 items
          const indexFloat = p * (TECHNOLOGIES.length - 1);
          const index = Math.min(Math.floor(indexFloat), TECHNOLOGIES.length - 1);
          const localProgress = indexFloat - index; // 0 to 1 between transitions

          setActiveTechIndex(index);
          setTransitionProgress(localProgress);
        },
      });
    }, container);

    return () => ctx.revert();
  }, []);

  const currentTech = TECHNOLOGIES[activeTechIndex];

  return (
    <div ref={containerRef} id="section-04" style={{ position: 'relative', width: '100%' }}>
      <section ref={pinRef} className="manifesto-section" style={{ height: '100svh' }}>
        {/* Perimeter Telemetry */}
        <div 
          className="perimeter-telemetry"
          style={{ top: 'clamp(90px, 12vh, 130px)', left: 'clamp(24px, 5vw, 80px)' }}
        >
          <span className="type-micro">04 // INSTRUMENTATION</span>
        </div>

        <div 
          className="perimeter-telemetry"
          style={{ top: 'clamp(90px, 12vh, 130px)', right: 'clamp(24px, 5vw, 80px)' }}
        >
          <span className="type-micro-dim">
            [ {String(activeTechIndex + 1).padStart(2, '0')} / {String(TECHNOLOGIES.length).padStart(2, '0')} ]
          </span>
        </div>

        {/* Central Stage */}
        <div className="statement-stage">
          {/* Main Statement */}
          <h2
            className="statement-editorial"
            style={{
              fontSize: 'clamp(1.4rem, 2.8vw, 3rem)',
              letterSpacing: '0.04em',
              color: 'var(--color-gold-muted)',
              marginBottom: 'clamp(32px, 6vh, 64px)',
            }}
          >
            BUILT WITH<br />
            THE RIGHT TOOLS.
          </h2>

          {/* Sequential Dynamic Technology Display */}
          <div
            className="holo-refract"
            style={{
              position: 'relative',
              minHeight: 'clamp(80px, 16vh, 160px)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div
              key={currentTech.name}
              className="statement-monument"
              style={{
                fontSize: 'clamp(3.4rem, 8.5vw, 8.2rem)',
                letterSpacing: '0.02em',
                transform: `translateX(${(transitionProgress * -25).toFixed(1)}px) skewX(${(transitionProgress * -4).toFixed(1)}deg)`,
                opacity: (1 - transitionProgress * 0.45).toFixed(2),
                filter: 'url(#artifura-holo)',
                transition: 'transform 0.1s linear, opacity 0.1s linear',
              }}
            >
              {currentTech.name}
            </div>

            {/* Micro Sub-Role Identifier */}
            <div
              style={{
                marginTop: '18px',
                fontFamily: 'var(--font-mono)',
                fontSize: 'clamp(9px, 0.8vw, 11px)',
                letterSpacing: '0.24em',
                color: 'var(--color-gold-muted)',
                opacity: 0.85,
              }}
            >
              {currentTech.role}
            </div>
          </div>
        </div>

        {/* Perimeter Bottom Progress Line */}
        <div 
          className="perimeter-telemetry"
          style={{ bottom: 'clamp(32px, 5vh, 64px)', left: '50%', transform: 'translateX(-50%)' }}
        >
          <div
            style={{
              width: '160px',
              height: '1px',
              backgroundColor: 'var(--color-gold-hairline)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                height: '100%',
                width: `${((activeTechIndex + transitionProgress) / (TECHNOLOGIES.length - 1)) * 100}%`,
                backgroundColor: 'var(--color-gold-bright)',
                transition: 'width 0.1s linear',
              }}
            />
          </div>
        </div>
      </section>
    </div>
  );
}
