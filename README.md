# KL Rent Car

Website showcase rental mobil untuk portofolio **Kalsara Digital Studio**.

Seluruh data bisnis di situs ini fiktif — nama perusahaan, harga, alamat,
legalitas, dan testimoni. Lihat [`CONTEXT.md`](./CONTEXT.md) untuk bahasa domain
proyek ini, dan [`docs/adr/`](./docs/adr) untuk keputusan yang menyimpang dari
[`SPEC.md`](./SPEC.md).

> `SPEC.md` adalah dokumen asli dan sebagian isinya sudah usang — Docker diganti
> Vercel + Neon (ADR 0001), antar-jemput bandara dihapus, dan seluruh form
> inquiry dibuang demi WhatsApp (ADR 0002). Kalau spec dan ADR bertentangan,
> ADR yang menang.

## Stack

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS 4 · Prisma 7 ·
PostgreSQL (Neon) · deploy ke Vercel.

## Setup lokal

Butuh **Node 22.12+** — Prisma 7 menolak versi di bawahnya.

```bash
git clone https://github.com/kholid74/kl-rent-car.git
cd kl-rent-car
npm install
```

Lalu buat `.env`. Berkas ini tidak pernah masuk repo karena berisi kredensial:

```bash
cp .env.example .env
```

Isi `DATABASE_URL` dan `DIRECT_URL` dari dashboard Neon. **Keduanya berbeda dan
tidak bisa ditukar:**

- `DATABASE_URL` → hostname ber-akhiran `-pooler`. Dipakai runtime.
- `DIRECT_URL` → hostname tanpa `-pooler`. Dipakai `prisma migrate`; migrasi
  gagal kalau lewat pooler, karena PgBouncer tidak mendukung DDL bersesi.

Kemudian:

```bash
npx prisma generate
npm run dev
```

Database Neon dipakai bersama semua perangkat, jadi skema dan data seed sudah
ada — tidak perlu `migrate` atau `seed` ulang saat pindah mesin.

## Perintah

| Perintah | Kegunaan |
|---|---|
| `npm run dev` | Server pengembangan di http://localhost:3000 |
| `npm run build` | Build produksi |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run lint` | ESLint |
| `npm test` | Test (`node --test` lewat tsx) |
| `npm run db:migrate` | Buat dan terapkan migrasi baru |
| `npm run db:seed` | Isi ulang database dari `prisma/fleet-data.ts` |
| `npm run db:studio` | Prisma Studio |
| `npm run images:fetch` | Arsip skrip lama untuk foto ilustrasi; tidak dipakai tampilan baru |

## Memasang foto armada

Hero dan seluruh delapan kartu armada memakai gambar yang diberikan pemilik; galeri detail memakai slot kosong sampai foto yang sesuai tersedia. Lihat
[`docs/FOTO-ASLI.md`](./docs/FOTO-ASLI.md) untuk daftar foto, ukuran, dan cara
memasangnya. Foto ilustrasi lama tidak ditampilkan; kreditnya tetap ada di
[`public/images/armada/CREDITS.md`](./public/images/armada/CREDITS.md).

## Mengganti nomor WhatsApp

Ubah `NEXT_PUBLIC_WA_NUMBER` di `.env` (format `62xxx`, tanpa `+` dan tanpa
spasi). Seluruh tombol WhatsApp mengambil dari satu variabel itu.

## Mode demo

`NEXT_PUBLIC_DEMO_MODE=true` memasang `noindex` dan menampilkan banner demo.
Struktur SEO tetap lengkap agar bisa didemokan ke klien; yang dimatikan hanya
pengindeksannya, supaya demo ini tidak bersaing di hasil pencarian dengan
operator rental sungguhan.

### Demo admin

Area admin ada di `/admin/login`. Login memakai akun `AdminUser` yang sudah di-seed
dari `ADMIN_EMAIL` dan `ADMIN_PASSWORD`; kredensial diberikan kepada calon klien
secara privat. Atur `ADMIN_SESSION_SECRET` dengan nilai acak minimal 32 karakter
di environment lokal dan hosting. Contoh pembuatan secret: `openssl rand -base64 48`.

Untuk showcase multi-role, buka **`/demo`** dan login dengan email/kata sandi
akun Admin Rental atau pemilik kendaraan. Pelanggan menggunakan website publik
tanpa login. Pemilih role tanpa kata sandi tidak tersedia.

Booking customer terhubung ke mobil fisik dan pemiliknya, dengan kelanjutan
WhatsApp tetap tersedia. Portal `/pemilik` bersifat baca saja dan dibatasi di server.
Data operasional disimpan di Neon, dibagikan antar-akun dan instance Vercel,
serta bertahan saat refresh. Data awal diperbarui setelah 12 jam tanpa perubahan.
**Reset demo** oleh admin mengembalikan workspace showcase bersama ke awal.
Migrasi hanya menambahkan tabel demo; katalog existing tidak diubah.
Lihat [alur, model data, dan batas demo multi-role](./docs/MULTI-ROLE-DEMO.md).

## Status pekerjaan

Rencana kerja dipecah menjadi 18 tiket di
[GitHub Issues](https://github.com/kholid74/kl-rent-car/issues), berlabel
`ready-for-agent`. Tiket #1 (Home) selesai.
