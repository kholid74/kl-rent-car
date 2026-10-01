import type { Metadata } from "next";
import Link from "next/link";

import { AvailabilityWidget } from "@/components/AvailabilityWidget";
import { PhotoSlot } from "@/components/PhotoSlot";
import { VehicleCard } from "@/components/VehicleCard";
import { WaButton } from "@/components/WaButton";
import { SITE } from "@/lib/site";
import { listVehicleCards } from "@/lib/vehicles";
import { buildWaLink } from "@/lib/wa";

export const metadata: Metadata = {
  title: undefined,
  description: "Jelajahi seluruh armada KL Rent Car. Pilihan premium dengan sopir untuk perjalanan harian, kontrak, pernikahan, dan agenda resmi di Jabodetabek.",
  alternates: { canonical: "/" },
};

const PREMIUM = ["toyota-alphard", "toyota-fortuner", "toyota-innova-zenix-hybrid"];

const OCCASIONS = [
  { title: "Sewa harian", copy: "Satu agenda atau seharian penuh. Tentukan mobil, tanggal, dan titik jemput.", href: "/booking" },
  { title: "Sewa bulanan", copy: "Kendaraan untuk ritme kerja dan kebutuhan keluarga yang berlanjut.", href: "/layanan/rental-bulanan" },
  { title: "Sewa tahunan", copy: "Kebutuhan jangka panjang dibicarakan sebagai penawaran khusus.", href: buildWaLink({ kind: "keperluan", label: "sewa tahunan" }) },
  { title: "Wedding car", copy: "Mobil dan jadwal penjemputan disiapkan mengikuti rangkaian acara.", href: buildWaLink({ kind: "keperluan", label: "wedding car" }) },
  { title: "Agenda kenegaraan", copy: "Kebutuhan kendaraan untuk agenda protokoler dibahas secara khusus.", href: buildWaLink({ kind: "keperluan", label: "agenda kenegaraan" }) },
] as const;

export default async function HomePage() {
  const all = await listVehicleCards();
  const featured = PREMIUM.map((slug) => all.find((vehicle) => vehicle.slug === slug)).filter((vehicle) => vehicle !== undefined);
  const rest = all.filter((vehicle) => !PREMIUM.includes(vehicle.slug));

  return (
    <>
      <section className="overflow-hidden bg-navy-900 text-white">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:py-20 lg:grid-cols-[1fr_0.9fr] lg:gap-16 lg:py-24">
          <div>
            <h1 className="max-w-3xl font-display text-5xl font-bold leading-[1.08] tracking-tight sm:text-6xl lg:text-7xl">
              Perjalanan penting, <span className="font-editorial font-normal italic tracking-normal text-[#D4BD91]">mobil yang tepat.</span>
            </h1>
            <p className="mt-7 max-w-xl text-lg leading-relaxed text-white/75">
              Pilihan mobil untuk hari biasa hingga agenda khusus. Layanan dengan sopir menjadi fokus; lepas kunci tersedia pada unit tertentu.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link href="/armada" className="inline-flex min-h-13 items-center justify-center bg-road-100 px-6 font-semibold text-navy-900 transition-colors hover:bg-white">Jelajahi armada</Link>
              <Link href="/booking" className="inline-flex min-h-13 items-center justify-center gap-3 px-3 font-semibold text-white underline decoration-[#B89A62] underline-offset-8">Atur perjalanan <span aria-hidden="true" className="text-[#D4BD91]">↗</span></Link>
            </div>
          </div>
          <div className="lg:translate-x-6 lg:-translate-y-3 lg:scale-[1.06]">
            <PhotoSlot label="Mobil hitam di area penjemputan" src="/images/manual/hero.png" eager className="aspect-4/5 sm:aspect-5/4 lg:aspect-4/5" sizes="(max-width: 1024px) 100vw, 50vw" />
          </div>
        </div>
      </section>

      <section className="relative z-10 mx-auto max-w-7xl px-4 py-12" aria-label="Mulai pemesanan">
        <div className="grid gap-8 py-4 lg:grid-cols-[1fr_1.1fr] lg:items-center lg:gap-16">
          <div>
            <h2 className="max-w-lg font-display text-3xl font-bold tracking-tight text-navy-900 sm:text-4xl">Mulai dari tanggal dan mobil yang Anda inginkan.</h2>
            <p className="mt-4 max-w-lg text-navy-700">Kirim permintaan singkat. Tim kami mengonfirmasi detail layanan melalui WhatsApp.</p>
          </div>
          <AvailabilityWidget units={all.map(({ slug, name }) => ({ slug, name }))} />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:py-20">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <h2 className="max-w-3xl font-display text-3xl font-bold tracking-tight text-navy-900 sm:text-4xl">Mobil untuk momen yang perlu disiapkan lebih baik.</h2>
          <Link href="/armada" className="min-h-11 font-semibold text-navy-900 underline decoration-[#B89A62] decoration-2 underline-offset-8">Lihat seluruh armada</Link>
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {featured.map((vehicle) => <VehicleCard key={vehicle.slug} vehicle={vehicle} />)}
        </div>
        <div className="mt-10 border-t border-road-200 pt-7">
          <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
            <h3 className="font-display text-xl font-bold">Pilihan mobil lainnya</h3>
            <p className="text-sm text-navy-700">Seluruh model tetap tersedia di katalog.</p>
          </div>
          <div className="grid gap-x-10 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((vehicle) => (
              <Link key={vehicle.slug} href={`/armada/${vehicle.slug}`} className="flex min-h-14 items-center justify-between gap-3 border-b border-road-200 py-3 font-semibold text-navy-900 hover:text-amber-500">
                <span>{vehicle.name}</span><span className="text-amber-500" aria-hidden="true">↗</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-16 sm:py-24">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 lg:grid-cols-[0.65fr_1fr] lg:gap-20">
          <div>
            <h2 className="max-w-md font-display text-4xl font-bold tracking-tight text-navy-900 sm:text-5xl">Perjalanan punya banyak alasan.</h2>
            <p className="mt-5 max-w-sm text-navy-700">Pilih kebutuhan yang paling dekat dengan rencana Anda. Detail mobil dan sopir dibicarakan setelahnya.</p>
          </div>
          <div className="border-t border-road-200">
            {OCCASIONS.map((item) => (
              <Link key={item.title} href={item.href} target={item.href.startsWith("https://") ? "_blank" : undefined} rel={item.href.startsWith("https://") ? "noopener noreferrer" : undefined} className="group grid gap-2 border-b border-road-200 py-6 sm:grid-cols-[11rem_1fr_auto] sm:items-baseline sm:gap-5">
                <h3 className="font-display text-xl font-semibold text-navy-900 group-hover:text-amber-500">{item.title}</h3>
                <p className="text-sm text-navy-700">{item.copy}</p>
                <span className="text-lg text-amber-500" aria-hidden="true">↗</span>
              </Link>
            ))}
          </div>
        </div>
        <p className="mx-auto mt-7 max-w-7xl px-4 text-sm text-navy-700">Layanan tahunan dan acara khusus disusun berdasarkan penawaran. Seluruh contoh di situs ini adalah bagian dari showcase.</p>
      </section>

      <section className="bg-navy-900 py-20 text-white sm:py-28">
        <div className="mx-auto max-w-7xl px-4 lg:pl-[24%]">
          <h2 className="font-editorial max-w-5xl text-5xl font-normal leading-[1.08] tracking-tight sm:text-7xl lg:text-8xl">
            Detail kecil menentukan <em className="text-[#D4BD91]">perjalanan.</em>
          </h2>
          <p className="mt-8 max-w-xl border-l border-[#B89A62] pl-5 text-lg text-white/70">Titik jemput, jam berangkat, jumlah koper. Pilih mobil dan tanggal; admin mengonfirmasi detail perjalanan serta kebutuhan sopir.</p>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-16 sm:py-20 lg:grid-cols-[1fr_auto] lg:items-center">
        <div>
          <h2 className="font-display text-3xl font-bold sm:text-4xl">Ceritakan rencana Anda.</h2>
          <p className="mt-3 text-navy-700">Melayani wilayah utama Jakarta Selatan dan Tangerang Selatan, setiap hari {SITE.hours.open}–{SITE.hours.close} WIB.</p>
        </div>
        <WaButton context={{ kind: "umum", path: "/" }} size="lg" />
      </section>
    </>
  );
}
