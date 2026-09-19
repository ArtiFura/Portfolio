import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import '../styles/scrollProgress.css';

gsap.registerPlugin(ScrollTrigger);

const CHECKPOINTS = [
  { id: 'intro', label: 'INTRO' },
  { id: 'about', label: 'ABOUT' },
  { id: 'system-interlude', label: 'SYSTEMS' },
  { id: 'philosophy', label: 'PHILOSOPHY' },
  { id: 'what-we-do', label: 'CAPABILITIES' },
  { id: 'contact', label: 'CONTACT' }
];

export default function ScrollProgress() {
  const [activeCheckpoint, setActiveCheckpoint] = useState('intro');
  const railRef = useRef(null);
  const beadRef = useRef(null);

  useEffect(() => {
    // 1. Hardware-accelerated bead tracking via ScrollTrigger (Zero React re-renders during scroll)
    const progressTrigger = ScrollTrigger.create({
      start: 0,
      end: 'max',
      onUpdate: (self) => {
        if (beadRef.current && railRef.current) {
          const railHeight = railRef.current.clientHeight;
          const targetY = self.progress * railHeight;
          beadRef.current.style.transform = `translate3d(-50%, ${targetY}px, 0)`;
        }
      }
    });

    // 2. High-performance checkpoint watchers using ScrollTrigger (No layout thrashing / offsetTop queries)
    const checkpointTriggers = CHECKPOINTS.map((cp) => {
      return ScrollTrigger.create({
        trigger: `#${cp.id}`,
        start: 'top 45%',
        end: 'bottom 45%',
        onToggle: (self) => {
          if (self.isActive) {
            setActiveCheckpoint(cp.id);
          }
        }
      });
    });

    return () => {
      progressTrigger.kill();
      checkpointTriggers.forEach((t) => t.kill());
    };
  }, []);

  const handleClick = (e, id) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav ref={railRef} className="scroll-progress-rail" aria-label="Section Navigation Rail">
      {/* Track line */}
      <div className="scroll-progress-track" />

      {/* Traveling Bead (GPU transform) */}
      <div
        ref={beadRef}
        className="scroll-progress-bead"
        aria-hidden="true"
      />

      {/* Section Node Checkpoints */}
      <div className="scroll-progress-nodes">
        {CHECKPOINTS.map((cp) => (
          <div
            key={cp.id}
            className={`scroll-node-item ${activeCheckpoint === cp.id ? 'active' : ''}`}
            onClick={(e) => handleClick(e, cp.id)}
            role="button"
            tabIndex={0}
            aria-label={`Jump to ${cp.label}`}
          >
            <span className="scroll-node-dot" />
            <span className="scroll-node-label">{cp.label}</span>
          </div>
        ))}
      </div>
    </nav>
  );
}
