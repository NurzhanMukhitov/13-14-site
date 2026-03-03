"use client";

/* eslint-disable react-hooks/purity, react-hooks/immutability */

import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";

type PointsRef = React.MutableRefObject<THREE.Points | null>;

type SpherePointsProps = {
  pointer: React.MutableRefObject<[number, number] | null>;
};

function SpherePoints({ pointer }: SpherePointsProps) {
  const pointsRef = useRef<THREE.Points | null>(null) as PointsRef;

  // Генерируем точки на сфере один раз
  const { basePositions, positions } = useMemo(() => {
    const radius = 1;
    const count = 4000; // стартовое количество точек, потом можно параметризовать
    const base = new Float32Array(count * 3);
    const current = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      // равномерное распределение по сфере
      const u = Math.random();
      const v = Math.random();
      const theta = 2 * Math.PI * u;
      const phi = Math.acos(2 * v - 1);

      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.cos(phi);
      const z = radius * Math.sin(phi) * Math.sin(theta);

      base[i * 3] = x;
      base[i * 3 + 1] = y;
      base[i * 3 + 2] = z;

      current[i * 3] = x;
      current[i * 3 + 1] = y;
      current[i * 3 + 2] = z;
    }

    return { basePositions: base, positions: current };
  }, []);

  // Анимация и простая репульсия от указателя в плоскости XY
  useFrame((_, delta) => {
    const pts = pointsRef.current;
    if (!pts) return;

    // Лёгкое вращение вокруг оси Y
    pts.rotation.y += delta * 0.2;

    const attr = 0.08;
    const damping = 0.9;
    const repelRadius = 0.5;
    const repelStrength = 0.2;

    const pointerPos = pointer.current;

    for (let i = 0; i < positions.length / 3; i++) {
      const bx = basePositions[i * 3];
      const by = basePositions[i * 3 + 1];
      const bz = basePositions[i * 3 + 2];

      let x = positions[i * 3];
      let y = positions[i * 3 + 1];
      let z = positions[i * 3 + 2];

      // сила возврата к "дому"
      x += (bx - x) * attr;
      y += (by - y) * attr;
      z += (bz - z) * attr;

      // отталкивание от указателя в плоскости XY
      if (pointerPos) {
        const [px, py] = pointerPos;
        const dx = x - px;
        const dy = y - py;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist > 0 && dist < repelRadius) {
          const f = (1 - dist / repelRadius) * repelStrength;
          x += (dx / dist) * f;
          y += (dy / dist) * f;
        }
      }

      // лёгкий демпфинг (псевдо-скорость)
      positions[i * 3] = x * damping + bx * (1 - damping);
      positions[i * 3 + 1] = y * damping + by * (1 - damping);
      positions[i * 3 + 2] = z * damping + bz * (1 - damping);
    }

    // помечаем атрибут как изменённый
    const geom = pts.geometry;
    const attrPos = geom.getAttribute("position");
    if (attrPos) {
      attrPos.needsUpdate = true;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        color="white"
        size={0.015}
        sizeAttenuation
      />
    </points>
  );
}

export function SphereCanvasR3F() {
  const pointer = useRef<[number, number] | null>(null);

  return (
    <Canvas
      camera={{ position: [0, 0, 3], fov: 45 }}
      style={{ width: "100%", height: "100%" }}
      onPointerMove={(event) => {
        // event.point — координаты в мировом пространстве на плоскости z=0
        const { x, y } = event.point;
        pointer.current = [x, y];
      }}
      onPointerLeave={() => {
        pointer.current = null;
      }}
    >
      <color attach="background" args={["black"]} />
      <SpherePoints pointer={pointer} />
    </Canvas>
  );
}

