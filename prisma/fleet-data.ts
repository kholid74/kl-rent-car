/**
 * Sumber tunggal data armada. Dibaca oleh prisma/seed.ts dan oleh
 * scripts/generate-vehicle-images.ts, supaya nama unit di gambar tidak pernah
 * melenceng dari nama unit di database.
 *
 * Tipe ditulis sebagai union literal, bukan impor enum Prisma, agar file ini
 * tetap bisa dibaca sebelum `prisma generate` pernah dijalankan.
 */

export type VehicleCategory = "LCGC" | "MPV" | "SUV" | "PREMIUM" | "MINIBUS";
export type Transmission = "MANUAL" | "MATIC";

export type FleetUnit = {
  slug: string;
  name: string;
  brand: string;
  model: string;
  year: number;
  category: VehicleCategory;
  seats: number;
  luggage: number;
  transmission: Transmission;
  fuel: string;
  engineCc: number;
  /** Jumlah mobil fisik. Total seluruh armada harus >= 25 — hero mengklaim "25+ unit". */
  unitCount: number;
  /** null = unit ini tidak pernah disewakan tanpa sopir. Lihat CONTEXT.md. */
  priceSelfDrive: number | null;
  /** Tarif paket 12 jam. */
  priceWithDriver: number;
  /** null = dinegosiasikan lewat penawaran. */
  priceMonthly: number | null;
  facilities: string[];
  description: string;
};

export const FLEET: FleetUnit[] = [
  {
    slug: "honda-brio-satya",
    name: "Honda Brio Satya",
    brand: "Honda",
    model: "Brio Satya E CVT",
    year: 2023,
    category: "LCGC",
    seats: 5,
    luggage: 2,
    transmission: "MATIC",
    fuel: "Bensin",
    engineCc: 1199,
    unitCount: 4,
    priceSelfDrive: 300_000,
    priceWithDriver: 650_000,
    priceMonthly: 5_500_000,
    facilities: ["AC Dingin", "Audio Bluetooth", "Kamera Mundur", "USB Charger", "Ban Baru"],
    description:
      "Brio adalah unit yang paling sering keluar-masuk garasi kami, dan alasannya selalu sama: gampang dibawa ke mana saja. Bodinya pendek, radius putarnya kecil, jadi gang sempit di Bintaro atau parkiran basement mal yang antre panjang bukan masalah. Transmisi CVT bikin kaki kanan tidak cepat lelah waktu terjebak di Fatmawati jam enam sore.\n\nKonsumsi bahan bakarnya paling irit di antara seluruh armada kami. Pemakaian dalam kota rata-rata mendekati 15 km per liter kalau gaya menyetirnya kalem, dan untuk perjalanan Jabodetabek sehari penuh satu tangki biasanya masih bersisa saat unit kembali.\n\nCocok untuk pasangan muda, sales yang keliling klien, atau siapa pun yang butuh mobil sendiri selama beberapa hari tanpa mengeluarkan biaya besar. Kalau rombongan Anda lebih dari empat orang dengan koper, kami sarankan naik ke Avanza atau Xenia. Brio muat lima kursi, tapi bagasinya realistis untuk dua koper kabin.",
  },
  {
    slug: "toyota-avanza",
    name: "Toyota Avanza",
    brand: "Toyota",
    model: "Avanza 1.3 G MT",
    year: 2022,
    category: "MPV",
    seats: 7,
    luggage: 3,
    transmission: "MANUAL",
    fuel: "Bensin",
    engineCc: 1329,
    unitCount: 5,
    priceSelfDrive: 350_000,
    priceWithDriver: 700_000,
    priceMonthly: 6_000_000,
    facilities: ["AC Double Blower", "Audio Bluetooth", "Kamera Mundur", "Power Window", "Karpet Karet"],
    description:
      "Avanza sudah lama jadi standar tidak resmi mobil keluarga Indonesia, dan armada kami menyimpan lima unit karena permintaannya memang tidak pernah surut. AC double blower-nya membuat penumpang baris ketiga tidak jadi korban, hal kecil yang baru terasa penting waktu terjebak macet di tol Jagorawi siang hari.\n\nUnit kami transmisi manual. Sebagian penyewa justru mencarinya, terutama untuk perjalanan luar kota lewat jalur pegunungan, karena engine brake lebih bisa diandalkan saat turunan panjang. Kalau Anda lebih nyaman matic, Xenia kami ada di harga yang persis sama.\n\nBaris ketiga bisa dilipat rata untuk memuat barang besar. Dengan formasi lima penumpang, bagasi cukup untuk tiga koper besar plus tas jinjing. Itu konfigurasi yang paling sering dipakai penyewa saat mudik.",
  },
  {
    slug: "daihatsu-xenia",
    name: "Daihatsu Xenia",
    brand: "Daihatsu",
    model: "Xenia 1.5 R CVT",
    year: 2023,
    category: "MPV",
    seats: 7,
    luggage: 3,
    transmission: "MATIC",
    fuel: "Bensin",
    engineCc: 1496,
    unitCount: 4,
    priceSelfDrive: 350_000,
    priceWithDriver: 700_000,
    priceMonthly: 6_000_000,
    facilities: ["AC Double Blower", "Head Unit Layar Sentuh", "Kamera Mundur", "Sensor Parkir", "USB Charger"],
    description:
      "Xenia generasi terbaru sudah pindah ke penggerak roda depan, dan bedanya terasa jelas di jalan basah: lebih stabil, lebih tenang di kecepatan tol. Mesin 1.5 liter dengan CVT membuatnya tidak kehabisan tenaga saat tujuh kursi terisi penuh dan bagasi ikut penuh.\n\nKami menempatkan Xenia sebagai pilihan matic untuk penyewa yang butuh tujuh kursi tapi belum perlu naik ke kelas Innova. Head unit layar sentuhnya menerima Android Auto dan Apple CarPlay, jadi navigasi tinggal colok tanpa ribut soal dudukan ponsel.\n\nSering diambil untuk acara keluarga dalam kota, jemput tamu dari luar kota, atau perjalanan akhir pekan ke Bandung dan Puncak. Untuk rute pegunungan dengan tujuh penumpang dewasa, Innova Reborn diesel kami memberi tarikan yang jauh lebih santai.",
  },
  {
    slug: "toyota-innova-reborn-diesel",
    name: "Toyota Innova Reborn (Diesel)",
    brand: "Toyota",
    model: "Kijang Innova 2.4 G AT Diesel",
    year: 2022,
    category: "MPV",
    seats: 7,
    luggage: 4,
    transmission: "MATIC",
    fuel: "Diesel",
    engineCc: 2393,
    unitCount: 4,
    priceSelfDrive: 600_000,
    priceWithDriver: 950_000,
    priceMonthly: 10_500_000,
    facilities: [
      "AC Double Blower",
      "Kursi Kulit",
      "Head Unit Layar Sentuh",
      "Kamera Mundur",
      "Captain Seat",
      "Sandaran Tangan",
    ],
    description:
      "Kalau ada satu unit yang paling sering dipesan untuk perjalanan jauh, ini orangnya. Mesin diesel 2.4 liter punya torsi besar di putaran rendah, yang artinya tanjakan panjang di tol Cipularang atau Semarang-Solo dilalui tanpa mesin meraung. Konsumsi solarnya pun tetap masuk akal untuk jarak ratusan kilometer.\n\nKabinnya tinggi dan lapang, kursi baris kedua model captain seat dengan sandaran tangan, jadi penumpang bisa benar-benar tidur di perjalanan malam. Suspensinya memang lebih empuk daripada presisi, memantul sedikit di jalan bergelombang, tapi itu justru yang membuat penumpang belakang tidak cepat pegal.\n\nUnit ini yang paling banyak diambil untuk mudik, antar-jemput tamu perusahaan, dan perjalanan dinas luar kota. Kalau Anda ingin kabin yang lebih senyap dan konsumsi bahan bakar lebih irit lagi, lihat Innova Zenix Hybrid kami.",
  },
  {
    slug: "toyota-innova-zenix-hybrid",
    name: "Toyota Innova Zenix Hybrid",
    brand: "Toyota",
    model: "Kijang Innova Zenix 2.0 HV",
    year: 2024,
    category: "MPV",
    seats: 7,
    luggage: 4,
    transmission: "MATIC",
    fuel: "Bensin (Hybrid)",
    engineCc: 1987,
    unitCount: 3,
    priceSelfDrive: 750_000,
    priceWithDriver: 1_100_000,
    priceMonthly: 13_000_000,
    facilities: [
      "AC Digital Double Blower",
      "Kursi Kulit",
      "Panoramic Roof",
      "Head Unit 10 Inci",
      "Kamera 360",
      "Power Back Door",
    ],
    description:
      "Zenix adalah Innova yang pindah rumah: penggerak roda depan, sasis monokok, dan sistem hybrid yang membuat mobil bergerak diam-diam pakai motor listrik saat merayap di kemacetan. Di dalam kota, itu berarti kabin yang jauh lebih senyap daripada Reborn diesel, dan konsumsi bensin yang sering menyentuh angka 18 km per liter.\n\nInteriornya satu tingkat di atas kelasnya: panoramic roof, layar 10 inci, kamera 360 yang sangat membantu saat memundurkan mobil sepanjang ini ke parkiran sempit. Kursi baris kedua tetap captain seat, tapi bantalannya lebih tebal dan sudut rebahnya lebih dalam.\n\nKami menyarankan Zenix untuk menjemput tamu penting, acara kantor, atau perjalanan keluarga yang ingin senyap tanpa naik ke harga Alphard. Untuk medan berat atau jalan rusak, Fortuner tetap pilihan yang lebih tepat karena ground clearance-nya jauh lebih tinggi.",
  },
  {
    slug: "toyota-fortuner",
    name: "Toyota Fortuner",
    brand: "Toyota",
    model: "Fortuner 2.8 VRZ 4x2 AT",
    year: 2023,
    category: "SUV",
    seats: 7,
    luggage: 4,
    transmission: "MATIC",
    fuel: "Diesel",
    engineCc: 2755,
    unitCount: 3,
    priceSelfDrive: 1_100_000,
    priceWithDriver: 1_500_000,
    priceMonthly: null,
    facilities: [
      "AC Double Blower",
      "Kursi Kulit",
      "Power Seat",
      "Head Unit Layar Sentuh",
      "Kamera Mundur",
      "Ground Clearance Tinggi",
    ],
    description:
      "Fortuner diambil orang karena dua alasan yang jarang berbarengan: wibawa di depan lobi kantor, dan kemampuan melewati jalan yang tidak diaspal rapi. Ground clearance-nya membuat genangan setinggi betis di musim hujan tidak jadi drama, dan mesin diesel 2.8 liter punya tenaga berlebih untuk tanjakan curam meski tujuh kursi terisi.\n\nPosisi duduknya tinggi, pandangan ke depan luas. Banyak penyewa bilang justru itu yang bikin lelah berkurang di perjalanan panjang. Bodinya besar, jadi untuk lepas kunci kami menyarankan penyewa yang sudah terbiasa dengan dimensi SUV, terutama saat parkir paralel.\n\nSering dipakai untuk kunjungan proyek, perjalanan dinas ke daerah, dan acara keluarga yang butuh kesan formal. Tarif bulanan Fortuner kami tentukan lewat penawaran karena sangat bergantung pada rute dan jarak tempuh. Hubungi kami lewat WhatsApp untuk angkanya.",
  },
  {
    slug: "toyota-alphard",
    name: "Toyota Alphard",
    brand: "Toyota",
    model: "Alphard 2.5 G",
    year: 2023,
    category: "PREMIUM",
    seats: 7,
    luggage: 4,
    transmission: "MATIC",
    fuel: "Bensin",
    engineCc: 2494,
    unitCount: 1,
    priceSelfDrive: null,
    priceWithDriver: 2_500_000,
    priceMonthly: null,
    facilities: [
      "Captain Seat Ottoman",
      "AC Tiga Zona",
      "Pintu Geser Elektrik",
      "Peredam Kabin",
      "Sunroof",
      "Air Purifier",
    ],
    description:
      "Alphard adalah unit yang kami sewakan hanya dengan sopir, dan itu keputusan yang disengaja. Mobil ini dipesan untuk momen yang tidak boleh meleset: menjemput tamu kehormatan, mengantar pengantin, membawa direksi keliling agenda seharian. Momen seperti itu butuh orang di balik kemudi yang tahu betul mobilnya.\n\nBaris kedua adalah alasan orang membayar harga ini. Captain seat dengan ottoman yang bisa direbahkan hampir rata, sandaran tangan di kedua sisi, dan peredaman kabin yang membuat suara tol nyaris hilang. Pintu gesernya elektrik, jadi penumpang tidak perlu berjuang membuka pintu di depan banyak mata.\n\nKami hanya punya satu unit Alphard, sehingga tanggalnya cepat terisi terutama di musim pernikahan. Kalau tanggal yang Anda inginkan sudah penuh, chat kami. Biasanya masih ada jalan keluar lewat rekanan yang kami percaya.",
  },
  {
    slug: "toyota-hiace-commuter",
    name: "Toyota Hiace Commuter",
    brand: "Toyota",
    model: "Hiace Commuter 2.8 MT",
    year: 2022,
    category: "MINIBUS",
    seats: 15,
    luggage: 8,
    transmission: "MANUAL",
    fuel: "Diesel",
    engineCc: 2755,
    unitCount: 2,
    priceSelfDrive: null,
    priceWithDriver: 1_400_000,
    priceMonthly: null,
    facilities: [
      "AC Blower Sepanjang Kabin",
      "Kursi Reclining",
      "Bagasi Belakang Luas",
      "Audio Bluetooth",
      "Pintu Geser Lebar",
    ],
    description:
      "Hiace kami sewakan dengan sopir saja, karena kendaraan sepanjang ini menuntut kebiasaan yang berbeda: titik buta lebih besar, jarak pengereman lebih panjang, dan manuver di gang perumahan butuh perhitungan. Sopir kami sudah terbiasa membawanya dalam perjalanan panjang.\n\nLima belas kursi dengan sandaran yang bisa direbahkan, blower AC memanjang di plafon sehingga penumpang paling belakang tidak kepanasan, dan ruang bagasi di belakang kursi terakhir yang muat belasan tas. Untuk rombongan yang bawa banyak barang, ini jauh lebih masuk akal daripada menyewa dua MPV sekaligus.\n\nPaling sering dipesan untuk study tour sekolah, ziarah, acara keluarga besar, dan antar-jemput karyawan. Untuk rombongan lebih dari lima belas orang, kami biasa menggabungkan Hiace dengan satu Innova. Chat kami untuk hitungannya.",
  },
];

/** Jumlah mobil fisik seluruh armada. Mendasari copy "25+ unit" di hero dan Tentang Kami. */
export const TOTAL_PHYSICAL_UNITS = FLEET.reduce((n, u) => n + u.unitCount, 0);

/** Berapa gambar yang dibuat per unit. Menentukan panjang array images di seed. */
export const IMAGES_PER_UNIT = 3;

export function imagePaths(slug: string): string[] {
  return Array.from({ length: IMAGES_PER_UNIT }, (_, i) => `/images/armada/${slug}-${i + 1}.svg`);
}
