import type { Metadata } from "next";
import { PageTitle } from "../_components/PageTitle";
import { SITE } from "@/lib/site";
export const metadata: Metadata = { title: "Tentang Kami" };
export default function AboutPage() { return <article className="mx-auto max-w-4xl px-4 py-14"><PageTitle eyebrow="Tentang kami" title="Perjalanan nyaman dimulai dari layanan yang jelas" description={`${SITE.name} melayani kebutuhan perjalanan pribadi dan perusahaan di Tangerang Selatan, Jakarta Selatan, dan sekitarnya.`} /><div className="mt-8 space-y-4 text-navy-700"><p>Sejak {SITE.foundedYear}, kami menyediakan pilihan kendaraan untuk perjalanan harian, keluarga, dan kebutuhan operasional. Setiap paket dijelaskan di awal agar penyewa memahami harga dan ketentuannya.</p><p>Tim kami membantu memilih unit, memastikan jadwal, dan mengatur penjemputan melalui WhatsApp.</p></div></article>; }
