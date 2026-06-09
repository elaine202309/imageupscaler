import { eq } from "drizzle-orm";
import { db, users } from "./db";

const FREE_CREDITS = 5;

function getNextResetDate(): Date {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth() + 1, 1);
}

export async function getUserQuota(userId: string) {
  try {
    const result = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (result.length === 0) {
      return { total: FREE_CREDITS, used: 0, remaining: FREE_CREDITS };
    }

    const user = result[0];
    const now = new Date();

    // Monthly reset
    if (user.creditResetAt && new Date(user.creditResetAt) <= now) {
      await db
        .update(users)
        .set({ creditsUsed: 0, creditResetAt: getNextResetDate() })
        .where(eq(users.id, userId));
      return { total: user.monthlyCredits, used: 0, remaining: user.monthlyCredits };
    }

    return {
      total: user.monthlyCredits,
      used: user.creditsUsed,
      remaining: user.monthlyCredits - user.creditsUsed,
    };
  } catch (e) {
    console.error("Quota error:", e);
    return { total: FREE_CREDITS, used: 0, remaining: FREE_CREDITS };
  }
}

export async function deductUserCredit(userId: string) {
  // If user doesn't exist yet, create one
  const existing = await db.select().from(users).where(eq(users.id, userId)).limit(1);
  if (existing.length === 0) {
    await db.insert(users).values({
      id: userId,
      email: "pending",
      plan: "free",
      monthlyCredits: 5,
      creditsUsed: 1,
      creditResetAt: getNextResetDate(),
    });
    return { remaining: 4 };
  }

  const user = existing[0];
  const quota = {
    total: user.monthlyCredits,
    used: user.creditsUsed,
    remaining: user.monthlyCredits - user.creditsUsed,
  };

  if (quota.remaining <= 0) {
    throw new Error("No credits remaining. Upgrade to continue.");
  }

  await db
    .update(users)
    .set({ creditsUsed: (quota.used + 1) })
    .where(eq(users.id, userId));

  return { remaining: quota.remaining - 1 };
}

export async function checkAndDeduct(userId: string | null, _anonymousId: string | null) {
  if (userId) return deductUserCredit(userId);
  throw new Error("Sign in required. Please login to use free credits.");
}

export async function getQuota(userId: string | null, _anonymousId: string | null) {
  if (userId) return getUserQuota(userId);
  return { total: FREE_CREDITS, used: 0, remaining: FREE_CREDITS };
}

export function generateAnonymousId(): string {
  return crypto.randomUUID();
}
