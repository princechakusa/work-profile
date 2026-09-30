"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import { Bloom, EffectComposer, Vignette } from "@react-three/postprocessing";
import * as THREE from "three";
import { scrollState } from "@/lib/scrollState";
import { pulseState } from "@/lib/pulseState";
import { COLS, ROWS, SPACING } from "@/lib/cityGrid";
import CityLife from "./CityLife";

export type HoverFn = (unit: number | null, x: number, y: number) => void;

const RISE = 1.5;
const PULSE_SPEED = 9;
const PULSE_LIFE = 4.5;

function rng(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type Tower = { x: number; z: number; w: number; d: number; h: number; delay: number; lit: boolean; tone: number; spire: boolean };
/** A tower is 1-3 stacked, narrowing tiers (setbacks) plus an optional needle spire. */
type Part = { tower: number; y0: number; h: number; w: number; d: number };

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
    const h = 0.7 + r() ** 2 * 3 + downtown * 4.2 + (spire ? 7 + r() * 3 : 0);
    return {
      x, z, h, spire,
      w: 0.8 + r() * 0.3,
      d: 0.8 + r() * 0.3,
      delay: 0.2 + Math.hypot(x * 0.35, (z + 7) * 0.5) * 0.12 + r() * 0.35,
      lit: spire || r() < 0.14,
      tone: r(),
    };
  });
}

function buildParts(towers: Tower[]) {
  const parts: Part[] = [];
  towers.forEach((t, i) => {
    const tiers = t.h > 7 ? 3 : t.h > 4 ? 2 : 1;
    const frac = tiers === 3 ? [0.55, 0.28, 0.17] : tiers === 2 ? [0.7, 0.3] : [1];
    const shrink = [1, 0.72, 0.5];
    let y = 0;
    frac.forEach((f, k) => {
      parts.push({ tower: i, y0: y, h: t.h * f, w: t.w * shrink[k], d: t.d * shrink[k] });
      y += t.h * f;
    });
    if (t.spire) parts.push({ tower: i, y0: t.h, h: 3, w: 0.09, d: 0.09 });
  });
  return parts;
}

const topOf = (t: Tower) => t.h + (t.spire ? 3 : 0);

const eased = (t: Tower, time: number, reduce: boolean) => {
  const k = reduce ? 1 : Math.min(1, Math.max(0, (time - t.delay) / RISE));
  return { k, e: 1 - (1 - k) ** 3 };
};

/**
 * Standard material + procedural glass facades (no textures needed): most windows lit, each building
 * with its own light colour, and some towers carrying corner light strips and a glowing crown.
 */
export function useCityMaterial() {
  const uTime = useMemo(() => ({ value: 0 }), []);
  const material = useMemo(() => {
    const m = new THREE.MeshStandardMaterial({ roughness: 0.42, metalness: 0.35 });
    m.onBeforeCompile = (sh) => {
      sh.uniforms.uTime = uTime;
      sh.vertexShader = sh.vertexShader
        .replace("#include <common>", "#include <common>\nvarying vec3 vWPos;\nvarying vec3 vWN;\nvarying vec2 vSeed;\nvarying vec3 vLocal;")
        .replace(
          "#include <begin_vertex>",
          `#include <begin_vertex>
           mat4 iM = modelMatrix * instanceMatrix;
           vWPos = (iM * vec4(transformed, 1.0)).xyz;
           vWN = normalize(mat3(iM) * normal);
           vSeed = instanceMatrix[3].xz;
           vLocal = position;`,
        );
      sh.fragmentShader = sh.fragmentShader
        .replace(
          "#include <common>",
          `#include <common>
           uniform float uTime;
           varying vec3 vWPos;
           varying vec3 vWN;
           varying vec2 vSeed;
           varying vec3 vLocal;
           float h21(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }`,
        )
        .replace(
          "#include <emissivemap_fragment>",
          `#include <emissivemap_fragment>
           float side = 1.0 - step(0.5, abs(vWN.y));
           float along = abs(vWN.x) > 0.5 ? vWPos.z : vWPos.x;
           vec2 cell = vec2(along * 4.6, vWPos.y * 5.2);
           vec2 cid = floor(cell);
           vec2 f = fract(cell);
           float win = step(0.2, f.x) * step(f.x, 0.8) * step(0.3, f.y) * step(f.y, 0.74);
           float r = h21(cid + floor(vSeed * 3.0) + vec2(vWN.x * 7.0, vWN.z * 3.0));
           float on = step(0.46, r) * (0.8 + 0.2 * sin(uTime * 0.8 + r * 40.0));
           float bld = h21(floor(vSeed * 3.0) + 17.0);
           vec3 tint = bld < 0.45 ? vec3(1.0, 0.76, 0.46) : bld < 0.7 ? vec3(0.78, 0.88, 1.0) : bld < 0.86 ? vec3(0.45, 0.9, 0.95) : vec3(1.0, 0.68, 0.22);
           vec3 warm = mix(tint, vec3(1.0, 0.9, 0.75), step(0.85, r) * 0.6);
           totalEmissiveRadiance += warm * win * on * side * (0.35 + r * 0.75) * smoothstep(0.1, 0.5, vWPos.y);
           // landmark towers: light strips down the corners and a glowing crown
           float across = abs(vWN.x) > 0.5 ? vLocal.z : vLocal.x;
           float landmark = step(0.86, h21(floor(vSeed * 3.0) + 5.0));
           vec3 accent = bld < 0.5 ? vec3(1.0, 0.72, 0.2) : bld < 0.8 ? vec3(0.3, 0.8, 1.0) : vec3(0.85, 0.35, 1.0);
           float strip = step(0.47, abs(across)) * side;
           float crown = step(0.47, vLocal.y) * side;
           totalEmissiveRadiance += accent * landmark * (strip * 1.2 + crown * 1.8) * smoothstep(0.2, 0.8, vWPos.y);`,
        );
    };
    return m;
  }, [uTime]);
  return { material, uTime };
}

/**
 * The 350 towers. By default they run on the canvas clock; pass `time` to drive the rise from outside
 * (the films do this so the city follows the narration and can be scrubbed backwards).
 */
export function Skyline({ onHover, time: timeFn }: { onHover: HoverFn; time?: () => number }) {
  const towers = useMemo(buildCity, []);
  const parts = useMemo(() => buildParts(towers), [towers]);
  const byTower = useMemo(() => {
    const map: number[][] = towers.map(() => []);
    parts.forEach((p, i) => map[p.tower].push(i));
    return map;
  }, [towers, parts]);
  const litIdx = useMemo(() => towers.flatMap((t, i) => (t.lit ? [i] : [])), [towers]);
  const baseColors = useMemo(
    () => towers.map((t) => new THREE.Color().setHSL(0.6 + t.tone * 0.06, 0.3, 0.07 + t.tone * 0.06)),
    [towers],
  );
  const { material, uTime } = useCityMaterial();
  const mesh = useRef<THREE.InstancedMesh>(null);
  const beacons = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const hovered = useRef(-1);
  const settled = useRef(false);
  const wasPulsing = useRef(false);
  const reduce = useMemo(() => window.matchMedia("(prefers-reduced-motion: reduce)").matches, []);

  const setPartColors = (tower: number, color: THREE.Color) => {
    const m = mesh.current!;
    byTower[tower].forEach((pi) => m.setColorAt(pi, color));
    m.instanceColor!.needsUpdate = true;
  };

  useEffect(() => {
    const m = mesh.current!;
    parts.forEach((p, i) => m.setColorAt(i, baseColors[p.tower]));
    m.instanceColor!.needsUpdate = true;
  }, [parts, baseColors]);

  useFrame(({ clock }) => {
    const m = mesh.current;
    const b = beacons.current;
    if (!m || !b) return;
    const time = timeFn ? timeFn() : clock.elapsedTime;
    uTime.value = clock.elapsedTime;

    const pulseAge = time - pulseState.t0;
    const pulsing = pulseAge >= 0 && pulseAge < PULSE_LIFE;
    const needs = !!timeFn || !settled.current || pulsing || wasPulsing.current;

    if (needs) {
      let done = true;
      const mult = towers.map((t) => {
        if (!pulsing) return 1;
        const d = Math.hypot(t.x - pulseState.x, t.z - pulseState.z);
        const front = PULSE_SPEED * pulseAge;
        return 1 + 1.1 * Math.exp(-((d - front) ** 2) / 5) * Math.exp(-pulseAge * 0.55);
      });
      towers.forEach((t) => {
        if (eased(t, time, reduce).k < 1) done = false;
      });

      parts.forEach((p, i) => {
        const t = towers[p.tower];
        const s = eased(t, time, reduce).e * mult[p.tower];
        const h = Math.max(0.001, p.h * s);
        dummy.position.set(t.x, p.y0 * s + h / 2, t.z);
        dummy.scale.set(p.w, h, p.d);
        dummy.updateMatrix();
        m.setMatrixAt(i, dummy.matrix);
      });
      litIdx.forEach((ti, bi) => {
        const t = towers[ti];
        const s = eased(t, time, reduce).e * mult[ti];
        dummy.position.set(t.x, topOf(t) * s + 0.04, t.z);
        const bw = t.spire ? 0.22 : t.w * 0.4;
        dummy.scale.set(bw * s + 0.0001, 0.08, bw * s + 0.0001);
        dummy.updateMatrix();
        b.setMatrixAt(bi, dummy.matrix);
      });
      m.instanceMatrix.needsUpdate = true;
      b.instanceMatrix.needsUpdate = true;
      settled.current = done;
      wasPulsing.current = pulsing;
    }

    (b.material as THREE.MeshBasicMaterial).color
      .set("#ff5a1f")
      .multiplyScalar(2.4 + 0.7 * Math.sin(clock.elapsedTime * 2.2) + (pulsing ? 1.4 * Math.exp(-pulseAge) : 0));
  });

  const move = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    const id = e.instanceId ?? -1;
    const tower = id >= 0 ? parts[id].tower : -1;
    if (tower !== hovered.current) {
      if (hovered.current >= 0) setPartColors(hovered.current, baseColors[hovered.current]);
      hovered.current = tower;
      if (tower >= 0) setPartColors(tower, new THREE.Color("#ece7db"));
    }
    onHover(tower >= 0 ? tower : null, e.clientX, e.clientY);
  };
  const out = () => {
    if (hovered.current >= 0) setPartColors(hovered.current, baseColors[hovered.current]);
    hovered.current = -1;
    onHover(null, 0, 0);
  };

  return (
    <>
      <instancedMesh
        ref={mesh}
        args={[undefined, undefined, parts.length]}
        material={material}
        onPointerMove={move}
        onPointerOut={out}
      >
        <boxGeometry args={[1, 1, 1]} />
      </instancedMesh>
      <instancedMesh ref={beacons} args={[undefined, undefined, litIdx.length]} raycast={() => null}>
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial toneMapped={false} />
      </instancedMesh>
    </>
  );
}

/** Drag state shared by the camera rig and the click shockwave (a drag is not a click). */
const spin = { dragging: false, lastX: 0, startX: 0, startY: 0, theta: 0 };

/** Click anywhere (not on a link) to send a shockwave through the city from that ground point. */
function PulseListener() {
  const { camera, gl, clock } = useThree();
  useEffect(() => {
    const ray = new THREE.Raycaster();
    const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
    const hit = new THREE.Vector3();
    const up = (e: PointerEvent) => {
      if ((e.target as HTMLElement).closest("a, button, [data-nocursor]")) return;
      if (Math.hypot(e.clientX - spin.startX, e.clientY - spin.startY) > 6) return;
      const r = gl.domElement.getBoundingClientRect();
      ray.setFromCamera(new THREE.Vector2(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1), camera);
      if (ray.ray.intersectPlane(plane, hit)) {
        pulseState.x = hit.x;
        pulseState.z = hit.z;
        pulseState.t0 = clock.elapsedTime;
      }
    };
    window.addEventListener("pointerup", up);
    return () => window.removeEventListener("pointerup", up);
  }, [camera, gl, clock]);
  return null;
}

/** Drag anywhere outside links and films to turn the whole city around its centre. */
function SpinListener() {
  useEffect(() => {
    const down = (e: PointerEvent) => {
      if ((e.target as HTMLElement).closest("a, button, [data-nocursor]")) return;
      spin.dragging = true;
      spin.lastX = spin.startX = e.clientX;
      spin.startY = e.clientY;
    };
    const move = (e: PointerEvent) => {
      if (!spin.dragging) return;
      spin.theta -= (e.clientX - spin.lastX) * 0.006;
      spin.lastX = e.clientX;
    };
    const up = () => (spin.dragging = false);
    window.addEventListener("pointerdown", down);
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    return () => {
      window.removeEventListener("pointerdown", down);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
  }, []);
  return null;
}

const CENTRE_Z = -8;

/** Camera: idle drift + mouse parallax + a dolly-in intro + scroll-driven fly-through, turned by the 360 spin. */
function Rig() {
  const { camera, pointer } = useThree();
  const p = useRef(0);
  const angle = useRef(0);
  const look = useMemo(() => new THREE.Vector3(), []);

  useFrame(({ clock }, dt) => {
    const t = clock.elapsedTime;
    p.current += (scrollState.progress - p.current) * Math.min(1, dt * 3);
    const e = p.current * p.current * (3 - 2 * p.current);
    const intro = (1 - Math.min(1, t / 2.8)) ** 3 * 8;
    const f = Math.min(1, dt * 2);

    if (!spin.dragging) spin.theta += dt * 0.03;
    // turning fades out as the camera flies down into the streets, so it never swings into a tower
    angle.current += (spin.theta * (1 - e) - angle.current) * Math.min(1, dt * 4);
    const cos = Math.cos(angle.current), sin = Math.sin(angle.current);
    const turn = (x: number, z: number): [number, number] => [x * cos + (z - CENTRE_Z) * sin, CENTRE_Z - x * sin + (z - CENTRE_Z) * cos];

    const [tx, tz] = turn(pointer.x * 1.8 + Math.sin(t * 0.25) * 0.6, THREE.MathUtils.lerp(23, 4, e) + intro);
    const ty = THREE.MathUtils.lerp(8.6, 3.2, e) + pointer.y * 0.5 + Math.sin(t * 0.3) * 0.15;
    camera.position.x += (tx - camera.position.x) * f;
    camera.position.y += (ty - camera.position.y) * f;
    camera.position.z += (tz - camera.position.z) * f;

    const [lx, lz] = turn(pointer.x * 0.8, THREE.MathUtils.lerp(-10, -20, e));
    look.set(lx, THREE.MathUtils.lerp(4.4, 3.2, e), lz);
    camera.lookAt(look);
  });
  return null;
}

/** Dusk lighting shared by the site and the film: cool sky fill, warm sunset from behind the skyline, haze. */
export function CityLights() {
  return (
    <>
      <color attach="background" args={["#0b0a18"]} />
      <fog attach="fog" args={["#2a1d38", 40, 170]} />
      <hemisphereLight args={["#6a5ea6", "#120e18", 0.8]} />
      <directionalLight position={[-10, 14, 12]} intensity={0.9} color="#aab8ff" />
      <directionalLight position={[4, 6, -40]} intensity={1.7} color="#ff9468" />
    </>
  );
}

export default function CityScene({ onHover }: { onHover: HoverFn }) {
  // phones and small screens render fewer pixels and skip the extra anti-aliasing pass
  const [light] = useState(() => typeof window !== "undefined" && window.matchMedia("(pointer: coarse), (max-width: 900px)").matches);
  return (
    <Canvas
      dpr={light ? [1, 1.25] : [1, 1.75]}
      camera={{ position: [0, 8.6, 32], fov: 36, near: 0.1, far: 220 }}
      gl={{ antialias: false, powerPreference: "high-performance" }}
    >
      <CityLights />
      <CityLife />

      <Skyline onHover={onHover} />
      <Rig />
      <PulseListener />
      <SpinListener />

      <EffectComposer multisampling={light ? 0 : 4}>
        <Bloom mipmapBlur luminanceThreshold={1} intensity={0.95} radius={0.7} />
        <Vignette eskil={false} offset={0.2} darkness={0.85} />
      </EffectComposer>
    </Canvas>
  );
}
