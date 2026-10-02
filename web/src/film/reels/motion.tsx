import type { CSSProperties, ReactNode } from "react";
import { AbsoluteFill, Easing, OffthreadVideo, Sequence, interpolate, useCurrentFrame } from "remotion";

/**
 * Motion kit for the LinkedIn reels: every shot carries a camera move, and every cut is a motion-matched
 * transition. Pacing rule (Prince, 2026-10-02): dynamic and moderately fast, but each shot breathes for a moment;
 * no static scenes and no frantic cuts. Aim for a cut every 1.5 to 2.5 seconds.
 */

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const smooth = Easing.bezier(0.45, 0, 0.55, 1);
const snap = Easing.bezier(0.7, 0, 0.2, 1);

/** Frames each transition takes (about a third of a second): quick but readable. */
export const T = 10;

export type Cam = "zoomIn" | "zoomOut" | "panLeft" | "panRight" | "tiltUp" | "tiltDown" | "rotateIn" | "dolly" | "orbit";
export type Cut = "none" | "whip" | "zoom" | "spin" | "slideUp" | "flash" | "cross";

/** A camera move across the shot's life (p from 0 to 1). */
function camera(cam: Cam, p: number): string {
  switch (cam) {
    case "zoomIn": return `scale(${1.08 + 0.16 * p})`;
    case "zoomOut": return `scale(${1.26 - 0.16 * p})`;
    case "panLeft": return `scale(1.2) translateX(${4 - 8 * p}%)`;
    case "panRight": return `scale(1.2) translateX(${-4 + 8 * p}%)`;
    case "tiltUp": return `scale(1.2) translateY(${4 - 8 * p}%)`;
    case "tiltDown": return `scale(1.2) translateY(${-4 + 8 * p}%)`;
    case "rotateIn": return `scale(${1.3 - 0.12 * p}) rotate(${5 - 5 * p}deg)`;
    case "dolly": return `scale(${1.1 + 0.14 * p}) translateX(${-3 + 4 * p}%) rotate(${-1.2 + 1.2 * p}deg)`;
    case "orbit": return `perspective(1400px) rotateY(${-7 + 14 * p}deg) scale(1.24)`;
  }
}

/** How a shot leaves (q 0 to 1) and how the next one arrives (q 0 to 1) for each kind of cut. */
function cutStyle(cut: Cut, q: number, side: "in" | "out"): CSSProperties {
  const k = side === "in" ? 1 - q : q; // 0 at rest, 1 fully displaced
  switch (cut) {
    case "whip": return { transform: `translateX(${(side === "in" ? 1 : -1) * k * 70}%)`, filter: `blur(${k * 18}px)` };
    case "zoom": return side === "out" ? { transform: `scale(${1 + k * 0.8})`, filter: `blur(${k * 14}px)`, opacity: 1 - k } : { transform: `scale(${1 - k * 0.2})`, opacity: 1 - k };
    case "spin": return { transform: `rotate(${(side === "in" ? -1 : 1) * k * 14}deg) scale(${1 + k * 0.45})`, opacity: 1 - k * (side === "in" ? 1 : 0.6), filter: `blur(${k * 8}px)` };
    case "slideUp": return { transform: `translateY(${(side === "in" ? 1 : -1) * k * 100}%)`, filter: `blur(${k * 6}px)` };
    case "flash":
    case "cross": return { opacity: 1 - k };
    default: return {};
  }
}

export type ShotSpec = { src: string; from: number; to: number; cam: Cam; cut?: Cut; grade?: string; children?: ReactNode };

/**
 * Lays shots end to end. Shot i is on screen from `from` to `to`; its `cut` says how it arrives over the previous
 * shot, centred on the boundary. Both shots move through the transition, so the motion carries across the cut.
 */
export function Edit({ shots, shade = true }: { shots: ShotSpec[]; shade?: boolean }) {
  const f = useCurrentFrame();
  const half = T / 2;
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      {shots.map((s, i) => {
        const next = shots[i + 1];
        const start = s.from - (s.cut && s.cut !== "none" ? half : 0);
        const end = next ? s.to + half : s.to;
        if (f < start - 1 || f > end + 1) return null;
        const p = interpolate(f, [start, end], [0, 1], { ...clamp, easing: smooth });
        let style: CSSProperties = {};
        if (s.cut && s.cut !== "none" && f < s.from + half) style = cutStyle(s.cut, interpolate(f, [s.from - half, s.from + half], [0, 1], { ...clamp, easing: snap }), "in");
        else if (next?.cut && next.cut !== "none" && f > s.to - half) style = cutStyle(next.cut, interpolate(f, [s.to - half, s.to + half], [0, 1], { ...clamp, easing: snap }), "out");
        return (
          <AbsoluteFill key={i} style={{ ...style, overflow: "hidden" }}>
            <Sequence from={Math.round(start)} layout="none">
              <OffthreadVideo src={s.src} muted style={{ width: "100%", height: "100%", objectFit: "cover", transform: camera(s.cam, p), filter: s.grade }} />
            </Sequence>
            {shade && <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0) 28%, rgba(0,0,0,0.1) 55%, rgba(0,0,0,0.82) 100%)" }} />}
            {s.children}
          </AbsoluteFill>
        );
      })}
      {/* a white flash on "flash" cuts */}
      {shots.map((s, i) =>
        s.cut === "flash" && Math.abs(f - s.from) <= half ? (
          <AbsoluteFill key={`flash${i}`} style={{ background: "#fff", opacity: 0.75 * Math.sin(Math.PI * interpolate(f, [s.from - half, s.from + half], [0, 1], clamp)) }} />
        ) : null,
      )}
    </AbsoluteFill>
  );
}

/** Splits a span into n shots of equal length, for long narration lines. */
export const split = (from: number, to: number, n: number) => Array.from({ length: n }, (_, i) => [Math.round(from + ((to - from) * i) / n), Math.round(from + ((to - from) * (i + 1)) / n)] as const);
