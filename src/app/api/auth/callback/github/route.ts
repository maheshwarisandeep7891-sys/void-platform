/**
 * Step 2: GitHub OAuth callback
 * GET /api/auth/callback/github?code=...&state=...
 */
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  createSessionToken,
  setSessionCookie,
  GITHUB_TOKEN_URL,
  GITHUB_USER_URL,
  GITHUB_EMAILS_URL,
  getGitHubClientId,
  getGitHubClientSecret,
  getBaseUrl,
} from "@/lib/auth";

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

  try {
    // Exchange code for access token
    const tokenRes = await fetch(GITHUB_TOKEN_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code,
        redirect_uri: `${base}/api/auth/callback/github`,
      }),
    });

    const tokenData = await tokenRes.json();

    // Surface the exact GitHub error
    if (tokenData.error || !tokenData.access_token) {
      const ghError = tokenData.error_description ?? tokenData.error ?? "unknown";
      console.error("GitHub token error:", tokenData);
      return NextResponse.redirect(
        `${base}/auth/error?error=${encodeURIComponent(ghError)}`
      );
    }

    const accessToken = tokenData.access_token;

    // Fetch GitHub user profile and emails in parallel
    const [userRes, emailsRes] = await Promise.all([
      fetch(GITHUB_USER_URL, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/vnd.github.v3+json",
          "User-Agent": "VOID-Platform/1.0",
        },
      }),
      fetch(GITHUB_EMAILS_URL, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/vnd.github.v3+json",
          "User-Agent": "VOID-Platform/1.0",
        },
      }),
    ]);

    const githubUser = await userRes.json();
    const githubEmails = await emailsRes.json();

    // Get primary verified email
    let email: string | null = githubUser.email;
    if (!email && Array.isArray(githubEmails)) {
      const primary = githubEmails.find(
        (e: { primary: boolean; verified: boolean; email: string }) =>
          e.primary && e.verified
      );
      email = primary?.email ?? null;
    }
    if (!email && Array.isArray(githubEmails)) {
      const verified = githubEmails.find(
        (e: { verified: boolean; email: string }) => e.verified
      );
      email = verified?.email ?? null;
    }

    if (!email) {
      return NextResponse.redirect(`${base}/auth/error?error=no_email`);
    }

    // Find or create user in database
    let dbUser = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        username: true,
        name: true,
        image: true,
        role: true,
        reputation: { select: { score: true, level: true } },
      },
    });

    if (!dbUser) {
      const baseUsername = (githubUser.login || email.split("@")[0])
        .toLowerCase()
        .replace(/[^a-z0-9_]/g, "")
        .slice(0, 20) || "user";

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
          id: true,
          username: true,
          name: true,
          image: true,
          role: true,
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

    // Create JWT session token
    const token = await createSessionToken({
      id: dbUser.id,
      email,
      name: dbUser.name,
      image: dbUser.image ?? githubUser.avatar_url,
      username: dbUser.username,
      role: dbUser.role,
      reputation: dbUser.reputation,
    });

    const redirectUrl = callbackUrl.startsWith("http")
      ? callbackUrl
      : `${base}${callbackUrl}`;

    const response = NextResponse.redirect(redirectUrl);
    setSessionCookie(response, token);
    response.cookies.delete("void_oauth_state");
    response.cookies.delete("void_oauth_callback");

    return response;
  } catch (err: any) {
    console.error("OAuth callback error:", err);
    return NextResponse.redirect(
      `${base}/auth/error?error=${encodeURIComponent(err?.message ?? "callback_error")}`
    );
  }
}
