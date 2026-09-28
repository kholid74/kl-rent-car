import type { Metadata } from "next";
import { ServiceCard } from "@/components/ServiceCard";
import { SERVICES } from "@/lib/content/services";
import { PageTitle } from "../_components/PageTitle";
export const metadata: Metadata = { title: "Layanan" };
export default function ServicesPage() { return <section className="mx-auto max-w-7xl px-4 py-14"><PageTitle eyebrow="Layanan" title="Pilih cara sewa" description="Paket harian, dengan sopir, bulanan, dan kebutuhan perusahaan." /><div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">{SERVICES.map((service) => <ServiceCard key={service.slug} service={service} />)}</div></section>; }
