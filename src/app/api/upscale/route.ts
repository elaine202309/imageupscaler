import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { eq, desc } from "drizzle-orm";
import { db, upscaleJobs } from "@/lib/db";
import { checkAndDeduct } from "@/lib/quota";
import { submitUpscaleByTarget, simulateSubmit } from "@/lib/fal";
import { cookies } from "next/headers";
import type { ScaleFactor } from "@/types";

/**
 * POST /api/upscale
 *
 * Submit an AI upscale job to fal.ai SeedVR2.
 * Body: { originalUrl: string, target: "HD" | "2K" | "4K" }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { originalUrl, target } = body;

    if (!originalUrl || typeof originalUrl !== "string") {
      return NextResponse.json({ error: "originalUrl is required." }, { status: 400 });
    }

    if (!["HD", "2K", "4K"].includes(target)) {
      return NextResponse.json({ error: "target must be HD, 2K, or 4K." }, { status: 400 });
    }

    const userId = request.headers.get("x-user-id") || null;
    const anonymousId = await getAnonymousId();

    // Check & deduct quota (skip if DB not set up)
    try {
      await checkAndDeduct(userId, anonymousId);
    } catch (quotaError) {
      console.warn("[DEV] Quota check skipped:", (quotaError as Error).message?.slice(0, 80));
    }

    const jobId = uuidv4();
    let falRequestId: string | null = null;
    let status = "processing";

    try {
      const { requestId } = await submitUpscaleByTarget(originalUrl, target);
      falRequestId = requestId;
    } catch (falError) {
      console.error("fal.ai error:", falError);
      if (process.env.FAL_KEY) {
        status = "failed";
      } else {
        console.log("[DEV] Simulating upscale — no FAL_KEY configured");
        const sim = await simulateSubmit(originalUrl, 2);
        falRequestId = sim.requestId;
        status = "processing";
      }
    }

    const now = new Date().toISOString();
    const job = { id: jobId, userId, anonymousId, originalUrl, resultUrl: null, scaleFactor: 2, status, replicatePredictionId: falRequestId, createdAt: now, completedAt: null };

    // Save to DB (non-blocking if DB not set up)
    try {
      await db.insert(upscaleJobs).values({
        id: jobId, userId, anonymousId, originalUrl,
        scaleFactor: 2 as ScaleFactor, status,
        replicatePredictionId: falRequestId, createdAt: now,
      });
    } catch (dbError) {
      console.warn("[DEV] DB save skipped:", (dbError as Error).message?.slice(0, 60));
    }

    return NextResponse.json({ job });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error("Upscale error:", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

/**
 * GET /api/upscale — list recent jobs
 */
export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id") || null;
    const anonymousId = await getAnonymousId();
    if (!userId && !anonymousId) return NextResponse.json({ jobs: [] });

    const jobs = userId
      ? await db.select().from(upscaleJobs).where(eq(upscaleJobs.userId, userId)).orderBy(desc(upscaleJobs.createdAt)).limit(50)
      : await db.select().from(upscaleJobs).where(eq(upscaleJobs.anonymousId, anonymousId)).orderBy(desc(upscaleJobs.createdAt)).limit(50);

    return NextResponse.json({ jobs });
  } catch (error) {
    console.error("History error:", error);
    return NextResponse.json({ error: "Failed to fetch history." }, { status: 500 });
  }
}

async function getAnonymousId(): Promise<string> {
  const cookieStore = await cookies();
  return cookieStore.get("anon_id")?.value || uuidv4();
}
