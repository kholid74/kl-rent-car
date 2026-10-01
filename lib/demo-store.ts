import { createHash } from "node:crypto";
import type { Prisma } from "@prisma/client";
import { createDemoData, type DemoData } from "./admin-demo";
import { FLEET } from "../prisma/fleet-data";
import { db } from "./db";

export const SHOWCASE_WORKSPACE = "00000000-0000-4000-8000-000000000001";
export class DemoConflictError extends Error {
  constructor() { super("Data berubah di tab lain. Muat ulang sebelum menyimpan."); }
}
export function revision(data: DemoData) {
  // JSONB changes key order; hash a canonical representation on both server and client reads.
  return createHash("sha256").update(JSON.stringify(data, (_, value) =>
    value && typeof value === "object" && !Array.isArray(value)
      ? Object.fromEntries(Object.keys(value).sort().map((key) => [key, value[key]])) : value)).digest("hex");
}
export async function readDemo(id: string): Promise<DemoData> {
  const existing = await db.demoWorkspace.findUnique({ where: { id } });
  if (existing && existing.expiresAt > new Date()) return existing.data as unknown as DemoData;
  const initial = createDemoData(FLEET);
  const values = { data: initial as unknown as Prisma.InputJsonValue, revision: revision(initial), expiresAt: new Date(Date.now() + 43200000) };
  await db.demoWorkspace.upsert({ where: { id }, create: { id, ...values }, update: {} });
  await db.demoWorkspace.updateMany({ where: { id, expiresAt: { lte: new Date() } }, data: values });
  return (await db.demoWorkspace.findUniqueOrThrow({ where: { id } })).data as unknown as DemoData;
}
export async function writeDemo(id: string, data: DemoData, expected: string) {
  const result = await db.demoWorkspace.updateMany({
    where: { id, revision: expected, expiresAt: { gt: new Date() } },
    data: { data: data as unknown as Prisma.InputJsonValue, revision: revision(data), expiresAt: new Date(Date.now() + 43200000) },
  });
  if (!result.count) throw new DemoConflictError();
}
