"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import s from "./Intro.module.css";
import { asset } from "@/lib/site";

// the film player is the heaviest part of the site; the greeting shows at once and the player loads behind it
const Film = dynamic(() => import("./Film"), { ssr: false });

/**
 * The opening film as a pop-up over the site. It greets with Prince's photo and waits for a click
 * (browsers only allow the voice after one), and can be closed at any point.
 */
export default function Intro({ onDone }: { onDone: (openWork: boolean) => void }) {
  const dialog = useRef<HTMLDivElement>(null);
  const [run, setRun] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [ended, setEnded] = useState(false);
  const [leaving, setLeaving] = useState(false);

  const leave = useCallback(
    (openWork: boolean) => {
      setLeaving(true);
      window.setTimeout(() => onDone(openWork), 450);
    },
    [onDone],
  );

  useEffect(() => {
    // desktops warm the film up behind the greeting; phones only download it if the visitor presses Play
    const desktop = window.matchMedia("(hover: hover) and (pointer: fine) and (min-width: 900px)").matches;
    const warm = desktop ? window.setTimeout(() => import("./Film").then((m) => m.preloadVoice()), 1200) : 0;
    const html = document.documentElement;
    const prev = html.style.overflow;
    const previousFocus = document.activeElement as HTMLElement | null;
    html.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") return leave(false);
      if (e.key !== "Tab" || !dialog.current) return;
      const focusable = Array.from(dialog.current.querySelectorAll<HTMLElement>("button, a[href], [tabindex]:not([tabindex='-1'])"));
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    window.requestAnimationFrame(() => dialog.current?.querySelector<HTMLElement>("button")?.focus());
    return () => {
      window.clearTimeout(warm);
      html.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
      previousFocus?.focus();
    };
  }, [leave]);

  const onEnded = useCallback(() => setEnded(true), []);

  return (
    <div className={`${s.backdrop} ${leaving ? s.leaving : ""}`} data-lenis-prevent data-nocursor onClick={() => leave(false)}>
      <div ref={dialog} className={s.modal} role="dialog" aria-modal="true" aria-label="Prince Chakusa, a short film" onClick={(e) => e.stopPropagation()}>
        <button className={`${s.close} mono`} onClick={() => leave(false)} aria-label="Close the film">
          Close ✕
        </button>

        {playing ? (
          <div className={s.screen}>
            <Film key={run} name="intro" autoPlay onEnded={onEnded} />
            <p className={`${s.rotateHint} mono`}>For the clearest view on a phone, turn it sideways.</p>
            {ended && (
              <div className={`${s.end} mono`}>
                <button className={s.primary} onClick={() => leave(true)}>
                  Open my work →
                </button>
                <button onClick={() => { setEnded(false); setRun((n) => n + 1); }}>Replay</button>
              </div>
            )}
          </div>
        ) : (
          <div className={s.greet}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={asset("/prince.jpg")} alt="Prince Chakusa" className={s.photo} />
            <div className={s.words}>
              <p className="mono">Operations leader · Software builder · Abu Dhabi</p>
              <h2 id="intro-title" className="display">Hi, I&apos;m Prince Chakusa.</h2>
              <p className={s.pitch}>Before you scroll, give me two minutes and I will walk you through my work.</p>
              <div className={`${s.actions} mono`}>
                <button className={s.primary} onClick={() => setPlaying(true)}>
                  ▶ Play the film · sound on
                </button>
                <button onClick={() => leave(false)}>No thanks, show me the site</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
