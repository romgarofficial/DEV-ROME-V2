import { badRequest, requireAdmin, unauthorized } from "@/lib/api";
import { getCollectionModel, isItemCollection } from "@/lib/collections";
import { dbConnect } from "@/lib/db";
import { revalidatePortfolio } from "@/lib/revalidate";
import { slugify, serialize } from "@/lib/utils";

export async function GET(
  _request: Request,
  context: { params: Promise<{ collection: string }> },
) {
  const session = await requireAdmin();
  if (!session) return unauthorized();
  const { collection } = await context.params;
  if (!isItemCollection(collection)) return badRequest("Unknown collection");

  await dbConnect();
  const Model = getCollectionModel(collection);
  const items = await Model.find().sort({ order: 1, createdAt: -1 }).lean();
  return Response.json({ items: serialize(items) });
}

export async function POST(
  request: Request,
  context: { params: Promise<{ collection: string }> },
) {
  const session = await requireAdmin();
  if (!session) return unauthorized();
  const { collection } = await context.params;
  if (!isItemCollection(collection)) return badRequest("Unknown collection");

  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object") return badRequest("Invalid body");

  await dbConnect();
  const Model = getCollectionModel(collection);
  const count = await Model.countDocuments();
  const payload = { ...body, order: body.order ?? count };

  if (collection === "projects") {
    payload.slug = payload.slug || slugify(payload.title || "project");
  }
  if (collection === "skills" && !payload.title && payload.name) {
    payload.title = payload.name;
  }

  const created = await Model.create(payload);
  await revalidatePortfolio();
  return Response.json({ item: serialize(created?.toObject?.() ?? created) }, { status: 201 });
}

export async function PUT(
  request: Request,
  context: { params: Promise<{ collection: string }> },
) {
  const session = await requireAdmin();
  if (!session) return unauthorized();
  const { collection } = await context.params;
  if (!isItemCollection(collection)) return badRequest("Unknown collection");

  const body = await request.json().catch(() => null);
  const ids = body?.ids as string[] | undefined;
  if (!Array.isArray(ids)) return badRequest("ids array required");

  await dbConnect();
  const Model = getCollectionModel(collection);
  await Promise.all(ids.map((id, index) => Model.findByIdAndUpdate(id, { order: index })));
  await revalidatePortfolio();
  return Response.json({ ok: true });
}
