/**
 * FAQ global. Halaman /faq menampilkan semuanya; Home hanya menampilkan yang
 * ditandai `onHome` — empat pertanyaan yang paling sering muncul sebelum orang
 * memutuskan menghubungi.
 *
 * Halaman lokasi punya FAQ-nya sendiri yang khas kota, bukan mengambil dari sini.
 */

export type FaqItem = {
  question: string;
  answer: string;
  onHome?: boolean;
};

export const FAQ: FaqItem[] = [
  {
    question: "Apa saja syarat untuk sewa lepas kunci?",
    answer:
      "KTP dan SIM A yang masih berlaku atas nama penyewa, plus deposit yang dikembalikan penuh saat unit kembali dalam kondisi semula. Untuk penyewa dari luar Jabodetabek, kami biasanya meminta satu dokumen pendukung tambahan seperti kartu keluarga atau surat keterangan kerja. Semua dokumen hanya difoto untuk arsip dan tidak kami bagikan ke pihak mana pun.",
    onHome: true,
  },
  {
    question: "Berapa deposit yang harus saya tinggalkan?",
    answer:
      "Besarnya tergantung unit, umumnya setara satu sampai dua hari sewa untuk kelas LCGC dan MPV, dan lebih tinggi untuk SUV serta unit premium. Deposit dikembalikan pada hari unit kembali, bukan ditahan sampai akhir bulan. Untuk penyewa yang sudah beberapa kali menyewa, deposit sering kami ringankan.",
    onHome: true,
  },
  {
    question: "Apakah harga sudah termasuk BBM dan tol?",
    answer:
      "Belum. Untuk lepas kunci, unit diserahkan dengan isi bahan bakar tertentu dan dikembalikan pada level yang sama. Untuk paket dengan sopir, harga mencakup mobil dan sopir; BBM, tol, dan parkir ditanggung penyewa. Kami sebutkan ini di awal supaya tidak ada kejutan di akhir sewa.",
    onHome: true,
  },
  {
    question: "Bagaimana cara membayar DP?",
    answer:
      "Setelah tanggal dan unit disepakati lewat WhatsApp, kami kirimkan detail transfer atau QRIS. DP mengunci unit di tanggal tersebut, sisanya dilunasi saat serah terima. Tidak ada pembayaran lewat website ini — pembayaran selalu melalui admin.",
    onHome: true,
  },
  {
    question: "Bagaimana kebijakan pembatalan?",
    answer:
      "Pembatalan lebih dari 3x24 jam sebelum tanggal pakai, DP dikembalikan penuh. Kurang dari itu, DP menjadi kredit yang bisa dipakai untuk tanggal lain dalam 60 hari. Kami paham rencana bisa berubah, jadi selama Anda mengabari lebih awal, hampir selalu ada jalan keluar.",
  },
  {
    question: "Bagaimana hitungan overtime?",
    answer:
      "Untuk paket dengan sopir, satu paket berlaku 12 jam terhitung dari jam penjemputan. Kelebihan waktu dihitung per jam dan disepakati langsung dengan admin di hari itu juga, bukan ditagihkan diam-diam belakangan. Untuk lepas kunci, keterlambatan di bawah dua jam biasanya kami maklumi.",
  },
  {
    question: "Area mana saja yang dilayani?",
    answer:
      "Penjemputan dan pengantaran kami layani di seluruh Jabodetabek, dengan Tangerang Selatan dan Jakarta Selatan sebagai wilayah utama. Unit boleh dibawa ke luar kota — Bandung, Semarang, Yogyakarta, Solo, dan Surabaya paling sering — dengan pemberitahuan di awal supaya kami bisa menyiapkan unitnya.",
  },
  {
    question: "Kalau terjadi kerusakan atau kecelakaan, bagaimana?",
    answer:
      "Segera hubungi kami sebelum melakukan apa pun. Seluruh unit diasuransikan, dan untuk kerusakan yang tercakup polis, penyewa hanya menanggung own risk sesuai ketentuan asuransi. Kerusakan akibat kelalaian berat atau pelanggaran ketentuan sewa ditanggung penyewa. Yang penting, jangan memperbaiki sendiri di bengkel mana pun sebelum berbicara dengan kami.",
  },
  {
    question: "Bagaimana kalau unit terlambat dikembalikan?",
    answer:
      "Kabari kami secepatnya. Kalau unit tidak ada jadwal berikutnya, biasanya bisa kami perpanjang di tempat. Kalau sudah ada penyewa berikutnya, kami akan mencarikan solusi bersama. Keterlambatan tanpa kabar dikenakan biaya per jam sesuai ketentuan.",
  },
  {
    question: "Kalau sewa dengan sopir untuk luar kota, sopirnya menginap di mana?",
    answer:
      "Untuk perjalanan yang mengharuskan sopir bermalam, penyewa menyediakan penginapan dan makan sopir, atau memberi uang menginap yang besarannya kami sepakati di awal. Kami tidak menaikkan angka ini diam-diam; disebutkan sejak penawaran pertama.",
  },
  {
    question: "Apakah bisa menyewa lebih dari satu unit sekaligus?",
    answer:
      "Bisa, dan sering terjadi untuk acara keluarga besar atau kebutuhan kantor. Untuk tiga unit atau lebih, chat kami langsung supaya bisa kami cek ketersediaannya bersamaan dan berikan harga paket.",
  },
];

export const FAQ_HOME = FAQ.filter((f) => f.onHome);
