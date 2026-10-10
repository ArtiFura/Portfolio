import { ArtifuraLetterConfig } from './types';

export const ARTIFURA_CHARACTERS = ['A', 'R', 'T', 'I', 'F', 'U', 'R', 'A'] as const;

/**
 * Letter-by-letter physical personality configurations matching the Pixar lamp-inspired character dynamics.
 */
export const ARTIFURA_CONFIGS: ArtifuraLetterConfig[] = [
  {
    char: 'A',
    fallDelay: 0.30,
    launchDelay: 0.45,
    jumpDuration: 0.65,
    arcHeightRatio: 1.85,
    xOffsetRatio: -0.32,  // launches from left of target
    extraRotation: 12,
    name: 'A (First)',
    personality: 'normal bounce, medium arc',
  },
  {
    char: 'R',
    fallDelay: 0.52,
    launchDelay: 0.44,
    jumpDuration: 0.72,
    arcHeightRatio: 2.35,  // slightly higher bounce
    xOffsetRatio: 0.36,   // launches from right of target
    extraRotation: -14,
    name: 'R (First)',
    personality: 'slightly higher bounce',
  },
  {
    char: 'T',
    fallDelay: 0.75,
    launchDelay: 0.40,
    jumpDuration: 0.52,   // quick, compact jump
    arcHeightRatio: 1.55,
    xOffsetRatio: -0.26,
    extraRotation: 8,
    name: 'T',
    personality: 'quick, compact jump',
  },
  {
    char: 'I',
    fallDelay: 0.98,
    launchDelay: 0.42,
    jumpDuration: 0.62,
    arcHeightRatio: 1.80,
    xOffsetRatio: 0.28,
    extraRotation: 28,    // slightly more rotation
    name: 'I',
    personality: 'slightly more rotation',
  },
  {
    char: 'F',
    fallDelay: 1.22,
    launchDelay: 0.45,
    jumpDuration: 0.70,   // slightly larger arc
    arcHeightRatio: 2.15,
    xOffsetRatio: -0.38,
    extraRotation: -16,
    name: 'F',
    personality: 'slightly larger arc',
  },
  {
    char: 'U',
    fallDelay: 1.48,
    launchDelay: 0.40,
    jumpDuration: 0.54,   // lower arc
    arcHeightRatio: 1.42,
    xOffsetRatio: 0.26,
    extraRotation: 10,
    name: 'U',
    personality: 'lower arc',
  },
  {
    char: 'R',
    fallDelay: 1.72,
    launchDelay: 0.38,
    jumpDuration: 0.50,   // faster jump
    arcHeightRatio: 1.60,
    xOffsetRatio: -0.30,
    extraRotation: -12,
    name: 'R (Second)',
    personality: 'faster jump',
  },
  {
    char: 'A',
    fallDelay: 1.96,
    launchDelay: 0.46,
    jumpDuration: 0.76,   // final slightly larger/satisfying bounce
    arcHeightRatio: 2.45,
    xOffsetRatio: 0.34,
    extraRotation: 15,
    name: 'A (Final)',
    personality: 'final slightly larger / satisfying bounce',
  },
];

/**
 * Pure parabolic projectile trajectory calculator.
 *
 * Trajectory guarantees:
 * - y(0) = yGround (starts at ground)
 * - y(1) = targetY (lands at target position)
 * - Arcs higher than targetY (apex y < targetY)
 * - Follows natural Newtonian kinematics: y(u) = yGround - H_rise * u - K * u * (1 - u)
 */
export function calculateJumpTrajectory(
  u: number, // normalized jump progress 0..1
  xImpact: number,
  yGround: number,
  targetX: number,
  targetY: number,
  arcHeightRatio: number,
  extraRotation: number,
  initialRotation: number
): { x: number; y: number; rot: number; scaleX: number; scaleY: number } {
  // Clamp progress
  const progress = Math.max(0, Math.min(1, u));

  // Horizontal motion: smooth forward ballistic travel
  const h = progress; 
  const x = xImpact + (targetX - xImpact) * h;

  // Vertical motion:
  const H_rise = yGround - targetY; // positive distance from ground up to target
  const K = arcHeightRatio * H_rise; // parabolic curve amplitude

  // Parabolic equation: at u=0 => yGround, at u=1 => targetY
  const y = yGround - H_rise * progress - K * progress * (1 - progress);

  // Rotation: tilts into the jump, rotates during flight, and eases upright (0 deg) on landing
  const rotFlight =
    initialRotation * Math.pow(1 - progress, 1.2) +
    extraRotation * Math.sin(Math.PI * progress) * (1 - 0.35 * progress);
  const rot = rotFlight * (1 - Math.pow(progress, 3)); // crisp damp to 0 as it lands

  // Squash & Stretch:
  // - Takeoff (0 <= progress <= 0.18): stretch vertically
  // - Mid-flight (0.18 < progress <= 0.85): normal 1.0
  // - Landing approach (0.85 < progress <= 1.0): return to neutral
  let scaleX = 1.0;
  let scaleY = 1.0;

  if (progress < 0.18) {
    const p = progress / 0.18;
    const stretch = Math.sin(p * Math.PI) * 0.18;
    scaleY = 1.0 + stretch;
    scaleX = 1.0 - stretch * 0.6;
  }

  return { x, y, rot, scaleX, scaleY };
}

/**
 * Calculates landing stick settle (tiny elastic rebound as letter lands on its pedestal).
 * Duration ~ 140ms
 */
export function calculateLandingSettle(tau: number): { scaleX: number; scaleY: number } {
  if (tau >= 1) return { scaleX: 1, scaleY: 1 };
  const decay = 1 - tau;
  const bounce = Math.sin(tau * Math.PI * 2) * decay;
  return {
    scaleX: 1.0 + bounce * 0.08,
    scaleY: 1.0 - bounce * 0.10,
  };
}

/**
 * Calculates whole-word monumental settle when the final 'A' sticks the landing.
 * Duration ~ 280ms
 */
export function calculateMasterSettle(tau: number): { scaleX: number; scaleY: number } {
  if (tau >= 1) return { scaleX: 1, scaleY: 1 };
  const decay = Math.pow(1 - tau, 1.5);
  // Slight downward compression -> gentle rebound -> stable
  const impulse = Math.sin(tau * Math.PI * 2.2) * decay;
  return {
    scaleX: 1.0 + impulse * 0.025,
    scaleY: 1.0 - impulse * 0.035,
  };
}
