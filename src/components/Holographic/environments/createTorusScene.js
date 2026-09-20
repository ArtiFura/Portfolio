import * as THREE from 'three';
import { holographicVertexShader, holographicFragmentShader } from '../shaders/holographicShaders';

/**
 * PAGE 04 — Distorted Torus
 * Monumental procedural torus extending partially beyond the viewport.
 * Smooth harmonic vertex displacement with glass refraction and bronze sheen.
 */
export function createTorusScene(isDark = false) {
  const group = new THREE.Group();

  const geometry = new THREE.TorusGeometry(3.4, 0.72, 48, 96);

  const uniforms = {
    uTime: { value: 0 },
    uVelocity: { value: 0 },
    uNoiseScale: { value: 0.55 },
    uNoiseIntensity: { value: 0.18 },
    uOpacity: { value: 0.5 },
    uFresnelPower: { value: 2.5 },
    uColorBase: { value: isDark ? new THREE.Color(0x181612) : new THREE.Color(0xEAE6DB) },
    uColorHighlight: { value: isDark ? new THREE.Color(0xC9A227) : new THREE.Color(0x7A5B10) },
    uColorCyan: { value: isDark ? new THREE.Color(0x5a8a9a) : new THREE.Color(0x466e82) },
    uChromaticDispersion: { value: 1.3 },
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

  // Positioned tilted and extending off-screen to the right
  group.position.set(2.4, -0.4, -1.2);
  group.rotation.set(0.8, -0.4, 0.3);

  return {
    group,
    update: (time, delta, velocity, mouse, isReducedMotion) => {
      uniforms.uTime.value = time;
      uniforms.uVelocity.value = velocity;

      if (!isReducedMotion) {
        mesh.rotation.z = time * 0.12;
        mesh.rotation.x = 0.8 + Math.sin(time * 0.08) * 0.1 + mouse.y * 0.18;
        mesh.rotation.y = -0.4 + mouse.x * 0.2;

        group.position.x = 2.4 + mouse.x * 0.3;
        group.position.y = -0.4 - mouse.y * 0.25;
      }
    },
    updateTheme: (dark) => {
      uniforms.uDarkTheme.value = dark ? 1.0 : 0.0;
      uniforms.uColorBase.value.set(dark ? 0x181612 : 0xEAE6DB);
      uniforms.uColorHighlight.value.set(dark ? 0xC9A227 : 0x7A5B10);
      uniforms.uColorCyan.value.set(dark ? 0x5a8a9a : 0x466e82);
    },
    setOpacity: (alpha) => {
      uniforms.uOpacity.value = 0.5 * alpha;
    },
    dispose: () => {
      geometry.dispose();
      material.dispose();
    },
  };
}
