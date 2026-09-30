import { readFileSync } from "node:fs";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const dynamic = "force-static";
export const alt = "Prince Chakusa, Guest Experience and Property Operations Leader";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** The card LinkedIn, WhatsApp and search results show when the portfolio link is shared. */
export default function OpenGraphImage() {
  const photo = `data:image/jpeg;base64,${readFileSync(join(process.cwd(), "public", "prince.jpg")).toString("base64")}`;
  const stats = [
    ["350+", "units under his responsibility"],
    ["12", "people led"],
    ["+25%", "guest review scores"],
  ];
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: "#07080b", color: "#ece7db" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={photo} alt="" width={420} height={630} style={{ objectFit: "cover", objectPosition: "50% 15%" }} />
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 64px", borderLeft: "10px solid #ff5a1f" }}>
          <div style={{ fontSize: 22, letterSpacing: 4, color: "#ff5a1f", textTransform: "uppercase" }}>Portfolio · Abu Dhabi, UAE</div>
          <div style={{ fontSize: 84, fontWeight: 800, lineHeight: 1, marginTop: 18 }}>PRINCE CHAKUSA</div>
          <div style={{ fontSize: 32, marginTop: 20, color: "#ece7db" }}>Guest Experience and Property Operations Leader who also builds software</div>
          <div style={{ display: "flex", gap: 40, marginTop: 44 }}>
            {stats.map(([n, l]) => (
              <div key={n} style={{ display: "flex", flexDirection: "column" }}>
                <span style={{ fontSize: 48, fontWeight: 800, color: "#ff5a1f" }}>{n}</span>
                <span style={{ fontSize: 20, color: "#b9bec6" }}>{l}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    size,
  );
}
