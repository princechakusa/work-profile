"""Build the neofetch-style profile card (ASCII portrait + info panel) as an SVG.

Run:  python github-profile/make_card.py
Needs Pillow. Reads web/public/prince.jpg, writes github-profile/profile-card.svg.
"""
from html import escape
from pathlib import Path

from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parents[1]
PHOTO = ROOT / "web" / "public" / "prince.jpg"
OUT = ROOT / "github-profile" / "profile-card.svg"

BG, KEY, VAL, DOT, ACC = "#0d1117", "#ff5a1f", "#ece7db", "#3b424c", "#ff5a1f"
CHARS = " .'`,:;-~=+*ixzXYUJCO0Q#%&8B@"
COLS, ROWS = 58, 36
CW, LH = 6.6, 12.6  # portrait: 11px monospace
ICW, ILH = 8.4, 16.0  # info panel: 14px monospace


def ascii_portrait():
    img = Image.open(PHOTO).convert("RGB")
    w, h = img.size
    img = img.crop((int(w * 0.12), int(h * 0.03), int(w * 0.88), int(h * 0.72)))  # head and shoulders
    small = img.resize((COLS, ROWS), Image.LANCZOS)
    mask = [[False] * COLS for _ in range(ROWS)]
    vals = []
    for y in range(ROWS):
        for x in range(COLS):
            r, g, b = small.getpixel((x, y))
            if abs(r - g) < 12 and abs(g - b) < 14 and r > 150:  # the light studio backdrop
                mask[y][x] = True
            else:
                vals.append(0.299 * r + 0.587 * g + 0.114 * b)
    vals.sort()
    lo, hi = vals[int(len(vals) * 0.03)], vals[int(len(vals) * 0.97)]
    rows = []
    for y in range(ROWS):
        line = ""
        for x in range(COLS):
            if mask[y][x]:
                line += " "
                continue
            r, g, b = small.getpixel((x, y))
            v = (0.299 * r + 0.587 * g + 0.114 * b - lo) / max(1, hi - lo)
            v = min(1, max(0, v)) ** 0.8  # lift the mid tones so the face keeps its features
            line += CHARS[1 + int(v * (len(CHARS) - 2))]
        rows.append(line.rstrip())
    return rows


INFO = [
    ("title", "prince@chakusa"),
    ("kv", "Role", "Guest Relations Executive Supervisor"),
    ("kv", "Company", "The Authors Holiday Homes"),
    ("kv", "Location", "Abu Dhabi, UAE"),
    ("kv", "Uptime", "UAE holiday homes since 2023"),
    ("gap",),
    ("kv", "Portfolio.Units", "350+ short-term rentals"),
    ("kv", "Team.Led", "12 people"),
    ("kv", "Results", "+25% reviews, -40% desk load"),
    ("gap",),
    ("kv", "Languages.Code", "TypeScript, JavaScript, SQL"),
    ("kv", "Mobile", "React Native, Expo"),
    ("kv", "Stack", "Next.js, Three.js, Supabase"),
    ("kv", "Studying", "BBA, AML-CFT (in progress)"),
    ("gap",),
    ("section", "Projects"),
    ("kv", "PaMarket", "web, App Store, Google Play"),
    ("kv", "Portfolio", "3D city of 350 units"),
    ("gap",),
    ("section", "Contact"),
    ("kv", "Email", "chakusaprince@gmail.com"),
    ("kv", "LinkedIn", "princechakusa"),
]


def build():
    art = ascii_portrait()
    art_w = COLS * CW + 30
    info_x = art_w + 24
    info_cols = 62
    width = int(info_x + info_cols * ICW + 28)
    height = int(max(len(art) * LH, len(INFO) * ILH) + 56)

    out = [
        f'<svg xmlns="http://www.w3.org/2000/svg" width="{width}" height="{height}" viewBox="0 0 {width} {height}" role="img" aria-label="Prince Chakusa profile card">',
        f'<rect width="100%" height="100%" rx="12" fill="{BG}"/>',
        '<style>text{font-family:Consolas,"SFMono-Regular",Menlo,monospace;font-size:14px;white-space:pre}</style>',
    ]
    for i, line in enumerate(art):
        out.append(f'<text x="24" y="{30 + i * LH:.1f}" fill="{VAL}" font-size="11" opacity="0.95">{escape(line)}</text>')

    y = 36
    for item in INFO:
        if item[0] == "gap":
            y += ILH * 0.6
            continue
        if item[0] in ("title", "section"):
            label = item[1] if item[0] == "title" else f"- {item[1]}"
            rule = " " + "—" * max(2, info_cols - len(label) - 2)
            fill = ACC if item[0] == "title" else VAL
            out.append(f'<text x="{info_x}" y="{y:.1f}"><tspan fill="{fill}" font-weight="bold">{escape(label)}</tspan><tspan fill="{DOT}">{rule}</tspan></text>')
        else:
            _, k, v = item
            dots = " " + "." * max(2, info_cols - len(k) - len(v) - 5) + " "
            out.append(f'<text x="{info_x}" y="{y:.1f}"><tspan fill="{DOT}">. </tspan><tspan fill="{KEY}">{escape(k)}:</tspan><tspan fill="{DOT}">{dots}</tspan><tspan fill="{VAL}">{escape(v)}</tspan></text>')
        y += ILH
    out.append("</svg>")
    OUT.write_text("\n".join(out), encoding="utf-8")
    print(f"wrote {OUT} ({width}x{height})")


if __name__ == "__main__":
    build()
