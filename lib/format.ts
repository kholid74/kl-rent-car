/**
 * Harga selalu bilangan bulat rupiah. Ditulis tanpa ", 00" karena tidak ada
 * harga sewa yang memakai sen, dan digit tambahan hanya membuat angka besar
 * makin sulit dibaca sekilas di kartu armada.
 */
const rupiah = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
});

export function formatRupiah(value: number): string {
  return rupiah.format(value);
}

const longDate = new Intl.DateTimeFormat("id-ID", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "Asia/Jakarta",
});

const shortDate = new Intl.DateTimeFormat("id-ID", {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "Asia/Jakarta",
});

/**
 * Tanggal disimpan sebagai tengah malam WIB. Memformatnya dengan zona waktu
 * peramban akan menggeser tanggal satu hari untuk pengunjung di luar WIB —
 * karena itu zona dipatok, bukan dibiarkan mengikuti perangkat.
 */
export function formatDateLong(d: Date): string {
  return longDate.format(d);
}

export function formatDateShort(d: Date): string {
  return shortDate.format(d);
}

/** Jumlah hari sewa, inklusif: ambil pagi ini dan kembalikan besok = 2 hari. */
export function rentalDays(start: Date, end: Date): number {
  const ms = end.getTime() - start.getTime();
  return Math.max(1, Math.round(ms / 86_400_000) + 1);
}

/**
 * Nomor pelanggan tidak pernah ditampilkan utuh di halaman publik — halaman
 * status booking bisa dibuka siapa pun yang memegang kodenya.
 */
export function maskPhone(phone: string): string {
  if (phone.length < 7) return "••••";
  return `${phone.slice(0, 5)}••••${phone.slice(-3)}`;
}
