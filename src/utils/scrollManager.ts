import Lenis from 'lenis';

let lenisInstance: Lenis | null = null;
let isInitialized = false;

/**
 * Reset scroll position immediately to 0 for window and Lenis
 */
export function resetScrollToTop(): void {
  if (typeof window === 'undefined') return;
  window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
  if (lenisInstance) {
    lenisInstance.scrollTo(0, { immediate: true, force: true });
  }
}

/**
 * Initialize Lenis scroll momentum engine
 */
export function initScrollMomentum(): Lenis | null {
  if (typeof window === 'undefined') return null;
  if (lenisInstance) {
    lenisInstance.scrollTo(0, { immediate: true, force: true });
    return lenisInstance;
  }

  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  const isMobile = window.innerWidth < 768;

  lenisInstance = new Lenis({
    duration: isMobile ? 1.0 : 1.25,
    easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Exponential deceleration curve
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: true,
    wheelMultiplier: 0.95,
    touchMultiplier: 1.0,
    syncTouch: false, // CRITICAL: NEVER hijack touch on mobile/touch screens to preserve 60/120Hz hardware momentum
    syncTouchLerp: 0.1,
    prevent: (node: HTMLElement) => {
      if (!node || typeof node.closest !== 'function') return false;
      return (
        node.hasAttribute?.('data-lenis-prevent') ||
        node.closest('[data-lenis-prevent]') !== null ||
        node.closest('[role="dialog"]') !== null ||
        node.closest('.modal-scroll') !== null
      );
    },
  });

  isInitialized = true;

  function raf(time: number) {
    if (lenisInstance && !document.hidden) {
      lenisInstance.raf(time);
    }
    requestAnimationFrame(raf);
  }

  requestAnimationFrame(raf);

  // Force scroll to top on initialization for home section
  lenisInstance.scrollTo(0, { immediate: true, force: true });

  return lenisInstance;
}

/**
 * Get active Lenis instance
 */
export function getLenis(): Lenis | null {
  return lenisInstance;
}

/**
 * Stop or resume Lenis momentum (useful when modals are active)
 */
export function setScrollPaused(paused: boolean) {
  if (!lenisInstance) return;
  if (paused) {
    lenisInstance.stop();
  } else {
    lenisInstance.start();
  }
}

/**
 * Smoothly glide to any section or coordinate with momentum physics
 */
export function smoothScrollTo(
  target: string | number | HTMLElement,
  options: {
    offset?: number;
    duration?: number;
    immediate?: boolean;
    onComplete?: () => void;
  } = {}
) {
  const { offset = -80, duration = 1.15, immediate = false, onComplete } = options;

  if (lenisInstance) {
    lenisInstance.scrollTo(target, {
      offset,
      duration: immediate ? 0 : duration,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      onComplete,
    });
  } else {
    // Fallback if Lenis is not active
    if (typeof target === 'number') {
      window.scrollTo({ top: Math.max(0, target + offset), behavior: immediate ? 'auto' : 'smooth' });
    } else {
      const el = typeof target === 'string' ? (document.querySelector(target) as HTMLElement) : target;
      if (el) {
        const top = el.getBoundingClientRect().top + window.scrollY + offset;
        window.scrollTo({ top: Math.max(0, top), behavior: immediate ? 'auto' : 'smooth' });
      }
    }
    if (onComplete) {
      setTimeout(onComplete, immediate ? 0 : 500);
    }
  }
}

/**
 * Mouse-tracking spotlight helper for interactive cards
 */
export function handleSpotlightMove(e: React.MouseEvent<HTMLElement>) {
  if (typeof window !== 'undefined' && window.innerWidth < 768) return;
  const rect = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
  e.currentTarget.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
}

/**
 * Initialize scroll reveal observer for buttery smooth card/box entries
 */
export function initScrollReveals(): () => void {
  if (typeof window === 'undefined') return () => { };

  if (!('IntersectionObserver' in window)) {
    document.querySelectorAll('.scroll-reveal').forEach((el) => el.classList.add('is-revealed'));
    return () => { };
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target as HTMLElement;
          el.classList.add('is-revealed');
          observer.unobserve(el);
        }
      });
    },
    {
      threshold: 0.08,
      rootMargin: '0px 0px -40px 0px',
    }
  );

  const elements = document.querySelectorAll('.scroll-reveal');
  elements.forEach((el) => observer.observe(el));

  return () => {
    observer.disconnect();
  };
}

