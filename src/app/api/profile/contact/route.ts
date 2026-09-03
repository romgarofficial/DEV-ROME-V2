import { requireAdmin, unauthorized, badRequest } from "@/lib/api";
import { dbConnect } from "@/lib/db";
import { revalidatePortfolio } from "@/lib/revalidate";
import { findSocialPlatform } from "@/lib/social-platforms";
import { serialize } from "@/lib/utils";
import { Profile } from "@/models";
import type { SocialLink } from "@/types";

function storedUrl(value: unknown) {
  if (typeof value !== "string") return "";
  const url = value.trim();
  if (!url || url.startsWith("blob:")) return "";
  return url;
}

function pickSocials(value: unknown): SocialLink[] {
  if (!Array.isArray(value)) return [];
  const seen = new Set<string>();
  const items: SocialLink[] = [];
  for (const entry of value) {
    if (!entry || typeof entry !== "object") continue;
    const record = entry as Record<string, unknown>;
    const platform = typeof record.platform === "string" ? record.platform.trim() : "";
    const url = storedUrl(record.url);
    const key = platform.toLowerCase().replace(/[^a-z0-9]/g, "");
    if (!platform || seen.has(key)) continue;
    seen.add(key);
    items.push({ platform: findSocialPlatform(platform)?.slug || platform, url });
  }
  return items;
}

export async function PUT(request: Request) {
  const session = await requireAdmin();
  if (!session) return unauthorized();
  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object") return badRequest("Invalid body");

  const record = body as Record<string, unknown>;
  const email = typeof record.email === "string" ? record.email.trim() : "";
  const phone = typeof record.phone === "string" ? record.phone.trim() : "";
  const socials = pickSocials(record.socials);

  await dbConnect();
  const existing = await Profile.findOne().select("_id").lean();
  if (!existing?._id) return badRequest("Save the profile first");

  await Profile.collection.updateOne(
    { _id: existing._id },
    { $set: { email, phone, socials, updatedAt: new Date() } },
  );

  const profile = await Profile.findOne().lean();
  await revalidatePortfolio();
  return Response.json({ profile: serialize(profile) });
}
