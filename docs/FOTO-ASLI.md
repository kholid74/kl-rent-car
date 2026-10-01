# Panduan foto asli

Hero memakai gambar yang diberikan pemilik di `public/images/manual/hero.png`. Seluruh delapan kartu armada sudah memakai gambar dari pemilik. Galeri detail tetap memakai slot kosong sampai foto khusus galeri tersedia. Berkas foto generik lama di `public/images/armada/` tetap tersimpan sebagai arsip kredit, tetapi tidak ditampilkan.

| Model | Berkas kartu |
|---|---|
| Alphard | `card_alphard.webp` |
| Fortuner | `card_fortuner.webp` |
| Innova Zenix Hybrid | `card_innova.webp` |
| Innova Reborn Diesel | `card_innova_reborn.webp` |
| Hiace Commuter | `card_hiace.webp` |
| Avanza | `card_avanza.webp` |
| Xenia | `card_xenia.webp` |
| Brio Satya | `card_brio.webp` |

## Daftar foto

| Slot | Foto yang disiapkan | Ukuran minimum |
|---|---|---|
| Hero | Sudah terisi; bila diganti, sisakan ruang di sekitar mobil untuk potongan layar sempit | Rasio mendekati 4:5 |
| Kartu tiap model | Tampak luar dari sudut depan ¾ | 1200 × 900 px, rasio 4:3 |
| Detail tiap model | Tampak luar, kabin, bagasi | Masing-masing 1200 × 900 px, rasio 4:3 |

Gunakan foto mobil yang benar-benar mewakili model yang ditawarkan. Upayakan sudut dan pencahayaan konsisten, bersihkan interior, dan pastikan izin penggunaan foto jelas. Samarkan pelat nomor atau wajah orang bila diperlukan. Simpan sebagai WebP dengan ukuran berkas yang wajar.

## Memasang foto

1. Untuk mengganti foto kartu, timpa berkas yang sesuai pada tabel di atas di `public/images/manual/`.
2. Untuk mengisi galeri detail, taruh berkas seperti `toyota-alphard-1.webp`, `toyota-alphard-2.webp`, dan `toyota-alphard-3.webp` di folder tersebut. Jalankan `npm run db:studio`, buka tabel `Vehicle`, lalu ganti kolom `images` dengan path `/images/manual/toyota-alphard-1.webp` dan seterusnya. Urutan: tampak luar, kabin, bagasi.
3. Untuk mengganti hero, taruh foto baru di folder yang sama lalu ubah prop `src` pada `PhotoSlot` hero di `app/(public)/page.tsx`.

Jangan jalankan `npm run db:seed` untuk memasang foto pada database yang sedang dipakai: skrip itu menghapus dan membuat ulang armada, booking, serta akun demo.
