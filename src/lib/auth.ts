/**
 * NextAuth v4 configuration — stable, production-ready
 */
import { NextAuthOptions } from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.AUTH_GITHUB_ID ?? process.env.GITHUB_CLIENT_ID ?? "",
      clientSecret: process.env.AUTH_GITHUB_SECRET ?? process.env.GITHUB_CLIENT_SECRET ?? "",
    }),
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          }),
        ]
      : []),
  ],
  session: {
    strategy: "jwt",
  },
  secret: process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET ?? "void-fallback-secret-change-me",
  callbacks: {
    async jwt({ token, user, account, profile }) {
      if (user) {
        token.id = user.id;
      }
      // On first sign in, create/update user in DB
      if (account && user?.email) {
        try {
          const { prisma } = await import("@/lib/prisma");

          let dbUser = await prisma.user.findUnique({
            where: { email: user.email },
            select: {
              id: true,
              username: true,
              role: true,
              reputation: { select: { score: true, level: true } },
            },
          });

          if (!dbUser) {
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

            dbUser = await prisma.user.create({
              data: {
                email: user.email,
                name: user.name,
                image: user.image,
                username,
                reputation: { create: { score: 0, level: "NEWCOMER" } },
              },
              select: {
                id: true,
                username: true,
                role: true,
                reputation: { select: { score: true, level: true } },
              },
            });
          } else {
            // Update profile image
            await prisma.user.update({
              where: { id: dbUser.id },
              data: {
                image: user.image ?? undefined,
                name: user.name ?? undefined,
              },
            });
          }

          token.id = dbUser.id;
          token.username = dbUser.username;
          token.role = dbUser.role;
          token.reputation = dbUser.reputation;
        } catch (err) {
          console.error("JWT callback DB error:", err);
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        (session.user as any).username = token.username;
        (session.user as any).role = token.role;
        (session.user as any).reputation = token.reputation;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
};
