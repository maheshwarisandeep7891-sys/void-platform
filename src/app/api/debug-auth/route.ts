import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    AUTH_GITHUB_ID: process.env.AUTH_GITHUB_ID ? `${process.env.AUTH_GITHUB_ID.slice(0, 5)}...` : "MISSING",
    AUTH_GITHUB_SECRET: process.env.AUTH_GITHUB_SECRET ? `${process.env.AUTH_GITHUB_SECRET.slice(0, 5)}...` : "MISSING",
    GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID ? `${process.env.GITHUB_CLIENT_ID.slice(0, 5)}...` : "MISSING",
    AUTH_SECRET: process.env.AUTH_SECRET ? "SET" : "MISSING",
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? "SET" : "MISSING",
    AUTH_URL: process.env.AUTH_URL ?? "MISSING",
    NEXTAUTH_URL: process.env.NEXTAUTH_URL ?? "MISSING",
    NODE_ENV: process.env.NODE_ENV,
  });
}
