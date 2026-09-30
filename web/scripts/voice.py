"""Generate the film narration.

Writes one MP3 per line to public/voice/ and the line lengths + caption text to src/film/voice.json.
Scene timing in the films is derived from voice.json, so re-run this after changing any line:

    pip install edge-tts mutagen
    python scripts/voice.py              # regenerate every line with VOICE
    python scripts/voice.py --samples    # write public/voice/samples/<voice>.mp3 for each CANDIDATE
    python scripts/voice.py --measure    # keep the MP3s, only refresh the lengths

To use Prince's own recorded voice instead, drop MP3s with the same names into public/voice/ and run
with --measure.
"""
import asyncio
import json
import os
import sys

from mutagen.mp3 import MP3

VOICE = "en-US-SteffanNeural"
RATE = "+10%"

# American English male voices to audition at /voices.html
CANDIDATES = [
    "en-US-AndrewNeural", "en-US-BrianNeural", "en-US-ChristopherNeural", "en-US-EricNeural",
    "en-US-GuyNeural", "en-US-RogerNeural", "en-US-SteffanNeural",
]
SAMPLE = (
    "Hi, I'm Prince Chakusa. I started my career in 2023 as a Guest Relations Officer at Daniels Holiday Homes. "
    "I managed DTCM compliance, standard operating procedures, and reporting at Stonetree. "
    "Today, I am the Guest Experience Lead at Luxury Homevy."
)

# id: (what the voice says, what the caption shows; None = same)
# The voice never reads what Prince says to a guest; those lines are silent speech bubbles in the film.
# Each role covers: responsibility, results, and what it taught him.
LINES = {
    # opening film
    "h1": ("Hi, I'm Prince Chakusa.", None),
    "h2": ("Please don't scroll yet. Give me two minutes, and I will show you what I have done.", None),
    "d1": ("I started my career in 2023 as a Guest Relations Officer at Daniels Holiday Homes.", None),
    "d2": ("I was responsible for welcoming guests, checking them in, and supporting them throughout their stay.", None),
    "d3": ("During my time there, guest review scores increased by twenty-five percent, and guest satisfaction increased by twenty percent.",
           "During my time there, guest review scores increased by 25%, and guest satisfaction increased by 20%."),
    "d4": ("I also helped reduce the front desk workload by forty percent with digital concierge tools, and I reduced onboarding time by twenty percent.",
           "I also helped reduce the front desk workload by 40% with digital concierge tools, and I reduced onboarding time by 20%."),
    "d5": ("This role taught me how to understand what a guest needs, and how to solve problems quickly.", None),
    "s1": ("I then joined Stonetree as a Customer Care Agent, and I was promoted to Team Leader of Property Operations.", None),
    "s2": ("As Team Leader, I was responsible for more than three hundred and fifty units.",
           "As Team Leader, I was responsible for more than 350 units."),
    "s3": ("I led a team of twelve people across concierge, maintenance, and housekeeping.",
           "I led a team of 12 people across concierge, maintenance, and housekeeping."),
    "s4": ("I managed DTCM compliance, standard operating procedures, vendor service level agreements, and reporting.", None),
    "s5": ("This role taught me how to lead a team, and how to keep standards consistent across a large portfolio.", None),
    "l1": ("Next, I became the Guest Experience Lead at Luxury Homevy.", None),
    "l2": ("I was responsible for the guest experience across forty properties, and I led a team of five.",
           "I was responsible for the guest experience across 40 properties, and I led a team of 5."),
    "l3": ("We communicated with guests through Hostaway and WhatsApp, and I tracked our service levels and procedures.", None),
    "l4": ("I analysed more than two hundred guest reviews to understand what guests value most.",
           "I analysed more than 200 guest reviews to understand what guests value most."),
    "l5": ("This role taught me how to use guest feedback to improve our service.", None),
    "a1": ("Today, I am the Guest Relations Executive Supervisor at The Authors Holiday Homes.", None),
    "a2": ("I supervise the guest relations team, and I make sure that every guest is looked after from arrival to departure.", None),
    "a3": ("I handle escalated guest issues, and I coach the team to resolve problems the first time.", None),
    "a4": ("I have also improved the company's systems and the way the team is managed.", None),
    "a5": ("This role is teaching me how to build a team that delivers the same standard every day.", None),
    "w1": ("So, why should you hire me?", None),
    "w2": ("First, I have worked at every level, from the front desk to leading a team.", None),
    "w3": ("Second, my results are measurable.", None),
    "w4": ("Third, I build software, so I can solve operational problems at the source.", None),
    "o1": ("That is the short version. Open the Work section to read the full story.", None),
    # projects film: PaMarket only
    "p1": ("This is PaMarket, an online marketplace that I designed and built for Zimbabwe. People use it to buy, sell, find work, and discover trusted businesses.", None),
    "p2": ("Buying, selling, and job hunting were scattered across many different group chats, with no search and no protection.", None),
    "p3": ("So I built one trusted place for all of it.", None),
    "p4": ("People can buy and sell across all ten provinces, find jobs, browse cars, and discover verified businesses.",
           "People can buy and sell across all 10 provinces, find jobs, browse cars, and discover verified businesses."),
    "p5": ("Prices can be shown in US dollars or ZiG, and listings are screened for fraud.", None),
    "p6": ("It is live on the web, the App Store, and Google Play.", None),
    "p7": ("It helps buyers find what they need safely, and it helps sellers reach more people.", None),
    "m1": ("You can explore PaMarket below.", None),
    # education film: each qualification, and where it helps in his roles
    "e1": ("These are my foundations, and how each one helps me in my work.", None),
    "e2": ("I have completed an Associate of Science in Computer Science.", None),
    "e8": ("It is how I built PaMarket, and how I understand the systems we use at work.", None),
    "e3": ("My Business Management Diploma helps me plan and lead a team, as I did at Stonetree.", None),
    "e7": ("My CompTIA A plus certification helps me solve technical problems for my team in every role.",
           "My CompTIA A+ certification helps me solve technical problems for my team in every role."),
    "e4": ("My Bachelor of Business Administration is building the leadership I use as a supervisor today.", None),
    "e5": ("My AML-CFT certificate builds on the compliance work that I did at Stonetree.", None),
    "e6": ("Each one has helped me level up, and I am always learning.", None),
}

WEB = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(WEB, "public", "voice")


async def samples() -> None:
    import edge_tts

    os.makedirs(os.path.join(OUT, "samples"), exist_ok=True)
    for name in CANDIDATES:
        await edge_tts.Communicate(SAMPLE, name, rate=RATE).save(os.path.join(OUT, "samples", f"{name}.mp3"))
        print("sample", name)


async def main(measure_only: bool) -> None:
    os.makedirs(OUT, exist_ok=True)
    manifest = {}
    for key, (say, show) in LINES.items():
        path = os.path.join(OUT, f"{key}.mp3")
        if not measure_only:
            import edge_tts

            await edge_tts.Communicate(say, VOICE, rate=RATE).save(path)
        manifest[key] = {"dur": round(MP3(path).info.length, 2), "text": show or say}
        print(key, manifest[key]["dur"])
    with open(os.path.join(WEB, "src", "film", "voice.json"), "w", encoding="utf-8") as f:
        json.dump(manifest, f, indent=2, ensure_ascii=False)
    print("total seconds:", round(sum(v["dur"] for v in manifest.values()), 1))


asyncio.run(samples() if "--samples" in sys.argv else main("--measure" in sys.argv))
