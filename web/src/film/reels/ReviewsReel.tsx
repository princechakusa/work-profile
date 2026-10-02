import type { CSSProperties, ReactNode } from "react";
import { AbsoluteFill, Html5Audio, Sequence, interpolate, useCurrentFrame } from "remotion";
import { asset } from "@/lib/site";
import cues from "./reviews-cues.json";
import { Edit, split, type ShotSpec } from "./motion";
import { clamp, e, fontFamily } from "./Showreel";

/**
 * "Read the reviews properly": LinkedIn reel #2 (4:5), voiced in Prince's confident cloned voice.
 * v2 (2026-10-02): its own footage (see footage.json; nothing shared with the showreel), its own teal and amber
 * look, its own music (Mixkit "Digital Clouds", ~129 BPM, free licence), and the motion kit: a camera move on
 * every shot, motion-matched cuts every 1.5 to 2.5 seconds.
 * reviews-cues.json holds where each narrated line starts and ends (seconds, from the voice track).
 */

export const RV_W = 1080;
export const RV_H = 1350;
export const RV_FPS = 30;
const LEAD = 0.5; // music before the first word
const C = cues.lines as { start: number; end: number; text: string }[];
export const RV_DUR = Math.round((C[C.length - 1].end + LEAD + 5) * RV_FPS);
const at = (i: number) => Math.round((C[i].start + LEAD) * RV_FPS);
const till = (i: number) => (i >= C.length - 1 ? RV_DUR : Math.round((C[i + 1].start + LEAD) * RV_FPS));
const clip = (k: string) => asset(`/reels/c/${k}.mp4`);

// this video's look: teal into amber, warm whites
const TEAL = "#3fe0c5";
const AMBER = "#f7b955";
const GRADIENT = `linear-gradient(90deg, ${TEAL} 0%, ${AMBER} 100%)`;
const gradText: CSSProperties = { background: GRADIENT, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" };
const warm = "saturate(1.08) contrast(1.05) brightness(0.92)";
const cool = "saturate(0.95) contrast(1.08) brightness(0.86) hue-rotate(-6deg)";

/** A narrated line: words rise out of a mask with a slight tilt, then the block keeps drifting until it leaves. */
function Line({ i, size = 92, accent = [], top, style }: { i: number; size?: number; accent?: string[]; top?: number; style?: CSSProperties }) {
  const f = useCurrentFrame();
  const a = at(i);
  const b = till(i);
  if (f < a - 2 || f > b) return null;
  const leave = e(f, b - 7, b);
  const drift = interpolate(f, [a, b], [0, -18], clamp);

  return (
    <div style={{ position: "absolute", left: 70, right: 70, ...(top !== undefined ? { top } : { bottom: 120 }), transform: `translateY(${drift}px)`, opacity: 1 - leave, filter: `blur(${leave * 10}px)`, ...style }}>
      <div style={{ fontFamily, fontWeight: 800, fontSize: size, lineHeight: 1.04, letterSpacing: "-0.035em", color: "#fff", textShadow: "0 6px 30px rgba(0,0,0,0.45)" }}>
        {C[i].text.split(" ").map((w, k) => {
          const q = e(f, a + k * 2.5, a + k * 2.5 + 9);
          const hit = accent.includes(w.replace(/[.,?!]/g, ""));
          return (
            <span key={k} style={{ display: "inline-block", overflow: "hidden", verticalAlign: "bottom", marginRight: "0.22em", paddingBottom: "0.08em" }}>
              <span style={{ display: "inline-block", transform: `translateY(${(1 - q) * 105}%) rotate(${(1 - q) * 6}deg)`, ...(hit ? gradText : {}) }}>{w}</span>
            </span>
          );
        })}
      </div>
    </div>
  );
}

/** Small label over the first shot. */
function Kicker({ children }: { children: ReactNode }) {
  const f = useCurrentFrame();
  const q = e(f, 6, 20);
  return (
    <div style={{ position: "absolute", top: 90, left: 70, fontFamily, fontWeight: 700, fontSize: 26, letterSpacing: "0.18em", textTransform: "uppercase", color: TEAL, opacity: q, transform: `translateX(${(1 - q) * -30}px)` }}>
      {children}
    </div>
  );
}

function Review({ start, stars, text, top, left, tilt }: { start: number; stars: number; text: string; top: number; left: number; tilt: number }) {
  const f = useCurrentFrame();
  const q = e(f, start, start + 12);
  const float = Math.sin((f - start) / 14) * 6;
  return (
    <div style={{ position: "absolute", top: top + float, left, width: 580, padding: "22px 28px", borderRadius: 24, background: "rgba(255,255,255,0.95)", boxShadow: "0 24px 70px rgba(0,0,0,0.45)", opacity: q, transform: `translateX(${(1 - q) * (left > 300 ? 120 : -120)}px) rotate(${tilt * q}deg) scale(${0.9 + 0.1 * q})`, fontFamily }}>
      <div style={{ fontSize: 34, letterSpacing: 4, color: stars < 3 ? "#ff5a4f" : "#f5b400" }}>
        {"★".repeat(stars)}
        <span style={{ color: "#ccc" }}>{"★".repeat(5 - stars)}</span>
      </div>
      <div style={{ fontSize: 30, color: "#222", fontWeight: 500, marginTop: 8 }}>{text}</div>
    </div>
  );
}

/** A number that counts up while the camera pushes in on it. */
function Count({ start, to, prefix = "", suffix, label, sub }: { start: number; to: number; prefix?: string; suffix: string; label: string; sub?: string }) {
  const f = useCurrentFrame();
  const n = Math.round(e(f, start + 2, start + 14, 0, to)); // lands within the shortest count shot
  const q = e(f, start, start + 10);
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", paddingBottom: 200, transform: `scale(${0.85 + 0.15 * q + interpolate(f, [start, start + 90], [0, 0.06], clamp)})`, opacity: q }}>
      <div style={{ fontFamily, fontWeight: 800, fontSize: 250, letterSpacing: "-0.06em", lineHeight: 0.9, ...gradText }}>
        {prefix}
        {n}
        {n >= to ? suffix : ""}
      </div>
      <div style={{ fontFamily, fontWeight: 700, fontSize: 48, color: "#fff", letterSpacing: "-0.02em", marginTop: 10 }}>{label}</div>
      {sub && <div style={{ fontFamily, fontWeight: 500, fontSize: 30, color: "rgba(255,255,255,0.78)", marginTop: 10, opacity: e(f, start + 18, start + 30) }}>{sub}</div>}
    </AbsoluteFill>
  );
}

const TAGS = ["Check-in", "Cleaning", "Response time", "Noise", "Amenities"];
const TAG_COLOURS = [TEAL, AMBER, "#ff8f6b", "#9fd7ff", "#c8f277"];

export function ReviewsReel() {
  const f = useCurrentFrame();
  const musicVol = (fr: number) => interpolate(fr, [0, 10, at(0), at(C.length - 1), at(C.length - 1) + 20, RV_DUR - 45, RV_DUR - 1], [0, 0.6, 0.07, 0.07, 0.6, 0.6, 0], clamp); // music sits about 10 dB under the voice

  // the long lines get more than one shot, so the picture keeps moving
  const [l2a, l2b] = split(till(1), till(2), 2);
  const [l8a, l8b] = split(till(7), till(8), 2);
  const [l9a, l9c, l9b] = split(till(8), till(9), 3);


  const methodIn = e(f, till(2) - 2, till(2) + 10);
  const methodOut = e(f, till(3) - 4, till(3) + 4);

  // each beat's graphics ride inside its shot, so they leave with that shot's transition
  const g_reviews = (
<>
        <>
          <Review start={at(1)} stars={1} text="The AC wasn't working. Nobody replied." top={180} left={60} tilt={-3} />
          <div style={{ opacity: 0.5 }}>
            <Review start={at(1) + 12} stars={5} text="Spotless, and check-in was so easy." top={400} left={440} tilt={3} />
          </div>
        </>
</>
  );
  const g_count200 = (
<Count start={l2b[0]} to={200} suffix="+" label="guest reviews analysed" sub="across a 40-property portfolio" />
  );
  const g_method = (
<>
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", opacity: methodIn * (1 - methodOut), transform: `scale(${0.9 + 0.1 * methodIn + 0.06 * methodOut})` }}>
          <div style={{ fontFamily, fontWeight: 800, fontSize: 150, letterSpacing: "-0.05em", color: "#fff" }}>
            The <span style={gradText}>method.</span>
          </div>
          <div style={{ display: "flex", gap: 14, marginTop: 30 }}>
            {["Tag", "Count", "Fix", "Tell"].map((t, k) => {
              const q = e(f, at(3) + 4 + k * 4, at(3) + 14 + k * 4);
              return (
                <div key={t} style={{ fontFamily, fontWeight: 700, fontSize: 32, color: "#0b0b10", padding: "12px 26px", borderRadius: 999, background: k % 2 ? AMBER : TEAL, opacity: q, transform: `translateY(${(1 - q) * 40}px) rotate(${(1 - q) * (k % 2 ? 10 : -10)}deg)` }}>
                  {k + 1}. {t}
                </div>
              );
            })}
          </div>
        </AbsoluteFill>
</>
  );
  const g_tags = (
<>
        <div style={{ position: "absolute", top: 170, left: 70, right: 70, display: "flex", flexWrap: "wrap", gap: 14 }}>
          {TAGS.map((t, k) => {
            const q = e(f, at(4) + k * 4, at(4) + k * 4 + 9);
            return (
              <div key={t} style={{ fontFamily, fontWeight: 700, fontSize: 34, color: "#0b0b10", padding: "12px 24px", borderRadius: 14, background: TAG_COLOURS[k], opacity: q, transform: `scale(${0.6 + 0.4 * q}) rotate(${(k % 2 ? 1 : -1) * 3 * q}deg)` }}>
                # {t}
              </div>
            );
          })}
        </div>
</>
  );
  const g_bars = (
<>
        <div style={{ position: "absolute", top: 160, left: 80, right: 80, display: "flex", alignItems: "flex-end", gap: 22, height: 420 }}>
          {[9, 14, 6, 4, 3].map((v, k) => (
            <div key={k} style={{ flex: 1, textAlign: "center", fontFamily }}>
              <div style={{ fontSize: 30, fontWeight: 700, color: "#fff", opacity: e(f, at(5) + 12 + k * 3, at(5) + 20 + k * 3) }}>{v}</div>
              <div style={{ height: 24 * v * e(f, at(5) + k * 3, at(5) + 18 + k * 3), borderRadius: 10, background: k === 1 ? GRADIENT : "rgba(255,255,255,0.4)" }} />
              <div style={{ fontSize: 20, color: "rgba(255,255,255,0.85)", marginTop: 8 }}>{TAGS[k]}</div>
            </div>
          ))}
        </div>
</>
  );
  const g_top3 = (
<>
        <div style={{ position: "absolute", top: 170, left: 70, fontFamily }}>
          {["Cleaning details", "Check-in clarity", "Reply speed"].map((t, k) => {
            const q = e(f, at(6) + k * 5, at(6) + k * 5 + 10);
            return (
              <div key={t} style={{ display: "flex", alignItems: "center", gap: 18, marginBottom: 16, opacity: q, transform: `translateX(${(1 - q) * -60}px)` }}>
                <div style={{ width: 62, height: 62, borderRadius: 31, background: GRADIENT, display: "grid", placeItems: "center", fontSize: 32, fontWeight: 800, color: "#0b0b10" }}>{k + 1}</div>
                <div style={{ fontSize: 40, fontWeight: 700, color: "#fff", textShadow: "0 4px 20px rgba(0,0,0,0.6)" }}>{t}</div>
              </div>
            );
          })}
        </div>
</>
  );
  const g_update = (
<>
        <div style={{ position: "absolute", top: 180, left: 70, padding: "20px 26px", borderRadius: 22, background: "rgba(10,14,18,0.72)", border: `2px solid ${TEAL}`, fontFamily, opacity: e(f, at(7) + 4, at(7) + 14), transform: `translateY(${(1 - e(f, at(7) + 4, at(7) + 14)) * -40}px)` }}>
          <div style={{ fontSize: 22, letterSpacing: "0.14em", textTransform: "uppercase", color: TEAL, fontWeight: 700 }}>Team update</div>
          <div style={{ fontSize: 36, color: "#fff", fontWeight: 700, marginTop: 6 }}>New check-in steps live today</div>
        </div>
</>
  );
  const g_count25 = (
<Count start={l9b[0]} to={25} prefix="+" suffix="%" label="guest review scores" sub="after redesigning check-in" />
  );
  const g_endcard = (
<>
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", background: `rgba(0,0,0,${e(f, at(12) - 4, at(12) + 16, 0, 0.45)})` }}>
          <div style={{ fontFamily, fontWeight: 800, fontSize: 118, letterSpacing: "-0.05em", opacity: e(f, at(12), at(12) + 14), transform: `scale(${1.1 - 0.1 * e(f, at(12), at(12) + 20)})`, filter: `blur(${(1 - e(f, at(12), at(12) + 14)) * 14}px)`, ...gradText }}>
            Prince Chakusa
          </div>
          <div style={{ fontFamily, fontWeight: 600, fontSize: 36, color: "#fff", marginTop: 18, opacity: e(f, at(12) + 18, at(12) + 30) }}>Guest Relations Supervisor · Abu Dhabi</div>
          <div style={{ display: "flex", gap: 14, marginTop: 40 }}>
            {["200+ reviews analysed", "+25% review scores", "350+ homes"].map((t, k) => {
              const q = e(f, at(12) + 28 + k * 5, at(12) + 40 + k * 5);
              return (
                <div key={t} style={{ fontFamily, fontWeight: 600, fontSize: 26, color: "#fff", padding: "10px 20px", borderRadius: 999, background: "rgba(255,255,255,0.14)", border: `1px solid ${k % 2 ? AMBER : TEAL}`, opacity: q, transform: `translateY(${(1 - q) * 24}px)` }}>
                  {t}
                </div>
              );
            })}
          </div>
          <div style={{ fontFamily, fontWeight: 500, fontSize: 34, color: "rgba(255,255,255,0.88)", marginTop: 70, opacity: e(f, at(12) + 50, at(12) + 62) }}>princechakusa.com</div>
        </AbsoluteFill>
</>
  );

  const shots: ShotSpec[] = [
    { src: clip("rv-phone-smile"), from: 0, to: till(0), cam: "zoomIn", grade: warm },
    { src: clip("rv-head-laptop"), from: till(0), to: till(1), cam: "panRight", cut: "whip", grade: cool, children: g_reviews },
    { src: clip("rv-spreadsheet"), from: l2a[0], to: l2a[1], cam: "tiltUp", cut: "zoom", grade: cool },
    { src: clip("rv-magnifier"), from: l2b[0], to: l2b[1], cam: "orbit", cut: "spin", grade: `${cool} brightness(0.7)`, children: g_count200 },
    { src: clip("rv-notes-flatlay"), from: till(2), to: till(3), cam: "rotateIn", cut: "zoom", grade: `${warm} brightness(0.6)`, children: g_method },
    { src: clip("rv-note-writing"), from: till(3), to: till(4), cam: "dolly", cut: "slideUp", grade: warm, children: g_tags },
    { src: clip("rv-calculator"), from: till(4), to: till(5), cam: "panLeft", cut: "whip", grade: cool, children: g_bars },
    { src: clip("rv-maid-cushions"), from: till(5), to: till(6), cam: "zoomOut", cut: "spin", grade: warm, children: g_top3 },
    { src: clip("rv-presenting"), from: till(6), to: till(7), cam: "panRight", cut: "zoom", grade: warm, children: g_update },
    { src: clip("rv-maid-pillow"), from: l8a[0], to: l8a[1], cam: "tiltDown", cut: "slideUp", grade: warm },
    { src: clip("rv-man-sheet"), from: l8b[0], to: l8b[1], cam: "zoomIn", cut: "whip", grade: warm },
    { src: clip("rv-checkin"), from: l9a[0], to: l9a[1], cam: "dolly", cut: "zoom", grade: warm },
    { src: clip("rv-counter"), from: l9c[0], to: l9c[1], cam: "panLeft", cut: "whip", grade: warm },
    { src: clip("rv-reception-tablet"), from: l9b[0], to: l9b[1], cam: "zoomIn", cut: "spin", grade: `${warm} brightness(0.62)`, children: g_count25 },
    { src: clip("rv-charts-coffee"), from: till(9), to: till(10), cam: "panLeft", cut: "whip", grade: cool },
    { src: clip("rv-team-talk"), from: till(10), to: till(11), cam: "zoomIn", cut: "flash", grade: warm },
    { src: clip("rv-abudhabi"), from: till(11), to: RV_DUR, cam: "tiltUp", cut: "zoom", grade: "saturate(1.15) brightness(0.72)", children: g_endcard },
  ];

  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Edit shots={shots} />

      {/* 0 hook */}
      {f < till(0) + 6 && <Kicker>Guest experience · Data</Kicker>}
      <Line i={0} size={104} accent={["free", "advice."]} />

      {/* 1 the angry ones */}
      <Line i={1} size={88} accent={["angry"]} />

      {/* 2 two hundred reviews: first the spreadsheet, then the count on the magnifier shot */}
      <Line i={2} size={70} top={120} style={{ opacity: f < l2b[0] ? 1 : 0 }} />


      {/* 3 the method */}


      {/* 4 tag every complaint */}
      <Line i={4} size={100} />

      {/* 5 count, don't remember */}
      <Line i={5} size={100} accent={["Count,"]} />

      {/* 6 fix the top three */}
      <Line i={6} size={100} />

      {/* 7 tell the team */}
      <Line i={7} size={86} accent={["why."]} />

      {/* 8 small fixes */}
      <Line i={8} size={82} accent={["Small", "fixes,"]} />

      {/* 9 +25%: the check-in shot carries the line, then the count lands */}
      <Line i={9} size={64} top={120} style={{ opacity: f < l9b[0] ? 1 : 0 }} />


      {/* 10, 11 */}
      <Line i={10} size={104} accent={["Data"]} />
      <Line i={11} size={140} accent={["People"]} />

      {/* 12 end card over Abu Dhabi */}


      <AbsoluteFill style={{ pointerEvents: "none", boxShadow: "inset 0 0 200px rgba(0,0,0,0.5)" }} />
      <Html5Audio src={asset("/reels/reviews-music.mp3")} volume={musicVol} />
      <Sequence from={Math.round(LEAD * RV_FPS)}>
        <Html5Audio src={asset("/reels/reviews-vo.wav")} />
      </Sequence>
    </AbsoluteFill>
  );
}
