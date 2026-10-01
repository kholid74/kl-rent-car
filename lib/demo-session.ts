import { cookies } from "next/headers";
import { signSession, verifySession } from "./admin-auth";
import { OWNERS } from "./admin-demo";
import { DEMO_MODE } from "./site";
import { SHOWCASE_WORKSPACE } from "./demo-store";

export type DemoSession = { id: string; role: "customer" | "admin" | "owner"; ownerId?: string; exp: number };
const COOKIE = "kl_demo_session";
export async function getDemoSession(): Promise<DemoSession | null> {
  if (!DEMO_MODE) return null;
  const raw = (await cookies()).get(COOKIE)?.value;
  const value = raw ? verifySession(raw) as DemoSession | null : null;
  if (!value || !/^[\da-f-]{36}$/.test(value.id) || !["customer", "admin", "owner"].includes(value.role)) return null;
  if (value.role === "owner" && !OWNERS.some((o) => o.id === value.ownerId)) return null;
  return value;
}
export async function setDemoSession(role: DemoSession["role"], ownerId?: string) {
  if (!DEMO_MODE) throw new Error("Mode demo tidak aktif.");
  const session: DemoSession = { id: SHOWCASE_WORKSPACE, role, ownerId, exp: Date.now() + 12 * 60 * 60 * 1000 };
  (await cookies()).set(COOKIE, signSession(session), { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 43200 });
  return session;
}
