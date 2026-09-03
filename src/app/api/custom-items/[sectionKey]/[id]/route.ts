import { badRequest, notFound, requireAdmin, unauthorized } from "@/lib/api";
import { dbConnect } from "@/lib/db";
import { isCustomSection } from "@/lib/constants";
import { revalidatePortfolio } from "@/lib/revalidate";
import { deleteMedia } from "@/lib/upload";
import { serialize } from "@/lib/utils";
import { CustomItem, Section } from "@/models";

async function requireOwnedItem(sectionKey: string, id: string) {
  const section = await Section.findOne({ key: sectionKey }).lean();
  if (!section || !isCustomSection(section)) return null;
  const item = await CustomItem.findOne({ _id: id, sectionKey });
  return item;
}

export async function PUT(
  request: Request,
  context: { params: Promise<{ sectionKey: string; id: string }> },
) {
  const session = await requireAdmin();
  if (!session) return unauthorized();
  const { sectionKey, id } = await context.params;
  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object") return badRequest("Invalid body");

  await dbConnect();
  const current = await requireOwnedItem(sectionKey, id);
  if (!current) return notFound();

  const nextFile = typeof body.fileUrl === "string" ? body.fileUrl : undefined;
  const nextImage = typeof body.imageUrl === "string" ? body.imageUrl : undefined;
  if (nextFile !== undefined && current.fileUrl && current.fileUrl !== nextFile) {
    await deleteMedia(current.fileUrl).catch(() => undefined);
  }
  if (nextImage !== undefined && current.imageUrl && current.imageUrl !== nextImage) {
    await deleteMedia(current.imageUrl).catch(() => undefined);
  }

  const item = await CustomItem.findByIdAndUpdate(
    id,
    { ...body, sectionKey },
    { new: true },
  ).lean();
  if (!item) return notFound();
  await revalidatePortfolio();
  return Response.json({ item: serialize(item) });
}

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ sectionKey: string; id: string }> },
) {
  const session = await requireAdmin();
  if (!session) return unauthorized();
  const { sectionKey, id } = await context.params;

  await dbConnect();
  const current = await requireOwnedItem(sectionKey, id);
  if (!current) return notFound();
  await CustomItem.findByIdAndDelete(id);
  await Promise.allSettled(
    [current.imageUrl, current.fileUrl].filter(Boolean).map((url) => deleteMedia(url)),
  );
  await revalidatePortfolio();
  return Response.json({ ok: true });
}
