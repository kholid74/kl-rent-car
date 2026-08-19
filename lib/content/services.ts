/**
 * Empat layanan yang ditawarkan. Antar-jemput bandara pernah ada di spec dan
 * sudah dibuang dari produk.
 *
 * Dua layanan terakhir berbasis penawaran dan tidak punya harga terbuka; CTA-nya
 * mengarah ke WhatsApp dengan template berisi baris isian, bukan ke form —
 * alasannya di ADR 0002.
 */

export type Service = {
  slug: "lepas-kunci" | "dengan-sopir" | "rental-bulanan" | "corporate";
  title: string;
  /** Satu kalimat untuk kartu di Home dan index layanan. */
  summary: string;
  /** Ditampilkan di kartu sebagai penanda harga. */
  priceHint: string;
  forWho: string;
};

export const SERVICES: Service[] = [
  {
    slug: "lepas-kunci",
    title: "Rental Lepas Kunci",
    summary:
      "Anda yang menyetir, kami yang menyiapkan mobilnya. Cocok untuk yang sudah hafal jalan dan ingin bebas mengatur jadwal sendiri.",
    priceHint: "Mulai Rp300.000 / hari",
    forWho: "Penyewa ber-SIM A yang siap meninggalkan deposit",
  },
  {
    slug: "dengan-sopir",
    title: "Rental Dengan Sopir",
    summary:
      "Paket 12 jam bersama sopir yang hafal Jabodetabek. Anda tinggal duduk, urusan macet dan parkir bukan lagi masalah Anda.",
    priceHint: "Mulai Rp650.000 / 12 jam",
    forWho: "Tamu luar kota, acara keluarga, dan agenda kantor seharian",
  },
  {
    slug: "rental-bulanan",
    title: "Rental Bulanan",
    summary:
      "Satu unit dipegang penuh selama sebulan atau lebih, dengan tarif jauh di bawah hitungan harian.",
    priceHint: "Mulai Rp5.500.000 / bulan",
    forWho: "Penugasan kerja, keluarga pindahan, dan proyek berdurasi panjang",
  },
  {
    slug: "corporate",
    title: "Rental Korporat",
    summary:
      "Kontrak beberapa unit sekaligus dengan invoice dan NPWP, disesuaikan kebutuhan operasional perusahaan Anda.",
    priceHint: "Berdasarkan penawaran",
    forWho: "Perusahaan yang butuh armada rutin dan administrasi rapi",
  },
];
