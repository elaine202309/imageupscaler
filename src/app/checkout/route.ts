import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const apiKey = process.env.CREEM_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "CREEM_API_KEY not set" }, { status: 500 });
  }

  const productId = request.nextUrl.searchParams.get("productId");
  if (!productId) {
    return NextResponse.json({ error: "productId required" }, { status: 400 });
  }

  try {
    const res = await fetch("https://api.creem.io/v1/checkouts", {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        product_id: productId,
        success_url: "https://www.freeupscale.online/success",
        metadata: {},
      }),
    });

    if (!res.ok) {
      const body = await res.text();
      console.error("[Creem] Error:", res.status, body);
      return NextResponse.json({ error: "Failed to create checkout", details: body }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.redirect(data.checkout_url);
  } catch (e: any) {
    console.error("[Creem] Fetch error:", e.message);
    return NextResponse.json({ error: "Failed to create checkout", details: e.message }, { status: 500 });
  }
}
