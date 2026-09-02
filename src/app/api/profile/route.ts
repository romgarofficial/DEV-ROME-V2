import { requireAdmin, unauthorized } from "@/lib/api";
import { dbConnect } from "@/lib/db";
import { revalidatePortfolio } from "@/lib/revalidate";
import { ensureSeeded } from "@/lib/seed";
import { serialize } from "@/lib/utils";
import { Profile } from "@/models";

const PROFILE_FIELDS = [
  "name",
  "title",
  "headline",
  "bio",
  "photoUrl",
  "backgroundUrl",
  "location",
  "email",
  "phone",
  "socials",
  "resumeUrl",
  "seoTitle",
  "seoDescription",
  "ogImageUrl",
  "availableForWork",
] as const;

function storedUrl(value: unknown) {
  if (typeof value !== "string") return "";
  const url = value.trim();
  if (!url || url.startsWith("blob:")) return "";
  return url;
}

function pickProfile(body: Record<string, unknown>) {
  return {
    name: typeof body.name === "string" ? body.name : "",
    title: typeof body.title === "string" ? body.title : "",
    headline: typeof body.headline === "string" ? body.headline : "",
    bio: typeof body.bio === "string" ? body.bio : "",
    photoUrl: storedUrl(body.photoUrl),
    backgroundUrl: storedUrl(body.backgroundUrl),
    location: typeof body.location === "string" ? body.location : "",
    email: typeof body.email === "string" ? body.email : "",
    phone: typeof body.phone === "string" ? body.phone : "",
    socials: Array.isArray(body.socials) ? body.socials : [],
    resumeUrl: storedUrl(body.resumeUrl),
    seoTitle: typeof body.seoTitle === "string" ? body.seoTitle : "",
    seoDescription: typeof body.seoDescription === "string" ? body.seoDescription : "",
    ogImageUrl: storedUrl(body.ogImageUrl),
    availableForWork: Boolean(body.availableForWork),
  };
}

export async function GET() {
  const session = await requireAdmin();
  if (!session) return unauthorized();
  await dbConnect();
  await ensureSeeded();
  const profile = await Profile.findOne().lean();
  return Response.json({ profile: serialize(profile) });
}

export async function PUT(request: Request) {
  const session = await requireAdmin();
  if (!session) return unauthorized();
  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return Response.json({ error: "Invalid body" }, { status: 400 });
  }

  const fields = pickProfile(body as Record<string, unknown>);
  if (!fields.name.trim()) {
    return Response.json({ error: "Name is required" }, { status: 400 });
  }

  await dbConnect();
  const existing = await Profile.findOne().select("_id").lean();
  if (existing?._id) {
    await Profile.collection.updateOne({ _id: existing._id }, { $set: fields });
  } else {
    await Profile.collection.insertOne(fields);
  }

  const profile = await Profile.findOne().lean();
  await revalidatePortfolio();
  return Response.json({ profile: serialize(profile) });
}
