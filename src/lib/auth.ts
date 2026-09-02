import { SignJWT, jwtVerify, type JWTPayload } from "jose";
import { cookies } from "next/headers";
import { COOKIE_NAME, JWT_EXPIRES } from "@/lib/constants";

export type Session = {
  sub: string;
  email: string;
  role: "admin";
};

function getSecret() {
  const secret = process.env.JWT_SECRET;
  if (secret) return new TextEncoder().encode(secret);
  if (process.env.NODE_ENV !== "production") {
    return new TextEncoder().encode("dev-only-change-me");
  }
  throw new Error("JWT_SECRET is not set");
}

export async function signToken(session: Session) {
  return new SignJWT(session)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(JWT_EXPIRES)
    .sign(getSecret());
}

export async function verifyToken(token: string): Promise<Session | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    if (!payload.sub || typeof payload.email !== "string") return null;
    return {
      sub: payload.sub,
      email: payload.email,
      role: "admin",
    };
  } catch {
    return null;
  }
}

export async function getSession(): Promise<Session | null> {
  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyToken(token);
}

export async function setSessionCookie(token: string) {
  const store = await cookies();
  store.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function clearSessionCookie() {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}

export function isAdminPayload(payload: JWTPayload | Session | null): payload is Session {
  return Boolean(payload && "email" in payload && payload);
}
