import { useCurrentFrame } from "remotion";
import { Foundations3D, type Tower } from "./Foundations3D";
import { C, F, Header, Narration, PRINCE, Person, Stage, Svg, lin, ramp, talking, timeline } from "./kit";

/**
 * The Education film: one real 3D tower per qualification, rising as the voice explains how it helps in his roles.
 * Finished qualifications are complete towers; the two in progress are still under construction.
 */

const T = timeline(["e1", "e2", "e8", "e3", "e7", "e4", "e5", "e6"]);
export const EDUCATION_DUR = T.end + 30;
/** Poster: all five towers standing. */
export const EDUCATION_POSTER = EDUCATION_DUR - 10;

const { e2, e3, e4, e5, e6, e7 } = T.cue;

// towers sit on fixed columns; SCREEN_X is where each one lands in the 1920px frame
const COLUMN = [-8, -4, 0, 4, 8];
const SCREEN_X = COLUMN.map((x) => Math.round(960 + (x / 13.9) * 960));

type Item = { name: string; status: string; done: boolean; at: number; until: number; use: string; where: string; tower: Omit<Tower, "x" | "at"> };

// `built` for the unfinished towers is illustrative only; no percentage is claimed or shown.
const ITEMS: Item[] = [
  { name: "AS in Computer Science", status: "Completed 2026", done: true, at: e2.from, until: e3.from, use: "How I built PaMarket, and how I understand the systems we use", where: "Every role · PaMarket", tower: { w: 2.2, h: 6, tiers: 3, built: 1 } },
  { name: "Business Management Diploma", status: "Completed", done: true, at: e3.from, until: e7.from, use: "Planning and leading a team", where: "Team Leader at Stonetree", tower: { w: 2, h: 5, tiers: 2, built: 1 } },
  { name: "CompTIA A+", status: "Completed", done: true, at: e7.from, until: e4.from, use: "Solving technical problems for my team", where: "Every role", tower: { w: 1.8, h: 4.2, tiers: 2, built: 1 } },
  { name: "Bachelor of Business Administration", status: "In progress", done: false, at: e4.from, until: e5.from, use: "The leadership I use as a supervisor", where: "The Authors Holiday Homes", tower: { w: 2.2, h: 6.4, tiers: 3, built: 0.5 } },
  { name: "AML-CFT Certificate", status: "In progress", done: false, at: e5.from, until: e6.from, use: "Builds on my compliance work", where: "DTCM compliance at Stonetree", tower: { w: 1.9, h: 4.6, tiers: 1, built: 0.45 } },
];

const TOWERS: Tower[] = ITEMS.map((it, i) => ({ ...it.tower, x: COLUMN[i], at: it.at }));

// the camera moves in on each qualification while it is explained, and pulls back for the overview at the end
const FIRST = ITEMS[0].at;
const LAST = ITEMS[ITEMS.length - 1].until;

export function EducationFilm() {
  const f = useCurrentFrame();
  const active = ITEMS.findIndex((it) => f >= it.at && f < it.until);
  // labels come back only once the camera has settled on the overview again
  const overview = 1 - lin(f, FIRST + 10, FIRST + 30) * lin(f, LAST + 25, LAST + 50, 1, 0);
  return (
    <Stage frame={f}>
      <Foundations3D frame={f} towers={TOWERS} focus={active >= 0 ? COLUMN[active] : null} />
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", background: "linear-gradient(115deg, rgba(7,8,11,0.85) 0%, rgba(7,8,11,0) 45%), linear-gradient(0deg, rgba(7,8,11,0.95) 14%, rgba(7,8,11,0) 32%)" }} />
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        <Svg>
          <Person {...PRINCE} frame={f} x={170} s={1.05} reach={ramp(f, e2.from - 10, e2.from + 4) * (1 - ramp(f, e6.from - 12, e6.from))} wave={ramp(f, e6.from, e6.from + 12)} talk={T.list.reduce((m, c) => m + talking(f, c.from, c.to), 0)} />
        </Svg>
        <Header frame={f} kicker="Foundations" title="Education" sub="Each one connects to my work" />
        {ITEMS.map((it, i) => (
          <div key={it.name} style={{ position: "absolute", left: SCREEN_X[i], top: 874, width: 250, translate: "-50% 0", textAlign: "center", opacity: ramp(f, it.at + 30, it.at + 46) * overview }}>
            <div style={{ fontFamily: F.mono, fontSize: 17, letterSpacing: "0.1em", textTransform: "uppercase", color: it.done ? C.signal : C.steel }}>{it.status}</div>
            <div style={{ fontSize: 22, lineHeight: 1.2, marginTop: 6 }}>{it.name}</div>
          </div>
        ))}
        {/* while a qualification is being explained, show how it helps and where */}
        {ITEMS.map((it) => (
          <div key={it.name} style={{ position: "absolute", right: 90, top: 100, width: 720, textAlign: "right", opacity: ramp(f, it.at + 20, it.at + 36) * lin(f, it.until - 8, it.until + 4, 1, 0) }}>
            <div style={{ fontFamily: F.mono, fontSize: 22, letterSpacing: "0.1em", color: it.done ? C.signal : C.steel }}>{it.status.toUpperCase()}</div>
            <div style={{ fontFamily: F.display, fontWeight: 900, fontSize: 64, lineHeight: 0.95, textTransform: "uppercase", marginTop: 8 }}>{it.name}</div>
            <div style={{ fontFamily: F.mono, fontSize: 22, letterSpacing: "0.1em", color: C.signal, marginTop: 22 }}>HOW IT HELPS ME</div>
            <div style={{ fontSize: 44, lineHeight: 1.15, marginTop: 10 }}>{it.use}</div>
            <div style={{ fontFamily: F.mono, fontSize: 22, letterSpacing: "0.08em", color: C.sand, marginTop: 14, textTransform: "uppercase" }}>Where: {it.where}</div>
          </div>
        ))}
        <Narration t={T} frame={f} />
      </div>
    </Stage>
  );
}
