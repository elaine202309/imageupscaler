"use client";

import { PricingCard } from "@/components/pricing/PricingCard";
import { PRICING_PLANS } from "@/types";
import type { PricingPlan } from "@/types";

export default function PricingPage() {
  const handleSelect = (plan: PricingPlan) => {
    if (plan.price > 0) {
      alert(`${plan.name} plan — redirects to Stripe in production.`);
    }
  };

  return (
    <div style={{ background: "var(--gradient-subtle)" }}>
      <div className="container mx-auto max-w-5xl px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-3">
            Choose Your <span className="gradient-text">Plan</span>
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Start free. Upgrade when you need more. All paid plans are ad-free with priority processing.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {PRICING_PLANS.map((plan) => (
            <PricingCard key={plan.id} plan={plan} current={false} onSelect={handleSelect} />
          ))}
        </div>

        <div className="text-center pb-8">
          <h3 className="text-lg font-semibold mb-4">One-Time Credit Packs</h3>
          <div className="flex flex-wrap gap-4 justify-center">
            <CreditBadge credits={20} price={3} />
            <CreditBadge credits={50} price={6} />
            <CreditBadge credits={100} price={10} />
          </div>
        </div>
      </div>
    </div>
  );
}

function CreditBadge({ credits, price }: { credits: number; price: number }) {
  return (
    <div className="rounded-2xl glass p-4 w-40 text-center hover:shadow-md hover:-translate-y-1 transition-all duration-300 cursor-pointer">
      <div className="text-2xl font-bold gradient-text">{credits}</div>
      <div className="text-xs text-muted-foreground mb-1">credits</div>
      <div className="text-lg font-bold mb-2">${price}</div>
      <span className="text-xs text-primary font-medium">Buy Now →</span>
    </div>
  );
}
