import { useLayoutEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Bloom, EffectComposer, Vignette } from "@react-three/postprocessing";
import * as THREE from "three";
import { CityLights, useCityMaterial } from "@/components/CityScene";
import CityLife from "@/components/CityLife";
import { H, W } from "./kit";

/**
 * The Education film's buildings, in the same 3D style as the city: one tower per qualification, on a plaza
 * by a road with traffic and streetlights. Finished qualifications are lit glass towers with a beacon.
 * Unfinished ones are bare concrete floors in scaffolding, with a working crane, inside a ghost outline of
 * the finished building. The camera moves in on whichever qualification is being explained.
 */

export type Tower = { x: number; w: number; h: number; tiers: number; built: number; at: number };
type Live = { frame: number; towers: Tower[]; focus: number | null };

const RISE = 45;
const TIER = [[1], [0.7, 0.3], [0.55, 0.28, 0.17]];
const SHRINK = [1, 0.74, 0.52];

const topAt = (t: Tower, frame: number) => {
  const k = Math.min(1, Math.max(0, (frame - t.at) / RISE));
  return t.h * t.built * (1 - (1 - k) ** 3);
};

type Part = { ti: number; y0: number; h: number; w: number };

function partsOf(towers: Tower[], done: boolean): Part[] {
  return towers.flatMap((t, ti) => {
    if ((t.built === 1) !== done) return [];
    let y = 0;
    return TIER[t.tiers - 1].map((f, k) => {
      const p = { ti, y0: y, h: t.h * f, w: t.w * SHRINK[k] };
      y += t.h * f;
      return p;
    });
  });
}

/** Instanced tiers; parts above the current height are squashed away, so a tower rises floor by floor. */
function useRising(live: React.RefObject<Live>, parts: Part[], mesh: React.RefObject<THREE.InstancedMesh | null>) {
  const dummy = useMemo(() => new THREE.Object3D(), []);
  useFrame(() => {
    const m = mesh.current;
    if (!m) return;
    const { frame, towers } = live.current;
    parts.forEach((p, i) => {
      const t = towers[p.ti];
      const h = Math.max(0.0001, Math.min(p.h, topAt(t, frame) - p.y0));
      dummy.position.set(t.x, p.y0 + h / 2, 0);
      dummy.scale.set(p.w, h, p.w);
      dummy.updateMatrix();
      m.setMatrixAt(i, dummy.matrix);
    });
    m.instanceMatrix.needsUpdate = true;
  });
}

function Finished({ live }: { live: React.RefObject<Live> }) {
  const { material, uTime } = useCityMaterial();
  const mesh = useRef<THREE.InstancedMesh>(null);
  const parts = useMemo(() => partsOf(live.current.towers, true), [live]);
  useLayoutEffect(() => {
    const m = mesh.current!;
    parts.forEach((_, i) => m.setColorAt(i, new THREE.Color().setHSL(0.6 + i * 0.01, 0.3, 0.1)));
    m.instanceColor!.needsUpdate = true;
  }, [parts]);
  useFrame(({ clock }) => (uTime.value = clock.elapsedTime));
  useRising(live, parts, mesh);
  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, parts.length]} material={material} frustumCulled={false}>
      <boxGeometry args={[1, 1, 1]} />
    </instancedMesh>
  );
}

/** Bare concrete for the floors still being built: no glass and no lights yet. */
function Unfinished({ live }: { live: React.RefObject<Live> }) {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const parts = useMemo(() => partsOf(live.current.towers, false), [live]);
  useRising(live, parts, mesh);
  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, Math.max(1, parts.length)]} frustumCulled={false}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#6d7180" roughness={0.95} />
    </instancedMesh>
  );
}

const CRANE = [2.2, 0.7, 0.25] as const;

/** Ghost outline of the finished building, scaffolding around the built floors, and a crane working on top. */
function Site({ t, live }: { t: Tower; live: React.RefObject<Live> }) {
  const site = useRef<THREE.Group>(null);
  const scaffold = useRef<THREE.LineSegments>(null);
  const crane = useRef<THREE.Group>(null);
  const hook = useRef<THREE.Group>(null);
  const edges = useMemo(() => new THREE.EdgesGeometry(new THREE.BoxGeometry(t.w, t.h, t.w)), [t]);
  const frameGeo = useMemo(() => {
    // a cage of poles and ledgers, one ledger per floor
    const g = new THREE.BoxGeometry(t.w + 0.3, 1, t.w + 0.3, 4, 10, 4);
    return new THREE.WireframeGeometry(g);
  }, [t]);
  useFrame(({ clock }) => {
    const { frame } = live.current;
    // the site only appears when its qualification comes up in the narration
    if (site.current) site.current.visible = frame >= t.at;
    const top = topAt(t, frame);
    if (scaffold.current) {
      scaffold.current.scale.set(1, Math.max(0.001, top), 1);
      scaffold.current.position.y = top / 2;
    }
    crane.current?.position.set(t.x + t.w / 2 - 0.15, top, t.w / 2 - 0.15);
    crane.current?.scale.setScalar(Math.max(0.001, Math.min(1, (frame - t.at - 20) / 15)));
    if (crane.current) crane.current.rotation.y = Math.PI * 0.75 + Math.sin(clock.elapsedTime * 0.3 + t.x) * 0.35;
    if (hook.current) hook.current.position.y = 1.4 + Math.sin(clock.elapsedTime * 1.4 + t.x) * 0.4;
  });
  return (
    <group ref={site}>
      <lineSegments geometry={edges} position={[t.x, t.h / 2, 0]}>
        <lineBasicMaterial color="#9aa3ad" transparent opacity={0.5} />
      </lineSegments>
      <lineSegments ref={scaffold} geometry={frameGeo} position={[t.x, 0, 0]}>
        <lineBasicMaterial color="#c9a25a" transparent opacity={0.75} />
      </lineSegments>
      {/* a tower crane: mast, counter-jib and jib swinging over the building, hook on a cable */}
      <group ref={crane}>
        <mesh position={[0, 1.4, 0]} scale={[0.1, 2.8, 0.1]}>
          <boxGeometry />
          <meshBasicMaterial color={CRANE} toneMapped={false} />
        </mesh>
        <mesh position={[1.1, 2.8, 0]} scale={[3.2, 0.08, 0.08]}>
          <boxGeometry />
          <meshBasicMaterial color={CRANE} toneMapped={false} />
        </mesh>
        <mesh position={[-0.55, 2.8, 0]} scale={[1.1, 0.08, 0.08]}>
          <boxGeometry />
          <meshBasicMaterial color={CRANE} toneMapped={false} />
        </mesh>
        <mesh position={[-0.9, 2.62, 0]} scale={[0.34, 0.3, 0.3]}>
          <boxGeometry />
          <meshStandardMaterial color="#3a3d46" />
        </mesh>
        <group ref={hook} position={[2.2, 1.4, 0]}>
          <mesh position={[0, 0.7, 0]} scale={[0.02, 1.4, 0.02]}>
            <boxGeometry />
            <meshBasicMaterial color="#ece7db" />
          </mesh>
          <mesh scale={[0.5, 0.18, 0.5]}>
            <boxGeometry />
            <meshStandardMaterial color="#8a6a3a" />
          </mesh>
        </group>
        <mesh position={[0, 3.05, 0]} scale={0.1}>
          <boxGeometry />
          <meshBasicMaterial color={[4, 0.4, 0.3]} toneMapped={false} />
        </mesh>
      </group>
    </group>
  );
}

/** Beacon on a finished tower. */
function Beacon({ t, live }: { t: Tower; live: React.RefObject<Live> }) {
  const mesh = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    const done = live.current.frame - t.at > RISE;
    if (!mesh.current) return;
    mesh.current.visible = done;
    mesh.current.scale.setScalar(0.22 + Math.sin(clock.elapsedTime * 2.2) * 0.03);
  });
  return (
    <mesh ref={mesh} position={[t.x, t.h + 0.12, 0]}>
      <boxGeometry />
      <meshBasicMaterial color={[4, 1.2, 0.4]} toneMapped={false} />
    </mesh>
  );
}

const ROAD_Z = 4;

/** The plaza, the road in front with traffic both ways, and streetlights. */
function Street() {
  const cars = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const fleet = useMemo(() => Array.from({ length: 16 }, (_, i) => ({ dir: i % 2 ? 1 : -1, off: (i * 7.3) % 60, v: 2 + (i % 5) * 0.5 })), []);
  const white = useMemo(() => new THREE.Color(3.2, 2.9, 2.2), []);
  const red = useMemo(() => new THREE.Color(3.2, 0.35, 0.2), []);
  useLayoutEffect(() => {
    const m = cars.current!;
    fleet.forEach((c, i) => m.setColorAt(i, c.dir > 0 ? white : red));
    m.instanceColor!.needsUpdate = true;
  }, [fleet, white, red]);
  useFrame(({ clock }) => {
    const m = cars.current;
    if (!m) return;
    fleet.forEach((c, i) => {
      const x = ((((c.off + clock.elapsedTime * c.v * c.dir) % 60) + 60) % 60) - 30;
      dummy.position.set(x, 0.06, ROAD_Z + (c.dir > 0 ? 0.35 : -0.35));
      dummy.scale.set(0.34, 0.06, 0.12);
      dummy.updateMatrix();
      m.setMatrixAt(i, dummy.matrix);
    });
    m.instanceMatrix.needsUpdate = true;
  });
  return (
    <>
      <mesh rotation-x={-Math.PI / 2} position={[0, 0.002, 1]}>
        <planeGeometry args={[70, 16]} />
        <meshStandardMaterial color="#12141c" roughness={0.9} />
      </mesh>
      <mesh rotation-x={-Math.PI / 2} position={[0, 0.004, ROAD_Z]}>
        <planeGeometry args={[70, 1.6]} />
        <meshStandardMaterial color="#07080c" roughness={0.6} />
      </mesh>
      {Array.from({ length: 30 }, (_, i) => (
        <mesh key={i} rotation-x={-Math.PI / 2} position={[-29 + i * 2, 0.006, ROAD_Z]}>
          <planeGeometry args={[0.8, 0.05]} />
          <meshBasicMaterial color="#8a8f99" />
        </mesh>
      ))}
      {Array.from({ length: 11 }, (_, i) => (
        <group key={i} position={[-20 + i * 4, 0, ROAD_Z + 1.1]}>
          <mesh position={[0, 0.6, 0]} scale={[0.05, 1.2, 0.05]}>
            <boxGeometry />
            <meshStandardMaterial color="#2a2d36" />
          </mesh>
          <mesh position={[0, 1.22, 0]} scale={[0.22, 0.06, 0.12]}>
            <boxGeometry />
            <meshBasicMaterial color={[3, 1.8, 0.8]} toneMapped={false} />
          </mesh>
        </group>
      ))}
      <instancedMesh ref={cars} args={[undefined, undefined, fleet.length]} frustumCulled={false}>
        <boxGeometry />
        <meshBasicMaterial toneMapped={false} />
      </instancedMesh>
    </>
  );
}

/** Overview of all five towers, or a closer shot of the one being explained. */
function Rig({ live }: { live: React.RefObject<Live> }) {
  const { camera, pointer } = useThree();
  const pos = useMemo(() => new THREE.Vector3(0, 5.5, 24), []);
  const look = useMemo(() => new THREE.Vector3(0, 4.5, 0), []);
  const aim = useMemo(() => new THREE.Vector3(), []);
  useFrame(({ clock }, dt) => {
    const t = clock.elapsedTime;
    const fx = live.current.focus;
    const k = Math.min(1, dt * 1.6);
    if (fx === null) {
      pos.lerp(aim.set(Math.sin(t * 0.15) * 0.6 + pointer.x * 0.8, 5.5 + pointer.y * 0.4, 24), k);
      look.lerp(aim.set(0, 4.5, 0), k);
    } else {
      pos.lerp(aim.set(fx * 0.8 - 2.4 + pointer.x * 0.6, 4.4 + pointer.y * 0.3, 14), k);
      look.lerp(aim.set(fx, 3.3, 0), k);
    }
    camera.position.copy(pos);
    camera.lookAt(look);
  });
  return null;
}

export function Foundations3D({ frame, towers, focus }: { frame: number; towers: Tower[]; focus: number | null }) {
  const live = useRef<Live>({ frame, towers, focus });
  live.current = { frame, towers, focus };
  return (
    <Canvas
      dpr={1}
      resize={{ offsetSize: true }}
      camera={{ position: [0, 5.5, 24], fov: 36, near: 0.1, far: 220 }}
      gl={{ antialias: true }}
      style={{ position: "absolute", left: 0, top: 0, width: W, height: H }}
    >
      <CityLights />
      <CityLife streets={false} />
      <Street />
      <Finished live={live} />
      <Unfinished live={live} />
      {towers.map((t) => (t.built < 1 ? <Site key={t.x} t={t} live={live} /> : <Beacon key={t.x} t={t} live={live} />))}
      <Rig live={live} />
      <EffectComposer multisampling={4}>
        <Bloom mipmapBlur luminanceThreshold={1} intensity={0.95} radius={0.7} />
        <Vignette eskil={false} offset={0.2} darkness={0.7} />
      </EffectComposer>
    </Canvas>
  );
}
