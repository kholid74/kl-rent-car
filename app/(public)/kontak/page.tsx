import type { Metadata } from "next";
import { WaButton } from "@/components/WaButton";
import { SITE } from "@/lib/site";
import { PageTitle } from "../_components/PageTitle";
export const metadata: Metadata = { title: "Kontak" };
export default function ContactPage() { return <section className="mx-auto max-w-7xl px-4 py-14"><PageTitle eyebrow="Kontak" title="Hubungi KL Rent Car" description="Tanyakan ketersediaan unit atau minta bantuan memilih paket." /><div className="mt-9 grid gap-8 lg:grid-cols-2"><div><address className="not-italic text-navy-700"><p className="font-bold text-navy-900">{SITE.name}</p><p className="mt-2">{SITE.address.street}<br />{SITE.address.locality} {SITE.address.postalCode}</p><p className="mt-3"><a className="underline" href={`mailto:${SITE.email}`}>{SITE.email}</a></p></address><p className="mt-5 text-navy-700">Setiap hari, {SITE.hours.open}–{SITE.hours.close} WIB</p><WaButton context={{ kind: "umum", path: "/kontak" }} className="mt-6" /></div><iframe title={`Peta lokasi ${SITE.name}`} src="https://www.google.com/maps?q=Serpong,+Tangerang+Selatan,+Banten&output=embed" loading="lazy" className="h-80 w-full rounded-xl border-0" /></div></section>; }
