import { auth, signOut } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db, users, upscaleJobs } from "@/lib/db";
import { eq, desc } from "drizzle-orm";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { PRICING_PLANS } from "@/types";

export default async function MemberPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  // Fetch user data
  let user = null;
  try {
    user = await db
      .select()
      .from(users)
      .where(eq(users.email, session.user.email!))
      .get();
  } catch {
    // DB not available
  }

  // Fetch recent jobs
  let jobs: any[] = [];
  try {
    if (user) {
      jobs = await db
        .select()
        .from(upscaleJobs)
        .where(eq(upscaleJobs.userId, user.id))
        .orderBy(desc(upscaleJobs.createdAt))
        .limit(10);
    }
  } catch {
    // DB not available
  }

  const plan = (user?.plan as string) || "free";
  const creditsUsed = user?.creditsUsed || 0;
  const creditsTotal = user?.monthlyCredits || 5;
  const planInfo = PRICING_PLANS.find((p) => p.id === plan);

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

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="glass p-6 rounded-2xl text-center">
            <div className="text-3xl font-bold gradient-text mb-1">
              {creditsTotal - creditsUsed}
            </div>
            <div className="text-sm text-muted-foreground">Credits Remaining</div>
            <div className="text-xs text-muted-foreground mt-1">
              of {creditsTotal} / month
            </div>
          </Card>
          <Card className="glass p-6 rounded-2xl text-center">
            <div className="text-3xl font-bold gradient-text mb-1">{jobs.length}</div>
            <div className="text-sm text-muted-foreground">Recent Upscales</div>
          </Card>
          <Card className="glass p-6 rounded-2xl text-center">
            <div className="text-xl font-bold text-primary mb-1 capitalize">{plan}</div>
            <div className="text-sm text-muted-foreground">
              {planInfo?.creditsPerMonth || 5} credits/mo
            </div>
            <Link href="/pricing" className="text-xs text-primary hover:underline mt-1 inline-block">
              Upgrade Plan →
            </Link>
          </Card>
        </div>

        {/* Usage Bar */}
        <Card className="glass p-5 rounded-2xl mb-8">
          <div className="flex justify-between text-sm mb-2">
            <span>Credits Used</span>
            <span className="font-medium">
              {creditsUsed} / {creditsTotal}
            </span>
          </div>
          <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: `${Math.min(100, (creditsUsed / creditsTotal) * 100)}%`,
                background: "var(--gradient-primary)",
              }}
            />
          </div>
        </Card>

        {/* History */}
        <h2 className="text-xl font-bold mb-4">Recent Upscale History</h2>
        {jobs.length === 0 ? (
          <Card className="glass p-8 rounded-2xl text-center text-muted-foreground">
            No upscales yet.{" "}
            <Link href="/" className="text-primary hover:underline">
              Start your first upscale →
            </Link>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {jobs.map((job) => (
              <Card key={job.id} className="glass overflow-hidden rounded-2xl">
                <img
                  src={job.resultUrl || job.originalUrl}
                  alt=""
                  className="w-full h-32 object-cover"
                />
                <div className="p-3">
                  <div className="flex items-center justify-between mb-1">
                    <Badge variant="outline" className="text-xs">
                      {job.scaleFactor}x
                    </Badge>
                    <StatusBadge status={job.status} />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {new Date(job.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, "default" | "secondary" | "destructive"> = {
    completed: "default",
    processing: "secondary",
    failed: "destructive",
    pending: "secondary",
  };
  return <Badge variant={map[status] || "secondary"}>{status}</Badge>;
}
