import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// URLs to ping Google about
const URLS_TO_INDEX = [
  "https://void-platform.vercel.app",
  "https://void-platform.vercel.app/about/feed",
  "https://void-platform.vercel.app/about/marketplace",
  "https://void-platform.vercel.app/about/bounties",
  "https://void-platform.vercel.app/about/knowledge",
  "https://void-platform.vercel.app/about/dark",
  "https://void-platform.vercel.app/auth/signin",
];

// Ping multiple search engines to notify about new/updated content
export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const results: Record<string, string> = {};

  for (const url of URLS_TO_INDEX) {
    const encoded = encodeURIComponent(url);

    // Ping Google (public ping endpoint)
    try {
      const googleRes = await fetch(
        `https://www.google.com/ping?sitemap=${encodeURIComponent("https://void-platform.vercel.app/sitemap.xml")}`,
        { method: "GET" }
      );
      results["google_sitemap"] = `${googleRes.status}`;
    } catch {
      results["google_sitemap"] = "failed";
    }

    // Ping Bing (IndexNow protocol — free, instant indexing)
    try {
      const bingRes = await fetch(
        `https://www.bing.com/indexnow?url=${encoded}&key=void-platform-indexnow`,
        { method: "GET" }
      );
      results[`bing_${url.split("/").pop() || "home"}`] = `${bingRes.status}`;
    } catch {
      results[`bing_${url.split("/").pop() || "home"}`] = "failed";
    }
  }

  // IndexNow — notifies Bing, Yandex, and other search engines instantly
  try {
    const indexNowRes = await fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        host: "void-platform.vercel.app",
        key: "void-platform-indexnow-key",
        keyLocation: "https://void-platform.vercel.app/void-platform-indexnow-key.txt",
        urlList: URLS_TO_INDEX,
      }),
    });
    results["indexnow"] = `${indexNowRes.status}`;
  } catch {
    results["indexnow"] = "failed";
  }

  return NextResponse.json({
    success: true,
    timestamp: new Date().toISOString(),
    urlsSubmitted: URLS_TO_INDEX.length,
    results,
  });
}
