import { badRequest, notFound, requireAdmin, unauthorized } from "@/lib/api";
import { dbConnect } from "@/lib/db";
import { isCustomSection } from "@/lib/constants";
import { revalidatePortfolio } from "@/lib/revalidate";
import { serialize } from "@/lib/utils";
import { CustomItem, Section } from "@/models";

async function requireCustomSection(sectionKey: string) {
  const section = await Section.findOne({ key: sectionKey }).lean();
  if (!section || !isCustomSection(section)) return null;
  return section;
}

export async function GET(
  _request: Request,
  context: { params: Promise<{ sectionKey: string }> },
) {
  const session = await requireAdmin();
  if (!session) return unauthorized();
  const { sectionKey } = await context.params;
  await dbConnect();
  if (!(await requireCustomSection(sectionKey))) return notFound();
  const items = await CustomItem.find({ sectionKey }).sort({ order: 1, createdAt: -1 }).lean();
  return Response.json({ items: serialize(items) });
}

export async function POST(
  request: Request,
  context: { params: Promise<{ sectionKey: string }> },
) {
  const session = await requireAdmin();
  if (!session) return unauthorized();
  const { sectionKey } = await context.params;
  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object") return badRequest("Invalid body");

  await dbConnect();
  if (!(await requireCustomSection(sectionKey))) return notFound();
  const count = await CustomItem.countDocuments({ sectionKey });
  const created = await CustomItem.create({
    ...body,
    sectionKey,
    order: body.order ?? count,
  });
  await revalidatePortfolio();
  return Response.json({ item: serialize(created.toObject()) }, { status: 201 });
}

export async function PUT(
  request: Request,
  context: { params: Promise<{ sectionKey: string }> },
) {
  const session = await requireAdmin();
  if (!session) return unauthorized();
  const { sectionKey } = await context.params;
  const body = await request.json().catch(() => null);
  const ids = body?.ids as string[] | undefined;
  if (!Array.isArray(ids)) return badRequest("ids array required");

  await dbConnect();
  if (!(await requireCustomSection(sectionKey))) return notFound();
  await Promise.all(ids.map((id, index) => CustomItem.findOneAndUpdate({ _id: id, sectionKey }, { order: index })));
  await revalidatePortfolio();
  return Response.json({ ok: true });
}
