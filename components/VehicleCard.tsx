import Link from "next/link";

import { formatRupiah } from "@/lib/format";
import { WaButton } from "./WaButton";

/**
 * Props sengaja berupa data mentah, bukan objek Prisma, supaya kartu ini bisa
 * dipakai halaman mana pun tanpa menyeret bentuk query tertentu.
 */
export type VehicleCardData = {
  slug: string;
  name: string;
  seats: number;
  transmission: "MANUAL" | "MATIC";
  fuel: string;
  priceSelfDrive: number | null;
  priceWithDriver: number;
  images: string[];
};

function SpecIcon({ path }: { path: string }) {
  return (
    <svg viewBox="0 0 24 24" className="size-4 shrink-0 text-navy-700/60" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={path} />
    </svg>
  );
}

const ICON_SEATS = "M4 18v-2a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v2M9 8a3 3 0 1 0 6 0 3 3 0 0 0-6 0";
const ICON_GEAR = "M6 4v16M12 4v16M18 4v8M6 8h12M6 14h6";
const ICON_FUEL = "M4 20V6a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v14M3 20h12M14 9h3a2 2 0 0 1 2 2v5a1.5 1.5 0 0 0 3 0V9l-2-2";

export function VehicleCard({ vehicle, priority = false }: { vehicle: VehicleCardData; priority?: boolean }) {
  const { slug, name, seats, transmission, fuel, priceSelfDrive, priceWithDriver, images } = vehicle;

  return (
    <article className="group flex flex-col overflow-hidden rounded-xl border border-road-200 bg-white shadow-sm transition-shadow hover:shadow-md">
      <Link href={`/armada/${slug}`} className="block">
        {/* next/image tidak mengoptimasi SVG, dan mengaktifkan dangerouslyAllowSVG
            membuka permukaan risiko tanpa imbalan — ilustrasi ini sudah ~4KB. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={images[0]}
          alt={`Ilustrasi ${name}`}
          width={1200}
          height={900}
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : "auto"}
          className="aspect-4/3 w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
        />
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-lg font-bold text-navy-900">
          <Link href={`/armada/${slug}`} className="hover:text-navy-700">
            {name}
          </Link>
        </h3>

        <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-navy-700">
          <li className="flex items-center gap-1.5">
            <SpecIcon path={ICON_SEATS} />
            {seats} kursi
          </li>
          <li className="flex items-center gap-1.5">
            <SpecIcon path={ICON_GEAR} />
            {transmission === "MATIC" ? "Matic" : "Manual"}
          </li>
          <li className="flex items-center gap-1.5">
            <SpecIcon path={ICON_FUEL} />
            {fuel}
          </li>
        </ul>

        <dl className="mt-4 space-y-1.5 border-t border-road-200 pt-4">
          {priceSelfDrive !== null ? (
            <div className="flex items-baseline justify-between gap-3">
              <dt className="text-sm text-navy-700">Lepas kunci</dt>
              <dd className="tabular font-display text-lg font-extrabold text-navy-900">
                {formatRupiah(priceSelfDrive)}
                <span className="ml-1 text-xs font-medium text-navy-700/70">/hari</span>
              </dd>
            </div>
          ) : (
            <div className="flex items-baseline justify-between gap-3">
              <dt className="text-sm text-navy-700">Lepas kunci</dt>
              <dd className="text-sm font-medium text-navy-700/60">Tidak tersedia</dd>
            </div>
          )}
          <div className="flex items-baseline justify-between gap-3">
            <dt className="text-sm text-navy-700">Dengan sopir</dt>
            <dd className="tabular font-display text-lg font-extrabold text-navy-900">
              {formatRupiah(priceWithDriver)}
              <span className="ml-1 text-xs font-medium text-navy-700/70">/12 jam</span>
            </dd>
          </div>
        </dl>

        <div className="mt-5 flex items-center gap-2">
          <WaButton context={{ kind: "unit", unitName: name }} size="sm" className="flex-1">
            WhatsApp
          </WaButton>
          <Link
            href={`/armada/${slug}`}
            className="inline-flex min-h-11 items-center justify-center rounded-lg border-2 border-navy-900 px-4 text-sm font-semibold text-navy-900 transition-colors hover:bg-navy-900 hover:text-white"
          >
            Detail
          </Link>
        </div>
      </div>
    </article>
  );
}
