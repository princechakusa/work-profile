import Link from "next/link";
import { CONTACT } from "@/lib/content";
import s from "./Site.module.css";

/** Contact strip at the foot of every page. */
export default function SiteFooter() {
  return (
    <footer className={s.footer}>
      <div>
        <p className={`${s.footKicker} mono`}>Prince Chakusa · {CONTACT.location}</p>
        <p className={s.footLine}>{CONTACT.open}.</p>
      </div>
      <div className={`${s.footLinks} mono`}>
        <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
        <a href={CONTACT.linkedin} target="_blank" rel="noreferrer">
          LinkedIn ↗
        </a>
        <a href={CONTACT.github} target="_blank" rel="noreferrer">
          GitHub ↗
        </a>
        <Link href="/cv">CV</Link>
        <Link href="/contact">Contact →</Link>
      </div>
    </footer>
  );
}
