import Link from "next/link";
import { CONTACT, QUOTE, REASONS, SKILLS } from "@/lib/content";
import Backdrop from "@/components/Backdrop";
import { pageMeta } from "@/lib/seo";
import s from "@/components/Page.module.css";

export const metadata = pageMeta({
  path: "/why-me",
  title: "Why Hire Prince Chakusa | Hospitality Operations and Technology",
  description:
    "Why hire Prince Chakusa: guest relations experience at every level, measurable results, team leadership, and the software skills to fix problems at the source.",
});

export default function WhyMePage() {
  return (
    <main id="main-content" className={s.page}>
      <Backdrop />
      <div className={s.inner}>
        <header className={s.head}>
          <p className={`${s.kicker} mono`}>Why me</p>
          <h1 className={`${s.title} display`}>Why you should hire me.</h1>
          <p className={s.lede}>
            I know holiday home operations from the front desk up, I can show you the results, and I build the tools that make
            the work run better.
          </p>
        </header>

        <section className={s.section}>
          <p className={`${s.sectionKicker} mono`}>Four reasons</p>
          <div className={s.grid}>
            {REASONS.map((r, i) => (
              <div key={r.t} className={s.card}>
                <span className={`${s.cardNum} mono`}>0{i + 1}</span>
                <h2 className={`${s.cardTitle} display`}>{r.t}</h2>
                <p className={s.muted}>{r.d}</p>
              </div>
            ))}
          </div>
        </section>

        <section className={s.section}>
          <p className={`${s.sectionKicker} mono`}>In their words</p>
          <blockquote className={s.quote}>
            <p>“{QUOTE.text}”</p>
            <footer className="mono">
              <span>
                {QUOTE.by}, {QUOTE.role}
              </span>
              <a href={QUOTE.link} target="_blank" rel="noreferrer">
                View on LinkedIn ↗
              </a>
            </footer>
          </blockquote>
        </section>

        <section className={s.section}>
          <p className={`${s.sectionKicker} mono`}>What I bring</p>
          <h2 className={`${s.sectionTitle} display`}>Skills and tools</h2>
          <div className={s.grid}>
            {SKILLS.map((g) => (
              <div key={g.t} className={s.card}>
                <h3 className={`${s.cardTitle} display`}>{g.t}</h3>
                <div className={s.chips}>
                  {g.items.map((i) => (
                    <span key={i} className={s.chip}>
                      {i}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className={s.section}>
          <h2 className={`${s.sectionTitle} display`}>Let&apos;s talk about your team.</h2>
          <div className={`${s.actions} mono`}>
            <a className={s.cta} href={`mailto:${CONTACT.email}?subject=Role%20for%20Prince%20Chakusa`}>
              Email me about a role →
            </a>
            <Link className={s.ghost} href="/cv">
              View my CV
            </Link>
            <Link className={s.ghost} href="/work">
              See my work
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
