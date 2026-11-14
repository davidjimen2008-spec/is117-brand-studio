import test from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { createDemoStore } from "../demo-store.mjs";

test("SQLite demo order survives closing and reopening the database", () => {
  const directory = mkdtempSync(path.join(tmpdir(), "atm-sqlite-"));
  const filename = path.join(directory, "orders.sqlite");
  try {
    const first = createDemoStore(filename);
    const saved = first.create("M", 2);
    first.close();
    const second = createDemoStore(filename);
    assert.deepEqual(second.find(saved.id), saved);
    assert.throws(() => second.create("INVALID", 1));
    assert.throws(() => second.create("S", 0));
    second.close();
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});
