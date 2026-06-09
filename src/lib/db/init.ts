import { sql } from "drizzle-orm";
import { db } from "./index";

let initialized = false;

export async function initDB() {
  if (initialized) return;
  try {
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        name TEXT,
        image TEXT,
        plan TEXT DEFAULT 'free' NOT NULL,
        monthly_credits INTEGER DEFAULT 5 NOT NULL,
        credits_used INTEGER DEFAULT 0 NOT NULL,
        credit_reset_at TIMESTAMP,
        stripe_customer_id TEXT,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL
      )
    `);
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS upscale_jobs (
        id TEXT PRIMARY KEY,
        user_id TEXT REFERENCES users(id),
        anonymous_id TEXT,
        original_url TEXT NOT NULL,
        result_url TEXT,
        original_size INTEGER,
        result_size INTEGER,
        scale_factor INTEGER NOT NULL,
        status TEXT DEFAULT 'pending' NOT NULL,
        replicate_prediction_id TEXT,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL,
        completed_at TIMESTAMP
      )
    `);
    initialized = true;
    console.log("✅ Database tables ready");
  } catch (e) {
    console.error("DB init error:", e);
  }
}
