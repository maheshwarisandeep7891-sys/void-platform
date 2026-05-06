/**
 * VOID Twitter Bot
 * Posts to Twitter using OAuth 1.0a (no external library needed)
 * Uses the Twitter v2 API
 */

import crypto from "crypto";

const TWITTER_API_BASE = "https://api.twitter.com/2";

function percentEncode(str: string): string {
  return encodeURIComponent(str)
    .replace(/!/g, "%21")
    .replace(/'/g, "%27")
    .replace(/\(/g, "%28")
    .replace(/\)/g, "%29")
    .replace(/\*/g, "%2A");
}

function generateOAuthHeader(
  method: string,
  url: string,
  params: Record<string, string> = {}
): string {
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

  // Combine all params for signature
  const allParams = { ...params, ...oauthParams };
  const sortedParams = Object.keys(allParams)
    .sort()
    .map((k) => `${percentEncode(k)}=${percentEncode(allParams[k])}`)
    .join("&");

  const signatureBase = [
    method.toUpperCase(),
    percentEncode(url),
    percentEncode(sortedParams),
  ].join("&");

  const signingKey = `${percentEncode(consumerSecret)}&${percentEncode(accessSecret)}`;
  const signature = crypto
    .createHmac("sha1", signingKey)
    .update(signatureBase)
    .digest("base64");

  oauthParams.oauth_signature = signature;

  const headerValue =
    "OAuth " +
    Object.keys(oauthParams)
      .sort()
      .map((k) => `${percentEncode(k)}="${percentEncode(oauthParams[k])}"`)
      .join(", ");

  return headerValue;
}

export async function postTweet(text: string): Promise<{ id: string; text: string } | null> {
  const url = `${TWITTER_API_BASE}/tweets`;
  const body = JSON.stringify({ text });

  const authHeader = generateOAuthHeader("POST", url);

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: authHeader,
        "Content-Type": "application/json",
        "User-Agent": "VOIDPlatformBot/1.0",
      },
      body,
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("Twitter API error:", res.status, err);
      // Return error details for debugging
      return { error: `${res.status}: ${err}` } as any;
    }

    const data = await res.json();
    return data.data ?? null;
  } catch (error) {
    console.error("Tweet failed:", error);
    return null;
  }
}

export async function verifyCredentials(): Promise<boolean> {
  const url = "https://api.twitter.com/2/users/me";
  const authHeader = generateOAuthHeader("GET", url);

  try {
    const res = await fetch(url, {
      headers: {
        Authorization: authHeader,
        "User-Agent": "VOIDPlatformBot/1.0",
      },
    });
    return res.ok;
  } catch {
    return false;
  }
}
