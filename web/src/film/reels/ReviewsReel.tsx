import { AbsoluteFill, Html5Audio, Sequence, interpolate, useCurrentFrame } from "remotion";
import { asset } from "@/lib/site";
import cues from "./reviews-cues.json";
import { Bottom, Card, GRAD, Kicker, Shot, Words, clamp, e, fontFamily, grad } from "./Showreel";

/**
 * "Read the reviews properly": LinkedIn showreel #2 (4:5), voiced in Prince's own cloned voice.
 * reviews-cues.json holds where each narrated line starts and ends (seconds, from the voice track).
 */

export const RV_W = 1080;
export const RV_H = 1350;
export const RV_FPS = 30;
const LEAD = 0.5; // music before the first word
const C = cues.lines as { start: number; end: number; text: string }[];
export const RV_DUR = Math.round((C[C.length - 1].end + LEAD + 5) * RV_FPS);
const at = (i: number) => Math.round((C[i].start + LEAD) * RV_FPS);
const till = (i: number) => Math.round((C[Math.min(i + 1, C.length - 1)].start + LEAD) * RV_FPS);
const clip = (k: string) => asset(`/reels/c/${k}.mp4`);
const warm = "saturate(1.1) sepia(0.15) brightness(0.95)";
const cool = "saturate(0.9) hue-rotate(-8deg) brightness(0.85)";

function Review({ f, start, stars, text, top, left, tone }: { f: number; start: number; stars: number; text: string; top: number; left: number; tone: string }) {
  const k = e(f, start, start + 12);
  return (
    <div style={{ position: "absolute", top, left, width: 600, padding: "22px 28px", borderRadius: 26, background: "rgba(255,255,255,0.94)", boxShadow: "0 20px 60px rgba(0,0,0,0.4)", opacity: k, transform: `translateY(${(1 - k) * 30}px) rotate(${left > 300 ? 2 : -2}deg)`, fontFamily }}>
      <div style={{ fontSize: 34, letterSpacing: 4, color: tone }}>{"★".repeat(stars)}<span style={{ color: "#ccc" }}>{"★".repeat(5 - stars)}</span></div>
      <div style={{ fontSize: 30, color: "#222", fontWeight: 500, marginTop: 8 }}>{text}</div>
    </div>
  );
}

function Count({ f, start, to, suffix, label, sub }: { f: number; start: number; to: number; suffix: string; label: string; sub?: string }) {
  const n = Math.round(e(f, start + 4, start + 50, 0, to));
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", paddingBottom: 260 }}>
      <div style={{ fontFamily, fontWeight: 800, fontSize: 260, letterSpacing: "-0.06em", lineHeight: 0.9, ...grad, opacity: e(f, start, start + 8) }}>
        {suffix === "%" ? "+" : ""}
        {n}
        {n >= to ? suffix : ""}
      </div>
      <div style={{ fontFamily, fontWeight: 700, fontSize: 50, color: "#fff", letterSpacing: "-0.03em", marginTop: 8 }}>{label}</div>
      {sub && <div style={{ fontFamily, fontWeight: 500, fontSize: 32, color: "rgba(255,255,255,0.75)", marginTop: 12, opacity: e(f, start + 20, start + 32) }}>{sub}</div>}
    </AbsoluteFill>
  );
}

const TAGS = ["Check-in", "Cleaning", "Response time", "Noise", "Amenities"];

export function ReviewsReel() {
  const f = useCurrentFrame();
  const musicVol = (fr: number) => interpolate(fr, [0, 10, at(0), at(C.length - 1), at(C.length - 1) + 20, RV_DUR - 45, RV_DUR - 1], [0, 0.6, 0.2, 0.2, 0.6, 0.6, 0], clamp);
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      {/* 0 hook */}
      <Shot src={clip("f-lobby")} from={0} to={till(0)} push={0.14} grade={warm}>
        <Bottom>
          <Kicker f={f} at={4}>Guest experience · Data</Kicker>
          <Words f={f} at={at(0)} text={C[0].text} size={104} accent={["free", "advice."]} />
        </Bottom>
      </Shot>

      {/* 1 the angry ones */}
      <Shot src={clip("c-apartment")} from={till(0)} to={till(1)} grade={cool}>
        <Review f={f} start={at(1)} stars={1} text="The AC wasn't working. Nobody replied." top={200} left={60} tone="#ff5a4f" />
        <div style={{ opacity: 0.45 }}>
          <Review f={f} start={at(1) + 10} stars={5} text="Spotless, and check-in was so easy." top={420} left={420} tone="#f5b400" />
        </div>
        <Bottom><Words f={f} at={at(1)} text={C[1].text} size={88} accent={["angry"]} /></Bottom>
      </Shot>

      {/* 2 two hundred reviews */}
      <Shot src={clip("r2-data")} from={till(1)} to={till(2)} grade={cool}>
        <Count f={f} start={at(2)} to={200} suffix="+" label="guest reviews analysed" sub="across a 40-property portfolio" />
      </Shot>

      {/* 3 the method */}
      {f >= till(2) - 6 && f < till(3) + 6 && (
        <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 40%, #1b2140 0%, #06070b 70%)", alignItems: "center", justifyContent: "center", opacity: e(f, till(2) - 6, till(2) + 4) * (1 - e(f, till(3) - 2, till(3) + 6)) }}>
          <Words f={f} at={at(3)} text="The method." size={140} accent={["method."]} />
          <div style={{ display: "flex", gap: 14, marginTop: 40 }}>
            {["Tag", "Count", "Fix", "Tell"].map((t, i) => (
              <div key={t} style={{ fontFamily, fontWeight: 700, fontSize: 32, color: "#fff", padding: "12px 26px", borderRadius: 999, border: "1px solid rgba(255,255,255,0.3)", background: "rgba(255,255,255,0.08)", opacity: e(f, at(3) + 8 + i * 4, at(3) + 18 + i * 4) }}>
                {i + 1}. {t}
              </div>
            ))}
          </div>
        </AbsoluteFill>
      )}

      {/* 4 tag every complaint */}
      <Shot src={clip("r3-notes")} from={till(3)} to={till(4)} grade={warm}>
        <div style={{ position: "absolute", top: 170, left: 70, right: 70, display: "flex", flexWrap: "wrap", gap: 14 }}>
          {TAGS.map((t, i) => {
            const k = e(f, at(4) + i * 5, at(4) + i * 5 + 10);
            return (
              <div key={t} style={{ fontFamily, fontWeight: 700, fontSize: 34, color: "#0b0b10", padding: "12px 24px", borderRadius: 14, background: ["#7fb2ff", "#b897ff", "#ffa877", "#8ef0c0", "#ffd36b"][i], opacity: k, transform: `translateY(${(1 - k) * 30}px) rotate(${(i % 2 ? 1 : -1) * 2}deg)` }}>
                # {t}
              </div>
            );
          })}
        </div>
        <Bottom><Words f={f} at={at(4)} text={C[4].text} size={96} /></Bottom>
      </Shot>

      {/* 5 count, don't remember */}
      <Shot src={clip("r4-charts")} from={till(4)} to={till(5)} grade={cool}>
        <div style={{ position: "absolute", top: 160, left: 80, right: 80, display: "flex", alignItems: "flex-end", gap: 22, height: 420 }}>
          {[9, 14, 6, 4, 3].map((v, i) => (
            <div key={i} style={{ flex: 1, textAlign: "center", fontFamily }}>
              <div style={{ fontSize: 30, fontWeight: 700, color: "#fff", opacity: e(f, at(5) + 14 + i * 3, at(5) + 24 + i * 3) }}>{v}</div>
              <div style={{ height: 24 * v * e(f, at(5) + i * 3, at(5) + 20 + i * 3), borderRadius: 10, background: i === 1 ? GRAD : "rgba(255,255,255,0.35)" }} />
              <div style={{ fontSize: 20, color: "rgba(255,255,255,0.8)", marginTop: 8 }}>{TAGS[i]}</div>
            </div>
          ))}
        </div>
        <Bottom><Words f={f} at={at(5)} text={C[5].text} size={96} accent={["Count,"]} /></Bottom>
      </Shot>

      {/* 6 fix the top three */}
      <Shot src={clip("r5-cushions")} from={till(5)} to={till(6)} grade={warm}>
        <div style={{ position: "absolute", top: 170, left: 70, fontFamily }}>
          {["Cleaning details", "Check-in clarity", "Reply speed"].map((t, i) => {
            const k = e(f, at(6) + i * 6, at(6) + i * 6 + 12);
            return (
              <div key={t} style={{ display: "flex", alignItems: "center", gap: 18, marginBottom: 16, opacity: k, transform: `translateX(${(1 - k) * -40}px)` }}>
                <div style={{ width: 62, height: 62, borderRadius: 31, background: GRAD, display: "grid", placeItems: "center", fontSize: 32, fontWeight: 800, color: "#0b0b10" }}>{i + 1}</div>
                <div style={{ fontSize: 40, fontWeight: 700, color: "#fff", textShadow: "0 4px 20px rgba(0,0,0,0.5)" }}>{t}</div>
              </div>
            );
          })}
        </div>
        <Bottom><Words f={f} at={at(6)} text={C[6].text} size={96} /></Bottom>
      </Shot>

      {/* 7 tell the team */}
      <Shot src={clip("r6-team")} from={till(6)} to={till(7)} grade={warm}>
        <Card f={f} at={at(7) + 4} icon="✓" title="Team update" value="New check-in steps live today" top={190} left={80} tone="#8ef0c0" />
        <Bottom><Words f={f} at={at(7)} text={C[7].text} size={82} accent={["why."]} /></Bottom>
      </Shot>

      {/* 8 small fixes */}
      <Shot src={clip("r7-towels")} from={till(7)} to={till(8)} grade={warm}>
        <Bottom><Words f={f} at={at(8)} text={C[8].text} size={78} accent={["Small", "fixes,"]} /></Bottom>
      </Shot>

      {/* 9 +25% */}
      <Shot src={clip("a-marina")} from={till(8)} to={till(9)} push={0.12} grade="brightness(0.55)">
        <Count f={f} start={at(9)} to={25} suffix="%" label="guest review scores" sub="after redesigning check-in" />
      </Shot>

      {/* 10 data tells you where to look */}
      <Shot src={clip("r2-data")} from={till(9)} to={till(10)} push={0.18} grade={cool}>
        <Bottom><Words f={f} at={at(10)} text={C[10].text} size={100} accent={["Data"]} /></Bottom>
      </Shot>

      {/* 11 people fix it */}
      <Shot src={clip("r9-success")} from={till(10)} to={till(11)} grade={warm}>
        <Bottom><Words f={f} at={at(11)} text={C[11].text} size={130} accent={["People"]} /></Bottom>
      </Shot>

      {/* 12 end card */}
      <Shot src={clip("j-sunrise")} from={till(11)} to={RV_DUR + 20} push={0.14} grade="brightness(0.75) saturate(1.15)">
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", background: `rgba(0,0,0,${e(f, till(11), till(11) + 20, 0, 0.5)})` }}>
          <div style={{ fontFamily, fontWeight: 800, fontSize: 120, letterSpacing: "-0.05em", opacity: e(f, at(12), at(12) + 14), filter: `blur(${(1 - e(f, at(12), at(12) + 14)) * 14}px)`, ...grad }}>Prince Chakusa</div>
          <div style={{ fontFamily, fontWeight: 600, fontSize: 38, color: "#fff", marginTop: 18, opacity: e(f, at(12) + 18, at(12) + 30) }}>Guest Experience · Operations · Technology</div>
          <div style={{ display: "flex", gap: 14, marginTop: 40, opacity: e(f, at(12) + 30, at(12) + 42) }}>
            {["200+ reviews analysed", "+25% review scores", "350+ homes"].map((t) => (
              <div key={t} style={{ fontFamily, fontWeight: 600, fontSize: 26, color: "#fff", padding: "10px 20px", borderRadius: 999, background: "rgba(255,255,255,0.14)", border: "1px solid rgba(255,255,255,0.3)" }}>{t}</div>
            ))}
          </div>
          <div style={{ fontFamily, fontWeight: 500, fontSize: 34, color: "rgba(255,255,255,0.85)", marginTop: 70, opacity: e(f, at(12) + 44, at(12) + 56) }}>princechakusa.com</div>
        </AbsoluteFill>
      </Shot>

      <AbsoluteFill style={{ pointerEvents: "none", boxShadow: "inset 0 0 220px rgba(0,0,0,0.55)" }} />
      <Html5Audio src={asset("/reels/human-ai-music.mp3")} volume={musicVol} />
      <Sequence from={Math.round(LEAD * RV_FPS)}>
        <Html5Audio src={asset("/reels/reviews-vo.wav")} />
      </Sequence>
    </AbsoluteFill>
  );
}
