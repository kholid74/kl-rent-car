import Link from "next/link";

import { formatRupiah } from "@/lib/format";
import { manualPhoto, PhotoSlot } from "./PhotoSlot";

const CARD_IMAGES: Record<string, string> = {
  "honda-brio-satya": "/images/manual/card_brio.webp",
  "toyota-avanza": "/images/manual/card_avanza.webp",
  "daihatsu-xenia": "/images/manual/card_xenia.webp",
  "toyota-innova-reborn-diesel": "/images/manual/card_innova_reborn.webp",
  "toyota-alphard": "/images/manual/card_alphard.webp",
  "toyota-fortuner": "/images/manual/card_fortuner.webp",
  "toyota-innova-zenix-hybrid": "/images/manual/card_innova.webp",
  "toyota-hiace-commuter": "/images/manual/card_hiace.webp",
};

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

export function VehicleCard({ vehicle }: { vehicle: VehicleCardData }) {
  const { slug, name, seats, transmission, priceSelfDrive, priceWithDriver, images } = vehicle;

  return (
    <article className="group flex h-full flex-col">
      <Link href={`/armada/${slug}`} className="relative block overflow-hidden">
        <PhotoSlot
          label={`${name} — tampak luar`}
          src={CARD_IMAGES[slug] ?? images.find(manualPhoto)}
          className="aspect-4/3 transition-transform duration-500 group-hover:scale-[1.02]"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
      </Link>

      <div className="flex flex-1 flex-col pt-5">
        <h3 className="font-display text-xl font-bold text-navy-900">
          <Link href={`/armada/${slug}`} className="hover:underline hover:underline-offset-4">{name}</Link>
        </h3>
        <p className="mt-1 text-sm text-navy-700">{seats} kursi · {transmission === "MATIC" ? "Matic" : "Manual"}</p>
        <div className="mt-auto pt-5">
          <p className="text-sm text-navy-700">Dengan sopir / 12 jam</p>
          <p className="tabular font-display text-lg font-semibold text-navy-900">{formatRupiah(priceWithDriver)}</p>
          {priceSelfDrive !== null ? (
            <p className="mt-1 text-sm text-navy-700">Lepas kunci {formatRupiah(priceSelfDrive)} / hari</p>
          ) : null}
          <Link href={`/armada/${slug}`} className="mt-5 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-navy-900 underline decoration-[#B89A62] underline-offset-4">
            Lihat mobil <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </div>
    </article>
  );
}
