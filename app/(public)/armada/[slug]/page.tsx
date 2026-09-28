import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
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
  return <article className="mx-auto max-w-7xl px-4 py-14">
    <Link href="/armada" className="font-semibold text-navy-700 underline underline-offset-4">← Semua armada</Link>
    <div className="mt-8 grid gap-10 lg:grid-cols-2">
      <div className="grid grid-cols-2 gap-3">{vehicle.images.length ? vehicle.images.map((src, i) => <img key={src} src={src} alt={`Foto ilustrasi ${vehicle.name} ${i + 1}`} className="aspect-4/3 w-full rounded-xl object-cover" />) : <div className="col-span-2 aspect-4/3 rounded-xl bg-road-100" />}</div>
      <div><PageTitle eyebrow={`${vehicle.category} · ${vehicle.year}`} title={vehicle.name} description={vehicle.description} />
        <dl className="mt-7 grid grid-cols-2 gap-4 rounded-xl bg-road-100 p-5 text-sm"><div><dt>Kapasitas</dt><dd className="font-bold">{vehicle.seats} kursi</dd></div><div><dt>Transmisi</dt><dd className="font-bold">{vehicle.transmission === "MATIC" ? "Matic" : "Manual"}</dd></div><div><dt>Bahan bakar</dt><dd className="font-bold">{vehicle.fuel}</dd></div><div><dt>Bagasi</dt><dd className="font-bold">{vehicle.luggage} koper</dd></div></dl>
        <ul className="mt-5 flex flex-wrap gap-2">{vehicle.facilities.map((item) => <li key={item} className="rounded-full border border-road-200 px-3 py-1.5 text-sm">{item}</li>)}</ul>
        <dl className="mt-6 space-y-2 border-t border-road-200 pt-5">{vehicle.priceSelfDrive !== null ? <div className="flex justify-between"><dt>Lepas kunci / hari</dt><dd className="font-bold">{formatRupiah(vehicle.priceSelfDrive)}</dd></div> : null}<div className="flex justify-between"><dt>Dengan sopir / 12 jam</dt><dd className="font-bold">{formatRupiah(vehicle.priceWithDriver)}</dd></div>{vehicle.priceMonthly !== null ? <div className="flex justify-between"><dt>Bulanan</dt><dd className="font-bold">{formatRupiah(vehicle.priceMonthly)}</dd></div> : null}</dl>
        <div className="mt-7 flex flex-wrap gap-3"><Link href={`/booking?unit=${vehicle.slug}`} className="inline-flex min-h-12 items-center rounded-lg bg-navy-900 px-5 font-semibold text-white">Booking sekarang</Link><WaButton context={{ kind: "unit", unitName: vehicle.name }} /></div>
      </div>
    </div>
  </article>;
}
