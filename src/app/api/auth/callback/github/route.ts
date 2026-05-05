/**
 * GitHub OAuth callback - handles the redirect from GitHub after authorization
 */
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  createSessionToken,
  setSessionCookie,
  getGitHubClientId,
  getGitHubClientSecret,
  getBaseUrl,
} from "@/lib/auth";

// Track used codes to prevent double-use (in-memory, resets on cold start)
const usedCodes = new Set<string>();

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const error = searchParams.get("error");
  const base = getBaseUrl();

  if (error) {
    return NextResponse.redirect(
      `${base}/auth/error?error=${encodeURIComponent(error)}`
    );
  }

  if (!code || !state) {
    return NextResponse.redirect(`${base}/auth/error?error=missing_params`);
  }

  // Prevent double-use of codes
  if (usedCodes.has(code)) {
    return NextResponse.redirect(`${base}/auth/error?error=code_already_used`);
  }

  // Verify CSRF state
  const storedState = req.cookies.get("void_oauth_state")?.value;
  const callbackUrl = req.cookies.get("void_oauth_callback")?.value ?? "/feed";

  if (!storedState || storedState !== state) {
    return NextResponse.redirect(`${base}/auth/error?error=invalid_state`);
  }

  const clientId = getGitHubClientId();
  const clientSecret = getGitHubClientSecret();

  if (!clientId || !clientSecret) {
    return NextResponse.redirect(`${base}/auth/error?error=Configuration`);
  }

  // Mark code as used immediately
  usedCodes.add(code);
  // Clean up after 10 minutes
  setTimeout(() => usedCodes.delete(code), 600000);

  try {
    // Exchange code for access token
    // IMPORTANT: redirect_uri must exactly match what was sent in the authorization request
    const callbackUri = `${base}/api/auth/callback/github`;
    
    const tokenRes = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "User-Agent": "VOID-Platform/1.0",
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code,
        redirect_uri: callbackUri,
      }),
    });

    const tokenData = await tokenRes.json();

    if (tokenData.error || !tokenData.access_token) {
      const ghError = tokenData.error_description ?? tokenData.error ?? "token_exchange_failed";
      console.error("GitHub token error:", JSON.stringify(tokenData));
      return NextResponse.redirect(
        `${base}/auth/error?error=${encodeURIComponent(ghError)}`
      );
    }

    const accessToken = tokenData.access_token;

    // Fetch user profile
    const userRes = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/vnd.github.v3+json",
        "User-Agent": "VOID-Platform/1.0",
      },
    });

    if (!userRes.ok) {
      return NextResponse.redirect(`${base}/auth/error?error=user_fetch_failed`);
    }

    const githubUser = await userRes.json();

    // Get email
    let email: string | null = githubUser.email;
    
    if (!email) {
      const emailsRes = await fetch("https://api.github.com/user/emails", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/vnd.github.v3+json",
          "User-Agent": "VOID-Platform/1.0",
        },
      });
      
      if (emailsRes.ok) {
        const emails = await emailsRes.json();
        if (Array.isArray(emails)) {
          const primary = emails.find((e: any) => e.primary && e.verified);
          const anyVerified = emails.find((e: any) => e.verified);
          email = primary?.email ?? anyVerified?.email ?? emails[0]?.email ?? null;
        }
      }
    }

    if (!email) {
      return NextResponse.redirect(`${base}/auth/error?error=no_email`);
    }

    // Find or create user
    let dbUser = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true, username: true, name: true, image: true, role: true,
        reputation: { select: { score: true, level: true } },
      },
    });

    let isNewUser = false;

    if (!dbUser) {
      isNewUser = true;
      const baseUsername = (githubUser.login || email.split("@")[0])
        .toLowerCase().replace(/[^a-z0-9_]/g, "").slice(0, 20) || "user";

      let username = baseUsername;
      let counter = 1;
      while (await prisma.user.findUnique({ where: { username } })) {
        username = `${baseUsername}${counter++}`;
      }

      dbUser = await prisma.user.create({
        data: {
          email,
          name: githubUser.name || githubUser.login,
          image: githubUser.avatar_url,
          username,
          githubUrl: `https://github.com/${githubUser.login}`,
          reputation: { create: { score: 0, level: "NEWCOMER" } },
        },
        select: {
          id: true, username: true, name: true, image: true, role: true,
          reputation: { select: { score: true, level: true } },
        },
      });
    } else {
      await prisma.user.update({
        where: { id: dbUser.id },
        data: {
          image: githubUser.avatar_url ?? undefined,
          name: githubUser.name || githubUser.login || undefined,
        },
      });
    }

    // Create session JWT
    const token = await createSessionToken({
      id: dbUser.id,
      email,
      name: dbUser.name,
      image: dbUser.image ?? githubUser.avatar_url,
      username: dbUser.username,
      role: dbUser.role,
      reputation: dbUser.reputation,
    });

    // New users go to onboarding, returning users go to their intended destination
    const finalRedirect = isNewUser
      ? `${base}/welcome`
      : (callbackUrl.startsWith("http") ? callbackUrl : `${base}${callbackUrl}`);

    const response = NextResponse.redirect(finalRedirect);
    setSessionCookie(response, token);
    response.cookies.delete("void_oauth_state");
    response.cookies.delete("void_oauth_callback");

    return response;
  } catch (err: any) {
    console.error("OAuth callback error:", err?.message);
    return NextResponse.redirect(
      `${base}/auth/error?error=${encodeURIComponent(err?.message ?? "server_error")}`
    );
  }
}
