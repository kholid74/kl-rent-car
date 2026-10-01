import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { test } from "node:test";

test("Neon mempertahankan state lintas request dan menolak penulisan bersamaan", { skip: process.env.DEMO_DB_TEST !== "true" }, async () => {
  const { db } = await import("./db");
  const { readDemo, writeDemo, revision, DemoConflictError } = await import("./demo-store");
  const id = `test:${randomUUID()}`;
  try {
    const original = await readDemo(id);
    const expected = revision(original);
    assert.equal(expected, revision(JSON.parse(JSON.stringify(original))));
    assert.equal(expected, revision(await readDemo(id)), "Hash tetap sama setelah JSONB mengurutkan key");
    const first = structuredClone(original);
    const second = structuredClone(original);
    first.quotes[0].value += 100;
    second.quotes[0].value += 200;
    const results = await Promise.allSettled([writeDemo(id, first, expected), writeDemo(id, second, expected)]);
    assert.equal(results.filter((r) => r.status === "fulfilled").length, 1);
    const rejected = results.find((r) => r.status === "rejected");
    assert.ok(rejected?.status === "rejected" && rejected.reason instanceof DemoConflictError);
    assert.ok([revision(first), revision(second)].includes(revision(await readDemo(id))));
    await db.demoWorkspace.update({ where: { id }, data: { expiresAt: new Date(0) } });
    assert.equal(revision(await readDemo(id)), expected, "Workspace kedaluwarsa diisi ulang dengan data awal");
  } finally {
    await db.demoWorkspace.deleteMany({ where: { id } });
    await db.$disconnect();
  }
});
