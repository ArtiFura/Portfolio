/**
 * ARTIFURA — PHYSICAL INERTIAL MOMENTUM SCROLLING ENGINE
 *
 * Implements mobile-like swipe inertia for desktop wheel and trackpad inputs:
 * 1. Immediate tactile response on input (0ms floaty lag)
 * 2. Velocity builds and accumulates on repeated inputs
 * 3. Page visibly continues moving when wheel input stops
 * 4. Exponential friction decays velocity gradually to a natural stop
 * 5. Physical direction resistance counteracts opposite scroll gestures
 * 6. Frame-rate independent GSAP ticker integration (60Hz to 144Hz)
 * 7. 100% synchronized with ScrollTrigger (scrub: 0) and pinned sections
 * 8. Asynchronous scroll event filtering prevents accidental velocity cancellation
 */

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Observer } from 'gsap/Observer';

gsap.registerPlugin(ScrollTrigger, Observer);

export const MOMENTUM_CONFIG = {
  wheelSensitivity: 0.85,
  acceleration: 0.14,             // Calibrated lower for a calmer, slower scroll pace
  trackpadAcceleration: 0.11,     // Slower trackpad scaling
  friction: 0.938,                // Controlled, elegant exponential decay (~1.0s glide)
  maxVelocity: 55,                // Bounded maximum velocity cap (~3300 px/s)
  stopThreshold: 0.10,            // Natural settle threshold
  directionResistance: 0.70,      // Firm counter-damping when reversing
  immediateStepRatio: 0.28        // Tactile immediate feedback fraction
};

// Global debug state listener and velocity telemetry
let debugSubscriber = null;
let activeScrollVelocity = 0;

export function getCurrentVelocity() {
  return activeScrollVelocity;
}

export function subscribeMomentumDebug(callback) {
  debugSubscriber = callback;
  return () => {
    if (debugSubscriber === callback) {
      debugSubscriber = null;
    }
  };
}

export function initMomentumScroll() {
  if (typeof window === 'undefined') return () => {};

  // 1. Accessibility: Respect prefers-reduced-motion
  const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (motionQuery.matches) {
    return () => {};
  }

  // 2. Touch Devices: Preserve native mobile kinetic touch momentum
  const isTouchPrimary = 'ontouchstart' in window && window.matchMedia('(pointer: coarse)').matches;
  if (isTouchPrimary) {
    return () => {};
  }

  // Engine State
  let currentPosition = window.scrollY || window.pageYOffset || 0;
  let velocity = 0;
  activeScrollVelocity = 0;
  let lastProgrammaticY = Math.round(currentPosition);
  let isTickerRunning = false;

  const getMaxScroll = () => {
    return Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
  };

  const publishDebug = () => {
    activeScrollVelocity = velocity;
    if (!debugSubscriber) return;
    const velPxSec = Math.round(velocity * 60);
    const sign = velPxSec > 0 ? '+' : '';
    debugSubscriber({
      velocity: Math.round(velocity * 10) / 10,
      velocityPxSec: `${sign}${velPxSec} px/s`,
      momentum: Math.abs(velocity) > MOMENTUM_CONFIG.stopThreshold ? 'ACTIVE' : 'REST',
      position: Math.round(currentPosition)
    });
  };

  // Central Physics Ticker Step (synchronized with GSAP's central render loop)
  const tickerLoop = (_time, deltaTime) => {
    // Frame-rate independence: calculate ratio relative to 16.667ms (60 FPS)
    const dt = Math.min(Math.max(deltaTime, 4), 100);
    const dtRatio = dt / 16.667;
    const frameFriction = Math.pow(MOMENTUM_CONFIG.friction, dtRatio);

    if (Math.abs(velocity) > MOMENTUM_CONFIG.stopThreshold) {
      const maxScroll = getMaxScroll();
      currentPosition += velocity * dtRatio;

      // Handle top / bottom boundaries
      if (currentPosition <= 0) {
        currentPosition = 0;
        velocity = 0;
      } else if (currentPosition >= maxScroll) {
        currentPosition = maxScroll;
        velocity = 0;
      }

      lastProgrammaticY = Math.round(currentPosition);
      window.scrollTo(0, lastProgrammaticY);
      ScrollTrigger.update();

      // Exponential velocity decay
      velocity *= frameFriction;
    } else {
      // Natural, imperceptible settle to rest
      velocity = 0;
      const maxScroll = getMaxScroll();
      currentPosition = Math.max(0, Math.min(maxScroll, currentPosition));
      lastProgrammaticY = Math.round(currentPosition);
      window.scrollTo(0, lastProgrammaticY);
      ScrollTrigger.update();

      // Pause ticker loop to conserve CPU cycles when stationary
      isTickerRunning = false;
      gsap.ticker.remove(tickerLoop);
    }

    publishDebug();
  };

  // Wheel input processor: computes physical impulse, accumulates velocity, and handles reversals
  const handleWheel = (e) => {
    // Allow zoom gestures (Ctrl/Cmd + wheel)
    if (e.ctrlKey || e.metaKey) return;

    // Ignore horizontal trackpad swipes
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY) && Math.abs(e.deltaY) < 4) return;

    // Intercept desktop wheel to drive through physical momentum engine
    e.preventDefault();

    let rawDelta = e.deltaY;
    if (e.deltaMode === 1) {
      rawDelta *= 33.33; // Line mode (standard on Firefox & some mouse drivers)
    } else if (e.deltaMode === 2) {
      rawDelta *= window.innerHeight; // Page mode
    }

    // Distinguish trackpad swipe (small fractional deltas) vs discrete mouse wheel notch
    const isTrackpad = Math.abs(rawDelta) < 45 && !Number.isInteger(rawDelta);
    const accel = isTrackpad
      ? MOMENTUM_CONFIG.trackpadAcceleration
      : MOMENTUM_CONFIG.acceleration;

    const impulse = rawDelta * MOMENTUM_CONFIG.wheelSensitivity * accel;
    const maxScroll = getMaxScroll();

    // Prevent accumulating velocity into boundaries when already at extremes
    if ((currentPosition <= 0 && impulse < 0) || (currentPosition >= maxScroll && impulse > 0)) {
      velocity = 0;
      publishDebug();
      return;
    }

    // Direction reversal physics:
    // If input opposes current momentum, heavily damp existing velocity before applying impulse
    if ((velocity > 0 && impulse < 0) || (velocity < 0 && impulse > 0)) {
      velocity = velocity * (1 - MOMENTUM_CONFIG.directionResistance) + impulse;
    } else {
      // Same direction: accumulate velocity naturally
      velocity += impulse;
    }

    // Clamp velocity to bounded envelope
    velocity = Math.max(-MOMENTUM_CONFIG.maxVelocity, Math.min(MOMENTUM_CONFIG.maxVelocity, velocity));

    // Immediate tactile feedback: advance a small fraction instantly on this exact event frame
    // so the user experiences zero input delay or "floaty catch-up"
    const immediateStep = impulse * MOMENTUM_CONFIG.immediateStepRatio;
    currentPosition = Math.max(0, Math.min(maxScroll, currentPosition + immediateStep));
    lastProgrammaticY = Math.round(currentPosition);
    window.scrollTo(0, lastProgrammaticY);
    ScrollTrigger.update();

    // Ensure central ticker is active
    if (!isTickerRunning) {
      isTickerRunning = true;
      gsap.ticker.add(tickerLoop);
    }

    publishDebug();
  };

  // Passive native scroll synchronization:
  // Handles scrollbar dragging, anchor link jumps (#about), and keyboard navigation (PageUp/PageDown)
  const onNativeScroll = () => {
    const actualY = Math.round(window.scrollY || window.pageYOffset || 0);

    // CRITICAL: If the browser's scroll event was triggered by our own window.scrollTo, IGNORE IT!
    // This allows velocity to continue decaying smoothly across subsequent frames without being reset.
    if (Math.abs(actualY - lastProgrammaticY) <= 2) {
      return;
    }

    // If actualY differs, the user dragged the scrollbar or used keyboard navigation. Reconcile state:
    currentPosition = actualY;
    lastProgrammaticY = actualY;
    velocity = 0;

    if (isTickerRunning) {
      isTickerRunning = false;
      gsap.ticker.remove(tickerLoop);
    }

    publishDebug();
  };

  const onResize = () => {
    currentPosition = window.scrollY || window.pageYOffset || 0;
    lastProgrammaticY = Math.round(currentPosition);
    velocity = 0;
    ScrollTrigger.refresh();
    publishDebug();
  };

  // Register listeners
  window.addEventListener('wheel', handleWheel, { passive: false });
  window.addEventListener('scroll', onNativeScroll, { passive: true });
  window.addEventListener('resize', onResize, { passive: true });

  // Initial debug publication
  publishDebug();

  // Teardown
  return () => {
    window.removeEventListener('wheel', handleWheel);
    window.removeEventListener('scroll', onNativeScroll);
    window.removeEventListener('resize', onResize);
    gsap.ticker.remove(tickerLoop);
  };
}
