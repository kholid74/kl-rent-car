"use client";

import { useState } from "react";

/**
 * Pengunjung berhak tahu bahwa harga, testimoni, dan legalitas di situs ini
 * fiktif — tanpa itu, demo portofolio berubah jadi klaim yang menyesatkan.
 *
 * Status tutup disimpan di state komponen saja. Spec melarang localStorage dan
 * sessionStorage, dan di sini larangan itu kebetulan menguntungkan: banner
 * muncul lagi bagi setiap pengunjung baru sesi, yang justru diinginkan.
 */
export function DemoBanner() {
  const [open, setOpen] = useState(true);
  if (!open) return null;

  return (
    <div className="bg-navy-900 text-white">
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-2 text-sm">
        <p className="flex-1">
          Website demo oleh{" "}
          <a
            href="https://kalsara.id"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold underline underline-offset-2 hover:text-amber-500"
          >
            Kalsara Digital Studio
          </a>{" "}
          — seluruh data bisnis di halaman ini fiktif.
        </p>
        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-label="Tutup banner demo"
          className="-mr-1 grid size-8 shrink-0 place-items-center rounded-md transition-colors hover:bg-white/15"
        >
          <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
            <path d="M6 6l12 12M18 6 6 18" />
          </svg>
        </button>
      </div>
    </div>
  );
}
