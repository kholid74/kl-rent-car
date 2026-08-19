import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

/**
 * Prisma 7 menyambung ke database lewat driver adapter, bukan lewat URL di
 * schema. Yang dipakai di sini adalah URL pooler Neon: tiap invocation
 * serverless membuka koneksi baru, dan PgBouncer yang menahan agar jumlah
 * koneksi ke Postgres tidak meledak. Migrasi memakai URL langsung — lihat
 * prisma.config.ts.
 */
function createClient() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL belum diisi. Lihat .env.example.");
  }
  return new PrismaClient({ adapter: new PrismaPg({ connectionString }) });
}

// next dev memuat ulang modul tiap perubahan file. Tanpa cache di globalThis,
// setiap reload akan meninggalkan satu pool koneksi menganggur ke Neon.
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const db = globalForPrisma.prisma ?? createClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = db;
}
