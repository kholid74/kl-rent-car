export type BookingStatus = "Menunggu" | "Dikonfirmasi" | "Berjalan" | "Selesai" | "Batal";
export type Service = "Dengan sopir" | "Lepas kunci";
export type Booking = {
  unitId?: string;
  ownerRate?: number;
  code: string;
  customer: string;
  phone: string;
  vehicle: string;
  driver: string | null;
  service: Service;
  start: string;
  end: string;
  created: string;
  status: BookingStatus;
  pickup: string;
  value: number;
  note: string;
};
export type Driver = { id: string; name: string; phone: string; status: "Tersedia" | "Cuti"; experience: string };
export type Vehicle = { slug: string; name: string; category: string; seats: number; unitCount: number; maintenance: number; active: boolean; price: number; priceSelfDrive: number | null; image: string };
export type Quote = { code: string; customer: string; need: string; created: string; due: string; value: number; stage: "Baru" | "Ditindaklanjuti" | "Disepakati" | "Tidak jadi" };
export type Owner = { id: string; name: string; phone: string; share: number };
export type PhysicalUnit = { id: string; vehicle: string; plate: string; ownerId: string };
export type DemoData = { bookings: Booking[]; drivers: Driver[]; vehicles: Vehicle[]; quotes: Quote[]; owners: Owner[]; units: PhysicalUnit[] };
export const OWNERS: Owner[] = [
  { id: "budi", name: "Budi Santoso", phone: "6281200000301", share: 70 },
  { id: "andi", name: "Andi Wijaya", phone: "6281200000302", share: 75 },
  { id: "sari", name: "Sari Puspita", phone: "6281200000303", share: 70 },
];
export type FleetSource = { slug: string; name: string; category: string; seats: number; unitCount: number; priceWithDriver: number; priceSelfDrive: number | null };

const imageNames: Record<string, string> = {
  "honda-brio-satya": "card_brio.webp",
  "toyota-avanza": "card_avanza.webp",
  "daihatsu-xenia": "card_xenia.webp",
  "toyota-innova-reborn-diesel": "card_innova_reborn.webp",
  "toyota-innova-zenix-hybrid": "card_innova.webp",
  "toyota-fortuner": "card_fortuner.webp",
  "toyota-alphard": "card_alphard.webp",
  "toyota-hiace-commuter": "card_hiace.webp",
};

export function day(offset: number) {
  const parts = new Intl.DateTimeFormat("en-US", { timeZone: "Asia/Jakarta", year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(new Date());
  const part = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
  const date = new Date(Date.UTC(Number(part("year")), Number(part("month")) - 1, Number(part("day")) + offset));
  return date.toISOString().slice(0, 10);
}

export function formatDate(value: string) {
  return new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "short", year: "numeric" }).format(new Date(`${value}T12:00:00`));
}

export function money(value: number) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(value);
}

const names = ["Alya Putri", "Bima Santoso", "Citra Maharani", "Dimas Prakoso", "Elisa Rahma", "Fajar Hidayat", "Gita Lestari", "Hendra Wijaya", "Intan Permata", "Joko Pranoto", "Kirana Sari", "Luthfi Hakim"];
const locations = ["Pondok Indah, Jakarta Selatan", "Bintaro, Tangerang Selatan", "Menteng, Jakarta Pusat", "BSD, Tangerang Selatan", "Kuningan, Jakarta Selatan"];

export function createDemoData(fleet: FleetSource[]): DemoData {
  const vehicles: Vehicle[] = fleet.map((v) => ({
    slug: v.slug, name: v.name, category: v.category, seats: v.seats,
    unitCount: v.unitCount, maintenance: 0, active: true,
    price: v.priceWithDriver, priceSelfDrive: v.priceSelfDrive, image: `/images/manual/${imageNames[v.slug]}`,
  }));
  const drivers: Driver[] = [
    ["D-01", "Arif Prasetyo", "6281200000101", "7 tahun"],
    ["D-02", "Bagas Wirawan", "6281200000102", "9 tahun"],
    ["D-03", "Deni Kurniawan", "6281200000103", "5 tahun"],
    ["D-04", "Farhan Maulana", "6281200000104", "6 tahun"],
    ["D-05", "Rendra Saputra", "6281200000105", "11 tahun"],
    ["D-06", "Yoga Firmansyah", "6281200000106", "4 tahun"],
  ].map(([id, name, phone, experience]) => ({ id, name, phone, experience, status: "Tersedia" }));

  const bookings: Booking[] = Array.from({ length: 72 }, (_, i) => {
    const vehicle = vehicles[(i * 5 + 2) % vehicles.length];
    const offset = -178 + i * 2;
    const service: Service = i % 4 === 0 && vehicle.slug !== "toyota-alphard" && vehicle.slug !== "toyota-hiace-commuter" ? "Lepas kunci" : "Dengan sopir";
    return {
      code: `KL-26-${String(1001 + i)}`, customer: names[i % names.length], phone: `62812000${String(2000 + i % names.length)}`,
      vehicle: vehicle.slug, driver: service === "Dengan sopir" ? drivers[i % drivers.length].id : null,
      service, start: day(offset + 2), end: day(offset + 3 + (i % 3)), created: day(offset),
      status: i % 11 === 0 ? "Batal" : "Selesai", pickup: locations[i % locations.length],
      value: (service === "Lepas kunci" ? vehicle.priceSelfDrive ?? vehicle.price : vehicle.price) * (2 + (i % 3)), note: "Riwayat perjalanan contoh.",
    };
  });

  const current: Array<[number, number, number, BookingStatus, Service, number | null]> = [
    [-4, -1, 6, "Selesai", "Dengan sopir", 0],
    [-2, 0, 7, "Berjalan", "Dengan sopir", 1],
    [-1, 2, 2, "Berjalan", "Dengan sopir", 2],
    [0, 1, 3, "Dikonfirmasi", "Dengan sopir", 3],
    [1, 2, 5, "Dikonfirmasi", "Dengan sopir", 4],
    [2, 4, 4, "Dikonfirmasi", "Dengan sopir", 5],
    [3, 3, 6, "Menunggu", "Dengan sopir", null],
    [4, 6, 1, "Menunggu", "Lepas kunci", null],
    [5, 7, 0, "Menunggu", "Lepas kunci", null],
    [6, 8, 5, "Dikonfirmasi", "Dengan sopir", 0],
    [8, 10, 3, "Menunggu", "Dengan sopir", null],
    [9, 11, 7, "Dikonfirmasi", "Dengan sopir", 1],
    [12, 13, 2, "Batal", "Dengan sopir", null],
  ];
  current.forEach(([from, to, vehicleIndex, status, service, driverIndex], i) => {
    const vehicle = vehicles[vehicleIndex];
    bookings.push({
      code: `KL-26-${String(2001 + i)}`, customer: names[(i + 5) % names.length], phone: `62812000${String(2000 + (i + 5) % names.length)}`,
      vehicle: vehicle.slug, driver: driverIndex === null ? null : drivers[driverIndex].id,
      service, start: day(from), end: day(to), created: day(Math.min(from - 2, -i % 4)), status,
      pickup: locations[(i + 2) % locations.length], value: (service === "Lepas kunci" ? vehicle.priceSelfDrive ?? vehicle.price : vehicle.price) * (to - from + 1),
      note: i === 6 ? "Wedding car, dekorasi menyusul." : i === 10 ? "Perjalanan keluarga ke Bandung." : "Detail penjemputan dikonfirmasi bersama pelanggan.",
    });
  });

  const quotes: Quote[] = [
    { code: "PN-2601", customer: "PT Aruna Persada", need: "Kontrak bulanan · 2 Innova", created: day(-2), due: day(1), value: 22_000_000, stage: "Baru" },
    { code: "PN-2602", customer: "Nadia & Rizky", need: "Wedding car · Alphard", created: day(-8), due: day(2), value: 5_500_000, stage: "Ditindaklanjuti" },
    { code: "PN-2603", customer: "Sekretariat Acara", need: "Agenda resmi · Fortuner + sopir", created: day(-25), due: day(4), value: 7_500_000, stage: "Baru" },
    { code: "PN-2604", customer: "PT Sinar Laju", need: "Kontrak tahunan · Hiace", created: day(-110), due: day(8), value: 180_000_000, stage: "Disepakati" },
  ];
  const units = vehicles.flatMap((v, i) => Array.from({ length: v.unitCount }, (_, j) => ({
    id: `${v.slug}-${j + 1}`, vehicle: v.slug, plate: `B ${1201 + i * 100 + j} ${["SNT", "WJA", "PSP"][(i + j) % 3]}`, ownerId: OWNERS[(i + j) % 3].id,
  })));
  // Recent completed trips make month-to-month income visible, including on the first day.
  units.forEach((unit, i) => {
    for (let month = 0; month < 6; month++) {
      const date = new Date(`${day(0).slice(0, 7)}-01T12:00:00Z`);
      date.setUTCMonth(date.getUTCMonth() - month);
      const end = date.toISOString().slice(0, 10);
      if (bookings.some((b) => b.vehicle === unit.vehicle && b.start <= end && b.end >= end && b.status !== "Batal")) continue;
      const v = vehicles.find((v) => v.slug === unit.vehicle)!;
      bookings.push({ code: `KL-R-${i}-${month}`, customer: names[i % names.length], phone: `62812000${2000 + i % names.length}`, vehicle: v.slug, unitId: unit.id, driver: null, service: "Dengan sopir", start: end, end, created: end, status: "Selesai", pickup: locations[i % locations.length], value: v.price, note: "Perjalanan contoh selesai; pembayaran tercatat dalam simulasi." });
    }
  });
  bookings.forEach((b, i) => {
    b.unitId ??= units.filter((u) => u.vehicle === b.vehicle)[i % units.filter((u) => u.vehicle === b.vehicle).length].id;
    b.ownerRate = OWNERS.find((o) => o.id === units.find((u) => u.id === b.unitId)!.ownerId)!.share;
  });
  return { bookings, drivers, vehicles, quotes, units, owners: OWNERS };
}

export const BOOKING_STATUSES: BookingStatus[] = ["Menunggu", "Dikonfirmasi", "Berjalan", "Selesai", "Batal"];

export function overlaps(a: Booking, start: string, end: string) {
  return a.start <= end && a.end >= start && a.status !== "Batal" && a.status !== "Selesai";
}

export function driverAvailable(bookings: Booking[], driverId: string, start: string, end: string, except?: string) {
  return !bookings.some((b) => b.code !== except && b.driver === driverId && overlaps(b, start, end));
}

export function vehicleAvailable(data: DemoData, slug: string, start: string, end: string, except?: string) {
  return Boolean(availableUnit(data, slug, start, end, except));
}

export function availableUnit(data: DemoData, slug: string, start: string, end: string, except?: string) {
  const vehicle = data.vehicles.find((v) => v.slug === slug);
  if (!vehicle?.active) return undefined;
  return data.units.filter((u) => u.vehicle === slug).slice(vehicle.maintenance).find((u) =>
    !data.bookings.some((b) => b.code !== except && b.unitId === u.id && overlaps(b, start, end)));
}
