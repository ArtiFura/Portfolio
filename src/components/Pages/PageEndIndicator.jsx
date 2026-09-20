import React, { useEffect, useState, useRef } from 'react';

/**
 * PageEndIndicator
 * An architectural boundary marker placed at the bottom of each Page.
 * Communicates to the user that they have reached the end of this world,
 * creating an intentional spatial pause.
 */
export default function PageEndIndicator({
  pageNumber = '01',
  pageTitle = 'HOME',
  nextPage = null,
  onNavigateNext = () => {},
}) {
  const [opacity, setOpacity] = useState(0.35);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const el = containerRef.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // As the indicator enters the viewport, calculate progress from 0 to 1
      const totalDistance = windowHeight * 0.8;
      const currentDistance = windowHeight - rect.top;
      const progress = Math.max(0, Math.min(1, currentDistance / totalDistance));

      // Opacity ramps from 0.35 to 1.0
      setOpacity(0.35 + progress * 0.65);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <footer
      ref={containerRef}
      className="page-end-indicator"
      style={{
        width: '100%',
        minHeight: 'clamp(280px, 45vh, 460px)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        padding: 'clamp(48px, 8vh, 80px) clamp(24px, 5vw, 80px)',
        boxSizing: 'border-box',
        opacity,
        transition: 'opacity 0.25s ease',
        userSelect: 'none',
      }}
      aria-label={`End of Page ${pageTitle}`}
    >
      {/* Top Hairline Divider */}
      <div
        style={{
          width: 'min(320px, 50vw)',
          height: '1px',
          backgroundColor: 'var(--color-gold-hairline)',
          opacity: 0.7,
          marginBottom: 'clamp(28px, 5vh, 48px)',
        }}
      />

      {/* Center Architectural Marker */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '8px',
          textAlign: 'center',
          transform: `translate3d(0, ${(1 - opacity) * 12}px, 0)`,
          transition: 'transform 0.25s ease-out',
        }}
      >
        {/* Tiny Bronze Reticle Point */}
        <span
          style={{
            display: 'inline-block',
            width: '3px',
            height: '3px',
            backgroundColor: 'var(--color-gold-primary)',
            borderRadius: '50%',
            opacity: 0.8,
            marginBottom: '4px',
          }}
          aria-hidden="true"
        />

        <span
          className="type-micro"
          style={{
            letterSpacing: '0.34em',
            fontSize: 'clamp(9px, 0.75vw, 11px)',
            color: 'var(--color-gold-bright)',
          }}
        >
          END OF PAGE
        </span>

        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 'clamp(14px, 1.3vw, 18px)',
            fontWeight: 500,
            letterSpacing: '0.22em',
            color: 'var(--color-gold-bright)',
          }}
        >
          {pageTitle}
        </span>
      </div>

      {/* Understated Next Page Hint (Non-intrusive architectural link) */}
      {nextPage && (
        <div style={{ marginTop: 'clamp(24px, 4vh, 40px)' }}>
          <button
            type="button"
            onClick={() => onNavigateNext(nextPage)}
            className="interactive"
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 12px',
              fontFamily: 'var(--font-mono)',
              fontSize: 'clamp(9px, 0.75vw, 10.5px)',
              letterSpacing: '0.24em',
              textTransform: 'uppercase',
              color: 'var(--color-gold-muted)',
              borderBottom: '1px solid transparent',
              transition: 'all 0.25s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = 'var(--color-gold-bright)';
              e.currentTarget.style.borderBottomColor = 'var(--color-gold-hairline)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'var(--color-gold-muted)';
              e.currentTarget.style.borderBottomColor = 'transparent';
            }}
            aria-label={`Navigate to Page ${nextPage.title}`}
          >
            NEXT // {nextPage.title} →
          </button>
        </div>
      )}

      {/* Bottom Hairline Divider */}
      <div
        style={{
          width: 'min(320px, 50vw)',
          height: '1px',
          backgroundColor: 'var(--color-gold-hairline)',
          opacity: 0.7,
          marginTop: 'clamp(28px, 5vh, 48px)',
        }}
      />
    </footer>
  );
}
