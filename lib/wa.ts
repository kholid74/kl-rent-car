import { SITE_URL, WA_NUMBER } from "./site";

/**
 * WhatsApp adalah kanal konversi utama situs ini (lihat ADR 0002), jadi setiap
 * tombol harus membuka chat yang pesannya sudah setengah terisi. Pelanggan yang
 * tinggal melengkapi tanggal jauh lebih mungkin mengirim daripada pelanggan yang
 * disodori kolom kosong.
 *
 * Baris isian sengaja dibiarkan kosong setelah titik dua — itu memberi tahu
 * pelanggan informasi apa yang admin butuhkan tanpa memaksa mereka mengarang
 * format sendiri.
 */
export type WaContext =
  | { kind: "umum"; path?: string }
  | { kind: "unit"; unitName: string }
  | { kind: "dengan-sopir" }
  | { kind: "bulanan"; unitName?: string }
  | { kind: "corporate" }
  | { kind: "booking"; code: string }
  | { kind: "pelanggan"; code: string; customerName: string };

function message(ctx: WaContext): string {
  switch (ctx.kind) {
    case "unit":
      return [
        `Halo KL Rent Car, saya ingin sewa ${ctx.unitName}.`,
        "Tanggal pakai: ",
        "Durasi: ",
        "Lepas kunci / dengan sopir: ",
        "Lokasi jemput: ",
        "Mohon info harga & ketersediaan. Terima kasih.",
      ].join("\n");

    case "dengan-sopir":
      return [
        "Halo KL Rent Car, saya ingin sewa mobil dengan sopir.",
        "Tanggal pakai: ",
        "Jam mulai: ",
        "Rute / tujuan: ",
        "Jumlah penumpang: ",
        "Lokasi jemput: ",
        "Mohon info harga & ketersediaan. Terima kasih.",
      ].join("\n");

    case "bulanan":
      return [
        `Halo KL Rent Car, saya ingin menanyakan rental bulanan${
          ctx.unitName ? ` untuk ${ctx.unitName}` : ""
        }.`,
        "Durasi (bulan): ",
        "Mulai tanggal: ",
        "Lepas kunci / dengan sopir: ",
        "Wilayah pemakaian: ",
        "Mohon dibantu penawarannya. Terima kasih.",
      ].join("\n");

    case "corporate":
      return [
        "Halo KL Rent Car, saya ingin menanyakan kerja sama rental korporat.",
        "Nama perusahaan: ",
        "Jumlah unit: ",
        "Durasi kontrak: ",
        "Kebutuhan sopir: ",
        "Butuh invoice & NPWP: ",
        "Mohon dibantu penawarannya. Terima kasih.",
      ].join("\n");

    case "booking":
      return `Halo, saya sudah booking via website. Kode: ${ctx.code}. Mohon konfirmasi ketersediaan. Terima kasih.`;

    case "pelanggan":
      return `Halo ${ctx.customerName}, ini admin KL Rent Car mengenai booking ${ctx.code}.`;

    case "umum":
      return [
        "Halo KL Rent Car, saya ingin menanyakan ketersediaan mobil.",
        "Tanggal pakai: ",
        "Durasi: ",
        "Lepas kunci / dengan sopir: ",
        ctx.path ? `\nHalaman: ${SITE_URL}${ctx.path}` : "",
        "\nTerima kasih.",
      ]
        .filter(Boolean)
        .join("\n");
  }
}

/**
 * @param to nomor tujuan; default nomor KL Rent Car. Admin memakai parameter ini
 *   untuk menghubungi nomor pelanggan.
 */
export function buildWaLink(ctx: WaContext, to: string = WA_NUMBER): string {
  return `https://wa.me/${to}?text=${encodeURIComponent(message(ctx))}`;
}
