import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";

import { DEMO_MODE, SITE, SITE_URL } from "@/lib/site";
import "./globals.css";

// Plus Jakarta Sans dipilih untuk heading karena typeface-nya dirancang di
// Jakarta — identitas lokal yang relevan untuk bisnis rental Jabodetabek.
const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["700", "800"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE.name} — ${SITE.tagline}`,
    template: `%s | ${SITE.name} — Rental Mobil Jakarta & Tangsel`,
  },
  description:
    "Sewa mobil harian, mingguan, dan bulanan di Jakarta & Tangerang Selatan. Lepas kunci atau dengan sopir, harga transparan tanpa biaya tersembunyi.",
  // Situs demo tidak boleh bersaing di hasil pencarian dengan operator rental
  // sungguhan. Struktur SEO tetap lengkap agar bisa didemokan ke klien.
  robots: DEMO_MODE ? { index: false, follow: false } : undefined,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="id" className={`${jakarta.variable} ${inter.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
