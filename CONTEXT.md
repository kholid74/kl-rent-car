# CONTEXT — KL Rent Car

Glosarium bahasa domain proyek ini. Bukan spec, bukan catatan implementasi.
Kalau sebuah istilah dipakai di kode, copy, atau percakapan dengan makna lain
dari yang tertulis di sini, salah satunya harus diperbaiki.

## Pihak

**Kalsara Digital Studio** — pemilik dan pembuat situs ini. Muncul di publik
hanya lewat banner demo dan link ke kalsara.id.

**KL Rent Car** — bisnis rental mobil fiktif yang disimulasikan situs ini.
Seluruh data bisnisnya (harga, alamat, testimoni, legalitas) rekaan.

Kata "kami" di dalam copy situs selalu berarti KL Rent Car, tidak pernah
Kalsara. Satu-satunya tempat "kami" berarti Kalsara adalah banner demo.

**Pelanggan** — orang yang menyewa. Tidak punya akun, tidak pernah login,
tidak pernah jadi entitas tersimpan tersendiri — identitasnya hidup di dalam
Booking sebagai nama dan nomor WhatsApp.

**Admin** — pengelola KL Rent Car. Satu-satunya pengguna yang login.

## Armada

**Unit** — satu *model* kendaraan yang disewakan, misalnya "Toyota Innova
Reborn". Bukan satu mobil fisik. Katalog berisi 8 Unit.

**Jumlah Unit** — banyaknya mobil fisik yang dimiliki untuk satu Unit. Mobil
fisik tidak pernah dilacak satu per satu; tidak ada nomor polisi, tidak ada
identitas per mobil. Yang diketahui sistem hanya *berapa banyak*.

**Kategori** — LCGC, MPV, SUV, PREMIUM, MINIBUS. Klasifikasi pemasaran untuk
filter dan perbandingan, bukan aturan bisnis.

## Layanan

**Lepas Kunci** — pelanggan menyetir sendiri. Dihargai per hari.

**Dengan Sopir** — mobil beserta sopir. Dihargai per paket 12 jam.

Hanya dua Layanan ini yang ada. Antar-jemput bandara pernah dipertimbangkan
dan dibuang.

Sebuah Unit tidak selalu menawarkan kedua Layanan. Unit tanpa harga lepas
kunci berarti Unit itu memang tidak pernah disewakan tanpa sopir — bukan
harganya yang belum diisi. Ketiadaan harga *adalah* pernyataan bisnisnya.

**Harga Bulanan** — tarif "mulai dari" per bulan. Ketiadaannya berarti Unit
itu dinegosiasikan lewat penawaran, bukan berarti tidak tersedia bulanan.

## Booking

**Booking** — permintaan sewa satu Unit pada satu rentang tanggal. Selalu
permintaan, tidak pernah transaksi: tidak ada pembayaran di situs, dan
konfirmasi sesungguhnya terjadi lewat WhatsApp.

**Kode Booking** — pengenal yang dibaca manusia, dipakai pelanggan untuk
menengok status dan disebut saat chat admin. Ini satu-satunya kunci yang
dipegang pelanggan.

**Status Booking** — PENDING, CONFIRMED, ONGOING, COMPLETED, CANCELLED.
Berpindah hanya karena tindakan Admin. Tidak ada perpindahan otomatis
berdasarkan waktu; booking yang tanggalnya sudah lewat tetap PENDING sampai
Admin menyentuhnya.

**Bentrok** — kondisi ketika sebuah Unit tidak bisa dibooking pada rentang
tanggal tertentu: jumlah Booking yang tanggalnya bersinggungan dan statusnya
belum CANCELLED atau COMPLETED sudah mencapai Jumlah Unit. Bentrok dihitung
pada tingkat Unit, bukan mobil fisik.

**Estimasi** — angka rupiah yang ditampilkan ke pelanggan. Selalu estimasi,
tidak pernah tagihan: BBM, tol, parkir, lembur, dan menginap sopir berada di
luarnya dan disepakati lewat WhatsApp.

## Demo

**Mode Demo** — keadaan situs sebagai bahan pitch, bukan situs bisnis yang
hidup. Konsekuensinya mesin pencari diminta tidak mengindeks, dan pengunjung
diberi tahu lewat banner bahwa datanya fiktif.

**Reset Demo** — pengembalian seluruh data ke keadaan awal, dijadwalkan
harian. Berlaku ke armada juga, bukan hanya booking: perubahan apa pun yang
dilakukan pengunjung demo tidak boleh diwarisi pengunjung berikutnya.
