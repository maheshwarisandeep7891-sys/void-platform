import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import { prisma } from "@/lib/prisma";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID ?? process.env.GITHUB_CLIENT_ID ?? "",
      clientSecret: process.env.AUTH_GITHUB_SECRET ?? process.env.GITHUB_CLIENT_SECRET ?? "",
    }),
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          Google({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          }),
        ]
      : []),
  ],
  session: {
    strategy: "database",
  },
  secret: process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET,
  callbacks: {
    async session({ session, user }) {
      if (session.user && user) {
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
        } catch (err) {
          console.error("Session callback DB error:", err);
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
          // Generate username from GitHub login or email
          const baseUsername = (
            (profile as any)?.login ||
            user.name?.toLowerCase().replace(/\s+/g, "_") ||
            user.email.split("@")[0]
          )
            .replace(/[^a-z0-9_]/g, "")
            .slice(0, 20) || "user";

          let username = baseUsername;
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
        return true;
      } catch (err) {
        console.error("signIn callback error:", err);
        return false;
      }
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
});
