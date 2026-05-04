import { NextRequest, NextResponse } from "next/server";
import { clearSessionCookie, getBaseUrl } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const callbackUrl = req.nextUrl.searchParams.get("callbackUrl") ?? "/";
  const response = NextResponse.redirect(`${getBaseUrl()}${callbackUrl}`);
  clearSessionCookie(response);
  return response;
}

export async function POST(req: NextRequest) {
  const response = NextResponse.redirect(`${getBaseUrl()}/`);
  clearSessionCookie(response);
  return response;
}
