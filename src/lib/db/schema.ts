import { pgTable, text, integer, timestamp } from "drizzle-orm/pg-core";

// Users table — created on first Google login
export const users = pgTable("users", {
  id: text("id").primaryKey(),
  email: text("email").unique().notNull(),
  name: text("name"),
  image: text("image"),
  plan: text("plan").default("free").notNull(),
  monthlyCredits: integer("monthly_credits").default(5).notNull(),
  creditsUsed: integer("credits_used").default(0).notNull(),
  creditResetAt: timestamp("credit_reset_at"),
  stripeCustomerId: text("stripe_customer_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Upscale jobs
export const upscaleJobs = pgTable("upscale_jobs", {
  id: text("id").primaryKey(),
  userId: text("user_id").references(() => users.id),
  anonymousId: text("anonymous_id"),
  originalUrl: text("original_url").notNull(),
  resultUrl: text("result_url"),
  originalSize: integer("original_size"),
  resultSize: integer("result_size"),
  scaleFactor: integer("scale_factor").notNull(),
  status: text("status").default("pending").notNull(),
  replicatePredictionId: text("replicate_prediction_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  completedAt: timestamp("completed_at"),
});
