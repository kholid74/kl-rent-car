import type { Metadata } from "next";
import Link from "next/link";

import { Accordion } from "@/components/Accordion";
import { AvailabilityWidget } from "@/components/AvailabilityWidget";
import { SectionHeading } from "@/components/SectionHeading";
import { ServiceCard } from "@/components/ServiceCard";
import { TestimonialCard } from "@/components/TestimonialCard";
import { TrustChips } from "@/components/TrustChips";
import { VehicleCard } from "@/components/VehicleCard";
import { WaButton } from "@/components/WaButton";
import { FAQ_HOME } from "@/lib/content/faq";
import { SERVICES } from "@/lib/content/services";
import { TESTIMONIALS } from "@/lib/content/testimonials";
import { BOOKING_STEPS, WHY_US } from "@/lib/content/why-us";
import { AREAS, SITE } from "@/lib/site";
import { listVehicleCards } from "@/lib/vehicles";

export const metadata: Metadata = {
  title: undefined, // pakai title default dari root layout
  description:
    "Rental mobil Jakarta Selatan & Tangerang Selatan sejak 2016. Lepas kunci mulai Rp300.000/hari, dengan sopir mulai Rp650.000/12 jam. Harga tercantum, unit terawat, balasan WhatsApp di bawah 5 menit.",
  alternates: { canonical: "/" },
};

const LOKASI = [
  { href: "/rental-mobil/jakarta-selatan", label: "Rental Mobil Jakarta Selatan" },
  { href: "/rental-mobil/tangerang-selatan", label: "Rental Mobil Tangerang Selatan" },
];

export default async function HomePage() {
  // Satu query: widget hero butuh seluruh unit, section armada hanya enam teratas.
  const all = await listVehicleCards();
  const featured = all.slice(0, 6);

  return (
    <>
      {/* 1. Hero */}
      <section className="relative isolate overflow-hidden bg-navy-900">
        {/* Foto hero dimuat eager dan berprioritas tinggi: ia elemen LCP halaman
            ini. Kualitasnya sengaja rendah karena tertutup overlay pekat —
            mata tidak melihat bedanya, Lighthouse melihat. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/hero.webp"
          alt=""
          aria-hidden="true"
          width={1600}
          height={900}
          fetchPriority="high"
          className="absolute inset-0 -z-10 size-full object-cover"
        />
        {/* Overlay pekat, bukan tipis: teks putih di atas foto harus tetap lolos
            kontras AA berapa pun terang foto di baliknya. */}
        <div className="absolute inset-0 -z-10 bg-navy-900/85" aria-hidden="true" />

        <div className="mx-auto max-w-7xl px-4 py-16 lg:py-24">
          <div className="grid items-start gap-12 lg:grid-cols-[1.15fr_1fr]">
            <div>
              <h1 className="font-display text-3xl font-extrabold leading-tight text-white sm:text-4xl lg:text-5xl">
                Rental Mobil Jakarta &amp; Tangerang Selatan, Mulai Rp300.000/hari
              </h1>
              <div className="road-divider mt-5 w-32" aria-hidden="true" />
              <p className="mt-5 text-lg text-white/85">
                Unit terawat dan difoto apa adanya, harga tercantum tanpa biaya tersembunyi, dan
                balasan WhatsApp di bawah 5 menit selama jam layanan.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <WaButton context={{ kind: "umum", path: "/" }} size="lg" />
                <Link
                  href="/armada"
                  className="inline-flex min-h-14 items-center justify-center rounded-lg border-2 border-white px-7 text-lg font-semibold text-white transition-colors hover:bg-white hover:text-navy-900"
                >
                  Lihat Armada
                </Link>
              </div>

              <div className="mt-8">
                <TrustChips
                  tone="dark"
                  chips={[
                    { label: `Sejak ${SITE.foundedYear}` },
                    { label: "25+ Unit Terawat" },
                    { label: `Layanan ${SITE.hours.open}–${SITE.hours.close}` },
                  ]}
                />
              </div>
            </div>

            <AvailabilityWidget units={all.map((v) => ({ slug: v.slug, name: v.name }))} />
          </div>
        </div>
      </section>

      {/* 2. Trust bar */}
      <section className="border-y border-road-200 bg-white">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="text-sm font-semibold text-navy-900">Badan usaha resmi</p>
            <p className="mt-1 text-sm text-navy-700/80">{SITE.legalName}</p>
          </div>
          <div>
            <p className="text-sm font-semibold text-navy-900">Pembayaran</p>
            <p className="mt-1 text-sm text-navy-700/80">Transfer bank &amp; QRIS</p>
          </div>
          <div>
            <p className="text-sm font-semibold text-navy-900">Unit diasuransikan</p>
            <p className="mt-1 text-sm text-navy-700/80">Seluruh armada tercakup polis</p>
          </div>
          <div>
            <p className="text-sm font-semibold text-navy-900">Penilaian pelanggan</p>
            {/* Angka ini bagian dari data demo, bukan agregat ulasan sungguhan.
                Penjelasannya cukup sekali di footer — mengulanginya di sini
                mengganggu tanpa menambah kejujuran. */}
            <p className="mt-1 text-sm text-navy-700/80">
              <span className="tabular font-display font-extrabold text-amber-500">
                {SITE.rating.toFixed(1)} ★
              </span>{" "}
              dari pelanggan kami
            </p>
          </div>
        </div>
      </section>

      {/* 3. Armada unggulan */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading
            eyebrow="Armada"
            title="Unit yang paling sering dipesan"
            description="Delapan model tersedia, dari LCGC untuk keliling kota sampai minibus 15 kursi untuk rombongan."
          />
          <Link
            href="/armada"
            className="font-semibold text-navy-700 underline underline-offset-4 hover:text-amber-500"
          >
            Lihat semua armada
          </Link>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((v, i) => (
            <VehicleCard key={v.slug} vehicle={v} priority={i < 3} />
          ))}
        </div>
      </section>

      {/* 4. Layanan */}
      <section className="bg-road-100">
        <div className="mx-auto max-w-7xl px-4 py-16">
          <SectionHeading
            eyebrow="Layanan"
            title="Empat cara menyewa"
            description="Pilih yang paling cocok dengan kebutuhan Anda. Kalau masih ragu, chat kami dan ceritakan rencananya."
          />
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {SERVICES.map((s) => (
              <ServiceCard key={s.slug} service={s} />
            ))}
          </div>
        </div>
      </section>

      {/* 5. Cara booking 3 langkah */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <SectionHeading eyebrow="Cara booking" title="Tiga langkah, selesai" />
        <ol className="mt-10 grid gap-6 md:grid-cols-3">
          {BOOKING_STEPS.map((step, i) => (
            <li key={step.title} className="rounded-xl border border-road-200 bg-white p-6">
              <span className="tabular font-display text-3xl font-extrabold text-amber-500">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-3 font-display text-lg font-bold text-navy-900">{step.title}</h3>
              <p className="mt-2 text-sm text-navy-700">{step.body}</p>
            </li>
          ))}
        </ol>
        <div className="mt-8 flex flex-wrap gap-3">
          <WaButton context={{ kind: "umum", path: "/" }} />
          <Link
            href="/booking"
            className="inline-flex min-h-12 items-center justify-center rounded-lg border-2 border-navy-900 px-5 font-semibold text-navy-900 transition-colors hover:bg-navy-900 hover:text-white"
          >
            Isi Form Booking
          </Link>
        </div>
      </section>

      {/* 6. Why us */}
      <section className="bg-navy-900 text-white">
        <div className="mx-auto max-w-7xl px-4 py-16">
          <div className="max-w-2xl">
            <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-white/60">
              Kenapa kami
            </p>
            <h2 className="font-display text-2xl font-extrabold sm:text-3xl">
              Empat hal yang kami jaga sejak {SITE.foundedYear}
            </h2>
            <div className="road-divider mt-4 w-24" aria-hidden="true" />
          </div>
          <div className="mt-10 grid gap-8 sm:grid-cols-2">
            {WHY_US.map((v) => (
              <div key={v.title}>
                <h3 className="font-display text-lg font-bold">{v.title}</h3>
                <p className="mt-2 text-white/75">{v.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Testimoni */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <SectionHeading
          eyebrow="Testimoni"
          title="Kata penyewa kami"
          description={`Penilaian rata-rata ${SITE.rating.toFixed(1)} dari 5.`}
        />
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {TESTIMONIALS.slice(0, 4).map((t) => (
            <TestimonialCard key={t.name} testimonial={t} />
          ))}
        </div>
      </section>

      {/* 8. Area layanan */}
      <section className="bg-road-100">
        <div className="mx-auto max-w-7xl px-4 py-16">
          <SectionHeading
            eyebrow="Area layanan"
            title="Antar-jemput di seluruh Jabodetabek"
            description="Wilayah utama kami Tangerang Selatan dan Jakarta Selatan. Unit boleh dibawa ke luar kota dengan pemberitahuan di awal."
          />
          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            {LOKASI.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="group flex items-center justify-between gap-4 rounded-xl border border-road-200 bg-white p-6 transition-shadow hover:shadow-md"
              >
                <span className="font-display text-lg font-bold text-navy-900 group-hover:text-navy-700">
                  {l.label}
                </span>
                <svg
                  viewBox="0 0 24 24"
                  className="size-5 shrink-0 text-amber-500"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </Link>
            ))}
          </div>
          <p className="mt-6 text-navy-700">
            Kami juga melayani {AREAS.slice(2).join(", ")}.
          </p>
        </div>
      </section>

      {/* 9. FAQ ringkas */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.6fr]">
          <SectionHeading
            eyebrow="FAQ"
            title="Pertanyaan yang paling sering masuk"
            description="Selebihnya ada di halaman FAQ, atau tanyakan langsung lewat WhatsApp."
          />
          <div>
            <Accordion items={FAQ_HOME} />
            <Link
              href="/faq"
              className="mt-6 inline-block font-semibold text-navy-700 underline underline-offset-4 hover:text-amber-500"
            >
              Lihat semua pertanyaan
            </Link>
          </div>
        </div>
      </section>

      {/* 10. Kontak + peta */}
      <section className="border-t border-road-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-16">
          <SectionHeading eyebrow="Kontak" title="Mampir atau chat dulu" />
          <div className="mt-10 grid gap-10 lg:grid-cols-2">
            <div>
              <address className="space-y-1 not-italic text-navy-700">
                <p className="font-display text-lg font-bold text-navy-900">{SITE.name}</p>
                <p>{SITE.address.street}</p>
                <p>
                  {SITE.address.locality} {SITE.address.postalCode}
                </p>
                <p>
                  <a href={`mailto:${SITE.email}`} className="underline underline-offset-4 hover:text-amber-500">
                    {SITE.email}
                  </a>
                </p>
              </address>

              <dl className="mt-6 border-t border-road-200 pt-6">
                <dt className="font-semibold text-navy-900">Jam operasional</dt>
                <dd className="text-navy-700">
                  Setiap hari, {SITE.hours.open}–{SITE.hours.close} WIB
                </dd>
              </dl>

              <div className="mt-8">
                <WaButton context={{ kind: "umum", path: "/" }} size="lg" />
              </div>
            </div>

            {/* Peta diletakkan di section paling bawah dan dimuat malas: iframe
                Google membawa skrip pihak ketiga, dan menaruhnya lebih tinggi
                akan menggerus LCP halaman ini. */}
            <div className="overflow-hidden rounded-xl border border-road-200">
              <iframe
                title={`Peta lokasi kantor ${SITE.name}`}
                src="https://www.google.com/maps?q=Serpong,+Tangerang+Selatan,+Banten&output=embed"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="h-80 w-full border-0"
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
