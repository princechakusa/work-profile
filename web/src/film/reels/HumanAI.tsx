import { AbsoluteFill, Easing, Html5Audio, Sequence, interpolate, useCurrentFrame } from "remotion";
import { loadFont } from "@remotion/google-fonts/Geist";
import { asset } from "@/lib/site";

/**
 * "Human, with AI" — a 4:5 LinkedIn film in the Apple keynote manner: black canvas, one idea at a time,
 * words that resolve out of a blur in time with the voice, and a slow colour aura behind them.
 * Deliberately unlike the portfolio films (no city, no orange display type).
 */

const { fontFamily } = loadFont("normal", { weights: ["300", "500", "700", "800"], subsets: ["latin"] });

export const HAI_W = 1080;
export const HAI_H = 1350;
export const HAI_FPS = 30;
const VO_AT = 0.5; // seconds of music before the voice starts
export const HAI_DUR = Math.round(44 * HAI_FPS);

const s = (sec: number) => Math.round((sec + VO_AT) * HAI_FPS);
const EASE = Easing.bezier(0.2, 0.9, 0.1, 1);
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const e = (f: number, a: number, b: number, from = 0, to = 1) => interpolate(f, [a, b], [from, to], { ...clamp, easing: EASE });

const GRAD = "linear-gradient(90deg, #6ea8ff 0%, #b18cff 45%, #ff9a6b 100%)";
const gradText = { background: GRAD, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" } as const;

/** Words resolve one by one out of a soft blur; the phrase blurs away as it leaves. */
function Phrase({ f, from, to, text, size = 104, weight = 700, accent = [] as string[], warm = false, sub }: {
  f: number; from: number; to: number; text: string; size?: number; weight?: number; accent?: string[]; warm?: boolean; sub?: string;
}) {
  if (f < from - 2 || f > to + 12) return null;
  const words = text.split(" ");
  const span = Math.max(6, Math.min(to - from, 40) * 0.6);
  const out = e(f, to, to + 10);
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", padding: "0 90px", opacity: 1 - out, filter: `blur(${out * 14}px)`, transform: `scale(${1 + out * 0.04})` }}>
      <div style={{ textAlign: "center", fontFamily, fontWeight: weight, fontSize: size, lineHeight: 1.04, letterSpacing: "-0.035em", color: warm ? "#fff3e6" : "#f5f5f7" }}>
        {words.map((w, i) => {
          const at = from + (span * i) / words.length;
          const k = e(f, at, at + 9);
          const isAccent = accent.includes(w.replace(/[.,?!]/g, ""));
          return (
            <span key={i} style={{ display: "inline-block", marginRight: "0.24em", opacity: k, filter: `blur(${(1 - k) * 12}px)`, transform: `translateY(${(1 - k) * 18}px)`, ...(isAccent ? gradText : {}) }}>
              {w}
            </span>
          );
        })}
      </div>
      {sub && (
        <div style={{ marginTop: 34, fontFamily, fontWeight: 500, fontSize: 38, letterSpacing: "-0.01em", color: "#a1a1a6", opacity: e(f, from + 10, from + 22) }}>{sub}</div>
      )}
    </AbsoluteFill>
  );
}

/** Slow colour field behind the words: cool for the AI part, warm for the human part. */
function Aura({ f }: { f: number }) {
  const warm = e(f, s(10.6), s(12.4)) * (1 - e(f, s(14.4), s(16))) + e(f, s(31.6), s(33.4)) * 0.8;
  const drift = f / HAI_FPS;
  const cool = ["#3b5bff", "#7b4dff"];
  const hot = ["#ff7a3d", "#ffb36b"];
  const mix = (a: string, b: string, t: number) => {
    const p = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
    const [x, y] = [p(a), p(b)];
    return `rgb(${x.map((v, i) => Math.round(v + (y[i] - v) * t)).join(",")})`;
  };
  const glow = 0.32 + 0.1 * Math.sin(drift * 0.9);
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <div style={{ position: "absolute", width: 900, height: 900, borderRadius: "50%", left: 90 + 120 * Math.sin(drift * 0.35), top: 760 + 60 * Math.cos(drift * 0.4), background: mix(cool[0], hot[0], warm), filter: "blur(160px)", opacity: glow }} />
      <div style={{ position: "absolute", width: 700, height: 700, borderRadius: "50%", left: 420 + 100 * Math.cos(drift * 0.3), top: -180 + 80 * Math.sin(drift * 0.5), background: mix(cool[1], hot[1], warm), filter: "blur(150px)", opacity: glow * 0.8 }} />
    </AbsoluteFill>
  );
}

/** The three things AI can already do, stacking as they are said. */
function AiList({ f }: { f: number }) {
  const items: [number, string][] = [[4.27, "Price a room."], [5.72, "Schedule a clean."], [7.17, "Flag a problem."]];
  const from = s(4.27);
  const to = s(8.6);
  if (f < from - 2 || f > to + 12) return null;
  const out = e(f, to, to + 10);
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", opacity: 1 - out, filter: `blur(${out * 14}px)` }}>
      <div style={{ fontFamily, fontWeight: 300, fontSize: 40, letterSpacing: "0.02em", color: "#a1a1a6", marginBottom: 40, opacity: e(f, from, from + 10) }}>
        AI can already
      </div>
      {items.map(([t, label], i) => {
        const at = s(t);
        const k = e(f, at, at + 10);
        const latest = i === items.length - 1 || f < s(items[i + 1][0]);
        return (
          <div key={label} style={{ fontFamily, fontWeight: 700, fontSize: 92, lineHeight: 1.12, letterSpacing: "-0.035em", opacity: k * (latest ? 1 : 0.32), filter: `blur(${(1 - k) * 12}px)`, transform: `translateY(${(1 - k) * 20}px)`, color: "#f5f5f7" }}>
            {label}
          </div>
        );
      })}
    </AbsoluteFill>
  );
}

/** 0 to 350+ while the voice says it. */
function Count({ f }: { f: number }) {
  const from = s(17.25);
  const to = s(20.6);
  if (f < from - 2 || f > to + 12) return null;
  const out = e(f, to, to + 10);
  const n = Math.round(e(f, from + 6, from + 60, 0, 350));
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", opacity: (1 - out) * e(f, from, from + 8), filter: `blur(${out * 14}px)` }}>
      <div style={{ fontFamily, fontWeight: 800, fontSize: 300, letterSpacing: "-0.06em", lineHeight: 1, ...gradText }}>
        {n}
        {n >= 350 ? "+" : ""}
      </div>
      <div style={{ fontFamily, fontWeight: 600, fontSize: 64, letterSpacing: "-0.03em", color: "#f5f5f7", marginTop: 10 }}>homes.</div>
      <div style={{ fontFamily, fontWeight: 400, fontSize: 38, color: "#a1a1a6", marginTop: 26, opacity: e(f, from + 30, from + 44) }}>Leading property operations</div>
    </AbsoluteFill>
  );
}

/** PaMarket, then where it is live. */
function Product({ f }: { f: number }) {
  const from = s(22.81);
  const to = s(25.9);
  if (f < from - 2 || f > to + 12) return null;
  const out = e(f, to, to + 10);
  const k = e(f, from, from + 12);
  const live = e(f, s(24.64), s(24.64) + 10);
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", opacity: 1 - out, filter: `blur(${out * 14 + (1 - k) * 12}px)` }}>
      <div style={{ fontFamily, fontWeight: 800, fontSize: 168, letterSpacing: "-0.05em", color: "#f5f5f7", opacity: k, transform: `scale(${0.96 + k * 0.04})` }}>PaMarket</div>
      <div style={{ fontFamily, fontWeight: 500, fontSize: 52, letterSpacing: "-0.02em", marginTop: 12, opacity: live, ...gradText }}>Live in Zimbabwe.</div>
      <div style={{ display: "flex", gap: 16, marginTop: 40, opacity: live }}>
        {["Web", "iOS", "Android"].map((t) => (
          <div key={t} style={{ fontFamily, fontWeight: 500, fontSize: 30, color: "#d2d2d7", border: "1px solid rgba(255,255,255,0.22)", borderRadius: 999, padding: "10px 26px" }}>{t}</div>
        ))}
      </div>
    </AbsoluteFill>
  );
}

/** "Human, or AI?" turns into "Human, with AI." without moving the first word. */
function OrWith({ f }: { f: number }) {
  const from = s(28.01);
  const swap = s(31.77);
  const to = s(33.5);
  if (f < from - 2 || f > to + 12) return null;
  const out = e(f, to, to + 10);
  const inK = e(f, from, from + 12);
  const sw = e(f, swap - 4, swap + 10);
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", opacity: 1 - out, filter: `blur(${out * 14}px)` }}>
      <div style={{ position: "relative", height: 56, width: 900, marginBottom: 30, fontFamily, fontWeight: 300, fontSize: 40, color: "#a1a1a6", textAlign: "center" }}>
        <div style={{ position: "absolute", inset: 0, opacity: inK * (1 - sw) }}>The best guest experience won&apos;t be</div>
        <div style={{ position: "absolute", inset: 0, opacity: sw }}>It will be</div>
      </div>
      <div style={{ display: "flex", alignItems: "center", fontFamily, fontWeight: 800, fontSize: 132, lineHeight: 1.15, letterSpacing: "-0.045em", color: "#f5f5f7", opacity: inK, filter: `blur(${(1 - inK) * 12}px)` }}>
        <span>Human,&nbsp;</span>
        <span style={{ display: "inline-grid", overflow: "hidden", justifyItems: "center" }}>
          <span style={{ gridArea: "1 / 1", transform: `translateY(${-sw * 100}%)`, opacity: 1 - sw }}>or</span>
          <span style={{ gridArea: "1 / 1", transform: `translateY(${(1 - sw) * 100}%)`, opacity: sw }}>with</span>
        </span>
        <span style={gradText}>&nbsp;AI{sw > 0.5 ? "." : "?"}</span>
      </div>
    </AbsoluteFill>
  );
}

function EndCard({ f }: { f: number }) {
  const from = s(35.9);
  if (f < from) return null;
  const k = e(f, from, from + 16);
  const k2 = e(f, from + 22, from + 38);
  const k3 = e(f, from + 40, from + 56);
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <div style={{ fontFamily, fontWeight: 800, fontSize: 124, letterSpacing: "-0.05em", opacity: k, filter: `blur(${(1 - k) * 14}px)`, ...gradText }}>Prince Chakusa</div>
      <div style={{ fontFamily, fontWeight: 500, fontSize: 40, letterSpacing: "-0.01em", color: "#f5f5f7", marginTop: 22, opacity: k2 }}>Guest experience · Operations · Technology</div>
      <div style={{ fontFamily, fontWeight: 400, fontSize: 34, color: "#a1a1a6", marginTop: 70, opacity: k3 }}>princechakusa.com</div>
    </AbsoluteFill>
  );
}

export function HumanAI() {
  const f = useCurrentFrame();
  // music sits under the voice and opens up for the end card
  const musicVol = (frame: number) =>
    interpolate(frame, [0, 12, s(0), s(35.9), s(36.6), HAI_DUR - 45, HAI_DUR - 1], [0, 0.55, 0.22, 0.22, 0.6, 0.6, 0], clamp);
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Aura f={f} />
      <Phrase f={f} from={s(0)} to={s(1.5)} text="Hospitality is changing." size={128} weight={800} />
      <Phrase f={f} from={s(1.9)} to={s(3.85)} text="AI can answer a guest in seconds." accent={["AI"]} />
      <AiList f={f} />
      <Phrase f={f} from={s(8.83)} to={s(10.45)} text="But there's one thing it can't do." weight={500} size={96} />
      <Phrase f={f} from={s(10.8)} to={s(12.3)} text="Make someone feel looked after." size={118} weight={800} warm />
      <Phrase f={f} from={s(12.65)} to={s(14.0)} text="That part is still human." accent={["human"]} warm />
      <Phrase f={f} from={s(14.67)} to={s(16.7)} text="It started at a front desk in Dubai." weight={500} size={96} />
      <Count f={f} />
      <Phrase f={f} from={s(21.03)} to={s(22.4)} text="I also build software." size={110} weight={800} />
      <Product f={f} />
      <Phrase f={f} from={s(26.32)} to={s(27.6)} text="So I see both sides." size={110} weight={800} />
      <OrWith f={f} />
      <Phrase f={f} from={s(33.99)} to={s(35.6)} text="That's the future I want to help build." weight={500} size={96} accent={["future"]} />
      <EndCard f={f} />
      <Html5Audio src={asset("/reels/human-ai-music.mp3")} volume={musicVol} />
      <Sequence from={Math.round(VO_AT * HAI_FPS)}>
        <Html5Audio src={asset("/reels/human-ai-vo.mp3")} />
      </Sequence>
    </AbsoluteFill>
  );
}
