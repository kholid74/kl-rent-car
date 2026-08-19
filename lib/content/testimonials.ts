/**
 * Enam testimoni. Seluruhnya karangan — footer situs menyatakan itu secara
 * terbuka, dan tidak ada satu pun yang boleh diklaim sebagai ulasan nyata.
 *
 * `city` dipakai halaman lokasi untuk menampilkan testimoni yang berbeda per
 * kota; nilai null berarti boleh muncul di mana saja.
 */

export type Testimonial = {
  name: string;
  /** Konteks pemakaian — yang membuat testimoni terdengar seperti orang, bukan slogan. */
  context: string;
  quote: string;
  rating: 4 | 5;
  city: "jakarta-selatan" | "tangerang-selatan" | null;
};

export const TESTIMONIALS: Testimonial[] = [
  {
    name: "Andri Kurniawan",
    context: "Sewa Innova Reborn untuk mudik ke Solo",
    quote:
      "Berangkat malam bersama tiga anak, dan yang paling saya syukuri mobilnya bersih dan ban semuanya baru. Sopirnya tahu kapan harus berhenti tanpa saya minta.",
    rating: 5,
    city: null,
  },
  {
    name: "Ratna Puspitasari",
    context: "Sewa Brio lepas kunci 4 hari",
    quote:
      "Harga yang disebut di WhatsApp sama persis dengan yang saya bayar. Tidak ada biaya tambahan yang tiba-tiba muncul waktu serah terima.",
    rating: 5,
    city: "tangerang-selatan",
  },
  {
    name: "Bimo Nugroho",
    context: "Sewa Alphard untuk menjemput klien dari Jepang",
    quote:
      "Unitnya datang setengah jam sebelum jadwal, sopir berpakaian rapi dan diam saat memang harus diam. Klien saya sempat mengira itu mobil kantor kami sendiri.",
    rating: 5,
    city: "jakarta-selatan",
  },
  {
    name: "Lestari Wulandari",
    context: "Sewa Xenia untuk acara keluarga di Bogor",
    quote:
      "Booking mendadak Sabtu pagi, dan masih dapat unit. Balasan WhatsApp-nya cepat sekali, tidak sampai lima menit.",
    rating: 4,
    city: "tangerang-selatan",
  },
  {
    name: "Fajar Alamsyah",
    context: "Rental bulanan Avanza untuk penugasan kantor",
    quote:
      "Sudah bulan keempat dan tidak pernah ada masalah. Servis rutin diurus mereka, saya tinggal pakai.",
    rating: 5,
    city: "jakarta-selatan",
  },
  {
    name: "Sinta Maharani",
    context: "Sewa Hiace untuk study tour sekolah",
    quote:
      "Lima belas anak plus barang bawaan masuk semua tanpa berdesakan. AC-nya dingin sampai kursi paling belakang, ini yang biasanya jadi keluhan.",
    rating: 4,
    city: null,
  },
];

export function testimonialsForCity(city: "jakarta-selatan" | "tangerang-selatan"): Testimonial[] {
  return TESTIMONIALS.filter((t) => t.city === city);
}
