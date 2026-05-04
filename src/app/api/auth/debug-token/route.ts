import { NextRequest, NextResponse } from "next/server";
import { getGitHubClientId, getGitHubClientSecret, getBaseUrl } from "@/lib/auth";

// Debug endpoint - shows what credentials are being used
export async function GET(req: NextRequest) {
  const clientId = getGitHubClientId();
  const clientSecret = getGitHubClientSecret();
  const base = getBaseUrl();

  return NextResponse.json({
    clientId: clientId ? `${clientId.slice(0, 8)}...` : "MISSING",
    clientSecretLength: clientSecret?.length ?? 0,
    clientSecretStart: clientSecret ? clientSecret.slice(0, 5) : "MISSING",
    baseUrl: base,
    callbackUrl: `${base}/api/auth/callback/github`,
    envVars: {
      AUTH_GITHUB_ID: process.env.AUTH_GITHUB_ID ? "SET" : "MISSING",
      GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID ? "SET" : "MISSING",
      AUTH_GITHUB_SECRET: process.env.AUTH_GITHUB_SECRET ? "SET" : "MISSING",
      GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET ? "SET" : "MISSING",
      NEXTAUTH_URL: process.env.NEXTAUTH_URL ?? "MISSING",
    }
  });
}
