"use client";

/**
 * Sidebar vertical ad unit.
 */

interface SidebarAdProps {
  slot?: string;
  className?: string;
}

export function SidebarAd({ slot = "1234567891", className = "" }: SidebarAdProps) {
  if (process.env.NODE_ENV === "development") {
    return (
      <div
        className={`flex items-center justify-center bg-muted/30 rounded-lg border border-dashed border-muted-foreground/30 ${className}`}
        style={{ minHeight: "250px", width: "300px" }}
      >
        <span className="text-xs text-muted-foreground">Sidebar Ad</span>
      </div>
    );
  }

  return (
    <div className={className}>
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || "ca-pub-XXXXXXXXXXXXXXXX"}
        data-ad-slot={slot}
        data-ad-format="vertical"
        data-full-width-responsive="true"
      />
    </div>
  );
}
