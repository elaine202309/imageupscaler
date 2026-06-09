/**
 * Quota management — track and enforce free tier limits.
 *
 * Two user types:
 * - Anonymous: tracked by browser fingerprint (UUID stored in cookie)
 * - Registered: tracked by Auth.js user ID
 *
 * Credits reset on the 1st of each month.
 */

import { eq, and, sql } from "drizzle-orm";
import { db, users, anonymousUsers } from "./db";
import { ANONYMOUS_CREDITS } from "@/types";
import { v4 as uuidv4 } from "uuid";

// ============================================================
// Anonymous user ID — get or create a fingerprint
// ============================================================
export function generateAnonymousId(): string {
  return uuidv4();
}

// ============================================================
// Get quota info for an anonymous user
// ============================================================
export async function getAnonymousQuota(anonymousId: string) {
  const now = new Date().toISOString();
  const nextReset = getNextResetDate();

  let user = await db
    .select()
    .from(anonymousUsers)
    .where(eq(anonymousUsers.id, anonymousId))
    .get();

  if (!user) {
    // First visit — create anonymous user
    await db.insert(anonymousUsers).values({
      id: anonymousId,
      monthlyCredits: ANONYMOUS_CREDITS,
      creditsUsed: 0,
      creditResetAt: nextReset,
      createdAt: now,
    });

    return {
      total: ANONYMOUS_CREDITS,
      used: 0,
      remaining: ANONYMOUS_CREDITS,
      resetAt: nextReset,
      isAnonymous: true,
    };
  }

  // Check if we need to reset monthly credits
  if (user.creditResetAt && new Date(user.creditResetAt) <= new Date()) {
    await db
      .update(anonymousUsers)
      .set({ creditsUsed: 0, creditResetAt: nextReset })
      .where(eq(anonymousUsers.id, anonymousId));

    return {
      total: ANONYMOUS_CREDITS,
      used: 0,
      remaining: ANONYMOUS_CREDITS,
      resetAt: nextReset,
      isAnonymous: true,
    };
  }

  return {
    total: user.monthlyCredits,
    used: user.creditsUsed,
    remaining: user.monthlyCredits - user.creditsUsed,
    resetAt: user.creditResetAt || nextReset,
    isAnonymous: true,
  };
}

// ============================================================
// Get quota info for a registered user
// ============================================================
export async function getUserQuota(userId: string) {
  const now = new Date().toISOString();
  const nextReset = getNextResetDate();

  let user = await db.select().from(users).where(eq(users.id, userId)).get();

  if (!user) {
    return {
      total: 10,
      used: 0,
      remaining: 10,
      resetAt: nextReset,
      isAnonymous: false,
    };
  }

  // Monthly reset
  if (user.creditResetAt && new Date(user.creditResetAt) <= new Date()) {
    await db
      .update(users)
      .set({ creditsUsed: 0, creditResetAt: nextReset })
      .where(eq(users.id, userId));

    return {
      total: user.monthlyCredits,
      used: 0,
      remaining: user.monthlyCredits,
      resetAt: nextReset,
      isAnonymous: false,
    };
  }

  return {
    total: user.monthlyCredits,
    used: user.creditsUsed,
    remaining: user.monthlyCredits - user.creditsUsed,
    resetAt: user.creditResetAt || nextReset,
    isAnonymous: false,
  };
}

// ============================================================
// Deduct a credit from a user's quota
// ============================================================
export async function deductAnonymousCredit(anonymousId: string) {
  const quota = await getAnonymousQuota(anonymousId);

  if (quota.remaining <= 0) {
    throw new Error("No credits remaining. Upgrade to continue upscaling.");
  }

  await db
    .update(anonymousUsers)
    .set({ creditsUsed: sql`credits_used + 1` })
    .where(eq(anonymousUsers.id, anonymousId));

  return { remaining: quota.remaining - 1 };
}

export async function deductUserCredit(userId: string) {
  const quota = await getUserQuota(userId);

  if (quota.remaining <= 0) {
    throw new Error("No credits remaining. Upgrade to continue upscaling.");
  }

  await db
    .update(users)
    .set({ creditsUsed: sql`credits_used + 1` })
    .where(eq(users.id, userId));

  return { remaining: quota.remaining - 1 };
}

// ============================================================
// Unified: check and deduct based on who the user is
// ============================================================
export async function checkAndDeduct(
  userId: string | null,
  anonymousId: string | null
): Promise<{ remaining: number }> {
  if (userId) {
    return deductUserCredit(userId);
  }
  if (anonymousId) {
    return deductAnonymousCredit(anonymousId);
  }
  throw new Error("User identification required.");
}

export async function getQuota(
  userId: string | null,
  anonymousId: string | null
) {
  if (userId) {
    return getUserQuota(userId);
  }
  if (anonymousId) {
    return getAnonymousQuota(anonymousId);
  }
  // No identity — return guest state
  return {
    total: ANONYMOUS_CREDITS,
    used: 0,
    remaining: ANONYMOUS_CREDITS,
    resetAt: getNextResetDate(),
    isAnonymous: true,
  };
}

// ============================================================
// Helpers
// ============================================================
function getNextResetDate(): string {
  const now = new Date();
  const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  return nextMonth.toISOString();
}
