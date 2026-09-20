import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Section03_Systems() {
  const sectionRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = canvas.offsetWidth;
    let height = canvas.offsetHeight;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    const handleResize = () => {
      width = canvas.offsetWidth;
      height = canvas.offsetHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    // Minimal constellation network nodes (14 nodes)
    const nodes = Array.from({ length: 14 }, (_, i) => ({
      x: width * 0.2 + Math.random() * width * 0.6,
      y: height * 0.2 + Math.random() * height * 0.6,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      phase: Math.random() * Math.PI * 2,
    }));

    let animId;
    let time = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      time += 0.012;

      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      const bronzeLine = isDark ? 'rgba(201, 162, 39, ' : 'rgba(122, 91, 16, ';

      // Update positions
      nodes.forEach((n) => {
        n.x += n.vx;
        n.y += n.vy;

        if (n.x < width * 0.15 || n.x > width * 0.85) n.vx *= -1;
        if (n.y < height * 0.15 || n.y > height * 0.85) n.vy *= -1;
      });

      // Draw faint lines between nearby points
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 180) {
            // Pulse opacity to simulate forming and dissolving
            const pulse = Math.sin(time + nodes[i].phase) * 0.5 + 0.5;
            const alpha = ((1 - dist / 180) * 0.22 * pulse).toFixed(3);

            ctx.strokeStyle = `${bronzeLine}${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw tiny node points
      nodes.forEach((n) => {
        const nodeAlpha = (Math.sin(time * 1.5 + n.phase) * 0.25 + 0.35).toFixed(3);
        ctx.fillStyle = `${bronzeLine}${nodeAlpha})`;
        ctx.beginPath();
        ctx.arc(n.x, n.y, 1.8, 0, Math.PI * 2);
        ctx.fill();
      });

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <section id="section-03" ref={sectionRef} className="manifesto-section">
      {/* Perimeter Metadata */}
      <div 
        className="perimeter-telemetry"
        style={{ top: 'clamp(90px, 12vh, 130px)', left: 'clamp(24px, 5vw, 80px)' }}
      >
        <span className="type-micro">03 // ARCHITECTURE</span>
      </div>

      <div 
        className="perimeter-telemetry"
        style={{ top: 'clamp(90px, 12vh, 130px)', right: 'clamp(24px, 5vw, 80px)' }}
      >
        <span className="type-micro-dim">TOPOLOGY: ADAPTIVE MESH</span>
      </div>

      {/* Abstract Network Canvas behind text */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 'var(--z-canvas)',
        }}
        aria-hidden="true"
      />

      {/* Central Statement */}
      <div className="statement-stage holo-refract">
        <h2 className="statement-monument" style={{ filter: 'url(#artifura-holo)' }}>
          WE TURN<br />
          COMPLEXITY<br />
          INTO SYSTEMS.
        </h2>
      </div>

      {/* Perimeter Bottom Label */}
      <div 
        className="perimeter-telemetry"
        style={{ bottom: 'clamp(32px, 5vh, 64px)', left: '50%', transform: 'translateX(-50%)' }}
      >
        <span className="type-micro-dim">STRUCTURE // ORCHESTRATION</span>
      </div>
    </section>
  );
}
