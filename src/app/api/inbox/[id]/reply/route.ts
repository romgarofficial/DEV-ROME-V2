import mongoose from "mongoose";
import { z } from "zod";
import { badRequest, notFound, requireAdmin, unauthorized } from "@/lib/api";
import { dbConnect } from "@/lib/db";
import { isMailConfigured, sendInboxReply } from "@/lib/mail";
import { htmlToPlainText, sanitizeRichHtml } from "@/lib/sanitize-html";
import { serialize } from "@/lib/utils";
import { ContactMessage } from "@/models";

const ReplySchema = z.object({
  html: z.string().min(1).max(20000),
});

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const session = await requireAdmin();
  if (!session) return unauthorized();
  const { id } = await context.params;
  if (!mongoose.isValidObjectId(id)) return notFound();

  const parsed = ReplySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return badRequest("Write a reply before sending.");

  const html = sanitizeRichHtml(parsed.data.html);
  const text = htmlToPlainText(html);
  if (!text) return badRequest("Write a reply before sending.");

  if (!isMailConfigured()) {
    return badRequest("Email sending is not configured yet.");
  }

  await dbConnect();
  const current = await ContactMessage.findById(id);
  if (!current) return notFound();

  try {
    await sendInboxReply({
      to: current.email,
      name: current.name,
      html,
      text,
    });
  } catch (error) {
    console.error("[inbox:reply]", error);
    return Response.json(
      { error: error instanceof Error ? error.message : "Could not send the reply. Try again in a moment." },
      { status: 500 },
    );
  }

  current.replies.push({ html, text, createdAt: new Date() });
  if (current.status !== "archived") {
    current.status = "read";
    current.readAt = current.readAt ?? new Date();
  }
  await current.save();

  return Response.json({ item: serialize(current.toObject()) });
}
