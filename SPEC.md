# SPEC — KL Rent Car (Website Showcase Kalsara Digital Studio)

> **Dokumen ini adalah instruksi implementasi untuk Claude Code.** Baca seluruh dokumen sebelum menulis kode. Kerjakan sesuai urutan pada bagian "Urutan Eksekusi". Semua data bisnis (harga, nomor, alamat, testimoni) bersifat FIKTIF untuk keperluan demo — jangan mengklaim sebagai bisnis nyata di luar konteks demo.

---

## 1. Project Overview

**KL Rent Car** adalah website showcase/demo untuk portfolio Kalsara Digital Studio (kalsara.id), mensimulasikan website bisnis rental mobil kecil–menengah di Indonesia yang profesional.

- **Tujuan bisnis:** menjadi bukti kemampuan Kalsara saat pitching ke calon klien bisnis rental mobil / otomotif — mencakup company profile, katalog armada, booking via website, dan admin dashboard semi-custom.
- **Target deploy:** `kl-rent-car.demo.kalsara.id`
- **Bahasa konten:** Bahasa Indonesia.
- **Prinsip desain produk (hasil riset pasar):** website ini adalah "SEO-lead-gen hybrid" — WhatsApp adalah kanal konversi utama, booking form on-site adalah kanal sekunder, dan dashboard admin mendemonstrasikan kapabilitas Phase 2.
- **Dua tier yang didemonstrasikan dalam satu produk:**
  1. **Tier MVP** — compro + katalog + harga transparan + WhatsApp pre-filled + SEO.
  2. **Tier Phase 2** — booking on-site + kalender ketersediaan + admin dashboard.

## 2. Tech Stack & Arsitektur

- **Framework:** Next.js (App Router, versi stabil terbaru) + TypeScript.
- **Styling:** Tailwind CSS.
- **Database:** PostgreSQL + Prisma ORM.
- **Auth (admin saja):** credentials sederhana via Auth.js (NextAuth) atau session cookie custom — satu role `ADMIN`. Tidak ada registrasi publik, tidak ada akun pelanggan.
- **Satu aplikasi Next.js**, dua area:
  - Public site: seluruh route publik.
  - Admin: route group `/admin/*`, dilindungi middleware auth.
- **Deployment target:** container Docker (Dockerfile + docker-compose untuk app + Postgres) agar mudah dideploy ke VPS Kalsara. Sertakan `.env.example`.
- **Konfigurasi via environment variable:**
  - `DATABASE_URL`
  - `NEXT_PUBLIC_WA_NUMBER` — nomor WhatsApp tujuan (default placeholder `6281200000000`; pemilik repo dapat menggantinya dengan nomor asli)
  - `NEXT_PUBLIC_SITE_URL`
  - `ADMIN_EMAIL`, `ADMIN_PASSWORD` (untuk seed akun admin demo)
  - `DEMO_RESET_TOKEN` (untuk endpoint reset demo)

### Struktur folder (acuan, boleh disesuaikan seperlunya)

```
/app
  /(public)
    page.tsx                  # Home
    /armada
      page.tsx                # Listing armada + filter
      /[slug]/page.tsx        # Detail unit
    /layanan
      page.tsx                # Index layanan
      /[slug]/page.tsx        # 5 halaman layanan
    /rental-mobil/[kota]/page.tsx   # Location pages (jakarta-selatan, tangerang-selatan)
    /harga/page.tsx
    /booking/page.tsx         # Form booking on-site
    /booking/[kode]/page.tsx  # Halaman status booking (lookup by kode)
    /faq/page.tsx
    /tentang-kami/page.tsx
    /kontak/page.tsx
    /syarat-ketentuan/page.tsx
  /admin
    page.tsx                  # Ringkasan/dashboard
    /login/page.tsx
    /armada/...               # CRUD armada
    /booking/...              # Daftar + detail + ubah status
    /kalender/page.tsx        # Kalender ketersediaan
  /api
    /booking/route.ts
    /admin/...
    /demo/reset/route.ts
/prisma
  schema.prisma
  seed.ts
/lib, /components, /public/images
```

## 3. Data Model (Prisma)

```prisma
model Vehicle {
  id            String   @id @default(cuid())
  slug          String   @unique
  name          String            // "Toyota Innova Reborn"
  brand         String
  model         String
  year          Int
  category      VehicleCategory   // MPV, SUV, LCGC, PREMIUM, MINIBUS
  seats         Int
  luggage       Int               // kapasitas bagasi (koper)
  transmission  Transmission      // MANUAL, MATIC
  fuel          String            // "Bensin", "Diesel"
  engineCc      Int
  unitCount     Int               // jumlah unit tersedia
  priceSelfDrive   Int            // per hari, lepas kunci (Rupiah)
  priceWithDriver  Int            // per 12 jam, all-in mobil+sopir (belum BBM/tol kecuali dicatat)
  priceMonthly     Int?           // "mulai dari" per bulan; null = quotation
  facilities    String[]          // ["AC Dingin", "Audio Bluetooth", ...]
  description   String            // 2–3 paragraf, unik per unit
  images        String[]          // path ke /public/images
  isActive      Boolean  @default(true)
  bookings      Booking[]
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}

model Booking {
  id          String        @id @default(cuid())
  code        String        @unique      // "KL-XXXXXX", human-friendly
  vehicleId   String
  vehicle     Vehicle       @relation(fields: [vehicleId], references: [id])
  serviceType ServiceType   // SELF_DRIVE, WITH_DRIVER, AIRPORT_TRANSFER
  startDate   DateTime
  endDate     DateTime
  pickupLocation String
  customerName   String
  customerPhone  String     // format 62xxx
  notes       String?
  status      BookingStatus @default(PENDING)  // PENDING, CONFIRMED, ONGOING, COMPLETED, CANCELLED
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model AdminUser {
  id       String @id @default(cuid())
  email    String @unique
  password String            // hashed (bcrypt/argon2)
  name     String
}
```

**Aturan ketersediaan:** unit dianggap bentrok jika ada Booking lain pada kendaraan sama dengan status `PENDING/CONFIRMED/ONGOING` yang rentang tanggalnya overlap, DAN jumlah booking overlap ≥ `unitCount`. (Sederhana; tidak perlu per-unit-fisik.)

## 4. Brand & Konten

### 4.1 Identitas

- **Nama:** KL Rent Car
- **Tagline:** "Rental Mobil Jakarta & Tangerang Selatan — Terawat, Transparan, Tepat Waktu"
- **Positioning:** mid-range, profesional tapi approachable. Bukan budget murahan, bukan luxury.
- **Backstory fiktif (untuk halaman Tentang Kami):** berdiri 2016 di Tangerang Selatan, dikelola keluarga, kini 25+ unit, melayani Jabodetabek. Legalitas: "PT Karya Laju Transportasi" (fiktif).
- **Nilai jual (why-us):** harga transparan tanpa biaya tersembunyi, unit terawat & difoto apa adanya, respons WhatsApp < 5 menit (08.00–21.00), driver berpengalaman & sopan.
- **Kontak fiktif:** alamat kantor di Tangerang Selatan (buat alamat fiktif yang wajar, jangan alamat nyata milik pihak lain), telp/WA dari `NEXT_PUBLIC_WA_NUMBER`, email `halo@klrentcar.demo` (placeholder).

### 4.2 Armada (8 unit — seed data)

Harga adalah angka demo yang wajar untuk pasar Jabodetabek; boleh disesuaikan ±10% agar terasa natural, tapi jaga urutan relatif antar unit.

| Unit | Kategori | Seats | Transmisi | Lepas kunci/hari | Dengan sopir/12 jam | Bulanan |
|---|---|---|---|---|---|---|
| Honda Brio Satya | LCGC | 5 | Matic | Rp300.000 | Rp650.000 | Rp5.500.000 |
| Toyota Avanza | MPV | 7 | Manual | Rp350.000 | Rp700.000 | Rp6.000.000 |
| Daihatsu Xenia | MPV | 7 | Matic | Rp350.000 | Rp700.000 | Rp6.000.000 |
| Toyota Innova Reborn (Diesel) | MPV | 7 | Matic | Rp600.000 | Rp950.000 | Rp10.500.000 |
| Toyota Innova Zenix Hybrid | MPV | 7 | Matic | Rp750.000 | Rp1.100.000 | Rp13.000.000 |
| Toyota Fortuner | SUV | 7 | Matic | Rp1.100.000 | Rp1.500.000 | quotation |
| Toyota Alphard | PREMIUM | 7 | Matic | — (hanya dengan sopir) | Rp2.500.000 | quotation |
| Toyota Hiace Commuter | MINIBUS | 15 | Manual | — (hanya dengan sopir) | Rp1.400.000 | quotation |

Catatan konten per unit: tahun 2022–2025, fasilitas 4–6 item, deskripsi unik 2–3 paragraf (tulis sendiri, jangan copy-paste antar unit), 3–4 foto per unit.

**Foto armada:** gunakan placeholder gambar lokal di `/public/images` (boleh SVG ilustratif bergaya konsisten atau gambar gradient + siluet mobil + label nama unit). JANGAN hotlink foto dari internet dan JANGAN pakai foto berhak-cipta. Sediakan README kecil yang menjelaskan cara owner mengganti dengan foto asli.

### 4.3 Layanan (5 halaman, masing-masing di `/layanan/[slug]`)

1. `lepas-kunci` — Rental Lepas Kunci: syarat (KTP+SIM A+deposit), untuk siapa, cara kerja.
2. `dengan-sopir` — Rental Dengan Sopir: paket 12 jam, all-in apa saja, kelebihan.
3. `airport-transfer` — Antar-Jemput Bandara Soekarno-Hatta & Halim: harga tetap per rute (buat tabel 4–6 rute contoh, mis. Tangsel–CGK Rp350.000).
4. `rental-bulanan` — Rental Bulanan: "mulai dari" + form/WA quotation.
5. `corporate` — Rental Korporat: quotation-based, invoice & NPWP, form inquiry (bukan harga terbuka).

### 4.4 Location pages (2, di `/rental-mobil/[kota]`)

- `jakarta-selatan` dan `tangerang-selatan`.
- **Wajib unik satu sama lain** (anti thin/doorway content): intro kota berbeda, daftar area/kecamatan dilayani, unit populer di kota itu, FAQ lokal 3–4 item berbeda, testimonial berbeda.

### 4.5 Copywriting

- Tulis semua copy dalam Bahasa Indonesia yang natural — bukan terjemahan kaku. Register: sopan, hangat, langsung ke poin. Hindari jargon marketing kosong ("solusi terbaik terpercaya nomor 1").
- Testimoni: 6 buah, nama Indonesia yang wajar + konteks ("sewa Innova untuk mudik ke Solo"), tandai halus sebagai demo di footer.
- FAQ global: minimal 10 item (syarat, deposit, pembatalan, overtime, BBM/tol, area layanan, cara bayar DP, kerusakan, keterlambatan, sopir menginap).

## 5. Sitemap & Spesifikasi Halaman Publik

### 5.1 Home — urutan section (WAJIB persis urutan ini)

1. **Hero** — H1: "Rental Mobil Jakarta & Tangerang Selatan, Mulai Rp300.000/hari". Sub-headline nilai jual. Dua CTA: **"Chat WhatsApp"** (primer, hijau) + "Lihat Armada" (sekunder). 3 trust chip: "Sejak 2016", "25+ Unit Terawat", "Layanan 08.00–21.00".
2. **Trust bar** — legalitas PT, metode pembayaran (transfer/QRIS — ikon generik), asuransi unit, rating (tampilkan "4.8 ★ dari pelanggan kami" — label demo).
3. **Armada unggulan** — 6 kartu unit (foto, nama, seats/transmisi/bahan bakar, "Mulai Rp X/hari", tombol WhatsApp per kartu + link detail). Link "Lihat semua armada".
4. **Layanan** — 5 kartu layanan → halaman layanan.
5. **Cara booking 3 langkah** — (1) Pilih unit & tanggal, (2) Chat WA atau isi form booking, (3) DP & konfirmasi, unit siap.
6. **Why us** — 4 poin nilai jual.
7. **Testimoni** — 3–4 testimoni + rating.
8. **Area layanan** — link ke 2 location pages + daftar area Jabodetabek.
9. **FAQ ringkas** — 4 item + link halaman FAQ (pakai accordion).
10. **Kontak + peta** — NAP + embed peta statis/placeholder + jam operasional.

Global: **sticky WhatsApp button** kanan-bawah di semua halaman publik, deep-link pre-filled sesuai konteks halaman.

### 5.2 Armada

- **Listing** `/armada`: filter client-side (kategori, transmisi, kapasitas), grid kartu. Kartu = foto, nama, spec ikon, dua harga (lepas kunci & dengan sopir), CTA WhatsApp + "Detail".
- **Detail** `/armada/[slug]`: galeri, tabel spesifikasi lengkap, kartu harga (lepas kunci / dengan sopir / bulanan), fasilitas, syarat ringkas, FAQ unit (2–3), **dua CTA: "Booking Sekarang" (ke /booking?unit=slug) + "Tanya via WhatsApp" (pre-filled)**, unit terkait (kategori sama). JSON-LD `Product`+`Offer` (atau `Vehicle`).

### 5.3 Booking (on-site, tanpa payment gateway)

Form di `/booking` (unit bisa pre-selected via query param):

1. Field: unit (select), jenis layanan (lepas kunci / dengan sopir / airport transfer), tanggal mulai & selesai (date picker), lokasi jemput, nama, nomor WhatsApp, catatan. **Form pendek satu halaman — jangan multi-step.**
2. Saat tanggal+unit dipilih → cek ketersediaan (API) → tampilkan "Tersedia" / "Penuh di tanggal tsb, pilih tanggal lain atau chat admin".
3. Submit → buat Booking status `PENDING`, generate kode `KL-XXXXXX` → redirect ke `/booking/[kode]`.
4. Halaman konfirmasi: ringkasan booking + status + **tombol "Konfirmasi via WhatsApp"** dengan pesan pre-filled berisi kode booking (menjahit funnel on-site kembali ke WA, sesuai perilaku pasar Indonesia).
5. Validasi server-side (zod atau sejenis): tanggal masa depan, endDate ≥ startDate, nomor WA format Indonesia.
6. Tidak ada pembayaran online. Teks jelas: "Admin kami akan menghubungi Anda untuk konfirmasi & DP."

### 5.4 Halaman lain

- `/harga`: tabel harga semua unit (lepas kunci / sopir / bulanan) + catatan overtime & ketentuan.
- `/faq`: accordion 10+ item, JSON-LD `FAQPage`.
- `/tentang-kami`, `/kontak` (form kontak sederhana → simpan sebagai record atau mailto), `/syarat-ketentuan`.

### 5.5 WhatsApp deep-link (pre-filled)

Format `https://wa.me/{WA_NUMBER}?text={urlencoded}`. Buat helper `buildWaLink(context)`. Template:

- **Dari kartu/detail unit:**
  "Halo KL Rent Car, saya ingin sewa {NamaUnit}.%0ATanggal pakai: %0ADurasi: %0ALepas kunci / dengan sopir: %0ALokasi jemput: %0AMohon info harga & ketersediaan. Terima kasih."
- **Dari halaman layanan dengan sopir:** sertakan rute & jumlah penumpang sebagai baris isian.
- **Dari konfirmasi booking:** "Halo, saya sudah booking via website. Kode: {KODE}. Mohon konfirmasi ketersediaan. Terima kasih."
- **Sticky button default:** pesan umum + URL halaman asal.

## 6. Admin Dashboard (`/admin`)

Scope minimum — jangan tambah fitur di luar daftar ini:

1. **Login** — email+password, session, middleware proteksi semua route `/admin/*` kecuali login.
2. **Ringkasan** (`/admin`) — kartu angka: booking pending, booking bulan ini, unit aktif; daftar 5 booking terbaru.
3. **CRUD Armada** — tabel + form create/edit (semua field Vehicle), toggle aktif/nonaktif, upload gambar boleh disederhanakan menjadi input path/pilih dari daftar gambar yang ada.
4. **Booking** — tabel (filter status + pencarian nama/kode), halaman detail, aksi ubah status (PENDING → CONFIRMED → ONGOING → COMPLETED, atau CANCELLED), tombol "Chat pelanggan" (wa.me ke nomor pelanggan, pre-filled kode booking).
5. **Kalender ketersediaan** (`/admin/kalender`) — tampilan bulan, baris per unit atau filter per unit, blok tanggal terisi berdasarkan booking non-cancelled. Boleh pakai library kalender ringan atau grid custom — pilih yang paling sederhana dan stabil.

Yang **TIDAK** dibuat: payment, invoice, laporan keuangan, multi-role, notifikasi email/WA otomatis, CRM.

## 7. Design Direction

Ikuti arahan ini persis; jangan jatuh ke template default AI (hindari: cream background + serif display + aksen terracotta; hindari juga dark background + satu aksen acid-green).

- **Konsep:** "ruang tunggu showroom yang rapi" — terang, bersih, banyak white space, terasa seperti bisnis yang tertib administrasinya.
- **Palet (token):**
  - `--navy-900: #0F2A43` (utama — heading, nav, footer)
  - `--navy-700: #1D4568` (sekunder)
  - `--road-100: #F5F7F9` (background section selang-seling)
  - `--white: #FFFFFF`
  - `--wa-green: #1FA855` (KHUSUS tombol WhatsApp — jangan dipakai untuk elemen lain)
  - `--amber-500: #E8A020` (aksen kecil: harga, badge, hover — dipakai hemat)
- **Tipografi:** display **Plus Jakarta Sans** (bold/extrabold untuk heading — pilihan yang beralasan: typeface Indonesia, memperkuat identitas lokal), body **Inter**, ukuran body ≥16px. Angka harga ditampilkan besar dengan tabular-nums.
- **Signature element:** garis "marka jalan" — divider horizontal putus-putus (dash panjang) berwarna amber di bawah setiap heading section, konsisten di seluruh situs. Ini satu-satunya elemen dekoratif tematik; sisanya disiplin dan tenang.
- **Fleet card:** foto rasio 4:3, sudut rounded-xl, shadow lembut, baris ikon spec (seats/transmisi/BBM), harga menonjol, CTA hijau WA + link detail.
- **Motion:** minimal — hover lift halus pada kartu, accordion FAQ. Hormati `prefers-reduced-motion`.
- **Mobile-first:** sticky WA di thumb-zone, tap target ≥44px, nav hamburger sederhana, form nyaman di layar kecil.
- **Aksesibilitas dasar:** kontras AA, focus ring terlihat, alt text semua gambar.
- **Admin:** utilitarian dan bersih — sidebar navy, konten putih, tabel rapat; tidak perlu se-branded sisi publik.

## 8. SEO

- Metadata unik per halaman (title pola: "{Topik} | KL Rent Car — Rental Mobil Jakarta & Tangsel"), description unik.
- JSON-LD: `AutoRental` (organisasi + NAP) di layout publik; `Product/Offer` di detail unit; `FAQPage` di /faq; `BreadcrumbList` di halaman dalam.
- `sitemap.xml` + `robots.txt` via App Router conventions. **Karena ini demo: set `robots` ke `noindex` via env flag `NEXT_PUBLIC_DEMO_MODE=true`** (agar demo tidak bersaing di SERP dan tidak dianggap konten menyesatkan; struktur SEO tetap terpasang untuk didemokan ke klien).
- Heading hierarchy benar (satu H1 per halaman), URL sesuai struktur folder di atas, internal linking: home → armada/layanan/lokasi → booking.
- Optimasi gambar via `next/image`, target Core Web Vitals hijau.

## 9. Demo Requirements

1. **Seed (`prisma/seed.ts`):** 8 unit lengkap, 1 admin (dari env), 10–12 booking dummy tersebar status & tanggal (± 3 minggu ke depan/belakang) agar kalender dan dashboard terlihat hidup.
2. **Banner demo:** strip tipis di atas situs publik: "Website demo oleh Kalsara Digital Studio — data fiktif" + link ke kalsara.id. Bisa ditutup (dismiss, simpan di state memori — JANGAN localStorage).
3. **Reset demo:** endpoint `POST /api/demo/reset` (header token = `DEMO_RESET_TOKEN`) → truncate Booking & Vehicle → re-seed. Sertakan contoh cron (dokumentasi di README) untuk reset harian.
4. **Akun demo admin:** kredensial dicantumkan di README (bukan di UI publik).

## 10. Kualitas & Konvensi Kode

- TypeScript strict; tanpa `any` kecuali terpaksa dan diberi komentar.
- Komponen kecil dan reusable: `VehicleCard`, `PriceCard`, `WaButton`, `SectionHeading` (dengan divider marka jalan), `TrustChips`, `BookingForm`, `StatusBadge`.
- Server Components default; Client Components hanya untuk interaktivitas (filter, form, accordion, kalender).
- API route dengan validasi + error response konsisten `{ error: string }`.
- README.md: cara setup lokal (docker-compose up, migrate, seed), env, cara deploy, cara ganti nomor WA & foto, cara reset demo.
- Tidak perlu test suite lengkap; minimal 3–5 test untuk logika ketersediaan booking (overlap & unitCount).

## 11. Urutan Eksekusi (untuk Claude Code)

1. Scaffold Next.js + Tailwind + Prisma + Docker; setup schema + migrate + seed.
2. Design tokens & komponen dasar (SectionHeading, WaButton, VehicleCard, layout publik + nav/footer + sticky WA + banner demo).
3. Home (10 section sesuai 5.1).
4. Armada: listing + filter + detail.
5. Halaman layanan (5), location pages (2), harga, FAQ, tentang, kontak, S&K.
6. Booking flow: API ketersediaan + form + halaman kode booking.
7. Admin: auth + layout + ringkasan + CRUD armada + booking + kalender.
8. SEO (metadata, JSON-LD, sitemap, robots/noindex), optimasi gambar.
9. Demo reset endpoint + README + test ketersediaan.
10. Jalankan acceptance checklist di bawah, perbaiki yang gagal.

## 12. Acceptance Checklist

**Publik**
- [ ] Home menampilkan 10 section sesuai urutan 5.1; hero punya 2 CTA + 3 trust chip.
- [ ] Sticky WhatsApp muncul di semua halaman publik; deep-link berisi pesan pre-filled sesuai konteks (cek dari kartu unit, detail unit, sticky, konfirmasi booking).
- [ ] /armada: filter kategori/transmisi/kapasitas berfungsi; 8 unit tampil.
- [ ] Detail unit: galeri, spesifikasi, 3 skema harga, CTA Booking + WA; Alphard & Hiace tidak menampilkan opsi lepas kunci.
- [ ] 5 halaman layanan + 2 location pages ada, kontennya unik (bukan copy-paste antar halaman).
- [ ] Booking: cek ketersediaan menolak tanggal penuh; submit menghasilkan kode KL-XXXXXX; halaman kode menampilkan status; tombol konfirmasi WA berisi kode.
- [ ] Validasi form menolak tanggal lampau, endDate < startDate, nomor WA tidak valid.

**Admin**
- [ ] Route /admin terproteksi; login/logout berfungsi.
- [ ] CRUD armada penuh; unit nonaktif hilang dari situs publik.
- [ ] Ubah status booking berfungsi dan tercermin di kalender & halaman kode publik.
- [ ] Kalender menampilkan blok tanggal dari booking non-cancelled.

**Teknis**
- [ ] JSON-LD valid (AutoRental, Product, FAQPage) — cek dengan parser.
- [ ] sitemap.xml & robots ada; noindex aktif saat DEMO_MODE.
- [ ] Lighthouse mobile: Performance & SEO ≥ 90 pada Home dan detail unit.
- [ ] `docker-compose up` + migrate + seed berjalan dari clean state; README akurat.
- [ ] Test logika ketersediaan lulus.
- [ ] Tidak ada penggunaan localStorage/sessionStorage di kode UI.
- [ ] Semua konten Bahasa Indonesia, tanpa lorem ipsum tersisa.

---

*Disusun berdasarkan riset benchmark website operator rental mobil Indonesia (Agustus 2026) oleh Kalsara Digital Studio. Data bisnis KL Rent Car sepenuhnya fiktif.*
