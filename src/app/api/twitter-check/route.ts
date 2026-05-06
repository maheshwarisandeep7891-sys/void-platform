import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

function percentEncode(str: string): string {
  return encodeURIComponent(str)
    .replace(/!/g, "%21").replace(/'/g, "%27")
    .replace(/\(/g, "%28").replace(/\)/g, "%29").replace(/\*/g, "%2A");
}

function generateOAuthHeader(method: string, url: string): string {
  const consumerKey = process.env.TWITTER_CONSUMER_KEY!;
  const consumerSecret = process.env.TWITTER_CONSUMER_SECRET!;
  const accessToken = process.env.TWITTER_ACCESS_TOKEN!;
  const accessSecret = process.env.TWITTER_ACCESS_SECRET!;

  const oauthParams: Record<string, string> = {
    oauth_consumer_key: consumerKey,
    oauth_nonce: crypto.randomBytes(16).toString("hex"),
    oauth_signature_method: "HMAC-SHA1",
    oauth_timestamp: Math.floor(Date.now() / 1000).toString(),
    oauth_token: accessToken,
    oauth_version: "1.0",
  };

  const sortedParams = Object.keys(oauthParams).sort()
    .map(k => `${percentEncode(k)}=${percentEncode(oauthParams[k])}`).join("&");

  const signatureBase = [method.toUpperCase(), percentEncode(url), percentEncode(sortedParams)].join("&");
  const signingKey = `${percentEncode(consumerSecret)}&${percentEncode(accessSecret)}`;
  const signature = crypto.createHmac("sha1", signingKey).update(signatureBase).digest("base64");
  oauthParams.oauth_signature = signature;

  return "OAuth " + Object.keys(oauthParams).sort()
    .map(k => `${percentEncode(k)}="${percentEncode(oauthParams[k])}"`)
    .join(", ");
}

export async function GET(req: NextRequest) {
  const url = "https://api.twitter.com/2/users/me?user.fields=username,name,profile_image_url,public_metrics";
  const authHeader = generateOAuthHeader("GET", "https://api.twitter.com/2/users/me");

  try {
    const res = await fetch(url, {
      headers: { Authorization: authHeader, "User-Agent": "VOIDPlatformBot/1.0" },
    });
    const data = await res.json();
    return NextResponse.json({ status: res.status, data, keys: { ck: process.env.TWITTER_CONSUMER_KEY?.slice(0,6), at: process.env.TWITTER_ACCESS_TOKEN?.slice(0,20) } });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
