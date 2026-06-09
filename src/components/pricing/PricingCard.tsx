"use client";

import { ButtonLink } from "@/components/ui/button";
import type { PricingPlan } from "@/types";
import { cn } from "@/lib/utils";

interface PricingCardProps {
  plan: PricingPlan;
  current?: boolean;
  onSelect: (plan: PricingPlan) => void;
}

export function PricingCard({ plan, current, onSelect }: PricingCardProps) {
  return (
    <div
      className={cn(
        "relative flex flex-col rounded-2xl p-6 transition-all duration-300",
        plan.highlighted
          ? "border-2 border-purple-400 shadow-xl shadow-purple-500/15 scale-[1.03]"
          : "glass hover:shadow-lg hover:shadow-purple-500/5 hover:-translate-y-1"
      )}
      style={plan.highlighted ? { background: "var(--gradient-card)" } : undefined}
    >
      {/* Highlight badge */}
      {plan.highlighted && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-semibold text-white shadow-lg" style={{ background: "var(--gradient-primary)" }}>
          Most Popular
        </div>
      )}

      {/* Plan name & price */}
      <div className="text-center mb-5 mt-2">
        <h3 className="text-lg font-semibold mb-1">{plan.name}</h3>
        <div className="flex items-baseline justify-center gap-0.5">
          <span className="text-sm text-muted-foreground">$</span>
          <span className="text-4xl font-bold">{plan.price}</span>
          <span className="text-sm text-muted-foreground">/mo</span>
        </div>
        <p className="text-sm text-muted-foreground mt-1">{plan.creditsPerMonth} credits / month</p>
      </div>

      {/* Features */}
      <ul className="space-y-2.5 mb-6 flex-1">
        {plan.features.map((feature) => (
          <li key={feature} className="flex items-start gap-2 text-sm">
            <CheckIcon className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
            <span className="text-muted-foreground">{feature}</span>
          </li>
        ))}
      </ul>

      {/* Action */}
      {plan.price === 0 ? (
        <ButtonLink
          href="/upload"
          variant={plan.highlighted ? "default" : "outline"}
          className={cn("w-full rounded-xl", plan.highlighted && "shadow-md shadow-purple-500/20")}
        >
          Get Started Free
        </ButtonLink>
      ) : (
        <button
          onClick={() => onSelect(plan)}
          disabled={current}
          className={cn(
            "w-full py-2.5 text-sm font-semibold rounded-xl transition-all duration-200",
            current
              ? "bg-muted text-muted-foreground cursor-default"
              : plan.highlighted
                ? "text-white shadow-md shadow-purple-500/25 hover:shadow-lg hover:shadow-purple-500/35 hover:-translate-y-0.5"
                : "border-2 border-primary text-primary hover:bg-primary hover:text-white"
          )}
          style={plan.highlighted && !current ? { background: "var(--gradient-primary)" } : undefined}
        >
          {current ? "Current Plan" : "Subscribe"}
        </button>
      )}
    </div>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}
