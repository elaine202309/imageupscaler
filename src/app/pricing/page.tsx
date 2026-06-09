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
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-3">
            Choose Your <span className="gradient-text">Plan</span>
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Start free. Upgrade when you need more. All paid plans include priority processing.
          </p>
        </div>

        {/* Plans */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {PRICING_PLANS.map((plan) => (
            <PricingCard key={plan.id} plan={plan} current={false} onSelect={handleSelect} />
          ))}
        </div>

        {/* Credit Packs */}
        <div className="text-center mb-16">
          <h3 className="text-lg font-semibold mb-4">One-Time Credit Packs</h3>
          <p className="text-sm text-muted-foreground mb-6">Need extra credits? Buy a pack — they never expire.</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <CreditBadge credits={20} price={3} />
            <CreditBadge credits={50} price={6} />
            <CreditBadge credits={100} price={10} />
          </div>
        </div>

        {/* How It Works */}
        <div className="max-w-3xl mx-auto mb-16">
          <h2 className="text-2xl font-bold text-center mb-8">How Credits Work</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            <div className="glass rounded-2xl p-6">
              <div className="text-3xl mb-2">📤</div>
              <div className="font-semibold mb-1">1. Upload</div>
              <p className="text-sm text-muted-foreground">Upload any image up to 25MB</p>
            </div>
            <div className="glass rounded-2xl p-6">
              <div className="text-3xl mb-2">🔢</div>
              <div className="font-semibold mb-1">2. Choose Factor</div>
              <p className="text-sm text-muted-foreground">2x = 1 credit · 3x = 2 · 4x = 5</p>
            </div>
            <div className="glass rounded-2xl p-6">
              <div className="text-3xl mb-2">⬇</div>
              <div className="font-semibold mb-1">3. Download</div>
              <p className="text-sm text-muted-foreground">Get your HD result instantly</p>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8">Frequently Asked Questions</h2>
          <div className="space-y-3">
            <FaqItem q="Can I get a refund?" a="Yes. If you're not satisfied with your purchase, contact us within 7 days for a full refund. Unused credits from credit packs are fully refundable within 30 days. Monthly subscriptions can be cancelled anytime — you'll keep access until the end of your billing period." />
            <FaqItem q="Do unused credits roll over?" a="Monthly credits reset on the 1st of each month and do not roll over. One-time credit pack credits never expire." />
            <FaqItem q="Can I cancel my subscription?" a="Absolutely. Cancel anytime with one click from your account. Your subscription remains active until the end of your current billing period — no partial refunds for remaining days." />
            <FaqItem q="What payment methods do you accept?" a="We accept all major credit and debit cards via Stripe. More payment options coming soon." />
            <FaqItem q="Can I upgrade or downgrade my plan?" a="Yes! Upgrade anytime — the price difference is prorated. Downgrade takes effect at the end of your current billing cycle." />
            <FaqItem q="Is there a free trial?" a="Yes! Sign in with Google to get 5 free credits every month. No credit card required." />
            <FaqItem q="What happens if I exceed my credits?" a="You won't be charged automatically. Simply buy a one-time credit pack or upgrade your plan to continue upscaling." />
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

function FaqItem({ q, a }: { q: string; a: string }) {
  return (
    <details className="group rounded-xl glass p-5 cursor-pointer transition-all duration-200 hover:shadow-sm">
      <summary className="font-medium flex items-center justify-between list-none">
        {q}
        <span className="text-muted-foreground group-open:rotate-45 transition-transform duration-200 text-lg">+</span>
      </summary>
      <p className="text-sm text-muted-foreground mt-3 leading-relaxed">{a}</p>
    </details>
  );
}
