import { NextRequest, NextResponse } from "next/server";
import { getQuota, generateAnonymousId } from "@/lib/quota";
import { cookies } from "next/headers";

/**
 * GET /api/quota
 *
 * Returns the current user's quota information.
 * Sets an anonymous ID cookie if one doesn't exist.
 */
export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    let anonymousId = cookieStore.get("anon_id")?.value || null;

    // Set anonymous cookie if not present
    if (!anonymousId) {
      anonymousId = generateAnonymousId();
    }

    const userId = request.headers.get("x-user-id") || null;

    const quota = await getQuota(userId, anonymousId);

    const response = NextResponse.json(quota);

    // Set the anonymous ID cookie (30 days)
    if (!cookieStore.get("anon_id")) {
      response.cookies.set("anon_id", anonymousId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 30 * 24 * 60 * 60, // 30 days
        path: "/",
      });
    }

    return response;
  } catch (error) {
    console.error("Quota error:", error);
    return NextResponse.json(
      { error: "Failed to fetch quota." },
      { status: 500 }
    );
  }
}
