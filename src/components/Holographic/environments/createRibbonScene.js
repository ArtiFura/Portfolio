import * as THREE from 'three';
import { holographicVertexShader, holographicFragmentShader } from '../shaders/holographicShaders';

/**
 * PAGE 02 — Liquid Glass Ribbon
 * Procedural Catmull-Rom 3D spline extruded into an architectural glass ribbon.
 * Flows diagonally with subtle fluid morphing, Fresnel transmission, and bronze sheen.
 */
export function createRibbonScene(isDark = false) {
  const group = new THREE.Group();

  // Create base spline control points traveling diagonally
  const basePoints = [
    new THREE.Vector3(-4.5, 3.2, -1.5),
    new THREE.Vector3(-2.0, 1.8, 0.2),
    new THREE.Vector3(0.5, 0.2, -0.8),
    new THREE.Vector3(2.5, -1.6, 0.4),
    new THREE.Vector3(4.8, -3.2, -1.2),
  ];

  const curve = new THREE.CatmullRomCurve3(basePoints);
  curve.curveType = 'centripetal';

  // Generate ribbon using TubeGeometry
  const geometry = new THREE.TubeGeometry(curve, 96, 0.45, 16, false);

  const uniforms = {
    uTime: { value: 0 },
    uVelocity: { value: 0 },
    uNoiseScale: { value: 0.6 },
    uNoiseIntensity: { value: 0.16 },
    uOpacity: { value: 0.55 },
    uFresnelPower: { value: 2.4 },
    uColorBase: { value: isDark ? new THREE.Color(0x181612) : new THREE.Color(0xEAE6DB) },
    uColorHighlight: { value: isDark ? new THREE.Color(0xC9A227) : new THREE.Color(0x7A5B10) },
    uColorCyan: { value: isDark ? new THREE.Color(0x5a8a9a) : new THREE.Color(0x466e82) },
    uChromaticDispersion: { value: 1.4 },
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

  // Add subtle companion hairline contour line
  const edgePoints = curve.getPoints(120);
  const lineGeometry = new THREE.BufferGeometry().setFromPoints(edgePoints);
  const lineMaterial = new THREE.LineBasicMaterial({
    color: isDark ? 0xC9A227 : 0x7A5B10,
    transparent: true,
    opacity: 0.25,
  });
  const lineMesh = new THREE.Line(lineGeometry, lineMaterial);
  group.add(lineMesh);

  return {
    group,
    update: (time, delta, velocity, mouse, isReducedMotion) => {
      uniforms.uTime.value = time;
      uniforms.uVelocity.value = velocity;

      if (!isReducedMotion) {
        // Morph the ribbon curve points gently
        const posAttr = lineGeometry.attributes.position;
        const pts = curve.getPoints(120);
        for (let i = 0; i < pts.length; i++) {
          const wave = Math.sin(time * 0.8 + i * 0.08) * (0.12 + velocity * 0.25);
          posAttr.setY(i, pts[i].y + wave);
        }
        posAttr.needsUpdate = true;

        group.rotation.z = Math.sin(time * 0.1) * 0.04 + mouse.x * 0.15;
        group.rotation.x = mouse.y * 0.15;
        group.position.y = Math.sin(time * 0.4) * 0.15;
      }
    },
    updateTheme: (dark) => {
      uniforms.uDarkTheme.value = dark ? 1.0 : 0.0;
      uniforms.uColorBase.value.set(dark ? 0x181612 : 0xEAE6DB);
      uniforms.uColorHighlight.value.set(dark ? 0xC9A227 : 0x7A5B10);
      uniforms.uColorCyan.value.set(dark ? 0x5a8a9a : 0x466e82);
      lineMaterial.color.set(dark ? 0xC9A227 : 0x7A5B10);
    },
    setOpacity: (alpha) => {
      uniforms.uOpacity.value = 0.55 * alpha;
      lineMaterial.opacity = 0.25 * alpha;
    },
    dispose: () => {
      geometry.dispose();
      material.dispose();
      lineGeometry.dispose();
      lineMaterial.dispose();
    },
  };
}
