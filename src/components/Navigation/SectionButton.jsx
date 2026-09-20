import React, { useState } from 'react';

/**
 * SectionButton
 * Represents an individual architectural perimeter navigation control.
 * Displays `[ 0X ]` when inactive, `[ ● 0X ]` on hover, and `[ 0X // HOME ]` when active.
 */
export default function SectionButton({
  section,
  isActive = false,
  onClick,
  className = '',
  style = {},
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <button
      type="button"
      onClick={() => onClick(section)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`perimeter-section-btn interactive ${isActive ? 'is-active' : ''} ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '6px',
        padding: isActive ? '6px clamp(10px, 1.1vw, 16px)' : '6px clamp(8px, 0.9vw, 14px)',
        border: isActive 
          ? '1px solid var(--color-gold-bright)' 
          : isHovered 
            ? '1px solid var(--color-gold-hairline-bright)' 
            : '1px solid var(--color-gold-hairline)',
        backgroundColor: isActive 
          ? 'var(--color-surface)' 
          : isHovered 
            ? 'rgba(234, 230, 219, 0.45)' 
            : 'rgba(245, 243, 237, 0.35)',
        backdropFilter: 'blur(6px)',
        color: isActive ? 'var(--color-gold-bright)' : 'var(--text-main)',
        fontFamily: 'var(--font-mono)',
        fontSize: 'clamp(9.5px, 0.78vw, 11px)',
        fontWeight: isActive ? 600 : 400,
        letterSpacing: isActive ? '0.16em' : '0.14em',
        cursor: 'pointer',
        borderRadius: '0px',
        transform: !isActive && isHovered ? 'translateY(-1px)' : 'none',
        transition: 'all 0.32s cubic-bezier(0.16, 1, 0.3, 1)',
        userSelect: 'none',
        whiteSpace: 'nowrap',
        boxSizing: 'border-box',
        minWidth: 'auto',
        height: '32px',
        ...style,
      }}
      aria-label={`Page ${section.title}${isActive ? ' (Current Page)' : ''}`}
      aria-current={isActive ? 'page' : undefined}
    >
      {/* Tiny Bronze Dot Indicator */}
      {isActive && (
        <span
          style={{
            width: '4px',
            height: '4px',
            backgroundColor: 'var(--color-gold-primary)',
            borderRadius: '50%',
            display: 'inline-block',
            marginRight: '2px',
          }}
          aria-hidden="true"
        />
      )}

      {/* Hover Dot on Inactive */}
      {!isActive && isHovered && (
        <span
          style={{
            width: '3px',
            height: '3px',
            backgroundColor: 'var(--color-gold-primary)',
            borderRadius: '50%',
            display: 'inline-block',
            opacity: 0.85,
            transition: 'opacity 0.2s ease',
          }}
          aria-hidden="true"
        />
      )}

      {/* Text Label: Actual Page Name */}
      <span>
        {section.title}
      </span>
    </button>
  );
}
