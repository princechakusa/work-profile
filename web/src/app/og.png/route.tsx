import { readFileSync } from "node:fs";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { PROFILE } from "@/lib/profile";

export const dynamic = "force-static";

/**
 * The card LinkedIn, WhatsApp and search results show when the portfolio is shared. Served as /og.png so static
 * hosts (GitHub Pages) send it as image/png; the extension-less opengraph-image route was served as a download.
 */
export function GET() {
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
          <div style={{ fontSize: 22, letterSpacing: 4, color: "#ff5a1f", textTransform: "uppercase" }}>{PROFILE.location.label}</div>
          <div style={{ fontSize: 84, fontWeight: 800, lineHeight: 1, marginTop: 18 }}>PRINCE CHAKUSA</div>
          <div style={{ fontSize: 38, marginTop: 20, color: "#ece7db" }}>{PROFILE.currentRole}</div>
          <div style={{ fontSize: 26, marginTop: 10, color: "#b9bec6" }}>Hospitality and property operations · Software developer</div>
          <div style={{ display: "flex", gap: 40, marginTop: 40 }}>
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
    { width: 1200, height: 630 },
  );
}
