# Demo multi-role KL Rent Car

## Hasil audit dan cakupan

Katalog publik memakai Next.js App Router, Prisma 7, dan Neon. Model `Vehicle`
adalah model pemasaran dengan jumlah mobil, bukan satu nomor polisi. Formulir
booking existing mengirim pesan WhatsApp. Dashboard admin sudah memiliki
ringkasan, pesanan, jadwal, armada, sopir, pelanggan, penawaran, dan laporan,
tetapi sebelumnya menyimpan data terpisah di state browser.

Implementasi ini menggunakan kembali data `FLEET`, generator admin, foto mobil,
format tanggal/rupiah, panel, tabel, kartu, warna, tipografi, dan sidebar admin.
Katalog serta halaman customer tidak didesain ulang. Form booking mendapatkan
pengecekan kapasitas dan penyimpanan permintaan demo, dengan kelanjutan WhatsApp
tetap tersedia. Saat mode demo dimatikan, formulir tetap langsung ke WhatsApp.

## Menjalankan showcase

Gunakan environment existing: `DATABASE_URL`, `ADMIN_SESSION_SECRET` (minimal
32 karakter), dan `NEXT_PUBLIC_DEMO_MODE=true`. Jalankan `npm run db:deploy`
untuk menambahkan tabel demo, lalu `npx tsx scripts/provision-demo.ts` untuk
membuat empat akun. Password acak disimpan di `.scratch/client-credentials.json`
(diabaikan Git), sedangkan database hanya menyimpan hash bcrypt. Jangan jalankan
seed katalog untuk provisioning akun, karena seed existing mengosongkan tabel katalog.

1. Jalankan `npm run dev`, buka website publik sebagai pelanggan tanpa login.
2. Pilih kendaraan/tanggal dari website, buka formulir, cek ketersediaan, lalu
   ajukan pemesanan dengan identitas fiktif. Simpan kode `KL-DM-…`.
3. Buka **Lihat permintaan sebagai admin**, login dengan akun Admin Rental.
4. Cari kode di **Pesanan**, buka detail. Nomor polisi dan pemilik terlihat
   bersama bagian hasil. Ubah status menjadi **Dikonfirmasi** dan simpan.
5. Pilih **Ganti peran**, login dengan akun pemilik yang tercantum. Booking muncul
   di jadwal dan detail mobilnya. Pemilik lain tidak melihat booking tersebut.
6. Buka **Riwayat penyewaan** dan **Pendapatan** untuk contoh perjalanan selesai
   selama enam bulan. Booking mendatang belum dihitung sebagai pendapatan.
7. **Reset demo** di ringkasan admin mengembalikan seluruh workspace bersama ke awal.

Admin existing masih bisa masuk dengan email/password di `/admin/login`.
Admin/pemilik wajib login dengan email dan kata sandi. Tidak ada pemilih role
tanpa password. Akun demo dipisahkan dari tabel akun admin existing. Pelanggan
tetap memakai website publik tanpa akun. Semua akun demo berbagi satu workspace,
sehingga booking customer juga terlihat ketika admin/pemilik login dari perangkat
lain. Gunakan data pelanggan fiktif selama hands-on.

## Model dan aturan

- `Owner`: identitas, kontak fiktif, persentase bagian pemilik.
- `PhysicalUnit`: ID mobil fisik, model katalog, nomor polisi unik, pemilik.
- `Booking`: relasi model dan mobil fisik, periode inklusif dalam hari,
  nilai rental, status, serta snapshot persentase bagian pemilik.
- Setiap permintaan dialokasikan ke satu mobil yang bebas sepanjang periode.
  Menunggu, dikonfirmasi, dan berjalan menahan mobil; selesai/batal melepasnya.
  Dua booking tidak boleh menempati mobil yang sama pada tanggal bersinggungan.
- Pendapatan hanya berasal dari perjalanan **Selesai**, berdasarkan bulan
  tanggal selesai. Bagian pemilik dibulatkan ke rupiah; bagian rental adalah
  sisanya. Angka ini belum dikurangi biaya dan tidak menyatakan transfer nyata.
- Model nonaktif/mobil perawatan tidak menerima booking. Mobil yang masih
  memiliki pesanan aktif tidak dapat dipindahkan ke perawatan lewat simulasi.

Ada 3 pemilik dan 26 mobil fisik mengikuti jumlah pada katalog existing.
Tanggal data awal relatif terhadap hari ini di Asia/Jakarta.

## Batas akses dan penyimpanan

Sesi role memakai cookie HTTP-only, SameSite Lax, tanda tangan HMAC, dan masa
berlaku 12 jam. Tanda tangan demo dipisahkan dari sesi admin existing.
Server menyaring data berdasarkan owner dari sesi, bukan parameter URL.
Payload owner tidak memuat kontak pelanggan, lokasi jemput, catatan internal,
sopir, penawaran, atau mobil pemilik lain. URL detail mobil asing menghasilkan
404. Semua perubahan admin memeriksa role kembali di server; owner tidak bisa
mengubah data lewat pemanggilan action langsung.

Data operasional demo disimpan sebagai JSONB di tabel `DemoWorkspace` pada Neon,
bukan di filesystem Vercel. Penulisan memakai conditional update atas hash revisi
agar dua request tidak menimpa perubahan satu sama lain. Refresh, pergantian role,
dan request ke instance Vercel lain tetap menggunakan data yang sama. Setelah
12 jam tanpa perubahan, data diisi ulang dengan tanggal relatif terbaru.
Pembatas login tersimpan pada tabel `DemoLoginAttempt`: maksimal lima percobaan
per kombinasi IP/email dalam 15 menit; record kedaluwarsa dibersihkan saat login.

**Batas demo:** akun dibagikan untuk hands-on dengan data fiktif, dan reset admin
memengaruhi semua peserta demo. Untuk bisnis produksi, pindahkan entitas JSONB
ke tabel relasional serta tambahkan pengelolaan akun, audit, dan aturan operasional
sesuai kebutuhan. Tabel katalog/booking existing tidak diubah oleh migrasi ini.

Dokumen ini menggantikan keterangan lama bahwa booking demo tidak berhubungan
dengan situs publik, tidak ada mobil fisik, atau data selalu hilang saat refresh.

## Verifikasi

`npm test` mencakup hubungan mobil/pemilik, isolasi DTO owner, data sensitif,
kapasitas, bentrok, tanggal, dan pembagian hasil. Jalankan juga `npm run lint`,
`npm run typecheck`, dan `npm run build`. Build dan halaman dinamis customer
memerlukan koneksi ke database Neon existing. Test integrasi penyimpanan dapat
dijalankan dengan `DEMO_DB_TEST=true` dan environment database dimuat; test memakai
workspace ber-ID acak dan hanya menghapus data test-nya sendiri.
