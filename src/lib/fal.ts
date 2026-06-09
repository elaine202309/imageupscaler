/**
 * fal.ai SeedVR2 API wrapper for image upscaling.
 *
 * Uses @fal-ai/client SDK. The API key is read from FAL_KEY env var.
 * Pricing: $0.001/megapixel (output resolution).
 *
 * For local dev without FAL_KEY, falls back to simulation.
 */

import { fal } from "@fal-ai/client";

// Configure fal client with API key
if (process.env.FAL_KEY) {
  fal.config({
    credentials: process.env.FAL_KEY,
  });
}

const MODEL_ID = "fal-ai/seedvr/upscale/image";

// ============================================================
// Types
// ============================================================

interface FalUpscaleInput {
  image_url: string;
  upscale_factor?: number;   // 1–10
  upscale_mode?: "factor" | "target";
  target_resolution?: "720p" | "1080p" | "1440p" | "2160p";
  noise_scale?: number;       // 0–1
  output_format?: "png" | "jpg" | "webp";
  seed?: number;
}

interface FalResult {
  image: {
    url: string;
    content_type: string;
    file_name?: string;
    file_size?: number;
    width?: number;
    height?: number;
  };
  seed: number;
}

interface QueueStatus {
  status: "IN_QUEUE" | "IN_PROGRESS" | "COMPLETED" | "FAILED";
  logs?: { message: string }[];
  response_url?: string;
}

// ============================================================
// Public API
// ============================================================

// Resolution mapping: our labels → fal.ai target_resolution
const RESOLUTION_MAP: Record<string, string> = {
  HD: "1080p",
  "2K": "1440p",
  "4K": "2160p",
};

/**
 * Submit an upscale job with target resolution (recommended).
 * Accepts "HD", "2K", or "4K" → maps to fal.ai target_resolution.
 */
export async function submitUpscaleByTarget(
  imageUrl: string,
  targetLabel: string
): Promise<{ requestId: string }> {
  if (!process.env.FAL_KEY) {
    throw new Error(
      "FAL_KEY is not set. Add it to .env.local or get one at https://fal.ai/dashboard/keys"
    );
  }

  const targetResolution = RESOLUTION_MAP[targetLabel];
  if (!targetResolution) {
    throw new Error(`Unknown target: ${targetLabel}. Use HD, 2K, or 4K.`);
  }

  const input: FalUpscaleInput = {
    image_url: imageUrl,
    upscale_mode: "target",
    target_resolution: targetResolution as "720p" | "1080p" | "1440p" | "2160p",
    output_format: "png",
    noise_scale: 0.05,
  };

  try {
    console.log("[fal.ai] Submitting:", JSON.stringify({ image_url: input.image_url?.slice(0, 60), mode: input.upscale_mode, target: input.target_resolution }));
    const { request_id } = await fal.queue.submit(MODEL_ID, { input });
    return { requestId: request_id };
  } catch (error) {
    const e = error as any;
    console.error("[fal.ai] Submit error:", e?.message || e, e?.body || e?.response?.body || "");
    throw new Error(`fal.ai: ${e?.message || "Unknown"}`);
  }
}

/**
 * Submit an upscale job by scale factor (legacy).
 */
export async function submitUpscale(
  imageUrl: string,
  scaleFactor: number
): Promise<{ requestId: string }> {
  if (!process.env.FAL_KEY) {
    throw new Error(
      "FAL_KEY is not set. Add it to .env.local or get one at https://fal.ai/dashboard/keys"
    );
  }

  const input: FalUpscaleInput = {
    image_url: imageUrl,
    upscale_mode: "factor",
    upscale_factor: Math.min(scaleFactor, 10),
    output_format: "png",
    noise_scale: 0.05,
  };

  try {
    console.log("[fal.ai] Submitting:", JSON.stringify({ image_url: input.image_url?.slice(0, 60), mode: input.upscale_mode, target: input.target_resolution }));
    const { request_id } = await fal.queue.submit(MODEL_ID, { input });
    return { requestId: request_id };
  } catch (error) {
    const e = error as any;
    console.error("[fal.ai] Submit error:", e?.message || e, e?.body || e?.response?.body || "");
    throw new Error(`fal.ai: ${e?.message || "Unknown"}`);
  }
}

/**
 * Check the status of a queued upscale job.
 */
export async function checkStatus(
  requestId: string
): Promise<{ status: QueueStatus["status"]; result?: FalResult }> {
  if (!process.env.FAL_KEY) {
    throw new Error("FAL_KEY is not set.");
  }

  try {
    const response = await fal.queue.status(MODEL_ID, {
      requestId,
      logs: false,
    });

    const status = response.status as QueueStatus["status"];

    if (status === "COMPLETED") {
      // Fetch the result
      const result = await fal.queue.result(MODEL_ID, {
        requestId,
      });
      return { status: "COMPLETED", result: result.data as FalResult };
    }

    return { status };
  } catch (error) {
    console.error("fal.ai status check error:", error);
    throw new Error(
      `fal.ai status check failed: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}

/**
 * Calculate estimated cost for an upscale operation.
 * $0.001 per output megapixel.
 */
export function estimateCost(
  inputWidth: number,
  inputHeight: number,
  scaleFactor: number
): { outputMegapixels: number; estimatedCost: number } {
  const outW = inputWidth * scaleFactor;
  const outH = inputHeight * scaleFactor;
  const pixels = outW * outH;
  const megapixels = pixels / 1_000_000;

  return {
    outputMegapixels: Math.round(megapixels * 100) / 100,
    estimatedCost: Math.round(megapixels * 0.001 * 10000) / 10000,
  };
}

// ============================================================
// Dev simulation (no API key)
// ============================================================

let simulatedRequestCounter = 0;

export async function simulateSubmit(imageUrl: string, scaleFactor: number) {
  simulatedRequestCounter++;
  // Simulate processing delay proportional to scale
  const delay = 1500 + scaleFactor * 500;
  await new Promise((r) => setTimeout(r, delay));

  return {
    requestId: `sim-${Date.now()}-${simulatedRequestCounter}`,
    result: {
      image: {
        url: imageUrl, // Return original as placeholder
        content_type: "image/png",
        width: 1024 * scaleFactor,
        height: 1024 * scaleFactor,
      },
      seed: Math.floor(Math.random() * 100000),
    },
  };
}
