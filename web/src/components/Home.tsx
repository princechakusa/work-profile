"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { scrollState } from "@/lib/scrollState";
import s from "./Home.module.css";

const CityScene = dynamic(() => import("./CityScene"), { ssr: false });

gsap.registerPlugin(ScrollTrigger);

/** Splits text into per-letter spans so each glyph can rise out of a mask. */
function Letters({ text }: { text: string }) {
  return (
    <span className={s.line} aria-label={text}>
      {text.split("").map((c, i) => (
        <span key={i} className={s.mask} aria-hidden>
          <span className={`${s.glyph} glyph`}>{c}</span>
        </span>
      ))}
    </span>
  );
}

const PROOF = [
  { n: "350+", l: "Dubai holiday homes run day to day" },
  { n: "5 yrs", l: "Operating in the UAE short-term rental market" },
  { n: "-40%", l: "Front desk workload after digital concierge tools" },
];

export default function Home() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap
        .timeline({ delay: 0.5, defaults: { ease: "power4.out" } })
        .from(".glyph", { yPercent: 115, duration: 1.1, stagger: 0.045 })
        .from(`.${s.fadeIn}`, { opacity: 0, y: 24, duration: 0.9, stagger: 0.1 }, "-=0.6");

      ScrollTrigger.create({
        trigger: root.current,
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self) => (scrollState.progress = self.progress),
      });

      gsap.utils.toArray<HTMLElement>(`.${s.reveal}`).forEach((el) =>
        gsap.from(el, {
          opacity: 0, y: 70, duration: 1.1, ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 82%" },
        }),
      );
    }, root);
    return () => ctx.revert();
  }, []);

  const onHover = (unit: number | null) => {
    window.dispatchEvent(new CustomEvent("cursor:unit", { detail: unit }));
  };

  return (
    <main ref={root} className={s.root}>
      <div className={s.canvas}>
        <CityScene onHover={onHover} />
      </div>

      <header className={`${s.nav} mono`}>
        <a href="#top">Prince Chakusa</a>
        <nav>
          <a href="#proof">Proof</a>
          <a href="#work">Work</a>
          <a href="#contact">Contact</a>
        </nav>
        <span className={s.status}>Open to roles / UAE · GCC · Remote</span>
      </header>

      <section id="top" className={s.hero}>
        <p className={`${s.kicker} mono ${s.fadeIn}`}>Operations leader / Software builder / Dubai</p>
        <h1 className={`${s.name} display`}>
          <Letters text="Prince" />
          <Letters text="Chakusa" />
        </h1>
        <div className={s.heroFoot}>
          <p className={`${s.lede} ${s.fadeIn}`}>
            I run 350+ holiday homes in Dubai and build the software they run on. Every tower behind me is one
            of them.
          </p>
          <a href="#proof" className={`${s.cta} mono ${s.fadeIn}`}>
            See the proof ↓
          </a>
        </div>
        <p className={`${s.hint} mono ${s.fadeIn}`}>Move the mouse · Hover a tower · Scroll to fly in</p>
      </section>

      <section id="proof" className={s.panel}>
        <p className={`${s.kicker} mono ${s.reveal}`}>The numbers behind the skyline</p>
        <div className={s.proofGrid}>
          {PROOF.map((p) => (
            <div key={p.n} className={s.reveal}>
              <div className={`${s.big} display`}>{p.n}</div>
              <p className={s.small}>{p.l}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="contact" className={s.panel}>
        <p className={`${s.kicker} mono ${s.reveal}`}>Next</p>
        <h2 className={`${s.closer} display ${s.reveal}`}>Let&apos;s build something that runs.</h2>
        <div className={`${s.links} mono ${s.reveal}`}>
          <a href="mailto:chakusaprince@gmail.com">chakusaprince@gmail.com</a>
          <a href="https://linkedin.com/in/princechakusa" target="_blank" rel="noreferrer">LinkedIn ↗</a>
          <a href="https://github.com/princechakusa" target="_blank" rel="noreferrer">GitHub ↗</a>
        </div>
      </section>
    </main>
  );
}
