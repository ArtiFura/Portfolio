import React from 'react';
import '../../styles/variables.css';

export default function ArchitecturalGrid() {
  return (
    <div 
      className="architectural-grid" 
      aria-hidden="true"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 'var(--z-grid)',
        overflow: 'hidden'
      }}
    >
      {/* Corner Registration Reticles */}
      <div className="hud-corner hud-tl" />
      <div className="hud-corner hud-tr" />
      <div className="hud-corner hud-bl" />
      <div className="hud-corner hud-br" />

      {/* Subtle Central Axis Lines */}
      <div 
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: '50%',
          width: '1px',
          background: 'linear-gradient(180deg, transparent, var(--color-gold-hairline) 20%, var(--color-gold-hairline) 80%, transparent)',
          opacity: 0.35
        }} 
      />
      <div 
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: '50%',
          height: '1px',
          background: 'linear-gradient(90deg, transparent, var(--color-gold-hairline) 20%, var(--color-gold-hairline) 80%, transparent)',
          opacity: 0.35
        }} 
      />

      {/* Perimeter Subtle System Coordinates */}
      <div 
        className="perimeter-telemetry"
        style={{ bottom: '26px', left: '32px' }}
      >
        SPEC // MANIFESTO
      </div>

      <div 
        className="perimeter-telemetry"
        style={{ bottom: '26px', right: '32px' }}
      >
        SYS.REF // 28.61° N
      </div>
    </div>
  );
}
