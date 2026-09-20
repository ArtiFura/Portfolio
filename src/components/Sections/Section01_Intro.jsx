import React from 'react';

export default function Section01_Intro() {
  return (
    <section id="section-01" className="manifesto-section">
      {/* Perimeter Micro-Label */}
      <div 
        className="perimeter-telemetry"
        style={{ top: 'clamp(90px, 12vh, 130px)', left: 'clamp(24px, 5vw, 80px)' }}
      >
        <span className="type-micro">ARTIFURA // TECHNOLOGY COMPANY</span>
      </div>

      <div 
        className="perimeter-telemetry"
        style={{ top: 'clamp(90px, 12vh, 130px)', right: 'clamp(24px, 5vw, 80px)' }}
      >
        <span className="type-micro-dim">SECTION 01 // OVERVIEW</span>
      </div>

      {/* The Central Monumental Statement */}
      <div className="statement-stage holo-refract">
        <h1 className="statement-monument" style={{ filter: 'url(#artifura-holo)' }}>
          WE BUILD<br />
          WHAT COMES NEXT.
        </h1>
      </div>

      {/* Subtle Bottom Coordinates */}
      <div 
        className="perimeter-telemetry"
        style={{ bottom: 'clamp(32px, 5vh, 64px)', left: '50%', transform: 'translateX(-50%)' }}
      >
        <span className="type-micro-dim">SCROLL TO NAVIGATE MANIFESTO ↓</span>
      </div>
    </section>
  );
}
