import bcrypt from "bcryptjs";
import { z } from "zod";
import { establishSession } from "@/lib/auth";
import { dbConnect } from "@/lib/db";
import { ensureSeeded } from "@/lib/seed";
import { User } from "@/models";

const LoginSchema = z.object({
  email: z.email(),
  password: z.string().min(1),
});

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = LoginSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: "Invalid credentials" }, { status: 400 });
  }

  await dbConnect();
  await ensureSeeded();

  const user = await User.findOne({ email: parsed.data.email.toLowerCase() });
  if (!user) {
    return Response.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const ok = await bcrypt.compare(parsed.data.password, user.passwordHash);
  if (!ok) {
    return Response.json({ error: "Invalid credentials" }, { status: 401 });
  }

  await establishSession(user);

  return Response.json({ ok: true, email: user.email });
}
