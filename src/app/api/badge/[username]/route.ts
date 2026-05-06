import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const LEVEL_COLORS: Record<string, string> = {
  NEWCOMER: "94a3b8",
  BUILDER: "34d399",
  HACKER: "38bdf8",
  ARCHITECT: "a78bfa",
  LEGEND: "f59e0b",
};

// GET /api/badge/[username] — returns an SVG badge for GitHub READMEs
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  const { username } = await params;

  try {
    const user = await prisma.user.findUnique({
      where: { username },
      select: {
        username: true,
        reputation: { select: { score: true, level: true } },
        _count: { select: { posts: true } },
      },
    });

    const level = user?.reputation?.level ?? "NEWCOMER";
    const score = user?.reputation?.score ?? 0;
    const color = LEVEL_COLORS[level] ?? "94a3b8";
    const label = "VOID";
    const message = `${level} · ${score} pts`;
    const labelWidth = 45;
    const messageWidth = message.length * 6.5 + 16;
    const totalWidth = labelWidth + messageWidth;

    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${totalWidth}" height="20" role="img" aria-label="${label}: ${message}">
  <title>${label}: ${message}</title>
  <linearGradient id="s" x2="0" y2="100%">
    <stop offset="0" stop-color="#bbb" stop-opacity=".1"/>
    <stop offset="1" stop-opacity=".1"/>
  </linearGradient>
  <clipPath id="r">
    <rect width="${totalWidth}" height="20" rx="3" fill="#fff"/>
  </clipPath>
  <g clip-path="url(#r)">
    <rect width="${labelWidth}" height="20" fill="#0a0a0f"/>
    <rect x="${labelWidth}" width="${messageWidth}" height="20" fill="#${color}"/>
    <rect width="${totalWidth}" height="20" fill="url(#s)"/>
  </g>
  <g fill="#fff" text-anchor="middle" font-family="DejaVu Sans,Verdana,Geneva,sans-serif" font-size="110">
    <text x="${(labelWidth / 2 + 1) * 10}" y="150" fill="#010101" fill-opacity=".3" transform="scale(.1)" textLength="${(labelWidth - 10) * 10}" lengthAdjust="spacing">${label}</text>
    <text x="${(labelWidth / 2) * 10}" y="140" transform="scale(.1)" textLength="${(labelWidth - 10) * 10}" lengthAdjust="spacing">${label}</text>
    <text x="${(labelWidth + messageWidth / 2 + 1) * 10}" y="150" fill="#010101" fill-opacity=".3" transform="scale(.1)" textLength="${(messageWidth - 10) * 10}" lengthAdjust="spacing">${message}</text>
    <text x="${(labelWidth + messageWidth / 2) * 10}" y="140" transform="scale(.1)" textLength="${(messageWidth - 10) * 10}" lengthAdjust="spacing">${message}</text>
  </g>
</svg>`;

    return new NextResponse(svg, {
      headers: {
        "Content-Type": "image/svg+xml",
        "Cache-Control": "public, max-age=3600",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch {
    return new NextResponse("Error", { status: 500 });
  }
}
