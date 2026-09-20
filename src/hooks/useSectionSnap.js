import { useEffect, useRef, useState, useCallback } from 'react';
import { getLenis } from './useLenisScroll';

/**
 * useSectionSnap
 *
 * SECTION-ONLY scroll snapping engine for Artifura.
 *
 * Core Guarantees:
 * 1. Exactly ONE section movement per intentional gesture (never skips sections).
 * 2. Minimal scrolls allow gentle displacement and softly settle back to current section.
 * 3. Momentum & trackpad inertia absorption: absorbs excess delta during and after snap.
 * 4. Page boundary containment: Section 01 stops at top (no prev page); End Indicator
 *    stops at bottom (no next page).
 * 5. Integrates with existing Lenis instance for buttery ease-out animation.
 */
export function useSectionSnap({
  enabled = true,
  pageIndex = 0,
  containerRef = null,
} = {}) {
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Internal mutable state references to prevent re-attaching listeners
  const stateRef = useRef({
    enabled,
    pageIndex,
    currentIndex: 0,
    isTransitioning: false,
    snapPoints: [0],
    accumulatedDelta: 0,
    lastWheelTime: 0,
    momentumDecayTimer: null,
    settleTimer: null,
    touchStartY: 0,
    touchLastY: 0,
    touchStartTime: 0,
    isTouchActive: false,
  });

  // Keep stateRef in sync with props
  stateRef.current.enabled = enabled;
  stateRef.current.pageIndex = pageIndex;

  /**
   * Recalculate snap points from DOM elements in the active page
   */
  const recalculateSnapPoints = useCallback(() => {
    if (typeof window === 'undefined') return;

    const lenis = getLenis();
    const currentScroll = window.scrollY || (lenis ? lenis.scroll : 0) || document.documentElement.scrollTop || 0;

    // 1. Query all section elements within the active page
    const container = containerRef?.current || document.getElementById('artifura-contained-world') || document;
    const sectionEls = Array.from(container.querySelectorAll('.page-section'));

    const points = [];

    sectionEls.forEach((el) => {
      const rect = el.getBoundingClientRect();
      const top = Math.round(rect.top + currentScroll);
      points.push(Math.max(0, top));
    });

    // 2. Query PageEndIndicator
    const endEl = container.querySelector('.page-end-indicator');
    const docHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
    const winHeight = window.innerHeight;
    const maxScroll = Math.max(0, docHeight - winHeight);

    if (endEl) {
      const endRect = endEl.getBoundingClientRect();
      const endTop = Math.round(endRect.top + currentScroll);
      // Snap point for the end indicator
      points.push(Math.min(maxScroll, endTop));
    } else if (maxScroll > 0) {
      points.push(maxScroll);
    }

    // Sort and remove duplicates closer than 80px
    points.sort((a, b) => a - b);
    const uniquePoints = [];
    points.forEach((p) => {
      if (uniquePoints.length === 0 || Math.abs(p - uniquePoints[uniquePoints.length - 1]) > 80) {
        uniquePoints.push(p);
      }
    });

    if (uniquePoints.length === 0) {
      uniquePoints.push(0);
    }

    stateRef.current.snapPoints = uniquePoints;

    // Detect current section index based on current scroll position
    let closestIdx = 0;
    let minDiff = Infinity;
    uniquePoints.forEach((p, idx) => {
      const diff = Math.abs(currentScroll - p);
      if (diff < minDiff) {
        minDiff = diff;
        closestIdx = idx;
      }
    });

    stateRef.current.currentIndex = closestIdx;
    setCurrentSectionIndex(closestIdx);
  }, [containerRef]);

  /**
   * Programmatically snap to a specific section index with buttery easing
   */
  const snapToSection = useCallback((targetIndex, { duration = 1.05, isSettling = false } = {}) => {
    const lenis = getLenis();
    const points = stateRef.current.snapPoints;
    if (!points || points.length === 0) return;

    // Boundary clamping
    const clampedIndex = Math.max(0, Math.min(targetIndex, points.length - 1));
    const targetY = points[clampedIndex];

    stateRef.current.currentIndex = clampedIndex;
    setCurrentSectionIndex(clampedIndex);

    stateRef.current.isTransitioning = true;
    setIsTransitioning(true);

    const prefersReducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const animDuration = prefersReducedMotion ? 0.05 : (isSettling ? 0.9 : duration);

    // Easing curve: soft cubic ease-out for settling, refined power3 ease-out for transitions
    const easing = isSettling
      ? (t) => 1 - Math.pow(1 - t, 3)
      : (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t));

    if (lenis) {
      try {
        let completed = false;
        const handleComplete = () => {
          if (completed) return;
          completed = true;
          if (fallbackTimer) clearTimeout(fallbackTimer);

          // Keep locked until trackpad/mouse momentum settles
          const checkMomentum = () => {
            const now = performance.now();
            const timeSinceLastWheel = now - stateRef.current.lastWheelTime;
            if (timeSinceLastWheel > 160) {
              stateRef.current.isTransitioning = false;
              setIsTransitioning(false);
              stateRef.current.accumulatedDelta = 0;
            } else {
              stateRef.current.momentumDecayTimer = setTimeout(checkMomentum, 60);
            }
          };
          checkMomentum();
        };

        const fallbackTimer = setTimeout(() => {
          handleComplete();
        }, (animDuration + 0.35) * 1000);

        lenis.scrollTo(targetY, {
          duration: animDuration,
          easing,
          force: true,
          lock: true,
          onComplete: handleComplete,
        });
      } catch (e) {
        window.scrollTo({ top: targetY, behavior: 'smooth' });
        setTimeout(() => {
          stateRef.current.isTransitioning = false;
          setIsTransitioning(false);
        }, animDuration * 1000);
      }
    } else {
      window.scrollTo({ top: targetY, behavior: 'smooth' });
      setTimeout(() => {
        stateRef.current.isTransitioning = false;
        setIsTransitioning(false);
      }, animDuration * 1000);
    }
  }, []);

  /**
   * Reset section index and snap points whenever the displayed Page changes
   */
  useEffect(() => {
    stateRef.current.currentIndex = 0;
    stateRef.current.accumulatedDelta = 0;
    stateRef.current.isTransitioning = false;
    setCurrentSectionIndex(0);
    setIsTransitioning(false);

    // Delay calculation slightly to allow React DOM to render new sections
    const timer = setTimeout(() => {
      recalculateSnapPoints();
    }, 80);

    return () => clearTimeout(timer);
  }, [pageIndex, recalculateSnapPoints]);

  /**
   * Listen for window resize, scrollbar release, & container DOM modifications
   */
  useEffect(() => {
    if (!enabled) return;

    window.addEventListener('resize', recalculateSnapPoints, { passive: true });

    // Handle scrollbar release settling: if user drags scrollbar and releases halfway
    let scrollbarDragTimer = null;
    const handleScroll = () => {
      if (stateRef.current.isTransitioning || stateRef.current.isTouchActive) return;

      clearTimeout(scrollbarDragTimer);
      scrollbarDragTimer = setTimeout(() => {
        if (!stateRef.current.isTransitioning && !stateRef.current.isTouchActive) {
          const currentScroll = window.scrollY || document.documentElement.scrollTop || 0;
          const points = stateRef.current.snapPoints;
          let closestIdx = 0;
          let minDiff = Infinity;
          points.forEach((p, idx) => {
            const diff = Math.abs(currentScroll - p);
            if (diff < minDiff) {
              minDiff = diff;
              closestIdx = idx;
            }
          });
          // If stopped halfway (more than 40px away from section snap point), settle cleanly
          if (minDiff > 40) {
            snapToSection(closestIdx, { isSettling: true });
          } else {
            stateRef.current.currentIndex = closestIdx;
            setCurrentSectionIndex(closestIdx);
          }
        }
      }, 220);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    let ro = null;
    const container = containerRef?.current || document.getElementById('artifura-contained-world');
    if (container && typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(() => {
        recalculateSnapPoints();
      });
      ro.observe(container);
    }

    return () => {
      window.removeEventListener('resize', recalculateSnapPoints);
      window.removeEventListener('scroll', handleScroll);
      if (scrollbarDragTimer) clearTimeout(scrollbarDragTimer);
      if (ro) ro.disconnect();
    };
  }, [enabled, containerRef, recalculateSnapPoints, snapToSection]);

  /**
   * Primary Gesture Controller: Wheel & Trackpad Handling
   */
  useEffect(() => {
    if (!enabled) return;

    const INTENT_THRESHOLD = 65; // Threshold in normalized pixels to trigger transition

    const handleWheel = (e) => {
      if (!stateRef.current.enabled) return;

      // Prevent native uncontrolled scroll & stop Lenis default free-scroll
      if (e.cancelable) e.preventDefault();
      e.lenisStopPropagation = true;

      const now = performance.now();
      const timeSinceLastWheel = now - stateRef.current.lastWheelTime;
      stateRef.current.lastWheelTime = now;

      // Normalize wheel delta across devices (mouse wheel vs trackpad)
      let deltaY = e.deltaY;
      if (e.deltaMode === 1) deltaY *= 35; // lines
      if (e.deltaMode === 2) deltaY *= 600; // pages

      // CASE 3: If already transitioning, ABSORB remaining momentum
      if (stateRef.current.isTransitioning) {
        stateRef.current.accumulatedDelta = 0;
        return;
      }

      // If there was a pause of more than 260ms, consider this the start of a fresh gesture
      if (timeSinceLastWheel > 260) {
        stateRef.current.accumulatedDelta = 0;
      }

      stateRef.current.accumulatedDelta += deltaY;
      const accumulated = stateRef.current.accumulatedDelta;

      // CASE 1: MINIMAL SCROLL (below threshold)
      if (Math.abs(accumulated) < INTENT_THRESHOLD) {
        // Clear any existing settle timer
        if (stateRef.current.settleTimer) {
          clearTimeout(stateRef.current.settleTimer);
        }

        // Allow subtle micro-resistance displacement
        const points = stateRef.current.snapPoints;
        const currentAnchor = points[stateRef.current.currentIndex] || 0;
        const maxScroll = points[points.length - 1] || 0;
        const lenis = getLenis();
        const microDisplacement = Math.sign(accumulated) * Math.min(Math.abs(accumulated) * 0.35, 30);
        const clampedTarget = Math.max(0, Math.min(maxScroll, currentAnchor + microDisplacement));

        if (lenis) {
          lenis.scrollTo(clampedTarget, { immediate: true, force: true });
        }

        // Soft settle back to current section position after pause
        stateRef.current.settleTimer = setTimeout(() => {
          if (!stateRef.current.isTransitioning) {
            snapToSection(stateRef.current.currentIndex, { isSettling: true });
            stateRef.current.accumulatedDelta = 0;
          }
        }, 180);

        return;
      }

      // CASE 2: INTENTIONAL SCROLL (threshold reached)
      // Clear settle timer immediately
      if (stateRef.current.settleTimer) {
        clearTimeout(stateRef.current.settleTimer);
        stateRef.current.settleTimer = null;
      }

      const direction = accumulated > 0 ? 1 : -1; // 1: Down, -1: Up
      stateRef.current.accumulatedDelta = 0; // Reset accumulator

      const currentIndex = stateRef.current.currentIndex;
      const targetIndex = currentIndex + direction;
      const maxIndex = stateRef.current.snapPoints.length - 1;

      // PAGE BOUNDARY PROTECTION:
      // At first section: scrolling up remains at first section (no prev page)
      // At final section: scrolling down remains at final section (no next page)
      if (targetIndex < 0) {
        snapToSection(0, { isSettling: true });
        return;
      }
      if (targetIndex > maxIndex) {
        snapToSection(maxIndex, { isSettling: true });
        return;
      }

      // Execute smooth 1-section transition
      snapToSection(targetIndex);
    };

    window.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      window.removeEventListener('wheel', handleWheel);
      if (stateRef.current.settleTimer) clearTimeout(stateRef.current.settleTimer);
      if (stateRef.current.momentumDecayTimer) clearTimeout(stateRef.current.momentumDecayTimer);
    };
  }, [enabled, snapToSection]);

  /**
   * Touch Gesture Support (Mobile / Tablets)
   */
  useEffect(() => {
    if (!enabled) return;

    const TOUCH_SWIPE_THRESHOLD = 50;

    const handleTouchStart = (e) => {
      if (!stateRef.current.enabled) return;
      if (e.touches.length !== 1) return;

      stateRef.current.touchStartY = e.touches[0].clientY;
      stateRef.current.touchLastY = e.touches[0].clientY;
      stateRef.current.touchStartTime = performance.now();
      stateRef.current.isTouchActive = true;
    };

    const handleTouchMove = (e) => {
      if (!stateRef.current.isTouchActive) return;
      stateRef.current.touchLastY = e.touches[0].clientY;

      if (stateRef.current.isTransitioning) {
        if (e.cancelable) e.preventDefault();
      }
    };

    const handleTouchEnd = () => {
      if (!stateRef.current.isTouchActive) return;
      stateRef.current.isTouchActive = false;

      if (stateRef.current.isTransitioning) return;

      const deltaY = stateRef.current.touchStartY - stateRef.current.touchLastY;
      const deltaTime = performance.now() - stateRef.current.touchStartTime;
      const velocity = Math.abs(deltaY) / Math.max(deltaTime, 1);

      if (Math.abs(deltaY) >= TOUCH_SWIPE_THRESHOLD || velocity > 0.45) {
        const direction = deltaY > 0 ? 1 : -1;
        const targetIndex = stateRef.current.currentIndex + direction;
        const maxIndex = stateRef.current.snapPoints.length - 1;

        if (targetIndex >= 0 && targetIndex <= maxIndex) {
          snapToSection(targetIndex);
        } else {
          snapToSection(stateRef.current.currentIndex, { isSettling: true });
        }
      } else {
        // Minimal touch: gentle settling
        snapToSection(stateRef.current.currentIndex, { isSettling: true });
      }
    };

    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [enabled, snapToSection]);

  /**
   * Keyboard Navigation Support (Arrow keys, PageUp/Down, Home, End, Space)
   */
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (e) => {
      if (!stateRef.current.enabled || stateRef.current.isTransitioning) return;

      // Ignore if user is typing in an input or textarea
      if (['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) return;

      const currentIndex = stateRef.current.currentIndex;
      const maxIndex = stateRef.current.snapPoints.length - 1;

      if (e.key === 'ArrowDown' || e.key === 'PageDown' || (e.key === ' ' && !e.shiftKey)) {
        e.preventDefault();
        if (currentIndex < maxIndex) {
          snapToSection(currentIndex + 1);
        }
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp' || (e.key === ' ' && e.shiftKey)) {
        e.preventDefault();
        if (currentIndex > 0) {
          snapToSection(currentIndex - 1);
        }
      } else if (e.key === 'Home') {
        e.preventDefault();
        snapToSection(0);
      } else if (e.key === 'End') {
        e.preventDefault();
        snapToSection(maxIndex);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [enabled, snapToSection]);

  return {
    currentSectionIndex,
    totalSections: stateRef.current.snapPoints.length,
    isTransitioning,
    snapToSection,
    recalculateSnapPoints,
  };
}
