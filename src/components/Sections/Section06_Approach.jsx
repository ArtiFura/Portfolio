import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const WORDS = ['THINK.', 'DESIGN.', 'ENGINEER.', 'REPEAT.'];

export default function Section06_Approach() {
  const sectionRef = useRef(null);
  const wordsRef = useRef([]);
  const beamRef = useRef(null);

  useEffect(() => {
    const el = sectionRef.current;
    const beam = beamRef.current;
    if (!el || !beam) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: 'top 70%',
          end: 'bottom 40%',
          scrub: 0.8,
        },
      });

      // Sequential revelation of words
      wordsRef.current.forEach((wordEl, idx) => {
        if (wordEl) {
          tl.fromTo(
            wordEl,
            { opacity: 0.15, y: 16 },
            { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' },
            idx * 0.3
          );
        }
      });

      // Traveling bronze beam line
      tl.fromTo(
        beam,
        { scaleX: 0, transformOrigin: 'left center', opacity: 0 },
        { scaleX: 1, opacity: 0.8, duration: 1.2, ease: 'power1.inOut' },
        0.1
      );
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section id="section-06" ref={sectionRef} className="manifesto-section">
      {/* Perimeter Telemetry */}
      <div 
        className="perimeter-telemetry"
        style={{ top: 'clamp(90px, 12vh, 130px)', left: 'clamp(24px, 5vw, 80px)' }}
      >
        <span className="type-micro">06 // METHODOLOGY</span>
      </div>

      <div 
        className="perimeter-telemetry"
        style={{ top: 'clamp(90px, 12vh, 130px)', right: 'clamp(24px, 5vw, 80px)' }}
      >
        <span className="type-micro-dim">CYCLE: ITERATIVE PRECISION</span>
      </div>

      {/* Central Statement */}
      <div className="statement-stage holo-refract" style={{ position: 'relative' }}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            position: 'relative',
            padding: '24px 0',
          }}
        >
          {/* Traveling Bronze Beam Line */}
          <div
            ref={beamRef}
            className="bronze-beam"
            style={{
              top: '50%',
              left: '-10%',
              width: '120%',
              zIndex: 0,
            }}
          />

          {WORDS.map((word, idx) => (
            <span
              key={word}
              ref={(el) => (wordsRef.current[idx] = el)}
              className="statement-monument"
              style={{
                fontSize: idx === 3 ? 'clamp(2.6rem, 6.2vw, 6.8rem)' : 'clamp(2.2rem, 5.2vw, 5.8rem)',
                color: idx === 3 ? 'var(--color-gold-bright)' : 'var(--display-text-color)',
                lineHeight: 1.15,
                filter: 'url(#artifura-holo)',
                transition: 'color 0.3s ease',
              }}
            >
              {word}
            </span>
          ))}
        </div>
      </div>

      {/* Perimeter Bottom Label */}
      <div 
        className="perimeter-telemetry"
        style={{ bottom: 'clamp(32px, 5vh, 64px)', left: '50%', transform: 'translateX(-50%)' }}
      >
        <span className="type-micro-dim">DISCIPLINE // CONTINUOUS COMPOSITION</span>
      </div>
    </section>
  );
}
