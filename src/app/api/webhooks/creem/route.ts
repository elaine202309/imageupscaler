import { NextRequest, NextResponse } from "next/server";
import { db, users } from "@/lib/db";
import { eq } from "drizzle-orm";

// Product ID → plan + credits mapping
const PRODUCT_MAP: Record<string, { plan: string; credits: number }> = {
  prod_174VNo5Bp15jyyOvdSrQCI: { plan: "plus", credits: 100 },   // Plus monthly
  prod_7kq2iGXiIrLTfUlbttVhLh: { plan: "pro", credits: 300 },    // Pro monthly
  prod_1mDrxF9DldGLGerCsJ2WY2: { plan: "free", credits: 20 },    // 20 credit pack
  prod_6LKub0br9X1CGIjAJA192v: { plan: "free", credits: 50 },    // 50 credit pack
  prod_4ISIfrPgLbsiJbANfbCbFp: { plan: "free", credits: 100 },   // 100 credit pack
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log("[Creem Webhook]", JSON.stringify(body).slice(0, 300));

    const event = body as {
      type: string;
      data?: {
        object?: {
          id?: string;
          customer?: { email?: string };
          product_id?: string;
          subscription_id?: string;
          metadata?: Record<string, string>;
        };
      };
    };

    // Handle checkout completed
    if (event.type === "checkout.completed" && event.data?.object?.customer?.email) {
      const email = event.data.object.customer.email;
      const productId = event.data.object.product_id;

      if (productId && PRODUCT_MAP[productId]) {
        const product = PRODUCT_MAP[productId];

        // Find user by email and update plan + credits
        const existing = await db.select().from(users).where(eq(users.email, email)).limit(1);

        if (existing.length > 0) {
          const userId = existing[0].id;

          if (product.plan !== "free") {
            // Subscription plan
            await db.update(users).set({
              plan: product.plan,
              monthlyCredits: product.credits,
              creditsUsed: 0,
            }).where(eq(users.id, userId));
          } else {
            // Credit pack — add to existing credits
            const currentTotal = existing[0].monthlyCredits || 5;
            await db.update(users).set({
              monthlyCredits: currentTotal + product.credits,
            }).where(eq(users.id, userId));
          }

          console.log(`[Creem] Updated user ${email}: plan=${product.plan}, +${product.credits} credits`);
        } else {
          console.warn(`[Creem] User not found: ${email}`);
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch (e) {
    console.error("[Creem Webhook]", e);
    return NextResponse.json({ received: true }, { status: 200 });
  }
}
