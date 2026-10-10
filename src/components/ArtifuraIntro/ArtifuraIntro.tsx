import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  ARTIFURA_CHARACTERS,
  ARTIFURA_CONFIGS,
  calculateJumpTrajectory,
  calculateLandingSettle,
  calculateMasterSettle,
} from './physics';
import { DecoyLetterState, ArtifuraLetterRuntimeState } from './types';
import { ArtifuraSymbol, ArtifuraLambdaGlyph } from './ArtifuraSymbol';

// In-memory module flag to ensure intro animation ONLY plays once per reload
let hasIntroPlayedInSession = false;
let hasSimulationEverStarted = false;

export function hasIntroPlayed(): boolean {
  return hasIntroPlayedInSession;
}

export function markIntroAsPlayed(): void {
  hasIntroPlayedInSession = true;
}

export function resetIntroSession(): void {
  hasIntroPlayedInSession = false;
  hasSimulationEverStarted = false;
}

interface ArtifuraIntroProps {
  onIntroComplete?: () => void;
  className?: string;
}

// Mixture of letters matching the exact typography and gold color
const DECOY_CHAR_POOL = [
  'A', 'R', 'T', 'K', 'M', 'N', 'X', 'P', 'V', 'S',
  'E', 'B', 'W', 'O', 'D', 'G', 'L', 'Z', 'H', 'Y'
];

export const ArtifuraIntro: React.FC<ArtifuraIntroProps> = ({
  onIntroComplete,
  className = '',
}) => {
  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Initial state: if already played in session or prefers-reduced-motion, start permanently settled
  const [isSettled, setIsSettled] = useState<boolean>(() => {
    return hasIntroPlayedInSession || prefersReducedMotion;
  });

  // Track which ARTIFURA letters have landed in order to reveal them progressively
  const [landedIndices, setLandedIndices] = useState<Set<number>>(() => {
    if (hasIntroPlayedInSession || prefersReducedMotion) {
      return new Set([0, 1, 2, 3, 4, 5, 6, 7]);
    }
    return new Set();
  });

  // State to trigger the subtle tagline reveal after settle
  const [showTagline, setShowTagline] = useState<boolean>(() => {
    return hasIntroPlayedInSession || prefersReducedMotion;
  });

  const containerRef = useRef<HTMLDivElement | null>(null);
  const wordmarkRef = useRef<HTMLHeadingElement | null>(null);
  const slotRefs = useRef<(HTMLSpanElement | null)[]>([]);

  // Refs for flying elements
  const flyingArtifuraElementsRef = useRef<(HTMLSpanElement | null)[]>([]);
  const decoyElementsRef = useRef<(HTMLSpanElement | null)[]>([]);

  // Keep callback reference stable to avoid effect re-triggers
  const onIntroCompleteRef = useRef(onIntroComplete);
  useEffect(() => {
    onIntroCompleteRef.current = onIntroComplete;
  }, [onIntroComplete]);

  // ABSOLUTE EXECUTION GUARDS: prevents any double-run on reload
  const hasStartedRef = useRef<boolean>(false);
  const isRunningRef = useRef<boolean>(false);
  const hasTaglineShownRef = useRef<boolean>(false);

  const startTimeRef = useRef<number>(0);
  const rafIdRef = useRef<number>(0);
  const decoyLettersRef = useRef<DecoyLetterState[]>([]);
  const artifuraRuntimeRef = useRef<ArtifuraLetterRuntimeState[]>([]);
  const landedIndicesRef = useRef<Set<number>>(new Set());
  const masterSettleStartRef = useRef<number>(0);
  const targetPositionsRef = useRef<{ x: number; y: number }[]>([]);
  const groundYRef = useRef<number>(0);

  // Complete the animation cleanly
  const completeAnimation = useCallback(() => {
    if (isRunningRef.current) {
      cancelAnimationFrame(rafIdRef.current);
      isRunningRef.current = false;
    }

    markIntroAsPlayed();
    setLandedIndices(new Set([0, 1, 2, 3, 4, 5, 6, 7]));
    setIsSettled(true);
    setShowTagline(true);

    flyingArtifuraElementsRef.current.forEach((el) => {
      if (el) el.style.display = 'none';
    });
    decoyElementsRef.current.forEach((el) => {
      if (el) el.style.display = 'none';
    });

    if (wordmarkRef.current) {
      wordmarkRef.current.style.transform = 'scale(1, 1)';
    }

    onIntroCompleteRef.current?.();
  }, []);

  // Measure letter target positions precisely from actual DOM layout
  const measureTargets = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const containerRect = container.getBoundingClientRect();
    const positions: { x: number; y: number }[] = [];

    slotRefs.current.forEach((slot) => {
      if (slot) {
        const slotRect = slot.getBoundingClientRect();
        const x = slotRect.left - containerRect.left + slotRect.width / 2;
        const y = slotRect.top - containerRect.top + slotRect.height / 2;
        positions.push({ x, y });
      }
    });

    if (positions.length === 8) {
      targetPositionsRef.current = positions;
    }

    const H = containerRect.height;
    groundYRef.current = Math.min(H * 0.77, H - 95);
  }, []);

  // Initialize and run the physics simulation (GUARANTEED SINGLE RUN)
  const startSimulation = useCallback(() => {
    // Hard guard: only ever execute once per page load
    if (hasStartedRef.current || hasSimulationEverStarted || hasIntroPlayedInSession || isRunningRef.current) {
      return;
    }

    hasStartedRef.current = true;
    hasSimulationEverStarted = true;

    measureTargets();

    const container = containerRef.current;
    if (!container || targetPositionsRef.current.length < 8) {
      // Retry in next frame if DOM layout is still resolving
      hasStartedRef.current = false;
      hasSimulationEverStarted = false;
      requestAnimationFrame(startSimulation);
      return;
    }

    const containerRect = container.getBoundingClientRect();
    const W = containerRect.width;
    const isMobile = W < 768;
    const isTablet = W >= 768 && W < 1024;
    const groundY = groundYRef.current;

    // 1. Initialize Decoy Letters (streamlined count on mobile for zero lag)
    const decoyCount = isMobile ? 5 : isTablet ? 10 : 18;
    const decoys: DecoyLetterState[] = [];

    for (let i = 0; i < decoyCount; i++) {
      const char = DECOY_CHAR_POOL[i % DECOY_CHAR_POOL.length];
      const x = 40 + Math.random() * (W - 80);
      const y = -30 - Math.random() * 40;
      const fallDelay = 0.12 + (i / decoyCount) * 1.95 + (Math.random() - 0.5) * 0.25;
      const scale = (isMobile ? 0.85 : 0.92) + (Math.random() - 0.5) * 0.12;
      const gravity = 1600 + Math.random() * 300;
      const vx = (Math.random() - 0.5) * 55;
      const rot = (Math.random() - 0.5) * 35;
      const vrot = (Math.random() - 0.5) * 70;
      const bounceY = groundY + (Math.random() - 0.5) * 20;

      decoys.push({
        id: i,
        char,
        x,
        y,
        vx,
        vy: 0,
        rot,
        vrot,
        scale,
        opacity: 1,
        fallDelay: Math.max(0.08, fallDelay),
        gravity,
        bounceY,
        hasBounced: false,
        squashEndTime: 0,
        element: decoyElementsRef.current[i] || null,
      });
    }

    decoyLettersRef.current = decoys;

    // 2. Initialize 8 ARTIFURA Letters
    const artifuraList: ArtifuraLetterRuntimeState[] = [];
    const targets = targetPositionsRef.current;

    ARTIFURA_CONFIGS.forEach((config, idx) => {
      const target = targets[idx];
      const maxOffset = isMobile ? 42 : isTablet ? 80 : 135;
      const xOffset = config.xOffsetRatio * maxOffset;
      const xImpact = Math.max(36, Math.min(W - 36, target.x + xOffset));

      artifuraList.push({
        index: idx,
        char: config.char,
        config,
        status: 'pending',
        x: xImpact + (Math.random() - 0.5) * 8,
        y: -70,
        rot: (Math.random() - 0.5) * 24,
        scaleX: 1,
        scaleY: 1,
        opacity: 0,
        glow: 0,
        xImpact,
        yGround: groundY,
        targetX: target.x,
        targetY: target.y,
        tFallStart: config.fallDelay,
        tImpact: config.fallDelay + config.launchDelay,
        tLaunch: config.fallDelay + config.launchDelay + 0.06,
        tLand: config.fallDelay + config.launchDelay + 0.06 + config.jumpDuration,
        element: flyingArtifuraElementsRef.current[idx] || null,
      });
    });

    artifuraRuntimeRef.current = artifuraList;
    landedIndicesRef.current = new Set();
    startTimeRef.current = performance.now();
    isRunningRef.current = true;

    // 3. Main Animation Loop (High Performance 60/120 FPS requestAnimationFrame)
    let lastTime = performance.now();

    const loop = (currentTime: number) => {
      if (!isRunningRef.current) return;

      const elapsedSec = (currentTime - startTimeRef.current) / 1000;
      const dt = Math.min((currentTime - lastTime) / 1000, 0.05);
      lastTime = currentTime;

      const H = containerRect.height;

      // ------------------------------------------------------------------
      // A. UPDATE DECOY LETTERS
      // (Fall -> bounce once -> plunge directly below bottom line out of view)
      // ------------------------------------------------------------------
      const decoysList = decoyLettersRef.current;

      for (let i = 0; i < decoysList.length; i++) {
        const item = decoysList[i];
        const el = item.element;
        if (!el) continue;

        if (elapsedSec < item.fallDelay) {
          el.style.opacity = '0';
          continue;
        }

        item.vy += item.gravity * dt;
        item.y += item.vy * dt;
        item.x += item.vx * dt;
        item.rot += item.vrot * dt;

        // First impact: bounce!
        if (!item.hasBounced && item.y >= item.bounceY) {
          item.y = item.bounceY;
          item.hasBounced = true;
          item.vy = -Math.abs(item.vy) * 0.38;
          item.vx *= 1.25;
          item.vrot = -item.vrot * 0.7;
          item.squashEndTime = currentTime + 45;
        }

        let scaleX = item.scale;
        let scaleY = item.scale;
        if (currentTime < item.squashEndTime) {
          scaleX = item.scale * 1.20;
          scaleY = item.scale * 0.80;
        }

        // Plunge directly below the bottom line without stopping
        if (item.y > H + 120) {
          el.style.display = 'none';
          continue;
        }

        el.style.display = 'block';
        el.style.opacity = '1';
        el.style.transform = `translate3d(${item.x.toFixed(1)}px, ${item.y.toFixed(1)}px, 0) translate(-50%, -50%) rotate(${item.rot.toFixed(1)}deg) scale(${scaleX.toFixed(2)}, ${scaleY.toFixed(2)})`;
      }

      // ------------------------------------------------------------------
      // B. UPDATE ARTIFURA LETTERS (Special Heroic Character Jumps)
      // ------------------------------------------------------------------
      const artifuras = artifuraRuntimeRef.current;

      for (let i = 0; i < artifuras.length; i++) {
        const item = artifuras[i];
        const el = item.element;
        if (!el) continue;

        if (elapsedSec < item.tFallStart) {
          item.status = 'pending';
          el.style.opacity = '0';
          continue;
        }

        if (elapsedSec < item.tImpact) {
          // Falling under gravity to ground impact point
          item.status = 'falling';
          const fallProgress = (elapsedSec - item.tFallStart) / item.config.launchDelay;
          const easedFall = Math.pow(fallProgress, 1.6);
          item.y = -60 + (item.yGround - (-60)) * easedFall;
          item.x = item.xImpact;
          item.rot = Math.sin(fallProgress * Math.PI) * 12 * (item.config.xOffsetRatio > 0 ? 1 : -1);
          item.scaleX = 1;
          item.scaleY = 1;
          item.opacity = Math.min(1, fallProgress * 2.5);

          el.style.opacity = item.opacity.toFixed(3);
          el.style.transform = `translate3d(${item.x.toFixed(1)}px, ${item.y.toFixed(1)}px, 0) translate(-50%, -50%) rotate(${item.rot.toFixed(1)}deg) scale(1, 1)`;
          continue;
        }

        if (elapsedSec < item.tLaunch) {
          // Ground impact: anticipation squash (60ms)
          item.status = 'impact';
          const impactProgress = (elapsedSec - item.tImpact) / 0.06;
          item.x = item.xImpact;
          item.y = item.yGround;
          const squash = Math.sin(impactProgress * Math.PI);
          item.scaleX = 1.0 + squash * 0.28;
          item.scaleY = 1.0 - squash * 0.24;
          item.rot = item.config.xOffsetRatio < 0 ? 8 : -8;
          item.opacity = 1;

          el.style.opacity = '1';
          el.style.transform = `translate3d(${item.x.toFixed(1)}px, ${item.y.toFixed(1)}px, 0) translate(-50%, -50%) rotate(${item.rot.toFixed(1)}deg) scale(${item.scaleX.toFixed(3)}, ${item.scaleY.toFixed(3)})`;
          continue;
        }

        if (elapsedSec < item.tLand) {
          // JUMPING: Parabolic arc carry to target position
          item.status = 'jumping';
          const jumpProgress = (elapsedSec - item.tLaunch) / item.config.jumpDuration;

          const trajectory = calculateJumpTrajectory(
            jumpProgress,
            item.xImpact,
            item.yGround,
            item.targetX,
            item.targetY,
            item.config.arcHeightRatio,
            item.config.extraRotation,
            item.config.xOffsetRatio < 0 ? 10 : -10
          );

          item.x = trajectory.x;
          item.y = trajectory.y;
          item.rot = trajectory.rot;
          item.scaleX = trajectory.scaleX;
          item.scaleY = trajectory.scaleY;
          item.opacity = 1;

          el.style.opacity = '1';
          el.style.transform = `translate3d(${item.x.toFixed(1)}px, ${item.y.toFixed(1)}px, 0) translate(-50%, -50%) rotate(${item.rot.toFixed(1)}deg) scale(${item.scaleX.toFixed(3)}, ${item.scaleY.toFixed(3)})`;
          continue;
        }

        // Post-landing stick settle (140ms elastic cushion)
        const timeSinceLand = elapsedSec - item.tLand;

        if (timeSinceLand < 0.14) {
          const settle = calculateLandingSettle(timeSinceLand / 0.14);
          el.style.opacity = '1';
          el.style.transform = `translate3d(${item.targetX.toFixed(1)}px, ${item.targetY.toFixed(1)}px, 0) translate(-50%, -50%) rotate(0deg) scale(${settle.scaleX.toFixed(3)}, ${settle.scaleY.toFixed(3)})`;
        } else {
          // Firmly settled: reveal permanent slot immediately in DOM first
          const slotEl = slotRefs.current[i];
          if (slotEl) {
            slotEl.style.visibility = 'visible';
            slotEl.style.opacity = '1';
          }
          el.style.display = 'none';

          if (!landedIndicesRef.current.has(i)) {
            landedIndicesRef.current.add(i);
            setLandedIndices(new Set(landedIndicesRef.current));

            if (i === 7) {
              masterSettleStartRef.current = currentTime;
            }
          }
        }
      }

      // ------------------------------------------------------------------
      // C. WHOLE-WORD MASTER SETTLE (when final 'A' sticks)
      // ------------------------------------------------------------------
      if (masterSettleStartRef.current > 0) {
        const settleElapsed = (currentTime - masterSettleStartRef.current) / 1000;
        if (settleElapsed < 0.28 && wordmarkRef.current) {
          const master = calculateMasterSettle(settleElapsed / 0.28);
          wordmarkRef.current.style.transform = `scale(${master.scaleX.toFixed(3)}, ${master.scaleY.toFixed(3)})`;
        } else if (wordmarkRef.current) {
          wordmarkRef.current.style.transform = 'scale(1, 1)';
        }
      }

      // ------------------------------------------------------------------
      // D. TIMELINE COMPLETION & TRANSITION
      // ------------------------------------------------------------------
      if (elapsedSec > 3.4 && !hasTaglineShownRef.current) {
        hasTaglineShownRef.current = true;
        setShowTagline(true);
      }

      if (elapsedSec > 3.9) {
        completeAnimation();
        return;
      }

      rafIdRef.current = requestAnimationFrame(loop);
    };

    rafIdRef.current = requestAnimationFrame(loop);
  }, [completeAnimation, measureTargets]);

  // Keyboard shortcut listener: Esc / Space / Enter to skip
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === ' ' || e.key === 'Enter') {
        if (!isSettled) {
          completeAnimation();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSettled, completeAnimation]);

  // Window resize handler: update target layout
  useEffect(() => {
    const handleResize = () => {
      measureTargets();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [measureTargets]);

  // Start animation ONCE on initial mount if not already settled
  useEffect(() => {
    if (hasIntroPlayedInSession || prefersReducedMotion || hasStartedRef.current) {
      return;
    }

    const timer = setTimeout(() => {
      if (document.fonts) {
        document.fonts.ready.then(() => {
          startSimulation();
        });
      } else {
        startSimulation();
      }
    }, 60);

    return () => {
      clearTimeout(timer);
    };
  }, []); // ZERO DEPENDENCIES: ABSOLUTELY CANNOT RUN TWICE

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full flex flex-col items-center justify-center select-none overflow-hidden ${className}`}
      onClick={() => {
        if (!isSettled) completeAnimation();
      }}
    >
      {/* ------------------------------------------------------------------
          1. MATCHING DECOY LETTERS LAYER
          (Same gold typography & color as ARTIFURA; bounce & plunge below bottom)
          ------------------------------------------------------------------ */}
      {!isSettled && (
        <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
          {Array.from({ length: 20 }).map((_, i) => (
            <span
              key={`decoy-${i}`}
              ref={(el) => {
                decoyElementsRef.current[i] = el;
              }}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                willChange: 'transform, opacity',
                opacity: 0,
                transformOrigin: '50% 50%',
              }}
              className="font-display font-semibold uppercase text-3xl xs:text-4xl sm:text-6xl md:text-7xl lg:text-[84px] xl:text-[96px] leading-none text-transparent bg-clip-text bg-gradient-to-r from-[#ffe08d] via-[#ffe08d] to-[#e5c365] drop-shadow-[0_0_24px_rgba(255,224,141,0.5)] select-none text-center inline-block"
            >
              {DECOY_CHAR_POOL[i % DECOY_CHAR_POOL.length]}
            </span>
          ))}
        </div>
      )}

      {/* ------------------------------------------------------------------
          2. FLYING ARTIFURA LETTERS LAYER (Parabolic Leap Trajectories)
          ------------------------------------------------------------------ */}
      {!isSettled && (
        <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden">
          {ARTIFURA_CHARACTERS.map((char, i) => (
            <span
              key={`flying-${i}`}
              ref={(el) => {
                flyingArtifuraElementsRef.current[i] = el;
              }}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                willChange: 'transform, opacity',
                opacity: 0,
                transformOrigin: '50% 50%',
              }}
              className="font-display font-semibold uppercase text-3xl xs:text-4xl sm:text-6xl md:text-7xl lg:text-[84px] xl:text-[96px] leading-none select-none text-center inline-flex items-center justify-center"
            >
              {i === 0 ? (
                <ArtifuraSymbol className="h-[1.28em] w-auto drop-shadow-[0_0_28px_rgba(255,212,87,0.65)]" />
              ) : i === 7 ? (
                <ArtifuraLambdaGlyph className="h-[0.88em] w-auto text-[#f0efea] drop-shadow-[0_0_20px_rgba(255,255,255,0.4)]" />
              ) : (
                <span className="text-[#f0efea] drop-shadow-[0_0_20px_rgba(255,255,255,0.4)]">
                  {char}
                </span>
              )}
            </span>
          ))}
        </div>
      )}

      {/* ------------------------------------------------------------------
          3. CENTERPIECE: MONUMENTAL WORDMARK & TARGET SLOTS
          ------------------------------------------------------------------ */}
      <div className="relative z-30 flex flex-col items-center justify-center my-auto px-4 cursor-default">
        {/* Glow backdrop behind final word */}
        <div
          className={`absolute inset-0 bg-[#ffe08d]/10 blur-3xl rounded-full scale-125 pointer-events-none transition-opacity duration-700 ${
            landedIndices.size === 8 ? 'opacity-100' : 'opacity-0'
          }`}
        />

        {/* The 8 Wordmark Target Slots */}
        <h1
          ref={wordmarkRef}
          className="relative inline-flex items-end justify-center font-display font-semibold uppercase text-3xl xs:text-4xl sm:text-6xl md:text-7xl lg:text-[84px] xl:text-[96px] tracking-[0.04em] xs:tracking-[0.06em] sm:tracking-[0.08em] leading-none select-none text-center"
          style={{ willChange: 'transform' }}
        >
          {ARTIFURA_CHARACTERS.map((char, index) => {
            const isLanded = landedIndices.has(index);

            return (
              <span
                key={`slot-${index}`}
                ref={(el) => {
                  slotRefs.current[index] = el;
                }}
                className={`inline-flex items-end relative ${
                  isLanded ? 'opacity-100' : 'opacity-0'
                } ${index === 0 ? 'mr-[0.22em] sm:mr-[0.28em] md:mr-[0.32em]' : ''}`}
                style={{
                  visibility: isSettled || isLanded ? 'visible' : 'hidden',
                }}
              >
                {index === 0 ? (
                  <span className="inline-block relative">
                    <ArtifuraSymbol className="h-[1.28em] w-auto align-baseline drop-shadow-[0_0_28px_rgba(255,212,87,0.55)]" />
                  </span>
                ) : index === 7 ? (
                  <span className="inline-block relative text-[#f0efea] drop-shadow-[0_0_18px_rgba(255,255,255,0.25)]">
                    <ArtifuraLambdaGlyph className="h-[0.88em] w-auto inline-block align-baseline" />
                  </span>
                ) : (
                  <span className="relative text-[#f0efea] drop-shadow-[0_0_18px_rgba(255,255,255,0.25)]">
                    {char}
                  </span>
                )}
              </span>
            );
          })}
        </h1>

        {/* ------------------------------------------------------------------
            4. TAGLINE REVEAL (W E   B U I L D   W H A T   C O M E S   N E X T .)
            ------------------------------------------------------------------ */}
        <div
          className={`flex flex-col items-center transition-all duration-700 ease-out mt-5 sm:mt-7 md:mt-9 ${
            showTagline
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-4 pointer-events-none'
          }`}
        >
          <p className="text-[10px] xs:text-xs sm:text-sm md:text-base font-display uppercase tracking-[0.32em] xs:tracking-[0.38em] sm:tracking-[0.45em] text-[#d4d4d8] text-center font-medium pl-[0.32em] xs:pl-[0.38em] sm:pl-[0.45em]">
            W E &nbsp; B U I L D &nbsp; W H A T &nbsp; C O M E S &nbsp; N E X T .
          </p>
        </div>
      </div>

      {/* ------------------------------------------------------------------
          5. MINIMAL SKIP HINT (During active animation)
          ------------------------------------------------------------------ */}
      {!isSettled && (
        <div className="absolute bottom-6 right-6 z-40 text-[10px] font-mono tracking-widest text-[#99907e]/60 uppercase transition-opacity duration-300">
          <button
            onClick={completeAnimation}
            className="hover:text-[#ffe08d] transition-colors cursor-pointer px-2 py-1 rounded border border-[#4d4637]/30 bg-[#121213]/60 backdrop-blur-sm"
          >
            Skip Intro [Esc]
          </button>
        </div>
      )}
    </div>
  );
};
