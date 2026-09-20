import React, { useEffect, useState } from 'react';
import { scrollToSection } from '../../hooks/useLenisScroll';

const SECTIONS = [
  { id: 'section-01', index: '01', label: 'INTRO' },
  { id: 'section-02', index: '02', label: 'IDEAS' },
  { id: 'section-03', index: '03', label: 'SYSTEMS' },
  { id: 'section-04', index: '04', label: 'STACK' },
  { id: 'section-05', index: '05', label: 'WORK' },
  { id: 'section-06', index: '06', label: 'APPROACH' },
  { id: 'section-07', index: '07', label: 'ARTIFURA' },
  { id: 'section-08', index: '08', label: 'CONTACT' },
];

export default function ProgressIndicator({ activeIdx: propActiveIdx }) {
  const [internalActiveIdx, setInternalActiveIdx] = useState(0);

  const activeIdx = propActiveIdx !== undefined ? propActiveIdx : internalActiveIdx;

  useEffect(() => {
    if (propActiveIdx !== undefined) return;

    const handleScroll = () => {
      const scrollPos = window.scrollY + window.innerHeight * 0.45;
      const sectionEls = SECTIONS.map(s => document.getElementById(s.id));

      for (let i = sectionEls.length - 1; i >= 0; i--) {
        const el = sectionEls[i];
        if (el && el.offsetTop <= scrollPos) {
          setActiveIdx(i);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <aside
      aria-label="Section Index"
      style={{
        position: 'fixed',
        right: 'clamp(16px, 2.5vw, 36px)',
        top: '50%',
        transform: 'translateY(-50%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        gap: '14px',
        zIndex: 'var(--z-hud)',
        pointerEvents: 'auto',
      }}
    >
      {/* Current Active Indicator */}
      <div
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '11px',
          letterSpacing: '0.22em',
          color: 'var(--color-gold-bright)',
          marginBottom: '6px',
        }}
      >
        {SECTIONS[activeIdx].index} // 08
      </div>

      {/* Tiny Track / Dot List */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '8px',
        }}
      >
        {SECTIONS.map((sec, idx) => {
          const isActive = idx === activeIdx;
          return (
            <button
              key={sec.id}
              type="button"
              onClick={() => scrollToSection(`#${sec.id}`)}
              style={{
                background: 'none',
                border: 'none',
                padding: '4px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
              }}
              title={`${sec.index} — ${sec.label}`}
              aria-label={`Jump to ${sec.label}`}
            >
              <span
                style={{
                  display: 'block',
                  width: isActive ? '18px' : '6px',
                  height: '1px',
                  backgroundColor: isActive
                    ? 'var(--color-gold-bright)'
                    : 'var(--color-gold-hairline)',
                  transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                }}
              />
            </button>
          );
        })}
      </div>
    </aside>
  );
}
