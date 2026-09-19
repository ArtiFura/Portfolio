import React, { useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import GlassPanel from './GlassPanel';
import '../styles/contact.css';

gsap.registerPlugin(ScrollTrigger);

export default function Contact() {
  const sectionRef = useRef(null);
  const headlineRef = useRef(null);
  const emailWrapRef = useRef(null);
  const footerRef = useRef(null);

  // Waveform DOM element refs (Zero React re-renders)
  const wavePathRef = useRef(null);
  const waveBeadRef = useRef(null);
  const waveTextRef = useRef(null);

  const handleZoneMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const relativeY = e.clientY - rect.top;
    const targetY = Math.min(45, Math.max(5, relativeY * 0.4));

    if (wavePathRef.current) {
      wavePathRef.current.setAttribute('d', `M 0,25 Q 280,${targetY} 560,25`);
    }
    if (waveBeadRef.current) {
      waveBeadRef.current.setAttribute('cy', targetY);
    }
    if (waveTextRef.current) {
      waveTextRef.current.setAttribute('y', targetY + 4);
      waveTextRef.current.textContent = `RES: ${Math.round(targetY)}`;
    }
  };

  const handleZoneMouseLeave = () => {
    if (wavePathRef.current) {
      gsap.to(wavePathRef.current, {
        attr: { d: 'M 0,25 Q 280,25 560,25' },
        duration: 0.8,
        ease: 'elastic.out(1, 0.5)'
      });
    }
    if (waveBeadRef.current) {
      gsap.to(waveBeadRef.current, {
        attr: { cy: 25 },
        duration: 0.8,
        ease: 'elastic.out(1, 0.5)'
      });
    }
    if (waveTextRef.current) {
      gsap.to(waveTextRef.current, {
        attr: { y: 29 },
        duration: 0.8,
        ease: 'elastic.out(1, 0.5)',
        onComplete: () => {
          if (waveTextRef.current) waveTextRef.current.textContent = 'RES: 25';
        }
      });
    }
  };

  useGSAP(() => {
    const mm = gsap.matchMedia();

    mm.add('(min-width: 769px)', () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
          end: 'center center',
          scrub: 0
        }
      });

      // Decelerated settling
      tl.fromTo(headlineRef.current,
        { opacity: 0.2, y: 35 },
        { opacity: 1, y: 0, duration: 1.8, ease: 'power2.out' },
        0
      )
      .fromTo(emailWrapRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 1.6, ease: 'power2.out' },
        0.4
      )
      .fromTo(footerRef.current,
        { opacity: 0.3 },
        { opacity: 1, duration: 1.2, ease: 'power1.out' },
        0.6
      );
    });

    mm.add('(max-width: 768px)', () => {
      gsap.fromTo([headlineRef.current, emailWrapRef.current],
        { opacity: 0.3, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          stagger: 0.2,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%'
          }
        }
      );
    });

    return () => mm.revert();
  }, { scope: sectionRef });

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer ref={sectionRef} className="contact-section" id="contact" aria-label="Contact Section">
      {/* Header */}
      <div className="contact-header">
        <div className="contact-meta-left">
          <span className="tech-tag">
            <span className="tech-tag-pulse" />
            CHANNEL // 05
          </span>
          <span className="contact-label">DIRECT INQUIRIES</span>
        </div>
        <span className="contact-section-tag">05 / 05</span>
      </div>

      {/* Main Content Area: Refined Glass Contact Module */}
      <div className="contact-body">
        <GlassPanel
          variant="deep"
          geometry="brackets"
          tilt={true}
          className="contact-glass-console"
        >
          {/* Console Header Bar */}
          <div className="contact-console-header">
            <div className="contact-console-status">
              <span className="contact-pulse-beacon" />
              <span className="tech-micro-label">STATION // 05</span>
            </div>
            <span className="tech-coord">[ LATENCY: MINIMAL // ENCRYPTED ]</span>
          </div>

          <div className="contact-console-hero">
            <span className="tech-micro-label">// NEW PARTNERSHIPS</span>
            <h2 ref={headlineRef} className="contact-headline">
              Let's Build.
            </h2>
            <p className="contact-console-sub">
              Crafting intentional software, resilient systems, and kinetic digital experiences.
            </p>
          </div>

          {/* Glass Action Button */}
          <div className="contact-action-row">
            <a
              href="mailto:hello@artifura.in"
              className="glass-btn contact-glass-cta"
              data-cursor="CONNECT"
            >
              <span>START A CONVERSATION</span>
              <span className="glass-btn-arrow">→</span>
            </a>
          </div>

          {/* Interactive Zone: Email & Responsive Wave Path */}
          <div
            ref={emailWrapRef}
            className="contact-interactive-zone"
            onMouseMove={handleZoneMouseMove}
            onMouseLeave={handleZoneMouseLeave}
            data-cursor="MOVE"
          >
            <div className="contact-email-wrap">
              <a
                href="mailto:hello@artifura.in"
                className="contact-email-link"
                aria-label="Email ARTIFURA at hello@artifura.in"
              >
                hello@artifura.in
              </a>
            </div>

            {/* Interactive Elastic Waveform */}
            <svg className="contact-wave-svg" viewBox="0 0 560 50">
              <path
                ref={wavePathRef}
                className="contact-wave-path"
                d="M 0,25 Q 280,25 560,25"
              />
              {/* Deflection Coordinate Bead */}
              <circle ref={waveBeadRef} cx="280" cy="25" r="3" fill="#E6C65C" />
              <text ref={waveTextRef} x="290" y="29" className="flow-node-text" style={{ fontSize: '7px' }}>
                RES: 25
              </text>
            </svg>
          </div>
        </GlassPanel>
      </div>

      {/* Editorial Footer Sign-off */}
      <div ref={footerRef} className="contact-footer">
        <div className="contact-brand-block">
          <span className="contact-brand-name">Artifura</span>
          <span className="contact-brand-geo">INDIA // GLOBAL REACH</span>
        </div>

        <div className="contact-rights-block">
          <span className="contact-rights-text">© 2026 ARTIFURA. ALL RIGHTS RESERVED.</span>
          <button
            type="button"
            className="contact-scroll-top-btn"
            onClick={handleScrollToTop}
            aria-label="Back to top"
          >
            ↑ RETURN TO TOP
          </button>
        </div>
      </div>
    </footer>
  );
}
