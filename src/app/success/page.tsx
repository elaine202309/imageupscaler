import Link from "next/link";

export default function SuccessPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center" style={{ background: "var(--gradient-subtle)" }}>
      <div className="text-center glass rounded-3xl p-12 max-w-md mx-4">
        <div className="text-5xl mb-4">🎉</div>
        <h1 className="text-3xl font-bold mb-2">Payment Successful!</h1>
        <p className="text-muted-foreground mb-6">Thank you for your purchase. Your credits have been added to your account.</p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-8 py-3 rounded-xl text-white font-semibold hover:opacity-90 transition-opacity"
          style={{ background: "var(--gradient-primary)" }}
        >
          Start Upscaling →
        </Link>
      </div>
    </div>
  );
}
