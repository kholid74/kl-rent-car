# Rencana admin demo KL Rent Car

## Tujuan

Calon klien masuk melalui login sungguhan sebelum membuka `/admin`, lalu dapat mencoba alur operasional rental dari pesanan masuk sampai penugasan sopir. Setelah login, seluruh nama pelanggan, nomor, tanggal, armada, sopir, pesanan, dan status adalah data contoh. Di area admin, akses database hanya untuk memverifikasi akun pada tabel `AdminUser`; menu operasional tidak membaca atau menulis database.

## Akses dan sesi

- `/admin/login` menerima email dan password akun demo yang sudah dibuat di tabel `AdminUser`. Cocokkan password dengan hash yang sudah disimpan; jangan taruh kredensial di kode atau tampilkan password di UI publik.
- Login yang berhasil membuat sesi lewat cookie bertanda tangan, `HttpOnly`, `SameSite=Lax`, dan `Secure` pada produksi. Sesi cukup memuat identitas admin dan masa berlaku; tidak perlu tabel sesi baru. Logout menghapus cookie.
- Semua route `/admin/*` selain login memeriksa sesi di server. Pengunjung tanpa sesi diarahkan ke login; pengunjung yang sudah login diarahkan dari login ke ringkasan. Akses langsung ke URL detail juga terlindungi.
- Akun demo dan cara memperoleh kredensial diberikan kepada calon klien lewat kanal privat saat presentasi. Percobaan login gagal menampilkan pesan umum dan dibatasi lajunya.

## Menu dan interaksi

| Menu | Route | Yang terlihat dan bisa dicoba |
|---|---|---|
| Ringkasan | `/admin` | KPI, chart tren pesanan, pemakaian armada, komposisi layanan, serta antrean pekerjaan hari ini. Klik angka atau bagian chart untuk membuka daftar yang sudah terfilter. |
| Pesanan | `/admin/pesanan` dan `/admin/pesanan/[kode]` | Cari/filter pesanan, buka detail, buat pesanan contoh, ubah status, pilih mobil dan sopir, lihat dampaknya pada ringkasan dan jadwal. Pesan WhatsApp hanya dapat dipratinjau atau disalin; nomor fiktif tidak dihubungi. |
| Penawaran | `/admin/penawaran` | Permintaan bulanan/tahunan, wedding car, dan agenda khusus yang perlu harga khusus. Lihat kebutuhan, catat estimasi dan tenggat tindak lanjut, lalu ubah tahap dari *Baru* sampai *Disepakati* atau *Tidak jadi*. |
| Jadwal | `/admin/jadwal` | Kalender minggu atau bulan dengan baris mobil dan penugasan sopir. Klik blok jadwal membuka pesanan. Tanggal kosong dan bentrok terlihat jelas. |
| Armada | `/admin/armada` dan `/admin/armada/[slug]` | Delapan model yang sama dengan situs publik, foto kartu yang sudah disediakan, kapasitas, tarif, jumlah unit, dan status. Ubah informasi atau status melalui form demo; hasilnya terlihat selama sesi. Catat jumlah mobil yang sedang perawatan agar kapasitas model pada jadwal berkurang. |
| Sopir | `/admin/sopir` dan `/admin/sopir/[id]` | Profil ringkas, nomor kontak fiktif, ketersediaan, dan jadwal tugas. Ubah status tersedia/cuti dan buka pesanan yang ditangani. |
| Pelanggan | `/admin/pelanggan` | Daftar pelanggan yang diturunkan dari pesanan contoh, dengan riwayat booking. Tidak perlu CRM terpisah. |
| Laporan | `/admin/laporan` | Versi lebih rinci dari statistik ringkasan: filter periode, armada, layanan, dan status; tabel sumber untuk setiap grafik. Ekspor CSV data demo yang sedang terfilter. |

## Ringkasan yang menjual nilai bisnis

- **KPI utama:** pesanan baru yang perlu respons, perjalanan aktif, keberangkatan tujuh hari ke depan, armada tersedia, dan sopir tersedia. Setiap angka menuju daftar terkait. Tampilkan perubahan terhadap periode sebelumnya hanya jika data pembandingnya ada.
- **Tren pesanan:** grafik batang per minggu untuk periode pendek dan per bulan untuk enam bulan, dipisah menurut status atau layanan. Klik batang untuk melihat pesanan pada rentang itu. Grafik ini menjawab kapan permintaan naik dan apakah tim perlu menambah kapasitas.
- **Pemakaian armada:** batang horizontal per model dengan persentase hari mobil terpakai terhadap jumlah mobil tersedia × hari dalam periode terpilih. Mobil yang sedang perawatan dikeluarkan dari kapasitas tersedia. Klik model membuka armada dan jadwalnya. Model yang sering kosong atau hampir penuh langsung terlihat.
- **Komposisi layanan:** grafik batang bertumpuk untuk lepas kunci, dengan sopir, dan permintaan penawaran khusus. Klik segmen memfilter daftar pesanan/penawaran. Hindari pie chart kecil yang sulit dibandingkan.
- **Potensi nilai pesanan:** jumlah estimasi dari pesanan terkonfirmasi, diberi label *estimasi*, karena demo tidak mencatat pembayaran. Jangan tampilkan sebagai omzet atau pendapatan nyata.
- **Perlu tindakan:** daftar pesanan menunggu, penawaran yang tenggat tindak lanjutnya dekat, penugasan sopir yang belum lengkap, dan armada yang sedang perawatan. Ini tetap terlihat di atas atau di samping chart sehingga dashboard membantu keputusan harian.
- Filter periode **30 hari / 90 hari / 6 bulan** berlaku konsisten pada KPI dan chart yang berbasis periode. Cantumkan satuan, legenda, dan keadaan kosong yang masuk akal; ringkasan tidak bergantung pada animasi dekoratif.

## Data dan perilaku demo

- Siapkan satu set data lokal yang deterministik: 8 model armada, sekitar 6 sopir, 12–15 pesanan di sekitar tanggal hari ini, dan riwayat sekitar 60–90 pesanan selama enam bulan terakhir agar chart punya pola yang masuk akal. Sertakan beberapa penawaran khusus dan periode perawatan. Semua tanggal relatif terhadap hari ini agar demo tetap hidup; status, layanan, dan nilai contoh konsisten dengan detailnya.
- Hitung KPI dan chart dari sumber data demo yang sama dengan tabel dan kalender; perubahan status atau penugasan segera tercermin di ringkasan. Riwayat lama boleh ringkas, tetapi setiap titik chart harus dapat ditelusuri ke data contoh, bukan angka yang ditempel terpisah.
- Simpan perubahan sementara di state bersama pada layout admin. Navigasi antarmenu memakai `Link` sehingga pilihan pengguna tetap terlihat selama ia menjelajahi admin. Muat ulang halaman mengembalikan data awal tanpa mengeluarkan pengguna dari sesi login; sediakan juga tombol **Reset demo** yang jelas.
- Saat pengguna mengubah status, menugaskan sopir, atau mengubah status mobil, angka ringkasan dan jadwal ikut berubah. Tampilkan umpan balik singkat setelah aksi. Jangan tampilkan tombol simpan yang tidak bereaksi.
- Pada pilihan sopir, tampilkan hanya sopir yang tersedia pada tanggal pesanan. Bentrok yang sengaja ada pada data contoh diberi penjelasan di layar.
- Tampilkan keterangan ringkas di header: **Mode demo — perubahan hanya berlaku sampai halaman dimuat ulang**. Data fiktif tidak dikirim ke layanan luar.

## Satu alur untuk presentasi

1. Buka `/admin/login`, masukkan akun demo yang diberikan saat presentasi, lalu mendarat di ringkasan. Tautan dari situs publik, jika dipasang, menuju halaman login.
2. Klik batang tren atau kartu **Perlu respons** untuk membuka pesanan berstatus *Menunggu*, lalu lihat detail pelanggan dan kebutuhan mobil.
3. Pilih sopir yang tersedia, ubah status menjadi *Dikonfirmasi*, lalu kembali ke ringkasan untuk melihat angka berubah.
4. Buka jadwal; pesanan yang sama muncul pada tanggal dan armada yang tepat. Klik bloknya untuk kembali ke detail. Tunjukkan penawaran khusus yang menunggu tindak lanjut.
5. Buka armada, sopir, dan laporan untuk memperlihatkan dampak perubahan serta rincian angka chart, lalu tekan **Reset demo** dan **Keluar**.

## Tampilan

Gunakan identitas publik secara hemat: sidebar hitam arang, kanvas putih gading, panel putih, dan emas satin hanya untuk penanda aktif atau sorotan angka. Letakkan prioritas pekerjaan di area pertama, lalu beri chart ruang yang cukup untuk dibaca; variasikan ukuran panel menurut kepentingan data agar tidak terasa seperti deretan kartu seragam. Di layar kecil, sidebar menjadi menu yang mudah dibuka dan ditutup; chart serta tabel tetap terbaca dengan filter sederhana.

## Urutan implementasi

1. Login, sesi, logout, proteksi semua route admin, serta data contoh dan reset.
2. Ringkasan dengan KPI, chart, dan pekerjaan hari ini; daftar/detail pesanan serta aksi status dan penugasan yang memperbarui ringkasan.
3. Jadwal, armada, sopir, penawaran, laporan, lalu daftar pelanggan dari pesanan.
4. Tautan masuk dari situs publik dan pemeriksaan alur presentasi dari awal sampai reset.

## Batas yang sengaja dipilih

Database hanya dipakai pada proses login untuk tabel `AdminUser`. Tidak ada CRUD database, API operasional, pembayaran, invoice, notifikasi otomatis, atau sinkronisasi dengan booking situs publik pada versi showcase ini. Jika admin kelak dipakai bisnis nyata, penyimpanan data dan aturan bentrok transaksi harus dirancang sebelum diaktifkan untuk operasional.

## Kriteria selesai

- Tanpa login, seluruh halaman admin termasuk URL detail tidak bisa dibuka; login dan logout bekerja dengan akun database yang valid.
- Setiap menu dapat dibuka dari navigasi. Angka, chart, tabel laporan, dan jadwal berasal dari data demo yang sama; perubahan satu pesanan memperbarui semuanya selama sesi layar yang sama.
- Klik KPI atau bagian chart membuka daftar terfilter yang menjelaskan angka tersebut. Tidak ada klaim omzet tanpa data pembayaran.
- Muat ulang atau **Reset demo** mengembalikan data contoh tanpa menghapus sesi login; **Keluar** mengakhiri sesi.
- Tidak ada query database dari menu dashboard, pesanan, jadwal, armada, sopir, atau pelanggan, dan tidak ada tombol demo yang tampak aktif tetapi tidak bereaksi.
