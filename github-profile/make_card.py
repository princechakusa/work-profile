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
CHARS = " .:-=+*#%@8B&WM"
COLS, ROWS = 100, 62
CW, LH = 4.2, 7.6  # portrait: 7px monospace
ICW, ILH = 8.4, 16.0  # info panel: 14px monospace


def ascii_portrait():
    """Coloured ASCII: each character takes the colour of the photo under it, so the face reads clearly."""
    img = Image.open(PHOTO).convert("RGB")
    w, h = img.size
    img = img.crop((int(w * 0.14), int(h * 0.05), int(w * 0.86), int(h * 0.80)))
    orig = img.resize((COLS, ROWS), Image.LANCZOS)  # backdrop mask comes from the untouched photo
    img = ImageOps.autocontrast(img, cutoff=1)
    # equalise the person only (not the grey backdrop) so eyes, nose and mouth separate clearly
    from PIL import ImageFilter
    eq = ImageOps.equalize(img)
    img = Image.blend(img, eq, 0.55).filter(ImageFilter.UnsharpMask(radius=2, percent=160, threshold=2))
    small = img.resize((COLS, ROWS), Image.LANCZOS)
    rows = []
    for y in range(ROWS):
        cells = []
        for x in range(COLS):
            r0, g0, b0 = orig.getpixel((x, y))
            r, g, b = small.getpixel((x, y))
            if abs(r0 - g0) < 14 and abs(g0 - b0) < 16 and r0 > 160:  # light studio backdrop
                cells.append((" ", None))
                continue
            lum = 0.299 * r + 0.587 * g + 0.114 * b
            ch = CHARS[1 + int(min(1, lum / 255) ** 0.7 * (len(CHARS) - 2))]
            # lift dark tones so they stay visible on the dark card
            lift = lambda c: int(min(255, 38 + c * 1.35))
            cells.append((ch, f"#{lift(r):02x}{lift(g):02x}{lift(b):02x}"))
        rows.append(cells)
    return rows


INFO = [
    ("title", "prince@chakusa"),
    ("kv", "Role", "Guest Relations Supervisor"),
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
    ("kv", "Website", "princechakusa.com"),
    ("kv", "Email", "hello@princechakusa.com"),
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
    for i, cells in enumerate(art):
        spans = "".join(f'<tspan fill="{c}">{escape(ch)}</tspan>' if c else " " for ch, c in cells).rstrip()
        out.append(f'<text x="24" y="{28 + i * LH:.1f}" style="font-size:7px;font-weight:bold" xml:space="preserve">{spans}</text>')

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
