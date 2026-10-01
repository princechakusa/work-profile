import type { ComponentType, CSSProperties } from "react";
import { Composition, registerRoot } from "remotion";
import { loadFont as loadDisplay } from "@remotion/google-fonts/BigShoulders";
import { loadFont as loadBody } from "@remotion/google-fonts/FamiljenGrotesk";
import { loadFont as loadMono } from "@remotion/google-fonts/MartianMono";
import { FPS, H, W } from "../src/film/kit";
import { IntroFilm, INTRO_DUR } from "../src/film/IntroFilm";
import { ProjectsFilm, PROJECTS_DUR } from "../src/film/ProjectsFilm";
import { EducationFilm, EDUCATION_DUR } from "../src/film/EducationFilm";
import { InsightReel, RH, RW, reelDuration } from "../src/film/reels/InsightReel";
import { REELS } from "../src/film/reels/reels";

// the site loads these with next/font; the render loads the same fonts and exposes the same CSS variables
const fonts = {
  "--font-display": loadDisplay("normal", { weights: ["700", "800", "900"], subsets: ["latin"] }).fontFamily,
  "--font-body": loadBody("normal", { weights: ["400", "500", "600"], subsets: ["latin"] }).fontFamily,
  "--font-mono": loadMono("normal", { weights: ["400", "500"], subsets: ["latin"] }).fontFamily,
} as CSSProperties;

const withFonts = (Film: ComponentType) =>
  function WithFonts() {
    return (
      <div style={{ ...fonts, position: "absolute", inset: 0 }}>
        <Film />
      </div>
    );
  };

/** Remotion entry for rendering the site's films to MP4: `npm run films`. */
function Root() {
  return (
    <>
      <Composition id="intro" component={withFonts(IntroFilm)} durationInFrames={INTRO_DUR} fps={FPS} width={W} height={H} />
      <Composition id="projects" component={withFonts(ProjectsFilm)} durationInFrames={PROJECTS_DUR} fps={FPS} width={W} height={H} />
      <Composition id="education" component={withFonts(EducationFilm)} durationInFrames={EDUCATION_DUR} fps={FPS} width={W} height={H} />
      {Object.entries(REELS).map(([id, r]) => (
        <Composition key={id} id={id} component={withFonts(() => <InsightReel {...r} />)} durationInFrames={reelDuration(r)} fps={FPS} width={RW} height={RH} />
      ))}
    </>
  );
}

registerRoot(Root);
