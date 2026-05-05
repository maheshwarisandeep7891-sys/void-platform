import { NextRequest, NextResponse } from "next/server";

// Simple OG image generator — returns SVG as PNG-compatible image
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const title = searchParams.get("title") ?? "VOID Platform";
  const subtitle = searchParams.get("subtitle") ?? "Build. Share. Sell.";

  const svg = `
<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#0a0a0f"/>
      <stop offset="100%" style="stop-color:#0d0d1a"/>
    </linearGradient>
    <linearGradient id="purple" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:#a78bfa"/>
      <stop offset="100%" style="stop-color:#7c3aed"/>
    </linearGradient>
  </defs>
  
  <!-- Background -->
  <rect width="1200" height="630" fill="url(#bg)"/>
  
  <!-- Grid pattern -->
  <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#a78bfa" stroke-width="0.3" opacity="0.15"/>
  </pattern>
  <rect width="1200" height="630" fill="url(#grid)"/>
  
  <!-- Glow orb -->
  <circle cx="600" cy="315" r="300" fill="#a78bfa" opacity="0.04"/>
  
  <!-- Logo box -->
  <rect x="80" y="80" width="56" height="56" rx="14" fill="#a78bfa"/>
  <text x="108" y="118" font-family="monospace" font-size="28" font-weight="900" fill="#0a0a0f" text-anchor="middle">V</text>
  
  <!-- VOID wordmark -->
  <text x="152" y="122" font-family="monospace" font-size="36" font-weight="900" fill="#e2e8f0" letter-spacing="-2">VOID</text>
  
  <!-- Title -->
  <text x="80" y="320" font-family="monospace" font-size="52" font-weight="900" fill="#e2e8f0" letter-spacing="-2">${title.slice(0, 40)}</text>
  
  <!-- Subtitle -->
  <text x="80" y="390" font-family="monospace" font-size="24" fill="#64748b">${subtitle.slice(0, 60)}</text>
  
  <!-- Bottom bar -->
  <rect x="80" y="520" width="120" height="3" rx="2" fill="url(#purple)"/>
  <text x="80" y="570" font-family="monospace" font-size="16" fill="#64748b">void-platform.vercel.app</text>
  
  <!-- Feature pills -->
  <rect x="80" y="440" width="120" height="28" rx="14" fill="#a78bfa" opacity="0.15" stroke="#a78bfa" stroke-width="1" stroke-opacity="0.3"/>
  <text x="140" y="459" font-family="monospace" font-size="12" fill="#a78bfa" text-anchor="middle">Social</text>
  
  <rect x="216" y="440" width="140" height="28" rx="14" fill="#38bdf8" opacity="0.1" stroke="#38bdf8" stroke-width="1" stroke-opacity="0.3"/>
  <text x="286" y="459" font-family="monospace" font-size="12" fill="#38bdf8" text-anchor="middle">Marketplace</text>
  
  <rect x="372" y="440" width="150" height="28" rx="14" fill="#34d399" opacity="0.1" stroke="#34d399" stroke-width="1" stroke-opacity="0.3"/>
  <text x="447" y="459" font-family="monospace" font-size="12" fill="#34d399" text-anchor="middle">Knowledge</text>
  
  <rect x="538" y="440" width="100" height="28" rx="14" fill="#f59e0b" opacity="0.1" stroke="#f59e0b" stroke-width="1" stroke-opacity="0.3"/>
  <text x="588" y="459" font-family="monospace" font-size="12" fill="#f59e0b" text-anchor="middle">Bounties</text>
</svg>`;

  return new NextResponse(svg, {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=86400",
    },
  });
}
