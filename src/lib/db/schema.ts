import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

// ============================================================
// Users table — linked to Auth.js accounts
// ============================================================
export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  email: text("email").unique(),
  name: text("name"),
  image: text("image"),
  plan: text("plan").default("free").notNull(),
  monthlyCredits: integer("monthly_credits").default(10).notNull(),
  creditsUsed: integer("credits_used").default(0).notNull(),
  creditResetAt: text("credit_reset_at"),
  stripeCustomerId: text("stripe_customer_id"),
  createdAt: text("created_at").default("(datetime('now'))").notNull(),
});

// ============================================================
// Anonymous users — tracked by browser fingerprint / cookie
// ============================================================
export const anonymousUsers = sqliteTable("anonymous_users", {
  id: text("id").primaryKey(),
  ipHash: text("ip_hash"),
  monthlyCredits: integer("monthly_credits").default(3).notNull(),
  creditsUsed: integer("credits_used").default(0).notNull(),
  creditResetAt: text("credit_reset_at"),
  createdAt: text("created_at").default("(datetime('now'))").notNull(),
});

// ============================================================
// Upscale jobs — one row per image upscale request
// ============================================================
export const upscaleJobs = sqliteTable("upscale_jobs", {
  id: text("id").primaryKey(),
  userId: text("user_id"),
  anonymousId: text("anonymous_id"),
  originalUrl: text("original_url").notNull(),
  resultUrl: text("result_url"),
  originalSize: integer("original_size"),
  resultSize: integer("result_size"),
  scaleFactor: integer("scale_factor").notNull(),
  status: text("status").default("pending").notNull(),
  replicatePredictionId: text("replicate_prediction_id"),
  createdAt: text("created_at").default("(datetime('now'))").notNull(),
  completedAt: text("completed_at"),
});

// ============================================================
// Subscriptions — Stripe subscription reference
// ============================================================
export const subscriptions = sqliteTable("subscriptions", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id),
  stripeSubscriptionId: text("stripe_subscription_id").unique(),
  plan: text("plan").notNull(),
  status: text("status"),
  currentPeriodEnd: text("current_period_end"),
  createdAt: text("created_at").default("(datetime('now'))").notNull(),
});
