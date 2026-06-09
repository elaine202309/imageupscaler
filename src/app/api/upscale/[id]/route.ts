import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db, upscaleJobs } from "@/lib/db";
import { checkStatus, simulateSubmit } from "@/lib/fal";
import { downloadImage, uploadImage } from "@/lib/storage";
import type { UpscaleJob } from "@/types";

/**
 * GET /api/upscale/[id]
 *
 * Poll fal.ai job status. When complete, downloads & stores the result.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Try DB lookup first
    let falReqId = "";
    let originalUrl = "";
    let scaleFactor = 2;
    let currentStatus = "processing";
    let resultUrl: string | null = null;

    try {
      const [job] = await db.select().from(upscaleJobs).where(eq(upscaleJobs.id, id));
      if (job) {
        falReqId = job.replicatePredictionId || "";
        originalUrl = job.originalUrl || "";
        scaleFactor = job.scaleFactor || 2;
        currentStatus = job.status || "processing";
        resultUrl = job.resultUrl;
      }
    } catch { /* ignore */ }

    // If not found in DB, use the id directly (frontend passes fal request ID)
    if (!falReqId) falReqId = id;

    // Already done
    if (currentStatus === "completed" && resultUrl) {
      return NextResponse.json({ status: "completed", resultUrl });
    }
    if (currentStatus === "failed") {
      return NextResponse.json({ status: "failed" });
    }

    // Simulated jobs
    if (falReqId && falReqId.startsWith("sim-")) {
      const sim = await simulateSubmit(originalUrl, scaleFactor);
      return NextResponse.json({ status: "completed", resultUrl: sim.result.image.url });
    }

    // Check fal.ai directly
    if (falReqId) {
      try {
        const { status, result } = await checkStatus(falReqId);

        if (status === "COMPLETED" && result?.image?.url) {
          // Save result to DB
          try {
            await db.update(upscaleJobs)
              .set({ status: "completed", resultUrl: result.image.url, completedAt: new Date() })
              .where(eq(upscaleJobs.replicatePredictionId, falReqId));
          } catch { /* ignore DB errors */ }
          return NextResponse.json({ status: "completed", resultUrl: result.image.url });
        }

        if (status === "FAILED") {
          return NextResponse.json({ status: "failed" });
        }

        return NextResponse.json({ status: "processing" });
      } catch (err) {
        console.error("fal.ai poll error:", err);
        return NextResponse.json({ status: "processing" });
      }
    }

    return NextResponse.json({ status: "processing" });
  } catch (error) {
    console.error("Poll error:", error);
    return NextResponse.json({ error: "Failed to check status." }, { status: 500 });
  }
}

/**
 * DELETE /api/upscale/[id]
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const [job] = await db.select().from(upscaleJobs).where(eq(upscaleJobs.id, id));
  if (!job) return NextResponse.json({ error: "Not found." }, { status: 404 });
  await db.delete(upscaleJobs).where(eq(upscaleJobs.id, id));
  return NextResponse.json({ deleted: true });
}

function mapJobToResponse(job: typeof upscaleJobs.$inferSelect): UpscaleJob {
  return {
    id: job.id,
    userId: job.userId,
    anonymousId: job.anonymousId,
    originalUrl: job.originalUrl,
    resultUrl: job.resultUrl,
    originalSize: job.originalSize ?? 0,
    resultSize: job.resultSize,
    scaleFactor: job.scaleFactor as UpscaleJob["scaleFactor"],
    status: job.status as UpscaleJob["status"],
    replicatePredictionId: job.replicatePredictionId,
    createdAt: job.createdAt instanceof Date ? job.createdAt.toISOString() : (job.createdAt ?? new Date().toISOString()),
    completedAt: job.completedAt instanceof Date ? job.completedAt.toISOString() : job.completedAt,
  };
}
