import * as THREE from 'three';
import { holographicVertexShader, holographicFragmentShader } from '../shaders/holographicShaders';

/**
 * PAGE 06 — Chromatic Glass Plane
 * Subdivided architectural glass sheet suspended in 3D perspective.
 * Bends smoothly with spatial wave functions, displaying delicate chromatic dispersion.
 */
export function createGlassPlaneScene(isDark = false) {
  const group = new THREE.Group();

  const geometry = new THREE.PlaneGeometry(8.5, 6.0, 48, 48);

  const uniforms = {
    uTime: { value: 0 },
    uVelocity: { value: 0 },
    uNoiseScale: { value: 0.4 },
    uNoiseIntensity: { value: 0.22 },
    uOpacity: { value: 0.45 },
    uFresnelPower: { value: 2.6 },
    uColorBase: { value: isDark ? new THREE.Color(0x181612) : new THREE.Color(0xEAE6DB) },
    uColorHighlight: { value: isDark ? new THREE.Color(0xC9A227) : new THREE.Color(0x7A5B10) },
    uColorCyan: { value: isDark ? new THREE.Color(0x5a8a9a) : new THREE.Color(0x466e82) },
    uChromaticDispersion: { value: 1.5 },
    uDarkTheme: { value: isDark ? 1.0 : 0.0 },
  };

  const material = new THREE.ShaderMaterial({
    vertexShader: holographicVertexShader,
    fragmentShader: holographicFragmentShader,
    uniforms,
    transparent: true,
    depthWrite: false,
    side: THREE.DoubleSide,
  });

  const mesh = new THREE.Mesh(geometry, material);
  group.add(mesh);

  // Floating perspective angle: diagonal plane recessed in depth
  group.position.set(0.5, -0.2, -1.5);
  group.rotation.set(-0.55, 0.45, -0.2);

  return {
    group,
    update: (time, delta, velocity, mouse, isReducedMotion) => {
      uniforms.uTime.value = time;
      uniforms.uVelocity.value = velocity;

      if (!isReducedMotion) {
        group.rotation.x = -0.55 + Math.sin(time * 0.1) * 0.06 + mouse.y * 0.15;
        group.rotation.y = 0.45 + Math.cos(time * 0.08) * 0.08 + mouse.x * 0.2;
        group.position.y = -0.2 + Math.sin(time * 0.3) * 0.12;
      }
    },
    updateTheme: (dark) => {
      uniforms.uDarkTheme.value = dark ? 1.0 : 0.0;
      uniforms.uColorBase.value.set(dark ? 0x181612 : 0xEAE6DB);
      uniforms.uColorHighlight.value.set(dark ? 0xC9A227 : 0x7A5B10);
      uniforms.uColorCyan.value.set(dark ? 0x5a8a9a : 0x466e82);
    },
    setOpacity: (alpha) => {
      uniforms.uOpacity.value = 0.45 * alpha;
    },
    dispose: () => {
      geometry.dispose();
      material.dispose();
    },
  };
}
