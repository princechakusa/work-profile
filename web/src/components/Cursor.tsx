"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import s from "./Cursor.module.css";

/**
 * Surveyor's reticle. A precise crosshair tracks the pointer exactly; a bracket frame trails it and
 * changes state: idle (slowly rotating scan), tower lock (tightens, reads UNIT nnn), link (expands, OPEN).
 * Towers report hover through a `cursor:unit` window event so the cursor never imports the 3D scene.
 */
export default function Cursor() {
  const root = useRef<HTMLDivElement>(null);
  const cross = useRef<HTMLDivElement>(null);
  const frame = useRef<HTMLDivElement>(null);
  const spin = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);
  const coord = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const R = root.current!, C = cross.current!, F = frame.current!, S = spin.current!;
    const L = label.current!, K = coord.current!;

    gsap.set([C, F], { xPercent: -50, yPercent: -50 });
    gsap.set(R, { opacity: 0 });
    const fx = gsap.quickTo(F, "x", { duration: 0.1, ease: "power3" });
    const fy = gsap.quickTo(F, "y", { duration: 0.1, ease: "power3" });

    const idle = gsap.to(S, { rotation: "+=360", duration: 16, repeat: -1, ease: "none" });

    type Mode = "idle" | "unit" | "link";
    let mode: Mode = "idle";
    let unit = "";

    const setMode = (next: Mode, text: string) => {
      if (next === mode && text === L.textContent) return;
      mode = next;
      L.textContent = text;
      if (next === "idle") {
        gsap.to(F, { width: 44, height: 44, duration: 0.4, ease: "power3.out", overwrite: "auto" });
        gsap.to(S, { rotation: `+=0`, duration: 0 });
        idle.play();
        F.dataset.mode = "idle";
      } else if (next === "unit") {
        idle.pause();
        const snap = Math.round(Number(gsap.getProperty(S, "rotation")) / 90) * 90;
        gsap.to(S, { rotation: snap, duration: 0.35, ease: "power3.out", overwrite: "auto" });
        gsap.to(F, { width: 28, height: 28, duration: 0.3, ease: "back.out(2)", overwrite: "auto" });
        F.dataset.mode = "unit";
      } else {
        idle.pause();
        gsap.to(F, { width: 78, height: 78, duration: 0.4, ease: "power3.out", overwrite: "auto" });
        F.dataset.mode = "link";
      }
    };

    const move = (e: PointerEvent) => {
      // films and the pop-up use the plain pointer; the reticle would sit on top of the picture
      if ((e.target as HTMLElement).closest("[data-nocursor]")) {
        gsap.to(R, { opacity: 0, duration: 0.15, overwrite: "auto" });
        return;
      }
      gsap.to(R, { opacity: 1, duration: 0.25, overwrite: "auto" });
      gsap.set(C, { x: e.clientX, y: e.clientY });
      fx(e.clientX);
      fy(e.clientY);
      K.textContent = `X ${String(Math.round(e.clientX)).padStart(4, "0")}  Y ${String(Math.round(e.clientY)).padStart(4, "0")}`;
      const link = (e.target as HTMLElement).closest("a, button, [data-hot]");
      if (link) setMode("link", "OPEN");
      else if (unit) setMode("unit", unit);
      else setMode("idle", "SCAN");
    };
    const onUnit = (e: Event) => {
      const n = (e as CustomEvent<number | null>).detail;
      unit = n === null ? "" : `UNIT ${String(n + 1).padStart(3, "0")} / 350`;
      if (mode !== "link") (unit ? setMode("unit", unit) : setMode("idle", "SCAN"));
    };
    const down = () => gsap.fromTo(F, { scale: 0.7 }, { scale: 1, duration: 0.6, ease: "elastic.out(1,0.4)" });
    const leave = () => gsap.to(R, { opacity: 0, duration: 0.2 });

    window.addEventListener("pointermove", move);
    window.addEventListener("pointerdown", down);
    window.addEventListener("cursor:unit", onUnit);
    document.documentElement.addEventListener("pointerleave", leave);
    setMode("idle", "SCAN");
    return () => {
      idle.kill();
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerdown", down);
      window.removeEventListener("cursor:unit", onUnit);
      document.documentElement.removeEventListener("pointerleave", leave);
    };
  }, []);

  return (
    <div ref={root} className={s.root} aria-hidden>
      <div ref={cross} className={s.cross}>
        <i /><i />
      </div>
      <div ref={frame} className={s.frame} data-mode="idle">
        <div ref={spin} className={s.spin}>
          <b /><b /><b /><b />
        </div>
        <span ref={label} className={`${s.label} mono`} />
        <span ref={coord} className={`${s.coord} mono`} />
      </div>
    </div>
  );
}
