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

    const email = event.data?.object?.customer?.email;
    if (!email) {
      return NextResponse.json({ received: true });
    }

    // Find user
    const existing = await db.select().from(users).where(eq(users.email, email)).limit(1);
    if (existing.length === 0) {
      console.warn(`[Creem] User not found: ${email}`);
      return NextResponse.json({ received: true });
    }
    const userId = existing[0].id;

    switch (event.type) {
      case "checkout.completed": {
        // New purchase — upgrade plan or add credits
        const productId = event.data?.object?.product_id;
        const product = productId ? PRODUCT_MAP[productId] : null;
        if (!product) break;

        if (product.plan !== "free") {
          await db.update(users).set({
            plan: product.plan,
            monthlyCredits: product.credits,
            creditsUsed: 0,
          }).where(eq(users.id, userId));
        } else {
          const currentTotal = existing[0].monthlyCredits || 5;
          await db.update(users).set({
            monthlyCredits: currentTotal + product.credits,
          }).where(eq(users.id, userId));
        }
        console.log(`[Creem] ${email}: checkout → plan=${product.plan}, +${product.credits} credits`);
        break;
      }

      case "subscription.active": {
        const productId = event.data?.object?.product_id;
        const product = productId ? PRODUCT_MAP[productId] : null;
        if (product) {
          await db.update(users).set({
            plan: product.plan,
            monthlyCredits: product.credits,
            creditsUsed: 0,
          }).where(eq(users.id, userId));
          console.log(`[Creem] ${email}: subscription active → ${product.plan}`);
        }
        break;
      }

      case "subscription.canceled":
      case "subscription.expired": {
        // Downgrade to free
        await db.update(users).set({
          plan: "free",
          monthlyCredits: 5,
          creditsUsed: 0,
        }).where(eq(users.id, userId));
        console.log(`[Creem] ${email}: subscription ended → free`);
        break;
      }

      case "refund.created": {
        // Remove credits from refunded purchase
        const refundProductId = event.data?.object?.product_id;
        const refundProduct = refundProductId ? PRODUCT_MAP[refundProductId] : null;
        if (refundProduct) {
          const current = existing[0].monthlyCredits || 5;
          await db.update(users).set({
            monthlyCredits: Math.max(5, current - refundProduct.credits),
          }).where(eq(users.id, userId));
          console.log(`[Creem] ${email}: refund → -${refundProduct.credits} credits`);
        }
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (e) {
    console.error("[Creem Webhook]", e);
    return NextResponse.json({ received: true }, { status: 200 });
  }
}
