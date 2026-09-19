import React, { useEffect, useRef, useState } from 'react';
import ScrollTrigger from 'gsap/ScrollTrigger';
import gsap from 'gsap';
import { subscribeMomentumDebug } from '../utils/momentumScroll';

/**
 * Dev-Only Performance & Momentum Diagnostic HUD
 * Monitors real-time FPS, frame time (ms), and live momentum physics telemetry
 * (Scroll Velocity, Momentum State, and Current Position).
 * Only rendered in development mode (import.meta.env.DEV).
 */
export default function PerfDiagnostic() {
  if (!import.meta.env.DEV) return null;

  const [fps, setFps] = useState(60);
  const [frameTime, setFrameTime] = useState(16.6);
  const [activeTweens, setActiveTweens] = useState(0);
  const [collapsed, setCollapsed] = useState(false);

  const frameCount = useRef(0);
  const lastTime = useRef(performance.now());
  const lastFpsUpdate = useRef(performance.now());

  // Direct DOM refs for high-frequency telemetry (Zero React re-render overhead)
  const velRef = useRef(null);
  const momRef = useRef(null);
  const posRef = useRef(null);

  useEffect(() => {
    let animId;

    const loop = (now) => {
      const delta = now - lastTime.current;
      lastTime.current = now;
      frameCount.current += 1;

      // Update framerate metrics every 400ms
      if (now - lastFpsUpdate.current >= 400) {
        const calculatedFps = Math.round((frameCount.current * 1000) / (now - lastFpsUpdate.current));
        setFps(calculatedFps);
        setFrameTime(Math.round(delta * 10) / 10);
        setActiveTweens(gsap.globalTimeline.getChildren(true, true, false).length);

        frameCount.current = 0;
        lastFpsUpdate.current = now;
      }

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);

    // Subscribe to real-time physical momentum telemetry
    const unsubscribe = subscribeMomentumDebug((data) => {
      if (velRef.current) {
        velRef.current.textContent = data.velocityPxSec;
      }
      if (momRef.current) {
        momRef.current.textContent = data.momentum;
        momRef.current.style.color = data.momentum === 'ACTIVE' ? '#E6C65C' : 'rgba(230, 198, 92, 0.4)';
      }
      if (posRef.current) {
        posRef.current.textContent = data.position;
      }
    });

    return () => {
      cancelAnimationFrame(animId);
      unsubscribe();
    };
  }, []);

  const getFpsColor = () => {
    if (fps >= 75) return '#E6C65C'; // Bright gold (target achieved)
    if (fps >= 55) return '#C9A227'; // Primary gold (acceptable)
    return '#ff5555'; // Low framerate alert
  };

  return (
    <aside
      style={{
        position: 'fixed',
        bottom: '16px',
        left: '16px',
        zIndex: 99999,
        backgroundColor: 'rgba(10, 10, 10, 0.92)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        border: '1px solid rgba(201, 162, 39, 0.35)',
        borderRadius: '3px',
        padding: collapsed ? '6px 12px' : '10px 14px',
        fontFamily: 'monospace',
        fontSize: '11px',
        color: '#E6C65C',
        boxShadow: '0 8px 32px rgba(0,0,0,0.7)',
        userSelect: 'none',
        pointerEvents: 'auto',
        cursor: 'pointer',
        minWidth: collapsed ? 'auto' : '185px',
        transition: 'all 0.2s ease'
      }}
      onClick={() => setCollapsed(!collapsed)}
      title="Click to toggle diagnostic telemetry"
      aria-label="Development Performance HUD"
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
          <span
            style={{
              width: '7px',
              height: '7px',
              borderRadius: '50%',
              backgroundColor: getFpsColor(),
              boxShadow: `0 0 6px ${getFpsColor()}`
            }}
          />
          <strong style={{ color: getFpsColor(), fontSize: '12px' }}>
            {fps} FPS
          </strong>
          <span style={{ color: 'rgba(201, 162, 39, 0.6)' }}>({frameTime}ms)</span>
        </div>
        <span style={{ fontSize: '9px', color: 'rgba(201, 162, 39, 0.4)' }}>
          {collapsed ? '[+]' : '[-]'}
        </span>
      </div>

      {!collapsed && (
        <div
          style={{
            marginTop: '8px',
            paddingTop: '7px',
            borderTop: '1px solid rgba(201, 162, 39, 0.18)',
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
            fontSize: '10px',
            color: 'rgba(230, 198, 92, 0.8)'
          }}
        >
          {/* Real-time physical momentum indicators */}
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'rgba(201, 162, 39, 0.5)' }}>VELOCITY:</span>
            <span ref={velRef} style={{ fontWeight: 'bold', color: '#E6C65C' }}>+0 px/s</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'rgba(201, 162, 39, 0.5)' }}>MOMENTUM:</span>
            <span ref={momRef} style={{ fontWeight: 'bold', color: 'rgba(230, 198, 92, 0.4)' }}>REST</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'rgba(201, 162, 39, 0.5)' }}>POSITION:</span>
            <span ref={posRef} style={{ color: '#E6C65C' }}>0</span>
          </div>

          <div
            style={{
              marginTop: '4px',
              paddingTop: '5px',
              borderTop: '1px dashed rgba(201, 162, 39, 0.15)',
              display: 'flex',
              flexDirection: 'column',
              gap: '2px',
              fontSize: '9px',
              color: 'rgba(201, 162, 39, 0.55)'
            }}
          >
            <div>ACTIVE TWEENS: {activeTweens}</div>
            <div>SCROLLTRIGGERS: {ScrollTrigger.getAll().length}</div>
          </div>
        </div>
      )}
    </aside>
  );
}
