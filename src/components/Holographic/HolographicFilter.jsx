import React, { useEffect, useRef } from 'react';

/**
 * HolographicFilter
 * Injects an inline SVG filter that distorts typography and geometry based on scroll velocity.
 * When velocity is 0: scale = 0, typography is razor sharp.
 * When velocity > 0: turbulence creates subtle micro-refraction and displacement.
 */
export default function HolographicFilter({ velocity = 0 }) {
  const dispMapRef = useRef(null);

  useEffect(() => {
    if (dispMapRef.current) {
      // Map normalized velocity (0..1) to scale (0..8px)
      const scale = Math.min(velocity * 8.5, 10);
      dispMapRef.current.setAttribute('scale', scale.toFixed(2));
    }
  }, [velocity]);

  return (
    <svg 
      style={{ position: 'absolute', width: 0, height: 0, pointerEvents: 'none' }} 
      aria-hidden="true"
    >
      <defs>
        <filter id="artifura-holo" x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence 
            type="fractalNoise" 
            baseFrequency="0.04 0.95" 
            numOctaves="2" 
            result="noise" 
          />
          <feDisplacementMap 
            ref={dispMapRef}
            in="SourceGraphic" 
            in2="noise" 
            scale="0" 
            xChannelSelector="R" 
            yChannelSelector="G" 
          />
        </filter>
      </defs>
    </svg>
  );
}
