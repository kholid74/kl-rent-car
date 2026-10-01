import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

const COOKIE = "kl_admin_session";
const AGE = 60 * 60 * 12;

function secret() {
  const value = process.env.ADMIN_SESSION_SECRET;
  if (!value || value.length < 32) throw new Error("ADMIN_SESSION_SECRET minimal 32 karakter wajib diisi.");
  return value;
}

function signature(payload: string) {
  return createHmac("sha256", secret()).update(payload).digest("base64url");
}

export function signSession(session: { id: string; exp: number }) {
  const payload = Buffer.from(JSON.stringify(session)).toString("base64url");
  return `${payload}.${signature(`demo:${payload}`)}`;
}

export function verifySession(raw: string): { id: string; exp: number } | null {
  const [payload, mac, extra] = raw.split(".");
  if (!payload || !mac || extra) return null;
  const expected = Buffer.from(signature(`demo:${payload}`));
  const received = Buffer.from(mac);
  if (expected.length !== received.length || !timingSafeEqual(expected, received)) return null;
  try {
    const session = JSON.parse(Buffer.from(payload, "base64url").toString());
    return typeof session.id === "string" && typeof session.exp === "number" && session.exp > Date.now() ? session : null;
  } catch { return null; }
}

export async function createAdminSession(id: string) {
  const payload = Buffer.from(JSON.stringify({ id, exp: Date.now() + AGE * 1000 })).toString("base64url");
  (await cookies()).set(COOKIE, `${payload}.${signature(payload)}`, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: AGE,
  });
}

export async function getAdminSession(): Promise<string | null> {
  const raw = (await cookies()).get(COOKIE)?.value;
  if (!raw) return null;
  const [payload, mac, extra] = raw.split(".");
  if (!payload || !mac || extra) return null;
  const expected = Buffer.from(signature(payload));
  const received = Buffer.from(mac);
  if (expected.length !== received.length || !timingSafeEqual(expected, received)) return null;
  try {
    const session = JSON.parse(Buffer.from(payload, "base64url").toString()) as { id?: unknown; exp?: unknown };
    return typeof session.id === "string" && typeof session.exp === "number" && session.exp > Date.now() ? session.id : null;
  } catch {
    return null;
  }
}

export async function clearAdminSession() {
  const jar = await cookies();
  jar.set(COOKIE, "", { path: "/admin", maxAge: 0 });
  jar.set(COOKIE, "", { path: "/", maxAge: 0 });
}
