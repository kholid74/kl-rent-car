import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import { test } from "node:test";
import { signSession, verifySession } from "./admin-auth";

test("sesi demo menolak manipulasi, kedaluwarsa, dan pertukaran token admin", () => {
  const before = process.env.ADMIN_SESSION_SECRET;
  process.env.ADMIN_SESSION_SECRET = "test-only-secret-for-kl-demo-session-123456";
  try {
    const session = { id: "demo-workspace", exp: Date.now() + 60_000 };
    const signed = signSession(session);
    assert.deepEqual(verifySession(signed), session);
    assert.equal(verifySession(signSession({ ...session, exp: Date.now() - 1 })), null);
    assert.equal(verifySession("invalid"), null);
    assert.equal(verifySession(signed + ".extra"), null);
    const [payload, mac] = signed.split(".");
    const changed = Buffer.from(JSON.stringify({ ...session, id: "another-owner" })).toString("base64url");
    assert.equal(verifySession(`${changed}.${mac}`), null);
    const adminMac = createHmac("sha256", process.env.ADMIN_SESSION_SECRET).update(payload).digest("base64url");
    assert.notEqual(mac, adminMac, "Token demo tidak valid sebagai cookie admin");
    assert.equal(verifySession(`${payload}.${adminMac}`), null);
  } finally {
    if (before === undefined) delete process.env.ADMIN_SESSION_SECRET;
    else process.env.ADMIN_SESSION_SECRET = before;
  }
});
