import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Section07_Company() {
  const sectionRef = useRef(null);
  const textRef = useRef(null);

  useEffect(() => {
    const el = sectionRef.current;
    const text = textRef.current;
    if (!el || !text) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        text,
        { opacity: 0.25, y: 24 },
        {
          opacity: 1,
          y: 0,
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
    <section id="section-07" ref={sectionRef} className="manifesto-section">
      {/* Perimeter Telemetry */}
      <div 
        className="perimeter-telemetry"
        style={{ top: 'clamp(90px, 12vh, 130px)', left: 'clamp(24px, 5vw, 80px)' }}
      >
        <span className="type-micro">07 // IDENTITY</span>
      </div>

      <div 
        className="perimeter-telemetry"
        style={{ top: 'clamp(90px, 12vh, 130px)', right: 'clamp(24px, 5vw, 80px)' }}
      >
        <span className="type-micro-dim">INDEPENDENT ENTITY</span>
      </div>

      {/* Central Statement */}
      <div className="statement-stage holo-refract" ref={textRef}>
        <h2
          className="statement-monument"
          style={{
            maxWidth: '1100px',
            fontSize: 'clamp(2rem, 4.8vw, 5.2rem)',
            lineHeight: 1.15,
            filter: 'url(#artifura-holo)',
          }}
        >
          ARTIFURA IS A<br />
          TECHNOLOGY COMPANY<br />
          BUILDING WHAT COMES NEXT.
        </h2>

        {/* Small Supporting Metadata */}
        <div
          style={{
            marginTop: 'clamp(28px, 4vh, 48px)',
            fontFamily: 'var(--font-mono)',
            fontSize: 'clamp(10px, 0.9vw, 13px)',
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            color: 'var(--color-gold-muted)',
          }}
        >
          EST. 2026 // INDIA
        </div>
      </div>

      {/* Perimeter Bottom Label */}
      <div 
        className="perimeter-telemetry"
        style={{ bottom: 'clamp(32px, 5vh, 64px)', left: '50%', transform: 'translateX(-50%)' }}
      >
        <span className="type-micro-dim">CORE DOCTRINE // ARTIFURA LABS</span>
      </div>
    </section>
  );
}
