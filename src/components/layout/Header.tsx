"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { ButtonLink } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { QuotaBadge } from "./QuotaBadge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signOut } from "next-auth/react";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const { data: session } = useSession();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        scrolled ? "glass shadow-sm" : "bg-transparent"
      )}
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2.5 font-bold text-xl group shrink-0">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6"
            style={{ background: "var(--gradient-primary)" }}>
            <SparkleIcon className="w-4.5 h-4.5 text-white" />
          </div>
          <span className="hidden sm:inline">ImageUpscaler</span>
        </Link>

        <div className="flex items-center gap-3">
          <QuotaBadge />
          <ButtonLink href="/pricing" variant="ghost" size="sm" className="rounded-xl hidden sm:flex">
            Pricing
          </ButtonLink>

          {session?.user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="rounded-full ring-2 ring-purple-200 hover:ring-purple-400 transition-all">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={session.user.image || ""} />
                    <AvatarFallback className="text-xs">
                      {session.user.name?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem asChild>
                  <Link href="/member">My Account</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/pricing">Upgrade Plan</Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => signOut({ callbackUrl: "/" })}>
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <ButtonLink href="/login" variant="ghost" size="sm" className="rounded-xl">
                Sign In
              </ButtonLink>
              <ButtonLink href="/pricing" size="sm" className="rounded-xl shadow-md shadow-purple-500/20 hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5">
                Upgrade
              </ButtonLink>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

function SparkleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 20 20">
      <path d="M12.736 3.97a.733.733 0 011.294 0l2.345 4.587a.733.733 0 00.537.39l5.048.764c.596.09.834.82.405 1.24l-3.643 3.638a.733.733 0 00-.205.635l.854 5.136c.1.596-.524 1.05-1.06.773l-4.47-2.307a.734.734 0 00-.666 0l-4.47 2.307c-.536.277-1.16-.177-1.06-.773l.854-5.136a.733.733 0 00-.205-.636L4.91 10.95c-.43-.42-.19-1.15.405-1.24l5.048-.764a.733.733 0 00.537-.39l2.345-4.587z" />
    </svg>
  );
}
