import type { CSSProperties, ReactNode } from "react";
import { AbsoluteFill, Easing, Html5Audio, Img, OffthreadVideo, Sequence, interpolate, useCurrentFrame } from "remotion";
import { loadFont } from "@remotion/google-fonts/Geist";
import { asset } from "@/lib/site";

/**
 * "Human, with AI" showreel for LinkedIn (4:5). Real footage in every beat (Pexels, free commercial licence),
 * glass UI cards, a live count, PaMarket in a phone, and a split screen, all cut to the ElevenLabs voice and music.
 */

const { fontFamily } = loadFont("normal", { weights: ["400", "500", "700", "800"], subsets: ["latin"] });

export const SR_W = 1080;
export const SR_H = 1350;
export const SR_FPS = 30;
const VO_AT = 0.5;
export const SR_DUR = Math.round(44 * SR_FPS);
const s = (sec: number) => Math.round((sec + VO_AT) * SR_FPS);
const EASE = Easing.bezier(0.2, 0.9, 0.1, 1);
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const e = (f: number, a: number, b: number, from = 0, to = 1) => interpolate(f, [a, b], [from, to], { ...clamp, easing: EASE });

const GRAD = "linear-gradient(90deg, #7fb2ff 0%, #b897ff 45%, #ffa877 100%)";
const grad: CSSProperties = { background: GRAD, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" };
const clip = (k: string) => asset(`/reels/c/${k}.mp4`);

/** A footage shot with a slow push-in, a soft crossfade in and out, and a grade. */
function Shot({ src, from, to, push = 0.1, grade = "", children }: { src: string; from: number; to: number; push?: number; grade?: string; children?: ReactNode }) {
  const f = useCurrentFrame();
  if (f < from - 8 || f > to + 8) return null;
  const k = e(f, from - 8, from + 4) * (1 - e(f, to - 2, to + 8));
  return (
    <AbsoluteFill style={{ opacity: k }}>
      <Sequence from={from - 8} layout="none">
        <OffthreadVideo src={src} muted style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${interpolate(f, [from - 8, to + 8], [1.04, 1.04 + push], clamp)})`, filter: grade }} />
      </Sequence>
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0) 30%, rgba(0,0,0,0.15) 55%, rgba(0,0,0,0.85) 100%)" }} />
      {children}
    </AbsoluteFill>
  );
}

/** Words resolve out of a blur, one after another, in time with the voice. */
function Words({ f, at, text, size = 92, weight = 800, accent = [] as string[], style }: { f: number; at: number; text: string; size?: number; weight?: number; accent?: string[]; style?: CSSProperties }) {
  const words = text.split(" ");
  return (
    <div style={{ fontFamily, fontWeight: weight, fontSize: size, lineHeight: 1.02, letterSpacing: "-0.04em", color: "#fff", textShadow: "0 4px 30px rgba(0,0,0,0.35)", ...style }}>
      {words.map((w, i) => {
        const k = e(f, at + i * 3, at + i * 3 + 10);
        return (
          <span key={i} style={{ display: "inline-block", marginRight: "0.22em", opacity: k, filter: `blur(${(1 - k) * 12}px)`, transform: `translateY(${(1 - k) * 22}px)`, ...(accent.includes(w.replace(/[.,?!]/g, "")) ? grad : {}) }}>
            {w}
          </span>
        );
      })}
    </div>
  );
}

const Bottom = ({ children }: { children: ReactNode }) => <div style={{ position: "absolute", left: 80, right: 80, bottom: 110 }}>{children}</div>;
const Kicker = ({ f, at, children }: { f: number; at: number; children: ReactNode }) => (
  <div style={{ fontFamily, fontWeight: 500, fontSize: 30, letterSpacing: "0.04em", color: "rgba(255,255,255,0.75)", marginBottom: 20, opacity: e(f, at, at + 10) }}>{children}</div>
);

/** Frosted UI card, the kind an AI system would push. */
function Card({ f, at, icon, title, value, top, left, tone = "#7fb2ff" }: { f: number; at: number; icon: string; title: string; value: string; top: number; left: number; tone?: string }) {
  const k = e(f, at, at + 12);
  return (
    <div style={{ position: "absolute", top, left, width: 560, padding: "26px 30px", borderRadius: 28, background: "rgba(20,22,30,0.55)", border: "1px solid rgba(255,255,255,0.18)", backdropFilter: "blur(18px)", boxShadow: "0 20px 60px rgba(0,0,0,0.35)", opacity: k, transform: `translateY(${(1 - k) * 30}px) scale(${0.96 + k * 0.04})`, fontFamily, display: "flex", gap: 22, alignItems: "center" }}>
      <div style={{ width: 64, height: 64, borderRadius: 18, background: tone, display: "grid", placeItems: "center", fontSize: 32, color: "#0b0b10", fontWeight: 800 }}>{icon}</div>
      <div>
        <div style={{ fontSize: 26, color: "rgba(255,255,255,0.7)", fontWeight: 500 }}>{title}</div>
        <div style={{ fontSize: 38, color: "#fff", fontWeight: 700, letterSpacing: "-0.02em" }}>{value}</div>
      </div>
    </div>
  );
}

function ChatBubble({ f, at }: { f: number; at: number }) {
  const msg = "Hi Sara! Check-in is from 3 PM. Your door code is on its way.";
  const n = Math.round(e(f, at + 6, at + 40, 0, msg.length));
  const k = e(f, at, at + 10);
  return (
    <div style={{ position: "absolute", top: 230, right: 70, width: 600, opacity: k, transform: `translateY(${(1 - k) * 24}px)`, fontFamily }}>
      <div style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "8px 16px", borderRadius: 999, background: "rgba(127,178,255,0.25)", border: "1px solid rgba(127,178,255,0.6)", color: "#cfe0ff", fontSize: 24, fontWeight: 600, marginBottom: 14 }}>
        <span style={{ width: 10, height: 10, borderRadius: 5, background: "#7fb2ff" }} /> AI reply · 0.8s
      </div>
      <div style={{ padding: "24px 28px", borderRadius: "28px 28px 8px 28px", background: "rgba(255,255,255,0.92)", color: "#111", fontSize: 34, lineHeight: 1.3, fontWeight: 500, boxShadow: "0 20px 60px rgba(0,0,0,0.35)" }}>
        {msg.slice(0, n)}
        <span style={{ opacity: f % 20 < 10 ? 1 : 0 }}>|</span>
      </div>
    </div>
  );
}

/** 350 units lighting up, then the number. */
function Units({ f, at }: { f: number; at: number }) {
  const lit = e(f, at + 4, at + 70, 0, 350);
  const n = Math.round(lit);
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(25, 22px)", gap: 8, opacity: 0.9, marginBottom: 40 }}>
        {Array.from({ length: 350 }, (_, i) => (
          <div key={i} style={{ width: 22, height: 22, borderRadius: 5, background: i < lit ? (i % 23 === 0 ? "#ffa877" : "#ffe3b3") : "rgba(255,255,255,0.12)", boxShadow: i < lit ? "0 0 10px rgba(255,214,150,0.6)" : "none" }} />
        ))}
      </div>
      <div style={{ fontFamily, fontWeight: 800, fontSize: 220, letterSpacing: "-0.06em", lineHeight: 0.9, ...grad }}>
        {n}
        {n >= 350 ? "+" : ""}
      </div>
      <div style={{ fontFamily, fontWeight: 700, fontSize: 52, color: "#fff", letterSpacing: "-0.03em", marginTop: 8 }}>homes. One standard.</div>
      <div style={{ display: "flex", gap: 16, marginTop: 28, opacity: e(f, at + 50, at + 62) }}>
        {["Team of 12", "DTCM compliance", "SOPs & SLAs"].map((t) => (
          <div key={t} style={{ fontFamily, fontWeight: 600, fontSize: 28, color: "#fff", padding: "10px 22px", borderRadius: 999, background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.25)" }}>{t}</div>
        ))}
      </div>
    </AbsoluteFill>
  );
}

/** PaMarket in a phone, screens scrolling. */
function Phone({ f, at }: { f: number; at: number }) {
  const k = e(f, at, at + 14);
  const screens = ["splash", "web-mobile", "account"].map((n) => asset(`/pamarket/${n === "web-mobile" ? "web-mobile" : `pamarket-${n}`}.jpg`));
  const idx = Math.min(2, Math.floor((f - at) / 32));
  return (
    <div style={{ position: "absolute", right: 90, top: 150, width: 400, height: 830, borderRadius: 60, background: "#0b0b0f", padding: 14, boxShadow: "0 40px 120px rgba(0,0,0,0.6), 0 0 0 2px rgba(255,255,255,0.15)", opacity: k, transform: `translateY(${(1 - k) * 60}px) rotate(${(1 - k) * 4 + 3}deg)` }}>
      <div style={{ width: "100%", height: "100%", borderRadius: 48, overflow: "hidden", position: "relative", background: "#fff" }}>
        {screens.map((src, i) => (
          <Img key={src} src={src} style={{ position: "absolute", inset: 0, width: "100%", height: "auto", opacity: i === Math.max(0, idx) ? 1 : 0, transform: `translateY(${-e(f, at + i * 32, at + i * 32 + 32, 0, 120)}px)` }} />
        ))}
      </div>
    </div>
  );
}

function OrWith({ f, from, swap }: { f: number; from: number; swap: number }) {
  const inK = e(f, from, from + 12);
  const sw = e(f, swap - 4, swap + 10);
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <div style={{ position: "relative", height: 50, width: 900, marginBottom: 24, fontFamily, fontWeight: 500, fontSize: 36, color: "rgba(255,255,255,0.8)", textAlign: "center" }}>
        <div style={{ position: "absolute", inset: 0, opacity: inK * (1 - sw) }}>The best guest experience won&apos;t be</div>
        <div style={{ position: "absolute", inset: 0, opacity: sw }}>It will be</div>
      </div>
      <div style={{ display: "flex", alignItems: "center", fontFamily, fontWeight: 800, fontSize: 124, lineHeight: 1.15, letterSpacing: "-0.045em", color: "#fff", opacity: inK, textShadow: "0 6px 40px rgba(0,0,0,0.4)" }}>
        <span>Human,&nbsp;</span>
        <span style={{ display: "inline-grid", overflow: "hidden", justifyItems: "center" }}>
          <span style={{ gridArea: "1 / 1", transform: `translateY(${-sw * 100}%)`, opacity: 1 - sw }}>or</span>
          <span style={{ gridArea: "1 / 1", transform: `translateY(${(1 - sw) * 100}%)`, opacity: sw }}>with</span>
        </span>
        <span style={grad}>&nbsp;AI{sw > 0.5 ? "." : "?"}</span>
      </div>
    </AbsoluteFill>
  );
}

export function Showreel() {
  const f = useCurrentFrame();
  const musicVol = (fr: number) => interpolate(fr, [0, 10, s(0), s(35.9), s(36.6), SR_DUR - 45, SR_DUR - 1], [0, 0.6, 0.24, 0.24, 0.65, 0.65, 0], clamp);
  const warm = "saturate(1.1) sepia(0.18) brightness(0.95)";
  const cool = "saturate(0.9) hue-rotate(-8deg) brightness(0.85)";
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      {/* 1. hook */}
      <Shot src={clip("a-marina")} from={0} to={s(1.85)} push={0.16}>
        <Bottom>
          <Kicker f={f} at={4}>Hospitality · 2026</Kicker>
          <Words f={f} at={s(0)} text="Hospitality is changing." size={112} accent={["changing"]} />
        </Bottom>
      </Shot>

      {/* 2. AI answers */}
      <Shot src={clip("b-phone")} from={s(1.85)} to={s(4.2)} grade={cool}>
        <ChatBubble f={f} at={s(1.9)} />
        <Bottom>
          <Words f={f} at={s(1.9)} text="AI can answer a guest in seconds." size={84} accent={["AI"]} />
        </Bottom>
      </Shot>

      {/* 3. what AI can already do */}
      <Shot src={clip("c-apartment")} from={s(4.2)} to={s(5.7)} grade={cool}>
        <Card f={f} at={s(4.27)} icon="↗" title="Dynamic pricing" value="AED 640 → 720 / night" top={250} left={80} />
        <Bottom><Words f={f} at={s(4.27)} text="Price a room." size={96} /></Bottom>
      </Shot>
      <Shot src={clip("d-bed")} from={s(5.7)} to={s(7.1)} grade={cool}>
        <Card f={f} at={s(5.72)} icon="✓" title="Housekeeping" value="Clean scheduled · 11:00" top={250} left={80} tone="#8ef0c0" />
        <Bottom><Words f={f} at={s(5.72)} text="Schedule a clean." size={96} /></Bottom>
      </Shot>
      <Shot src={clip("c-apartment")} from={s(7.1)} to={s(8.7)} push={0.2} grade={cool}>
        <Card f={f} at={s(7.17)} icon="!" title="Maintenance alert" value="AC fault · Unit 1204" top={250} left={80} tone="#ffa877" />
        <Bottom><Words f={f} at={s(7.17)} text="Flag a problem." size={96} /></Bottom>
      </Shot>

      {/* 4. the turn: a breath of black */}
      {f >= s(8.7) && f < s(10.75) && (
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", padding: 90, opacity: 1 - e(f, s(10.5), s(10.75)) }}>
          <Words f={f} at={s(8.83)} text="But there's one thing it can't do." size={88} weight={700} style={{ textAlign: "center" }} />
        </AbsoluteFill>
      )}

      {/* 5. the human part */}
      <Shot src={clip("d-bed")} from={s(10.75)} to={s(14.6)} push={0.12} grade={warm}>
        <Bottom>
          <Words f={f} at={s(10.8)} text="Make someone feel looked after." size={96} />
          <div style={{ height: 18 }} />
          <Words f={f} at={s(12.65)} text="That part is still human." size={64} weight={700} accent={["human"]} />
        </Bottom>
      </Shot>

      {/* 6. his story */}
      <Shot src={clip("f-lobby")} from={s(14.6)} to={s(17.1)} grade={warm}>
        <div style={{ position: "absolute", left: 80, top: 120, fontFamily, opacity: e(f, s(14.8), s(15.2)), display: "flex", gap: 14, alignItems: "center" }}>
          <div style={{ width: 6, height: 70, background: GRAD, borderRadius: 3 }} />
          <div>
            <div style={{ fontSize: 26, color: "rgba(255,255,255,0.75)", fontWeight: 500 }}>Prince Chakusa · 2023</div>
            <div style={{ fontSize: 36, color: "#fff", fontWeight: 700 }}>Guest Relations · Dubai</div>
          </div>
        </div>
        <Bottom><Words f={f} at={s(14.67)} text="It started at a front desk in Dubai." size={84} /></Bottom>
      </Shot>
      <Shot src={clip("g-citynight")} from={s(17.1)} to={s(20.9)} push={0.08}>
        <Units f={f} at={s(17.25)} />
      </Shot>

      {/* 7. the builder */}
      <Shot src={clip("h-coding")} from={s(20.9)} to={s(22.7)} grade={cool}>
        <div style={{ position: "absolute", top: 150, left: 80, fontFamily: "monospace", fontSize: 26, lineHeight: 1.6, color: "#9fe7ff", opacity: e(f, s(21.1), s(21.5)) }}>
          {["const guest = await booking.next();", "if (guest.needs) team.notify(guest);", "deploy(\"pamarket\", { live: true });"].map((l, i) => (
            <div key={i} style={{ opacity: e(f, s(21.1) + i * 8, s(21.1) + i * 8 + 8) }}>{l}</div>
          ))}
        </div>
        <Bottom><Words f={f} at={s(21.03)} text="I also build software." size={100} accent={["software"]} /></Bottom>
      </Shot>
      {f >= s(22.6) && f < s(26.3) && (
        <AbsoluteFill style={{ background: "radial-gradient(circle at 70% 40%, #1d2340 0%, #07080d 70%)", opacity: e(f, s(22.6), s(22.85)) * (1 - e(f, s(26.0), s(26.3))) }}>
          <Phone f={f} at={s(22.7)} />
          <div style={{ position: "absolute", left: 70, top: 330, width: 480 }}>
            <Words f={f} at={s(22.81)} text="PaMarket." size={92} />
            <div style={{ fontFamily, fontSize: 40, fontWeight: 600, marginTop: 16, opacity: e(f, s(24.64), s(24.64) + 10), ...grad }}>Live in Zimbabwe.</div>
            <div style={{ fontFamily, fontSize: 30, color: "rgba(255,255,255,0.75)", marginTop: 26, lineHeight: 1.5, opacity: e(f, s(24.9), s(24.9) + 12) }}>
              Marketplace and jobs board<br />Web · iOS · Android<br />Designed and built by me
            </div>
          </div>
        </AbsoluteFill>
      )}

      {/* 8. both sides: split screen */}
      {f >= s(26.2) && f < s(28.1) && (
        <AbsoluteFill style={{ flexDirection: "row", opacity: e(f, s(26.2), s(26.4)) * (1 - e(f, s(27.9), s(28.1))) }}>
          {[["f-lobby", "Operations", warm], ["h-coding", "Technology", cool]].map(([k, label, g], i) => (
            <div key={k} style={{ width: 540, height: SR_H, overflow: "hidden", position: "relative", borderRight: i === 0 ? "3px solid rgba(255,255,255,0.8)" : "none" }}>
              <Sequence from={s(26.2)} layout="none">
                <OffthreadVideo src={clip(k)} muted style={{ width: 1080, height: SR_H, objectFit: "cover", marginLeft: -270, filter: g }} />
              </Sequence>
              <div style={{ position: "absolute", left: 0, right: 0, top: 120, textAlign: "center", fontFamily, fontWeight: 800, fontSize: 54, color: "#fff", letterSpacing: "-0.03em", textShadow: "0 4px 30px rgba(0,0,0,0.6)", opacity: e(f, s(26.35) + i * 6, s(26.35) + i * 6 + 10) }}>{label}</div>
            </div>
          ))}
          <AbsoluteFill style={{ background: "linear-gradient(180deg, transparent 60%, rgba(0,0,0,0.85))" }} />
          <Bottom><Words f={f} at={s(26.32)} text="So I see both sides." size={96} style={{ textAlign: "center" }} /></Bottom>
        </AbsoluteFill>
      )}

      {/* 9. the line */}
      <Shot src={clip("i-team")} from={s(28.0)} to={s(33.9)} push={0.1} grade="brightness(0.6) saturate(0.95)">
        <OrWith f={f} from={s(28.01)} swap={s(31.77)} />
      </Shot>

      {/* 10. the future + end card */}
      <Shot src={clip("j-sunrise")} from={s(33.9)} to={SR_DUR + 20} push={0.14} grade="brightness(0.8) saturate(1.15)">
        {f < s(36) && (
          <Bottom><Words f={f} at={s(33.99)} text="That's the future I want to help build." size={80} accent={["future"]} /></Bottom>
        )}
        {f >= s(35.9) && (
          <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", background: `rgba(0,0,0,${e(f, s(35.9), s(36.6), 0, 0.55)})` }}>
            <div style={{ fontFamily, fontWeight: 800, fontSize: 120, letterSpacing: "-0.05em", opacity: e(f, s(35.95), s(36.5)), filter: `blur(${(1 - e(f, s(35.95), s(36.5))) * 14}px)`, ...grad }}>Prince Chakusa</div>
            <div style={{ fontFamily, fontWeight: 600, fontSize: 38, color: "#fff", marginTop: 18, opacity: e(f, s(36.6), s(37.1)) }}>Guest Experience · Operations · Technology</div>
            <div style={{ display: "flex", gap: 14, marginTop: 40, opacity: e(f, s(37.2), s(37.7)) }}>
              {["350+ homes", "Team of 12", "PaMarket"].map((t) => (
                <div key={t} style={{ fontFamily, fontWeight: 600, fontSize: 28, color: "#fff", padding: "10px 22px", borderRadius: 999, background: "rgba(255,255,255,0.14)", border: "1px solid rgba(255,255,255,0.3)" }}>{t}</div>
              ))}
            </div>
            <div style={{ fontFamily, fontWeight: 500, fontSize: 34, color: "rgba(255,255,255,0.85)", marginTop: 70, opacity: e(f, s(37.8), s(38.3)) }}>princechakusa.com</div>
          </AbsoluteFill>
        )}
      </Shot>

      {/* vignette over everything */}
      <AbsoluteFill style={{ pointerEvents: "none", boxShadow: "inset 0 0 220px rgba(0,0,0,0.55)" }} />

      <Html5Audio src={asset("/reels/human-ai-music.mp3")} volume={musicVol} />
      <Sequence from={Math.round(VO_AT * SR_FPS)}>
        <Html5Audio src={asset("/reels/human-ai-vo.mp3")} />
      </Sequence>
    </AbsoluteFill>
  );
}
