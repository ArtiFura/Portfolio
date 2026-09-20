import React, { useEffect, useState } from 'react';

export default function PrecisionCursor({ mousePos }) {
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Hide on touch
    if (window.matchMedia('(hover: none) and (pointer: coarse)').matches) {
      return;
    }

    setIsVisible(true);

    const handleMouseOver = (e) => {
      const target = e.target;
      if (
        target.tagName === 'BUTTON' ||
        target.tagName === 'A' ||
        target.closest('button') ||
        target.closest('a') ||
        target.classList.contains('interactive')
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener('mouseover', handleMouseOver);
    return () => window.removeEventListener('mouseover', handleMouseOver);
  }, []);

  if (!isVisible) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        pointerEvents: 'none',
        zIndex: 'var(--z-cursor)',
        transform: `translate3d(${mousePos.x}px, ${mousePos.y}px, 0)`,
        transition: 'transform 0.04s linear',
        willChange: 'transform',
      }}
      aria-hidden="true"
    >
      {/* Central Precision Point */}
      <div
        style={{
          width: '4px',
          height: '4px',
          backgroundColor: 'var(--color-gold-bright)',
          borderRadius: '50%',
          position: 'absolute',
          top: '-2px',
          left: '-2px',
          boxShadow: '0 0 4px var(--color-gold-hairline-bright)',
        }}
      />

      {/* Reticle Ring */}
      <div
        style={{
          width: isHovering ? '44px' : '26px',
          height: isHovering ? '44px' : '26px',
          border: '1px solid var(--color-gold-hairline-bright)',
          borderRadius: '50%',
          position: 'absolute',
          top: isHovering ? '-22px' : '-13px',
          left: isHovering ? '-22px' : '-13px',
          transition: 'width 0.25s ease, height 0.25s ease, top 0.25s ease, left 0.25s ease, border-color 0.25s ease',
          backgroundColor: isHovering ? 'rgba(122, 91, 16, 0.06)' : 'transparent',
        }}
      />
    </div>
  );
}
