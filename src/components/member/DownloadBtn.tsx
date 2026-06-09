"use client";

import { useState } from "react";

export function DownloadBtn({ url, filename }: { url: string; filename: string }) {
  const [downloading, setDownloading] = useState(false);

  async function handleDownload() {
    setDownloading(true);
    try {
      const res = await fetch(url);
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(blobUrl);
    } catch {
      // Fallback: open in new tab
      window.open(url, "_blank");
    } finally {
      setDownloading(false);
    }
  }

  return (
    <button
      onClick={handleDownload}
      disabled={downloading}
      className="inline-flex items-center gap-1 mt-2 px-3 py-1.5 text-xs font-semibold text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
      style={{ background: "var(--gradient-primary)" }}
    >
      {downloading ? "⏳ Loading..." : "⬇ Download"}
    </button>
  );
}
