import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0b0b10",
          color: "#ff4d2e",
          fontSize: 16,
          fontWeight: 800,
        }}
      >
        R
      </div>
    ),
    { ...size },
  );
}
