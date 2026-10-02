"""Narrate a reel in the same voice as the portfolio welcome film (Microsoft "Steffan", +10%).

Prince, 2026-10-02: use this voice for every video from now on (the cloned voice sounded too low and not confident).

    pip install edge-tts soundfile
    python scripts/reel_voice.py lines.txt remotion/assets/reels/NAME-vo.wav src/film/reels/NAME-cues.json

lines.txt has one narrated line per line. Each line is spoken separately, so its start and end are exact; lines are
joined with a short pause. The cues file has the same shape the reels already read: {"lines": [{start, end, text}]}.
"""
import asyncio
import io
import json
import sys

import numpy as np
import soundfile as sf

VOICE = "en-US-SteffanNeural"
RATE = "+10%"
GAP = 0.45  # seconds between lines: gives the shortest shots about 1.3 s
SR = 24000


async def speak(text: str) -> np.ndarray:
    import edge_tts

    buf = io.BytesIO()
    async for chunk in edge_tts.Communicate(text, VOICE, rate=RATE).stream():
        if chunk["type"] == "audio":
            buf.write(chunk["data"])
    buf.seek(0)
    audio, sr = sf.read(buf, dtype="float32", always_2d=True)
    audio = audio.mean(axis=1)
    if sr != SR:
        audio = np.interp(np.linspace(0, len(audio), int(len(audio) * SR / sr), endpoint=False), np.arange(len(audio)), audio)
    # trim the silence edge-tts leaves at both ends
    loud = np.where(np.abs(audio) > 0.01)[0]
    return audio[max(0, loud[0] - int(0.03 * SR)) : loud[-1] + int(0.06 * SR)] if len(loud) else audio


async def main(lines_path: str, out_wav: str, out_cues: str) -> None:
    lines = [l.strip() for l in open(lines_path, encoding="utf-8") if l.strip()]
    chunks, cues, t = [], [], 0.0
    for line in lines:
        wav = await speak(line)
        dur = len(wav) / SR
        cues.append({"start": round(t, 3), "end": round(t + dur, 3), "text": line})
        chunks += [wav, np.zeros(int(GAP * SR), dtype=np.float32)]
        t += dur + GAP
        print(f"{dur:5.2f}s  {line}", flush=True)
    audio = np.concatenate(chunks)
    audio = audio / max(1e-6, np.abs(audio).max()) * 0.89
    sf.write(out_wav, audio, SR)
    json.dump({"lines": cues}, open(out_cues, "w", encoding="utf-8"), indent=1, ensure_ascii=False)
    print("total", round(t, 2), "s")


asyncio.run(main(*sys.argv[1:4]))
