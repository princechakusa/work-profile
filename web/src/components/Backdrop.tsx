import s from "./Backdrop.module.css";

/**
 * The dusk city behind every inner page: sky glow, drifting clouds, two layers of skyline with lit windows
 * that flicker, a line of traffic light along the waterfront, and birds. Pure SVG and CSS, so it costs
 * almost nothing next to the films on the same page.
 */

function rng(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type Tower = { x: number; w: number; h: number; spire: boolean };

function skyline(seed: number, count: number, maxH: number): Tower[] {
  const r = rng(seed);
  const towers: Tower[] = [];
  let x = -20;
  for (let i = 0; i < count && x < 1620; i++) {
    const w = 38 + r() * 70;
    const center = Math.exp(-(((x - 900) / 420) ** 2));
    towers.push({ x, w, h: 80 + r() ** 1.6 * maxH * 0.6 + center * maxH * 0.5, spire: r() < 0.12 });
    x += w + 4 + r() * 10;
  }
  return towers;
}

const FAR = skyline(3, 60, 360);
const NEAR = skyline(9, 60, 300);

function windows(t: Tower[], seed: number) {
  const r = rng(seed);
  const out: { x: number; y: number; d: number; c: number }[] = [];
  t.forEach((b) => {
    for (let y = 600 - b.h + 14; y < 590; y += 13)
      for (let x = b.x + 7; x < b.x + b.w - 7; x += 11) if (r() < 0.36) out.push({ x, y, d: r() * 9, c: r() });
  });
  return out;
}

const LIGHTS = windows(NEAR, 5);
const COLORS = ["#ffd08a", "#ffe3b8", "#bcd6ff", "#ffc36b"];

export default function Backdrop() {
  return (
    <div className={s.root} aria-hidden>
      <div className={s.sky} />
      <div className={`${s.cloud} ${s.c1}`} />
      <div className={`${s.cloud} ${s.c2}`} />
      <div className={`${s.cloud} ${s.c3}`} />
      <svg className={s.city} viewBox="0 0 1600 640" preserveAspectRatio="xMidYMax slice">
        <g fill="#241a38">
          {FAR.map((b) => (
            <g key={b.x}>
              <rect x={b.x} y={600 - b.h - 40} width={b.w} height={b.h + 40} />
              {b.spire && <rect x={b.x + b.w / 2 - 1.5} y={600 - b.h - 110} width={3} height={72} />}
            </g>
          ))}
        </g>
        <g fill="#0d0c16">
          {NEAR.map((b) => (
            <g key={b.x}>
              <rect x={b.x} y={600 - b.h} width={b.w} height={b.h} />
              {b.spire && <rect x={b.x + b.w / 2 - 1.5} y={600 - b.h - 70} width={3} height={70} />}
              {b.spire && <circle className={s.beacon} cx={b.x + b.w / 2} cy={600 - b.h - 72} r={3} />}
            </g>
          ))}
        </g>
        <g>
          {LIGHTS.map((l, i) => (
            <rect key={i} className={l.c > 0.7 ? s.flicker : undefined} style={{ animationDelay: `${l.d}s` }} x={l.x} y={l.y} width={5} height={6} fill={COLORS[Math.floor(l.c * 4)]} opacity={0.55 + l.c * 0.4} />
          ))}
        </g>
        <rect x={0} y={600} width={1600} height={40} fill="#07080b" />
        <g className={s.traffic}>
          {Array.from({ length: 26 }, (_, i) => (
            <rect key={i} x={i * 64} y={603} width={10} height={2} fill={i % 3 ? "#ff5a3c" : "#fff1d6"} />
          ))}
        </g>
      </svg>
      <div className={s.birds}>
        {[0, 1, 2, 3, 4].map((i) => (
          <span key={i} style={{ left: `${i * 26 - (i % 2) * 10}px`, top: `${Math.abs(i - 2) * 12}px`, animationDelay: `${i * 0.13}s` }} />
        ))}
      </div>
      <div className={s.fade} />
    </div>
  );
}
