"use server";

import { randomUUID } from "node:crypto";
import { redirect } from "next/navigation";
import { z } from "zod";
import { clearAdminSession, getAdminSession } from "@/lib/admin-auth";
import { getDemoSession, setDemoSession } from "@/lib/demo-session";
import { DemoConflictError, readDemo, revision, SHOWCASE_WORKSPACE, writeDemo } from "@/lib/demo-store";
import { BOOKING_STATUSES, createDemoData, day, overlaps, type DemoData } from "@/lib/admin-demo";
import { availableUnit, duration } from "@/lib/ownership";
import { FLEET } from "@/prisma/fleet-data";

const text = z.string().trim().min(1).max(300);
const date = z.iso.date();
const amount = z.number().int().min(0).max(1_000_000_000);
const bookings = z.array(z.object({
  code: text, customer: text, phone: z.string().regex(/^\+?\d{9,15}$/), vehicle: text,
  unitId: text.optional(), ownerRate: z.number().optional(), driver: text.nullable(),
  service: z.enum(["Dengan sopir", "Lepas kunci"]), start: date, end: date, created: date,
  status: z.enum(BOOKING_STATUSES), pickup: text, value: amount, note: z.string().max(2000),
}).refine((b) => b.start <= b.end && duration(b) <= 366, "Periode sewa tidak valid.")).max(2000);
const demoInput = z.object({
  bookings,
  vehicles: z.array(z.object({ slug: text, name: text, category: text, seats: z.number().int().positive(), unitCount: z.number().int().positive(), maintenance: z.number().int().min(0), active: z.boolean(), price: amount, priceSelfDrive: amount.nullable(), image: text })),
  drivers: z.array(z.object({ id: text, name: text, phone: text, status: z.enum(["Tersedia", "Cuti"]), experience: text })),
  quotes: z.array(z.object({ code: text, customer: text, need: text, created: date, due: date, value: amount, stage: z.enum(["Baru", "Ditindaklanjuti", "Disepakati", "Tidak jadi"]) })),
});

export async function switchRole(form: FormData) {
  const account = String(form.get("account"));
  // A role may only be elevated by the password login action.
  if (account !== "customer") redirect("/demo");
  await clearAdminSession();
  await setDemoSession("customer");
  redirect("/");
}

export async function adminWorkspace() {
  const session = await getDemoSession();
  if (session?.role === "owner" || session?.role === "customer") throw new Error("Akses admin diperlukan.");
  if (session?.role === "admin") return session.id;
  const admin = await getAdminSession();
  if (!admin) throw new Error("Akses admin diperlukan.");
  return SHOWCASE_WORKSPACE;
}

export async function saveAdminDemo(input: unknown, expected: string, reset = false) {
  try {
    const id = await adminWorkspace();
    const current = await readDemo(id);
    if (revision(current) !== expected) return { error: "Data berubah di tab lain. Muat ulang sebelum menyimpan." };
    if (reset) {
      const data = createDemoData(FLEET); await writeDemo(id, data, expected);
      return { data, revision: revision(data) };
    }
    const parsed = demoInput.safeParse(input);
    if (!parsed.success) return { error: "Periksa isian, nomor kontak, nominal, dan tanggal." };
    const data: DemoData = { ...parsed.data, owners: current.owners, units: current.units };
    if (data.vehicles.length !== current.vehicles.length || data.vehicles.some((v) => v.unitCount !== current.vehicles.find((old) => old.slug === v.slug)?.unitCount || v.maintenance > v.unitCount)) return { error: "Jumlah mobil fisik tidak valid." };
    if (new Set(data.bookings.map((b) => b.code)).size !== data.bookings.length) return { error: "Kode pesanan harus unik." };
    for (const b of data.bookings) {
      const model = data.vehicles.find((v) => v.slug === b.vehicle);
      if (!model || (b.service === "Lepas kunci" && model.priceSelfDrive === null)) return { error: "Layanan kendaraan tidak tersedia." };
      let unit = data.units.find((u) => u.id === b.unitId && u.vehicle === b.vehicle);
      unit ??= availableUnit(data, b.vehicle, b.start, b.end, b.code);
      if (!unit) return { error: "Tidak ada mobil tersedia pada periode ini." };
      b.unitId = unit.id;
      const original = current.bookings.find((old) => old.code === b.code);
      if (!original && b.start < day(0)) return { error: "Pesanan baru tidak boleh dimulai pada tanggal lampau." };
      b.ownerRate = original?.unitId === unit.id ? original.ownerRate : data.owners.find((o) => o.id === unit.ownerId)!.share;
      if (b.status === "Selesai" && b.end > day(0)) return { error: "Perjalanan mendatang belum dapat diselesaikan." };
      if (b.status === "Berjalan" && b.start > day(0)) return { error: "Perjalanan mendatang belum dapat dimulai." };
      if (b.status !== "Batal" && b.status !== "Selesai") {
        if (!model.active || data.units.filter((u) => u.vehicle === b.vehicle).slice(0, model.maintenance).some((u) => u.id === b.unitId)) return { error: "Mobil dengan booking aktif tidak dapat dinonaktifkan atau masuk perawatan." };
        if (data.bookings.some((other) => other.code !== b.code && other.unitId === b.unitId && overlaps(other, b.start, b.end))) return { error: "Jadwal mobil bentrok dengan pesanan lain." };
        if (b.driver && (!data.drivers.some((d) => d.id === b.driver && d.status === "Tersedia") || data.bookings.some((other) => other.code !== b.code && other.driver === b.driver && overlaps(other, b.start, b.end)))) return { error: "Sopir tidak tersedia pada periode ini." };
      }
    }
    await writeDemo(id, data, expected);
    return { data, revision: revision(data) };
  } catch (error) { return { error: error instanceof DemoConflictError ? error.message : "Perubahan belum tersimpan. Pastikan sesi admin aktif lalu coba lagi." }; }
}

const requestSchema = z.object({ vehicle: text, service: z.enum(["Dengan sopir", "Lepas kunci"]), start: date, end: date, customer: text, phone: z.string().regex(/^(?:\+62|62|0)\d{8,13}$/), pickup: text, note: z.string().max(2000) })
  .refine((b) => b.start >= day(0) && b.start <= b.end && duration(b) <= 366, "Pilih periode sewa mulai hari ini, maksimal 366 hari.");

export async function checkAvailability(vehicle: string, start: string, end: string) {
  if (!date.safeParse(start).success || !date.safeParse(end).success || start < day(0) || start > end || duration({ start, end }) > 366) return { error: "Periksa tanggal sewa (maksimal 366 hari)." };
  const session = await getDemoSession() ?? await setDemoSession("customer");
  const data = await readDemo(session.id);
  return { available: Boolean(availableUnit(data, vehicle, start, end)) };
}

export async function submitDemoBooking(input: unknown) {
  const parsed = requestSchema.safeParse(input);
  if (!parsed.success) return { error: "Periksa nama, nomor WhatsApp, lokasi, dan periode sewa." };
  try {
    const session = await getDemoSession() ?? await setDemoSession("customer");
    if (session.role === "owner") return { error: "Portal pemilik hanya dapat melihat data. Pilih peran Pelanggan untuk mengajukan pemesanan." };
    const data = await readDemo(session.id);
    const expected = revision(data);
    if (data.bookings.length >= 2000) return { error: "Sesi demo penuh. Reset melalui admin." };
    const b = parsed.data;
    const unit = availableUnit(data, b.vehicle, b.start, b.end);
    const model = data.vehicles.find((v) => v.slug === b.vehicle);
    if (!unit || !model) return { error: "Mobil sudah terisi pada tanggal tersebut. Pilih periode lain." };
    if (b.service === "Lepas kunci" && model.priceSelfDrive === null) return { error: "Kendaraan ini hanya tersedia dengan sopir." };
    const booking = { ...b, phone: b.phone.replace(/^0/, "62").replace(/^\+/, ""), code: `KL-DM-${randomUUID().slice(0, 8).toUpperCase()}`, unitId: unit.id, ownerRate: data.owners.find((o) => o.id === unit.ownerId)!.share, driver: null, created: day(0), status: "Menunggu" as const, value: (b.service === "Lepas kunci" ? model.priceSelfDrive! : model.price) * duration(b) };
    data.bookings.unshift(booking);
    await writeDemo(session.id, data, expected);
    return { code: booking.code, value: booking.value };
  } catch (error) { return { error: error instanceof DemoConflictError ? "Ketersediaan baru saja berubah. Periksa ulang tanggal lalu coba lagi." : "Permintaan belum tersimpan. Silakan coba kembali." }; }
}
