import { v2 as cloudinary } from "cloudinary";
import { randomUUID } from "crypto";
import { mkdir, unlink, writeFile } from "fs/promises";
import path from "path";
import { uploadDir } from "@/lib/upload-path";

const FOLDER = "rome-portfolio";
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"]);
const MAX_BYTES = 8 * 1024 * 1024;

function env(name: string) {
  return process.env[name]?.trim() || "";
}

function cloudinaryConfigured() {
  return Boolean(env("CLOUDINARY_CLOUD_NAME") && env("CLOUDINARY_API_KEY") && env("CLOUDINARY_API_SECRET"));
}

function configureCloudinary() {
  cloudinary.config({
    cloud_name: env("CLOUDINARY_CLOUD_NAME"),
    api_key: env("CLOUDINARY_API_KEY"),
    api_secret: env("CLOUDINARY_API_SECRET"),
  });
}

export function isUploadFile(value: FormDataEntryValue | null): value is File {
  return Boolean(
    value &&
      typeof value === "object" &&
      "arrayBuffer" in value &&
      "size" in value &&
      typeof (value as File).size === "number",
  );
}

export function cloudinaryPublicId(url: string) {
  try {
    const parsed = new URL(url);
    if (parsed.hostname !== "res.cloudinary.com") return null;
    const marker = "/image/upload/";
    const idx = parsed.pathname.indexOf(marker);
    if (idx === -1) return null;
    const parts = parsed.pathname.slice(idx + marker.length).split("/").filter(Boolean);
    let i = 0;
    while (i < parts.length && parts[i].includes(",")) i += 1;
    if (i < parts.length && /^v\d+$/.test(parts[i])) i += 1;
    const id = parts.slice(i).join("/").replace(/\.[a-zA-Z0-9]+$/, "");
    if (!id.startsWith(`${FOLDER}/`)) return null;
    return id;
  } catch {
    return null;
  }
}

export function localUploadName(url: string) {
  const match = url.match(/^\/api\/media\/([\w.-]+)$/);
  return match?.[1] ?? null;
}

export async function uploadMedia(file: File) {
  if (file.size === 0) throw new Error("That file is empty.");
  if (file.size > MAX_BYTES) throw new Error("Images must be 8MB or smaller.");
  const type = file.type || "";
  if (type && !ALLOWED_TYPES.has(type) && !type.startsWith("image/")) {
    throw new Error("Use a JPG, PNG, WEBP, or GIF image.");
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  if (cloudinaryConfigured()) {
    configureCloudinary();
    const result = await new Promise<{ secure_url: string }>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: FOLDER,
          resource_type: "image",
          ...(file.type === "image/png" ? { format: "png" } : {}),
        },
        (error, uploaded) => {
          if (error || !uploaded) reject(error ?? new Error("Upload failed"));
          else resolve({ secure_url: uploaded.secure_url });
        },
      );
      stream.end(buffer);
    });
    return result.secure_url;
  }

  if (process.env.NODE_ENV === "production") {
    throw new Error("Cloudinary is required in production. Set CLOUDINARY_* env vars.");
  }

  const ext = path.extname(file.name || "").toLowerCase() || (type === "image/png" ? ".png" : ".jpg");
  const filename = `${randomUUID()}${ext}`;
  const dir = uploadDir();
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, filename), buffer);
  return `/api/media/${filename}`;
}

export async function deleteMedia(url: string) {
  const publicId = cloudinaryPublicId(url);
  if (publicId) {
    if (!cloudinaryConfigured()) return;
    configureCloudinary();
    await cloudinary.uploader.destroy(publicId, { resource_type: "image" });
    return;
  }

  const name = localUploadName(url);
  if (!name) return;
  await unlink(path.join(uploadDir(), name)).catch(() => undefined);
}
