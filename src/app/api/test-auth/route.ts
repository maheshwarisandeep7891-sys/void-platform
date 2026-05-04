import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Test if GitHub provider can generate an authorization URL
    const GitHubProvider = (await import("next-auth/providers/github")).default;
    
    const provider = GitHubProvider({
      clientId: process.env.AUTH_GITHUB_ID ?? process.env.GITHUB_CLIENT_ID ?? "",
      clientSecret: process.env.AUTH_GITHUB_SECRET ?? process.env.GITHUB_CLIENT_SECRET ?? "",
    });

    return NextResponse.json({
      providerId: provider.id,
      providerType: provider.type,
      clientId: provider.clientId ? `${String(provider.clientId).slice(0, 5)}...` : "MISSING",
      clientSecret: provider.clientSecret ? "SET" : "MISSING",
      authorization: provider.authorization,
      hasToken: !!provider.token,
      nodeVersion: process.version,
      env: {
        AUTH_GITHUB_ID: process.env.AUTH_GITHUB_ID ? `${process.env.AUTH_GITHUB_ID.slice(0, 5)}...` : "MISSING",
        NEXTAUTH_URL: process.env.NEXTAUTH_URL ?? "NOT SET",
        NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? "SET" : "MISSING",
        AUTH_SECRET: process.env.AUTH_SECRET ? "SET" : "MISSING",
      }
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message, stack: err.stack }, { status: 500 });
  }
}
