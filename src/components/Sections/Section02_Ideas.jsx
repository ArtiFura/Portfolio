import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Section02_Ideas() {
  const sectionRef = useRef(null);
  const textRef = useRef(null);

  useEffect(() => {
    const el = sectionRef.current;
    const textEl = textRef.current;
    if (!el || !textEl) return;

    const ctx = gsap.context(() => {
      // Subtle scroll-driven entrance and exit scaling
      gsap.fromTo(
        textEl,
        { scale: 0.94, opacity: 0.4 },
        {
          scale: 1,
          opacity: 1,
          duration: 1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 75%',
            end: 'center center',
            scrub: 0.6,
          },
        }
      );
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section id="section-02" ref={sectionRef} className="manifesto-section">
      {/* Perimeter Micro Metadata */}
      <div 
        className="perimeter-telemetry"
        style={{ top: 'clamp(90px, 12vh, 130px)', left: 'clamp(24px, 5vw, 80px)' }}
      >
        <span className="type-micro">02 // THESIS</span>
      </div>

      <div 
        className="perimeter-telemetry"
        style={{ top: 'clamp(90px, 12vh, 130px)', right: 'clamp(24px, 5vw, 80px)' }}
      >
        <span className="type-micro-dim">OPTICAL DISPLACEMENT: ACTIVE</span>
      </div>

      {/* Central Statement with Subtle Holographic Displacement */}
      <div className="statement-stage holo-refract" ref={textRef}>
        {/* Chromatic Aberration Shadow Layer (driven by --scroll-chromatic) */}
        <h2
          className="statement-monument"
          style={{
            position: 'relative',
            filter: 'url(#artifura-holo)',
            textShadow: `
              calc(var(--scroll-chromatic) * -1) 0px 2px var(--holo-faint-cyan),
              calc(var(--scroll-chromatic) * 1) 0px 2px var(--holo-faint-bronze)
            `,
          }}
        >
          IDEAS DESERVE<br />
          TO BECOME REAL.
        </h2>
      </div>

      {/* Subtle Bottom Metadata */}
      <div 
        className="perimeter-telemetry"
        style={{ bottom: 'clamp(32px, 5vh, 64px)', left: '50%', transform: 'translateX(-50%)' }}
      >
        <span className="type-micro-dim">CONVERGENCE // REALIZATION</span>
      </div>
    </section>
  );
}
