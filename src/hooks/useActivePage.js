import { useState, useEffect, useRef } from 'react';
import { getLenis } from './useLenisScroll';
import { PAGES } from '../config/pages';

/**
 * useActivePage
 * Determines which of the 8 major Pages currently occupies the central viewport.
 * Scrolling through internal sections of a page keeps activePageIndex constant.
 * Only crossing a Page boundary updates the active Page and // HOME button.
 */
export function useActivePage() {
  const [activePageIndex, setActivePageIndex] = useState(0);
  const [scrollVelocity, setScrollVelocity] = useState(0);
  const lastScrollYRef = useRef(0);
  const velocityDampRef = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const viewportCenter = scrollY + window.innerHeight * 0.45;

      // Track velocity and direction
      const rawDelta = scrollY - lastScrollYRef.current;
      lastScrollYRef.current = scrollY;

      velocityDampRef.current = velocityDampRef.current * 0.85 + Math.abs(rawDelta) * 0.15;
      const normalizedVel = Math.min(velocityDampRef.current / 22, 1);
      setScrollVelocity(normalizedVel);

      // Find active page based on bounding offset of page elements
      const pageElements = PAGES.map((p) => document.getElementById(p.id));

      for (let i = pageElements.length - 1; i >= 0; i--) {
        const el = pageElements[i];
        if (el) {
          const top = el.offsetTop;
          if (viewportCenter >= top) {
            setActivePageIndex(i);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });

    const lenis = getLenis();
    if (lenis) {
      lenis.on('scroll', handleScroll);
    }

    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      if (lenis) {
        lenis.off('scroll', handleScroll);
      }
    };
  }, []);

  return {
    activePageIndex,
    activePage: PAGES[activePageIndex] || PAGES[0],
    scrollVelocity,
  };
}
