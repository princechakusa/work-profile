import { ImageResponse } from "next/og";

export const dynamic = "force-static";
export const size = { width: 64, height: 64 };
export const contentType = "image/png";

/** Tab icon: PC monogram in the site's ink and signal orange. */
export default function Icon() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#07080b", borderRadius: 12, borderBottom: "8px solid #ff5a1f" }}>
        <span style={{ color: "#ece7db", fontSize: 34, fontWeight: 800, letterSpacing: -1 }}>PC</span>
      </div>
    ),
    size,
  );
}
