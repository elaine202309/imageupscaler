import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { db, users } from "@/lib/db";
import { eq } from "drizzle-orm";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    }),
  ],
  pages: {
    signIn: "/login",
    newUser: "/member",
  },
  callbacks: {
    async signIn({ user }) {
      if (!user.email) return false;
      try {
        const existing = await db
          .select()
          .from(users)
          .where(eq(users.email, user.email))
          .limit(1);

        if (existing.length === 0) {
          await db.insert(users).values({
            id: user.id || crypto.randomUUID(),
            email: user.email,
            name: user.name || "",
            image: user.image || "",
            plan: "free",
            monthlyCredits: 5,
            creditsUsed: 0,
            creditResetAt: new Date(
              new Date().getFullYear(),
              new Date().getMonth() + 1,
              1
            ),
          });
        }
      } catch (e) {
        console.error("User save error:", e);
      }
      return true;
    },
    async session({ session, token }) {
      if (session.user && token.sub) {
        (session.user as { id: string }).id = token.sub;
      }
      return session;
    },
  },
});
