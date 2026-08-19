import Link from "next/link";

import { SectionHeading } from "@/components/SectionHeading";
import { TrustChips } from "@/components/TrustChips";
import { VehicleCard } from "@/components/VehicleCard";
import { WaButton } from "@/components/WaButton";
import { db } from "@/lib/db";
import { SITE } from "@/lib/site";

/**
 * Kerangka Home. Section 1 dan 3 dari spec 5.1 sudah terpasang untuk menguji
 * komponen dasar dan jalur data; tujuh section sisanya menyusul di langkah 5.
 */
export default async function HomePage() {
  const featured = await db.vehicle.findMany({
    where: { isActive: true },
    orderBy: { priceWithDriver: "asc" },
    take: 6,
    select: {
      slug: true,
      name: true,
      seats: true,
      transmission: true,
      fuel: true,
      priceSelfDrive: true,
      priceWithDriver: true,
      images: true,
    },
  });

  return (
    <>
      <section className="bg-road-100">
        <div className="mx-auto max-w-7xl px-4 py-16 lg:py-24">
          <div className="max-w-3xl">
            <h1 className="font-display text-3xl font-extrabold leading-tight text-navy-900 sm:text-4xl lg:text-5xl">
              Rental Mobil Jakarta &amp; Tangerang Selatan, Mulai Rp300.000/hari
            </h1>
            <div className="road-divider mt-5 w-32" aria-hidden="true" />
            <p className="mt-5 text-lg text-navy-700">
              Unit terawat dan difoto apa adanya, harga tercantum tanpa biaya tersembunyi, dan
              balasan WhatsApp di bawah 5 menit selama jam layanan.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <WaButton context={{ kind: "umum", path: "/" }} size="lg" />
              <Link
                href="/armada"
                className="inline-flex min-h-14 items-center justify-center rounded-lg border-2 border-navy-900 px-7 text-lg font-semibold text-navy-900 transition-colors hover:bg-navy-900 hover:text-white"
              >
                Lihat Armada
              </Link>
            </div>

            <div className="mt-8">
              <TrustChips
                chips={[
                  { label: `Sejak ${SITE.foundedYear}` },
                  { label: "25+ Unit Terawat" },
                  { label: `Layanan ${SITE.hours.open}–${SITE.hours.close}` },
                ]}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading
            eyebrow="Armada"
            title="Unit yang paling sering dipesan"
            description="Delapan model tersedia, dari LCGC untuk keliling kota sampai minibus 15 kursi untuk rombongan."
          />
          <Link href="/armada" className="font-semibold text-navy-700 underline underline-offset-4 hover:text-amber-500">
            Lihat semua armada
          </Link>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((v, i) => (
            <VehicleCard key={v.slug} vehicle={v} priority={i < 3} />
          ))}
        </div>
      </section>
    </>
  );
}
