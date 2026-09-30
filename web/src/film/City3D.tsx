import { useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Bloom, EffectComposer, Vignette } from "@react-three/postprocessing";
import * as THREE from "three";
import { CityLights, Skyline } from "@/components/CityScene";
import CityLife from "@/components/CityLife";
import { FPS, H, W } from "./kit";

/**
 * The real 3D city inside a film scene: the same 350 towers as the site, rising on the film's timeline.
 * It stays live while the film plays, so the viewer can move the mouse to look around and hover a
 * tower to pick out a unit.
 */

type Shot = { frame: number; start: number };

/** Slow fly-in and orbit driven by the film frame, plus mouse parallax. */
function Rig({ shot }: { shot: React.RefObject<Shot> }) {
  const { camera, pointer } = useThree();
  const look = useMemo(() => new THREE.Vector3(), []);
  useFrame((_, dt) => {
    const { frame, start } = shot.current;
    const t = frame / FPS;
    const risen = Math.min(1, Math.max(0, (frame - start) / (FPS * 4)));
    const e = risen * risen * (3 - 2 * risen);
    // a full circle around the city over the chapter
    const angle = -0.32 + t * 0.18 + pointer.x * 0.12;
    const radius = THREE.MathUtils.lerp(36, 25, e);
    const f = Math.min(1, dt * 3);
    camera.position.x += (Math.sin(angle) * radius - camera.position.x) * f;
    camera.position.y += (THREE.MathUtils.lerp(11, 7.8, e) + pointer.y * 1.2 - camera.position.y) * f;
    camera.position.z += (-7 + Math.cos(angle) * radius - camera.position.z) * f;
    look.set(pointer.x * 1.2, 4.2, -9);
    camera.lookAt(look);
  });
  return null;
}

export function City3D({ frame, start, onHover }: { frame: number; start: number; onHover: (unit: number | null) => void }) {
  const shot = useRef<Shot>({ frame, start });
  shot.current = { frame, start };
  return (
    <Canvas
      dpr={1}
      // the Player scales the film with a CSS transform; measure the unscaled box so the canvas fills the frame
      resize={{ offsetSize: true }}
      camera={{ position: [-11, 12, 27], fov: 36, near: 0.1, far: 220 }}
      gl={{ antialias: true, powerPreference: "high-performance" }}
      style={{ position: "absolute", left: 0, top: 0, width: W, height: H }}
    >
      <CityLights />
      <CityLife />
      <Skyline onHover={(unit) => onHover(unit)} time={() => Math.max(0, (shot.current.frame - shot.current.start) / FPS)} />
      <Rig shot={shot} />
      <EffectComposer multisampling={4}>
        <Bloom mipmapBlur luminanceThreshold={1} intensity={0.95} radius={0.7} />
        <Vignette eskil={false} offset={0.2} darkness={0.8} />
      </EffectComposer>
    </Canvas>
  );
}
