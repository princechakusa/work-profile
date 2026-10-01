import FilmClient from "@/components/FilmClient";
import JsonLd from "@/components/JsonLd";
import { FIXHUB, PAMARKET } from "@/lib/content";
import { pageMeta, pamarketSchema } from "@/lib/seo";
import Backdrop from "@/components/Backdrop";
import s from "@/components/Page.module.css";

export const metadata = pageMeta({
  path: "/projects",
  title: "Prince Chakusa Projects | PaMarket and Software Development",
  description:
    "PaMarket, the marketplace for Zimbabwe that Prince Chakusa designed and developed for the web, iOS and Android with React Native, Expo and Supabase, plus FixHub.",
});

export default function ProjectsPage() {
  const [desktop, ...phones] = PAMARKET.shots;
  return (
    <main id="main-content" className={s.page}>
      <JsonLd blocks={[pamarketSchema]} />
      <Backdrop />
      <div className={s.inner}>
        <header className={s.head}>
          <p className={`${s.kicker} mono`}>My project · Live</p>
          <h1 className={`${s.title} display`}>PaMarket.</h1>
          <p className={s.lede}>{PAMARKET.summary}</p>
          <p className={s.muted}>Its tagline is in Ndebele: {PAMARKET.tagline}</p>
          <div className={`${s.links} mono`}>
            {PAMARKET.links.map((l) => (
              <a key={l.t} href={l.h} target="_blank" rel="noreferrer">
                {l.t} ↗
              </a>
            ))}
          </div>
        </header>

        <section className={s.stats} aria-label="PaMarket at a glance">
          {PAMARKET.glance.map((g) => (
            <div key={g.k} className={s.stat}>
              <p className={`${s.sectionKicker} mono`}>{g.k}</p>
              <p className={s.glance}>{g.v}</p>
            </div>
          ))}
        </section>

        <section className={s.section} aria-labelledby="build-heading">
          <p className={`${s.sectionKicker} mono`}>My role</p>
          <h2 id="build-heading" className={`${s.sectionTitle} display`}>How I built it</h2>
          <p className={s.lede}>{PAMARKET.role}</p>
          <div className={s.grid}>
            {PAMARKET.stack.map((t) => (
              <div key={t.t} className={s.card}>
                <h3 className={`${s.cardTitle} display`}>{t.t}</h3>
                <p className={s.muted}>{t.d}</p>
              </div>
            ))}
          </div>
        </section>

        <section className={s.section}>
          <p className={`${s.sectionKicker} mono`}>The film</p>
          <h2 className={`${s.sectionTitle} display`}>Why I built it</h2>
          <div className={s.film}>
            <FilmClient name="projects" />
          </div>
        </section>

        <section className={s.section}>
          <p className={`${s.sectionKicker} mono`}>Live today</p>
          <h2 className={`${s.sectionTitle} display`}>Real screens</h2>
          <div className={`${s.frame} ${s.shotDesktop}`}>
            <div className={s.browserBar}>
              <i />
              <i />
              <i />
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={desktop.src} alt={desktop.alt} loading="lazy" />
          </div>
          <div className={s.phones}>
            {phones.map((p) => (
              <div key={p.src} className={s.phone}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.src} alt={p.alt} loading="lazy" />
              </div>
            ))}
          </div>
          <p className={s.filmNote}>The website at pamarketzw.com and the PaMarket app for iPhone and Android.</p>
        </section>

        <section className={s.section}>
          <p className={`${s.sectionKicker} mono`}>The problem</p>
          <h2 className={`${s.sectionTitle} display`}>Why I created it</h2>
          <div className={s.grid}>
            {PAMARKET.why.map((w, i) => (
              <div key={w} className={s.card}>
                <span className={`${s.cardNum} mono`}>0{i + 1}</span>
                <p>{w}</p>
              </div>
            ))}
          </div>
        </section>

        <section className={s.section}>
          <p className={`${s.sectionKicker} mono`}>The product</p>
          <h2 className={`${s.sectionTitle} display`}>What it does</h2>
          <div className={s.chips}>
            {PAMARKET.categories.map((c) => (
              <span key={c} className={s.chip}>
                {c}
              </span>
            ))}
          </div>
          <div className={s.grid}>
            {PAMARKET.features.map((f) => (
              <div key={f.t} className={s.card}>
                <h3 className={`${s.cardTitle} display`}>{f.t}</h3>
                <p className={s.muted}>{f.d}</p>
              </div>
            ))}
          </div>
        </section>

        <section className={s.section}>
          <p className={`${s.sectionKicker} mono`}>The impact</p>
          <h2 className={`${s.sectionTitle} display`}>Who it helps</h2>
          <div className={s.grid}>
            {PAMARKET.helps.map((h) => (
              <div key={h.who} className={s.card}>
                <h3 className={`${s.cardTitle} display`}>{h.who}</h3>
                <p className={s.muted}>{h.how.charAt(0).toUpperCase() + h.how.slice(1)}</p>
              </div>
            ))}
          </div>
          <a className={`${s.cta} mono`} href="https://pamarketzw.com" target="_blank" rel="noreferrer">
            Visit PaMarket ↗
          </a>
        </section>

        <section className={s.section}>
          <p className={`${s.sectionKicker} mono`}>Also built</p>
          <div className={s.card}>
            <h3 className={`${s.cardTitle} display`}>FixHub</h3>
            <p>{FIXHUB.summary}</p>
            <div className={`${s.links} mono`}>
              {FIXHUB.links.map((l) => (
                <a key={l.t} href={l.h} target="_blank" rel="noreferrer">
                  {l.t} ↗
                </a>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
