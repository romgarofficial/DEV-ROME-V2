import { readFile } from "fs/promises";
import path from "path";
import { uploadDir } from "@/lib/upload-path";

const TYPES: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".avif": "image/avif",
  ".pdf": "application/pdf",
};

export const runtime = "nodejs";

export async function GET(_request: Request, context: { params: Promise<{ name: string }> }) {
  const { name } = await context.params;
  if (!/^[\w.-]+$/.test(name)) {
    return new Response("Not found", { status: 404 });
  }

  try {
    const file = await readFile(path.join(uploadDir(), name));
    return new Response(file, {
      headers: {
        "Content-Type": TYPES[path.extname(name).toLowerCase()] || "application/octet-stream",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
