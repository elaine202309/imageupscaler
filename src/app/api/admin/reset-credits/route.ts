import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db, users } from "@/lib/db";
import { eq } from "drizzle-orm";

const ADMIN_EMAIL = "elaine20230910@gmail.com";

export async function POST(request: NextRequest) {
  const session = await auth();
  if (session?.user?.email !== ADMIN_EMAIL) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { userId, credits } = await request.json();

  try {
    await db
      .update(users)
      .set({ creditsUsed: 0, monthlyCredits: credits || 5 })
      .where(eq(users.id, userId));
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
