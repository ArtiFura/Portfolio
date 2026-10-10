export interface TargetPosition {
  x: number;
  y: number;
  width: number;
  height: number;
  char: string;
}

export interface ArtifuraLetterConfig {
  char: string;
  fallDelay: number;     // seconds after animation start before falling
  launchDelay: number;   // seconds after fall start before ground impact
  jumpDuration: number;  // duration of jump arc in seconds
  arcHeightRatio: number;// multiplier for apex height above target
  xOffsetRatio: number;  // horizontal offset from target on ground (-1 to 1)
  extraRotation: number; // rotational character during flight (degrees)
  name: string;
  personality: string;
}

export interface DecoyLetterState {
  id: number;
  char: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  rot: number;
  vrot: number;
  scale: number;
  opacity: number;
  fallDelay: number;
  gravity: number;
  bounceY: number;
  hasBounced: boolean;
  squashEndTime: number;
  element: HTMLSpanElement | null;
}

export interface ArtifuraLetterRuntimeState {
  index: number;
  char: string;
  config: ArtifuraLetterConfig;
  status: 'pending' | 'falling' | 'impact' | 'jumping' | 'landed';
  
  // Coordinates
  x: number;
  y: number;
  rot: number;
  scaleX: number;
  scaleY: number;
  opacity: number;
  glow: number;

  // Impact and launch parameters
  xImpact: number;
  yGround: number;
  targetX: number;
  targetY: number;

  // Timestamps
  tFallStart: number;
  tImpact: number;
  tLaunch: number;
  tLand: number;

  element: HTMLSpanElement | null;
}
