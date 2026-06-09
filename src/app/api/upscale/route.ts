import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { eq, desc } from "drizzle-orm";
import { db, upscaleJobs } from "@/lib/db";
import { checkAndDeduct } from "@/lib/quota";
import { submitUpscaleByTarget, simulateSubmit } from "@/lib/fal";
import { auth } from "@/lib/auth";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { originalUrl, target } = body;
    console.log("[Upscale] Request:", { url: originalUrl?.slice(0, 80), target });

    if (!originalUrl || typeof originalUrl !== "string") {
      return NextResponse.json({ error: "originalUrl is required." }, { status: 400 });
    }
    if (!["2x", "3x", "4x"].includes(target)) {
      return NextResponse.json({ error: "target must be 2x, 3x, or 4x." }, { status: 400 });
    }

    // Get user session
    const session = await auth();
    const userId = session?.user?.id || null;
    console.log("[Upscale] User:", userId);

    // Check & deduct quota (requires login)
    try {
      await checkAndDeduct(userId, null);
    } catch (quotaError) {
      return NextResponse.json(
        { error: quotaError instanceof Error ? quotaError.message : "No credits" },
        { status: 402 }
      );
    }

    const jobId = uuidv4();
    let falRequestId: string | null = null;
    let status = "processing";

    console.log("[Upscale] Sending to fal.ai:", { originalUrl, target });
    try {
      const { requestId } = await submitUpscaleByTarget(originalUrl, target);
      falRequestId = requestId;
    } catch {
      if (process.env.FAL_KEY) {
        status = "failed";
      } else {
        const sim = await simulateSubmit(originalUrl, 2);
        falRequestId = sim.requestId;
      }
    }

    const now = new Date().toISOString();

    // Save job
    try {
      await db.insert(upscaleJobs).values({
        id: jobId,
        userId,
        originalUrl,
        scaleFactor: 2,
        status,
        replicatePredictionId: falRequestId,
        createdAt: new Date(),
      });
    } catch (e) {
      console.warn("Job save skipped:", e);
    }

    return NextResponse.json({
      job: { id: jobId, userId, originalUrl, resultUrl: null, scaleFactor: 2, status, replicatePredictionId: falRequestId, createdAt: now, completedAt: null },
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error("[Upscale] Error:", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ jobs: [] });

    const jobs = await db
      .select()
      .from(upscaleJobs)
      .where(eq(upscaleJobs.userId, session.user.id))
      .orderBy(desc(upscaleJobs.createdAt))
      .limit(50);

    return NextResponse.json({ jobs });
  } catch {
    return NextResponse.json({ jobs: [] });
  }
}
