import { randomInt } from "node:crypto";

/**
 * Huruf dan angka yang mudah tertukar dibuang: 0/O, 1/I/L. Kode ini dibacakan
 * lewat telepon dan diketik ulang di WhatsApp, jadi salah baca satu karakter
 * berarti pelanggan gagal menemukan bookingnya.
 */
const ALPHABET = "23456789ABCDEFGHJKMNPQRSTUVWXYZ";
const LENGTH = 8;

export const BOOKING_CODE_PATTERN = new RegExp(`^KL-[${ALPHABET}]{${LENGTH}}$`);

/**
 * Halaman status booking bisa diakses siapa saja yang memegang kodenya, jadi
 * kode harus sulit ditebak — 31^8 kemungkinan, diambil dari CSPRNG, bukan
 * Math.random().
 */
export function generateBookingCode(): string {
  let out = "";
  for (let i = 0; i < LENGTH; i++) {
    out += ALPHABET[randomInt(ALPHABET.length)];
  }
  return `KL-${out}`;
}
