/**
 * Membuat placeholder foto armada sebagai SVG di public/images/armada/.
 *
 * Situs demo ini tidak boleh memakai foto berhak cipta dan tidak boleh hotlink
 * ke internet, jadi setiap unit diwakili ilustrasi yang dibangun di sini.
 * Siluetnya bukan gambar tangan melainkan dirakit dari beberapa primitif yang
 * proporsinya diatur per kategori, sehingga LCGC benar-benar terlihat pendek
 * dan MINIBUS benar-benar terlihat panjang di kartu armada.
 *
 * Jalankan: npm run images:gen
 * Pemilik situs yang ingin memasang foto asli cukup menimpa file .svg dengan
 * .jpg bernama sama lalu menyesuaikan ekstensi di prisma/fleet-data.ts.
 */

import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import { FLEET, IMAGES_PER_UNIT, type VehicleCategory } from "../prisma/fleet-data.ts";

const OUT_DIR = join(process.cwd(), "public", "images", "armada");

const NAVY_900 = "#0F2A43";
const NAVY_700 = "#1D4568";
const AMBER = "#E8A020";

/**
 * Tiga gambar per unit dibedakan lewat framing, bukan rotasi bodi. Memiringkan
 * siluet membuatnya terbaca sebagai mobil menanjak, bukan sebagai sudut pandang
 * lain — jadi galeri memakai satu pose dan tiga jarak pandang.
 */
const ANGLES = ["Tampak Samping", "Detail Depan", "Detail Belakang"] as const;

type Proportions = {
  /** Panjang bodi relatif terhadap lebar kanvas. */
  length: number;
  /** Tinggi bodi dari sumbu roda. */
  bodyHeight: number;
  /** Tinggi kabin di atas bodi. */
  cabinHeight: number;
  /** Seberapa jauh kabin masuk ke dalam dari ujung bodi (0 = boxy, besar = sporty). */
  cabinInset: number;
  /** Jari-jari roda. */
  wheel: number;
  /** Jarak sumbu roda ke tanah — ground clearance. */
  clearance: number;
  /** Warna tint latar, membedakan kelas secara halus. */
  tint: string;
};

// Proporsi sengaja dilebih-lebihkan. Angka yang realistis membuat LCGC dan MPV
// terlihat kembar di ukuran kartu, dan kartu armada adalah tempat gambar ini
// paling sering dilihat.
const PROPORTIONS: Record<VehicleCategory, Proportions> = {
  LCGC: { length: 0.5, bodyHeight: 68, cabinHeight: 76, cabinInset: 96, wheel: 56, clearance: 24, tint: "#E8EEF4" },
  MPV: { length: 0.66, bodyHeight: 88, cabinHeight: 104, cabinInset: 88, wheel: 62, clearance: 32, tint: "#E4EBF2" },
  SUV: { length: 0.7, bodyHeight: 100, cabinHeight: 98, cabinInset: 78, wheel: 86, clearance: 64, tint: "#E2E9F1" },
  PREMIUM: { length: 0.74, bodyHeight: 116, cabinHeight: 130, cabinInset: 58, wheel: 64, clearance: 26, tint: "#E6E9F3" },
  MINIBUS: { length: 0.88, bodyHeight: 148, cabinHeight: 132, cabinInset: 34, wheel: 68, clearance: 36, tint: "#E3EDF0" },
};

const W = 1200;
const H = 900; // rasio 4:3, sesuai kartu armada di spec
/** Tinggi pita informasi di bawah. Teks tidak pernah menimpa ilustrasi. */
const BAND = 168;
/** Garis tanah tempat roda menapak. */
const GROUND = H - BAND - 40;

function escapeXml(s: string): string {
  return s.replace(/[<>&"']/g, (c) => `&#${c.charCodeAt(0)};`);
}

/**
 * Siluet kendaraan tampak samping. Dirakit dari bodi membulat, kabin trapesium,
 * dan dua roda; semua ukuran diturunkan dari proporsi kategori. Bagian depan
 * mobil ada di sisi kiri kanvas.
 */
function silhouette(p: Proportions): string {
  const bodyW = W * p.length;
  const x0 = (W - bodyW) / 2;
  const wheelY = GROUND - p.wheel;
  const axisY = wheelY - p.clearance;
  const bodyTop = axisY - p.bodyHeight;
  const cabinTop = bodyTop - p.cabinHeight;

  const cabinLeft = x0 + p.cabinInset;
  const cabinRight = x0 + bodyW - p.cabinInset * 0.75;
  // Kaca depan lebih miring daripada kaca belakang pada semua kelas.
  const cabinTopLeft = cabinLeft + p.cabinInset * 0.42;
  const cabinTopRight = cabinRight - p.cabinInset * 0.2;

  const frontWheelX = x0 + bodyW * 0.22;
  const rearWheelX = x0 + bodyW * 0.79;

  return `
  <g>
    <ellipse cx="${W / 2}" cy="${GROUND + 14}" rx="${bodyW * 0.52}" ry="18" fill="${NAVY_900}" opacity="0.10"/>
    <path d="
      M ${x0} ${bodyTop + 26}
      Q ${x0} ${bodyTop} ${x0 + 26} ${bodyTop}
      L ${cabinLeft} ${bodyTop}
      L ${cabinTopLeft} ${cabinTop}
      L ${cabinTopRight} ${cabinTop}
      L ${cabinRight} ${bodyTop}
      L ${x0 + bodyW - 26} ${bodyTop}
      Q ${x0 + bodyW} ${bodyTop} ${x0 + bodyW} ${bodyTop + 26}
      L ${x0 + bodyW} ${axisY}
      L ${x0} ${axisY}
      Z" fill="${NAVY_700}"/>
    <path d="
      M ${cabinLeft + 14} ${bodyTop - 12}
      L ${cabinTopLeft + 14} ${cabinTop + 16}
      L ${cabinTopRight - 14} ${cabinTop + 16}
      L ${cabinRight - 14} ${bodyTop - 12}
      Z" fill="#FFFFFF" opacity="0.32"/>
    <circle cx="${frontWheelX}" cy="${wheelY}" r="${p.wheel}" fill="${NAVY_900}"/>
    <circle cx="${frontWheelX}" cy="${wheelY}" r="${p.wheel * 0.3}" fill="${NAVY_700}"/>
    <circle cx="${rearWheelX}" cy="${wheelY}" r="${p.wheel}" fill="${NAVY_900}"/>
    <circle cx="${rearWheelX}" cy="${wheelY}" r="${p.wheel * 0.3}" fill="${NAVY_700}"/>
  </g>`;
}

/**
 * Transform kamera untuk tiap varian. Varian 1 memuat seluruh mobil; varian 2
 * dan 3 mendekat ke ujung depan dan ujung belakang. Karena bagian depan berada
 * di kiri, mendekat ke depan berarti menggeser kanvas ke kanan.
 */
function camera(p: Proportions, variant: number): string {
  if (variant === 1) return "";
  const zoom = 1.35;
  const bodyW = W * p.length;
  // Titik pada bodi yang diletakkan di tengah frame secara horizontal.
  const focusX = variant === 2 ? (W - bodyW) / 2 + bodyW * 0.2 : (W - bodyW) / 2 + bodyW * 0.82;
  const tx = W / 2 - focusX * zoom;
  // Zoom bertumpu pada garis tanah, supaya roda tetap menapak dan atap tidak
  // terpotong ke luar frame saat diperbesar.
  const ty = GROUND * (1 - zoom);
  return ` transform="translate(${tx.toFixed(1)} ${ty.toFixed(1)}) scale(${zoom})"`;
}

function render(unit: (typeof FLEET)[number], variant: number): string {
  const p = PROPORTIONS[unit.category];
  const angle = ANGLES[variant - 1] ?? ANGLES[0];
  const title = `${unit.name} — ilustrasi ${angle.toLowerCase()}`;
  const specs = `${unit.seats} kursi · ${unit.transmission === "MATIC" ? "Matic" : "Manual"} · ${unit.fuel}`;

  // Lebar pil mengikuti panjang label, bukan angka mati — label terpanjang
  // ("Detail Belakang") kalau tidak akan tumpah keluar pil.
  const badgeW = angle.length * 15 + 56;
  const bandTop = H - BAND;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="${escapeXml(title)}">
  <title>${escapeXml(title)}</title>
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#FFFFFF"/>
      <stop offset="1" stop-color="${p.tint}"/>
    </linearGradient>
    <clipPath id="frame">
      <rect x="0" y="0" width="${W}" height="${bandTop}"/>
    </clipPath>
  </defs>

  <rect width="${W}" height="${H}" fill="url(#bg)"/>

  <g clip-path="url(#frame)">
    <g${camera(p, variant)}>
${silhouette(p)}
    </g>
  </g>

  <!-- pita informasi: menjaga teks tidak pernah menimpa ilustrasi, berapa pun zoom-nya -->
  <rect x="0" y="${bandTop}" width="${W}" height="${BAND}" fill="#FFFFFF"/>
  <!-- marka jalan: elemen tematik yang sama dipakai sebagai divider heading di seluruh situs -->
  <line x1="0" y1="${bandTop}" x2="${W}" y2="${bandTop}" stroke="${AMBER}" stroke-width="7"
        stroke-dasharray="64 44" stroke-linecap="round"/>

  <g font-family="Plus Jakarta Sans, Inter, system-ui, sans-serif">
    <text x="64" y="${bandTop + 72}" font-size="46" font-weight="800" fill="${NAVY_900}">${escapeXml(unit.name)}</text>
    <text x="64" y="${bandTop + 122}" font-size="28" font-weight="500" fill="${NAVY_700}" opacity="0.75">${escapeXml(specs)}</text>

    <rect x="${W - badgeW - 56}" y="56" width="${badgeW}" height="58" rx="29" fill="${NAVY_900}" opacity="0.92"/>
    <text x="${W - badgeW / 2 - 56}" y="94" font-size="26" font-weight="600" fill="#FFFFFF" text-anchor="middle">${escapeXml(angle)}</text>

    <text x="${W - 64}" y="${bandTop + 122}" font-size="22" font-weight="500" fill="${NAVY_700}" opacity="0.5"
          text-anchor="end">Foto ilustrasi — demo</text>
  </g>
</svg>
`;
}

function main() {
  mkdirSync(OUT_DIR, { recursive: true });
  let written = 0;
  for (const unit of FLEET) {
    for (let v = 1; v <= IMAGES_PER_UNIT; v++) {
      writeFileSync(join(OUT_DIR, `${unit.slug}-${v}.svg`), render(unit, v), "utf8");
      written++;
    }
  }
  console.log(`${written} ilustrasi ditulis ke public/images/armada/`);
}

main();
