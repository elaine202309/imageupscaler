// ============================================================
// Shared TypeScript types for the Image Upscaler
// ============================================================

export type Plan = "free" | "plus" | "pro" | "starter" | "enterprise";

export type ScaleFactor = 2 | 4 | 8;

export type UpscaleStatus = "pending" | "processing" | "completed" | "failed";

export interface QuotaInfo {
  total: number;
  used: number;
  remaining: number;
  plan: Plan;
  resetAt: string;
  isAnonymous: boolean;
}

export interface UpscaleJob {
  id: string;
  userId: string | null;
  anonymousId: string | null;
  originalUrl: string;
  resultUrl: string | null;
  originalSize: number;
  resultSize: number | null;
  scaleFactor: ScaleFactor;
  status: UpscaleStatus;
  replicatePredictionId: string | null;
  createdAt: string;
  completedAt: string | null;
}

export interface UpscaleRequest {
  originalUrl: string;
  scaleFactor: ScaleFactor;
}

export interface UpscaleResponse {
  jobId: string;
  status: UpscaleStatus;
  creditsRemaining: number;
}

export interface PricingPlan {
  id: Plan;
  name: string;
  price: number;
  creditsPerMonth: number;
  scaleFactors: ScaleFactor[];
  hasAds: boolean;
  features: string[];
  highlighted?: boolean;
}

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: "free",
    name: "Free",
    price: 0,
    creditsPerMonth: 5,
    scaleFactors: [2],
    hasAds: true,
    features: [
      "5 credits / month",
      "Up to 1080p",
      "Max 25MB upload",
      "Standard processing",
    ],
  },
  {
    id: "plus",
    name: "Plus",
    price: 6,
    creditsPerMonth: 100,
    scaleFactors: [2, 4],
    hasAds: false,
    features: [
      "100 credits / month",
      "Up to 4K",
      "Max 50MB upload",
      "Priority processing",
    ],
    highlighted: true,
  },
  {
    id: "pro",
    name: "Pro",
    price: 12,
    creditsPerMonth: 300,
    scaleFactors: [2, 4, 8],
    hasAds: false,
    features: [
      "300 credits / month",
      "Up to 4K",
      "Max 100MB upload",
      "Fastest processing",
      "Batch upscale",
    ],
  },
];

export const ANONYMOUS_CREDITS = 3;
export const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25MB
export const ALLOWED_FORMATS = ["image/png", "image/jpeg", "image/webp"];
export const ALLOWED_EXTENSIONS = [".png", ".jpg", ".jpeg", ".webp"];
