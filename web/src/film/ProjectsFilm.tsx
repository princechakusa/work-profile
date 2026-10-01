import { Img, useCurrentFrame } from "remotion";
import { C, Chips, F, Header, Narration, PRINCE, Person, Scenes, Stage, Svg, lin, noise, part, ramp, talking, timeline, type Timeline } from "./kit";
import { asset } from "@/lib/site";

/** The Projects film is about PaMarket only: why it exists, what it does, where it runs and who it helps. Real screenshots throughout. */

const T_WHY = timeline(["p1", "p2", "p3"]);
const T_WHAT = timeline(["p4", "p5"]);
const T_WHERE = timeline(["p6", "p7"]);
const T_MORE = timeline(["m1"]);

const WHY = T_WHY.end + 14;
const WHAT = T_WHAT.end + 10;
const WHERE = T_WHERE.end + 10;
const MORE = T_MORE.end + 30;
export const PROJECTS_DUR = WHY + WHAT + WHERE + MORE;
/** Poster: the real website with the feature list. */
export const PROJECTS_POSTER = WHY + WHAT - 20;

const speak = (t: Timeline, f: number) => t.list.reduce((m, c) => m + talking(f, c.from, c.to), 0);

const POSTS = ["Selling: phone", "Anyone hiring?", "Car for sale", "Need a plumber", "Flat to rent", "Looking for work"];

/** A phone with a real screenshot inside. */
function Phone({ src, x, y, w, opacity = 1, lift = 0 }: { src: string; x: number; y: number; w: number; opacity?: number; lift?: number }) {
  return (
    <div style={{ position: "absolute", left: x, top: y + lift, width: w, height: w * 2.05, padding: 12, borderRadius: 44, background: "#0e1015", border: `3px solid ${C.sand}`, opacity, boxShadow: "0 30px 80px rgba(0,0,0,0.6)" }}>
      <Img src={src} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top", borderRadius: 32 }} />
    </div>
  );
}

function Why() {
  const f = useCurrentFrame();
  const { p2, p3 } = T_WHY.cue;
  const into = part(p3, 0.1);
  return (
    <Stage frame={f}>
      <Svg>
        <Person {...PRINCE} frame={f} x={300} s={1.15} reach={ramp(f, into, into + 14)} talk={speak(T_WHY, f)} />
      </Svg>
      <Header frame={f} kicker="My project · Live" title="PaMarket" sub="Zimbabwe's online marketplace" />
      <div style={{ position: "absolute", left: 640, top: 370, width: 1180, display: "flex", flexDirection: "column", gap: 18, opacity: ramp(f, 16, 32) * lin(f, p2.from - 6, p2.from + 6, 1, 0) }}>
        <div style={{ fontSize: 48, lineHeight: 1.2 }}>An online marketplace that I designed and built for Zimbabwe.</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 14 }}>
          {["Buy and sell", "Find work", "Cars", "Verified businesses", "Web, iPhone and Android"].map((t, i) => (
            <span key={t} style={{ fontFamily: F.mono, fontSize: 24, letterSpacing: "0.06em", textTransform: "uppercase", padding: "12px 20px", border: `2px solid ${C.signal}`, opacity: ramp(f, 40 + i * 10, 54 + i * 10) }}>
              {t}
            </span>
          ))}
        </div>
      </div>
      <div style={{ position: "absolute", left: 640, top: 330, fontFamily: F.mono, fontSize: 22, letterSpacing: "0.1em", color: C.steel, opacity: ramp(f, p2.from, p2.from + 14) * lin(f, into, into + 14, 1, 0) }}>
        BEFORE: SCATTERED ACROSS GROUP CHATS
      </div>
      <Phone src={asset("/pamarket/pamarket-splash.jpg")} x={1400} y={250} w={300} opacity={ramp(f, into + 30, into + 50)} />
      {POSTS.map((t, i) => {
        const m = ramp(f, into + i * 4, into + 30 + i * 4);
        const sx = 660 + noise(i + 3) * 520 + Math.sin(f * 0.05 + i * 1.7) * 18;
        const sy = 400 + noise(i + 11) * 330 + Math.cos(f * 0.06 + i) * 14;
        return (
          <div
            key={t}
            style={{
              position: "absolute", left: sx + (1450 - sx) * m, top: sy + (560 - sy) * m, whiteSpace: "nowrap", scale: 1 - 0.7 * m,
              padding: "12px 20px", borderRadius: 18, fontSize: 30, background: C.ink, border: `2px solid ${C.line}`,
              opacity: ramp(f, p2.from + i * 8, p2.from + 14 + i * 8) * lin(f, into + 26, into + 40, 1, 0), rotate: `${(noise(i + 5) - 0.5) * 16 * (1 - m)}deg`,
            }}
          >
            {t}
          </div>
        );
      })}
      <Narration t={T_WHY} frame={f} />
    </Stage>
  );
}

const FEATURES = ["Marketplace · 10 provinces", "Jobs", "Cars for sale and rental", "Verified businesses"];

function What() {
  const f = useCurrentFrame();
  const { p4, p5 } = T_WHAT.cue;
  const p = ramp(f, 4, 30);
  return (
    <Stage frame={f}>
      <Header frame={f} kicker="What it does" title="One trusted place" sub="pamarketzw.com" />
      {/* the real website in a browser frame */}
      <div style={{ position: "absolute", left: 100, top: 340, width: 1060, border: `3px solid ${C.sand}`, borderRadius: 16, overflow: "hidden", background: "#0e1015", opacity: p, translate: `${(1 - p) * -80}px 0`, boxShadow: "0 30px 80px rgba(0,0,0,0.6)" }}>
        <div style={{ display: "flex", gap: 10, padding: "14px 18px", borderBottom: `2px solid ${C.line}` }}>
          {[0, 1, 2].map((i) => <div key={i} style={{ width: 14, height: 14, borderRadius: 7, background: C.line }} />)}
        </div>
        <Img src={asset("/pamarket/web-desktop.jpg")} style={{ display: "block", width: "100%" }} />
      </div>
      <div style={{ position: "absolute", left: 1230, top: 340, width: 600, display: "flex", flexDirection: "column", gap: 16 }}>
        {FEATURES.map((t, i) => {
          const q = ramp(f, part(p4, 0.18 + i * 0.18), part(p4, 0.18 + i * 0.18) + 14);
          return (
            <div key={t} style={{ padding: "18px 24px", border: `2px solid ${C.signal}`, fontSize: 34, opacity: q, translate: `${(1 - q) * 40}px 0` }}>
              {t}
            </div>
          );
        })}
        <div style={{ display: "flex", gap: 16 }}>
          {["USD or ZiG", "Fraud screening"].map((t, i) => {
            const q = ramp(f, part(p5, 0.1 + i * 0.5), part(p5, 0.1 + i * 0.5) + 14);
            return (
              <div key={t} style={{ flex: 1, padding: "18px 24px", background: C.signal, color: C.ink, fontSize: 32, fontWeight: 600, opacity: q }}>
                {t}
              </div>
            );
          })}
        </div>
      </div>
      <Narration t={T_WHAT} frame={f} />
    </Stage>
  );
}

const HELPS = [
  { t: "Buyers", d: "Find what they need, safely" },
  { t: "Sellers", d: "Reach the whole country" },
  { t: "Job seekers", d: "Real vacancies in one place" },
];

function Where() {
  const f = useCurrentFrame();
  const { p6, p7 } = T_WHERE.cue;
  return (
    <Stage frame={f}>
      <Header frame={f} kicker="Where it runs" title="Web, iPhone and Android" sub="Live today" />
      {[asset("/pamarket/web-mobile.jpg"), asset("/pamarket/pamarket-splash.jpg"), asset("/pamarket/pamarket-account.jpg")].map((src, i) => {
        const q = ramp(f, 6 + i * 8, 34 + i * 8);
        return <Phone key={src} src={src} x={110 + i * 290} y={330} w={250} opacity={q} lift={(1 - q) * 80} />;
      })}
      <Chips frame={f} at={part(p6, 0.2)} x={1030} y={350} lead="Live on" items={["Web", "App Store", "Google Play"]} />
      <div style={{ position: "absolute", left: 1030, top: 460, width: 800, display: "flex", flexDirection: "column", gap: 18 }}>
        {HELPS.map((h, i) => {
          const q = ramp(f, part(p7, 0.1 + i * 0.28), part(p7, 0.1 + i * 0.28) + 16);
          return (
            <div key={h.t} style={{ display: "flex", alignItems: "baseline", gap: 24, padding: "20px 26px", border: `2px solid ${C.line}`, opacity: q, translate: `${(1 - q) * 40}px 0` }}>
              <span style={{ fontFamily: F.display, fontWeight: 900, fontSize: 60, textTransform: "uppercase", color: C.signal, width: 330 }}>{h.t}</span>
              <span style={{ fontSize: 32 }}>{h.d}</span>
            </div>
          );
        })}
      </div>
      <Narration t={T_WHERE} frame={f} />
    </Stage>
  );
}

function More() {
  const f = useCurrentFrame();
  return (
    <Stage frame={f}>
      <Svg>
        <Person {...PRINCE} frame={f} x={520} s={1.5} wave={ramp(f, 8, 20)} talk={speak(T_MORE, f)} />
      </Svg>
      <div style={{ position: "absolute", left: 860, top: 330, maxWidth: 960 }}>
        <div style={{ fontFamily: F.display, fontWeight: 900, fontSize: 120, lineHeight: 0.92, textTransform: "uppercase", opacity: ramp(f, 10, 26), translate: `0 ${ramp(f, 10, 30, 40, 0)}px` }}>
          Explore PaMarket below.
        </div>
        <div style={{ fontSize: 80, color: C.signal, marginTop: 10, opacity: ramp(f, 30, 44), translate: `0 ${Math.sin(f * 0.25) * 8}px` }}>↓</div>
      </div>
      <Narration t={T_MORE} frame={f} />
    </Stage>
  );
}

export function ProjectsFilm() {
  return <Scenes scenes={[[Why, WHY], [What, WHAT], [Where, WHERE], [More, MORE]]} />;
}
