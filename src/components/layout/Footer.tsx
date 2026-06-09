import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-border/50 mt-auto" style={{ background: "var(--gradient-subtle)" }}>
      <div className="container mx-auto px-4 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Brand */}
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "var(--gradient-primary)" }}>
              <svg className="w-3.5 h-3.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M12.736 3.97a.733.733 0 011.294 0l2.345 4.587a.733.733 0 00.537.39l5.048.764c.596.09.834.82.405 1.24l-3.643 3.638a.733.733 0 00-.205.635l.854 5.136c.1.596-.524 1.05-1.06.773l-4.47-2.307a.734.734 0 00-.666 0l-4.47 2.307c-.536.277-1.16-.177-1.06-.773l.854-5.136a.733.733 0 00-.205-.636L4.91 10.95c-.43-.42-.19-1.15.405-1.24l5.048-.764a.733.733 0 00.537-.39l2.345-4.587z" />
              </svg>
            </div>
            <span className="font-bold text-sm">ImageUpscaler</span>
          </div>

          {/* Links */}
          <div className="flex gap-6 text-sm text-muted-foreground">
            <Link href="/pricing" className="hover:text-foreground transition-colors">Pricing</Link>
            <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-foreground transition-colors">Terms</Link>
          </div>

          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} ImageUpscaler
          </p>
        </div>
        <p className="text-center text-xs text-muted-foreground/60 pb-4">
          Powered by SeedVR2 AI
        </p>
      </div>
    </footer>
  );
}
