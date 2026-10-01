import { day, type Booking, type DemoData, type PhysicalUnit } from "./admin-demo";
export { availableUnit } from "./admin-demo";

export function ownerData(data: DemoData, ownerId: string): DemoData {
  const units = data.units.filter((u) => u.ownerId === ownerId);
  return {
    units, owners: data.owners.filter((o) => o.id === ownerId),
    vehicles: data.vehicles.filter((v) => units.some((u) => u.vehicle === v.slug)).map((v) => ({ ...v, unitCount: units.filter((u) => u.vehicle === v.slug).length, maintenance: units.filter((u) => u.vehicle === v.slug && data.units.filter((all) => all.vehicle === v.slug).slice(0, v.maintenance).some((all) => all.id === u.id)).length })),
    bookings: data.bookings.filter((b) => units.some((u) => u.id === b.unitId)).map((b) => ({ ...b, customer: "Pelanggan rental", phone: "", pickup: "", note: "", driver: null })),
    drivers: [], quotes: [],
  };
}

export function unitStatus(data: DemoData, unit: PhysicalUnit) {
  const bookings = data.bookings.filter((b) => b.unitId === unit.id);
  if (bookings.some((b) => b.status === "Berjalan")) return "Sedang Disewa";
  const model = data.vehicles.find((v) => v.slug === unit.vehicle);
  if (!model?.active || data.units.filter((u) => u.vehicle === unit.vehicle).slice(0, model.maintenance).some((u) => u.id === unit.id)) return "Perawatan";
  if (bookings.some((b) => b.status === "Dikonfirmasi" && b.end >= day(0))) return "Sudah Dibooking";
  return "Tersedia";
}

export function duration(b: Pick<Booking, "start" | "end">) {
  return Math.round((Date.parse(b.end) - Date.parse(b.start)) / 86400000) + 1;
}
export function ownerIncome(b: Booking) { return b.status === "Selesai" ? Math.round(b.value * (b.ownerRate ?? 0) / 100) : 0; }
export function monthKey(offset = 0) {
  const date = new Date(`${day(0).slice(0, 7)}-01T12:00:00Z`);
  date.setUTCMonth(date.getUTCMonth() + offset);
  return date.toISOString().slice(0, 7);
}
