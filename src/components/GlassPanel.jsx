import React, { useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import gsap from 'gsap';
import '../styles/glass.css';

/**
 * GlassPanel - High-Performance Dark Architectural Glassmorphism Container
 *
 * Performance Optimizations:
 * - Caches getBoundingClientRect() on pointerenter (Zero forced reflow during pointermove)
 * - IntersectionObserver pauses autonomous idle float when offscreen (0% CPU offscreen)
 * - Hardware-accelerated 3D tilt tracking (transforms only) with smooth physical recovery
 * - Respects prefers-reduced-motion & touch devices
 */
const GlassPanel = forwardRef(function GlassPanel(
  {
    children,
    variant = 'medium',
    geometry = 'standard',
    tilt = false,
    autonomousFloat = false,
    className = '',
    style = {},
    onMouseEnter,
    onMouseMove,
    onMouseLeave,
    ...rest
  },
  forwardedRef
) {
  const panelRef = useRef(null);
  const floatTlRef = useRef(null);
  const isHoveredRef = useRef(false);
  const rectRef = useRef(null);

  useImperativeHandle(forwardedRef, () => panelRef.current);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (autonomousFloat && !prefersReducedMotion && panelRef.current) {
      const tl = gsap.timeline({ repeat: -1, yoyo: true });
      tl.to(panelRef.current, {
        y: -4,
        duration: 4.8,
        ease: 'sine.inOut'
      });
      floatTlRef.current = tl;

      // Viewport Culling: Pause autonomous float when panel is offscreen
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (!isHoveredRef.current) floatTlRef.current?.resume();
          } else {
            floatTlRef.current?.pause();
          }
        });
      }, { threshold: 0.05 });

      observer.observe(panelRef.current);

      return () => {
        observer.disconnect();
        if (floatTlRef.current) floatTlRef.current.kill();
      };
    }

    return () => {
      if (floatTlRef.current) floatTlRef.current.kill();
    };
  }, [autonomousFloat]);

  const handlePointerEnter = (e) => {
    isHoveredRef.current = true;
    if (floatTlRef.current) {
      floatTlRef.current.pause();
    }
    // Cache bounding rect once on enter to avoid layout thrashing during move
    if (panelRef.current) {
      rectRef.current = panelRef.current.getBoundingClientRect();
    }
    if (onMouseEnter) onMouseEnter(e);
  };

  const handlePointerMove = (e) => {
    if (!panelRef.current) return;
    const rect = rectRef.current || panelRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Set custom properties for dynamic reflection
    panelRef.current.style.setProperty('--mouse-x', `${(x / rect.width) * 100}%`);
    panelRef.current.style.setProperty('--mouse-y', `${(y / rect.height) * 100}%`);

    // Subtle 3D tilt tracking if enabled
    if (tilt && window.matchMedia('(hover: hover)').matches) {
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const tiltX = ((e.clientY - centerY) / (rect.height / 2)) * -3;
      const tiltY = ((e.clientX - centerX) / (rect.width / 2)) * 3;

      gsap.to(panelRef.current, {
        rotateX: tiltX,
        rotateY: tiltY,
        transformPerspective: 1000,
        duration: 0.2,
        ease: 'power2.out',
        overwrite: 'auto'
      });
    }

    if (onMouseMove) onMouseMove(e);
  };

  const handlePointerLeave = (e) => {
    isHoveredRef.current = false;
    rectRef.current = null;

    // Smooth physical recovery
    const recoveryDuration = 0.85;

    if (panelRef.current) {
      gsap.to(panelRef.current, {
        rotateX: 0,
        rotateY: 0,
        duration: recoveryDuration,
        ease: 'power3.out',
        overwrite: 'auto'
      });
    }

    gsap.delayedCall(recoveryDuration * 0.8, () => {
      if (!isHoveredRef.current && floatTlRef.current) {
        floatTlRef.current.resume();
      }
    });

    if (onMouseLeave) onMouseLeave(e);
  };

  const geometryClass = {
    chamfer: 'glass-chamfer',
    brackets: 'glass-brackets',
    pill: 'glass-pill',
    straight: 'glass-straight',
    standard: ''
  }[geometry] || '';

  const variantClass = `glass-${variant}`;

  return (
    <div
      ref={panelRef}
      className={`glass-panel ${variantClass} ${geometryClass} ${className}`.trim()}
      style={style}
      onMouseEnter={handlePointerEnter}
      onMouseMove={handlePointerMove}
      onMouseLeave={handlePointerLeave}
      {...rest}
    >
      {/* Corner Brackets for technical geometry */}
      {geometry === 'brackets' && (
        <>
          <span className="glass-bracket-corner tl" aria-hidden="true" />
          <span className="glass-bracket-corner tr" aria-hidden="true" />
          <span className="glass-bracket-corner bl" aria-hidden="true" />
          <span className="glass-bracket-corner br" aria-hidden="true" />
        </>
      )}
      {children}
    </div>
  );
});

export default GlassPanel;
