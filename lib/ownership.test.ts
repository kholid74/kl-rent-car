import assert from "node:assert/strict";
import { test } from "node:test";
import { FLEET } from "../prisma/fleet-data";
import { createDemoData, day, overlaps, vehicleAvailable } from "./admin-demo";
import { availableUnit, duration, monthKey, ownerData, ownerIncome, unitStatus } from "./ownership";

test("kepemilikan, isolasi data, kapasitas, dan pembagian pendapatan demo", () => {
  const data = createDemoData(FLEET);
  assert.equal(data.owners.length, 3);
  assert.equal(data.units.length, FLEET.reduce((sum, v) => sum + v.unitCount, 0));
  assert.equal(new Set(data.units.map((u) => u.plate)).size, data.units.length);
  for (const owner of data.owners) {
    const view = ownerData(data, owner.id);
    assert.ok(view.units.length >= 2);
    assert.deepEqual(view.owners.map((o) => o.id), [owner.id]);
    assert.ok(view.units.every((u) => u.ownerId === owner.id));
    assert.ok(view.bookings.every((b) => view.units.some((u) => u.id === b.unitId)));
    assert.ok(view.bookings.every((b) => !b.phone && !b.pickup && !b.note && !b.driver));
    assert.equal(view.drivers.length + view.quotes.length, 0);
    assert.ok(view.bookings.some((b) => b.end.startsWith(monthKey(-1)) && ownerIncome(b) > 0));
  }
  assert.equal(ownerData(data, "unknown").units.length, 0);
  for (const b of data.bookings) {
    assert.ok(data.units.some((u) => u.id === b.unitId && u.vehicle === b.vehicle));
    assert.ok(b.ownerRate === 70 || b.ownerRate === 75);
    assert.ok(duration(b) > 0);
    if (b.status !== "Selesai") assert.equal(ownerIncome(b), 0);
    else assert.equal(ownerIncome(b) + (b.value - ownerIncome(b)), b.value);
    if (["Menunggu", "Dikonfirmasi", "Berjalan"].includes(b.status)) {
      assert.equal(data.bookings.some((other) => other.code !== b.code && other.unitId === b.unitId && overlaps(other, b.start, b.end)), false, b.code);
    }
  }
  const car = data.units.find((u) => u.vehicle === "toyota-alphard")!;
  const existing = data.bookings.find((b) => b.unitId === car.id && b.status === "Menunggu")!;
  assert.equal(availableUnit(data, car.vehicle, existing.start, existing.end), undefined);
  assert.equal(availableUnit(data, car.vehicle, existing.start, existing.end, existing.code)?.id, car.id);
  assert.equal(availableUnit(data, car.vehicle, day(40), day(42))?.id, car.id);
  assert.ok(data.units.some((u) => unitStatus(data, u) === "Sedang Disewa"));
  assert.ok(data.units.some((u) => unitStatus(data, u) === "Tersedia"));
  assert.ok(data.units.some((u) => unitStatus(data, u) === "Sudah Dibooking"));
  assert.equal(duration({ start: "2028-02-28", end: "2028-03-01" }), 3);
  const hiace = data.units.filter((u) => u.vehicle === "toyota-hiace-commuter");
  data.bookings.push(...[50, 52].map((offset) => ({ ...existing, code: `capacity-${offset}`, vehicle: hiace[0].vehicle, unitId: hiace[0].id, start: day(offset), end: day(offset) })));
  assert.equal(vehicleAvailable(data, hiace[0].vehicle, day(50), day(52)), true, "Dua pesanan pada satu mobil tidak memenuhi kapasitas dua mobil");
  assert.equal(availableUnit(data, hiace[0].vehicle, day(50), day(52))?.id, hiace[1].id);
});
