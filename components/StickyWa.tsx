"use client";

import { usePathname } from "next/navigation";

import { buildWaLink } from "@/lib/wa";

/**
 * Tombol WhatsApp mengambang di seluruh halaman publik. Ditaruh di kanan bawah —
 * jangkauan ibu jari di ponsel, tempat mayoritas pengunjung membaca situs ini.
 *
 * Pesannya menyertakan URL halaman asal supaya admin tahu pengunjung sedang
 * melihat apa saat memutuskan untuk chat.
 */
export function StickyWa() {
  const pathname = usePathname();

  return (
    <a
      href={buildWaLink({ kind: "umum", path: pathname })}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-5 right-5 z-50 inline-flex min-h-14 items-center gap-2 rounded-full bg-wa px-5 font-semibold text-white shadow-lg transition-colors hover:bg-wa-dark"
    >
      <svg viewBox="0 0 24 24" className="size-6 shrink-0" fill="currentColor" aria-hidden="true">
        <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.9-4.45 9.9-9.91C21.95 6.45 17.5 2 12.04 2Zm5.8 14.16c-.24.68-1.4 1.3-1.94 1.35-.5.05-1.13.07-1.82-.11a16.6 16.6 0 0 1-1.65-.61c-2.9-1.25-4.8-4.17-4.94-4.36-.15-.19-1.19-1.58-1.19-3.02 0-1.43.75-2.14 1.02-2.43a1.07 1.07 0 0 1 .78-.37c.19 0 .39 0 .56.01.18.01.42-.07.66.5.24.58.82 2.01.89 2.16.07.15.12.32.02.51-.1.19-.15.31-.29.48-.15.17-.31.38-.44.51-.15.14-.3.3-.13.59.17.29.76 1.25 1.63 2.03 1.12 1 2.06 1.3 2.35 1.45.29.15.46.12.63-.07.17-.19.73-.85.92-1.14.19-.29.39-.24.65-.15.27.1 1.69.8 1.98.94.29.15.48.22.55.34.07.12.07.68-.17 1.36Z" />
      </svg>
      <span className="hidden sm:inline">Chat WhatsApp</span>
      <span className="sr-only sm:hidden">Chat WhatsApp</span>
    </a>
  );
}
