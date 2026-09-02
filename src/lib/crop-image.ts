import type { Area } from "react-easy-crop";

export type CropFormat = "jpeg" | "png";

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", () => reject(new Error("Could not load image")));
    image.src = src;
  });
}

export function cropFormatFor(name: string, aspect: "portrait" | "cover" | "square"): CropFormat {
  if (aspect === "square") return "png";
  if (/\.(png|webp|gif|avif)$/i.test(name)) return "png";
  return "jpeg";
}

export async function cropToFile(
  src: string,
  area: Area,
  name: string,
  maxEdge = 1920,
  format: CropFormat = "jpeg",
) {
  const image = await loadImage(src);
  const scale = Math.min(1, maxEdge / Math.max(area.width, area.height));
  const width = Math.round(area.width * scale);
  const height = Math.round(area.height * scale);
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not crop image");
  if (format === "jpeg") {
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, width, height);
  }
  ctx.drawImage(image, area.x, area.y, area.width, area.height, 0, 0, width, height);
  const mime = format === "png" ? "image/png" : "image/jpeg";
  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (next) => (next ? resolve(next) : reject(new Error("Could not crop image"))),
      mime,
      format === "jpeg" ? 0.92 : undefined,
    );
  });
  const base = name.replace(/\.[^.]+$/, "") || "image";
  return new File([blob], `${base}.${format === "png" ? "png" : "jpg"}`, { type: mime });
}
