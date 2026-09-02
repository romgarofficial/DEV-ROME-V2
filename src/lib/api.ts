import { getSession } from "@/lib/auth";

export async function requireAdmin() {
  const session = await getSession();
  if (!session) {
    return null;
  }
  return session;
}

export function unauthorized() {
  return Response.json({ error: "Unauthorized" }, { status: 401 });
}

export function badRequest(message: string) {
  return Response.json({ error: message }, { status: 400 });
}

export function notFound(message = "Not found") {
  return Response.json({ error: message }, { status: 404 });
}
