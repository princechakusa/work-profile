import type { Metadata } from "next";
import FilmClient from "@/components/FilmClient";
import { STUDY } from "@/lib/content";
import Backdrop from "@/components/Backdrop";
import s from "@/components/Page.module.css";

export const metadata: Metadata = {
  title: "Education · Prince Chakusa",
  description: "Prince Chakusa's qualifications, the roles each one applies to, and how each one helped him level up.",
};

export default function EducationPage() {
  return (
    <main className={s.page}>
      <Backdrop />
      <div className={s.inner}>
        <header className={s.head}>
          <p className={`${s.kicker} mono`}>Education</p>
          <h1 className={`${s.title} display`}>My foundations.</h1>
          <p className={s.lede}>
            Every qualification I have taken connects to the work I do. For each one, you can see the roles where I use it and
            how it helped me level up.
          </p>
        </header>

        <section className={s.section}>
          <p className={`${s.sectionKicker} mono`}>The film</p>
          <h2 className={`${s.sectionTitle} display`}>Built floor by floor</h2>
          <div className={s.film}>
            <FilmClient name="education" />
          </div>
          <p className={s.filmNote}>Narrated, with captions. Finished qualifications are complete buildings; the ones I am studying now are still under construction.</p>
        </section>

        <section className={s.section}>
          <p className={`${s.sectionKicker} mono`}>Qualifications</p>
          <h2 className={`${s.sectionTitle} display`}>What each one gave me</h2>
          <div className={s.studies}>
            {STUDY.map((q) => (
              <article key={q.name} className={s.study}>
                <div>
                  <h3 className={`${s.studyName} display`}>{q.name}</h3>
                  <span className={`${s.badge} ${q.done ? s.badgeDone : ""} mono`}>{q.status}</span>
                  <p className={s.muted} style={{ marginTop: 14 }}>
                    {q.what}
                  </p>
                </div>
                <div className={s.col}>
                  <h4 className="mono">Where I use it</h4>
                  <div className={s.chips}>
                    {q.applied.map((a) => (
                      <span key={a} className={s.chip}>
                        {a}
                      </span>
                    ))}
                  </div>
                  <h4 className="mono" style={{ marginTop: 26 }}>
                    How it helped me level up
                  </h4>
                  <p className={s.learned}>{q.levelUp}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
