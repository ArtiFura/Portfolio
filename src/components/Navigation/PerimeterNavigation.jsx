import React from 'react';
import SectionButton from './SectionButton';
import { PAGES } from '../../config/pages';
import { scrollToSection } from '../../hooks/useLenisScroll';

/**
 * PerimeterNavigation
 * Viewport architectural frame representing the 8 major Artifura PAGES:
 * 
 *                     ARTIFURA
 *        [ 01 ]                              [ 07 ]
 *        [ 02 ]                              [ 08 ]
 *                     CONTENT
 *           [ 03 ]  [ 04 ]  [ 05 ]  [ 06 ]
 * 
 * The active page displays [ XX // HOME ].
 * Scrolling through internal sections of a Page maintains the active HOME state.
 */
export default function PerimeterNavigation({
  activePageIndex = 0,
  currentTheme = 'light',
  onToggleTheme,
  onSelectPage,
}) {
  const handleSelectPage = (page) => {
    if (onSelectPage) {
      onSelectPage(page.index);
    } else {
      scrollToSection('#' + page.id);
    }
  };

  const p01 = PAGES[0];
  const p02 = PAGES[1];
  const p03 = PAGES[2];
  const p04 = PAGES[3];
  const p05 = PAGES[4];
  const p06 = PAGES[5];
  const p07 = PAGES[6];
  const p08 = PAGES[7];

  return (
    <nav className="perimeter-nav-frame" aria-label="Perimeter Page Navigation">
      {/* 1. TOP-CENTER: ARTIFURA Brand Header & Theme Switch */}
      <header
        style={{
          position: 'fixed',
          top: 'clamp(16px, 2.5vh, 26px)',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          alignItems: 'baseline',
          gap: 'clamp(12px, 2vw, 24px)',
          zIndex: 'var(--z-nav)',
          pointerEvents: 'auto',
          whiteSpace: 'nowrap',
        }}
      >
        <button
          type="button"
          onClick={() => {
            if (onSelectPage) {
              onSelectPage(0);
            } else {
              scrollToSection('#page-01');
            }
          }}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'baseline',
            gap: '10px',
            padding: '4px 0',
          }}
          aria-label="Artifura Home"
        >
          <span
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '17px',
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

        {/* Quiet Theme Toggle */}
        <button
          type="button"
          onClick={onToggleTheme}
          style={{
            background: 'none',
            border: 'none',
            fontFamily: 'var(--font-mono)',
            fontSize: '9.5px',
            letterSpacing: '0.22em',
            color: 'var(--color-gold-muted)',
            cursor: 'pointer',
            padding: '4px 8px',
            transition: 'color 0.2s ease',
            textTransform: 'uppercase',
          }}
          title="Toggle Theme"
          aria-label="Toggle Theme"
        >
          [{currentTheme === 'light' ? 'ALABASTER' : 'OBSIDIAN'}]
        </button>
      </header>

      {/* 2. LEFT SIDE: Page 01 (Top-Left) & Page 02 (Bottom-Left) */}
      <div
        className="perimeter-nav-col perimeter-left"
        style={{
          position: 'fixed',
          left: 'clamp(16px, 3vw, 44px)',
          top: 'clamp(90px, 18vh, 160px)',
          bottom: 'clamp(80px, 16vh, 140px)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          pointerEvents: 'none',
          zIndex: 'var(--z-nav)',
        }}
      >
        <div style={{ pointerEvents: 'auto' }}>
          <SectionButton
            section={p01}
            isActive={activePageIndex === 0}
            onClick={handleSelectPage}
          />
        </div>

        <div style={{ pointerEvents: 'auto' }}>
          <SectionButton
            section={p02}
            isActive={activePageIndex === 1}
            onClick={handleSelectPage}
          />
        </div>
      </div>

      {/* 3. RIGHT SIDE: Page 07 (Top-Right) & Page 08 (Bottom-Right) */}
      <div
        className="perimeter-nav-col perimeter-right"
        style={{
          position: 'fixed',
          right: 'clamp(16px, 3vw, 44px)',
          top: 'clamp(90px, 18vh, 160px)',
          bottom: 'clamp(80px, 16vh, 140px)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          pointerEvents: 'none',
          zIndex: 'var(--z-nav)',
        }}
      >
        <div style={{ pointerEvents: 'auto' }}>
          <SectionButton
            section={p07}
            isActive={activePageIndex === 6}
            onClick={handleSelectPage}
          />
        </div>

        <div style={{ pointerEvents: 'auto' }}>
          <SectionButton
            section={p08}
            isActive={activePageIndex === 7}
            onClick={handleSelectPage}
          />
        </div>
      </div>

      {/* 4. BOTTOM EDGE: Page 03, Page 04, Page 05, Page 06 (Equally spaced) */}
      <div
        className="perimeter-bottom-row"
        style={{
          position: 'fixed',
          bottom: 'clamp(16px, 3vh, 32px)',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 'clamp(8px, 1.4vw, 18px)',
          pointerEvents: 'auto',
          zIndex: 'var(--z-nav)',
          maxWidth: '92vw',
          overflowX: 'auto',
        }}
      >
        <SectionButton
          section={p03}
          isActive={activePageIndex === 2}
          onClick={handleSelectPage}
        />
        <SectionButton
          section={p04}
          isActive={activePageIndex === 3}
          onClick={handleSelectPage}
        />
        <SectionButton
          section={p05}
          isActive={activePageIndex === 4}
          onClick={handleSelectPage}
        />
        <SectionButton
          section={p06}
          isActive={activePageIndex === 5}
          onClick={handleSelectPage}
        />
      </div>
    </nav>
  );
}
