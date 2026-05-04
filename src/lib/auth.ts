import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";

/**
 * NextAuth v5 beta configuration
 * Using JWT strategy (no database sessions) to avoid PrismaAdapter issues
 * User data is stored in the JWT token
 */
export const { handlers, auth, signIn, signOut } = NextAuth({
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
  // Use JWT strategy — no database needed for sessions
  // This avoids the PrismaAdapter Configuration error
  session: {
    strategy: "jwt",
  },
  secret: process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET ?? "void-fallback-secret",
  callbacks: {
    async jwt({ token, user, account, profile }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.image = user.image;
      }
      // On first sign in, create/update user in DB
      if (account && user?.email) {
        try {
          const { prisma } = await import("@/lib/prisma");
          let dbUser = await prisma.user.findUnique({
            where: { email: user.email },
            select: { id: true, username: true, role: true, reputation: { select: { score: true, level: true } } },
          });

          if (!dbUser) {
            // Create new user
            const baseUsername = (
              (profile as any)?.login ||
              user.name?.toLowerCase().replace(/\s+/g, "_") ||
              user.email.split("@")[0]
            ).replace(/[^a-z0-9_]/g, "").slice(0, 20) || "user";

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
              select: { id: true, username: true, role: true, reputation: { select: { score: true, level: true } } },
            });
          } else {
            // Update image if changed
            if (user.image && user.image !== dbUser.id) {
              await prisma.user.update({
                where: { id: dbUser.id },
                data: { image: user.image, name: user.name ?? undefined },
              });
            }
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
});
