import { defineConfig } from "@prisma/config";

/**
 * Prisma 7 tidak lagi membaca .env sendiri dan tidak lagi menerima URL koneksi
 * di dalam schema. Node 22 sudah punya pemuat .env bawaan, jadi tidak perlu
 * dotenv sebagai dependency.
 */
process.loadEnvFile?.(".env");

const directUrl = process.env.DIRECT_URL;
if (!directUrl) {
  throw new Error(
    "DIRECT_URL belum diisi. Migrasi tidak bisa lewat host pooler Neon — " +
      "pakai hostname tanpa akhiran '-pooler'. Lihat .env.example.",
  );
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    // Sengaja URL langsung, bukan pooler: PgBouncer tidak mendukung perintah
    // DDL bersesi yang dipakai prisma migrate.
    url: directUrl,
  },
  migrations: {
    seed: "tsx prisma/seed.ts",
  },
});
