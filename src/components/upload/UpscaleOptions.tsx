"use client";

import type { Plan } from "@/types";
import { cn } from "@/lib/utils";

export type TargetResolution = "HD" | "2K" | "4K";

interface UpscaleOptionsProps {
  selected: TargetResolution | null;
  onSelect: (target: TargetResolution) => void;
  disabled: boolean;
  userPlan?: Plan;
}

const options: {
  target: TargetResolution;
  label: string;
  desc: string;
  credits: number;
  minPlan: Plan;
}[] = [
  { target: "HD", label: "HD", desc: "2× your image size", credits: 1, minPlan: "free" },
  { target: "2K", label: "2K", desc: "3× your image size", credits: 2, minPlan: "free" },
  { target: "4K", label: "4K", desc: "4× your image size", credits: 5, minPlan: "plus" },
];

export function UpscaleOptions({
  selected,
  onSelect,
  disabled,
  userPlan = "free",
}: UpscaleOptionsProps) {
  const planLevel: Record<Plan, number> = {
    free: 0,
    plus: 1,
    pro: 2,
    starter: 0,
    enterprise: 0,
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {options.map((opt) => {
        const isLocked = planLevel[userPlan] < planLevel[opt.minPlan];
        const isSelected = selected === opt.target;

        return (
          <button
            key={opt.target}
            onClick={() => !isLocked && !disabled && onSelect(opt.target)}
            disabled={disabled || isLocked}
            className={cn(
              "relative p-5 rounded-2xl text-center transition-all duration-300 border-2",
              isSelected &&
                "border-purple-400 bg-purple-50/50 shadow-md shadow-purple-500/10 scale-[1.03]",
              !isSelected &&
                !isLocked &&
                "glass hover:border-purple-200 hover:shadow-md hover:-translate-y-1 cursor-pointer",
              isLocked && "opacity-40 cursor-not-allowed",
              disabled && !isLocked && "opacity-50 cursor-not-allowed"
            )}
          >
            <div className="text-3xl font-bold gradient-text mb-1.5">
              {opt.label}
            </div>
            <p className="text-xs text-muted-foreground mb-1">{opt.desc}</p>
            <p className="text-xs font-medium text-muted-foreground mb-3">
              {opt.credits} credit{opt.credits > 1 ? "s" : ""}
            </p>
            {isLocked ? (
              <span className="text-xs font-medium text-red-400">
                🔒 Upgrade to Plus+
              </span>
            ) : isSelected ? (
              <span
                className="inline-block text-xs font-semibold text-white px-4 py-1.5 rounded-xl"
                style={{ background: "var(--gradient-primary)" }}
              >
                Selected ✓
              </span>
            ) : (
              <span className="inline-block text-xs font-medium text-muted-foreground px-4 py-1.5 rounded-xl border border-border">
                Select
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
