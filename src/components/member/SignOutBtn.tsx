"use client";

import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";

export function SignOutBtn() {
  return (
    <Button variant="ghost" className="rounded-xl" onClick={() => signOut({ callbackUrl: "/" })}>
      Sign Out
    </Button>
  );
}
