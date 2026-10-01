import { randomBytes } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { hash } from "bcryptjs";
import { loadEnvConfig } from "@next/env";

loadEnvConfig(process.cwd());

async function main() {
  const { db } = await import("../lib/db");
  const path = ".scratch/client-credentials.json";
  const accounts: Array<{ email: string; password: string; role: "admin" | "owner"; ownerId: string | null }> = existsSync(path)
    ? JSON.parse(readFileSync(path, "utf8"))
    : ["admin", "budi", "andi", "sari"].map((name) => ({ email: `${name === "admin" ? "admin.demo" : name}@klrentcar.demo`, password: `KL-${randomBytes(8).toString("hex")}!`, role: name === "admin" ? "admin" : "owner", ownerId: name === "admin" ? null : name }));
  mkdirSync(".scratch", { recursive: true });
  writeFileSync(path, JSON.stringify(accounts, null, 2), { mode: 0o600 });
  try {
    for (const account of accounts) {
      const data = { ...account, password: await hash(account.password, 12) };
      await db.demoAccount.upsert({ where: { email: account.email }, create: data, update: data });
    }
    console.log(`Provisioned ${accounts.length} demo accounts. Credentials saved privately in ${path}.`);
  } finally { await db.$disconnect(); }
}
main().catch(() => { console.error("Demo account provisioning failed; check database and migrations."); process.exitCode = 1; });
