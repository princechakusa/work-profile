# Handoff: where Claude left off (2026-10-02)

Read CLAUDE.md first for the project. This file is only the unfinished work.

## 1. Tomorrow's LinkedIn video: "Read the reviews properly" (RENDERED, waiting for Prince)

Status 2026-10-02 afternoon: steps 1 to 3 and 5 are done. Voice generated in his cloned voice (13 lines, 35 s), copied in,
composition `linkedin-reviews` registered, rendered and loudness-normalised to
`docs/media/linkedin/prince-chakusa-reviews.mp4` (now 45.8 s in the confident voice, 1080x1350, 30 fps, stereo AAC, peak -1.3 dBFS, no silent gaps).
Frames checked against every narration line. Committed and pushed.
**Only step 4 is left:** Prince watches it, then it is scheduled for 2026-10-03 ~9:00 with the caption in `C:\Users\Dev Prince\AppData\Local\Temp\reel\cap-reviews.txt`.
If LinkedIn automation is blocked, give him the manual steps.
Note: the `Prince 1` Windows account cannot run Dev Prince's WinGet ffmpeg (access denied); Remotion's bundled
ffmpeg (`npx remotion ffmpeg`) has no null or PNG encoder, so check frames and audio through Chrome instead.

Prince approved the showreel format (see `docs/media/linkedin/prince-chakusa-human-with-ai.mp4`, built by `web/src/film/reels/Showreel.tsx`). He wants the next video voiced in **his own cloned voice** and **scheduled to post tomorrow (2026-10-03)**, after he watches it.

Steps left:
1. **Voice** (local, offline, CPU): `C:\Users\Dev Prince\voice-clone\`
   - Reference sample: `prince_ref.wav` (from his WhatsApp note in Downloads, 2026-10-02 10:06).
   - Script lines: `reviews.txt` (13 lines). Generator: `speak.py` (F5-TTS, NFE=16, resumes from `parts/` if stopped).
   - Run: `cd "C:\Users\Dev Prince\voice-clone" && PYTHONIOENCODING=utf-8 .venv/Scripts/python.exe speak.py reviews.txt reviews-vo.wav reviews-cues.json > speak.log 2>&1` (about 1-2 min per line after a ~3 min model load). Lines already done are reused.
   - Output: `reviews-vo.wav` + `reviews-cues.json`.
2. **Copy into the reel**: `reviews-vo.wav` → `web/remotion/assets/reels/reviews-vo.wav`; `reviews-cues.json` → `web/src/film/reels/reviews-cues.json`.
3. **Register + render**: add to `web/remotion/index.tsx`
   `import { RV_DUR, RV_FPS, RV_H, RV_W, ReviewsReel } from "../src/film/reels/ReviewsReel";` and
   `<Composition id="linkedin-reviews" component={ReviewsReel} durationInFrames={RV_DUR} fps={RV_FPS} width={RV_W} height={RV_H} />`.
   Then `cd web && npx tsc --noEmit && npx remotion render remotion/index.tsx linkedin-reviews ../docs/media/linkedin/reviews-raw.mp4 --public-dir=remotion/assets --crf=19`
   and normalise: `ffmpeg -i reviews-raw.mp4 -c:v copy -af loudnorm=I=-14:TP=-1.5:LRA=11 -c:a aac -b:a 192k prince-chakusa-reviews.mp4`.
   Footage clips are in `web/remotion/assets/reels/c/` (git-ignored; originals in `%TEMP%\reel\orig2`). Check a few stills first.
4. **Show Prince**, then schedule on LinkedIn for tomorrow ~9:00 with the styled caption in `%TEMP%\reel\cap-reviews.txt` (source `.md` beside it; convert with `docs/linkedin/style.py`). LinkedIn automation: raw CDP helper `%TEMP%\cdo.mjs` against Chrome on port 9333 (see CLAUDE.md). Note: the auto-mode safety check has blocked LinkedIn scheduling and job applications before; if blocked, give Prince the steps instead.
5. Commit and push (ReviewsReel.tsx, cues json, index.tsx, the mp4).

## Prince's two cloned voices (2026-10-02)
Recorded by Prince at 13:29 and 13:30 (WhatsApp notes in `C:/Users/Surface/Downloads`), cut into F5-TTS reference
clips in `C:/Users/Dev Prince/voice-clone/voices/` (see the README there):
- **confident**: clear and energetic. Use for LinkedIn reels and showreels, portfolio films, hooks and calls to action.
- **conversational**: relaxed and chatty. Use for informal explainers and walk-through videos.
- The old `prince_ref.wav` (10:06 note) sounded flat; Prince called it lazy. Do not use it.
Generate with `VOICE=confident .venv/Scripts/python.exe speak.py lines.txt out.wav cues.json` (cached lines are kept per voice).
The reviews reel was re-voiced with **confident** (45.8 s), then rebuilt as v2 with new footage, music and the motion kit. Loudness step works with `npx remotion ffmpeg ... -af loudnorm=...`.

## Every reel must look different, with a dynamic edit (Prince, 2026-10-02)
- **New footage, people and music per video.** `web/src/film/reels/footage.json` lists every clip and track already used;
  pick only unlisted ones. Footage: Pexels, searched and downloaded with Playwright (headed Chrome; open a new page per
  search; 1080p file `ID-hd_1080_1920_FPS.mp4` when it exists, else the /download/video/ID/ link), then converted with
  `npx remotion ffmpeg -i in.mp4 -t 8 -vf scale=1080:-2 -r 30 -c:v libx264 -crf 21 -an out.mp4` (this ffmpeg build has
  no fps, null or PNG output). Music: Mixkit tracks (`assets.mixkit.co/music/N/N.mp3`); avoid Envato "preview" files,
  they carry audio watermarks.
- **Its own look:** palette, caption treatment and grade per video (reviews v2 = teal and amber).
- **Edit style:** use `web/src/film/reels/motion.tsx`: a camera move on every shot (zoom, pan, tilt, rotate, dolly,
  orbit) and motion-matched cuts (whip, zoom-through, spin, vertical push, flash). Cut every 1.5 to 2.5 s; split long
  narration lines into several shots; put each beat's graphics in its shot's `children` so they leave with the cut.
  Not static, not frantic.
- Music sits about 15 dB under the voice (volume 0.07 under speech, 0.6 in the intro and outro).

## 2. Job hunt
- Tracker (live, shared db): https://claude.ai/artifact/KQFFjatUAaMCmFibrBp1ED, collections `jobs` and `recruiters` (10 + 10 seeded). Prince updates statuses there.
- Claude cannot submit job applications or send recruiter messages (blocked by the safety check). The Rixos Guest Relations Manager application was filled to page 3 of 6 in Chrome; Prince must finish it (salary/notice questions).
- A session-only daily refresh (cron 8:13) was scheduled in this session; it dies when this session ends. A new agent should re-create it with CronCreate if Prince wants it.

## 3. Done today (for context)
- princechakusa.com live (GitHub Pages + Cloudflare DNS), Search Console verified, sitemap submitted, Cloudflare Web Analytics, hello@princechakusa.com forwarding.
- Portfolio film now opens "350+ homes. 12 people. One standard." and ends with a call to action.
- LinkedIn profile repositioned (operations + AML/KYC in development), showreel posted with bold Unicode caption.
- GitHub profile filled; profile README repo published.
