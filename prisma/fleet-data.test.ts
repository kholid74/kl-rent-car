import { test } from "node:test";
import assert from "node:assert/strict";

import { FLEET, IMAGES_PER_UNIT, TOTAL_PHYSICAL_UNITS, imagePaths } from "./fleet-data";

test("slug setiap unit unik — slug adalah URL publik dan kunci upsert seed", () => {
  const slugs = FLEET.map((u) => u.slug);
  assert.equal(new Set(slugs).size, slugs.length);
  for (const slug of slugs) {
    assert.match(slug, /^[a-z0-9]+(-[a-z0-9]+)*$/, `slug tidak ramah URL: ${slug}`);
  }
});

test("total mobil fisik >= 25 — hero dan Tentang Kami mengklaim '25+ unit'", () => {
  assert.ok(
    TOTAL_PHYSICAL_UNITS >= 25,
    `klaim "25+ unit" jadi bohong: total hanya ${TOTAL_PHYSICAL_UNITS}`,
  );
});

test("setiap unit punya minimal satu layanan yang bisa dipesan", () => {
  for (const u of FLEET) {
    assert.ok(u.priceWithDriver > 0, `${u.slug} tidak punya harga dengan sopir`);
    if (u.priceSelfDrive !== null) {
      assert.ok(u.priceSelfDrive > 0, `${u.slug} punya harga lepas kunci nol`);
    }
  }
});

test("unit driver-only memang unit besar/premium — bukan salah isi data", () => {
  const driverOnly = FLEET.filter((u) => u.priceSelfDrive === null).map((u) => u.slug);
  assert.deepEqual(driverOnly, ["toyota-alphard", "toyota-hiace-commuter"]);
});

test("lepas kunci selalu lebih murah dari paket 12 jam dengan sopir", () => {
  for (const u of FLEET) {
    if (u.priceSelfDrive === null) continue;
    assert.ok(
      u.priceSelfDrive < u.priceWithDriver,
      `${u.slug}: lepas kunci ${u.priceSelfDrive} >= dengan sopir ${u.priceWithDriver}`,
    );
  }
});

test("konten per unit memenuhi ambang minimum spec", () => {
  for (const u of FLEET) {
    assert.ok(
      u.description.split("\n\n").length >= 2,
      `${u.slug}: deskripsi kurang dari 2 paragraf`,
    );
    assert.ok(u.facilities.length >= 4, `${u.slug}: fasilitas kurang dari 4 item`);
    assert.ok(u.facilities.length <= 6, `${u.slug}: fasilitas lebih dari 6 item`);
    assert.ok(u.year >= 2022 && u.year <= 2025, `${u.slug}: tahun di luar rentang 2022-2025`);
  }
});

test("deskripsi tidak dipakai ulang antar unit", () => {
  const firstSentences = FLEET.map((u) => u.description.slice(0, 80));
  assert.equal(new Set(firstSentences).size, FLEET.length);
});

test("path gambar konsisten dengan slug", () => {
  for (const u of FLEET) {
    const paths = imagePaths(u.slug);
    assert.equal(paths.length, IMAGES_PER_UNIT);
    assert.equal(paths[0], `/images/armada/${u.slug}-1.svg`);
  }
});
