import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";

import { manualPhoto, PhotoSlot } from "@/components/PhotoSlot";
import { WaButton } from "@/components/WaButton";
import { formatRupiah } from "@/lib/format";
import { db } from "@/lib/db";
import { PageTitle } from "../../_components/PageTitle";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const vehicle = await db.vehicle.findFirst({ where: { slug, isActive: true }, select: { name: true } });
  return { title: vehicle?.name ?? "Armada" };
}

export default async function VehiclePage({ params }: Props) {
  const { slug } = await params;
  const vehicle = await db.vehicle.findFirst({ where: { slug, isActive: true } });
  if (!vehicle) notFound();
  const photos = vehicle.images.filter(manualPhoto);
  const shots = ["tampak luar", "kabin", "bagasi"];

  return (
    <article className="mx-auto max-w-7xl px-4 py-14">
      <Link href="/armada" className="font-semibold text-navy-700 underline underline-offset-4">← Semua armada</Link>
      <div className="mt-8 grid gap-10 lg:grid-cols-2">
        <div className="grid gap-3 self-start sm:grid-cols-2">
          {shots.map((shot, index) => (
            <PhotoSlot
              key={shot}
              label={`${vehicle.name} — ${shot}`}
              src={photos[index]}
              className={`aspect-4/3 border border-road-200 ${index === 0 ? "sm:col-span-2" : ""}`}
            />
          ))}
        </div>
        <div>
          <PageTitle eyebrow={`${vehicle.category} · ${vehicle.year}`} title={vehicle.name} description={vehicle.description} />
          <dl className="mt-7 grid grid-cols-2 gap-4 border border-road-200 bg-white p-5 text-sm">
            <div><dt>Kapasitas</dt><dd className="font-bold">{vehicle.seats} kursi</dd></div>
            <div><dt>Transmisi</dt><dd className="font-bold">{vehicle.transmission === "MATIC" ? "Matic" : "Manual"}</dd></div>
            <div><dt>Bahan bakar</dt><dd className="font-bold">{vehicle.fuel}</dd></div>
            <div><dt>Bagasi</dt><dd className="font-bold">{vehicle.luggage} koper</dd></div>
          </dl>
          <ul className="mt-5 flex flex-wrap gap-2">
            {vehicle.facilities.map((item) => <li key={item} className="border border-road-200 bg-white px-3 py-1.5 text-sm">{item}</li>)}
          </ul>
          <dl className="mt-6 space-y-2 border-t border-road-200 pt-5">
            <div className="flex justify-between gap-4"><dt>Dengan sopir / 12 jam</dt><dd className="font-bold">{formatRupiah(vehicle.priceWithDriver)}</dd></div>
            {vehicle.priceSelfDrive !== null ? <div className="flex justify-between gap-4"><dt>Lepas kunci / hari</dt><dd className="font-bold">{formatRupiah(vehicle.priceSelfDrive)}</dd></div> : null}
            {vehicle.priceMonthly !== null ? <div className="flex justify-between gap-4"><dt>Bulanan</dt><dd className="font-bold">{formatRupiah(vehicle.priceMonthly)}</dd></div> : null}
          </dl>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href={`/booking?unit=${vehicle.slug}`} className="inline-flex min-h-12 items-center bg-navy-900 px-5 font-semibold text-white">Ajukan booking</Link>
            <WaButton context={{ kind: "unit", unitName: vehicle.name }} />
          </div>
        </div>
      </div>
    </article>
  );
}
