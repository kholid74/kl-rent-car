import Link from "next/link";

import { AREAS, SITE } from "@/lib/site";

const LAYANAN = [
  { href: "/layanan/lepas-kunci", label: "Rental Lepas Kunci" },
  { href: "/layanan/dengan-sopir", label: "Rental Dengan Sopir" },
  { href: "/layanan/rental-bulanan", label: "Rental Bulanan" },
  { href: "/layanan/corporate", label: "Rental Korporat" },
] as const;

const PERUSAHAAN = [
  { href: "/tentang-kami", label: "Tentang Kami" },
  { href: "/armada", label: "Armada" },
  { href: "/harga", label: "Daftar Harga" },
  { href: "/faq", label: "FAQ" },
  { href: "/kontak", label: "Kontak" },
  { href: "/syarat-ketentuan", label: "Syarat & Ketentuan" },
] as const;

const LOKASI = [
  { href: "/rental-mobil/jakarta-selatan", label: "Rental Mobil Jakarta Selatan" },
  { href: "/rental-mobil/tangerang-selatan", label: "Rental Mobil Tangerang Selatan" },
] as const;

function Column({ title, links }: { title: string; links: readonly { href: string; label: string }[] }) {
  return (
    <div>
      <h2 className="font-display text-sm font-bold uppercase tracking-wider text-white">{title}</h2>
      <ul className="mt-4 space-y-2">
        {links.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className="text-sm text-white/75 transition-colors hover:text-amber-500">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-20 bg-navy-900 text-white">
      <div className="mx-auto max-w-7xl px-4 py-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="font-display text-xl font-extrabold">
              KL<span className="text-amber-500">.</span>Rent Car
            </p>
            <p className="mt-3 text-sm text-white/75">{SITE.legalName}</p>
            <address className="mt-4 space-y-1 text-sm not-italic text-white/75">
              <p>{SITE.address.street}</p>
              <p>
                {SITE.address.locality} {SITE.address.postalCode}
              </p>
              <p>
                <a href={`mailto:${SITE.email}`} className="transition-colors hover:text-amber-500">
                  {SITE.email}
                </a>
              </p>
            </address>
            <p className="mt-4 text-sm text-white/75">
              Setiap hari {SITE.hours.open}–{SITE.hours.close} WIB
            </p>
          </div>

          <Column title="Layanan" links={LAYANAN} />
          <Column title="Perusahaan" links={PERUSAHAAN} />

          <div>
            <Column title="Area Layanan" links={LOKASI} />
            <p className="mt-4 text-sm text-white/60">{AREAS.join(" · ")}</p>
          </div>
        </div>

        <div className="road-divider mt-12 opacity-60" aria-hidden="true" />

        <div className="mt-6 flex flex-col gap-2 text-sm text-white/60 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {SITE.legalName}
          </p>
          {/* Testimoni, rating, dan legalitas di situs ini karangan. Menyebutnya
              sekali di footer memenuhi janji transparansi tanpa mengulanginya
              di setiap section. */}
          <p>
            Situs demo — nama, harga, alamat, dan testimoni bersifat fiktif. Dibuat oleh{" "}
            <a
              href="https://kalsara.id"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-white/80 underline underline-offset-2 hover:text-amber-500"
            >
              Kalsara Digital Studio
            </a>
            .
          </p>
        </div>
      </div>
    </footer>
  );
}
