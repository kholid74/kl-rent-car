import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { WaButton } from "@/components/WaButton";
import { SERVICES } from "@/lib/content/services";
import { PageTitle } from "../../_components/PageTitle";
type Props = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> { const { slug } = await params; return { title: SERVICES.find((s) => s.slug === slug)?.title ?? "Layanan" }; }
export default async function ServicePage({ params }: Props) {
  const { slug } = await params; const service = SERVICES.find((s) => s.slug === slug); if (!service) notFound();
  const context = service.slug === "dengan-sopir" ? { kind: "dengan-sopir" as const } : service.slug === "rental-bulanan" ? { kind: "bulanan" as const } : service.slug === "corporate" ? { kind: "corporate" as const } : { kind: "umum" as const, path: `/layanan/${service.slug}` };
  return <article className="mx-auto max-w-7xl px-4 py-14"><PageTitle eyebrow="Layanan" title={service.title} description={service.summary} /><div className="mt-8 max-w-2xl rounded-xl bg-road-100 p-6"><p className="font-semibold text-navy-900">Cocok untuk</p><p className="mt-2 text-navy-700">{service.forWho}</p><p className="mt-5 font-display text-xl font-extrabold text-amber-500">{service.priceHint}</p><WaButton context={context} className="mt-6" /></div></article>;
}
