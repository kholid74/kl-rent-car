/**
 * Identitas dan NAP (Name, Address, Phone) KL Rent Car.
 *
 * Seluruh data di sini fiktif — lihat CONTEXT.md. Alamat sengaja dibuat masuk
 * akal tapi bukan milik pihak mana pun.
 */

export const SITE = {
  name: "KL Rent Car",
  legalName: "PT Karya Laju Transportasi",
  tagline: "Rental Mobil Jakarta & Tangerang Selatan — Terawat, Transparan, Tepat Waktu",
  foundedYear: 2016,
  email: "halo@klrentcar.demo",
  address: {
    street: "Jl. Raya Serpong No. 88, Ruko Sutera Niaga Blok C-12",
    locality: "Serpong, Tangerang Selatan",
    region: "Banten",
    postalCode: "15310",
    country: "ID",
  },
  hours: { open: "08.00", close: "21.00" },
  /** Ditampilkan sebagai label demo, bukan agregat ulasan sungguhan. */
  rating: 4.8,
} as const;

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

/** Nomor tujuan seluruh tombol WhatsApp. Format 62xxx. */
export const WA_NUMBER = process.env.NEXT_PUBLIC_WA_NUMBER ?? "6281200000000";

/** true memasang noindex dan menampilkan banner demo. */
export const DEMO_MODE = process.env.NEXT_PUBLIC_DEMO_MODE !== "false";

export const AREAS = [
  "Tangerang Selatan",
  "Jakarta Selatan",
  "Jakarta Pusat",
  "Jakarta Barat",
  "Tangerang",
  "Depok",
  "Bekasi",
  "Bogor",
] as const;
