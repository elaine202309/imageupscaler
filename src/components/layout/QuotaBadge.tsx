"use client";

import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export function QuotaBadge() {
  return (
    <Link href="/pricing">
      <Badge
        variant="outline"
        className="text-xs cursor-pointer hover:opacity-80 transition-opacity"
      >
        5 free credits
      </Badge>
    </Link>
  );
}
