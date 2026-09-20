import { useState, useEffect, useRef } from 'react';
import { getLenis } from './useLenisScroll';

/**
 * useSectionTransition
 * Tracks continuous scroll progress across the 8 manifesto sections using exact DOM anchor offsets.
 * Provides exact transition progress between adjacent sections, velocity, and scroll direction.
 */
export function useSectionTransition(totalSections = 8) {
  const [state, setState] = useState({
    activeSectionIndex: 0,
    outgoingIndex: null,
    incomingIndex: null,
    transitionProgress: 0,
    isTransitioning: false,
    direction: 1, // 1: down, -1: up
    velocity: 0,
    overallProgress: 0,
  });

  const lastScrollYRef = useRef(0);
  const velocityDampRef = useRef(0);

  useEffect(() => {
    const sectionIds = Array.from({ length: totalSections }, (_, i) => `section-${String(i + 1).padStart(2, '0')}`);

    const handleScroll = () => {
      const scrollY = window.scrollY;

      // Track scroll direction
      const rawDelta = scrollY - lastScrollYRef.current;
      const direction = rawDelta >= 0 ? 1 : -1;
      lastScrollYRef.current = scrollY;

      // Smooth velocity tracking
      velocityDampRef.current = velocityDampRef.current * 0.85 + Math.abs(rawDelta) * 0.15;
      const normalizedVel = Math.min(velocityDampRef.current / 20, 1);

      // Get anchor elements and their offsets
      const sectionEls = sectionIds.map((id) => document.getElementById(id));
      const offsets = sectionEls.map((el) => (el ? el.offsetTop : 0));

      // Calculate continuous progress across anchor positions
      let calculatedProgress = 0;

      if (offsets.length >= 2) {
        if (scrollY <= offsets[0]) {
          calculatedProgress = 0;
        } else if (scrollY >= offsets[offsets.length - 1]) {
          calculatedProgress = offsets.length - 1;
        } else {
          for (let i = 0; i < offsets.length - 1; i++) {
            const start = offsets[i];
            const end = offsets[i + 1];

            if (scrollY >= start && scrollY <= end) {
              const span = end - start;
              const ratio = span > 0 ? (scrollY - start) / span : 0;
              calculatedProgress = i + ratio;
              break;
            }
          }
        }
      }

      const clampedProgress = Math.max(0, Math.min(calculatedProgress, totalSections - 1));
      const currentIndex = Math.floor(clampedProgress);
      const nextIndex = Math.min(currentIndex + 1, totalSections - 1);
      const localProgress = clampedProgress - currentIndex; // 0 to 1 between sections

      // Transition window:
      // When localProgress is between 0.08 and 0.92, transition occurs.
      // Below 0.08, currentIndex is resting.
      // Above 0.92, nextIndex is resting.
      const isTransitioning = localProgress > 0.06 && localProgress < 0.94 && currentIndex !== nextIndex;

      let tProgress = 0;
      if (localProgress <= 0.06) {
        tProgress = 0;
      } else if (localProgress >= 0.94) {
        tProgress = 1;
      } else {
        tProgress = (localProgress - 0.06) / 0.88;
      }

      setState({
        activeSectionIndex: localProgress >= 0.5 ? nextIndex : currentIndex,
        outgoingIndex: currentIndex,
        incomingIndex: nextIndex,
        transitionProgress: tProgress,
        isTransitioning,
        direction,
        velocity: normalizedVel,
        overallProgress: clampedProgress,
      });
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
  }, [totalSections]);

  return state;
}
