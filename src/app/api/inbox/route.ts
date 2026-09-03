import { requireAdmin, unauthorized } from "@/lib/api";
import { dbConnect } from "@/lib/db";
import { serialize } from "@/lib/utils";
import { ContactMessage } from "@/models";
import type { ContactMessageStatus } from "@/models/contact-message";

export async function GET(request: Request) {
  const session = await requireAdmin();
  if (!session) return unauthorized();

  const folder = new URL(request.url).searchParams.get("folder") === "archived" ? "archived" : "inbox";
  const filter =
    folder === "archived"
      ? { status: "archived" as const }
      : { status: { $in: ["unread", "read"] as ContactMessageStatus[] } };

  await dbConnect();
  const [items, unreadCount, archivedCount] = await Promise.all([
    ContactMessage.find(filter).sort({ createdAt: -1 }).lean(),
    ContactMessage.countDocuments({ status: "unread" }),
    ContactMessage.countDocuments({ status: "archived" }),
  ]);

  return Response.json({
    items: serialize(items),
    unreadCount,
    archivedCount,
  });
}
