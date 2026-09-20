import React, { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Section08_Contact() {
  const [copied, setCopied] = useState(false);
  const sectionRef = useRef(null);
  const contentRef = useRef(null);

  const email = 'hello@artifura.com';

  const handleCopy = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  useEffect(() => {
    const el = sectionRef.current;
    const content = contentRef.current;
    if (!el || !content) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        content,
        { opacity: 0.2, scale: 0.96 },
        {
          opacity: 1,
          scale: 1,
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
    <section id="section-08" ref={sectionRef} className="manifesto-section">
      {/* Perimeter Telemetry */}
      <div 
        className="perimeter-telemetry"
        style={{ top: 'clamp(90px, 12vh, 130px)', left: 'clamp(24px, 5vw, 80px)' }}
      >
        <span className="type-micro">08 // TRANSMISSION</span>
      </div>

      <div 
        className="perimeter-telemetry"
        style={{ top: 'clamp(90px, 12vh, 130px)', right: 'clamp(24px, 5vw, 80px)' }}
      >
        <span className="type-micro-dim">CHANNEL: DIRECT INQUIRY</span>
      </div>

      {/* Almost Completely Empty Viewport with Centered Statement & Understated CTA */}
      <div className="statement-stage holo-refract" ref={contentRef}>
        <h2 className="statement-monument" style={{ filter: 'url(#artifura-holo)' }}>
          HAVE SOMETHING<br />
          WORTH BUILDING?
        </h2>

        {/* Understated Action */}
        <div style={{ marginTop: 'clamp(36px, 6vh, 64px)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px' }}>
          <button
            type="button"
            onClick={handleCopy}
            className="type-cta interactive"
            aria-label="Contact Artifura via email"
          >
            {copied ? '[COPIED: HELLO@ARTIFURA.COM]' : "LET'S TALK →"}
          </button>

          <a
            href={`mailto:${email}`}
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              letterSpacing: '0.22em',
              color: 'var(--color-gold-muted)',
              textDecoration: 'none',
              opacity: 0.75,
              transition: 'opacity 0.2s ease',
            }}
            className="interactive"
          >
            {email}
          </a>
        </div>
      </div>

      {/* Understated Bottom Footer Perimeter */}
      <div 
        className="perimeter-telemetry"
        style={{ bottom: 'clamp(32px, 5vh, 64px)', left: '50%', transform: 'translateX(-50%)', whiteSpace: 'nowrap' }}
      >
        <span className="type-micro-dim">ARTIFURA // BENGALURU, INDIA // END OF MANIFESTO</span>
      </div>
    </section>
  );
}
