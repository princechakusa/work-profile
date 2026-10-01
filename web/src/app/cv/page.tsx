import CvActions from "@/components/CvActions";
import { AML, CAREER_STATS, CONTACT, FIXHUB, PAMARKET, ROLES, SKILLS, STUDY } from "@/lib/content";
import { PROFILE } from "@/lib/profile";
import { pageMeta } from "@/lib/seo";
import s from "./Cv.module.css";

export const metadata = pageMeta({
  path: "/cv",
  title: "Prince Chakusa CV | Guest Relations Supervisor, Hospitality and Technology",
  description:
    "CV of Prince Chakusa, Guest Relations Supervisor in Abu Dhabi: 350+ units, teams of up to 12, DTCM compliance, PaMarket and AML-CFT studies.",
});

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
            <p className={`${s.eyebrow} mono`}>Guest relations · Hospitality and property operations · Team leadership</p>
            <h1 className="display">{PROFILE.name}</h1>
            <p className={s.role}>
              {PROFILE.currentRole}, {PROFILE.currentEmployer} · Software developer
            </p>
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
            {PROFILE.currentRole} in {PROFILE.location.label}, with experience in UAE holiday homes from guest check-in
            through team and portfolio leadership. I have been responsible for more than 350 units, led teams of up to 12
            people, kept a portfolio DTCM compliant and improved guest review scores by 25%. I also develop software,
            including PaMarket, to solve operational problems at the source.
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
                  <p className={s.company}>
                    {role.company} · {role.location}
                  </p>
                  <ul>
                    {[...role.did, ...role.added].map((line) => <li key={line}>{line}</li>)}
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
              <p>
                <strong>Role:</strong> product design and software development. <strong>Built with:</strong> {PAMARKET.techSummary}.
              </p>
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
                {item.institution && <p>{item.institution}</p>}
                <p className={item.done ? s.complete : s.progress}>{item.status}</p>
                <p>{item.what}</p>
              </article>
            ))}
          </div>
        </section>

        <section className={s.section} aria-labelledby="development-heading">
          <div className={s.sectionHead}>
            <p className={`${s.label} mono`}>05</p>
            <h2 id="development-heading" className="display">Professional development</h2>
          </div>
          <article className={s.project}>
            <h3>AML-CFT Certificate ({AML.status.toLowerCase()})</h3>
            <p>{AML.covers}</p>
            <p>{AML.why}</p>
            <p>{AML.note}</p>
          </article>
        </section>

        <footer className={s.cvFooter}>
          <p>{CONTACT.open}.</p>
          <a href={`mailto:${CONTACT.email}?subject=Role%20for%20Prince%20Chakusa`}>Start a conversation →</a>
        </footer>
      </article>
    </main>
  );
}
