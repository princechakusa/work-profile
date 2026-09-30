"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { scrollState } from "@/lib/scrollState";
import { ABOUT, CONTACT, DRIVES, STRENGTHS } from "@/lib/content";
import s from "./Home.module.css";

const CityScene = dynamic(() => import("./CityScene"), { ssr: false });
const Intro = dynamic(() => import("./Intro"), { ssr: false });

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

const EXPLORE = [
  { href: "/work", t: "Work", d: "Every role: what I did, the value I added, and what I learned." },
  { href: "/projects", t: "Projects", d: "PaMarket, the marketplace I built for Zimbabwe." },
  { href: "/education", t: "Education", d: "My qualifications, and how each one helps me at work." },
  { href: "/why-me", t: "Why me", d: "Four reasons to hire me, and what a colleague says." },
];

const SEEN = "pc-intro-seen";

/** The home page is about Prince himself: who he is, what drives him, and his strengths. */
export default function Home() {
  const root = useRef<HTMLElement>(null);
  const router = useRouter();
  const [introOpen, setIntroOpen] = useState(true);

  // the pop-up greets a visitor once per visit, not every time they come back to the home page
  useEffect(() => {
    try {
      if (sessionStorage.getItem(SEEN)) setIntroOpen(false);
    } catch {}
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: root.current,
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self) => (scrollState.progress = self.progress),
      });
      gsap.utils.toArray<HTMLElement>(`.${s.reveal}`).forEach((el) =>
        gsap.from(el, { opacity: 0, y: 60, duration: 1, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 85%" } }),
      );
    }, root);
    return () => ctx.revert();
  }, []);

  // the name lands once the opening film hands over
  useEffect(() => {
    if (introOpen) return;
    const ctx = gsap.context(() => {
      gsap
        .timeline({ defaults: { ease: "power4.out" } })
        .from(".glyph", { yPercent: 115, duration: 1.1, stagger: 0.045 })
        .from(`.${s.fadeIn}`, { opacity: 0, y: 24, duration: 0.9, stagger: 0.1 }, "-=0.6");
    }, root);
    return () => ctx.revert();
  }, [introOpen]);

  const onHover = (unit: number | null) => {
    window.dispatchEvent(new CustomEvent("cursor:unit", { detail: unit }));
  };

  const onIntroDone = (openWork: boolean) => {
    try {
      sessionStorage.setItem(SEEN, "1");
    } catch {}
    setIntroOpen(false);
    if (openWork) router.push("/work");
  };

  return (
    <main ref={root} className={s.root}>
      {introOpen && <Intro onDone={onIntroDone} />}

      {/* the 3D city rests while the pop-up is open, so the film and the pointer stay smooth */}
      <div className={s.canvas}>{!introOpen && <CityScene onHover={onHover} />}</div>

      <section className={s.hero}>
        <p className={`${s.kicker} mono ${s.fadeIn}`}>Operations leader / Software builder / Abu Dhabi</p>
        <h1 className={`${s.name} display`}>
          <Letters text="Prince" />
          <Letters text="Chakusa" />
        </h1>
        <div className={s.heroFoot}>
          <p className={`${s.lede} ${s.fadeIn}`}>
            From the front desk to leading the team, I have run 350+ holiday homes in Dubai, and I build the software that
            keeps them running. Every tower behind me stands for one of them.
          </p>
          <div className={`${s.heroActions} ${s.fadeIn}`}>
            <button className={`${s.cta} mono`} onClick={() => setIntroOpen(true)}>
              ▶ Watch my story
            </button>
            <Link href="#about" className={`${s.cta} mono`}>
              About me ↓
            </Link>
          </div>
        </div>
        <p className={`${s.hint} mono ${s.fadeIn}`}>Drag to turn the city · Hover a tower · Scroll to fly in</p>
      </section>

      <section id="about" className={`${s.panel} ${s.solid}`}>
        <div className={`${s.aboutGrid} ${s.reveal}`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/prince.jpg" alt="Prince Chakusa" className={s.photo} />
          <div>
            <p className={`${s.kicker} mono`}>About me</p>
            <h2 className={`${s.title} display`}>Hospitality at heart. Builder by habit.</h2>
            <div className={s.aboutText}>
              {ABOUT.map((a) => (
                <p key={a}>{a}</p>
              ))}
            </div>
            <ul className={`${s.facts} mono`}>
              <li>Based in {CONTACT.location}</li>
              <li>From {CONTACT.from}</li>
              <li>{CONTACT.open}</li>
            </ul>
          </div>
        </div>
      </section>

      <section className={`${s.panel} ${s.solid}`}>
        <div className={s.reveal}>
          <p className={`${s.kicker} mono`}>What drives me</p>
          <h2 className={`${s.title} display`}>Why I do this work</h2>
        </div>
        <div className={s.cards}>
          {DRIVES.map((d, i) => (
            <article key={d.t} className={`${s.card} ${s.reveal}`}>
              <p className={`mono ${s.num}`}>0{i + 1}</p>
              <h3 className={`${s.cardTitle} display`}>{d.t}</h3>
              <p>{d.d}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={`${s.panel} ${s.solid}`}>
        <div className={s.reveal}>
          <p className={`${s.kicker} mono`}>My strengths</p>
          <h2 className={`${s.title} display`}>What I bring to a team</h2>
        </div>
        <div className={s.strengths}>
          {STRENGTHS.map((t) => (
            <div key={t.t} className={`${s.strength} ${s.reveal}`}>
              <h3 className="display">{t.t}</h3>
              <p>{t.d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className={`${s.panel} ${s.solid}`}>
        <div className={s.reveal}>
          <p className={`${s.kicker} mono`}>Explore</p>
          <h2 className={`${s.title} display`}>See the rest of my story</h2>
        </div>
        <div className={s.cards}>
          {EXPLORE.map((e) => (
            <Link key={e.href} href={e.href} className={`${s.card} ${s.explore} ${s.reveal}`}>
              <h3 className={`${s.cardTitle} display`}>{e.t} →</h3>
              <p>{e.d}</p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
