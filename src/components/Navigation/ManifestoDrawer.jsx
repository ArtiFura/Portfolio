import React, { useEffect } from 'react';
import { scrollToSection } from '../../hooks/useLenisScroll';

const SECTIONS = [
  { id: 'section-01', index: '01', title: 'WE BUILD WHAT COMES NEXT', category: 'MANIFESTO' },
  { id: 'section-02', index: '02', title: 'IDEAS DESERVE TO BECOME REAL', category: 'THESIS' },
  { id: 'section-03', index: '03', title: 'WE TURN COMPLEXITY INTO SYSTEMS', category: 'ARCHITECTURE' },
  { id: 'section-04', index: '04', title: 'BUILT WITH THE RIGHT TOOLS', category: 'TECHNOLOGY' },
  { id: 'section-05', index: '05', title: 'WE MAKE THINGS THAT WORK', category: 'OUTPUT' },
  { id: 'section-06', index: '06', title: 'THINK. DESIGN. ENGINEER. REPEAT.', category: 'METHOD' },
  { id: 'section-07', index: '07', title: 'ARTIFURA IS A TECHNOLOGY COMPANY', category: 'IDENTITY' },
  { id: 'section-08', index: '08', title: 'HAVE SOMETHING WORTH BUILDING?', category: 'ENGAGEMENT' },
];

export default function ManifestoDrawer({ isOpen, onClose }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSelect = (id) => {
    onClose();
    setTimeout(() => {
      scrollToSection(`#${id}`);
    }, 100);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Manifesto Index"
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'var(--nav-bg)',
        backdropFilter: 'blur(20px)',
        zIndex: 'var(--z-modal)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: 'clamp(28px, 6vw, 80px)',
        animation: 'fadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        overflowY: 'auto',
      }}
    >
      {/* Drawer Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
          borderBottom: '1px solid var(--color-gold-hairline)',
          paddingBottom: '24px',
        }}
      >
        <div style={{ display: 'flex', gap: '16px', alignItems: 'baseline' }}>
          <span
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '20px',
              letterSpacing: '0.15em',
              fontWeight: 600,
            }}
          >
            ARTIFURA
          </span>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              letterSpacing: '0.22em',
              color: 'var(--color-gold-muted)',
            }}
          >
            // ARCHITECTURAL INDEX
          </span>
        </div>

        <button
          type="button"
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            letterSpacing: '0.25em',
            color: 'var(--color-gold-bright)',
            cursor: 'pointer',
            padding: '6px 12px',
          }}
          aria-label="Close Index"
        >
          [ESC // CLOSE]
        </button>
      </div>

      {/* Index Item List */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 'clamp(14px, 2.8vh, 26px)',
          margin: 'clamp(40px, 8vh, 80px) 0',
          maxWidth: '1000px',
        }}
      >
        {SECTIONS.map((sec) => (
          <button
            key={sec.id}
            type="button"
            onClick={() => handleSelect(sec.id)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'baseline',
              gap: 'clamp(16px, 4vw, 48px)',
              textAlign: 'left',
              padding: '8px 0',
              transition: 'transform 0.25s ease, opacity 0.25s ease',
            }}
            className="interactive"
          >
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '12px',
                letterSpacing: '0.2em',
                color: 'var(--color-gold-muted)',
                minWidth: '32px',
              }}
            >
              {sec.index}
            </span>

            <span
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(1.2rem, 2.5vw, 2.2rem)',
                letterSpacing: '-0.01em',
                fontWeight: 500,
                color: 'var(--display-text-color)',
                textTransform: 'uppercase',
              }}
            >
              {sec.title}
            </span>

            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '10px',
                letterSpacing: '0.22em',
                color: 'var(--color-gold-hairline-bright)',
                marginLeft: 'auto',
                display: 'none',
              }}
            >
              [{sec.category}]
            </span>
          </button>
        ))}
      </div>

      {/* Drawer Footer */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
          borderTop: '1px solid var(--color-gold-hairline)',
          paddingTop: '24px',
          fontFamily: 'var(--font-mono)',
          fontSize: '11px',
          letterSpacing: '0.2em',
          color: 'var(--color-gold-muted)',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div>EST. 2026 // BENGALURU, INDIA</div>
        <div>COMMUNICATIONS: HELLO@ARTIFURA.COM</div>
        <div>ALL RIGHTS RESERVED</div>
      </div>
    </div>
  );
}
