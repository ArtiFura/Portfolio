import { useEffect, useRef, useState } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

let globalLenisInstance = null;

export function getLenis() {
  return globalLenisInstance;
}

export function resetLenisScroll() {
  if (typeof window !== 'undefined' && 'scrollRestoration' in window.history) {
    window.history.scrollRestoration = 'manual';
  }
  if (globalLenisInstance) {
    try {
      globalLenisInstance.start();
      globalLenisInstance.scrollTo(0, { immediate: true, force: true });
    } catch (e) {
      console.warn('Lenis scroll reset:', e);
    }
  }
  if (typeof window !== 'undefined') {
    try {
      window.scrollTo(0, 0);
      if (document.documentElement) document.documentElement.scrollTop = 0;
      if (document.body) document.body.scrollTop = 0;
    } catch (e) {
      // ignore
    }
  }
}

export function scrollToSection(target, options = {}) {
  if (globalLenisInstance) {
    globalLenisInstance.scrollTo(target, {
      offset: 0,
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      ...options,
    });
  } else {
    const el = typeof target === 'string' ? document.querySelector(target) : target;
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }
}

export function useLenisScroll() {
  const [velocity, setVelocity] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const lenisRef = useRef(null);
  const velocityDampRef = useRef(0);

  useEffect(() => {
    // Accessibility check
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const lenis = new Lenis({
      duration: prefersReducedMotion ? 0.01 : 1.25,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: !prefersReducedMotion,
      wheelMultiplier: 0.9,
      touchMultiplier: 1.5,
      infinite: false,
    });

    lenisRef.current = lenis;
    globalLenisInstance = lenis;

    // Connect Lenis scroll to ScrollTrigger
    lenis.on('scroll', (e) => {
      ScrollTrigger.update();

      const currentVel = e.velocity || 0;
      const progress = e.progress || 0;
      setScrollProgress(progress);

      // Smooth velocity interpolation
      velocityDampRef.current = currentVel;
    });

    // Synchronize Lenis with GSAP ticker
    const tickerCallback = (time) => {
      lenis.raf(time * 1000);

      // Settle velocity towards 0
      velocityDampRef.current *= 0.92;
      if (Math.abs(velocityDampRef.current) < 0.01) {
        velocityDampRef.current = 0;
      }

      const absVel = Math.abs(velocityDampRef.current);
      const normalizedVel = Math.min(absVel / 18, 1); // 0 to 1

      // Update CSS variables for fluid velocity-driven distortion
      const root = document.documentElement;
      root.style.setProperty('--scroll-velocity', normalizedVel.toFixed(4));
      root.style.setProperty('--scroll-distortion', (normalizedVel * 6).toFixed(2) + 'px');
      root.style.setProperty('--scroll-chromatic', (normalizedVel * 3).toFixed(2) + 'px');
      root.style.setProperty('--scroll-shear', (velocityDampRef.current * 0.08).toFixed(2) + 'deg');

      setVelocity(normalizedVel);
    };

    gsap.ticker.add(tickerCallback);
    gsap.ticker.lagSmoothing(0);

    // Initial ScrollTrigger refresh after mount
    const timeout = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 150);

    return () => {
      clearTimeout(timeout);
      gsap.ticker.remove(tickerCallback);
      lenis.destroy();
      globalLenisInstance = null;
    };
  }, []);

  return {
    lenis: lenisRef.current,
    velocity,
    scrollProgress,
    scrollToSection,
  };
}
