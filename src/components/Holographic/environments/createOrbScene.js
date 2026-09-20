import * as THREE from 'three';
import { holographicVertexShader, holographicFragmentShader } from '../shaders/holographicShaders';

/**
 * PAGE 01 — Holographic Orb
 * Procedural 3D holographic sphere with surface noise displacement,
 * Fresnel glass transmission, subtle chromatic dispersion, and bronze edge highlights.
 * Positioned off-center toward the right to maintain absolute typography legibility.
 */
export function createOrbScene(isDark = false) {
  const group = new THREE.Group();

  const geometry = new THREE.IcosahedronGeometry(2.2, 48);

  const uniforms = {
    uTime: { value: 0 },
    uVelocity: { value: 0 },
    uNoiseScale: { value: 0.8 },
    uNoiseIntensity: { value: 0.12 },
    uOpacity: { value: 0.65 },
    uFresnelPower: { value: 2.2 },
    uColorBase: { value: isDark ? new THREE.Color(0x181612) : new THREE.Color(0xEAE6DB) },
    uColorHighlight: { value: isDark ? new THREE.Color(0xC9A227) : new THREE.Color(0x7A5B10) },
    uColorCyan: { value: isDark ? new THREE.Color(0x5a8a9a) : new THREE.Color(0x466e82) },
    uChromaticDispersion: { value: 1.2 },
    uDarkTheme: { value: isDark ? 1.0 : 0.0 },
  };

  const material = new THREE.ShaderMaterial({
    vertexShader: holographicVertexShader,
    fragmentShader: holographicFragmentShader,
    uniforms,
    transparent: true,
    depthWrite: false,
    blending: THREE.NormalBlending,
    side: THREE.DoubleSide,
  });

  const mesh = new THREE.Mesh(geometry, material);
  group.add(mesh);

  // Subtle interior core glow
  const coreGeometry = new THREE.SphereGeometry(1.4, 32, 32);
  const coreMaterial = new THREE.MeshBasicMaterial({
    color: isDark ? 0xC9A227 : 0x7A5B10,
    wireframe: true,
    transparent: true,
    opacity: 0.08,
  });
  const coreMesh = new THREE.Mesh(coreGeometry, coreMaterial);
  group.add(coreMesh);

  // Offset position toward right side (desktop)
  group.position.set(1.8, -0.2, 0);

  return {
    group,
    update: (time, delta, velocity, mouse, isReducedMotion) => {
      uniforms.uTime.value = time;
      uniforms.uVelocity.value = velocity;

      if (!isReducedMotion) {
        mesh.rotation.y = time * 0.15 + mouse.x * 0.3;
        mesh.rotation.x = Math.sin(time * 0.1) * 0.12 + mouse.y * 0.2;
        coreMesh.rotation.y = -time * 0.2;

        // Gentle floating parallax
        group.position.x = 1.8 + mouse.x * 0.4;
        group.position.y = -0.2 - mouse.y * 0.3 + Math.sin(time * 0.6) * 0.08;
      }
    },
    updateTheme: (dark) => {
      uniforms.uDarkTheme.value = dark ? 1.0 : 0.0;
      uniforms.uColorBase.value.set(dark ? 0x181612 : 0xEAE6DB);
      uniforms.uColorHighlight.value.set(dark ? 0xC9A227 : 0x7A5B10);
      uniforms.uColorCyan.value.set(dark ? 0x5a8a9a : 0x466e82);
      coreMaterial.color.set(dark ? 0xC9A227 : 0x7A5B10);
    },
    setOpacity: (alpha) => {
      uniforms.uOpacity.value = 0.65 * alpha;
      coreMaterial.opacity = 0.08 * alpha;
    },
    dispose: () => {
      geometry.dispose();
      material.dispose();
      coreGeometry.dispose();
      coreMaterial.dispose();
    },
  };
}
