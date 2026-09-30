"use client";

import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import { Grid } from "@react-three/drei";
import { Bloom, EffectComposer, Vignette } from "@react-three/postprocessing";
import * as THREE from "three";
import { scrollState } from "@/lib/scrollState";

export type HoverFn = (unit: number | null, x: number, y: number) => void;

/** One tower per managed unit: 25 x 14 = 350. */
const COLS = 25;
const ROWS = 14;
const SPACING = 1.7;

function rng(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type Tower = { x: number; z: number; w: number; d: number; h: number; delay: number; lit: boolean; tone: number };

function buildCity(): Tower[] {
  const r = rng(350);
  const spires = new Set<number>();
  while (spires.size < 6) spires.add((2 + Math.floor(r() * 8)) * COLS + 7 + Math.floor(r() * 11));

  return Array.from({ length: COLS * ROWS }, (_, i) => {
    const col = i % COLS;
    const row = Math.floor(i / COLS);
    const x = (col - (COLS - 1) / 2) * SPACING;
    const z = 3 - row * SPACING;
    const downtown = Math.exp(-((x / 8) ** 2 + ((z + 7) / 6) ** 2));
    const spire = spires.has(i);
    const h = 0.7 + r() ** 2 * 3 + downtown * 4.2 + (spire ? 8 + r() * 3 : 0);
    return {
      x, z, h,
      w: 0.8 + r() * 0.3,
      d: 0.8 + r() * 0.3,
      delay: 0.2 + Math.hypot(x * 0.35, (z + 7) * 0.5) * 0.12 + r() * 0.35,
      lit: spire || r() < 0.14,
      tone: r(),
    };
  });
}

const RISE = 1.5;
const eased = (t: Tower, time: number, reduce: boolean) => {
  const k = reduce ? 1 : Math.min(1, Math.max(0, (time - t.delay) / RISE));
  return { k, e: 1 - (1 - k) ** 3 };
};

function Skyline({ onHover }: { onHover: HoverFn }) {
  const towers = useMemo(buildCity, []);
  const litIdx = useMemo(() => towers.flatMap((t, i) => (t.lit ? [i] : [])), [towers]);
  const baseColors = useMemo(
    () => towers.map((t) => new THREE.Color().setHSL(0.6, 0.15, 0.07 + t.tone * 0.07)),
    [towers],
  );
  const mesh = useRef<THREE.InstancedMesh>(null);
  const beacons = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const hovered = useRef(-1);
  const settled = useRef(false);
  const reduce = useMemo(() => window.matchMedia("(prefers-reduced-motion: reduce)").matches, []);

  useEffect(() => {
    const m = mesh.current!;
    baseColors.forEach((c, i) => m.setColorAt(i, c));
    m.instanceColor!.needsUpdate = true;
  }, [baseColors]);

  useFrame(({ clock }) => {
    const m = mesh.current;
    const b = beacons.current;
    if (!m || !b) return;
    const time = clock.elapsedTime;

    if (!settled.current) {
      let done = true;
      towers.forEach((t, i) => {
        const { k, e } = eased(t, time, reduce);
        if (k < 1) done = false;
        const h = Math.max(0.001, t.h * e);
        dummy.position.set(t.x, h / 2, t.z);
        dummy.scale.set(t.w, h, t.d);
        dummy.updateMatrix();
        m.setMatrixAt(i, dummy.matrix);
      });
      litIdx.forEach((ti, bi) => {
        const t = towers[ti];
        const { e } = eased(t, time, reduce);
        dummy.position.set(t.x, t.h * e + 0.04, t.z);
        dummy.scale.set(t.w * 0.55 * e + 0.0001, 0.08, t.d * 0.55 * e + 0.0001);
        dummy.updateMatrix();
        b.setMatrixAt(bi, dummy.matrix);
      });
      m.instanceMatrix.needsUpdate = true;
      b.instanceMatrix.needsUpdate = true;
      settled.current = done;
    }

    (b.material as THREE.MeshBasicMaterial).color.set("#ff5a1f").multiplyScalar(2.4 + 0.7 * Math.sin(time * 2.2));
  });

  const paint = (id: number, color: THREE.Color) => {
    const m = mesh.current!;
    m.setColorAt(id, color);
    m.instanceColor!.needsUpdate = true;
  };

  const move = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    const id = e.instanceId ?? -1;
    if (id !== hovered.current) {
      if (hovered.current >= 0) paint(hovered.current, baseColors[hovered.current]);
      hovered.current = id;
      if (id >= 0) paint(id, new THREE.Color("#ece7db"));
    }
    onHover(id >= 0 ? id : null, e.clientX, e.clientY);
  };
  const out = () => {
    if (hovered.current >= 0) paint(hovered.current, baseColors[hovered.current]);
    hovered.current = -1;
    onHover(null, 0, 0);
  };

  return (
    <>
      <instancedMesh ref={mesh} args={[undefined, undefined, towers.length]} onPointerMove={move} onPointerOut={out}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial roughness={0.55} metalness={0.25} />
      </instancedMesh>
      <instancedMesh ref={beacons} args={[undefined, undefined, litIdx.length]} raycast={() => null}>
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial toneMapped={false} />
      </instancedMesh>
    </>
  );
}

/** Camera: idle drift + mouse parallax + a dolly-in intro + scroll-driven fly-through. */
function Rig() {
  const { camera, pointer } = useThree();
  const p = useRef(0);
  const look = useMemo(() => new THREE.Vector3(), []);

  useFrame(({ clock }, dt) => {
    const t = clock.elapsedTime;
    p.current += (scrollState.progress - p.current) * Math.min(1, dt * 3);
    const e = p.current * p.current * (3 - 2 * p.current);
    const intro = (1 - Math.min(1, t / 2.8)) ** 3 * 8;
    const f = Math.min(1, dt * 2);

    const tx = pointer.x * 1.8 + Math.sin(t * 0.25) * 0.6;
    const ty = THREE.MathUtils.lerp(9.5, 3.4, e) + pointer.y * 0.5 + Math.sin(t * 0.3) * 0.15;
    const tz = THREE.MathUtils.lerp(23, 4, e) + intro;
    camera.position.x += (tx - camera.position.x) * f;
    camera.position.y += (ty - camera.position.y) * f;
    camera.position.z += (tz - camera.position.z) * f;

    look.set(pointer.x * 0.8, THREE.MathUtils.lerp(1.6, 2.2, e), THREE.MathUtils.lerp(-6, -18, e));
    camera.lookAt(look);
  });
  return null;
}

export default function CityScene({ onHover }: { onHover: HoverFn }) {
  return (
    <Canvas
      dpr={[1, 1.75]}
      camera={{ position: [0, 9.5, 32], fov: 36, near: 0.1, far: 100 }}
      gl={{ antialias: false, powerPreference: "high-performance" }}
    >
      <color attach="background" args={["#07080b"]} />
      <fog attach="fog" args={["#07080b", 26, 62]} />
      <ambientLight intensity={0.5} color="#8ea0c0" />
      <directionalLight position={[-8, 12, 6]} intensity={2.4} color="#f3e6cf" />
      <directionalLight position={[8, 5, -22]} intensity={1.1} color="#ff5a1f" />

      <Grid
        position={[0, 0, -10]}
        args={[90, 90]}
        cellSize={SPACING}
        cellThickness={0.7}
        cellColor="#252c3a"
        sectionSize={SPACING * 5}
        sectionThickness={1}
        sectionColor="#3a2a24"
        fadeDistance={60}
        fadeStrength={1.6}
      />

      <Skyline onHover={onHover} />
      <Rig />

      <EffectComposer multisampling={4}>
        <Bloom mipmapBlur luminanceThreshold={1} intensity={1.15} radius={0.7} />
        <Vignette eskil={false} offset={0.2} darkness={0.85} />
      </EffectComposer>
    </Canvas>
  );
}
