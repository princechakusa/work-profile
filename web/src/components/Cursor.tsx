"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

/** Crosshair-style cursor: a thin ring that eases behind the pointer and grows over links. */
export default function Cursor() {
  const ring = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const el = ring.current!;
    gsap.set(el, { xPercent: -50, yPercent: -50, opacity: 0 });
    const x = gsap.quickTo(el, "x", { duration: 0.35, ease: "power3" });
    const y = gsap.quickTo(el, "y", { duration: 0.35, ease: "power3" });

    const move = (e: PointerEvent) => {
      gsap.to(el, { opacity: 1, duration: 0.2, overwrite: "auto" });
      x(e.clientX);
      y(e.clientY);
      const hot = (e.target as HTMLElement).closest("a, button, [data-hot]");
      gsap.to(el, { scale: hot ? 2.4 : 1, duration: 0.3, overwrite: "auto" });
      el.style.background = hot ? "rgba(255,90,31,0.18)" : "transparent";
    };
    window.addEventListener("pointermove", move);
    return () => window.removeEventListener("pointermove", move);
  }, []);

  return (
    <div
      ref={ring}
      aria-hidden
      style={{
        position: "fixed", top: 0, left: 0, width: 26, height: 26, zIndex: 100, pointerEvents: "none",
        border: "1px solid var(--signal)", borderRadius: "50%", mixBlendMode: "difference",
      }}
    />
  );
}
