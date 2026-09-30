"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import s from "./Site.module.css";

const LINKS = [
  { href: "/", t: "Home" },
  { href: "/work", t: "Work" },
  { href: "/projects", t: "Projects" },
  { href: "/education", t: "Education" },
  { href: "/why-me", t: "Why me" },
  { href: "/cv", t: "CV" },
  { href: "/contact", t: "Contact" },
];

/** Site-wide navigation. Collapses into a full-screen menu on small screens. */
export default function SiteNav() {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const [going, setGoing] = useState<string | null>(null);

  useEffect(() => {
    setOpen(false);
    setGoing(null);
  }, [path]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className={`${s.nav} mono`}>
      <Link href="/" className={s.brand}>
        Prince Chakusa
      </Link>
      <nav id="main-navigation" className={`${s.links} ${open ? s.open : ""}`} aria-label="Main">
        {LINKS.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className={path === l.href || going === l.href ? s.active : ""}
            aria-current={path === l.href ? "page" : undefined}
            onClick={() => l.href !== path && setGoing(l.href)}
          >
            {l.t}
          </Link>
        ))}
      </nav>
      <span className={s.status}>Open to roles · UAE · GCC · Remote</span>
      {going && <span className={s.loading} aria-hidden />}
      <button className={s.burger} onClick={() => setOpen((o) => !o)} aria-controls="main-navigation" aria-expanded={open} aria-label={open ? "Close menu" : "Open menu"}>
        {open ? "Close" : "Menu"}
      </button>
    </header>
  );
}
