import type { Metadata } from "next";
import { VehicleCard } from "@/components/VehicleCard";
import { listVehicleCards } from "@/lib/vehicles";
import { PageTitle } from "../_components/PageTitle";

export const metadata: Metadata = { title: "Armada", description: "Lihat pilihan armada dan harga sewa KL Rent Car." };

export default async function FleetPage() {
  const vehicles = await listVehicleCards();
  return <section className="mx-auto max-w-7xl px-4 py-14"><PageTitle eyebrow="Armada" title="Pilih mobil yang sesuai" description="Harga sewa tercantum untuk setiap unit. Hubungi kami untuk cek tanggal dan ketersediaan." />
    {vehicles.length ? <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{vehicles.map((vehicle) => <VehicleCard key={vehicle.slug} vehicle={vehicle} />)}</div> : <p className="mt-8 text-navy-700">Armada belum tersedia. Silakan hubungi kami melalui WhatsApp.</p>}
  </section>;
}
