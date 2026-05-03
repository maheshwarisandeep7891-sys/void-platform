import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import { prisma } from "@/lib/prisma";

// Build provider list dynamically based on available env vars
function buildProviders() {
  const providers = [];

  if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
    providers.push(
      GitHub({
        clientId: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
      })
    );
  }

  if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    providers.push(
      Google({
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      })
    );
  }

  // Magic link via Resend (only if API key is set)
  if (process.env.RESEND_API_KEY) {
    // Dynamic import to avoid build-time issues
    const Resend = require("next-auth/providers/resend").default;
    providers.push(
      Resend({
        apiKey: process.env.RESEND_API_KEY,
        from: process.env.EMAIL_FROM ?? "noreply@void.dev",
      })
    );
  }

  return providers;
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: buildProviders(),
  session: {
    strategy: "database",
  },
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
        try {
          const dbUser = await prisma.user.findUnique({
            where: { id: user.id },
            select: {
              username: true,
              role: true,
              reputation: { select: { score: true, level: true } },
            },
          });
          if (dbUser) {
            (session.user as any).username = dbUser.username;
            (session.user as any).role = dbUser.role;
            (session.user as any).reputation = dbUser.reputation;
          }
        } catch {
          // DB not available during build
        }
      }
      return session;
    },
    async signIn({ user, account, profile }) {
      if (!user.email) return false;

      try {
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email },
        });

        if (!existingUser) {
          const baseUsername = (
            (profile as any)?.login ||
            user.name?.toLowerCase().replace(/\s+/g, "_") ||
            user.email.split("@")[0]
          )
            .replace(/[^a-z0-9_]/g, "")
            .slice(0, 20);

          let username = baseUsername || "user";
          let counter = 1;
          while (await prisma.user.findUnique({ where: { username } })) {
            username = `${baseUsername}${counter++}`;
          }

          await prisma.user.create({
            data: {
              email: user.email,
              name: user.name,
              image: user.image,
              username,
              reputation: {
                create: { score: 0, level: "NEWCOMER" },
              },
            },
          });
        }
      } catch (err) {
        console.error("signIn callback error:", err);
        return false;
      }

      return true;
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
    verifyRequest: "/auth/verify",
  },
  secret: process.env.NEXTAUTH_SECRET ?? "void-dev-secret-change-in-production",
});
