"use server";

import { compare } from "bcryptjs";
import { createHash } from "node:crypto";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { clearAdminSession, createAdminSession } from "@/lib/admin-auth";
import { db } from "@/lib/db";
import { getDemoSession, setDemoSession } from "@/lib/demo-session";
import { DEMO_MODE } from "@/lib/site";
import { OWNERS } from "@/lib/admin-demo";

export async function loginAdmin(_: string | null, form: FormData): Promise<string | null> {
  const email = String(form.get("email") ?? "").trim().toLowerCase();
  const password = String(form.get("password") ?? "");
  if (!email || !password || email.length > 254 || password.length > 256) return "Email atau password tidak sesuai.";
  const requestHeaders = await headers();
  const ip = requestHeaders.get("x-forwarded-for")?.split(",")[0]?.trim() || requestHeaders.get("x-real-ip") || "unknown";
  const key = createHash("sha256").update(`${ip}:${email}`).digest("hex");
  let destination = "/admin";

  try {
    await db.demoLoginAttempt.deleteMany({ where: { expiresAt: { lte: new Date() } } });
    const attempt = await db.demoLoginAttempt.upsert({ where: { key }, create: { key, expiresAt: new Date(Date.now() + 15 * 60_000) }, update: { count: { increment: 1 } } });
    if (attempt.count > 5) return "Terlalu banyak percobaan. Coba lagi dalam 15 menit.";
    const demo = DEMO_MODE ? await db.demoAccount.findUnique({ where: { email } }) : null;
    const user = demo ?? await db.adminUser.findUnique({ where: { email }, select: { id: true, password: true } });
    const valid = await compare(password, user?.password ?? "$2b$12$C6UzMDM.H6dfI/f/IKcEe.3LUdWMVpEFJ29MjwKYZOE14iEGHTKq.");
    if (!user || !valid) {
      return "Email atau password tidak sesuai.";
    }
    if (demo) {
      if (demo.role !== "admin" && !(demo.role === "owner" && OWNERS.some((o) => o.id === demo.ownerId))) return "Akun ini belum memiliki akses portal.";
      await clearAdminSession();
      await setDemoSession(demo.role as "admin" | "owner", demo.ownerId ?? undefined);
      destination = demo.role === "owner" ? "/pemilik" : "/admin";
    } else {
      await createAdminSession(user.id);
      if (DEMO_MODE) await setDemoSession("admin");
    }
    await db.demoLoginAttempt.deleteMany({ where: { key } });
  } catch {
    return "Login belum tersedia. Coba lagi beberapa saat.";
  }
  redirect(destination);
}

export async function logoutAdmin() {
  await clearAdminSession();
  if (await getDemoSession()) await setDemoSession("customer");
  redirect("/demo");
}
