import type { Metadata } from "next";
import { Accordion } from "@/components/Accordion";
import { FAQ } from "@/lib/content/faq";
import { PageTitle } from "../_components/PageTitle";
export const metadata: Metadata = { title: "FAQ" };
export default function FaqPage() { return <section className="mx-auto max-w-4xl px-4 py-14"><PageTitle eyebrow="FAQ" title="Pertanyaan yang sering diajukan" description="Informasi syarat, harga, pembayaran, dan penggunaan layanan." /><div className="mt-9"><Accordion items={FAQ} /></div></section>; }
