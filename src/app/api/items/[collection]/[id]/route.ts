import { badRequest, notFound, requireAdmin, unauthorized } from "@/lib/api";
import { getCollectionModel, isItemCollection } from "@/lib/collections";
import { dbConnect } from "@/lib/db";
import { revalidatePortfolio } from "@/lib/revalidate";
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
  await revalidatePortfolio();
  return Response.json({ ok: true });
}
