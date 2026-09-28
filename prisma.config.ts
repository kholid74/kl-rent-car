import { defineConfig } from "@prisma/config";

/**
 * Prisma 7 tidak lagi membaca .env sendiri dan tidak lagi menerima URL koneksi
 * di dalam schema. Node 22 sudah punya pemuat .env bawaan, jadi tidak perlu
 * dotenv sebagai dependency.
 *
 * Di Vercel dan CI berkas .env memang tidak ada — env disuntik platform lewat
 * process.env. Jadi kegagalan memuat berkas diabaikan; yang tetap diwajibkan
 * adalah nilai DIRECT_URL di bawah.
 */
try {
  process.loadEnvFile?.(".env");
} catch {
  // .env tidak ada; env datang dari platform.
}

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
