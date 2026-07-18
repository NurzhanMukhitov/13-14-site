/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/purity, react-hooks/immutability */
"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

type PointsRef = React.MutableRefObject<any>;

type SpherePointsProps = {
  pointer: React.MutableRefObject<[number, number] | null>;
  onRevealChange: (alpha: number) => void;
  count: number;
  radius: number;
  repelRadius: number;
};

const ATTRACTION = 0.01;
const DAMPING = 0.9;
const REPEL_STRENGTH = 28;
const MAX_SPEED = 0.5;

const DIGITS = [0, 1, 2]; // 0 -> "1", 1 -> "3", 2 -> "4"

const vertexShader = `
  attribute float glyph;
  varying float vGlyph;

  void main() {
    vGlyph = glyph;
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    gl_PointSize = 5.0;
  }
`;

const fragmentShader = `
  varying float vGlyph;

  float box(vec2 p, vec2 center, vec2 halfSize) {
    vec2 d = abs(p - center) - halfSize;
    float outside = max(d.x, d.y);
    return outside;
  }

  float digitOne(vec2 uv) {
    float a = 1.0;
    a = min(a, box(uv, vec2(0.5, 0.5), vec2(0.10, 0.35)));
    a = min(a, box(uv, vec2(0.5, 0.15), vec2(0.18, 0.08)));
    return a;
  }

  float digitThree(vec2 uv) {
    float a = 1.0;
    a = min(a, box(uv, vec2(0.5, 0.18), vec2(0.28, 0.08)));
    a = min(a, box(uv, vec2(0.5, 0.50), vec2(0.24, 0.08)));
    a = min(a, box(uv, vec2(0.5, 0.82), vec2(0.28, 0.08)));
    a = min(a, box(uv, vec2(0.78, 0.50), vec2(0.06, 0.30)));
    return a;
  }

  float digitFour(vec2 uv) {
    float a = 1.0;
    a = min(a, box(uv, vec2(0.30, 0.55), vec2(0.08, 0.30)));
    a = min(a, box(uv, vec2(0.70, 0.55), vec2(0.08, 0.35)));
    a = min(a, box(uv, vec2(0.50, 0.50), vec2(0.30, 0.06)));
    return a;
  }

  void main() {
    vec2 uv = gl_PointCoord;
    float d;

    if (vGlyph < 0.5) {
      d = digitOne(uv);
    } else if (vGlyph < 1.5) {
      d = digitThree(uv);
    } else {
      d = digitFour(uv);
    }

    float alpha = smoothstep(0.15, 0.0, d);
    if (alpha < 0.01) discard;
    gl_FragColor = vec4(vec3(1.0), alpha);
  }
`;

function SpherePoints({
  pointer,
  onRevealChange,
  count,
  radius,
  repelRadius,
}: SpherePointsProps) {
  const pointsRef = useRef<any>(null) as PointsRef;
  const angleRef = useRef(0);
  const revealAlphaRef = useRef(0);
   const { camera } = useThree();
   const tmpVec = useRef(new THREE.Vector3()).current;
   const tmpDir = useRef(new THREE.Vector3()).current;

  const { positions, velocities, indices, glyphs, material } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count * 3);
    const idx = new Float32Array(count);
    const glyphArray = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const x = Math.sin(i) * Math.sin(i * i) * radius;
      const y = Math.cos(i * i) * radius;
      const z = 0;

      pos[i * 3] = x;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = z;

      vel[i * 3] = 0;
      vel[i * 3 + 1] = 0;
      vel[i * 3 + 2] = 0;

      idx[i] = i;

      const digitIndex = DIGITS[Math.floor(Math.random() * DIGITS.length)];
      glyphArray[i] = digitIndex;
    }

    const mat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      vertexShader,
      fragmentShader,
    });

    return {
      positions: pos,
      velocities: vel,
      indices: idx,
      glyphs: glyphArray,
      material: mat,
    };
  }, []);

  useFrame((state) => {
    const pts = pointsRef.current;
    if (!pts) return;

    let pointerPos: [number, number] | null = null;
    const pointerNdc = state.pointer;
    if (pointerNdc.lengthSq() > 0) {
      const nx = pointerNdc.x;
      const ny = pointerNdc.y;
      const camPos = camera.position;
      tmpVec.set(nx, ny, 0.5).unproject(camera);
      tmpDir.copy(tmpVec).sub(camPos).normalize();
      const t = -camPos.z / tmpDir.z;
      const hitX = camPos.x + tmpDir.x * t;
      const hitY = camPos.y + tmpDir.y * t;
      pointerPos = [hitX, hitY];
    }
    const count = indices.length;

    let targetAlpha = 0;
    if (pointerPos) {
      const [px, py] = pointerPos;
      const distFromCenter = Math.sqrt(px * px + py * py);
      const maxDist = radius * 0.9;
      const t = 1 - Math.min(Math.max(distFromCenter / maxDist, 0), 1);
      targetAlpha = 255 * t;
    }

    const revealAlpha = revealAlphaRef.current;
    const nextReveal =
      revealAlpha + (targetAlpha - revealAlpha) * 0.1;
    revealAlphaRef.current = nextReveal;

    const angle = angleRef.current;

    for (let i = 0; i < count; i++) {
      const baseIndex = i * 3;

      const homeX = Math.sin(i + angle) * Math.sin(i * i) * radius;
      const homeY = Math.cos(i * i) * radius;
      const homeZ = 0;

      let x = positions[baseIndex];
      let y = positions[baseIndex + 1];
      let z = positions[baseIndex + 2];

      let vx = velocities[baseIndex];
      let vy = velocities[baseIndex + 1];
      let vz = velocities[baseIndex + 2];

      vx += (homeX - x) * ATTRACTION;
      vy += (homeY - y) * ATTRACTION;
      vz += (homeZ - z) * ATTRACTION;

      if (pointerPos) {
        const [px, py] = pointerPos;
        const dx = x - px;
        const dy = y - py;
        const distSq = dx * dx + dy * dy;
        if (distSq > 0.1 && distSq < repelRadius * repelRadius) {
          const dist = Math.sqrt(distSq);
          const repel =
            REPEL_STRENGTH * (1 - dist / repelRadius);
          const nx = dx / dist;
          const ny = dy / dist;
          vx += nx * repel;
          vy += ny * repel;
        }
      }

      vx *= DAMPING;
      vy *= DAMPING;
      vz *= DAMPING;

      const speedSq = vx * vx + vy * vy + vz * vz;
      if (speedSq > MAX_SPEED * MAX_SPEED) {
        const scale = MAX_SPEED / Math.sqrt(speedSq);
        vx *= scale;
        vy *= scale;
        vz *= scale;
      }

      x += vx;
      y += vy;
      z += vz;


      positions[baseIndex] = x;
      positions[baseIndex + 1] = y;
      positions[baseIndex + 2] = z;

      velocities[baseIndex] = vx;
      velocities[baseIndex + 1] = vy;
      velocities[baseIndex + 2] = vz;
    }

    angleRef.current += 0.005;

    const geom = pts.geometry as THREE.BufferGeometry;
    const attrPos = geom.getAttribute("position") as THREE.BufferAttribute;
    if (attrPos) {
      attrPos.needsUpdate = true;
    }

    onRevealChange(nextReveal);
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-glyph"
          args={[glyphs, 1]}
        />
      </bufferGeometry>
      <primitive object={material} attach="material" />
    </points>
  );
}

export function SphereCanvasR3F() {
  const pointer = useRef<[number, number] | null>(null);
  const [revealAlpha, setRevealAlpha] = useState(0);
  const [particleCount, setParticleCount] = useState(8000);
  const [radius, setRadius] = useState(0.9);
  const [repelRadius, setRepelRadius] = useState(0.33);

  useEffect(() => {
    const updateCount = () => {
      if (typeof window === "undefined") return;
      const width = window.innerWidth;
      if (width <= 640) {
        setParticleCount(4000);
      } else {
        setParticleCount(8000);
      }
      setRadius(0.9);
      setRepelRadius(0.33);
    };

    updateCount();
    window.addEventListener("resize", updateCount);
    return () => {
      window.removeEventListener("resize", updateCount);
    };
  }, []);

  return (
    <div className="relative w-full h-[min(90vh,900px)]">
      <Canvas
        camera={{ position: [0, 0, 3], fov: 45 }}
      >
        <color attach="background" args={["black"]} />
        <SpherePoints
          pointer={pointer}
          count={particleCount}
          radius={radius}
          repelRadius={repelRadius}
          onRevealChange={(alpha) => {
            setRevealAlpha((prev) =>
              Math.abs(prev - alpha) < 0.5 ? prev : alpha,
            );
          }}
        />
      </Canvas>

      <div className="pointer-events-none absolute inset-0 flex items-center justify-center px-6 text-center">
        <p
          className="text-xs leading-relaxed text-white/90 sm:text-sm md:text-base"
          style={{ opacity: revealAlpha / 255 }}
        >
          Digital visual artist.
          <br />
          From generative systems to interactive environments.
          <br />
          Code, motion, structure.
          <br />
          Open to collaborations.
        </p>
      </div>
    </div>
  );
}


