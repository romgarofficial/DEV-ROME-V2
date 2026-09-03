import mongoose from "mongoose";
import { badRequest, notFound, requireAdmin, unauthorized } from "@/lib/api";
import { dbConnect } from "@/lib/db";
import { revalidatePortfolio } from "@/lib/revalidate";
import {
  CustomSectionUpdateSchema,
  SystemSectionUpdateSchema,
  isCustomSection,
} from "@/lib/sections";
import { deleteMedia } from "@/lib/upload";
import { serialize } from "@/lib/utils";
import { CustomItem, Section } from "@/models";

function asSection(doc: unknown) {
  const record = (doc ?? {}) as Record<string, unknown>;
  return {
    kind: typeof record.kind === "string" ? record.kind : undefined,
    key: String(record.key ?? ""),
  };
}

function stringField(doc: unknown, name: string) {
  const value = (doc as Record<string, unknown> | null)?.[name];
  return typeof value === "string" ? value : "";
}

export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const session = await requireAdmin();
  if (!session) return unauthorized();
  const { id } = await context.params;
  if (!mongoose.isValidObjectId(id)) return notFound();

  const body = await request.json().catch(() => null);
  await dbConnect();
  const current = await Section.collection.findOne({ _id: new mongoose.Types.ObjectId(id) });
  if (!current) return notFound();

  if (isCustomSection(asSection(current))) {
    const parsed = CustomSectionUpdateSchema.safeParse(body);
    if (!parsed.success) {
      return badRequest(parsed.error.issues[0]?.message || "Invalid section");
    }
    const next = parsed.data;
    const previousImage = stringField(current, "imageUrl");
    const $set: Record<string, unknown> = { updatedAt: new Date() };
    if (next.label !== undefined) $set.label = next.label;
    if (next.kicker !== undefined) $set.kicker = next.kicker;
    if (next.heading !== undefined) $set.heading = next.heading;
    if (next.body !== undefined) $set.body = next.body;
    if (next.imageUrl !== undefined) $set.imageUrl = next.imageUrl;
    if (next.imageAlt !== undefined) $set.imageAlt = next.imageAlt;
    if (next.visible !== undefined) $set.visible = next.visible;
    await Section.collection.updateOne({ _id: current._id }, { $set });
    if (next.imageUrl !== undefined && previousImage && previousImage !== next.imageUrl) {
      await deleteMedia(previousImage).catch(() => undefined);
    }
  } else {
    const parsed = SystemSectionUpdateSchema.safeParse(body);
    if (!parsed.success) {
      return badRequest(parsed.error.issues[0]?.message || "Invalid section");
    }
    if (parsed.data.label) {
      await Section.collection.updateOne(
        { _id: current._id },
        { $set: { label: parsed.data.label, updatedAt: new Date() } },
      );
    }
  }

  const updated = await Section.collection.findOne({ _id: current._id });
  await revalidatePortfolio();
  return Response.json({ item: serialize(updated) });
}

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const session = await requireAdmin();
  if (!session) return unauthorized();
  const { id } = await context.params;
  if (!mongoose.isValidObjectId(id)) return notFound();

  await dbConnect();
  const current = await Section.collection.findOne({ _id: new mongoose.Types.ObjectId(id) });
  if (!current) return notFound();
  if (!isCustomSection(asSection(current))) {
    return badRequest("Built-in sections cannot be deleted. Hide them instead.");
  }

  const imageUrl = stringField(current, "imageUrl");
  const sectionKey = stringField(current, "key");
  const items = sectionKey ? await CustomItem.find({ sectionKey }).lean() : [];
  if (sectionKey) await CustomItem.deleteMany({ sectionKey });
  await Section.collection.deleteOne({ _id: current._id });
  await Promise.allSettled(
    [
      imageUrl,
      ...items.flatMap((item) => [item.imageUrl, item.fileUrl]),
    ]
      .filter(Boolean)
      .map((url) => deleteMedia(url)),
  );
  await revalidatePortfolio();
  return Response.json({ ok: true });
}
