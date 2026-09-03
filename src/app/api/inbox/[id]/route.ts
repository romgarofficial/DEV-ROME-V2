import mongoose from "mongoose";
import { z } from "zod";
import { badRequest, notFound, requireAdmin, unauthorized } from "@/lib/api";
import { dbConnect } from "@/lib/db";
import { serialize } from "@/lib/utils";
import { ContactMessage } from "@/models";
import type { ContactMessageStatus } from "@/models/contact-message";

const PatchSchema = z.object({
  action: z.enum(["read", "unread", "archive", "unarchive"]),
});

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const session = await requireAdmin();
  if (!session) return unauthorized();
  const { id } = await context.params;
  if (!mongoose.isValidObjectId(id)) return notFound();

  const parsed = PatchSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return badRequest("Invalid action");

  await dbConnect();
  const current = await ContactMessage.findById(id);
  if (!current) return notFound();

  const now = new Date();
  let status: ContactMessageStatus = current.status;
  let readAt = current.readAt ?? null;

  switch (parsed.data.action) {
    case "read":
      if (status !== "archived") status = "read";
      readAt = readAt ?? now;
      break;
    case "unread":
      if (status !== "archived") status = "unread";
      readAt = null;
      break;
    case "archive":
      status = "archived";
      break;
    case "unarchive":
      status = readAt ? "read" : "unread";
      break;
  }

  current.status = status;
  current.readAt = readAt;
  await current.save();

  return Response.json({ item: serialize(current.toObject()) });
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
  const deleted = await ContactMessage.findByIdAndDelete(id);
  if (!deleted) return notFound();
  return Response.json({ ok: true });
}
