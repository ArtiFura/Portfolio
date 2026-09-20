import React, { useEffect, useLayoutEffect, useState, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Page from './Page';
import { PAGES } from '../../config/pages';
import { getLenis, resetLenisScroll } from '../../hooks/useLenisScroll';
import { useSectionSnap } from '../../hooks/useSectionSnap';

/**
 * ActivePageContainer
 * Mounts the active Page as an independent, contained scrollable world.
 * When navigating between pages from ANY section to ANY section, executes
 * exactly ONE synchronized horizontal slide:
 * - Forward (e.g. HOME -> PHILOSOPHY): Right to Left
 * - Backward (e.g. PHILOSOPHY -> HOME): Left to Right
 *
 * Guarantees that upon landing on any new page, it ALWAYS starts at the
 * absolute beginning (Section 0X.1, scroll = 0), never where left.
 */
export default function ActivePageContainer({
  activePageIndex = 0,
  onNavigatePage = () => {},
  onTransitionChange = () => {},
  velocity = 0,
}) {
  const [displayedPageIndex, setDisplayedPageIndex] = useState(activePageIndex);
  const [transitionState, setTransitionState] = useState({
    isTransitioning: false,
    leavingIndex: null,
    enteringIndex: null,
    isForward: true,
    scrollY: 0,
  });

  const isTransitioningRef = useRef(false);
  const leavingRef = useRef(null);
  const enteringRef = useRef(null);
  const mainContainerRef = useRef(null);

  // Architectural SECTION-ONLY Scroll Snapping System
  useSectionSnap({
    enabled: !transitionState.isTransitioning && !isTransitioningRef.current,
    pageIndex: displayedPageIndex,
    containerRef: mainContainerRef,
  });

  // Synchronously ensure scroll is anchored at top whenever displayed page changes
  useLayoutEffect(() => {
    resetLenisScroll();
  }, [displayedPageIndex]);

  // Recalculate dimensions & bounds dynamically whenever active page mounts or resizes
  useEffect(() => {
    resetLenisScroll();

    const updateDimensions = () => {
      const lenis = getLenis();
      if (lenis) {
        try {
          lenis.resize();
        } catch (e) {
          // ignore
        }
      }
      ScrollTrigger.refresh();
    };

    updateDimensions();

    const el = document.getElementById('artifura-contained-world');
    let ro = null;
    if (el && typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(() => {
        updateDimensions();
      });
      ro.observe(el);
    }

    const raf = requestAnimationFrame(updateDimensions);
    const timer = setTimeout(updateDimensions, 120);

    return () => {
      if (ro) ro.disconnect();
      cancelAnimationFrame(raf);
      clearTimeout(timer);
    };
  }, [displayedPageIndex]);

  useEffect(() => {
    // If activePageIndex hasn't changed or already transitioning, ignore
    if (activePageIndex === displayedPageIndex) return;
    if (isTransitioningRef.current) return;

    const fromIndex = displayedPageIndex;
    const toIndex = activePageIndex;

    // Determine slide direction:
    // Forward (Right to Left): next index > prev index
    // Backward (Left to Right): next index < prev index
    let isForward = toIndex > fromIndex;
    if (fromIndex === PAGES.length - 1 && toIndex === 0) isForward = true;
    if (fromIndex === 0 && toIndex === PAGES.length - 1) isForward = false;

    // Capture current scroll position to freeze visual state of leaving view
    const currentScrollY = window.scrollY || document.documentElement.scrollTop || 0;

    isTransitioningRef.current = true;
    onTransitionChange(true);

    setTransitionState({
      isTransitioning: true,
      leavingIndex: fromIndex,
      enteringIndex: toIndex,
      isForward,
      scrollY: currentScrollY,
    });

    // Reset window and Lenis scroll to 0 immediately at the start of the slide.
    // Because leavingRef has position: fixed; top: -currentScrollY, it stays perfectly
    // locked in the user's viewport without jumping!
    resetLenisScroll();
  }, [activePageIndex, displayedPageIndex, onTransitionChange]);

  // Execute GSAP synchronized slide animation
  useEffect(() => {
    if (!transitionState.isTransitioning) return;

    const leavingEl = leavingRef.current;
    const enteringEl = enteringRef.current;
    if (!leavingEl || !enteringEl) return;

    const distance = document.documentElement.clientWidth || window.innerWidth;
    const outX = transitionState.isForward ? -distance : distance;
    const inX = transitionState.isForward ? distance : -distance;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const duration = prefersReducedMotion ? 0.05 : 0.68;
    const ease = 'power3.inOut';

    gsap.killTweensOf([leavingEl, enteringEl]);
    gsap.set(enteringEl, { x: inX });
    gsap.set(leavingEl, { x: 0 });

    const tl = gsap.timeline({
      onComplete: () => {
        // Enforce scroll reset so the incoming page mounts at Section 0X.1
        resetLenisScroll();

        setDisplayedPageIndex(transitionState.enteringIndex);
        setTransitionState({
          isTransitioning: false,
          leavingIndex: null,
          enteringIndex: null,
          isForward: true,
          scrollY: 0,
        });

        isTransitioningRef.current = false;
        onTransitionChange(false);

        // Refresh ScrollTrigger and scroll position for the new page
        requestAnimationFrame(() => {
          resetLenisScroll();
          ScrollTrigger.refresh();
        });
      },
    });

    // Both panels slide simultaneously in a single synchronized motion
    tl.to(
      leavingEl,
      {
        x: outX,
        duration,
        ease,
      },
      0
    );

    tl.to(
      enteringEl,
      {
        x: 0,
        duration,
        ease,
      },
      0
    );

    return () => {
      tl.kill();
    };
  }, [transitionState, onTransitionChange]);

  const currentPage = PAGES[displayedPageIndex] || PAGES[0];
  const nextPageIndex = (displayedPageIndex + 1) % PAGES.length;
  const nextPage = PAGES[nextPageIndex];

  // Active Transition Mode: Render leaving view and entering view in tandem
  if (transitionState.isTransitioning) {
    const leavingPage = PAGES[transitionState.leavingIndex] || PAGES[0];
    const enteringPage = PAGES[transitionState.enteringIndex] || PAGES[0];
    const nextForEntering = PAGES[(transitionState.enteringIndex + 1) % PAGES.length];

    return (
      <main
        id="artifura-contained-world"
        role="main"
        style={{
          position: 'relative',
          width: '100%',
          height: '100svh',
          overflow: 'hidden',
          zIndex: 'var(--z-content)',
        }}
      >
        {/* Leaving Page: Fixed viewport clipping container */}
        <div
          ref={leavingRef}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100vh',
            overflow: 'hidden',
            backgroundColor: 'var(--color-surface)',
            pointerEvents: 'none',
            zIndex: 21,
            willChange: 'transform',
          }}
        >
          <div style={{ transform: `translate3d(0, -${transitionState.scrollY}px, 0)` }}>
            <Page
              page={leavingPage}
              nextPage={PAGES[(transitionState.leavingIndex + 1) % PAGES.length]}
              velocity={0}
              onNavigateNext={() => {}}
            />
          </div>
        </div>

        {/* Entering Page: Starts at Section 0X.1 at the top, sliding into view */}
        <div
          ref={enteringRef}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100vh',
            overflow: 'hidden',
            backgroundColor: 'var(--color-surface)',
            borderLeft: transitionState.isForward ? '1px solid var(--color-gold-hairline)' : 'none',
            borderRight: !transitionState.isForward ? '1px solid var(--color-gold-hairline)' : 'none',
            pointerEvents: 'none',
            zIndex: 22,
            willChange: 'transform',
          }}
        >
          <Page
            page={enteringPage}
            nextPage={nextForEntering}
            velocity={0}
            onNavigateNext={() => {}}
          />
        </div>
      </main>
    );
  }

  // Static Idle Mode: Active page in natural document flow starting at scroll 0
  return (
    <main
      ref={mainContainerRef}
      id="artifura-contained-world"
      role="main"
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '100svh',
        zIndex: 'var(--z-content)',
      }}
    >
      <Page
        key={currentPage.id}
        page={currentPage}
        nextPage={nextPage}
        velocity={velocity}
        onNavigateNext={(nextP) => onNavigatePage(nextP.index)}
      />
    </main>
  );
}
