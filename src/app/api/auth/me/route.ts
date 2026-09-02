import { getSession } from "@/lib/auth";
import { unauthorized } from "@/lib/api";

export async function GET() {
  const session = await getSession();
  if (!session) return unauthorized();
  return Response.json({ email: session.email, role: session.role });
}
