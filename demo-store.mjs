import { DatabaseSync } from "node:sqlite";
import { randomUUID } from "node:crypto";
import path from "node:path";
import { mkdirSync } from "node:fs";

export function createDemoStore(dbPath = process.env.ATM_DEMO_DB ?? path.resolve("data/demo-orders.sqlite")) {
  if (dbPath !== ":memory:") mkdirSync(path.dirname(dbPath), { recursive: true });
  const db = new DatabaseSync(dbPath);
  db.exec("CREATE TABLE IF NOT EXISTS demo_orders (id TEXT PRIMARY KEY, size TEXT NOT NULL, quantity INTEGER NOT NULL, status TEXT NOT NULL, created_at TEXT NOT NULL)");
  return {
    create(size, quantity) {
      if (!["XS","S","M","L","XL","XXL"].includes(size) || !Number.isInteger(quantity) || quantity < 1 || quantity > 10) throw new Error("Choose a valid size and quantity from 1 to 10.");
      const order = { id: randomUUID(), size, quantity, status: "SIMULATED", created_at: new Date().toISOString() };
      db.prepare("INSERT INTO demo_orders (id,size,quantity,status,created_at) VALUES (?,?,?,?,?)").run(order.id, order.size, order.quantity, order.status, order.created_at);
      return order;
    },
    find(id) {
      if (!/^[0-9a-f-]{36}$/i.test(id)) return null;
      return db.prepare("SELECT id,size,quantity,status,created_at FROM demo_orders WHERE id = ?").get(id) ?? null;
    },
    close() { db.close(); }
  };
}
