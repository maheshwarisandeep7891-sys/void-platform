/**
 * Step 1: Redirect to GitHub OAuth
 * GET /api/auth/signin?callbackUrl=/feed
 */
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { GITHUB_AUTH_URL, getGitHubClientId, getBaseUrl } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const callbackUrl = req.nextUrl.searchParams.get("callbackUrl") ?? "/feed";
  const clientId = getGitHubClientId();
  const base = getBaseUrl();

  if (!clientId) {
    return NextResponse.redirect(`${base}/auth/error?error=Configuration`);
  }

  // Generate CSRF state
  const state = crypto.randomBytes(32).toString("hex");

  // Build GitHub OAuth URL
  const githubUrl = new URL(GITHUB_AUTH_URL);
  githubUrl.searchParams.set("client_id", clientId);
  githubUrl.searchParams.set(
    "redirect_uri",
    `${base}/api/auth/callback/github`
  );
  githubUrl.searchParams.set("scope", "read:user user:email");
  githubUrl.searchParams.set("state", state);

  const response = NextResponse.redirect(githubUrl.toString());

  // Use sameSite=none so cookies survive the GitHub cross-site redirect
  const cookieOpts = {
    httpOnly: true,
    secure: true,
    sameSite: "none" as const,
    maxAge: 600,
    path: "/",
  };

  response.cookies.set("void_oauth_state", state, cookieOpts);
  response.cookies.set("void_oauth_callback", callbackUrl, cookieOpts);

  return response;
}
