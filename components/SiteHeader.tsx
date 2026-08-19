"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const NAV = [
  { href: "/armada", label: "Armada" },
  { href: "/layanan", label: "Layanan" },
  { href: "/harga", label: "Harga" },
  { href: "/tentang-kami", label: "Tentang Kami" },
  { href: "/faq", label: "FAQ" },
  { href: "/kontak", label: "Kontak" },
] as const;

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-road-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3">
        <Link href="/" className="font-display text-xl font-extrabold text-navy-900" onClick={() => setOpen(false)}>
          KL<span className="text-amber-500">.</span>Rent Car
        </Link>

        <nav className="ml-auto hidden lg:block" aria-label="Navigasi utama">
          <ul className="flex items-center gap-1">
            {NAV.map((item) => {
              const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={`rounded-md px-3 py-2 text-sm font-semibold transition-colors ${
                      active ? "text-amber-500" : "text-navy-700 hover:text-navy-900"
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <Link
          href="/booking"
          className="ml-auto hidden min-h-11 items-center rounded-lg bg-navy-900 px-5 text-sm font-semibold text-white transition-colors hover:bg-navy-700 lg:ml-0 lg:inline-flex"
        >
          Booking Sekarang
        </Link>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="menu-mobile"
          aria-label={open ? "Tutup menu" : "Buka menu"}
          className="ml-auto grid size-11 place-items-center rounded-lg border border-road-200 text-navy-900 lg:hidden"
        >
          <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
            {open ? <path d="M6 6l12 12M18 6 6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
        </button>
      </div>

      {open ? (
        <nav id="menu-mobile" className="border-t border-road-200 lg:hidden" aria-label="Navigasi utama seluler">
          <ul className="mx-auto max-w-7xl px-4 py-2">
            {NAV.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="flex min-h-12 items-center border-b border-road-100 font-semibold text-navy-900 last:border-0"
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li className="py-3">
              <Link
                href="/booking"
                onClick={() => setOpen(false)}
                className="flex min-h-12 items-center justify-center rounded-lg bg-navy-900 font-semibold text-white"
              >
                Booking Sekarang
              </Link>
            </li>
          </ul>
        </nav>
      ) : null}
    </header>
  );
}
