"use client";

import { useState } from "react";

export function ResetBtn({ userId }: { userId: string }) {
  const [done, setDone] = useState(false);

  async function reset() {
    await fetch("/api/admin/reset-credits", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, credits: 5 }),
    });
    setDone(true);
    setTimeout(() => setDone(false), 2000);
  }

  return (
    <button
      onClick={reset}
      className="ml-2 text-xs px-2 py-0.5 rounded bg-purple-100 text-purple-700 hover:bg-purple-200"
    >
      {done ? "✓ Done" : "Reset"}
    </button>
  );
}
