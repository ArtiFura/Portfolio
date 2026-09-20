import * as THREE from 'three';
import { holographicVertexShader, holographicFragmentShader } from '../shaders/holographicShaders';

/**
 * PAGE 08 — Abstract Geometric Form
 * Faceted computational glass artifact (stellated/truncated icosahedral compound).
 * Breathes with procedural harmonic morphing, settling into a stable crystal state at rest.
 */
export function createAbstractFormScene(isDark = false) {
  const group = new THREE.Group();

  // Dual polyhedron compound: outer faceted shell + inner wireframe cage
  const outerGeom = new THREE.DodecahedronGeometry(2.0, 2);

  const uniforms = {
    uTime: { value: 0 },
    uVelocity: { value: 0 },
    uNoiseScale: { value: 0.75 },
    uNoiseIntensity: { value: 0.14 },
    uOpacity: { value: 0.6 },
    uFresnelPower: { value: 2.3 },
    uColorBase: { value: isDark ? new THREE.Color(0x181612) : new THREE.Color(0xEAE6DB) },
    uColorHighlight: { value: isDark ? new THREE.Color(0xC9A227) : new THREE.Color(0x7A5B10) },
    uColorCyan: { value: isDark ? new THREE.Color(0x5a8a9a) : new THREE.Color(0x466e82) },
    uChromaticDispersion: { value: 1.25 },
    uDarkTheme: { value: isDark ? 1.0 : 0.0 },
  };

  const outerMat = new THREE.ShaderMaterial({
    vertexShader: holographicVertexShader,
    fragmentShader: holographicFragmentShader,
    uniforms,
    transparent: true,
    depthWrite: false,
    side: THREE.DoubleSide,
  });

  const outerMesh = new THREE.Mesh(outerGeom, outerMat);
  group.add(outerMesh);

  // Inner architectural geometric skeleton
  const innerGeom = new THREE.IcosahedronGeometry(1.6, 0);
  const wireMat = new THREE.MeshBasicMaterial({
    color: isDark ? 0xC9A227 : 0x7A5B10,
    wireframe: true,
    transparent: true,
    opacity: 0.25,
  });
  const innerMesh = new THREE.Mesh(innerGeom, wireMat);
  group.add(innerMesh);

  // Positioned slightly right, elegant center-balanced presence
  group.position.set(1.5, 0, 0);

  return {
    group,
    update: (time, delta, velocity, mouse, isReducedMotion) => {
      uniforms.uTime.value = time;
      uniforms.uVelocity.value = velocity;

      if (!isReducedMotion) {
        outerMesh.rotation.x = time * 0.12 + mouse.y * 0.2;
        outerMesh.rotation.y = time * 0.16 + mouse.x * 0.25;

        innerMesh.rotation.x = -time * 0.18;
        innerMesh.rotation.z = time * 0.14;

        // Subtle geometric breathing
        const pulse = 1.0 + Math.sin(time * 0.8) * 0.03 + velocity * 0.15;
        group.scale.set(pulse, pulse, pulse);

        group.position.x = 1.5 + mouse.x * 0.35;
        group.position.y = 0 - mouse.y * 0.25;
      }
    },
    updateTheme: (dark) => {
      uniforms.uDarkTheme.value = dark ? 1.0 : 0.0;
      uniforms.uColorBase.value.set(dark ? 0x181612 : 0xEAE6DB);
      uniforms.uColorHighlight.value.set(dark ? 0xC9A227 : 0x7A5B10);
      uniforms.uColorCyan.value.set(dark ? 0x5a8a9a : 0x466e82);
      wireMat.color.set(dark ? 0xC9A227 : 0x7A5B10);
    },
    setOpacity: (alpha) => {
      uniforms.uOpacity.value = 0.6 * alpha;
      wireMat.opacity = 0.25 * alpha;
    },
    dispose: () => {
      outerGeom.dispose();
      outerMat.dispose();
      innerGeom.dispose();
      wireMat.dispose();
    },
  };
}
