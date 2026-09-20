import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { createOrbScene } from './environments/createOrbScene';
import { createRibbonScene } from './environments/createRibbonScene';
import { createWireframeSphereScene } from './environments/createWireframeSphereScene';
import { createTorusScene } from './environments/createTorusScene';
import { createParticleScene } from './environments/createParticleScene';
import { createGlassPlaneScene } from './environments/createGlassPlaneScene';
import { createGridScene } from './environments/createGridScene';
import { createAbstractFormScene } from './environments/createAbstractFormScene';

const ENV_FACTORIES = [
  createOrbScene,             // 0: Page 01 (HOME)
  createRibbonScene,          // 1: Page 02 (PHILOSOPHY)
  createWireframeSphereScene, // 2: Page 03 (SERVICES)
  createTorusScene,           // 3: Page 04 (STACK)
  createParticleScene,        // 4: Page 05 (WORK)
  createGlassPlaneScene,      // 5: Page 06 (APPROACH)
  createGridScene,            // 6: Page 07 (COMPANY)
  createAbstractFormScene,    // 7: Page 08 (CONTACT)
];

/**
 * HolographicEnvironment
 * Single shared WebGL canvas managing procedural 3D holographic scenes across the 8 Pages.
 * Transitions smoothly between environments with spatial fading and velocity-driven distortion.
 */
export default function HolographicEnvironment({
  activePageIndex = 0,
  velocity = 0,
  mousePos = { normX: 0, normY: 0 },
  theme = 'light',
}) {
  const canvasRef = useRef(null);
  const stateRef = useRef({
    activePageIndex,
    velocity,
    mousePos,
    theme,
  });

  stateRef.current = {
    activePageIndex,
    velocity,
    mousePos,
    theme,
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const isDarkInitial = theme === 'dark' || document.documentElement.getAttribute('data-theme') === 'dark';
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // 1. Initialize Three.js Scene, Camera, and Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 50);
    camera.position.set(0, 0, 6.5);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));

    // Subtle ambient & rim lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const rimLight = new THREE.DirectionalLight(0xC9A227, 0.8);
    rimLight.position.set(5, 5, 4);
    scene.add(rimLight);

    // 2. Instantiate and Cache Environment Scenes
    const environments = ENV_FACTORIES.map((factory) => {
      const env = factory(isDarkInitial);
      env.group.visible = false;
      scene.add(env.group);
      return env;
    });

    let currentEnvIdx = stateRef.current.activePageIndex;
    let targetEnvIdx = currentEnvIdx;
    let transitionProgress = 1.0; // 1.0 means resting on currentEnvIdx

    if (environments[currentEnvIdx]) {
      environments[currentEnvIdx].group.visible = true;
      environments[currentEnvIdx].setOpacity(1.0);
    }

    // 3. Resize Handling
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
    };

    window.addEventListener('resize', handleResize);

    // 4. Render & Animation Loop
    let animId;
    let lastTime = performance.now();
    let smoothedVelocity = 0;
    let smoothedMouse = { x: 0, y: 0 };
    let lastDark = isDarkInitial;

    const animate = (now) => {
      const delta = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;
      const time = now * 0.001;

      const { activePageIndex: nextTargetIdx, velocity: rawVel, mousePos: targetMouse, theme: currentTheme } = stateRef.current;
      const isDark = currentTheme === 'dark';

      // Detect theme change and update active environments immediately
      if (isDark !== lastDark) {
        lastDark = isDark;
        rimLight.color.set(isDark ? 0xC9A227 : 0x7A5B10);
        rimLight.intensity = isDark ? 0.9 : 0.6;
        ambientLight.intensity = isDark ? 0.4 : 0.65;
        environments.forEach((env) => {
          if (env.updateTheme) env.updateTheme(isDark);
        });
      }

      // Smooth velocity interpolation (decay to calm)
      smoothedVelocity = smoothedVelocity * 0.88 + rawVel * 0.12;
      if (Math.abs(smoothedVelocity) < 0.001) smoothedVelocity = 0;

      // Smooth mouse parallax
      smoothedMouse.x += (targetMouse.normX - smoothedMouse.x) * 0.08;
      smoothedMouse.y += (targetMouse.normY - smoothedMouse.y) * 0.08;

      // Handle Environment Switching & Cross-Fading
      if (nextTargetIdx !== targetEnvIdx) {
        targetEnvIdx = nextTargetIdx;
        transitionProgress = 0.0;
        if (environments[targetEnvIdx]) {
          environments[targetEnvIdx].group.visible = true;
          environments[targetEnvIdx].updateTheme(isDark);
        }
      }

      if (transitionProgress < 1.0) {
        transitionProgress += delta * 1.8; // ~0.55s smooth spatial cross-fade
        if (transitionProgress >= 1.0) {
          transitionProgress = 1.0;
          if (currentEnvIdx !== targetEnvIdx) {
            if (environments[currentEnvIdx]) {
              environments[currentEnvIdx].group.visible = false;
            }
            currentEnvIdx = targetEnvIdx;
          }
        }

        // Apply spatial cross-dissolve & depth scale
        if (environments[currentEnvIdx] && currentEnvIdx !== targetEnvIdx) {
          const outAlpha = Math.max(0, 1.0 - transitionProgress);
          environments[currentEnvIdx].setOpacity(outAlpha);
          environments[currentEnvIdx].group.scale.setScalar(1.0 - (1.0 - outAlpha) * 0.15);
        }

        if (environments[targetEnvIdx]) {
          const inAlpha = Math.min(1.0, transitionProgress);
          environments[targetEnvIdx].setOpacity(inAlpha);
          environments[targetEnvIdx].group.scale.setScalar(0.88 + inAlpha * 0.12);
        }
      }

      // Update visible environments
      if (environments[currentEnvIdx] && environments[currentEnvIdx].group.visible) {
        environments[currentEnvIdx].update(time, delta, smoothedVelocity, smoothedMouse, prefersReducedMotion);
      }
      if (currentEnvIdx !== targetEnvIdx && environments[targetEnvIdx] && environments[targetEnvIdx].group.visible) {
        environments[targetEnvIdx].update(time, delta, smoothedVelocity, smoothedMouse, prefersReducedMotion);
      }

      renderer.render(scene, camera);
      animId = requestAnimationFrame(animate);
    };

    animId = requestAnimationFrame(animate);

    // 5. Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (animId) cancelAnimationFrame(animId);

      environments.forEach((env) => {
        scene.remove(env.group);
        env.dispose();
      });

      scene.remove(ambientLight);
      scene.remove(rimLight);
      renderer.dispose();
    };
  }, []);

  // Update themes on theme prop change
  useEffect(() => {
    // Theme updates are picked up on next frame via stateRef.current.theme
  }, [theme]);

  return (
    <div
      className="holographic-canvas-container"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 2,
        overflow: 'hidden',
        opacity: 0.25,
        transition: 'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
      aria-hidden="true"
    >
      <canvas
        ref={canvasRef}
        style={{
          width: '100%',
          height: '100%',
          display: 'block',
        }}
      />
    </div>
  );
}
