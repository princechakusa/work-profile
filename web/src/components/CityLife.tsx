"use client";

import { useLayoutEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { COLS, ROWS, SPACING } from "@/lib/cityGrid";

/**
 * Everything around the towers that makes the city read as a real place at dusk: sky and clouds,
 * the harbour and far shore, streetlights, traffic, birds and aircraft.
 */

const NOISE = `
  float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float noise(vec2 p){
    vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
  }
  float fbm(vec2 p){ float v = 0.0, a = 0.5; for (int i = 0; i < 4; i++) { v += a * noise(p); p *= 2.03; a *= 0.5; } return v; }
`;

function rng(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// city bounds on the ground
const X0 = -((COLS - 1) / 2) * SPACING - 1.6;
const X1 = -X0;
const Z0 = 3 - (ROWS - 1) * SPACING - 1.6;
const Z1 = 3 + 1.6;

/** Dusk sky: deep blue overhead, a pink and orange band at the horizon behind the city, drifting clouds. */
function Sky() {
  const mesh = useRef<THREE.Mesh>(null);
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        side: THREE.BackSide, depthWrite: false, fog: false,
        uniforms: { uTime: { value: 0 } },
        vertexShader: `varying vec3 vDir; void main(){ vDir = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
        fragmentShader: `
          varying vec3 vDir; uniform float uTime;
          ${NOISE}
          void main(){
            float h = clamp(vDir.y, -0.1, 1.0);
            vec3 c = mix(vec3(0.98, 0.45, 0.34), vec3(0.34, 0.2, 0.42), smoothstep(0.0, 0.075, h));
            c = mix(c, vec3(0.035, 0.05, 0.14), smoothstep(0.04, 0.3, h));
            float sun = pow(max(dot(normalize(vDir.xz), vec2(0.0, -1.0)), 0.0), 3.0);
            c += vec3(0.4, 0.14, 0.03) * sun * (1.0 - smoothstep(0.0, 0.12, h));
            vec2 uv = vDir.xz / (vDir.y + 0.25) * 1.5 + vec2(uTime * 0.004, 0.0);
            float cloud = smoothstep(0.42, 0.74, fbm(uv));
            vec3 lit = mix(vec3(0.05, 0.05, 0.11), vec3(0.85, 0.36, 0.36), (1.0 - smoothstep(0.0, 0.16, h)) * 0.6);
            c = mix(c, lit, cloud * smoothstep(0.015, 0.1, h) * 0.9);
            gl_FragColor = vec4(c, 1.0);
          }`,
      }),
    [],
  );
  useFrame(({ clock, camera }) => {
    material.uniforms.uTime.value = clock.elapsedTime;
    mesh.current?.position.copy(camera.position);
  });
  return (
    <mesh ref={mesh} material={material} scale={85} renderOrder={-10}>
      <sphereGeometry args={[1, 32, 16]} />
    </mesh>
  );
}

/** The harbour: dark water that picks up the sunset towards the horizon, with slow ripples. */
function Water() {
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: { uTime: { value: 0 } },
        vertexShader: `varying vec3 vW; void main(){ vec4 w = modelMatrix * vec4(position, 1.0); vW = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }`,
        fragmentShader: `
          varying vec3 vW; uniform float uTime;
          ${NOISE}
          void main(){
            vec3 v = normalize(cameraPosition - vW);
            float fres = pow(1.0 - max(v.y, 0.0), 5.0);
            float rip = noise(vW.xz * vec2(0.5, 2.4) + vec2(uTime * 0.12, uTime * 0.05));
            vec3 c = mix(vec3(0.025, 0.045, 0.12), vec3(0.5, 0.26, 0.34), fres * (0.5 + 0.5 * rip));
            c += vec3(0.25, 0.3, 0.45) * smoothstep(0.82, 1.0, rip) * 0.12;
            gl_FragColor = vec4(c, 1.0);
          }`,
      }),
    [],
  );
  useFrame(({ clock }) => (material.uniforms.uTime.value = clock.elapsedTime));
  return (
    <>
      <mesh material={material} rotation-x={-Math.PI / 2} position={[0, -0.06, -40]}>
        <planeGeometry args={[420, 300]} />
      </mesh>
      {/* the land the city stands on, running towards the viewer */}
      <mesh rotation-x={-Math.PI / 2} position={[0, 0, (Z0 + 46) / 2]}>
        <planeGeometry args={[X1 - X0, 46 - Z0]} />
        <meshStandardMaterial color="#0b0d14" roughness={0.85} />
      </mesh>
    </>
  );
}

/** Hills and the glitter of another district across the water, with a few boats. */
function FarShore() {
  const lights = useRef<THREE.InstancedMesh>(null);
  const boats = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const hills = useMemo(() => {
    const r = rng(7);
    return Array.from({ length: 12 }, (_, i) => ({ x: -110 + i * 20 + r() * 10, z: -70 - r() * 14, w: 22 + r() * 18, h: 3 + r() * 5 }));
  }, []);
  const fleet = useMemo(() => {
    const r = rng(11);
    return Array.from({ length: 12 }, () => ({ x: -50 + r() * 100, z: -26 - r() * 24, v: (r() - 0.5) * 0.5 }));
  }, []);

  useLayoutEffect(() => {
    const m = lights.current!;
    const r = rng(23);
    const warm = new THREE.Color();
    for (let i = 0; i < m.count; i++) {
      dummy.position.set(-100 + r() * 200, 0.1 + r() ** 2 * 1.6, -58 - r() * 8);
      dummy.scale.setScalar(0.1 + r() * 0.14);
      dummy.updateMatrix();
      m.setMatrixAt(i, dummy.matrix);
      m.setColorAt(i, warm.setHSL(0.07 + r() * 0.08, 0.9, 0.6).multiplyScalar(1.6 + r()));
    }
    m.instanceMatrix.needsUpdate = true;
    m.instanceColor!.needsUpdate = true;
  }, [dummy]);

  useFrame(({ clock }) => {
    const b = boats.current;
    if (!b) return;
    fleet.forEach((boat, i) => {
      dummy.position.set(((boat.x + clock.elapsedTime * boat.v + 60) % 120) - 60, 0.02, boat.z);
      dummy.scale.set(0.35, 0.08, 0.12);
      dummy.updateMatrix();
      b.setMatrixAt(i, dummy.matrix);
    });
    b.instanceMatrix.needsUpdate = true;
  });

  return (
    <>
      {hills.map((h) => (
        <mesh key={h.x} position={[h.x, -0.2, h.z]} scale={[h.w, h.h, h.w * 0.4]}>
          <sphereGeometry args={[1, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshBasicMaterial color="#120f22" />
        </mesh>
      ))}
      <instancedMesh ref={lights} args={[undefined, undefined, 320]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial toneMapped={false} />
      </instancedMesh>
      <instancedMesh ref={boats} args={[undefined, undefined, fleet.length]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial color={[2.2, 2.2, 2.4]} toneMapped={false} />
      </instancedMesh>
    </>
  );
}

// streets run in the gaps between the rows and columns of towers
const laneZ = (r: number) => 3 - (r - 0.5) * SPACING;
const laneX = (c: number) => (c - 0.5 - (COLS - 1) / 2) * SPACING;

/** A warm lamp at every junction, which is what makes the street grid visible at night. */
function StreetLights() {
  const mesh = useRef<THREE.InstancedMesh>(null);
  useLayoutEffect(() => {
    const m = mesh.current!;
    const d = new THREE.Object3D();
    let i = 0;
    for (let r = 0; r <= ROWS; r++)
      for (let c = 0; c <= COLS; c++) {
        d.position.set(laneX(c), 0.1, laneZ(r));
        d.scale.set(0.07, 0.03, 0.07);
        d.updateMatrix();
        m.setMatrixAt(i++, d.matrix);
      }
    m.instanceMatrix.needsUpdate = true;
  }, []);
  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, (ROWS + 1) * (COLS + 1)]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshBasicMaterial color={[2.6, 1.5, 0.6]} toneMapped={false} />
    </instancedMesh>
  );
}

type Car = { alongX: boolean; lane: number; dir: number; speed: number; offset: number };

/** Headlights and tail lights moving through the streets, keeping to their side of the road. */
function Traffic({ count = 380 }: { count?: number }) {
  const white = useRef<THREE.InstancedMesh>(null);
  const red = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const cars = useMemo<Car[]>(() => {
    const r = rng(99);
    return Array.from({ length: count }, (_, i) => {
      const alongX = r() < 0.45;
      return { alongX, lane: Math.floor(r() * ((alongX ? ROWS : COLS) + 1)), dir: i % 2 ? 1 : -1, speed: 0.5 + r() * 1.3, offset: r() };
    });
  }, [count]);

  useFrame(({ clock }) => {
    const w = white.current, rd = red.current;
    if (!w || !rd) return;
    const t = clock.elapsedTime;
    let wi = 0, ri = 0;
    for (const car of cars) {
      const span = car.alongX ? X1 - X0 : Z1 - Z0;
      const p = ((((car.offset * span + t * car.speed * car.dir) % span) + span) % span);
      const side = car.dir * 0.085;
      if (car.alongX) {
        dummy.position.set(X0 + p, 0.035, laneZ(car.lane) + side);
        dummy.scale.set(0.2, 0.035, 0.055);
      } else {
        dummy.position.set(laneX(car.lane) - side, 0.035, Z0 + p);
        dummy.scale.set(0.055, 0.035, 0.2);
      }
      dummy.updateMatrix();
      // cars coming towards the viewer show headlights, the rest show tail lights
      if (car.dir > 0) w.setMatrixAt(wi++, dummy.matrix);
      else rd.setMatrixAt(ri++, dummy.matrix);
    }
    w.instanceMatrix.needsUpdate = true;
    rd.instanceMatrix.needsUpdate = true;
  });

  const half = Math.ceil(count / 2);
  return (
    <>
      <instancedMesh ref={white} args={[undefined, undefined, half]} frustumCulled={false}>
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial color={[3.2, 2.9, 2.2]} toneMapped={false} />
      </instancedMesh>
      <instancedMesh ref={red} args={[undefined, undefined, count - half]} frustumCulled={false}>
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial color={[3.2, 0.35, 0.2]} toneMapped={false} />
      </instancedMesh>
    </>
  );
}

const WING = (() => {
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.BufferAttribute(new Float32Array([-0.1, 0, 0, 0.12, 0, 0, -0.04, 0, 0.42]), 3));
  return g;
})();

/** A flock in loose V formation crossing above the rooftops, wings beating. */
function Flock({ count, y, z, speed, seed }: { count: number; y: number; z: number; speed: number; seed: number }) {
  const group = useRef<THREE.Group>(null);
  const birds = useMemo(() => {
    const r = rng(seed);
    return Array.from({ length: count }, (_, i) => {
      const k = i - (count - 1) / 2;
      return { x: -Math.abs(k) * 0.75 + r() * 0.3, y: r() * 0.5, z: k * 0.7 + r() * 0.3, beat: 7 + r() * 3, phase: r() * 6 };
    });
  }, [count, seed]);

  useFrame(({ clock }) => {
    const g = group.current;
    if (!g) return;
    const t = clock.elapsedTime;
    const span = 76;
    const p = ((((t * speed + seed * 9) % span) + span) % span) - span / 2;
    g.position.set(p, y + Math.sin(t * 0.35 + seed) * 0.6, z + Math.sin(t * 0.21 + seed) * 2);
    g.rotation.y = speed > 0 ? 0 : Math.PI;
    g.children.forEach((bird, i) => {
      const b = birds[i];
      const flap = Math.sin(t * b.beat + b.phase) * 0.75;
      bird.position.y = b.y + Math.sin(t * 1.3 + b.phase) * 0.12;
      bird.children[0].rotation.x = -flap;
      bird.children[1].rotation.x = flap;
    });
  });

  return (
    <group ref={group}>
      {birds.map((b, i) => (
        <group key={i} position={[b.x, b.y, b.z]} scale={0.62}>
          <mesh geometry={WING}>
            <meshBasicMaterial color="#c9c2c4" side={THREE.DoubleSide} />
          </mesh>
          <mesh geometry={WING} scale={[1, 1, -1]}>
            <meshBasicMaterial color="#c9c2c4" side={THREE.DoubleSide} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

/** An airliner crossing high behind the city and a helicopter circling it, both with blinking lights. */
function Aircraft() {
  const plane = useRef<THREE.Group>(null);
  const heli = useRef<THREE.Group>(null);
  const strobes = useRef<THREE.Mesh[]>([]);
  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    plane.current?.position.set(((t * 2.2) % 150) - 75, 19 + Math.sin(t * 0.1), -44);
    const a = t * 0.16;
    heli.current?.position.set(Math.sin(a) * 17, 11.5 + Math.sin(t * 0.5) * 0.4, -8 + Math.cos(a) * 11);
    if (heli.current) heli.current.rotation.y = a + Math.PI / 2;
    strobes.current.forEach((s, i) => (s.visible = (t * 1.4 + i * 0.37) % 1 < 0.16));
  });
  const strobe = (i: number) => (m: THREE.Mesh | null) => {
    if (m) strobes.current[i] = m;
  };
  return (
    <>
      <group ref={plane}>
        <mesh scale={[0.7, 0.07, 0.09]}>
          <boxGeometry />
          <meshBasicMaterial color="#1b1830" />
        </mesh>
        <mesh scale={[0.12, 0.03, 0.9]}>
          <boxGeometry />
          <meshBasicMaterial color="#1b1830" />
        </mesh>
        <mesh ref={strobe(0)} position={[0, 0.06, 0]} scale={0.1}>
          <boxGeometry />
          <meshBasicMaterial color={[4, 4, 4]} toneMapped={false} />
        </mesh>
        <mesh position={[0, 0, 0.45]} scale={0.07}>
          <boxGeometry />
          <meshBasicMaterial color={[3, 0.3, 0.2]} toneMapped={false} />
        </mesh>
        <mesh position={[0, 0, -0.45]} scale={0.07}>
          <boxGeometry />
          <meshBasicMaterial color={[0.3, 3, 0.6]} toneMapped={false} />
        </mesh>
      </group>
      <group ref={heli}>
        <mesh scale={[0.34, 0.14, 0.14]}>
          <boxGeometry />
          <meshBasicMaterial color="#1b1830" />
        </mesh>
        <mesh position={[-0.3, 0.03, 0]} scale={[0.34, 0.04, 0.04]}>
          <boxGeometry />
          <meshBasicMaterial color="#1b1830" />
        </mesh>
        <mesh ref={strobe(1)} position={[0, -0.1, 0]} scale={0.08}>
          <boxGeometry />
          <meshBasicMaterial color={[4, 1, 0.8]} toneMapped={false} />
        </mesh>
        <mesh position={[0.18, -0.04, 0]} scale={0.06}>
          <boxGeometry />
          <meshBasicMaterial color={[3.5, 3.3, 2.6]} toneMapped={false} />
        </mesh>
      </group>
    </>
  );
}

/** `streets` adds the street grid and traffic; scenes without the 350-tower grid leave it out. */
export default function CityLife({ streets = true }: { streets?: boolean }) {
  return (
    <>
      <Sky />
      <Water />
      <FarShore />
      {streets && <StreetLights />}
      {streets && <Traffic />}
      <Flock count={9} y={8.2} z={9} speed={1.7} seed={1} />
      <Flock count={7} y={12} z={-2} speed={-1.3} seed={2} />
      <Flock count={5} y={6.5} z={13} speed={2.3} seed={3} />
      <Aircraft />
    </>
  );
}
