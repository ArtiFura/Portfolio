import React from 'react';
import { scrollToSection } from '../../hooks/useLenisScroll';

export default function MinimalNav({ onOpenMenu, currentTheme, onToggleTheme }) {
  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: 'var(--header-height)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 clamp(24px, 4vw, 56px)',
        zIndex: 'var(--z-nav)',
        pointerEvents: 'none',
      }}
    >
      {/* Top-Left: ARTIFURA Brand Mark */}
      <button
        type="button"
        onClick={() => scrollToSection('#section-01')}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          pointerEvents: 'auto',
          display: 'flex',
          alignItems: 'baseline',
          gap: '12px',
          padding: '8px 0',
          color: 'var(--display-text-color)',
        }}
        aria-label="Artifura Home"
      >
        <span
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '18px',
            fontWeight: 600,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: 'var(--color-gold-bright)',
          }}
        >
          ARTIFURA
        </span>
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '10px',
            letterSpacing: '0.18em',
            color: 'var(--color-gold-muted)',
            opacity: 0.8,
          }}
        >
          // 2026
        </span>
      </button>

      {/* Top-Right: Actions (Theme Toggle & Technical Menu Button) */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '24px',
          pointerEvents: 'auto',
        }}
      >
        {/* Subtle Theme Toggle */}
        <button
          type="button"
          onClick={onToggleTheme}
          style={{
            background: 'none',
            border: 'none',
            fontFamily: 'var(--font-mono)',
            fontSize: '10px',
            letterSpacing: '0.22em',
            color: 'var(--color-gold-muted)',
            cursor: 'pointer',
            padding: '6px 10px',
            transition: 'color 0.2s ease',
            textTransform: 'uppercase',
          }}
          title="Toggle Theme"
          aria-label="Toggle Theme"
        >
          [{currentTheme === 'light' ? 'ALABASTER' : 'OBSIDIAN'}]
        </button>

        {/* Menu Trigger */}
        <button
          type="button"
          onClick={onOpenMenu}
          style={{
            background: 'rgba(245, 243, 237, 0.4)',
            border: '1px solid var(--color-gold-hairline)',
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            letterSpacing: '0.25em',
            color: 'var(--color-gold-bright)',
            cursor: 'pointer',
            padding: '8px 18px',
            backdropFilter: 'blur(8px)',
            transition: 'all 0.25s ease',
            textTransform: 'uppercase',
          }}
          aria-label="Open Technical Index"
        >
          MENU
        </button>
      </div>
    </header>
  );
}
