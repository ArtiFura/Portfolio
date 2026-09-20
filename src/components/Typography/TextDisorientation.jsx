import React, { useMemo } from 'react';
import { useReducedMotion } from '../../hooks/useReducedMotion';

/**
 * TextDisorientation
 * Implements the signature Artifura metamorphic text transition:
 * TEXT → DISORIENTATION → OVERLAP → REASSEMBLY
 * 
 * Characters are deterministically displaced using a spatial wave field,
 * modulated by transition progress, scroll velocity, and direction.
 */
export default function TextDisorientation({
  lines = [],
  role = 'resting', // 'resting' | 'outgoing' | 'incoming'
  progress = 0,     // 0 (resting at start) to 1 (resting at end)
  velocity = 0,     // 0 (stationary) to 1 (fast)
  direction = 1,    // 1: down, -1: up
  seed = 1,
  className = '',
  style = {},
}) {
  const prefersReducedMotion = useReducedMotion();

  // Mobile detection for scaled displacement
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const isTablet = typeof window !== 'undefined' && window.innerWidth < 1024;

  // Compute character transforms and styling
  const renderedContent = useMemo(() => {
    // 1. Reduced Motion mode: clean cross-fade without displacement
    if (prefersReducedMotion) {
      let opacity = 1;
      if (role === 'outgoing') {
        opacity = Math.max(0, 1 - progress * 1.6);
      } else if (role === 'incoming') {
        opacity = Math.min(1, Math.max(0, (progress - 0.25) * 1.6));
      }
      return (
        <div style={{ opacity, transition: 'opacity 0.2s ease' }}>
          {lines.map((line, idx) => (
            <div key={idx} style={{ display: 'block' }}>{line}</div>
          ))}
        </div>
      );
    }

    // 2. Resting state (no transition)
    if (role === 'resting' || (role === 'outgoing' && progress <= 0) || (role === 'incoming' && progress >= 1)) {
      return (
        <div style={{ opacity: 1, transform: 'none' }}>
          {lines.map((line, idx) => (
            <div key={idx} style={{ display: 'block', whiteSpace: 'nowrap' }}>
              {line}
            </div>
          ))}
        </div>
      );
    }

    // 3. Dynamic Transition State (Disorientation, Overlap, Reassembly)
    // Scale parameters by device
    const maxShiftX = isMobile ? 12 : isTablet ? 18 : 26;
    const maxShiftY = isMobile ? 18 : isTablet ? 26 : 38;
    const maxRot = isMobile ? 1.8 : isTablet ? 2.6 : 3.6;
    const maxSkew = isMobile ? 1.2 : 2.2;

    // Velocity scale factor: higher velocity creates slightly stronger disorientation
    // Min 0.65 (so slow scroll still has a refined physical shift), max 1.3
    const velScale = 0.65 + Math.min(velocity, 1) * 0.65;

    // Transition progress envelopes
    let roleOpacity = 1;
    let baseDisplacementY = 0;
    let disorientationFactor = 0;

    if (role === 'outgoing') {
      // Outgoing text:
      // - Starts resting at progress = 0
      // - Disorientation factor ramps up smoothly from 0 to 1
      // - Drifts upward (if scrolling down: direction = 1, drift is negative Y)
      // - Fades out between progress 0.25 and 0.68
      disorientationFactor = Math.min(progress / 0.55, 1);
      baseDisplacementY = -direction * (progress * 55);

      if (progress < 0.22) {
        roleOpacity = 1;
      } else if (progress > 0.68) {
        roleOpacity = 0;
      } else {
        // Smooth fade out
        roleOpacity = 1 - (progress - 0.22) / (0.68 - 0.22);
      }
    } else if (role === 'incoming') {
      // Incoming text:
      // - Invisible until progress = 0.22
      // - Emerges from below (if scrolling down: direction = 1, enters from +55px)
      // - Disorientation factor decreases as it aligns toward 1.0
      // - Fades in between progress 0.22 and 0.72
      if (progress < 0.22) {
        return null; // Not yet visible
      }

      disorientationFactor = Math.max(0, 1 - (progress - 0.22) / 0.78);
      baseDisplacementY = direction * ((1 - progress) * 55);

      if (progress > 0.75) {
        roleOpacity = 1;
      } else {
        // Smooth fade in
        roleOpacity = (progress - 0.22) / (0.75 - 0.22);
      }
    }

    if (roleOpacity <= 0) return null;

    // Peak Holographic Refraction around progress = 0.45 to 0.55
    const peakEnvelope = Math.sin(Math.PI * progress);
    const holoRefract = peakEnvelope * (0.4 + 0.6 * velocity);

    const cyanShadow = (holoRefract * -2.4).toFixed(1);
    const bronzeShadow = (holoRefract * 2.4).toFixed(1);
    const textShadowStyle = holoRefract > 0.12
      ? `${cyanShadow}px 0px 2px var(--holo-faint-cyan), ${bronzeShadow}px 0px 2px var(--holo-faint-bronze)`
      : 'none';

    let globalCharIndex = 0;

    return (
      <div
        style={{
          opacity: roleOpacity,
          textShadow: textShadowStyle,
          willChange: 'transform, opacity',
          transition: 'opacity 0.08s linear',
        }}
      >
        {lines.map((line, lineIdx) => {
          const words = line.split(' ');

          return (
            <div
              key={lineIdx}
              className="disorientation-line"
              style={{
                display: 'block',
                whiteSpace: 'nowrap',
                lineHeight: 1.08,
              }}
            >
              {words.map((word, wordIdx) => {
                const chars = word.split('');

                return (
                  <span
                    key={wordIdx}
                    className="disorientation-word"
                    style={{
                      display: 'inline-block',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {chars.map((char, charIdx) => {
                      globalCharIndex++;

                      // Spatial harmonic wave formula (deterministic noise field)
                      const phase = (globalCharIndex * 0.42 + lineIdx * 1.8 + seed * 2.5);
                      const waveX = Math.sin(phase) * 0.7 + Math.cos(phase * 1.6) * 0.3;
                      const waveY = Math.cos(phase * 0.9) * 0.7 + Math.sin(phase * 2.1) * 0.3;
                      const waveRot = Math.sin(phase * 1.3);
                      const waveSkew = Math.cos(phase * 1.1);

                      // Calculated character transforms
                      const tx = (waveX * maxShiftX * disorientationFactor * velScale).toFixed(2);
                      const ty = (baseDisplacementY + waveY * maxShiftY * disorientationFactor * velScale).toFixed(2);
                      const rot = (waveRot * maxRot * disorientationFactor * velScale).toFixed(2);
                      const skew = (waveSkew * maxSkew * disorientationFactor * velScale).toFixed(2);
                      const scale = (1 - disorientationFactor * 0.04).toFixed(3);

                      // Micro blur at peak movement
                      const blurAmount = (disorientationFactor * velScale * 1.2).toFixed(1);
                      const filterStyle = blurAmount > 0.3 ? `blur(${blurAmount}px)` : 'none';

                      return (
                        <span
                          key={charIdx}
                          className="disorientation-char"
                          style={{
                            display: 'inline-block',
                            transform: `translate3d(${tx}px, ${ty}px, 0) rotate(${rot}deg) skewX(${skew}deg) scale(${scale})`,
                            filter: filterStyle,
                            willChange: 'transform',
                          }}
                        >
                          {char}
                        </span>
                      );
                    })}

                    {/* Word Space separator */}
                    {wordIdx < words.length - 1 && (
                      <span
                        className="disorientation-space"
                        style={{ display: 'inline-block' }}
                      >
                        &nbsp;
                      </span>
                    )}
                  </span>
                );
              })}
            </div>
          );
        })}
      </div>
    );
  }, [lines, role, progress, velocity, direction, seed, prefersReducedMotion, isMobile, isTablet]);

  return (
    <div
      className={`statement-monument text-disorientation-container ${className}`}
      style={{
        ...style,
      }}
    >
      {renderedContent}
    </div>
  );
}
