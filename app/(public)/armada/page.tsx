import type { Metadata } from "next";
import { VehicleCard } from "@/components/VehicleCard";
import { listVehicleCards } from "@/lib/vehicles";
import { PageTitle } from "../_components/PageTitle";

export const metadata: Metadata = { title: "Armada", description: "Lihat pilihan armada dan harga sewa KL Rent Car." };

export default async function FleetPage() {
  const vehicles = await listVehicleCards();
  return <section className="mx-auto max-w-7xl px-4 py-14"><PageTitle eyebrow="The private garage" title="Seluruh armada" description="Pilihan premium tampil lebih dulu. Setiap model tetap bisa dipilih sesuai jumlah penumpang, agenda, dan anggaran perjalanan." />
    {vehicles.length ? <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{vehicles.map((vehicle) => <VehicleCard key={vehicle.slug} vehicle={vehicle} />)}</div> : <p className="mt-8 text-navy-700">Armada belum tersedia. Silakan hubungi kami melalui WhatsApp.</p>}
  </section>;
}
