import { badRequest, requireAdmin, unauthorized } from "@/lib/api";
import { dbConnect } from "@/lib/db";
import { revalidatePortfolio } from "@/lib/revalidate";
import { ensureSeeded } from "@/lib/seed";
import { CustomSectionCreateSchema, uniqueSectionKey } from "@/lib/sections";
import { serialize } from "@/lib/utils";
import { Section } from "@/models";

export async function GET() {
  const session = await requireAdmin();
  if (!session) return unauthorized();
  await dbConnect();
  await ensureSeeded();
  const sections = await Section.find().sort({ order: 1 }).lean();
  return Response.json({ items: serialize(sections) });
}

export async function POST(request: Request) {
  const session = await requireAdmin();
  if (!session) return unauthorized();

  const body = await request.json().catch(() => null);
  const parsed = CustomSectionCreateSchema.safeParse(body);
  if (!parsed.success) {
    return badRequest(parsed.error.issues[0]?.message || "Invalid section");
  }

  await dbConnect();
  await ensureSeeded();

  const last = await Section.findOne().sort({ order: -1 }).select("order").lean();
  const key = await uniqueSectionKey(parsed.data.label);
  const now = new Date();
  const { insertedId } = await Section.collection.insertOne({
    key,
    kind: "custom",
    label: parsed.data.label,
    kicker: parsed.data.kicker ?? "",
    heading: parsed.data.heading ?? "",
    body: parsed.data.body ?? "",
    imageUrl: parsed.data.imageUrl ?? "",
    imageAlt: parsed.data.imageAlt ?? "",
    visible: parsed.data.visible ?? true,
    order: (last?.order ?? -1) + 1,
    createdAt: now,
    updatedAt: now,
  });
  const created = await Section.collection.findOne({ _id: insertedId });

  await revalidatePortfolio();
  return Response.json({ item: serialize(created) }, { status: 201 });
}

export async function PUT(request: Request) {
  const session = await requireAdmin();
  if (!session) return unauthorized();
  const body = await request.json().catch(() => null);
  const items = body?.items as { _id: string; order: number; visible: boolean; label?: string }[] | undefined;
  if (!Array.isArray(items)) {
    return Response.json({ error: "items array required" }, { status: 400 });
  }

  await dbConnect();
  await Promise.all(
    items.map((item, index) =>
      Section.findByIdAndUpdate(item._id, {
        $set: {
          order: item.order ?? index,
          visible: item.visible,
          ...(item.label ? { label: item.label } : {}),
        },
      }),
    ),
  );
  await revalidatePortfolio();
  const sections = await Section.find().sort({ order: 1 }).lean();
  return Response.json({ items: serialize(sections) });
}
