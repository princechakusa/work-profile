"use client";

import dynamic from "next/dynamic";
import type { FilmName } from "./Film";

const Film = dynamic(() => import("./Film"), { ssr: false });

/** Lets server-rendered pages place a film; the Player itself only runs in the browser. */
export default function FilmClient({ name }: { name: FilmName }) {
  return <Film name={name} />;
}
