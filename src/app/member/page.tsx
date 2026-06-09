import { auth, signOut } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db, users, upscaleJobs } from "@/lib/db";
import { initDB } from "@/lib/db/init";
import { eq, desc } from "drizzle-orm";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export default async function MemberPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  // Fetch user from DB
  let userData = { plan: "free", monthlyCredits: 5, creditsUsed: 0 };
  let jobs: any[] = [];

  try {
    await initDB();
    const userRows = await db
      .select()
      .from(users)
      .where(eq(users.email, session.user.email!))
      .limit(1);

    if (userRows.length > 0) {
      const u = userRows[0];
      userData = {
        plan: u.plan || "free",
        monthlyCredits: u.monthlyCredits || 5,
        creditsUsed: u.creditsUsed || 0,
      };

      // Fetch recent jobs
      jobs = await db
        .select()
        .from(upscaleJobs)
        .where(eq(upscaleJobs.userId, u.id))
        .orderBy(desc(upscaleJobs.createdAt))
        .limit(12);
    }
  } catch (e) {
    console.error("Member page DB error:", e);
  }

  const remaining = userData.monthlyCredits - userData.creditsUsed;

  return (
    <div className="min-h-[80vh]" style={{ background: "var(--gradient-subtle)" }}>
      <div className="container mx-auto max-w-4xl px-4 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">
              Welcome, {session.user.name?.split(" ")[0] || "User"}
            </h1>
            <p className="text-muted-foreground">{session.user.email}</p>
          </div>
          <div className="flex gap-3">
            <Link href="/"><Button variant="outline" className="rounded-xl">Home</Button></Link>
            <form action={async () => { "use server"; await signOut({ redirectTo: "/" }); }}>
              <Button variant="ghost" className="rounded-xl">Sign Out</Button>
            </form>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="glass p-6 rounded-2xl text-center">
            <div className="text-3xl font-bold gradient-text mb-1">{remaining}</div>
            <div className="text-sm text-muted-foreground">Credits Remaining</div>
          </Card>
          <Card className="glass p-6 rounded-2xl text-center">
            <div className="text-3xl font-bold gradient-text mb-1">{jobs.length}</div>
            <div className="text-sm text-muted-foreground">Recent Upscales</div>
          </Card>
          <Card className="glass p-6 rounded-2xl text-center">
            <div className="text-xl font-bold text-primary mb-1 capitalize">{userData.plan}</div>
            <div className="text-sm text-muted-foreground">{userData.monthlyCredits} credits/mo</div>
            <Link href="/pricing" className="text-xs text-primary hover:underline mt-1 inline-block">Upgrade →</Link>
          </Card>
        </div>

        <Card className="glass p-5 rounded-2xl mb-8">
          <div className="flex justify-between text-sm mb-2">
            <span>Credits Used</span>
            <span className="font-medium">{userData.creditsUsed} / {userData.monthlyCredits}</span>
          </div>
          <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
            <div className="h-full rounded-full transition-all" style={{
              width: `${Math.min(100, (userData.creditsUsed / userData.monthlyCredits) * 100)}%`,
              background: "var(--gradient-primary)",
            }} />
          </div>
        </Card>

        <h2 className="text-xl font-bold mb-4">Recent Upscales</h2>
        {jobs.length === 0 ? (
          <Card className="glass p-8 rounded-2xl text-center text-muted-foreground">
            No upscales yet. <Link href="/" className="text-primary hover:underline">Start your first →</Link>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {jobs.map((job: any) => (
              <Card key={job.id} className="glass overflow-hidden rounded-2xl">
                <img src={job.resultUrl || job.originalUrl} alt="" className="w-full h-32 object-cover" />
                <div className="p-3">
                  <div className="flex items-center justify-between mb-1">
                    <Badge variant="outline" className="text-xs">{job.scaleFactor}x</Badge>
                    <StatusBadge status={job.status} />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {job.createdAt ? new Date(job.createdAt).toLocaleDateString() : ""}
                  </p>
                  {job.resultUrl && (
                    <a href={job.resultUrl} download className="text-xs text-primary hover:underline mt-1 block">Download →</a>
                  )}
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
    completed: "default", processing: "secondary", failed: "destructive", pending: "secondary",
  };
  return <Badge variant={map[status] || "secondary"}>{status}</Badge>;
}
