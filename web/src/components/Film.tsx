"use client";

import { useEffect, useRef, useState } from "react";
import { Player, type PlayerRef } from "@remotion/player";
import { prefetch } from "remotion";
import { FPS, H, W } from "@/film/kit";
import voice from "@/film/voice.json";
import { IntroFilm, INTRO_DUR, INTRO_POSTER } from "@/film/IntroFilm";
import { ProjectsFilm, PROJECTS_DUR, PROJECTS_POSTER } from "@/film/ProjectsFilm";
import { EducationFilm, EDUCATION_DUR, EDUCATION_POSTER } from "@/film/EducationFilm";
import s from "./Film.module.css";

const FILMS = {
  intro: { component: IntroFilm, dur: INTRO_DUR, poster: INTRO_POSTER, label: "my work story" },
  projects: { component: ProjectsFilm, dur: PROJECTS_DUR, poster: PROJECTS_POSTER, label: "the PaMarket film" },
  education: { component: EducationFilm, dur: EDUCATION_DUR, poster: EDUCATION_POSTER, label: "the foundations film" },
};
export type FilmName = keyof typeof FILMS;

let preloaded = false;
/** Fetches every narration clip up front so the film never stalls waiting for audio. */
export function preloadVoice() {
  if (preloaded) return;
  preloaded = true;
  for (const id of Object.keys(voice)) prefetch(`/voice/${id}.mp3`, { method: "blob-url" });
}

type Props = {
  name: FilmName;
  /** Start playing at once. Only do this after a click, or the browser will block the voice. */
  autoPlay?: boolean;
  onEnded?: () => void;
};

/** A narrated film. Without autoPlay it waits behind a play button, and pauses when scrolled off screen. */
export default function Film({ name, autoPlay = false, onEnded }: Props) {
  const wrap = useRef<HTMLDivElement>(null);
  const player = useRef<PlayerRef>(null);
  const [started, setStarted] = useState(autoPlay);
  const film = FILMS[name];

  useEffect(() => {
    const p = player.current;
    if (!p || !onEnded) return;
    p.addEventListener("ended", onEnded);
    return () => p.removeEventListener("ended", onEnded);
  }, [onEnded]);

  useEffect(preloadVoice, []);

  useEffect(() => {
    if (!wrap.current) return;
    const io = new IntersectionObserver(([entry]) => !entry.isIntersecting && player.current?.pause(), { threshold: 0.2 });
    io.observe(wrap.current);
    return () => io.disconnect();
  }, []);

  // before the first play the film rests on a poster frame; playing starts from the beginning
  const start = () => {
    setStarted(true);
    player.current?.seekTo(0);
    player.current?.play();
  };

  return (
    <div ref={wrap} data-nocursor className={s.root} style={{ aspectRatio: `${W} / ${H}` }}>
      <Player
        ref={player}
        component={film.component}
        durationInFrames={film.dur}
        compositionWidth={W}
        compositionHeight={H}
        fps={FPS}
        autoPlay={autoPlay}
        initialFrame={autoPlay ? 0 : film.poster}
        controls={started}
        clickToPlay={started}
        moveToBeginningWhenEnded={false}
        acknowledgeRemotionLicense
        style={{ width: "100%", height: "100%" }}
      />
      {!started && (
        <button className={`${s.play} mono`} onClick={start}>
          <span className={s.disc}>▶</span>
          Play {film.label} ({Math.floor(film.dur / FPS / 60)}:{String(Math.round(film.dur / FPS) % 60).padStart(2, "0")}, with sound)
        </button>
      )}
    </div>
  );
}
