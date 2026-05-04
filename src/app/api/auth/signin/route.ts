/**
 * Step 1: Redirect to GitHub OAuth
 * GET /api/auth/signin?provider=github&callbackUrl=/feed
 */
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import {
  GITHUB_AUTH_URL,
  getGitHubClientId,
  getBaseUrl,
} from "@/lib/auth";

export async function GET(req: NextRequest) {
  const callbackUrl = req.nextUrl.searchParams.get("callbackUrl") ?? "/feed";
  const clientId = getGitHubClientId();

  if (!clientId) {
    return NextResponse.redirect(new URL("/auth/error?error=Configuration", getBaseUrl()));
  }

  // Generate CSRF state
  const state = crypto.randomBytes(32).toString("hex");

  // Build GitHub OAuth URL
  const githubUrl = new URL(GITHUB_AUTH_URL);
  githubUrl.searchParams.set("client_id", clientId);
  githubUrl.searchParams.set("redirect_uri", `${getBaseUrl()}/api/auth/callback/github`);
  githubUrl.searchParams.set("scope", "read:user user:email");
  githubUrl.searchParams.set("state", state);

  const response = NextResponse.redirect(githubUrl.toString());

  // Store state + callbackUrl in cookies
  const cookieOpts = {
    httpOnly: true,
    secure: true,
    sameSite: "lax" as const,
    maxAge: 600,
    path: "/",
  };
  response.cookies.set("void_oauth_state", state, cookieOpts);
  response.cookies.set("void_oauth_callback", callbackUrl, cookieOpts);

  return response;
}
