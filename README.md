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
| `npm run images:fetch` | Unduh ulang foto armada dari Unsplash |

## Mengganti foto armada

Foto saat ini generik dan **bukan model mobil yang sesuai nama unit** — kartu
armada memberi label "Foto ilustrasi" karena itu. Kredit fotografer ada di
[`public/images/armada/CREDITS.md`](./public/images/armada/CREDITS.md).

Untuk memasang foto asli: timpa berkas di `public/images/armada/` memakai nama
yang sama (`<slug>-1`, `-2`, `-3`; ekstensi `.webp`, `.jpg`, `.jpeg`, atau
`.png`), lalu `npm run db:seed`. Tidak ada kode yang perlu disunting — seed
memindai folder itu dan memakai apa pun yang ditemukan.

## Mengganti nomor WhatsApp

Ubah `NEXT_PUBLIC_WA_NUMBER` di `.env` (format `62xxx`, tanpa `+` dan tanpa
spasi). Seluruh tombol WhatsApp mengambil dari satu variabel itu.

## Mode demo

`NEXT_PUBLIC_DEMO_MODE=true` memasang `noindex` dan menampilkan banner demo.
Struktur SEO tetap lengkap agar bisa didemokan ke klien; yang dimatikan hanya
pengindeksannya, supaya demo ini tidak bersaing di hasil pencarian dengan
operator rental sungguhan.

## Status pekerjaan

Rencana kerja dipecah menjadi 18 tiket di
[GitHub Issues](https://github.com/kholid74/kl-rent-car/issues), berlabel
`ready-for-agent`. Tiket #1 (Home) selesai.
