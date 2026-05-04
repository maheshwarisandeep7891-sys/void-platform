/**
 * VOID Auth — Custom JWT authentication
 * No NextAuth. Direct GitHub OAuth + encrypted session cookies.
 */
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export const SESSION_COOKIE = "void_session";
const SECRET = process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET ?? "void-dev-secret-32chars-minimum!!";
const KEY = new TextEncoder().encode(SECRET);

export interface SessionUser {
  id: string;
  email: string;
  name?: string | null;
  image?: string | null;
  username: string;
  role: string;
  reputation?: { score: number; level: string } | null;
}

export interface Session {
  user: SessionUser;
  expires: string;
}

/** Create a signed JWT session token */
export async function createSessionToken(user: SessionUser): Promise<string> {
  return new SignJWT({ user })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(KEY);
}

/** Verify and decode a session token */
export async function verifySessionToken(token: string): Promise<Session | null> {
  try {
    const { payload } = await jwtVerify(token, KEY);
    const user = payload.user as SessionUser;
    if (!user?.id) return null;
    return {
      user,
      expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    };
  } catch {
    return null;
  }
}

/** Get session from request cookies (server-side) */
export async function getSession(req?: NextRequest): Promise<Session | null> {
  let token: string | undefined;

  if (req) {
    token = req.cookies.get(SESSION_COOKIE)?.value;
  } else {
    const cookieStore = await cookies();
    token = cookieStore.get(SESSION_COOKIE)?.value;
  }

  if (!token) return null;
  return verifySessionToken(token);
}

/** Set session cookie on a response */
export function setSessionCookie(response: NextResponse, token: string): void {
  response.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 30 * 24 * 60 * 60, // 30 days
    path: "/",
  });
}

/** Clear session cookie */
export function clearSessionCookie(response: NextResponse): void {
  response.cookies.delete(SESSION_COOKIE);
}

/** GitHub OAuth URLs */
export const GITHUB_AUTH_URL = "https://github.com/login/oauth/authorize";
export const GITHUB_TOKEN_URL = "https://github.com/login/oauth/access_token";
export const GITHUB_USER_URL = "https://api.github.com/user";
export const GITHUB_EMAILS_URL = "https://api.github.com/user/emails";

export function getGitHubClientId(): string {
  return process.env.AUTH_GITHUB_ID ?? process.env.GITHUB_CLIENT_ID ?? "";
}

export function getGitHubClientSecret(): string {
  return process.env.AUTH_GITHUB_SECRET ?? process.env.GITHUB_CLIENT_SECRET ?? "";
}

export function getBaseUrl(): string {
  return process.env.NEXTAUTH_URL ?? "https://void-platform.vercel.app";
}
