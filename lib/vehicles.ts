import type { VehicleCardData } from "@/components/VehicleCard";
import { db } from "./db";

/**
 * Field yang dibutuhkan kartu armada, tidak lebih. Dipusatkan di sini supaya
 * select yang sama tidak disalin ke Home, katalog, halaman lokasi, dan blok unit
 * terkait — dan supaya menambah satu field ke kartu cukup diubah di satu tempat.
 */
export const vehicleCardSelect = {
  slug: true,
  name: true,
  seats: true,
  transmission: true,
  fuel: true,
  priceSelfDrive: true,
  priceWithDriver: true,
  images: true,
} as const;

/**
 * Unit nonaktif tidak pernah muncul di sisi publik. Filter itu ada di sini, bukan
 * di tiap pemanggil, supaya satu halaman yang lupa memfilternya tidak mungkin
 * terjadi.
 */
export async function listVehicleCards(options?: {
  take?: number;
  category?: string;
  excludeSlug?: string;
}): Promise<VehicleCardData[]> {
  return db.vehicle.findMany({
    where: {
      isActive: true,
      ...(options?.category ? { category: options.category as never } : {}),
      ...(options?.excludeSlug ? { slug: { not: options.excludeSlug } } : {}),
    },
    orderBy: { priceWithDriver: "asc" },
    take: options?.take,
    select: vehicleCardSelect,
  });
}
