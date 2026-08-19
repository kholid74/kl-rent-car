import { hash } from "bcryptjs";

import { db } from "../lib/db";
import { generateBookingCode } from "../lib/booking-code";
import { FLEET, resolveImages } from "./fleet-data";

/** Tengah malam waktu Asia/Jakarta, digeser n hari dari hari ini. */
function dayOffset(n: number): Date {
  const d = new Date();
  d.setUTCHours(-7, 0, 0, 0); // 00:00 WIB = 17:00 UTC hari sebelumnya
  d.setUTCDate(d.getUTCDate() + n);
  return d;
}

/**
 * Booking dummy dirancang supaya dashboard dan kalender terlihat seperti bisnis
 * yang berjalan, bukan tabel kosong: ada yang sudah selesai, ada yang sedang
 * jalan hari ini, ada yang menunggu konfirmasi, dan Alphard (hanya 1 unit)
 * sengaja dibuat bentrok di satu akhir pekan agar cek ketersediaan bisa
 * didemokan tanpa menyiapkan data dadakan.
 */
const BOOKING_PLAN: Array<{
  slug: string;
  serviceType: "SELF_DRIVE" | "WITH_DRIVER";
  from: number;
  to: number;
  status: "PENDING" | "CONFIRMED" | "ONGOING" | "COMPLETED" | "CANCELLED";
  customerName: string;
  customerPhone: string;
  pickupLocation: string;
  notes?: string;
}> = [
  { slug: "toyota-innova-reborn-diesel", serviceType: "WITH_DRIVER", from: -19, to: -16, status: "COMPLETED", customerName: "Rizky Ramadhan", customerPhone: "6281234567801", pickupLocation: "Bintaro Sektor 9, Tangerang Selatan", notes: "Antar keluarga ke Solo, sopir menginap 2 malam." },
  { slug: "toyota-avanza", serviceType: "SELF_DRIVE", from: -14, to: -11, status: "COMPLETED", customerName: "Dewi Anggraini", customerPhone: "6281234567802", pickupLocation: "Pondok Indah, Jakarta Selatan" },
  { slug: "honda-brio-satya", serviceType: "SELF_DRIVE", from: -9, to: -7, status: "COMPLETED", customerName: "Bagus Prasetyo", customerPhone: "6281234567803", pickupLocation: "Ciputat, Tangerang Selatan" },
  { slug: "toyota-alphard", serviceType: "WITH_DRIVER", from: -5, to: -5, status: "COMPLETED", customerName: "Hendra Wijaya", customerPhone: "6281234567804", pickupLocation: "Hotel Gran Melia, Kuningan", notes: "Jemput tamu kantor dari bandara." },
  { slug: "toyota-hiace-commuter", serviceType: "WITH_DRIVER", from: -2, to: 0, status: "ONGOING", customerName: "Panitia SMA Harapan Bangsa", customerPhone: "6281234567805", pickupLocation: "Jl. Ir. H. Juanda, Ciputat", notes: "Study tour, 14 siswa + 2 guru." },
  { slug: "daihatsu-xenia", serviceType: "SELF_DRIVE", from: -1, to: 2, status: "ONGOING", customerName: "Siti Nurhaliza", customerPhone: "6281234567806", pickupLocation: "Bumi Serpong Damai, Tangerang Selatan" },
  { slug: "toyota-fortuner", serviceType: "WITH_DRIVER", from: 1, to: 3, status: "CONFIRMED", customerName: "Agus Setiawan", customerPhone: "6281234567807", pickupLocation: "Kebayoran Baru, Jakarta Selatan", notes: "Kunjungan proyek ke Sukabumi." },
  { slug: "toyota-innova-zenix-hybrid", serviceType: "WITH_DRIVER", from: 4, to: 5, status: "CONFIRMED", customerName: "Maya Kusuma", customerPhone: "6281234567808", pickupLocation: "Alam Sutera, Tangerang Selatan" },
  { slug: "toyota-alphard", serviceType: "WITH_DRIVER", from: 6, to: 7, status: "CONFIRMED", customerName: "Yohanes Baptista", customerPhone: "6281234567809", pickupLocation: "Menteng, Jakarta Pusat", notes: "Mobil pengantin, dekorasi dipasang pagi." },
  { slug: "toyota-avanza", serviceType: "SELF_DRIVE", from: 8, to: 11, status: "PENDING", customerName: "Fitriani Lestari", customerPhone: "6281234567810", pickupLocation: "Lebak Bulus, Jakarta Selatan" },
  { slug: "honda-brio-satya", serviceType: "SELF_DRIVE", from: 9, to: 10, status: "PENDING", customerName: "Reza Fahlevi", customerPhone: "6281234567811", pickupLocation: "Pamulang, Tangerang Selatan" },
  { slug: "toyota-innova-reborn-diesel", serviceType: "WITH_DRIVER", from: 12, to: 15, status: "PENDING", customerName: "Nurul Hidayah", customerPhone: "6281234567812", pickupLocation: "Cilandak, Jakarta Selatan", notes: "Rencana ke Yogyakarta, minta sopir yang hafal jalur selatan." },
  { slug: "toyota-fortuner", serviceType: "SELF_DRIVE", from: 5, to: 6, status: "CANCELLED", customerName: "Tommy Kurniawan", customerPhone: "6281234567813", pickupLocation: "Serpong, Tangerang Selatan", notes: "Dibatalkan pelanggan, jadwal dinas berubah." },
];

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminEmail || !adminPassword) {
    throw new Error("ADMIN_EMAIL dan ADMIN_PASSWORD wajib diisi. Lihat .env.example.");
  }

  // Urutan penting: Booking punya foreign key ke Vehicle.
  await db.booking.deleteMany();
  await db.vehicle.deleteMany();
  await db.adminUser.deleteMany();

  await db.adminUser.create({
    data: {
      email: adminEmail,
      password: await hash(adminPassword, 12),
      name: "Admin KL Rent Car",
    },
  });

  const vehicles = new Map<string, string>();
  for (const unit of FLEET) {
    const { slug, ...rest } = unit;
    const created = await db.vehicle.create({
      data: { slug, ...rest, images: await resolveImages(slug) },
    });
    vehicles.set(slug, created.id);
  }

  let bookings = 0;
  for (const plan of BOOKING_PLAN) {
    const vehicleId = vehicles.get(plan.slug);
    if (!vehicleId) throw new Error(`Booking dummy menunjuk unit tak dikenal: ${plan.slug}`);
    await db.booking.create({
      data: {
        code: generateBookingCode(),
        vehicleId,
        serviceType: plan.serviceType,
        startDate: dayOffset(plan.from),
        endDate: dayOffset(plan.to),
        pickupLocation: plan.pickupLocation,
        customerName: plan.customerName,
        customerPhone: plan.customerPhone,
        notes: plan.notes ?? null,
        status: plan.status,
      },
    });
    bookings++;
  }

  console.log(`seed selesai: ${FLEET.length} unit, ${bookings} booking, 1 admin (${adminEmail})`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
