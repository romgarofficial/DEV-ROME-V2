import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { z } from "zod";
import { badRequest, notFound, requireAdmin, unauthorized } from "@/lib/api";
import { establishSession } from "@/lib/auth";
import { dbConnect } from "@/lib/db";
import { User } from "@/models";

const AccountUpdateSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(80).optional(),
  email: z.email("Enter a valid email").optional(),
  currentPassword: z.string().optional(),
  newPassword: z.string().max(200).optional(),
});

function blankToUndefined(value: unknown) {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return trimmed.length ? trimmed : undefined;
}

export async function GET() {
  const session = await requireAdmin();
  if (!session) return unauthorized();
  if (!mongoose.isValidObjectId(session.sub)) return notFound();

  await dbConnect();
  const user = await User.findById(session.sub).select("email name").lean();
  if (!user) return notFound("Account not found");
  return Response.json({ email: user.email, name: user.name });
}

export async function PUT(request: Request) {
  const session = await requireAdmin();
  if (!session) return unauthorized();
  if (!mongoose.isValidObjectId(session.sub)) return notFound();

  const raw = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  const parsed = AccountUpdateSchema.safeParse({
    name: blankToUndefined(raw?.name),
    email: blankToUndefined(raw?.email)?.toLowerCase(),
    currentPassword: blankToUndefined(raw?.currentPassword),
    newPassword: blankToUndefined(raw?.newPassword),
  });
  if (!parsed.success) {
    return badRequest(parsed.error.issues[0]?.message || "Invalid account details");
  }

  const next = parsed.data;
  if (next.newPassword && next.newPassword.length < 8) {
    return badRequest("New password must be at least 8 characters");
  }

  await dbConnect();
  const user = await User.findById(session.sub);
  if (!user) return notFound("Account not found");

  const emailChanged = Boolean(next.email && next.email !== user.email);
  const passwordChanged = Boolean(next.newPassword);
  if (emailChanged || passwordChanged) {
    if (!next.currentPassword) {
      return badRequest("Enter your current password to change email or password");
    }
    const ok = await bcrypt.compare(next.currentPassword, user.passwordHash);
    if (!ok) return badRequest("Current password is incorrect");
  }

  if (emailChanged && next.email) {
    const taken = await User.exists({ email: next.email, _id: { $ne: user._id } });
    if (taken) return badRequest("That email is already in use");
    user.email = next.email;
  }
  if (typeof next.name === "string") user.name = next.name;
  if (next.newPassword) {
    user.passwordHash = await bcrypt.hash(next.newPassword, 12);
  }

  await user.save();
  await establishSession(user);

  return Response.json({
    ok: true,
    email: user.email,
    name: user.name,
  });
}
