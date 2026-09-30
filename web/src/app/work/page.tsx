import type { Metadata } from "next";
import FilmClient from "@/components/FilmClient";
import { CAREER_STATS, ROLES } from "@/lib/content";
import Backdrop from "@/components/Backdrop";
import s from "@/components/Page.module.css";

export const metadata: Metadata = {
  title: "Work",
  description: "Prince Chakusa's experience in UAE holiday homes: what he did in each role, the value he added, and what he learned.",
};

export default function WorkPage() {
  return (
    <main id="main-content" className={s.page}>
      <Backdrop />
      <div className={s.inner}>
        <header className={s.head}>
          <p className={`${s.kicker} mono`}>Work</p>
          <h1 className={`${s.title} display`}>From the front desk to supervisor.</h1>
          <p className={s.lede}>
            Since 2023 I have worked in four holiday home companies in the UAE. For each role you can see what I was responsible
            for, the value I added to the company, and what the role taught me.
          </p>
        </header>

        <section className={s.stats} aria-label="Career at a glance">
          {CAREER_STATS.map((c) => (
            <div key={c.l} className={s.stat}>
              <div className={`${s.statN} display`}>{c.n}</div>
              <p className={s.statL}>{c.l}</p>
            </div>
          ))}
        </section>

        <section className={s.section}>
          <p className={`${s.sectionKicker} mono`}>The film</p>
          <h2 className={`${s.sectionTitle} display`}>My work story</h2>
          <div className={s.film}>
            <FilmClient name="intro" />
          </div>
          <p className={s.filmNote}>Narrated, with captions. In the Stonetree chapter, move your mouse over the city and hover a building.</p>
        </section>

        <section className={s.section}>
          <p className={`${s.sectionKicker} mono`}>Experience</p>
          <h2 className={`${s.sectionTitle} display`}>Role by role</h2>
          <div className={s.roles}>
            {ROLES.map((r) => (
              <article key={r.id} className={s.role}>
                <p className={`${s.roleWhen} mono`}>
                  {r.when}
                  {r.current && (
                    <>
                      <br />
                      <b>Current role</b>
                    </>
                  )}
                </p>
                <div>
                  <h3 className={`${s.roleTitle} display`}>{r.title}</h3>
                  <p className={s.roleCompany}>{r.company}</p>
                  <div className={s.roleCols}>
                    <div className={s.col}>
                      <h4 className="mono">What I did</h4>
                      <ul>
                        {r.did.map((d) => (
                          <li key={d}>{d}</li>
                        ))}
                      </ul>
                    </div>
                    <div className={s.col}>
                      <h4 className="mono">Value I added</h4>
                      <ul>
                        {r.added.map((d) => (
                          <li key={d}>{d}</li>
                        ))}
                      </ul>
                    </div>
                    <div className={s.col}>
                      <h4 className="mono">What I learned</h4>
                      <p className={s.learned}>{r.learned}</p>
                    </div>
                  </div>
                  {r.note && <p className={s.note}>{r.note}</p>}
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
