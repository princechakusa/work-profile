import { useState } from "react";
import { getRemotionEnvironment, useCurrentFrame } from "remotion";
import { City3D } from "./City3D";
import {
  Bubble, C, Chips, F, FLOOR, Header, Narration, PRINCE, Person, SKIN, Scenes, Stage, Stat, Svg, Tag,
  lin, part, ramp, talking, timeline, type Timeline,
} from "./kit";

/**
 * The opening film: hello, one scene per role, why hire me, then a pointer to the Work section.
 * Each scene's length comes from its narration (see voice.json); the action hangs off the cue frames.
 *
 * What Prince says to a guest appears only as a silent speech bubble. The voice explains each role:
 * his responsibility, what he achieved, and what it taught him.
 */

const T_HELLO = timeline(["h1", "h2"], 34);
const T_DANIELS = timeline(["d1", "d2", "d3", "d4", "d5"]);
const T_STONE = timeline(["s1", "s2", "s3", "s4", "s5"]);
const T_HOMEVY = timeline(["l1", "l2", "l3", "l4", "l5"]);
const T_AUTHORS = timeline(["a1", "a2", "a3", "a4", "a5"]);
const T_WHY = timeline(["w1", "w2", "w3", "w4"]);
const T_OUTRO = timeline(["o1"]);

const HELLO = T_HELLO.end + 6;
const DANIELS = T_DANIELS.end + 12;
const STONE = T_STONE.end + 12;
const HOMEVY = T_HOMEVY.end + 12;
const AUTHORS = T_AUTHORS.end + 12;
const WHY = T_WHY.end + 16;
const OUTRO = T_OUTRO.end + 30;
export const INTRO_DUR = HELLO + DANIELS + STONE + HOMEVY + AUTHORS + WHY + OUTRO;
/** Poster: Prince waving hello, speech bubble up. */
export const INTRO_POSTER = HELLO - 20;

/** Mouth movement across every narrated line of a scene. */
const speak = (t: Timeline, f: number) => t.list.reduce((m, c) => m + talking(f, c.from, c.to), 0);

function Hello() {
  const f = useCurrentFrame();
  const { h1, h2 } = T_HELLO.cue;
  return (
    <Stage frame={f}>
      <Svg>
        <Person {...PRINCE} frame={f} x={lin(f, 0, 32, -140, 620)} s={1.7} walk={f < 32 ? f * 0.6 : 0} wave={ramp(f, 32, 42) * (1 - ramp(f, h2.from, h2.from + 12))} talk={speak(T_HELLO, f)} />
      </Svg>
      <Bubble frame={f} from={h1.from} to={HELLO + 30} x={700} y={250} text="Hi, I'm Prince Chakusa." />
      <div style={{ position: "absolute", left: 1020, top: 400 }}>
        <div style={{ overflow: "hidden" }}>
          <div style={{ fontFamily: F.display, fontWeight: 900, fontSize: 124, lineHeight: 0.92, textTransform: "uppercase", whiteSpace: "nowrap", translate: `0 ${ramp(f, h2.from, h2.from + 20, 110, 0)}%` }}>
            Don&apos;t scroll yet.
          </div>
        </div>
        <div style={{ fontSize: 52, lineHeight: 1.2, marginTop: 22, maxWidth: 800, opacity: ramp(f, h2.from + 40, h2.from + 56) }}>
          Let me show you what I have done.
        </div>
      </div>
      <Narration t={T_HELLO} frame={f} spoken={["h1"]} />
    </Stage>
  );
}

function Daniels() {
  const f = useCurrentFrame();
  const { d1, d2, d3, d4, d5 } = T_DANIELS.cue;
  // the check-in plays out in silent speech bubbles while the voice explains the role
  const arrive = d1.to - 10;
  const key = part(d2, 0.58);
  const bye = part(d2, 0.84);
  const leave = d3.from - 6;
  const gx = f > leave ? lin(f, leave, leave + 56, 640, 2100) : lin(f, d1.from + 20, arrive, -150, 640);
  const walking = (f > d1.from + 20 && f < arrive) || f > leave;
  const handover = ramp(f, key - 10, key) * (1 - ramp(f, key + 30, key + 40));
  return (
    <Stage frame={f}>
      <Svg>
        <Person
          {...PRINCE} frame={f} x={1010} s={1.15} flip={f < leave + 60} reach={handover} talk={speak(T_DANIELS, f)}
          wave={ramp(f, d2.from - 6, d2.from + 4) * (1 - ramp(f, d2.from + 30, d2.from + 40)) + ramp(f, bye, bye + 10) * (1 - ramp(f, leave + 30, leave + 40))}
        />
        {/* reception desk */}
        <rect x={860} y={724} width={300} height={136} fill={C.ink2} stroke={C.sand} strokeWidth={3} />
        <rect x={846} y={710} width={328} height={16} fill={C.sand} />
        <text x={1010} y={802} textAnchor="middle" fill={C.steel} fontFamily={F.mono} fontSize={22} letterSpacing={3}>RECEPTION</text>
        {/* guest and suitcase */}
        <g transform={`translate(${gx - 82} ${FLOOR})`}>
          <line x1={0} y1={-96} x2={14} y2={-150} stroke={C.steel} strokeWidth={5} strokeLinecap="round" />
          <rect x={-24} y={-100} width={48} height={84} rx={8} fill={C.steel} />
          <circle cx={-14} cy={-8} r={8} fill={C.sand} />
          <circle cx={14} cy={-8} r={8} fill={C.sand} />
        </g>
        <Person frame={f} x={gx} s={1.15} shirt={C.sand} skin={SKIN[2]} walk={walking ? f * 0.6 : 0} reach={handover} />
        {/* the key changes hands */}
        <g transform={`translate(${lin(f, key, key + 22, 852, 800)} 612)`} opacity={lin(f, key - 6, key) * lin(f, key + 30, key + 38, 1, 0)}>
          <circle r={13} fill="none" stroke={C.signal} strokeWidth={6} />
          <rect x={10} y={-4} width={34} height={8} fill={C.signal} />
        </g>
      </Svg>
      <Header frame={f} kicker="Chapter 01 · Jan 2023 — Oct 2024" title="Guest Relations Officer" sub="Daniels Holiday Homes" />
      <Bubble frame={f} from={d2.from} to={key - 6} x={930} y={440} text="Welcome! I'm here to assist you with your check-in." />
      <Bubble frame={f} from={bye} to={leave + 44} x={960} y={440} text="Have a great stay!" />
      <Stat frame={f} at={part(d3, 0.42)} x={1240} y={100} n="+25%" label="Guest review scores" />
      <Stat frame={f} at={part(d3, 0.82)} x={1550} y={100} n="+20%" label="Satisfaction (CSAT / NPS)" />
      <Stat frame={f} at={part(d4, 0.34)} x={1240} y={280} n="−40%" label="Front desk workload" />
      <Stat frame={f} at={part(d4, 0.84)} x={1550} y={280} n="−20%" label="Onboarding time" />
      <Chips frame={f} at={d5.from} x={100} y={884} lead="What I learned" items={["Understanding guest needs", "Solving problems quickly"]} />
      <Narration t={T_DANIELS} frame={f} />
    </Stage>
  );
}

const UNITS = 350;
const TEAM_X = [180, 300, 420, 540, 660, 780, 1140, 1260, 1380, 1500, 1620, 1740];
const TEAM_SHIRT = [C.steel, "#5d6672", "#9aa3ad"];

function Stonetree() {
  const f = useCurrentFrame();
  const { s1, s2, s3, s4, s5 } = T_STONE.cue;
  const promoted = part(s1, 0.52);
  const back = ramp(f, s3.from - 8, s3.from + 26);
  const count = Math.round(lin(f, part(s2, 0.3), s2.to - 8, 0, UNITS));
  const [unit, setUnit] = useState<number | null>(null);
  return (
    <Stage frame={f}>
      {/* the real 3D city: all 350 units rise as he takes over the portfolio, and the viewer can explore it */}
      <City3D frame={f} start={s2.from - 10} onHover={setUnit} />
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", background: `linear-gradient(115deg, rgba(7,8,11,0.85) 0%, rgba(7,8,11,0) 46%), linear-gradient(0deg, rgba(7,8,11,0.95) 12%, rgba(7,8,11,${0.5 * back}) 46%, rgba(7,8,11,${0.35 * back}) 100%)` }} />
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
      <Svg>
        {TEAM_X.map((x, i) => (
          <Person
            key={x} frame={f + i * 7} x={x} s={0.8 * ramp(f, s3.from + 10 + i * 4, s3.from + 24 + i * 4)} flip={x > 960}
            shirt={TEAM_SHIRT[i % 3]} skin={SKIN[(i * 2) % 3]}
          />
        ))}
        <Person {...PRINCE} frame={f} x={lin(f, 6, 44, -140, 960)} s={1.15} walk={f > 6 && f < 44 ? f * 0.6 : 0} talk={speak(T_STONE, f)} />
      </Svg>
      {/* the hover hint only makes sense in the live player, not in the rendered MP4 */}
      {!getRemotionEnvironment().isRendering && (
      <div style={{ position: "absolute", right: 80, top: 400, textAlign: "right", fontFamily: F.mono, fontSize: 22, letterSpacing: "0.1em", pointerEvents: "none", opacity: ramp(f, s2.from + 40, s2.from + 56) }}>
        <div style={{ display: "inline-block", padding: "10px 16px", background: "rgba(7, 8, 11, 0.8)", border: `2px solid ${unit === null ? C.line : C.signal}`, color: unit === null ? C.sand : C.signal }}>
          {unit === null ? "MOVE YOUR MOUSE · HOVER A BUILDING" : `UNIT ${String(unit + 1).padStart(3, "0")} / 350`}
        </div>
      </div>
      )}
      <Header frame={f} kicker="Chapter 02 · Stonetree" title={f < promoted ? "Customer Care Agent" : "Team Leader"} sub={f < promoted ? "Stonetree" : "Property Operations · Stonetree"} />
      <div style={{ position: "absolute", left: 1300, top: 96, opacity: lin(f, s2.from, s2.from + 10) }}>
        <div style={{ fontFamily: F.display, fontWeight: 900, fontSize: 200, lineHeight: 0.85 }}>
          {count}
          {count >= UNITS ? "+" : ""}
        </div>
        <div style={{ fontSize: 36, color: C.steel, marginTop: 12 }}>units under management</div>
      </div>
      <Tag frame={f} at={46} until={promoted} x={960} y={452} text="Prince · Customer Care Agent" />
      <Tag frame={f} at={promoted} x={960} y={452} text="Prince · Team Leader" />
      <div style={{ position: "absolute", left: 960, top: 392 + ramp(f, promoted, promoted + 16, 16, 0), translate: "-50% -100%", fontFamily: F.mono, fontSize: 24, letterSpacing: "0.1em", color: C.signal, whiteSpace: "nowrap", opacity: ramp(f, promoted, promoted + 10) * lin(f, s2.from, s2.from + 14, 1, 0) }}>
        ▲ PROMOTED
      </div>
      <Chips frame={f} at={s3.from + 30} until={s4.from} x={100} y={884} lead="Team of 12" items={["Concierge", "Maintenance", "Housekeeping"]} />
      <Chips frame={f} at={s4.from} until={s5.from} x={100} y={884} lead="My responsibilities" items={["DTCM compliance", "SOPs", "Vendor SLAs", "Reporting"]} />
      <Chips frame={f} at={s5.from} x={100} y={884} lead="What I learned" items={["Leading a team", "Consistent standards at scale"]} />
      <Narration t={T_STONE} frame={f} />
      </div>
    </Stage>
  );
}

// wordless messages: the film shows that he talks to guests without scripting what is said
const THREAD = [
  { k: 0.1, tag: "WhatsApp", bars: [250, 160], mine: false },
  { k: 0.4, tag: "", bars: [280, 210], mine: true },
  { k: 0.7, tag: "Hostaway", bars: [], mine: false },
];

function Homevy() {
  const f = useCurrentFrame();
  const { l2, l3, l4, l5 } = T_HOMEVY.cue;
  return (
    <Stage frame={f}>
      <Svg>
        <Person {...PRINCE} frame={f} x={330} s={1.15} reach={ramp(f, l3.from - 14, l3.from)} talk={speak(T_HOMEVY, f)} />
        <rect x={474} y={556} width={28} height={48} rx={6} fill={C.sand} opacity={ramp(f, l3.from - 8, l3.from)} />
        {[1280, 1400, 1520, 1640, 1760].map((x, i) => {
          const at = part(l2, 0.7) + i * 5;
          return <Person key={x} frame={f + i * 9} x={x} s={0.8 * ramp(f, at, at + 14)} flip shirt={TEAM_SHIRT[i % 3]} skin={SKIN[(i + 1) % 3]} />;
        })}
      </Svg>
      <Header frame={f} kicker="Chapter 03 · Jan 2026 — Mar 2026" title="Guest Experience Lead" sub="Luxury Homevy" />
      <div style={{ position: "absolute", left: 720, top: 392, width: 460, display: "flex", flexDirection: "column", gap: 18 }}>
        {THREAD.map((msg) => {
          const p = ramp(f, part(l3, msg.k), part(l3, msg.k) + 14);
          return (
            <div key={msg.k} style={{ alignSelf: msg.mine ? "flex-end" : "flex-start", opacity: p, translate: `0 ${(1 - p) * 24}px` }}>
              {msg.tag && <div style={{ fontFamily: F.mono, fontSize: 18, letterSpacing: "0.1em", textTransform: "uppercase", color: C.steel, marginBottom: 6 }}>{msg.tag}</div>}
              <div style={{ padding: "20px 24px", borderRadius: 22, display: "flex", flexDirection: "column", gap: 12, fontSize: 34, lineHeight: 1, background: msg.mine ? C.signal : C.ink2, color: C.signal, border: msg.mine ? "none" : `2px solid ${C.line}` }}>
                {msg.bars.length ? msg.bars.map((w) => <div key={w} style={{ width: w, height: 12, borderRadius: 6, background: msg.mine ? C.ink : C.sand, opacity: msg.mine ? 0.75 : 0.5 }} />) : "★★★★★"}
              </div>
            </div>
          );
        })}
      </div>
      <Stat frame={f} at={part(l2, 0.45)} x={1240} y={100} n="40" label="Properties" />
      <Stat frame={f} at={part(l2, 0.8)} x={1550} y={100} n="5" label="People on my team" />
      <Stat frame={f} at={part(l4, 0.3)} x={1240} y={280} w={600} n="200+" label="Guest reviews analysed" />
      <Chips frame={f} at={l3.from + 20} until={l5.from} x={100} y={884} lead="Tools" items={["Hostaway", "WhatsApp", "SLA tracking", "SOP tracking"]} />
      <Chips frame={f} at={l5.from} x={100} y={884} lead="What I learned" items={["Turning guest feedback into better service"]} />
      <Narration t={T_HOMEVY} frame={f} />
    </Stage>
  );
}

const SYSTEMS = ["Company systems improved", "Team management improved"];

/** Current role. Prince gave the title, the company, and that he improved its systems and management; the rest is the standard scope of a supervisor. */
function Authors() {
  const f = useCurrentFrame();
  const { a2, a3, a4, a5 } = T_AUTHORS.cue;
  // an escalated issue travels from the team to Prince and comes back resolved
  const go = part(a3, 0.12);
  const solved = part(a3, 0.55);
  const cx = f < solved ? lin(f, go, go + 30, 1090, 740) : lin(f, solved + 8, solved + 38, 740, 1090);
  return (
    <Stage frame={f}>
      <Svg>
        <Person {...PRINCE} frame={f} x={560} s={1.15} reach={ramp(f, go + 20, go + 32) * (1 - ramp(f, solved + 10, solved + 22))} talk={speak(T_AUTHORS, f)} />
        {[1010, 1130, 1250, 1370].map((x, i) => {
          const at = part(a2, 0.1) + i * 5;
          return <Person key={x} frame={f + i * 9} x={x} s={0.8 * ramp(f, at, at + 14)} flip shirt={TEAM_SHIRT[i % 3]} skin={SKIN[(i + 2) % 3]} />;
        })}
      </Svg>
      <Header frame={f} kicker="Chapter 04 · Apr 2026 — Now" title="Executive Supervisor" sub="Guest Relations · The Authors Holiday Homes" />
      <Tag frame={f} at={20} x={560} y={452} text="Prince · Supervisor" />
      <div
        style={{
          position: "absolute", left: cx, top: 540, translate: "-50% 0", whiteSpace: "nowrap", padding: "14px 22px", borderRadius: 14, fontSize: 30,
          background: C.ink, border: `2px solid ${f < solved ? C.steel : C.signal}`, opacity: ramp(f, go - 10, go) * lin(f, a4.from - 4, a4.from + 10, 1, 0),
        }}
      >
        {f < solved ? "Guest issue escalated" : "Resolved ✓"}
      </div>
      <div style={{ position: "absolute", left: 1240, top: 100, width: 600, opacity: ramp(f, a4.from, a4.from + 16) }}>
        <div style={{ fontFamily: F.mono, fontSize: 22, letterSpacing: "0.1em", color: C.steel }}>WHAT I ADDED</div>
        {SYSTEMS.map((row, i) => {
          const p = ramp(f, part(a4, 0.25 + i * 0.35), part(a4, 0.25 + i * 0.35) + 16);
          return (
            <div key={row} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 18, padding: "18px 22px", border: `2px solid ${p > 0.9 ? C.signal : C.line}`, fontSize: 34, opacity: 0.35 + 0.65 * p }}>
              {row}
              <span style={{ color: C.signal, opacity: p }}>✓</span>
            </div>
          );
        })}
      </div>
      <Chips frame={f} at={a2.from + 20} until={a5.from} x={100} y={884} lead="My responsibilities" items={["Supervising the team", "Escalated guest issues", "Coaching"]} />
      <Chips frame={f} at={a5.from} x={100} y={884} lead="What I am learning" items={["Building a team that delivers every day"]} />
      <Narration t={T_AUTHORS} frame={f} />
    </Stage>
  );
}

const REASONS = [
  { head: "I have worked at every level", body: "From the front desk to supervising a team." },
  { head: "My results are measurable", body: "+25% review scores · −40% front desk workload · 350+ units" },
  { head: "I build software too", body: "PaMarket and FixHub solve problems I saw at work." },
];

function WhyHire() {
  const f = useCurrentFrame();
  const { w1, w2, w3, w4 } = T_WHY.cue;
  const at = [w2.from, w3.from, w4.from];
  return (
    <Stage frame={f}>
      <Svg>
        <Person {...PRINCE} frame={f} x={330} s={1.3} reach={ramp(f, w2.from - 10, w2.from + 4)} talk={speak(T_WHY, f)} />
      </Svg>
      <Header frame={f - w1.from + 8} kicker="In short" title="Why hire me?" sub="Three reasons" />
      {REASONS.map((r, i) => {
        const p = ramp(f, at[i], at[i] + 18);
        return (
          <div key={r.head} style={{ position: "absolute", left: 760, top: 320 + i * 180, width: 1080, display: "flex", gap: 30, opacity: p, translate: `${(1 - p) * 60}px 0` }}>
            <div style={{ fontFamily: F.mono, fontSize: 26, color: C.signal, paddingTop: 14 }}>0{i + 1}</div>
            <div>
              <div style={{ fontFamily: F.display, fontWeight: 900, fontSize: 80, lineHeight: 0.95, textTransform: "uppercase", whiteSpace: "nowrap" }}>{r.head}</div>
              <div style={{ fontSize: 30, color: C.steel, marginTop: 8 }}>{r.body}</div>
            </div>
          </div>
        );
      })}
      <Narration t={T_WHY} frame={f} />
    </Stage>
  );
}

function Outro() {
  const f = useCurrentFrame();
  return (
    <Stage frame={f}>
      <Svg>
        <Person {...PRINCE} frame={f} x={520} s={1.5} wave={ramp(f, 10, 22)} talk={speak(T_OUTRO, f)} />
      </Svg>
      <div style={{ position: "absolute", left: 860, top: 300, maxWidth: 940 }}>
        <div style={{ fontFamily: F.display, fontWeight: 900, fontSize: 130, lineHeight: 0.92, textTransform: "uppercase", opacity: ramp(f, 12, 28), translate: `0 ${ramp(f, 12, 32, 40, 0)}px` }}>
          That is the short version.
        </div>
        <div style={{ fontSize: 50, lineHeight: 1.2, marginTop: 28, opacity: ramp(f, 50, 66) }}>
          Open <span style={{ color: C.signal, fontWeight: 600 }}>Work</span> to read the full story.
        </div>
      </div>
      <Narration t={T_OUTRO} frame={f} />
    </Stage>
  );
}

export function IntroFilm() {
  return <Scenes scenes={[[Hello, HELLO], [Daniels, DANIELS], [Stonetree, STONE], [Homevy, HOMEVY], [Authors, AUTHORS], [WhyHire, WHY], [Outro, OUTRO]]} />;
}
