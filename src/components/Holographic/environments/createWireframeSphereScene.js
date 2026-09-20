import * as THREE from 'three';

/**
 * PAGE 03 — Wireframe Sphere
 * Architectural computational coordinate globe with latitude/longitude rings,
 * geodesic arcs, and luminous coordinate vertices in muted bronze.
 */
export function createWireframeSphereScene(isDark = false) {
  const group = new THREE.Group();

  const radius = 2.5;
  const bronzeColor = isDark ? 0xC9A227 : 0x7A5B10;
  const darkColor = isDark ? 0xF4E8C1 : 0x16130D;

  const lineMaterials = [];
  const geometries = [];

  // 1. Latitude Circles
  const latRings = 7;
  for (let i = 1; i < latRings; i++) {
    const phi = (i / latRings) * Math.PI;
    const r = radius * Math.sin(phi);
    const y = radius * Math.cos(phi);

    const latGeom = new THREE.BufferGeometry();
    const points = [];
    const segments = 64;
    for (let j = 0; j <= segments; j++) {
      const theta = (j / segments) * Math.PI * 2;
      points.push(new THREE.Vector3(r * Math.cos(theta), y, r * Math.sin(theta)));
    }
    latGeom.setFromPoints(points);
    geometries.push(latGeom);

    const mat = new THREE.LineBasicMaterial({
      color: bronzeColor,
      transparent: true,
      opacity: i === Math.floor(latRings / 2) ? 0.75 : 0.5,
    });
    lineMaterials.push(mat);

    const line = new THREE.Line(latGeom, mat);
    group.add(line);
  }

  // 2. Longitude Great Circles
  const lonRings = 8;
  for (let i = 0; i < lonRings; i++) {
    const angle = (i / lonRings) * Math.PI;
    const lonGeom = new THREE.BufferGeometry();
    const points = [];
    const segments = 64;
    for (let j = 0; j <= segments; j++) {
      const theta = (j / segments) * Math.PI * 2;
      points.push(new THREE.Vector3(
        radius * Math.cos(theta) * Math.cos(angle),
        radius * Math.sin(theta),
        radius * Math.cos(theta) * Math.sin(angle)
      ));
    }
    lonGeom.setFromPoints(points);
    geometries.push(lonGeom);

    const mat = new THREE.LineBasicMaterial({
      color: bronzeColor,
      transparent: true,
      opacity: 0.5,
    });
    lineMaterials.push(mat);

    const line = new THREE.Line(lonGeom, mat);
    group.add(line);
  }

  // 3. Geodesic Intersection Points (Luminous Coordinate Nodes)
  const nodeGeom = new THREE.BufferGeometry();
  const nodePositions = [];
  for (let i = 0; i < 48; i++) {
    const u = Math.random();
    const v = Math.random();
    const theta = u * 2.0 * Math.PI;
    const phi = Math.acos(2.0 * v - 1.0);
    const r = radius;
    nodePositions.push(
      r * Math.sin(phi) * Math.cos(theta),
      r * Math.sin(phi) * Math.sin(theta),
      r * Math.cos(phi)
    );
  }
  nodeGeom.setAttribute('position', new THREE.Float32BufferAttribute(nodePositions, 3));
  geometries.push(nodeGeom);

  const nodeMat = new THREE.PointsMaterial({
    color: darkColor,
    size: 3.5,
    transparent: true,
    opacity: 0.5,
  });

  const nodes = new THREE.Points(nodeGeom, nodeMat);
  group.add(nodes);

  // Positioned slightly left and recessed in Z
  group.position.set(-1.6, -0.1, -1.0);

  return {
    group,
    update: (time, delta, velocity, mouse, isReducedMotion) => {
      if (!isReducedMotion) {
        group.rotation.y = time * 0.08 + mouse.x * 0.25;
        group.rotation.x = Math.sin(time * 0.06) * 0.15 + mouse.y * 0.2;
        group.rotation.z = Math.cos(time * 0.04) * 0.08;

        // Velocity breathing
        const scale = 1.0 + velocity * 0.18;
        group.scale.set(scale, scale, scale);
      }
    },
    updateTheme: (dark) => {
      const bColor = dark ? 0xC9A227 : 0x7A5B10;
      const dColor = dark ? 0xF4E8C1 : 0x16130D;
      lineMaterials.forEach((m) => m.color.set(bColor));
      nodeMat.color.set(dColor);
    },
    setOpacity: (alpha) => {
      lineMaterials.forEach((m) => {
        m.opacity = 0.5 * alpha;
      });
      nodeMat.opacity = 0.8 * alpha;
    },
    dispose: () => {
      geometries.forEach((g) => g.dispose());
      lineMaterials.forEach((m) => m.dispose());
      nodeMat.dispose();
    },
  };
}
