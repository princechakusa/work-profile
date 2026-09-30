"use client";

import s from "@/app/cv/Cv.module.css";

export default function CvActions() {
  return (
    <div className={s.actions} aria-label="CV actions">
      <a className={s.primary} href="/Prince-Chakusa-CV.pdf" download>
        Download PDF
      </a>
      <button className={s.secondary} type="button" onClick={() => window.print()}>
        Print or save as PDF
      </button>
    </div>
  );
}
