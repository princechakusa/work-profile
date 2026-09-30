import type { Metadata } from "next";
import Link from "next/link";
import { CONTACT } from "@/lib/content";
import Backdrop from "@/components/Backdrop";
import s from "@/components/Page.module.css";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact Prince Chakusa in Abu Dhabi. Open to roles in the UAE, the GCC and remote.",
};

export default function ContactPage() {
  return (
    <main id="main-content" className={s.page}>
      <Backdrop />
      <div className={s.inner}>
        <header className={s.head}>
          <p className={`${s.kicker} mono`}>Contact</p>
          <h1 className={`${s.title} display`}>Let&apos;s build something that runs.</h1>
          <p className={s.lede}>
            I am based in {CONTACT.location} and {CONTACT.open.charAt(0).toLowerCase() + CONTACT.open.slice(1)}. You can reach me by
            email or on WhatsApp.
          </p>
        </header>

        <section className={s.section}>
          <a className={`${s.big} display`} href={`mailto:${CONTACT.email}?subject=Role%20for%20Prince%20Chakusa`}>
            {CONTACT.email}
          </a>
          <div className={`${s.actions} mono`}>
            <a className={s.cta} href={`mailto:${CONTACT.email}?subject=Role%20for%20Prince%20Chakusa`}>Email me about a role →</a>
            <a className={s.ghost} href={CONTACT.whatsapp} target="_blank" rel="noreferrer">WhatsApp {CONTACT.phone} ↗</a>
            <Link className={s.ghost} href="/cv">View my CV</Link>
          </div>
          <div className={s.grid}>
            <a className={s.card} href={CONTACT.linkedin} target="_blank" rel="noreferrer">
              <span className={`${s.cardNum} mono`}>LinkedIn ↗</span>
              <p>My experience, recommendations and updates.</p>
            </a>
            <a className={s.card} href={CONTACT.github} target="_blank" rel="noreferrer">
              <span className={`${s.cardNum} mono`}>GitHub ↗</span>
              <p>The code behind PaMarket and FixHub.</p>
            </a>
            <div className={s.card}>
              <span className={`${s.cardNum} mono`}>Location</span>
              <p>
                {CONTACT.location}, originally from {CONTACT.from}.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
