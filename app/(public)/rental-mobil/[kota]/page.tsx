import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { WaButton } from "@/components/WaButton";
import { PageTitle } from "../../_components/PageTitle";
const places = { "jakarta-selatan": { name: "Jakarta Selatan", copy: "Antar jemput dan penggunaan mobil untuk kebutuhan kerja, keluarga, maupun perjalanan di Jakarta Selatan." }, "tangerang-selatan": { name: "Tangerang Selatan", copy: "Layanan dari wilayah Serpong dan sekitarnya untuk perjalanan harian, acara keluarga, dan kebutuhan perusahaan." } } as const;
type Props = { params: Promise<{ kota: string }> };
export async function generateStaticParams() { return Object.keys(places).map((kota) => ({ kota })); }
export async function generateMetadata({ params }: Props): Promise<Metadata> { const { kota } = await params; const place = places[kota as keyof typeof places]; return { title: place ? `Rental Mobil ${place.name}` : "Area Layanan" }; }
export default async function AreaPage({ params }: Props) { const { kota } = await params; const place = places[kota as keyof typeof places]; if (!place) notFound(); return <article className="mx-auto max-w-5xl px-4 py-14"><PageTitle eyebrow="Area layanan" title={`Rental Mobil ${place.name}`} description={place.copy} /><div className="mt-8 flex flex-wrap gap-3"><Link href="/armada" className="inline-flex min-h-12 items-center rounded-lg border-2 border-navy-900 px-5 font-semibold text-navy-900">Lihat armada</Link><WaButton context={{ kind: "umum", path: `/rental-mobil/${kota}` }} /></div><h2 className="mt-12 font-display text-2xl font-bold text-navy-900">Paket untuk berbagai perjalanan</h2><p className="mt-3 max-w-3xl text-navy-700">Pilih layanan lepas kunci, dengan sopir, atau rental bulanan. Lokasi penjemputan dan ketersediaan dikonfirmasi bersama admin sebelum pemesanan.</p></article>; }
