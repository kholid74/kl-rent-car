/**
 * Empat nilai jual. Sengaja ditulis sebagai janji yang bisa dicek pengunjung,
 * bukan superlatif kosong seperti "terpercaya nomor 1" — klaim yang tidak bisa
 * dibantah juga tidak bisa dipercaya.
 */

export type ValueProp = {
  title: string;
  body: string;
};

export const WHY_US: ValueProp[] = [
  {
    title: "Harga tercantum, bukan harga rahasia",
    body: "Tarif setiap unit ada di halaman harga, lengkap dengan apa yang belum termasuk. Anda tahu angkanya sebelum mengirim pesan pertama.",
  },
  {
    title: "Unit terawat dan difoto apa adanya",
    body: "Servis berkala dilakukan sesuai jadwal pabrikan, dan foto yang Anda lihat adalah kondisi unit sekarang — bukan foto katalog dari pabrikan.",
  },
  {
    title: "Balasan WhatsApp di bawah 5 menit",
    body: "Selama jam layanan 08.00 sampai 21.00, pesan Anda dibaca dan dibalas manusia, bukan bot yang menyuruh menunggu.",
  },
  {
    title: "Sopir berpengalaman dan tahu diri",
    body: "Sopir kami hafal Jabodetabek, mengerti kapan perlu bicara dan kapan sebaiknya diam, dan datang tepat waktu tanpa perlu ditelepon dua kali.",
  },
];

/** Tiga langkah booking. Hanya dipakai Home, tapi ditaruh di sini agar redaksinya konsisten kalau nanti dipakai halaman lain. */
export const BOOKING_STEPS = [
  {
    title: "Pilih unit dan tanggal",
    body: "Telusuri armada, bandingkan harga, dan tentukan tanggal pakai beserta lokasi penjemputan.",
  },
  {
    title: "Chat WhatsApp atau isi form booking",
    body: "Kirim pesan yang sudah terisi otomatis, atau isi form di situs ini untuk mendapat kode booking.",
  },
  {
    title: "DP dan konfirmasi, unit siap",
    body: "Admin mengonfirmasi ketersediaan dan mengirim detail pembayaran. Setelah DP masuk, unit dikunci untuk tanggal Anda.",
  },
] as const;
