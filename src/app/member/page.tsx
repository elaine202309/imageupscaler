import { auth, signOut } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";

export default async function MemberPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  return (
    <div className="min-h-[80vh]" style={{ background: "var(--gradient-subtle)" }}>
      <div className="container mx-auto max-w-4xl px-4 py-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">
              Welcome, {session.user.name?.split(" ")[0] || "User"}
            </h1>
            <p className="text-muted-foreground">{session.user.email}</p>
          </div>
          <div className="flex gap-3">
            <Link href="/">
              <Button variant="outline" className="rounded-xl">Home</Button>
            </Link>
            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/" });
              }}
            >
              <Button variant="ghost" className="rounded-xl">Sign Out</Button>
            </form>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="glass p-6 rounded-2xl text-center">
            <div className="text-3xl font-bold gradient-text mb-1">5</div>
            <div className="text-sm text-muted-foreground">Free Credits / Month</div>
            <Link href="/pricing" className="text-xs text-primary hover:underline mt-1 inline-block">Upgrade →</Link>
          </Card>
          <Card className="glass p-6 rounded-2xl text-center">
            <div className="text-3xl font-bold gradient-text mb-1">Free</div>
            <div className="text-sm text-muted-foreground">Current Plan</div>
          </Card>
          <Card className="glass p-6 rounded-2xl text-center">
            <div className="text-3xl font-bold gradient-text mb-1">—</div>
            <div className="text-sm text-muted-foreground">Upscales This Month</div>
          </Card>
        </div>

        {/* Usage Bar */}
        <Card className="glass p-5 rounded-2xl mb-8">
          <div className="flex justify-between text-sm mb-2">
            <span>Credits Used</span>
            <span className="font-medium">0 / 5</span>
          </div>
          <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
            <div className="h-full rounded-full" style={{ width: "0%", background: "var(--gradient-primary)" }} />
          </div>
        </Card>

        {/* Actions */}
        <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link href="/">
            <Card className="glass p-6 rounded-2xl hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer">
              <div className="text-2xl mb-2">🖼</div>
              <h3 className="font-semibold">Upscale Image</h3>
              <p className="text-sm text-muted-foreground">Upload and enhance your images</p>
            </Card>
          </Link>
          <Link href="/pricing">
            <Card className="glass p-6 rounded-2xl hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer">
              <div className="text-2xl mb-2">💎</div>
              <h3 className="font-semibold">Upgrade Plan</h3>
              <p className="text-sm text-muted-foreground">Get more credits per month</p>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
}
