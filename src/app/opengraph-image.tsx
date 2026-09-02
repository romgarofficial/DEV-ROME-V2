import { ImageResponse } from "next/og";
import { getPortfolio } from "@/lib/portfolio";

export const alt = "Developer portfolio";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpenGraphImage() {
  const data = await getPortfolio();
  const name = data.profile?.name || "Romenick Garcia";
  const title = data.profile?.title || "Software Engineer";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "#0b0b10",
          color: "#f3eee6",
        }}
      >
        <div style={{ fontSize: 16, letterSpacing: 6, textTransform: "uppercase", color: "#ff4d2e" }}>
          Portfolio
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 72, lineHeight: 0.95, letterSpacing: -2 }}>{name}</div>
          <div style={{ marginTop: 18, fontSize: 26, color: "#8d8880" }}>{title}</div>
        </div>
      </div>
    ),
    { ...size },
  );
}
