import React, { useEffect, useRef } from 'react';
import '../styles/cursor.css';

/**
 * CustomCursor - Hardware-Accelerated Precision Cursor
 *
 * Optimizations:
 * - Direct translate3d transforms (Compositor only, zero layout reflows)
 * - Zero React re-renders during mouse movement (direct DOM class/text updates)
 * - requestAnimationFrame loop automatically pauses when mouse is stationary
 * - Completely disabled on touch/coarse pointers
 */
export default function CustomCursor() {
  const containerRef = useRef(null);
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const labelRef = useRef(null);

  const mousePos = useRef({ x: -100, y: -100 });
  const ringPos = useRef({ x: -100, y: -100 });
  const currentState = useRef('normal');
  const currentLabel = useRef('');
  const isMoving = useRef(false);

  useEffect(() => {
    if (window.matchMedia('(hover: none) or (pointer: coarse)').matches) {
      return;
    }

    let animId;
    let idleTimeout;

    const render = () => {
      // Smooth interpolation for outer ring
      const factor = 0.2;
      ringPos.current.x += (mousePos.current.x - ringPos.current.x) * factor;
      ringPos.current.y += (mousePos.current.y - ringPos.current.y) * factor;

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringPos.current.x}px, ${ringPos.current.y}px, 0) translate(-50%, -50%)`;
      }

      // If outer ring has caught up with mouse, stop loop to save CPU
      const distSq =
        Math.pow(mousePos.current.x - ringPos.current.x, 2) +
        Math.pow(mousePos.current.y - ringPos.current.y, 2);

      if (distSq > 0.05 || isMoving.current) {
        animId = requestAnimationFrame(render);
      } else {
        animId = null;
      }
    };

    const startLoop = () => {
      if (!animId) {
        animId = requestAnimationFrame(render);
      }
    };

    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      mousePos.current.x = clientX;
      mousePos.current.y = clientY;
      isMoving.current = true;

      clearTimeout(idleTimeout);
      idleTimeout = setTimeout(() => {
        isMoving.current = false;
      }, 150);

      // 1. Move dot instantly via GPU translate3d (No layout reflow)
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${clientX}px, ${clientY}px, 0) translate(-50%, -50%)`;
      }

      startLoop();

      // 2. Efficient DOM inspector without React re-renders
      const target = e.target;
      if (!target) return;

      const experimentEl = target.closest('[data-cursor]');
      const interactiveEl = experimentEl ? null : target.closest('a, button, [role="button"], input, .tech-pill-btn');

      let newState = 'normal';
      let newLabel = '';

      if (experimentEl) {
        newState = 'experiment';
        newLabel = experimentEl.getAttribute('data-cursor') || 'EXPLORE';
      } else if (interactiveEl) {
        newState = 'interactive';
        newLabel = '';
      }

      // Only update DOM attributes if state actually changed
      if (newState !== currentState.current) {
        currentState.current = newState;
        if (containerRef.current) {
          containerRef.current.className = `custom-cursor-container ${
            newState === 'interactive' ? 'hover-interactive' : newState === 'experiment' ? 'hover-experiment' : ''
          }`;
        }
      }

      if (newLabel !== currentLabel.current) {
        currentLabel.current = newLabel;
        if (labelRef.current) {
          labelRef.current.textContent = newLabel;
        }
      }
    };

    const handleMouseLeave = () => {
      if (containerRef.current) {
        containerRef.current.style.opacity = '0';
      }
    };

    const handleMouseEnter = () => {
      if (containerRef.current) {
        containerRef.current.style.opacity = '1';
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      if (animId) cancelAnimationFrame(animId);
      clearTimeout(idleTimeout);
    };
  }, []);

  return (
    <div ref={containerRef} className="custom-cursor-container" aria-hidden="true">
      <div ref={dotRef} className="cursor-dot" />
      <div ref={ringRef} className="cursor-ring">
        <span ref={labelRef} className="cursor-label" />
      </div>
    </div>
  );
}
