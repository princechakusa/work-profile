import type { Metadata } from "next";
import CvActions from "@/components/CvActions";
import { CAREER_STATS, CONTACT, FIXHUB, PAMARKET, ROLES, SKILLS, STUDY } from "@/lib/content";
import s from "./Cv.module.css";

export const metadata: Metadata = {
  title: "CV",
  description: "Prince Chakusa's CV: guest experience, property operations, team leadership and software projects in the UAE.",
};

export default function CvPage() {
  return (
    <main id="main-content" className={s.page}>
      <div className={s.toolbar}>
        <p className="mono">Recruiter-ready CV</p>
        <CvActions />
      </div>

      <article className={s.sheet}>
        <header className={s.header}>
          <div>
            <p className={`${s.eyebrow} mono`}>Guest experience · Property operations · Team leadership</p>
            <h1 className="display">Prince Chakusa</h1>
            <p className={s.role}>Guest Relations Executive Supervisor &amp; Software Builder</p>
          </div>
          <address className={s.contact}>
            <span>{CONTACT.location}</span>
            <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
            <a href={CONTACT.linkedin} target="_blank" rel="noreferrer">linkedin.com/in/princechakusa</a>
            <a href={CONTACT.github} target="_blank" rel="noreferrer">github.com/princechakusa</a>
          </address>
        </header>

        <section className={s.summary} aria-labelledby="profile-heading">
          <div>
            <p className={`${s.label} mono`}>Profile</p>
            <h2 id="profile-heading">Operations leadership grounded in frontline experience.</h2>
          </div>
          <p>
            UAE holiday home professional with experience from guest check-in through team and portfolio leadership. I have
            been responsible for more than 350 units, led teams of up to 12 people and improved guest review scores by 25%.
            I also build software, including PaMarket and FixHub, to solve operational problems at the source.
          </p>
        </section>

        <section className={s.metrics} aria-label="Career highlights">
          {CAREER_STATS.map((item) => (
            <div key={item.l}>
              <strong className="display">{item.n}</strong>
              <span>{item.l}</span>
            </div>
          ))}
        </section>

        <section className={s.section} aria-labelledby="experience-heading">
          <div className={s.sectionHead}>
            <p className={`${s.label} mono`}>01</p>
            <h2 id="experience-heading" className="display">Experience</h2>
          </div>
          <div className={s.timeline}>
            {ROLES.map((role) => (
              <article key={role.id} className={s.job}>
                <div className={s.jobMeta}>
                  <p className="mono">{role.when}</p>
                  {role.current && <span>Current</span>}
                </div>
                <div>
                  <h3>{role.title}</h3>
                  <p className={s.company}>{role.company}</p>
                  <ul>
                    {[...role.did.slice(0, 2), ...role.added].map((line) => <li key={line}>{line}</li>)}
                  </ul>
                </div>
              </article>
            ))}
          </div>
        </section>

        <div className={s.twoCol}>
          <section className={s.section} aria-labelledby="projects-heading">
            <div className={s.sectionHead}>
              <p className={`${s.label} mono`}>02</p>
              <h2 id="projects-heading" className="display">Projects</h2>
            </div>
            <article className={s.project}>
              <h3>PaMarket</h3>
              <p>{PAMARKET.summary}</p>
              <a href="https://pamarketzw.com" target="_blank" rel="noreferrer">pamarketzw.com ↗</a>
            </article>
            <article className={s.project}>
              <h3>FixHub</h3>
              <p>{FIXHUB.summary}</p>
            </article>
          </section>

          <section className={s.section} aria-labelledby="skills-heading">
            <div className={s.sectionHead}>
              <p className={`${s.label} mono`}>03</p>
              <h2 id="skills-heading" className="display">Skills</h2>
            </div>
            <div className={s.skillGroups}>
              {SKILLS.map((group) => (
                <div key={group.t}>
                  <h3>{group.t}</h3>
                  <p>{group.items.join(" · ")}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        <section className={s.section} aria-labelledby="education-heading">
          <div className={s.sectionHead}>
            <p className={`${s.label} mono`}>04</p>
            <h2 id="education-heading" className="display">Education &amp; certifications</h2>
          </div>
          <div className={s.education}>
            {STUDY.map((item) => (
              <article key={item.name}>
                <h3>{item.name}</h3>
                <p className={item.done ? s.complete : s.progress}>{item.status}</p>
                <p>{item.what}</p>
              </article>
            ))}
          </div>
        </section>

        <footer className={s.cvFooter}>
          <p>{CONTACT.open}.</p>
          <a href={`mailto:${CONTACT.email}?subject=Role%20for%20Prince%20Chakusa`}>Start a conversation →</a>
        </footer>
      </article>
    </main>
  );
}
