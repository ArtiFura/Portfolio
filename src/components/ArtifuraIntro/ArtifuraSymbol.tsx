import React, { useId } from 'react';

interface ArtifuraSymbolProps {
  className?: string;
  style?: React.CSSProperties;
  size?: number | string;
  glow?: boolean;
}

/**
 * Custom gold angular "A" emblem with horizontal starburst flare
 * Faithfully matches the uploaded visual reference with precision vector paths.
 */
export const ArtifuraSymbol: React.FC<ArtifuraSymbolProps> = ({
  className = '',
  style,
  size,
  glow = true,
}) => {
  const reactId = useId();
  const cleanId = reactId.replace(/[^a-zA-Z0-9_-]/g, '_');
  const goldBodyGradId = `artifuraGoldBodyGrad_${cleanId}`;
  const flareGradId = `artifuraFlareGrad_${cleanId}`;
  const glowFXId = `artifuraGoldGlowFX_${cleanId}`;

  return (
    <svg
      viewBox="0 0 112 86"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{
        width: size || undefined,
        height: size || undefined,
        overflow: 'visible',
        display: 'inline-block',
        ...style,
      }}
      aria-hidden="true"
    >
      <defs>
        {/* Warm Golden Amber Gradient */}
        <linearGradient id={goldBodyGradId} x1="5%" y1="100%" x2="95%" y2="0%">
          <stop offset="0%" stopColor="#E59B1F" />
          <stop offset="25%" stopColor="#F5B228" />
          <stop offset="60%" stopColor="#FFD457" />
          <stop offset="85%" stopColor="#FFE78F" />
          <stop offset="100%" stopColor="#FFF5C2" />
        </linearGradient>

        {/* Pale Champagne / White Starburst Flare Gradient */}
        <linearGradient id={flareGradId} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#FFE78F" stopOpacity="0.8" />
          <stop offset="42%" stopColor="#FFFFFF" stopOpacity="1" />
          <stop offset="70%" stopColor="#FFF4C7" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#F5B228" stopOpacity="0.45" />
        </linearGradient>

        {/* Warm Golden Bloom Glow Filter */}
        <filter id={glowFXId} x="-35%" y="-35%" width="170%" height="170%">
          <feGaussianBlur stdDeviation="2.4" result="blur1" />
          <feGaussianBlur stdDeviation="5.8" result="blur2" />
          <feMerge>
            <feMergeNode in="blur2" />
            <feMergeNode in="blur1" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <g filter={glow ? `url(#${glowFXId})` : undefined}>
        {/* COMPONENT 1: UPPER ARCH & LEFT ANGLED LEG */}
        <path
          d="M 4.0 82.5 L 24.5 82.5 L 62.5 30.0 C 63.5 28.5 65.5 28.5 66.5 30.0 L 70.5 45.0 L 73.0 50.5 L 75.5 47.0 L 77.0 41.0 L 81.5 47.0 L 85.0 50.5 L 92.5 51.0 L 71.5 7.0 C 68.5 3.5 62.0 3.5 57.5 7.0 Z"
          fill={`url(#${goldBodyGradId})`}
        />

        {/* COMPONENT 2: LOWER RIGHT LEG BASE */}
        <path
          d="M 87.0 82.5 L 106.0 82.5 L 101.5 70.0 L 97.5 62.0 L 82.0 62.0 C 84.0 66.0 86.0 73.0 85.5 81.0 Z"
          fill={`url(#${goldBodyGradId})`}
        />

        {/* COMPONENT 3: STARBURST NEEDLE FLARE WITH WHITE CORE */}
        <path
          d="M 49.5 60.0 L 108.5 60.0 C 103.0 61.2 98.0 62.5 94.0 65.0 C 89.0 68.0 84.5 73.5 82.0 77.0 C 81.0 73.5 78.5 68.0 75.0 65.0 C 68.0 62.5 59.0 60.8 49.5 60.0 Z"
          fill={`url(#${flareGradId})`}
        />
      </g>
    </svg>
  );
};

/**
 * Geometric inverted V / lambda "A" glyph matching the 8th letter in the uploaded reference
 * (Precision geometric sans-serif crossbar-less A with squared top and flat feet)
 */
export const ArtifuraLambdaGlyph: React.FC<{ className?: string; style?: React.CSSProperties }> = ({
  className = '',
  style,
}) => {
  return (
    <svg
      viewBox="0 0 65 60"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{
        overflow: 'visible',
        display: 'inline-block',
        ...style,
      }}
      aria-label="A"
    >
      <path d="M 27.5 0 L 37.5 0 L 65 60 L 51.5 60 L 32.5 14 L 13.5 60 L 0 60 Z" />
    </svg>
  );
};

/**
 * Complete Artifura brand logo lockup:
 * Custom Gold Angular A Symbol + "RTIFUR" (Space Grotesk) + Lambda Glyph (Λ)
 */
export const ArtifuraLogo: React.FC<{ className?: string; glow?: boolean }> = ({
  className = '',
  glow = true,
}) => {
  return (
    <span className={`inline-flex items-end font-display font-semibold uppercase leading-none select-none tracking-[0.05em] ${className}`}>
      {/* Custom Gold Angular A Symbol */}
      <span className="inline-block relative mr-[0.24em] shrink-0">
        <ArtifuraSymbol
          glow={glow}
          className="h-[1.28em] w-auto align-baseline drop-shadow-[0_0_16px_rgba(255,212,87,0.5)] transition-transform duration-300 group-hover:scale-105"
        />
      </span>

      {/* RTIFUR in clean geometric sans (Space Grotesk) */}
      <span className="text-[#f0efea] group-hover:text-white transition-colors duration-200">
        RTIFUR
      </span>

      {/* Custom Lambda A Glyph */}
      <span className="inline-block relative text-[#f0efea] group-hover:text-white transition-colors duration-200">
        <ArtifuraLambdaGlyph className="h-[0.88em] w-auto inline-block align-baseline" />
      </span>
    </span>
  );
};
