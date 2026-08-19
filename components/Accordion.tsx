"use client";

import { useId, useState } from "react";

export type AccordionItem = {
  question: string;
  answer: string;
};

/**
 * Accordion FAQ. Dibangun dari button dan region ber-aria, bukan dari
 * <details>, karena spec meminta animasi buka-tutup yang menghormati
 * prefers-reduced-motion — dan <details> tidak memberi kendali itu tanpa
 * JavaScript juga.
 *
 * Hanya satu panel terbuka pada satu waktu: daftar FAQ ini panjang, dan
 * membiarkan semuanya terbuka membuat pengunjung kehilangan tempat.
 */
export function Accordion({ items }: { items: AccordionItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const baseId = useId();

  return (
    <div className="divide-y divide-road-200 overflow-hidden rounded-xl border border-road-200 bg-white">
      {items.map((item, i) => {
        const open = openIndex === i;
        const panelId = `${baseId}-panel-${i}`;
        const buttonId = `${baseId}-button-${i}`;

        return (
          <div key={item.question}>
            <h3>
              <button
                type="button"
                id={buttonId}
                aria-expanded={open}
                aria-controls={panelId}
                onClick={() => setOpenIndex(open ? null : i)}
                className="flex min-h-14 w-full items-center justify-between gap-4 px-5 py-4 text-left font-semibold text-navy-900 transition-colors hover:bg-road-100"
              >
                {item.question}
                <svg
                  viewBox="0 0 24 24"
                  className={`size-5 shrink-0 text-amber-500 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </button>
            </h3>
            <div id={panelId} role="region" aria-labelledby={buttonId} hidden={!open}>
              <p className="px-5 pb-5 text-navy-700">{item.answer}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
