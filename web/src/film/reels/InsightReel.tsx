import type { ReactNode } from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { C, F, lin, noise, ramp } from "../kit";

/**
 * Vertical LinkedIn reel (1080 x 1920): a hook, four or five illustrated points, and a closing line.
 * Built for muted autoplay: every idea is on screen as text, and the hook lands in the first second.
 */

export const RW = 1080;
export const RH = 1920;
export const HOOK = 96; // frames
export const BEAT = 150;
export const CLOSE = 120;

export type Art = "building" | "key" | "checklist" | "chat" | "chart" | "shield" | "team" | "ai" | "search" | "tags" | "ladder";
export type ReelProps = { kicker: string; hook: string[]; beats: { art: Art; title: string; text: string }[]; close: string[] };

export const reelDuration = (p: ReelProps) => HOOK + p.beats.length * BEAT + CLOSE;

const ORANGE = C.signal;

function Svg({ children, h = 760 }: { children: ReactNode; h?: number }) {
  return (
    <svg width={RW} height={h} viewBox={`0 0 ${RW} ${h}`} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
      {children}
    </svg>
  );
}

/** Dusk skyline along the bottom, the same mood as the site. Windows light up over time. */
function Skyline({ f, opacity = 1 }: { f: number; opacity?: number }) {
  const towers = Array.from({ length: 14 }, (_, i) => ({ x: i * 80 - 20, w: 60 + noise(i) * 30, h: 260 + noise(i + 7) * 520 }));
  return (
    <svg width={RW} height={RH} style={{ position: "absolute", inset: 0, opacity }}>
      <defs>
        <linearGradient id="dusk" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#07080b" />
          <stop offset="0.55" stopColor="#141022" />
          <stop offset="0.85" stopColor="#3a2030" />
          <stop offset="1" stopColor="#5a2c22" />
        </linearGradient>
      </defs>
      <rect width={RW} height={RH} fill="url(#dusk)" />
      {towers.map((t, i) => (
        <g key={i}>
          <rect x={t.x} y={RH - t.h} width={t.w} height={t.h} fill="#0b0d12" />
          {Array.from({ length: Math.floor(t.h / 34) }, (_, r) =>
            Array.from({ length: 3 }, (_, c) => {
              const on = noise(i * 97 + r * 7 + c) < 0.25 + 0.5 * lin(f, 0, 200) * noise(i + r);
              return on ? <rect key={`${r}-${c}`} x={t.x + 8 + c * (t.w / 3)} y={RH - t.h + 14 + r * 34} width={t.w / 3 - 12} height={12} fill={noise(i + r + c) > 0.85 ? ORANGE : "#e9d9b0"} opacity={0.55} /> : null;
            }),
          )}
        </g>
      ))}
    </svg>
  );
}

/* ---------- illustrations, each animated by the beat's local frame ---------- */

function ArtBuilding({ f }: { f: number }) {
  const lit = lin(f, 10, 90);
  return (
    <Svg>
      <rect x={340} y={120} width={400} height={600} rx={6} fill="#12151c" stroke={C.line} strokeWidth={3} />
      {Array.from({ length: 8 }, (_, r) =>
        Array.from({ length: 4 }, (_, c) => {
          const i = r * 4 + c;
          return <rect key={i} x={372 + c * 92} y={150 + r * 68} width={64} height={40} rx={3} fill={noise(i) < lit ? "#e9d9b0" : "#1c2029"} />;
        }),
      )}
      <g transform={`translate(${lin(f, 20, 55, 900, 640)} ${210 - ramp(f, 20, 55) * 40})`} opacity={ramp(f, 20, 40)}>
        <rect width={300} height={120} rx={22} fill={ORANGE} />
        <text x={30} y={52} fill={C.ink} fontFamily={F.mono} fontSize={24}>ARRIVAL GUIDE</text>
        <text x={30} y={90} fill={C.ink} fontFamily={F.body} fontSize={26}>Access · Parking · Wi-Fi</text>
      </g>
    </Svg>
  );
}

function ArtKey({ f }: { f: number }) {
  const digits = "4 8 1 6".split(" ");
  const ok = f > 80;
  return (
    <Svg>
      <rect x={300} y={90} width={300} height={620} rx={10} fill="#12151c" stroke={C.line} strokeWidth={3} />
      <rect x={330 + ramp(f, 85, 120) * 200} y={120} width={240} height={560} rx={6} fill="#1c2029" opacity={1 - ramp(f, 110, 130) * 0.6} />
      <rect x={660} y={240} width={180} height={300} rx={16} fill="#0b0d12" stroke={ok ? "#3fbf7f" : C.steel} strokeWidth={4} />
      {digits.map((d, i) => (
        <text key={i} x={690 + i * 36} y={310} fill={C.sand} fontFamily={F.mono} fontSize={34} opacity={f > 18 + i * 14 ? 1 : 0.15}>
          {f > 18 + i * 14 ? d : "•"}
        </text>
      ))}
      <circle cx={750} cy={430} r={46} fill={ok ? "#3fbf7f" : "#232733"} />
      {ok && <path d="M728 430 l16 16 l30 -34" stroke={C.ink} strokeWidth={9} fill="none" strokeLinecap="round" />}
    </Svg>
  );
}

function ArtChecklist({ f }: { f: number }) {
  const items = ["Linen and towels", "Kitchen stocked", "Every light works", "AC set and tested", "Photo report sent"];
  return (
    <Svg>
      <rect x={250} y={60} width={580} height={680} rx={18} fill="#12151c" stroke={C.line} strokeWidth={3} />
      <rect x={430} y={40} width={220} height={50} rx={10} fill={C.steel} />
      {items.map((t, i) => {
        const on = f > 16 + i * 20;
        return (
          <g key={t} transform={`translate(300 ${140 + i * 116})`} opacity={ramp(f, i * 8, i * 8 + 14)}>
            <rect width={56} height={56} rx={10} fill={on ? ORANGE : "none"} stroke={on ? ORANGE : C.steel} strokeWidth={4} />
            {on && <path d="M12 28 l12 12 l22 -24" stroke={C.ink} strokeWidth={8} fill="none" strokeLinecap="round" />}
            <text x={86} y={40} fill={C.sand} fontFamily={F.body} fontSize={38} opacity={on ? 1 : 0.6}>{t}</text>
          </g>
        );
      })}
    </Svg>
  );
}

function ArtChat({ f }: { f: number }) {
  const secs = Math.floor(lin(f, 30, 90, 0, 120));
  return (
    <Svg>
      <g opacity={ramp(f, 0, 14)} transform={`translate(160 ${140 - ramp(f, 0, 14) * 20})`}>
        <rect width={560} height={130} rx={30} fill="#1c2029" />
        <text x={36} y={78} fill={C.sand} fontFamily={F.body} fontSize={36}>Hi, the AC isn't cooling.</text>
      </g>
      <g opacity={ramp(f, 40, 56)} transform={`translate(360 ${330 - ramp(f, 40, 56) * 20})`}>
        <rect width={560} height={170} rx={30} fill={ORANGE} />
        <text x={36} y={72} fill={C.ink} fontFamily={F.body} fontSize={34}>Sorry about that. A technician</text>
        <text x={36} y={120} fill={C.ink} fontFamily={F.body} fontSize={34}>is on the way, ETA 30 minutes.</text>
      </g>
      <g transform="translate(400 590)">
        <circle cx={60} cy={60} r={58} fill="none" stroke={C.steel} strokeWidth={6} />
        <path d={`M60 60 L60 10`} stroke={ORANGE} strokeWidth={6} transform={`rotate(${lin(f, 30, 90, 0, 360)} 60 60)`} />
        <text x={150} y={80} fill={C.sand} fontFamily={F.display} fontWeight={900} fontSize={70}>
          {Math.floor(secs / 60)}:{String(secs % 60).padStart(2, "0")}
        </text>
      </g>
    </Svg>
  );
}

function ArtChart({ f }: { f: number }) {
  const bars = [0.35, 0.5, 0.45, 0.65, 0.78, 0.92];
  return (
    <Svg>
      <line x1={180} y1={640} x2={900} y2={640} stroke={C.steel} strokeWidth={4} />
      {bars.map((b, i) => {
        const h = 480 * b * ramp(f, 6 + i * 8, 40 + i * 8);
        return <rect key={i} x={210 + i * 115} y={640 - h} width={80} height={h} rx={6} fill={i === bars.length - 1 ? ORANGE : "#2a3040"} />;
      })}
      <polyline
        points={bars.map((b, i) => `${250 + i * 115},${640 - 480 * b - 40}`).join(" ")}
        fill="none"
        stroke={C.sand}
        strokeWidth={5}
        strokeDasharray={1400}
        strokeDashoffset={1400 * (1 - ramp(f, 50, 110))}
      />
    </Svg>
  );
}

function ArtShield({ f }: { f: number }) {
  const d = "M540 80 L800 170 L780 430 C760 560 650 650 540 700 C430 650 320 560 300 430 L280 170 Z";
  return (
    <Svg>
      <path d={d} fill="#12151c" stroke={ORANGE} strokeWidth={8} strokeDasharray={2000} strokeDashoffset={2000 * (1 - ramp(f, 0, 60))} />
      <path d="M440 390 l70 70 l140 -150" fill="none" stroke={C.sand} strokeWidth={22} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={420} strokeDashoffset={420 * (1 - ramp(f, 60, 95))} />
    </Svg>
  );
}

function ArtTeam({ f }: { f: number }) {
  const groups = [
    { x: 270, y: 260, label: "CONCIERGE" },
    { x: 810, y: 260, label: "MAINTENANCE" },
    { x: 540, y: 600, label: "HOUSEKEEPING" },
  ];
  const hub = { x: 540, y: 380 };
  return (
    <Svg>
      {groups.map((g, gi) => (
        <g key={g.label}>
          <line x1={hub.x} y1={hub.y} x2={g.x} y2={g.y} stroke={ORANGE} strokeWidth={4} strokeDasharray={500} strokeDashoffset={500 * (1 - ramp(f, 30 + gi * 10, 70 + gi * 10))} />
          {Array.from({ length: 4 }, (_, i) => {
            const a = (i / 4) * Math.PI * 2 + f * 0.01;
            return <circle key={i} cx={g.x + Math.cos(a) * 70} cy={g.y + Math.sin(a) * 70} r={22} fill={C.sand} opacity={ramp(f, gi * 8 + i * 3, gi * 8 + i * 3 + 12)} />;
          })}
          <text x={g.x} y={g.y + 130} textAnchor="middle" fill={C.steel} fontFamily={F.mono} fontSize={24}>{g.label}</text>
        </g>
      ))}
      <circle cx={hub.x} cy={hub.y} r={46} fill={ORANGE} opacity={ramp(f, 20, 34)} />
    </Svg>
  );
}

function ArtAi({ f }: { f: number }) {
  return (
    <Svg>
      <g transform="translate(200 100)">
        <rect width={680} height={360} rx={24} fill="#12151c" stroke={C.line} strokeWidth={3} />
        <text x={36} y={64} fill={C.steel} fontFamily={F.mono} fontSize={26}>AI DRAFT</text>
        {[0.9, 0.75, 0.82, 0.5].map((w, i) => (
          <rect key={i} x={36} y={100 + i * 56} height={26} rx={8} width={600 * w * ramp(f, 8 + i * 10, 30 + i * 10)} fill="#2a3040" />
        ))}
      </g>
      <g transform={`translate(${lin(f, 70, 100, 900, 600)} 500)`} opacity={ramp(f, 70, 90)}>
        <rect width={300} height={140} rx={24} fill={ORANGE} />
        <text x={34} y={58} fill={C.ink} fontFamily={F.mono} fontSize={24}>HUMAN CHECK</text>
        <text x={34} y={104} fill={C.ink} fontFamily={F.body} fontSize={32}>Approved ✓</text>
      </g>
    </Svg>
  );
}

function ArtSearch({ f }: { f: number }) {
  const flagged = 3;
  const mx = 330 + ((f * 4) % 420);
  return (
    <Svg>
      <rect x={200} y={80} width={680} height={620} rx={18} fill="#12151c" stroke={C.line} strokeWidth={3} />
      {Array.from({ length: 8 }, (_, i) => (
        <rect key={i} x={240} y={130 + i * 68} width={600} height={40} rx={8} fill={i === flagged && f > 60 ? ORANGE : "#232733"} opacity={i === flagged && f > 60 ? 0.9 : 1} />
      ))}
      <g transform={`translate(${f > 60 ? 560 : mx} ${f > 60 ? 340 : 120 + ((f * 6) % 520)})`}>
        <circle r={70} fill="none" stroke={C.sand} strokeWidth={10} />
        <line x1={50} y1={50} x2={110} y2={110} stroke={C.sand} strokeWidth={14} strokeLinecap="round" />
      </g>
    </Svg>
  );
}

function ArtTags({ f }: { f: number }) {
  const bins = ["CHECK-IN", "CLEANING", "RESPONSE", "NOISE"];
  const counts = [9, 14, 6, 4];
  return (
    <Svg>
      {bins.map((b, i) => {
        const n = Math.round(counts[i] * ramp(f, 20 + i * 8, 90 + i * 8));
        return (
          <g key={b} transform={`translate(${130 + i * 215} 220)`}>
            <rect width={180} height={420} rx={14} fill="#12151c" stroke={i === 1 ? ORANGE : C.line} strokeWidth={3} />
            {Array.from({ length: n }, (_, k) => (
              <rect key={k} x={20} y={390 - k * 26} width={140} height={18} rx={4} fill={i === 1 ? ORANGE : "#2a3040"} />
            ))}
            <text x={90} y={470} textAnchor="middle" fill={C.steel} fontFamily={F.mono} fontSize={20}>{b}</text>
          </g>
        );
      })}
      <g opacity={ramp(f, 0, 20)} transform={`translate(${lin(f, 0, 40, 380, 470)} ${lin(f, 0, 40, 40, 150)}) rotate(${lin(f, 0, 40, -8, 0)})`}>
        <rect width={150} height={90} rx={10} fill={C.sand} />
        <text x={20} y={56} fill={C.ink} fontFamily={F.body} fontSize={28}>★★★☆☆</text>
      </g>
    </Svg>
  );
}

function ArtLadder({ f }: { f: number }) {
  const steps = ["TEAM MEMBER", "SUPERVISOR", "MANAGER"];
  return (
    <Svg>
      {steps.map((s, i) => (
        <g key={s} opacity={ramp(f, i * 22, i * 22 + 16)}>
          <rect x={200 + i * 150} y={560 - i * 200} width={420} height={110} rx={16} fill={i === 2 ? ORANGE : "#12151c"} stroke={C.line} strokeWidth={3} />
          <text x={230 + i * 150} y={628 - i * 200} fill={i === 2 ? C.ink : C.sand} fontFamily={F.mono} fontSize={28}>{s}</text>
          {i < 2 && <path d={`M${560 + i * 150} ${550 - i * 200} l60 -80`} stroke={ORANGE} strokeWidth={6} strokeDasharray={120} strokeDashoffset={120 * (1 - ramp(f, i * 22 + 14, i * 22 + 30))} />}
        </g>
      ))}
    </Svg>
  );
}

const ARTS: Record<Art, (p: { f: number }) => ReactNode> = {
  building: ArtBuilding, key: ArtKey, checklist: ArtChecklist, chat: ArtChat, chart: ArtChart,
  shield: ArtShield, team: ArtTeam, ai: ArtAi, search: ArtSearch, tags: ArtTags, ladder: ArtLadder,
};

/* ---------- scenes ---------- */

function Lines({ lines, f, at, size, color = C.sand, accentLast = false }: { lines: string[]; f: number; at: number; size: number; color?: string; accentLast?: boolean }) {
  return (
    <div>
      {lines.map((l, i) => (
        <div key={i} style={{ overflow: "hidden" }}>
          <div
            style={{
              fontFamily: F.display, fontWeight: 900, fontSize: size, lineHeight: 0.98, textTransform: "uppercase",
              color: accentLast && i === lines.length - 1 ? ORANGE : color,
              transform: `translateY(${ramp(f, at + i * 6, at + i * 6 + 16, 110, 0)}%)`,
            }}
          >
            {l}
          </div>
        </div>
      ))}
    </div>
  );
}

export function InsightReel(p: ReelProps) {
  const frame = useCurrentFrame();
  const total = reelDuration(p);
  const beatStart = HOOK;
  const closeStart = HOOK + p.beats.length * BEAT;
  const bi = Math.floor((frame - beatStart) / BEAT);
  const inBeats = frame >= beatStart && frame < closeStart;

  return (
    <AbsoluteFill style={{ background: C.ink, color: C.sand, fontFamily: F.body, overflow: "hidden" }}>
      <Skyline f={frame} opacity={frame < beatStart ? 1 : frame >= closeStart ? 1 : 0.35} />

      {/* hook: big words in the first second */}
      {frame < beatStart + 10 && (
        <AbsoluteFill style={{ padding: "260px 80px 0", opacity: 1 - ramp(frame, beatStart - 4, beatStart + 10) }}>
          <div style={{ fontFamily: F.mono, fontSize: 30, letterSpacing: "0.12em", color: ORANGE, marginBottom: 40, opacity: ramp(frame, 0, 8) }}>{p.kicker}</div>
          <Lines lines={p.hook} f={frame} at={0} size={150} accentLast />
        </AbsoluteFill>
      )}

      {/* beats */}
      {inBeats &&
        p.beats.map((b, i) => {
          if (i !== bi && i !== bi - 1) return null;
          const lf = frame - beatStart - i * BEAT;
          const opacity = ramp(lf, 0, 12) * (1 - ramp(lf, BEAT - 4, BEAT + 8));
          const A = ARTS[b.art];
          return (
            <AbsoluteFill key={i} style={{ opacity }}>
              <div style={{ position: "absolute", top: 170, left: 80, fontFamily: F.mono, fontSize: 28, letterSpacing: "0.12em", color: C.steel }}>
                {String(i + 1).padStart(2, "0")} / {String(p.beats.length).padStart(2, "0")}
              </div>
              <div style={{ position: "absolute", top: 260, left: 0, width: RW, height: 760 }}>
                <A f={lf} />
              </div>
              <div style={{ position: "absolute", top: 1100, left: 80, right: 80 }}>
                <Lines lines={[b.title]} f={lf} at={8} size={96} color={ORANGE} />
                <div style={{ marginTop: 30, fontSize: 50, lineHeight: 1.3, opacity: ramp(lf, 20, 36), transform: `translateY(${ramp(lf, 20, 36, 20, 0)}px)` }}>{b.text}</div>
              </div>
            </AbsoluteFill>
          );
        })}

      {/* close */}
      {frame >= closeStart - 8 && (
        <AbsoluteFill style={{ padding: "380px 80px 0", opacity: ramp(frame, closeStart - 8, closeStart + 8) }}>
          <Lines lines={p.close} f={frame} at={closeStart} size={128} accentLast />
          <div style={{ position: "absolute", left: 80, bottom: 760, opacity: ramp(frame, closeStart + 30, closeStart + 50) }}>
            <div style={{ fontFamily: F.display, fontWeight: 800, fontSize: 64, textTransform: "uppercase" }}>Prince Chakusa</div>
            <div style={{ fontFamily: F.mono, fontSize: 30, color: C.steel, marginTop: 10 }}>Guest experience · Property operations</div>
          </div>
        </AbsoluteFill>
      )}

      {/* progress bar keeps people watching to the end */}
      <div style={{ position: "absolute", left: 0, top: 0, height: 10, width: `${(frame / total) * 100}%`, background: ORANGE }} />
      <div style={{ position: "absolute", left: 80, top: 70, fontFamily: F.mono, fontSize: 26, letterSpacing: "0.14em", color: C.steel }}>PRINCE CHAKUSA</div>
    </AbsoluteFill>
  );
}
