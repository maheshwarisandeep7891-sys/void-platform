import { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = "https://void-platform.vercel.app";

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: base, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${base}/feed`, lastModified: new Date(), changeFrequency: "hourly", priority: 0.9 },
    { url: `${base}/marketplace`, lastModified: new Date(), changeFrequency: "hourly", priority: 0.9 },
    { url: `${base}/knowledge`, lastModified: new Date(), changeFrequency: "hourly", priority: 0.9 },
    { url: `${base}/bounties`, lastModified: new Date(), changeFrequency: "hourly", priority: 0.9 },
    { url: `${base}/guilds`, lastModified: new Date(), changeFrequency: "daily", priority: 0.8 },
    { url: `${base}/leaderboard`, lastModified: new Date(), changeFrequency: "daily", priority: 0.7 },
    { url: `${base}/explore`, lastModified: new Date(), changeFrequency: "hourly", priority: 0.8 },
    { url: `${base}/dark`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    // SEO landing pages — pure server-rendered, no JS required
    { url: `${base}/about/feed`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/about/marketplace`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/about/bounties`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/about/knowledge`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/about/dark`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
  ];

  try {
    // Dynamic posts
    const posts = await prisma.post.findMany({
      where: { publishedAt: { not: null }, isDarkMode: false },
      select: { id: true, updatedAt: true },
      orderBy: { createdAt: "desc" },
      take: 5000,
    });

    const postPages: MetadataRoute.Sitemap = posts.map(post => ({
      url: `${base}/post/${post.id}`,
      lastModified: post.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));

    // Dynamic profiles
    const users = await prisma.user.findMany({
      where: { isBot: false },
      select: { username: true, updatedAt: true },
      take: 1000,
    });

    const profilePages: MetadataRoute.Sitemap = users.map(user => ({
      url: `${base}/profile/${user.username}`,
      lastModified: user.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    }));

    // Knowledge questions
    const questions = await prisma.question.findMany({
      select: { id: true, updatedAt: true },
      take: 2000,
    });

    const questionPages: MetadataRoute.Sitemap = questions.map(q => ({
      url: `${base}/knowledge/${q.id}`,
      lastModified: q.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));

    // Bounties
    const bounties = await prisma.bounty.findMany({
      where: { status: "OPEN" },
      select: { id: true, updatedAt: true },
      take: 1000,
    });

    const bountyPages: MetadataRoute.Sitemap = bounties.map(b => ({
      url: `${base}/bounties/${b.id}`,
      lastModified: b.updatedAt,
      changeFrequency: "daily" as const,
      priority: 0.8,
    }));

    // Marketplace listings
    const listings = await prisma.listing.findMany({
      where: { status: "ACTIVE" },
      select: { id: true, updatedAt: true },
      take: 1000,
    });

    const listingPages: MetadataRoute.Sitemap = listings.map(l => ({
      url: `${base}/marketplace/${l.id}`,
      lastModified: l.updatedAt,
      changeFrequency: "daily" as const,
      priority: 0.8,
    }));

    return [
      ...staticPages,
      ...postPages,
      ...profilePages,
      ...questionPages,
      ...bountyPages,
      ...listingPages,
    ];
  } catch {
    return staticPages;
  }
}
