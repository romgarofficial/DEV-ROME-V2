import { badRequest, notFound, requireAdmin, unauthorized } from "@/lib/api";
import { getCollectionModel, isItemCollection } from "@/lib/collections";
import { dbConnect } from "@/lib/db";
import { revalidatePortfolio } from "@/lib/revalidate";
import { deleteMedia } from "@/lib/upload";
import { serialize, slugify } from "@/lib/utils";

export async function PUT(
  request: Request,
  context: { params: Promise<{ collection: string; id: string }> },
) {
  const session = await requireAdmin();
  if (!session) return unauthorized();
  const { collection, id } = await context.params;
  if (!isItemCollection(collection)) return badRequest("Unknown collection");

  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object") return badRequest("Invalid body");

  if (collection === "projects" && !body.slug && body.title) {
    body.slug = slugify(body.title);
  }

  await dbConnect();
  const Model = getCollectionModel(collection);

  if (collection === "projects" && Array.isArray(body.images)) {
    const existing = await Model.findById(id).lean();
    if (existing) {
      const old = (existing as Record<string, unknown>).images;
      const oldImages = Array.isArray(old) ? (old as string[]) : [];
      const newImages = new Set(body.images as string[]);
      const removed = oldImages.filter((url) => !newImages.has(url));
      await Promise.allSettled(removed.map((url) => deleteMedia(url)));
    }
  }

  const item = await Model.findByIdAndUpdate(id, body, { new: true }).lean();
  if (!item) return notFound();
  await revalidatePortfolio();
  return Response.json({ item: serialize(item) });
}

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ collection: string; id: string }> },
) {
  const session = await requireAdmin();
  if (!session) return unauthorized();
  const { collection, id } = await context.params;
  if (!isItemCollection(collection)) return badRequest("Unknown collection");

  await dbConnect();
  const Model = getCollectionModel(collection);
  const item = await Model.findByIdAndDelete(id).lean();
  if (!item) return notFound();

  const record = item as Record<string, unknown>;
  const mediaUrls: string[] = [];
  if (typeof record.imageUrl === "string" && record.imageUrl) mediaUrls.push(record.imageUrl);
  if (typeof record.coverUrl === "string" && record.coverUrl) mediaUrls.push(record.coverUrl);
  if (typeof record.fileUrl === "string" && record.fileUrl) mediaUrls.push(record.fileUrl);
  if (Array.isArray(record.images)) {
    for (const url of record.images) {
      if (typeof url === "string" && url) mediaUrls.push(url);
    }
  }
  if (mediaUrls.length) {
    await Promise.allSettled(mediaUrls.map((url) => deleteMedia(url)));
  }

  await revalidatePortfolio();
  return Response.json({ ok: true });
}
