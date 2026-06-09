import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import * as schema from "./schema";

// Use Turso in production, better-sqlite3 for local dev
const isProd = process.env.NODE_ENV === "production";

function getDb() {
  if (isProd && process.env.TURSO_DATABASE_URL) {
    const client = createClient({
      url: process.env.TURSO_DATABASE_URL,
      authToken: process.env.TURSO_AUTH_TOKEN,
    });
    return drizzle(client, { schema });
  }

  // Local dev — use better-sqlite3 via libsql
  const client = createClient({
    url: process.env.DATABASE_URL || "file:./local.db",
  });
  return drizzle(client, { schema });
}

export const db = getDb();
export * from "./schema";
