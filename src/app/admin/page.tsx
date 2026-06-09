import { auth, signOut } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db, users, upscaleJobs } from "@/lib/db";
import { desc } from "drizzle-orm";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";

const ADMIN_EMAIL = "elaine20230910@gmail.com";

export default async function AdminPage() {
  const session = await auth();
  if (!session?.user?.email || session.user.email !== ADMIN_EMAIL) {
    redirect("/");
  }

  let allUsers: any[] = [];
  let allJobs: any[] = [];
  let stats = { totalUsers: 0, totalJobs: 0, completedJobs: 0 };

  try {
    allUsers = await db.select().from(users).orderBy(desc(users.createdAt));
    allJobs = await db.select().from(upscaleJobs).orderBy(desc(upscaleJobs.createdAt)).limit(100);

    stats = {
      totalUsers: allUsers.length,
      totalJobs: allJobs.length,
      completedJobs: allJobs.filter((j: any) => j.status === "completed").length,
    };
  } catch (e) {
    console.error("Admin DB error:", e);
  }

  return (
    <div className="min-h-[80vh]" style={{ background: "var(--gradient-subtle)" }}>
      <div className="container mx-auto max-w-5xl px-4 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground">All users and usage data</p>
          </div>
          <div className="flex gap-3">
            <Link href="/member"><Button variant="outline" className="rounded-xl">My Account</Button></Link>
            <Link href="/"><Button variant="outline" className="rounded-xl">Home</Button></Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="glass p-6 rounded-2xl text-center">
            <div className="text-3xl font-bold gradient-text">{stats.totalUsers}</div>
            <div className="text-sm text-muted-foreground">Total Users</div>
          </Card>
          <Card className="glass p-6 rounded-2xl text-center">
            <div className="text-3xl font-bold gradient-text">{stats.totalJobs}</div>
            <div className="text-sm text-muted-foreground">Total Jobs (recent 100)</div>
          </Card>
          <Card className="glass p-6 rounded-2xl text-center">
            <div className="text-3xl font-bold gradient-text">{stats.completedJobs}</div>
            <div className="text-sm text-muted-foreground">Completed</div>
          </Card>
        </div>

        {/* Users Table */}
        <h2 className="text-xl font-bold mb-4">All Users</h2>
        <div className="overflow-x-auto mb-8">
          <table className="w-full text-sm glass rounded-2xl">
            <thead>
              <tr className="border-b text-left">
                <th className="p-3">Name</th>
                <th className="p-3">Email</th>
                <th className="p-3">Plan</th>
                <th className="p-3">Credits</th>
                <th className="p-3">Joined</th>
              </tr>
            </thead>
            <tbody>
              {allUsers.map((u: any) => (
                <tr key={u.id} className="border-b border-muted">
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      {u.image && <img src={u.image} alt="" className="w-6 h-6 rounded-full" />}
                      {u.name || "—"}
                    </div>
                  </td>
                  <td className="p-3 text-muted-foreground">{u.email}</td>
                  <td className="p-3 capitalize">{u.plan}</td>
                  <td className="p-3">{u.creditsUsed}/{u.monthlyCredits}</td>
                  <td className="p-3 text-muted-foreground">
                    {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : ""}
                  </td>
                </tr>
              ))}
              {allUsers.length === 0 && (
                <tr><td colSpan={5} className="p-6 text-center text-muted-foreground">No users yet</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Recent Jobs */}
        <h2 className="text-xl font-bold mb-4">Recent Jobs</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm glass rounded-2xl">
            <thead>
              <tr className="border-b text-left">
                <th className="p-3">Time</th>
                <th className="p-3">User</th>
                <th className="p-3">Scale</th>
                <th className="p-3">Status</th>
                <th className="p-3">Result</th>
              </tr>
            </thead>
            <tbody>
              {allJobs.map((j: any) => (
                <tr key={j.id} className="border-b border-muted">
                  <td className="p-3 text-muted-foreground">
                    {j.createdAt ? new Date(j.createdAt).toLocaleString() : ""}
                  </td>
                  <td className="p-3 text-muted-foreground text-xs">{j.userId?.slice(0, 8) || "anon"}</td>
                  <td className="p-3">{j.scaleFactor}x</td>
                  <td className="p-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      j.status === "completed" ? "bg-green-100 text-green-700" :
                      j.status === "failed" ? "bg-red-100 text-red-700" :
                      "bg-yellow-100 text-yellow-700"
                    }`}>{j.status}</span>
                  </td>
                  <td className="p-3">
                    {j.resultUrl && <a href={j.resultUrl} className="text-primary hover:underline text-xs" target="_blank">View →</a>}
                  </td>
                </tr>
              ))}
              {allJobs.length === 0 && (
                <tr><td colSpan={5} className="p-6 text-center text-muted-foreground">No jobs yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
