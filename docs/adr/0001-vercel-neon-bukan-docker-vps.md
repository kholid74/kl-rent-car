# Deploy ke Vercel + Neon, bukan Docker di VPS

`SPEC.md` §2 menetapkan Dockerfile + docker-compose dengan target VPS Kalsara,
tapi kami membuangnya seluruhnya dan memakai Vercel (host) + Neon (Postgres
serverless, region `ap-southeast-1`). Alasannya sederhana: situs ini adalah
aset pitch yang harus selalu hidup dengan perawatan nol, dan Vercel memberi
preview URL per commit — yang justru berguna saat mendemokan perubahan ke
calon klien — sementara VPS menuntut seseorang mengurus TLS, backup, dan
restart container untuk sebuah demo.

## Konsekuensi

Karena Vercel menjalankan Next.js tanpa Dockerfile, tidak ada artefak
container di repo ini. Pembaca yang datang dari `SPEC.md` akan mencari
`docker-compose.yml` dan tidak menemukannya — itu disengaja, bukan pekerjaan
yang belum selesai.

Runtime serverless berarti koneksi Postgres dibuka per invocation, jadi
`DATABASE_URL` menunjuk ke host pooler Neon (PgBouncer) sementara `DIRECT_URL`
menunjuk ke host langsung khusus untuk `prisma migrate`. Menjalankan migration
lewat pooler akan gagal.

Kalau suatu hari ada klien yang benar-benar meminta on-prem, Dockerfile
Next.js standalone hanya belasan baris dan bisa ditulis saat itu. Menyimpan
Dockerfile yang tidak pernah dibangun hanya melahirkan file yang membusuk diam-diam.
