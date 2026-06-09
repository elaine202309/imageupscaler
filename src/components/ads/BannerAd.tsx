"use client";

/**
 * AdSense banner ad component.
 * Replace data-ad-client and data-ad-slot with your actual AdSense IDs.
 */

interface BannerAdProps {
  slot?: string; // data-ad-slot
  format?: "auto" | "horizontal" | "vertical";
  className?: string;
}

export function BannerAd({
  slot = "1234567890",
  format = "auto",
  className = "",
}: BannerAdProps) {
  // Don't render ads during development
  if (process.env.NODE_ENV === "development") {
    return (
      <div
        className={`flex items-center justify-center bg-muted/30 rounded-lg border border-dashed border-muted-foreground/30 ${className}`}
        style={{ minHeight: format === "vertical" ? "600px" : "90px" }}
      >
        <span className="text-xs text-muted-foreground">Ad Placement</span>
      </div>
    );
  }

  return (
    <div className={`overflow-hidden ${className}`}>
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || "ca-pub-XXXXXXXXXXXXXXXX"}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
}
