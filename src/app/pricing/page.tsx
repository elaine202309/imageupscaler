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
            <FaqItem q="Do I need to sign up to use the service?" a="You can explore the site without signing up, but a Google account is required to upscale images. Signing up gives you 5 free credits every month — no credit card needed." />
            <FaqItem q="What happens to unused credits at the end of the month?" a="Free monthly credits reset on the 1st and don't carry over. One-time credit packs never expire, so you can use them whenever you need." />
            <FaqItem q="Will I be charged when my free credits run out?" a="No. We never charge you without permission. When credits run low, you can choose to buy a credit pack or upgrade — but only if you want to." />
            <FaqItem q="Can I get a refund?" a="Yes. If you're not happy with your purchase, email us within 7 days for a full refund. Unused credit pack credits are refundable within 30 days. Subscriptions can be cancelled anytime — you'll keep access until the period ends." />
            <FaqItem q="What if I use up all my credits?" a="You can top up with a one-time credit pack starting at $3 for 20 credits, or upgrade to a plan with more monthly credits. There's no auto-charge — you stay in control." />
            <FaqItem q="Can I upgrade or downgrade later?" a="Yes. Upgrade anytime and pay only the difference. Want to downgrade? No problem — it takes effect at the end of your current billing cycle." />
            <FaqItem q="Where do my images go after processing?" a="Uploaded and processed images are automatically deleted within 30 days. You can request earlier deletion anytime. We never use your images for training or share them with anyone." />
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
