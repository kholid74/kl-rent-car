/**
 * Mengunduh foto armada dari Unsplash ke public/images/armada/.
 *
 * Foto ini generik — bukan unit yang sebenarnya, dan bukan model mobil yang
 * persis sama dengan nama di katalog. Itu keputusan pemilik proyek yang
 * disepakati sadar; mitigasinya, kartu armada tetap memberi label "Foto
 * ilustrasi" sehingga pengunjung tidak menyangka melihat unit sungguhan.
 *
 * Bentuk bodi tetap dicocokkan per kategori (hatchback untuk LCGC, van untuk
 * MINIBUS) supaya ketidakcocokannya sekecil mungkin.
 *
 * Berkas diunduh, bukan di-hotlink: spec melarang menautkan gambar dari
 * internet, dan situs demo tidak boleh bergantung pada host pihak lain.
 *
 * Jalankan: node scripts/fetch-vehicle-photos.mjs
 * Lalu: npm run db:seed   (resolver akan memilih .webp di atas .svg)
 */

import { writeFile, mkdir } from "node:fs/promises";
import { join } from "node:path";

// Diminta sebagai webp 4:3 seukuran kartu — jauh lebih ringan daripada JPEG
// 3000px bawaan, dan Lighthouse >= 90 adalah kriteria penerimaan nanti.
const PARAMS = "?fm=webp&w=1000&h=750&fit=crop&crop=entropy&q=65";

/**
 * Tiga foto per unit, dipilih tangan setelah diperiksa satu per satu.
 *
 * Pencarian kata kunci saja tidak cukup: "minivan" mengembalikan barisan van
 * kargo, "shuttle bus" mengembalikan bus kota ber-papan trayek dan kendaraan
 * wisata listrik. Keduanya sempat masuk dan harus diganti setelah dilihat.
 *
 * Kelas MPV kecil praktis tidak terwakili di Unsplash, jadi Avanza memakai
 * mobil penumpang bersih yang bukan MPV. Itu kompromi yang disadari.
 */
const PHOTOS = {
  "honda-brio-satya": [
    ["photo-1471444928139-48c5bf5173f8", "Robert Haverly"],
    ["photo-1714225317039-d685f0e1cd38", "Zakaria Issaad"],
    ["photo-1586201047938-f117c409e2d7", "Dzmitry Tselabionak"],
  ],
  "toyota-avanza": [
    ["photo-1519641471654-76ce0107ad1b", "Tabea Schimpf"],
    ["photo-1688715680251-153b3e0ad21c", "Swansway Motor Group"],
    ["photo-1529369623266-f5264b696110", "Jamie Street"],
  ],
  "daihatsu-xenia": [
    ["photo-1623371857133-6d5552bbdc13", "Isaac Martin"],
    ["photo-1675311149330-ff19be4aa6be", "Cambo Auto"],
    ["photo-1648902180388-e52c0fdebcd4", "Caden Bern"],
  ],
  "toyota-innova-reborn-diesel": [
    ["photo-1675311401495-6fb9a4564573", "Cambo Auto"],
    ["photo-1653978681856-ab2f1feb221b", "Hyundai Motor Group"],
    ["photo-1649553324097-dec0c232be42", "Mandell Smock"],
  ],
  "toyota-innova-zenix-hybrid": [
    ["photo-1690278289651-895463644114", "Nick Mollenbeck"],
    ["photo-1748215210939-ad8b6c8c086d", "Zoshua Colah"],
    ["photo-1622791905066-0fe6af17ad80", "Harsh Sharma"],
  ],
  "toyota-fortuner": [
    ["photo-1506015391300-4802dc74de2e", "Quilia"],
    ["photo-1622893288761-823ba60f17a6", "Hamza Younas"],
    ["photo-1598248691267-4a62dfdfd8a8", "Erik Mclean"],
  ],
  "toyota-alphard": [
    ["photo-1746985094087-e703bf52c71b", "Mehan Talukder"],
    ["photo-1495433488004-859bdc27b1f4", "Quilia"],
    ["photo-1669887058626-77dea2765b79", "Alina Nichepurenko"],
  ],
  "toyota-hiace-commuter": [
    ["photo-1596979240348-970331045946", "Ignat Kushnarev"],
    ["photo-1535655685871-dc8158ff167e", "Fachy Marin"],
    ["photo-1605410791216-3d9653a95667", "Leo_Visions"],
  ],
};

/** Foto latar hero. Kualitas rendah disengaja: tertutup overlay pekat. */
const HERO = ["photo-1533473359331-0135ef1b58bf", "Sven D"];

const OUT = join(process.cwd(), "public", "images", "armada");

async function main() {
  await mkdir(OUT, { recursive: true });
  const credits = [];
  let ok = 0;

  for (const [slug, picks] of Object.entries(PHOTOS)) {
    for (const [i, [id, photographer]] of picks.entries()) {
      const url = `https://images.unsplash.com/${id}${PARAMS}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`gagal unduh ${id}: HTTP ${res.status}`);

      const bytes = Buffer.from(await res.arrayBuffer());
      const name = `${slug}-${i + 1}.webp`;
      await writeFile(join(OUT, name), bytes);
      credits.push(`| ${name} | ${photographer} | https://unsplash.com/photos/${id.replace("photo-", "")} |`);
      console.log(`${name.padEnd(34)} ${(bytes.length / 1024).toFixed(0)} KB  ${photographer}`);
      ok++;
    }
  }

  {
    const [id, photographer] = HERO;
    const res = await fetch(`https://images.unsplash.com/${id}?fm=webp&w=1600&h=900&fit=crop&crop=entropy&q=35`);
    if (!res.ok) throw new Error(`gagal unduh hero: HTTP ${res.status}`);
    const bytes = Buffer.from(await res.arrayBuffer());
    await writeFile(join(process.cwd(), "public", "images", "hero.webp"), bytes);
    credits.push(`| ../hero.webp | ${photographer} | https://unsplash.com/photos/${id.replace("photo-", "")} |`);
    console.log(`hero.webp${" ".repeat(25)} ${(bytes.length / 1024).toFixed(0)} KB  ${photographer}`);
    ok++;
  }

  await writeFile(
    join(OUT, "CREDITS.md"),
    `# Kredit foto armada

Foto-foto ini diunduh dari Unsplash dan disimpan lokal, bukan di-hotlink.

**Foto ini generik.** Bukan unit milik KL Rent Car, dan bukan model mobil yang
persis sama dengan nama unit di katalog — KL Rent Car sendiri adalah bisnis
fiktif. Kartu armada memberi label "Foto ilustrasi" karena itu.

Lisensi Unsplash tidak mewajibkan atribusi, tapi fotografernya pantas disebut.

| Berkas | Fotografer | Sumber |
|---|---|---|
${credits.join("\n")}

Mengganti dengan foto asli: timpa berkas di folder ini memakai nama yang sama
(ekstensi .webp, .jpg, .jpeg, atau .png), lalu jalankan \`npm run db:seed\`.
`,
    "utf8",
  );

  console.log(`\n${ok} foto tersimpan, CREDITS.md ditulis`);
}

main();
