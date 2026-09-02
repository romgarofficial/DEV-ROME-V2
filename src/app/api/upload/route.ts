import { requireAdmin, unauthorized } from "@/lib/api";
import { deleteMedia, isUploadFile, uploadMedia } from "@/lib/upload";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const session = await requireAdmin();
  if (!session) return unauthorized();

  const form = await request.formData();
  const file = form.get("file");
  if (!isUploadFile(file) || file.size === 0) {
    return Response.json({ error: "Choose an image to upload" }, { status: 400 });
  }

  try {
    const url = await uploadMedia(file);
    return Response.json({ url });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Upload failed";
    return Response.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const session = await requireAdmin();
  if (!session) return unauthorized();

  const body = await request.json().catch(() => null);
  const url = typeof body?.url === "string" ? body.url : "";
  if (!url) return Response.json({ error: "Missing image url" }, { status: 400 });

  try {
    await deleteMedia(url);
    return Response.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not delete image";
    return Response.json({ error: message }, { status: 500 });
  }
}
