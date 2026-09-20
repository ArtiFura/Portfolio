import * as THREE from 'three';

/**
 * PAGE 07 — Architectural Grid
 * 3D perspective blueprint matrix with depth coordinate lines, vanishing point,
 * and subtle bronze intersection nodes. Highly restrained and architectural.
 */
export function createGridScene(isDark = false) {
  const group = new THREE.Group();

  const bronzeColor = isDark ? 0xC9A227 : 0x7A5B10;
  const darkColor = isDark ? 0xF4E8C1 : 0x16130D;

  const geometries = [];
  const materials = [];

  // Ground plane perspective grid
  const gridHelper = new THREE.GridHelper(24, 24, bronzeColor, isDark ? 0x242018 : 0xDCD4C0);
  gridHelper.position.y = -2.8;
  gridHelper.rotation.x = 0.05;
  gridHelper.material.transparent = true;
  gridHelper.material.opacity = 0.55;
  materials.push(gridHelper.material);
  group.add(gridHelper);

  // Vertical architectural datum lines
  const datumGeom = new THREE.BufferGeometry();
  const datumPoints = [];
  const xPositions = [-6, -3, 0, 3, 6];
  xPositions.forEach((x) => {
    datumPoints.push(new THREE.Vector3(x, -2.8, -8));
    datumPoints.push(new THREE.Vector3(x, 4.0, -8));
    datumPoints.push(new THREE.Vector3(x, -2.8, 4));
    datumPoints.push(new THREE.Vector3(x, 4.0, 4));
  });
  datumGeom.setFromPoints(datumPoints);
  geometries.push(datumGeom);

  const datumMat = new THREE.LineBasicMaterial({
    color: bronzeColor,
    transparent: true,
    opacity: 0.4,
  });
  materials.push(datumMat);

  const datumLines = new THREE.LineSegments(datumGeom, datumMat);
  group.add(datumLines);

  // Coordinate intersection reticle points
  const pointsGeom = new THREE.BufferGeometry();
  const pointPositions = [];
  for (let x = -8; x <= 8; x += 2) {
    for (let z = -8; z <= 4; z += 2) {
      pointPositions.push(x, -2.8, z);
    }
  }
  pointsGeom.setAttribute('position', new THREE.Float32BufferAttribute(pointPositions, 3));
  geometries.push(pointsGeom);

  const pointsMat = new THREE.PointsMaterial({
    color: bronzeColor,
    size: 2.2,
    transparent: true,
    opacity: 0.7,
  });
  materials.push(pointsMat);

  const gridPoints = new THREE.Points(pointsGeom, pointsMat);
  group.add(gridPoints);

  // Tilt perspective back
  group.position.set(0, 0, -2);
  group.rotation.x = 0.2;

  return {
    group,
    update: (time, delta, velocity, mouse, isReducedMotion) => {
      if (!isReducedMotion) {
        // Perspective shifts subtly with mouse and scroll
        group.rotation.y = mouse.x * 0.12;
        group.rotation.x = 0.2 + mouse.y * 0.08;
        gridHelper.position.z = -2 + (velocity * 1.5) % 1.0;
      }
    },
    updateTheme: (dark) => {
      const bColor = dark ? 0xC9A227 : 0x7A5B10;
      const subColor = dark ? 0x242018 : 0xDCD4C0;
      gridHelper.material.color.set(bColor);
      datumMat.color.set(bColor);
      pointsMat.color.set(bColor);
    },
    setOpacity: (alpha) => {
      gridHelper.material.opacity = 0.55 * alpha;
      datumMat.opacity = 0.4 * alpha;
      pointsMat.opacity = 0.7 * alpha;
    },
    dispose: () => {
      gridHelper.geometry.dispose();
      geometries.forEach((g) => g.dispose());
      materials.forEach((m) => m.dispose());
    },
  };
}
