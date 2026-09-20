import * as THREE from 'three';

/**
 * PAGE 05 — Particle Field
 * Volumetric 3D computational matter drifting gently in space.
 * Responds dynamically to mouse proximity and scroll velocity.
 */
export function createParticleScene(isDark = false) {
  const group = new THREE.Group();

  const particleCount = typeof window !== 'undefined' && window.innerWidth < 768 ? 400 : 800;
  const geometry = new THREE.BufferGeometry();

  const positions = new Float32Array(particleCount * 3);
  const basePositions = new Float32Array(particleCount * 3);
  const velocities = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);
  const sizes = new Float32Array(particleCount);

  const bronzeColor = isDark ? new THREE.Color(0xC9A227) : new THREE.Color(0x7A5B10);
  const lightColor = isDark ? new THREE.Color(0xF4E8C1) : new THREE.Color(0x16130D);
  const cyanColor = isDark ? new THREE.Color(0x5a8a9a) : new THREE.Color(0x466e82);

  for (let i = 0; i < particleCount; i++) {
    const i3 = i * 3;
    // Distribute in a wide shallow volume
    const x = (Math.random() - 0.5) * 16;
    const y = (Math.random() - 0.5) * 10;
    const z = (Math.random() - 0.5) * 6;

    positions[i3] = x;
    positions[i3 + 1] = y;
    positions[i3 + 2] = z;

    basePositions[i3] = x;
    basePositions[i3 + 1] = y;
    basePositions[i3 + 2] = z;

    velocities[i3] = (Math.random() - 0.5) * 0.008;
    velocities[i3 + 1] = (Math.random() - 0.5) * 0.008;
    velocities[i3 + 2] = (Math.random() - 0.5) * 0.008;

    // Harmonious palette: 60% bronze, 30% light/dark, 10% faint cyan
    const r = Math.random();
    const c = r < 0.6 ? bronzeColor : r < 0.9 ? lightColor : cyanColor;
    colors[i3] = c.r;
    colors[i3 + 1] = c.g;
    colors[i3 + 2] = c.b;

    sizes[i] = Math.random() * 2.5 + 1.2;
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

  // Custom Point shader for smooth circular points with softness
  const material = new THREE.PointsMaterial({
    size: 2.8,
    vertexColors: true,
    transparent: true,
    opacity: 0.5,
    sizeAttenuation: true,
    depthWrite: false,
  });

  const pointsMesh = new THREE.Points(geometry, material);
  group.add(pointsMesh);

  return {
    group,
    update: (time, delta, velocity, mouse, isReducedMotion) => {
      if (isReducedMotion) return;

      const pos = geometry.attributes.position.array;
      const velMultiplier = 1.0 + velocity * 5.0;

      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;

        // Base drift
        pos[i3] += velocities[i3] * velMultiplier;
        pos[i3 + 1] += (velocities[i3 + 1] - velocity * 0.04) * velMultiplier;
        pos[i3 + 2] += velocities[i3 + 2] * velMultiplier;

        // Wrap around boundaries
        if (pos[i3] < -8) pos[i3] = 8;
        if (pos[i3] > 8) pos[i3] = -8;
        if (pos[i3 + 1] < -5) pos[i3 + 1] = 5;
        if (pos[i3 + 1] > 5) pos[i3 + 1] = -5;

        // Mouse proximity gentle repulsion
        const dx = pos[i3] - (mouse.x * 6);
        const dy = pos[i3 + 1] - (mouse.y * 4);
        const distSq = dx * dx + dy * dy;
        if (distSq < 4.0 && distSq > 0.01) {
          const force = (1.0 - Math.sqrt(distSq) / 2.0) * 0.02;
          pos[i3] += (dx / Math.sqrt(distSq)) * force;
          pos[i3 + 1] += (dy / Math.sqrt(distSq)) * force;
        }
      }

      geometry.attributes.position.needsUpdate = true;
      group.rotation.y = time * 0.02 + mouse.x * 0.1;
    },
    updateTheme: (dark) => {
      const bColor = dark ? new THREE.Color(0xC9A227) : new THREE.Color(0x7A5B10);
      const lColor = dark ? new THREE.Color(0xF4E8C1) : new THREE.Color(0x16130D);
      const cColor = dark ? new THREE.Color(0x5a8a9a) : new THREE.Color(0x466e82);
      const colAttr = geometry.attributes.color.array;

      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        const r = (i % 10) / 10;
        const c = r < 0.6 ? bColor : r < 0.9 ? lColor : cColor;
        colAttr[i3] = c.r;
        colAttr[i3 + 1] = c.g;
        colAttr[i3 + 2] = c.b;
      }
      geometry.attributes.color.needsUpdate = true;
    },
    setOpacity: (alpha) => {
      material.opacity = 0.5 * alpha;
    },
    dispose: () => {
      geometry.dispose();
      material.dispose();
    },
  };
}
