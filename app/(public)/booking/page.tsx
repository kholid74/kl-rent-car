import type { Metadata } from "next";
import { listVehicleCards } from "@/lib/vehicles";
import { PageTitle } from "../_components/PageTitle";
import { BookingForm } from "./BookingForm";
export const metadata: Metadata = { title: "Booking" };
type Props = { searchParams: Promise<{ unit?: string; mulai?: string; selesai?: string }> };
export default async function BookingPage({ searchParams }: Props) {
  const [query, units] = await Promise.all([searchParams, listVehicleCards()]);
  const initialUnit = units.some((u) => u.slug === query.unit) ? query.unit! : "";
  return <section className="mx-auto max-w-4xl px-4 py-14"><PageTitle eyebrow="Booking" title="Ajukan pemesanan" description="Isi detail perjalanan. Admin akan memeriksa unit dan tanggal melalui WhatsApp." /><BookingForm units={units.map(({ slug, name, priceSelfDrive }) => ({ slug, name, priceSelfDrive }))} initialUnit={initialUnit} initialStart={query.mulai ?? ""} initialEnd={query.selesai ?? ""} /></section>;
}
