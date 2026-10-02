"use client";

import dynamic from "next/dynamic";
import Intro from "./Intro";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { scrollState } from "@/lib/scrollState";
import { ABOUT, ANSWERS, CAREER_STATS, CONTACT, DRIVES, ROLES, STRENGTHS } from "@/lib/content";
import { PROFILE } from "@/lib/profile";
import s from "./Home.module.css";
import { asset } from "@/lib/site";

const CityScene = dynamic(() => import("./CityScene"), { ssr: false });

gsap.registerPlugin(ScrollTrigger);

/**
 * Splits text into per-letter spans so each glyph can rise out of a mask. Letters are drawn from a data attribute,
 * so the heading's text stays exactly "Prince Chakusa" for screen readers and crawlers.
 */
function Letters({ text }: { text: string }) {
  return (
    <span className={s.line} aria-hidden>
      {text.split("").map((c, i) => (
        <span key={i} className={s.mask} aria-hidden>
          <span className={`${s.glyph} glyph`} data-c={c} />
        </span>
      ))}
    </span>
  );
}

const EXPLORE = [
  { href: "/work", t: "Work", d: "Every role: responsibilities, achievements and key learning." },
  { href: "/projects", t: "Projects", d: "PaMarket and FixHub: products built from real problems." },
  { href: "/education", t: "Education", d: "My qualifications, and how each one helps me at work." },
  { href: "/why-me", t: "Why me", d: "Four reasons to hire me, and what a colleague says." },
];

const SEEN = "pc-intro-seen";

/** The home page is about Prince himself: who he is, what drives him, and his strengths. */
export default function Home() {
  const root = useRef<HTMLElement>(null);
  const router = useRouter();
  const [introOpen, setIntroOpen] = useState(false);
  const [autoplay, setAutoplay] = useState(false);
  const [offer, setOffer] = useState(false);

  // recruiters see the headline first; the film is offered by a small card a few seconds later, once per visit
  useEffect(() => {
    let seen = false;
    try {
      seen = !!sessionStorage.getItem(SEEN);
    } catch {}
    if (seen) return;
    const t = window.setTimeout(() => setOffer(true), 4500);
    return () => window.clearTimeout(t);
  }, []);

  const openFilm = (play: boolean) => {
    setOffer(false);
    setAutoplay(play);
    setIntroOpen(true);
  };
  const dismissOffer = () => {
    setOffer(false);
    try {
      sessionStorage.setItem(SEEN, "1");
    } catch {}
  };

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

  // the name lands as the page arrives
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap
        .timeline({ defaults: { ease: "power4.out" } })
        .from(".glyph", { yPercent: 115, duration: 1.1, stagger: 0.045 })
        .from(`.${s.fadeIn}`, { opacity: 0, y: 24, duration: 0.9, stagger: 0.1 }, "-=0.6");
    }, root);
    return () => ctx.revert();
  }, []);

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
    <main id="main-content" ref={root} className={s.root}>
      {introOpen && <Intro onDone={onIntroDone} autoplay={autoplay} />}
      {offer && !introOpen && (
        <aside className={`${s.filmOffer} mono`} aria-label="Watch Prince's two-minute story">
          <button className={s.filmOfferPlay} onClick={() => openFilm(true)}>
            <span aria-hidden>▶</span> Watch my 2-minute story
          </button>
          <button className={s.filmOfferClose} onClick={dismissOffer} aria-label="Dismiss">
            ✕
          </button>
        </aside>
      )}

      {/* the 3D city rests while the pop-up is open, so the film and the pointer stay smooth */}
      <div className={s.canvas}>{!introOpen && <CityScene onHover={onHover} />}</div>

      <section className={s.hero}>
        <div className={`${s.heroMeta} ${s.fadeIn}`}>
          <p className={`${s.kicker} mono`}>Based in {PROFILE.location.label}</p>
          <span className={`${s.available} mono`}>Open to work</span>
        </div>
        <h1 className={`${s.name} display`}>
          {/* the visible name is split into animated letters; this is the name read by screen readers and crawlers */}
          <span className="sr-only">{PROFILE.name}</span>
          <Letters text="Prince" />
          <Letters text="Chakusa" />
        </h1>
        <p className={`${s.roleLine} ${s.fadeIn}`}>
          <strong>{PROFILE.currentRole}</strong> · Hospitality &amp; Property Operations · UAE
          <span>
            Now at {PROFILE.currentEmployer}, {PROFILE.location.city}
          </span>
        </p>
        <div className={s.heroFoot}>
          <p className={`${s.lede} ${s.fadeIn}`}>
            From the front desk to leading the team, I have run 350+ holiday homes in the UAE, and I build the software that
            keeps them running. Every tower behind me stands for one of them.
          </p>
          <div className={`${s.heroActions} ${s.fadeIn}`}>
            <a className={`${s.cta} ${s.primaryCta} mono`} href={`mailto:${CONTACT.email}?subject=Role%20for%20Prince%20Chakusa`}>
              Email me about a role
            </a>
            <Link href="/cv" className={`${s.cta} mono`}>
              View CV
            </Link>
            <button className={`${s.cta} mono`} onClick={() => openFilm(true)}>
              ▶ Watch my story
            </button>
          </div>
        </div>
        <div className={`${s.proofStrip} ${s.fadeIn}`} aria-label="Career highlights">
          {CAREER_STATS.slice(1).map((item) => (
            <div key={item.l}>
              <strong className="display">{item.n}</strong>
              <span>{item.l}</span>
            </div>
          ))}
        </div>
        <p className={`${s.hint} mono ${s.fadeIn}`}>Drag to turn the city · Hover a tower · Scroll to fly in</p>
      </section>

      <section id="career" className={`${s.panel} ${s.solid}`} aria-labelledby="career-heading">
        <div className={s.reveal}>
          <p className={`${s.kicker} mono`}>Career</p>
          <h2 id="career-heading" className={`${s.title} display`}>Four companies, one direction</h2>
        </div>
        <ol className={s.career}>
          {ROLES.map((r) => (
            <li key={r.id} className={`${s.careerRow} ${s.reveal}`}>
              <p className={`mono ${s.careerWhen}`}>
                {r.when}
                {r.current && <b>Current</b>}
              </p>
              <div>
                <h3 className={s.careerTitle}>{r.title}</h3>
                <p className={s.careerCompany}>
                  {r.company} · {r.location}
                </p>
              </div>
              <p className={s.careerWin}>{r.added[0]}</p>
            </li>
          ))}
        </ol>
        <div className={s.links}>
          <Link href="/work">Full work history →</Link>
          <Link href="/cv">View my CV</Link>
        </div>
      </section>

      <section id="about" className={`${s.panel} ${s.solid}`}>
        <div className={`${s.aboutGrid} ${s.reveal}`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={asset("/prince.jpg")} alt="Portrait of Prince Chakusa" className={s.photo} />
          <div>
            <p className={`${s.kicker} mono`}>About me</p>
            <h2 className={`${s.title} display`}>Hospitality at heart. Builder by habit.</h2>
            <div className={s.aboutText}>
              {ABOUT.map((a) => (
                <p key={a}>{a}</p>
              ))}
            </div>
            <h3 className={`${s.kicker} mono ${s.drivesHead}`}>What drives me</h3>
            <ul className={s.drives}>
              {DRIVES.map((d) => (
                <li key={d.t}>
                  <strong>{d.t}.</strong> {d.d}
                </li>
              ))}
            </ul>
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

      <section id="profile" className={`${s.panel} ${s.solid}`} aria-labelledby="profile-heading">
        <div className={s.reveal}>
          <p className={`${s.kicker} mono`}>Profile at a glance</p>
          <h2 id="profile-heading" className={`${s.title} display`}>Quick answers</h2>
          <p className={s.profileSummary}>{PROFILE.summary}</p>
        </div>
        <div className={s.answers}>
          {ANSWERS.map((x) => (
            <details key={x.q} className={s.answer}>
              <summary>
                <h3>{x.q}</h3>
              </summary>
              <p>{x.a}</p>
              {x.link && (
                <Link href={x.link.href} className="mono">
                  {x.link.t} →
                </Link>
              )}
            </details>
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

      <section className={`${s.panel} ${s.solid} ${s.closingPanel}`}>
        <div className={s.reveal}>
          <p className={`${s.kicker} mono`}>Available for the right team</p>
          <h2 className={`${s.closer} display`}>Need an operator who can improve the system too?</h2>
          <p className={s.closingCopy}>
            I am open to guest experience, property operations and team leadership roles across the UAE, the GCC and remotely.
          </p>
          <div className={s.links}>
            <a href={`mailto:${CONTACT.email}?subject=Role%20for%20Prince%20Chakusa`}>Email me about a role</a>
            <Link href="/cv">View my CV</Link>
            <a href={CONTACT.linkedin} target="_blank" rel="noreferrer">LinkedIn ↗</a>
          </div>
        </div>
      </section>
    </main>
  );
}
