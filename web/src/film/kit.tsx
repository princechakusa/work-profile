import { useId, type FC, type ReactNode } from "react";
import { AbsoluteFill, Easing, Html5Audio, Sequence, Series, interpolate } from "remotion";
import voice from "./voice.json";

/** Shared building blocks for the films. Everything is driven by the frame number, never by CSS animation. */

export const FPS = 30;
export const W = 1920;
export const H = 1080;
export const FLOOR = 860;

export const C = {
  ink: "#07080b",
  ink2: "#12151c",
  sand: "#ece7db",
  steel: "#7d8794",
  signal: "#ff5a1f",
  line: "rgba(236, 231, 219, 0.14)",
  hair: "#15110f",
  pants: "#2a2f3a",
};
export const SKIN = ["#8a5a3c", "#c99a72", "#e2bd9a"];

export const F = {
  display: "var(--font-display), Impact, sans-serif",
  body: "var(--font-body), system-ui, sans-serif",
  mono: "var(--font-mono), monospace",
};

const OUT = Easing.bezier(0.16, 1, 0.3, 1);
const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** Eased 0..1 (or from..to) between frames a and b. */
export const ramp = (f: number, a: number, b: number, from = 0, to = 1) =>
  interpolate(f, [a, b], [from, to], { ...CLAMP, easing: OUT });

/** Linear version, for walking and counters. */
export const lin = (f: number, a: number, b: number, from = 0, to = 1) => interpolate(f, [a, b], [from, to], CLAMP);

/** Mouth movement while a line is being spoken. */
export const talking = (f: number, a: number, b: number) => (f > a && f < b ? 0.5 + 0.5 * Math.sin(f * 0.9) : 0);

/** Deterministic 0..1 noise so frames always render the same. */
export const noise = (i: number) => {
  const v = Math.sin(i * 12.9898 + 4.1414) * 43758.5453;
  return v - Math.floor(v);
};

/** Frames a scene overlaps the one before it. Scenes crossfade; they never dip to black. */
export const XFADE = 14;

export function Stage({ frame, children }: { frame: number; children: ReactNode }) {
  return (
    <AbsoluteFill style={{ background: C.ink, color: C.sand, fontFamily: F.body, opacity: lin(frame, 0, XFADE) }}>
      <AbsoluteFill>
        <Svg>
          <line x1={0} y1={FLOOR} x2={W} y2={FLOOR} stroke={C.sand} strokeOpacity={0.35} strokeWidth={2} />
          {Array.from({ length: 13 }, (_, i) => (
            <line key={i} x1={960 + (i - 6) * 150} y1={FLOOR} x2={960 + (i - 6) * 520} y2={H} stroke={C.line} />
          ))}
        </Svg>
        {children}
      </AbsoluteFill>
    </AbsoluteFill>
  );
}

/** Plays scenes back to back, each one fading in over the tail of the one before. */
export function Scenes({ scenes }: { scenes: [FC, number][] }) {
  return (
    <Series>
      {scenes.map(([Scene, dur], i) => (
        <Series.Sequence key={i} offset={i ? -XFADE : 0} durationInFrames={dur + (i < scenes.length - 1 ? XFADE : 0)}>
          <Scene />
        </Series.Sequence>
      ))}
    </Series>
  );
}

export function Svg({ children }: { children: ReactNode }) {
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} style={{ position: "absolute", inset: 0 }}>
      {children}
    </svg>
  );
}

const WARM = "#ffcf8a";
const COOL = "#9fb4c9";
const TIERS: [number, number][][] = [
  [[1, 1]],
  [[1, 0.56], [0.72, 0.28], [0.44, 0.16]],
  [[1, 0.8], [0.62, 0.2]],
];

type BuildingProps = {
  /** Left edge; the base sits on the floor. */
  x: number;
  w: number;
  h: number;
  /** 0 slab block, 1 stepped tower with spire, 2 tower with a crown. */
  kind: number;
  seed: number;
  /** Visible height in px, measured up from the floor. Animate it to grow the building floor by floor. */
  show: number;
  /** 0..1 how many windows are lit. */
  lit?: number;
};

/** A tower with setbacks, lit windows, an entrance and a roofline, drawn inside an <Svg>. */
export function Building({ x, w, h, kind, seed, show, lit = 0.5 }: BuildingProps) {
  const id = `b${useId().replace(/[^a-zA-Z0-9]/g, "")}`;
  if (show <= 0) return null;
  const cx = x + w / 2;
  let y = FLOOR;
  const tiers = TIERS[kind].map(([wf, hf], t) => {
    const tw = w * wf, th = h * hf, tx = x + (w - tw) / 2;
    y -= th;
    const cols = Math.floor((tw - 14) / 22), rows = Math.floor((th - 12) / 26);
    const pad = (tw - cols * 22 + 8) / 2;
    return (
      <g key={t}>
        <rect x={tx} y={y} width={tw} height={th} fill="#1a1e27" stroke={C.sand} strokeOpacity={0.45} strokeWidth={2} />
        <rect x={tx + tw * 0.78} y={y} width={tw * 0.22} height={th} fill="rgba(0,0,0,0.38)" />
        <rect x={tx - 4} y={y - 5} width={tw + 8} height={6} fill={C.sand} fillOpacity={0.55} />
        {Array.from({ length: rows * cols }, (_, i) => {
          const n = noise(i + seed * 97 + t * 13);
          const on = n < lit;
          return (
            <rect
              key={i} x={tx + pad + (i % cols) * 22} y={y + 12 + Math.floor(i / cols) * 26} width={14} height={16}
              fill={on ? (n < lit * 0.7 ? WARM : COOL) : C.sand} opacity={on ? 0.95 : 0.09}
            />
          );
        })}
      </g>
    );
  });
  return (
    <g clipPath={`url(#${id})`}>
      <clipPath id={id}>
        <rect x={x - 30} y={FLOOR - show} width={w + 60} height={show} />
      </clipPath>
      {tiers}
      {kind === 1 && (
        <>
          <line x1={cx} y1={y} x2={cx} y2={y - h * 0.14} stroke={C.sand} strokeWidth={4} />
          <circle cx={cx} cy={y - h * 0.14} r={6} fill={C.signal} />
        </>
      )}
      {kind === 2 && <polygon points={`${cx - w * 0.31},${y - 5} ${cx + w * 0.31},${y - 5} ${cx + w * 0.31},${y - 40}`} fill="#1a1e27" stroke={C.sand} strokeOpacity={0.45} strokeWidth={2} />}
      {kind === 0 && (
        <>
          <rect x={x + w * 0.18} y={y - 23} width={w * 0.3} height={18} fill="#1a1e27" stroke={C.sand} strokeOpacity={0.45} strokeWidth={2} />
          <line x1={x + w * 0.7} y1={y - 5} x2={x + w * 0.7} y2={y - 46} stroke={C.sand} strokeOpacity={0.7} strokeWidth={3} />
        </>
      )}
      {/* entrance */}
      <rect x={cx - 17} y={FLOOR - 34} width={34} height={34} fill={WARM} />
      <rect x={cx - 28} y={FLOOR - 42} width={56} height={7} fill={C.sand} />
    </g>
  );
}

/** Tower crane standing on a roof at x/y. */
export function Crane({ x, y, frame, opacity = 1 }: { x: number; y: number; frame: number; opacity?: number }) {
  const hook = -96 + Math.sin(frame * 0.07 + x) * 22;
  return (
    <g transform={`translate(${x} ${y})`} stroke={C.signal} strokeWidth={5} strokeLinecap="round" opacity={opacity}>
      <line x1={0} y1={0} x2={0} y2={-150} />
      <line x1={34} y1={-150} x2={-150} y2={-150} />
      <line x1={0} y1={-178} x2={-150} y2={-150} strokeWidth={3} />
      <line x1={0} y1={-178} x2={34} y2={-150} strokeWidth={3} />
      <line x1={-110} y1={-150} x2={-110} y2={hook} strokeWidth={3} />
      <rect x={-124} y={hook} width={28} height={20} fill={C.signal} stroke="none" />
    </g>
  );
}

function Arm({ x, a, shirt, skin }: { x: number; a: number; shirt: string; skin: string }) {
  return (
    <g transform={`translate(${x} -236) rotate(${a})`}>
      <line x1={0} y1={0} x2={0} y2={92} stroke={shirt} strokeWidth={24} strokeLinecap="round" />
      <circle cy={104} r={13} fill={skin} />
    </g>
  );
}

function Leg({ x, a }: { x: number; a: number }) {
  return (
    <g transform={`translate(${x} -125) rotate(${a})`}>
      <line x1={0} y1={0} x2={0} y2={112} stroke={C.pants} strokeWidth={28} strokeLinecap="round" />
      <rect x={-14} y={108} width={38} height={17} rx={8} fill={C.sand} />
    </g>
  );
}

type PersonProps = {
  x: number;
  y?: number;
  s?: number;
  /** Faces right by default. */
  flip?: boolean;
  shirt?: string;
  skin?: string;
  /** Walk cycle phase in radians; 0 means standing. */
  walk?: number;
  /** 0..1, raises the front arm and waves it. */
  wave?: number;
  /** 0..1, holds the front arm out. */
  reach?: number;
  talk?: number;
  /** Prince's look from his photo: charcoal suit, white shirt, navy tie, high-top hair, goatee. */
  suit?: boolean;
  frame: number;
};

/** A small rigged figure, drawn inside an <Svg>. x/y is where the feet stand. */
export function Person({ x, y = FLOOR, s = 1, flip, shirt = C.steel, skin = SKIN[1], walk = 0, wave = 0, reach = 0, talk = 0, suit, frame }: PersonProps) {
  if (s < 0.02) return null;
  const swing = walk ? Math.sin(walk) * 26 : 0;
  const bob = walk ? -Math.abs(Math.cos(walk)) * 5 : Math.sin(frame * 0.08) * 1.5;
  const front = wave > 0 ? -150 * wave + Math.sin(frame * 0.45) * 14 * wave : reach > 0 ? -78 * reach : walk ? -swing : -6;
  const back = walk ? swing : 6;
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>
      <ellipse cx={0} cy={6} rx={64} ry={9} fill="rgba(0,0,0,0.5)" />
      <g transform={`translate(0 ${bob})`}>
        <Arm x={-30} a={back} shirt={shirt} skin={skin} />
        <Leg x={-15} a={swing} />
        <Leg x={15} a={-swing} />
        <rect x={-42} y={-262} width={84} height={150} rx={34} fill={shirt} />
        {suit && (
          <>
            <polygon points="-8,-262 34,-262 14,-206" fill="#f4f1ea" />
            <polygon points="9,-258 19,-258 22,-200 14,-188 6,-200" fill="#24386b" />
            <rect x={-30} y={-196} width={20} height={5} fill={C.signal} />
          </>
        )}
        <circle cx={4} cy={-302} r={38} fill={skin} />
        {suit ? (
          <>
            <path d="M -35 -300 Q -44 -356 6 -354 Q 54 -354 43 -300 Q 4 -328 -35 -300 Z" fill={C.hair} />
            <path d="M 11 -275 Q 24 -268 37 -277 Q 33 -264 23 -264 Q 14 -265 11 -275 Z" fill={C.hair} />
          </>
        ) : (
          <path d="M -34 -302 A 38 38 0 0 1 42 -302 Q 4 -324 -34 -302 Z" fill={C.hair} />
        )}
        <circle cx={16} cy={-300} r={4} fill={C.ink} />
        <circle cx={31} cy={-300} r={4} fill={C.ink} />
        {talk > 0 ? (
          <ellipse cx={24} cy={-286} rx={6.5} ry={1.5 + talk * 3.5} fill={suit ? "#2a0f0c" : C.ink} />
        ) : (
          <path d="M 14 -288 Q 24 -279 34 -288" fill="none" stroke={suit ? "#f4f1ea" : C.ink} strokeWidth={3.5} strokeLinecap="round" />
        )}
        <Arm x={30} a={front} shirt={shirt} skin={skin} />
      </g>
    </g>
  );
}

/** Chapter heading, top left. */
export function Header({ frame, kicker, title, sub }: { frame: number; kicker: string; title: string; sub: string }) {
  return (
    <div style={{ position: "absolute", left: 100, top: 84 }}>
      <div style={{ fontFamily: F.mono, fontSize: 24, letterSpacing: "0.1em", textTransform: "uppercase", color: C.steel, opacity: ramp(frame, 4, 20) }}>
        {kicker}
      </div>
      <div style={{ overflow: "hidden", marginTop: 14 }}>
        <div
          style={{
            fontFamily: F.display, fontWeight: 900, fontSize: 104, lineHeight: 0.92, textTransform: "uppercase",
            whiteSpace: "nowrap", translate: `0 ${ramp(frame, 8, 30, 110, 0)}%`,
          }}
        >
          {title}
        </div>
      </div>
      <div style={{ fontSize: 44, fontWeight: 600, color: C.signal, marginTop: 12, opacity: ramp(frame, 22, 38) }}>{sub}</div>
    </div>
  );
}

/** Speech bubble whose tail sits at x/y. The line types itself out. */
export function Bubble({ frame, from, to, x, y, text, w = 600 }: { frame: number; from: number; to: number; x: number; y: number; text: string; w?: number }) {
  if (frame < from || frame > to) return null;
  const p = ramp(frame, from, from + 12);
  const n = Math.floor(lin(frame, from + 3, from + 3 + text.length * 0.8, 0, text.length));
  return (
    <div
      style={{
        position: "absolute", left: x, top: y, translate: "-50% -100%", transformOrigin: "50% 100%",
        scale: 0.6 + 0.4 * p, opacity: p * lin(frame, to - 8, to, 1, 0),
        width: "max-content", maxWidth: w, padding: "22px 32px", borderRadius: 28,
        background: C.sand, color: C.ink, fontSize: 44, lineHeight: 1.15, fontWeight: 500,
      }}
    >
      <span>{text.slice(0, n)}</span>
      <span style={{ opacity: 0 }}>{text.slice(n)}</span>
      <div style={{ position: "absolute", left: "50%", bottom: -11, width: 24, height: 24, background: C.sand, translate: "-50% 0", rotate: "45deg" }} />
    </div>
  );
}

/** Big number with a caption under a rule. */
export function Stat({ frame, at, n, label, x, y, w = 290 }: { frame: number; at: number; n: string; label: string; x: number; y: number; w?: number }) {
  const p = ramp(frame, at, at + 18);
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, opacity: p, translate: `0 ${(1 - p) * 30}px` }}>
      <div style={{ fontFamily: F.display, fontWeight: 900, fontSize: 104, lineHeight: 0.9, whiteSpace: "nowrap" }}>{n}</div>
      <div style={{ marginTop: 10, paddingTop: 10, borderTop: `2px solid ${C.line}`, fontSize: 26, lineHeight: 1.25, color: C.steel }}>{label}</div>
    </div>
  );
}

/** A row of outlined labels that arrive one after another. */
export function Chips({ frame, at, until = 1e9, x, y, lead, items }: { frame: number; at: number; until?: number; x: number; y: number; lead?: string; items: string[] }) {
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: lin(frame, until - 10, until, 1, 0), display: "flex", gap: 16, alignItems: "center", fontFamily: F.mono, fontSize: 22, letterSpacing: "0.08em", textTransform: "uppercase" }}>
      {lead && <span style={{ color: C.signal, marginRight: 8, opacity: ramp(frame, at, at + 12) }}>{lead}</span>}
      {items.map((t, i) => (
        <span key={t} style={{ border: `2px solid ${C.line}`, borderRadius: 999, padding: "10px 20px", background: C.ink, opacity: ramp(frame, at + 6 + i * 6, at + 20 + i * 6) }}>
          {t}
        </span>
      ))}
    </div>
  );
}

/** Small orange name tag centred above a figure. */
export function Tag({ frame, at, until = 1e9, x, y, text }: { frame: number; at: number; until?: number; x: number; y: number; text: string }) {
  const p = ramp(frame, at, at + 12) * lin(frame, until - 8, until, 1, 0);
  return (
    <div
      style={{
        position: "absolute", left: x, top: y, translate: "-50% -100%", opacity: p, scale: 0.8 + 0.2 * p,
        background: C.signal, color: C.ink, padding: "8px 16px", whiteSpace: "nowrap",
        fontFamily: F.mono, fontSize: 22, letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 500,
      }}
    >
      {text}
    </div>
  );
}

/** Prince as he appears in every film. */
export const PRINCE = { suit: true, shirt: "#4a4e59", skin: "#6b4330" } as const;

type Line = { dur: number; text: string };
export type Cue = { id: string; from: number; to: number; text: string };
export type Timeline = { cue: Record<string, Cue>; list: Cue[]; end: number };

/** Lays narration lines end to end. Scenes hang their action off these cue frames, so picture follows voice. */
export function timeline(ids: (string | number)[], start = 12, gap = 7): Timeline {
  const lines = voice as Record<string, Line>;
  const cue: Record<string, Cue> = {};
  const list: Cue[] = [];
  let f = start;
  for (const id of ids) {
    // a number is a silent beat of that many frames
    if (typeof id === "number") {
      f += id;
      continue;
    }
    const c = { id, from: f, to: f + Math.ceil(lines[id].dur * FPS), text: lines[id].text };
    f = c.to + gap;
    list.push((cue[id] = c));
  }
  return { cue, list, end: f };
}

/** Plays each line's audio at its cue and shows it as a caption. Lines in `spoken` are shown as speech bubbles by the scene instead. */
export function Narration({ t, frame, spoken = [] }: { t: Timeline; frame: number; spoken?: string[] }) {
  const now = t.list.find((c) => frame >= c.from && frame < c.to + 7 && !spoken.includes(c.id));
  return (
    <>
      {t.list.map((c) => (
        <Sequence key={c.id} from={c.from} durationInFrames={c.to - c.from + 10} layout="none">
          <Html5Audio src={`/voice/${c.id}.mp3`} />
        </Sequence>
      ))}
      {now && (
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 34, display: "flex", justifyContent: "center", opacity: lin(frame, now.from, now.from + 5) }}>
          <div style={{ maxWidth: 1560, padding: "12px 26px", background: "rgba(7, 8, 11, 0.86)", border: `2px solid ${C.line}`, fontSize: 34, lineHeight: 1.25, textAlign: "center" }}>
            {now.text}
          </div>
        </div>
      )}
    </>
  );
}

/** A frame part-way through a narration line, for landing a visual on the word it belongs to. */
export const part = (c: Cue, k: number) => Math.round(c.from + (c.to - c.from) * k);
