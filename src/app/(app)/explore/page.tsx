"use client";

import React, { useState, useEffect, Suspense } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Compass, TrendingUp, Users, Package, BookOpen,
  Zap, Code2, Search, ArrowRight, Terminal,
  CheckCircle2, MessageSquare,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn, formatDate, formatNumber, getInitials, REPUTATION_COLORS, formatCurrency } from "@/lib/utils";

const TRENDING_TAGS = [
  "rust", "go", "typescript", "kubernetes", "webassembly", "llm", "zig",
  "elixir", "htmx", "bun", "deno", "nix", "gleam", "cuda", "risc-v",
  "react", "nextjs", "python", "docker", "terraform",
];

interface ExploreData {
  trendingPosts: any[];
  topQuestions: any[];
  openBounties: any[];
  topUsers: any[];
  activeGuilds: any[];
  hotListings: any[];
}

export default function ExplorePage() {
  const [data, setData] = useState<ExploreData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [posts, questions, bounties, users, guilds, listings] = await Promise.all([
          fetch("/api/posts?page=1&filter=trending").then(r => r.json()),
          fetch("/api/knowledge/questions?sort=popular&page=1").then(r => r.json()),
          fetch("/api/bounties?status=OPEN&page=1").then(r => r.json()),
          fetch("/api/leaderboard?limit=5").then(r => r.json()),
          fetch("/api/guilds?page=1").then(r => r.json()),
          fetch("/api/marketplace/listings?page=1&sort=popular").then(r => r.json()),
        ]);

        setData({
          trendingPosts: posts.posts?.slice(0, 5) ?? [],
          topQuestions: questions.questions?.slice(0, 5) ?? [],
          openBounties: bounties.bounties?.slice(0, 4) ?? [],
          topUsers: users.users?.slice(0, 6) ?? [],
          activeGuilds: guilds.guilds?.slice(0, 6) ?? [],
          hotListings: listings.listings?.slice(0, 4) ?? [],
        });
      } catch {
        setData({ trendingPosts: [], topQuestions: [], openBounties: [], topUsers: [], activeGuilds: [], hotListings: [] });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="mb-8">
        <h1 className="text-2xl font-black font-mono text-void-text">Explore</h1>
        <p className="text-sm font-mono text-void-muted">Discover what the community is building</p>
      </div>

      {/* Trending tags */}
      <div className="mb-8">
        <h2 className="text-xs font-mono font-bold text-void-muted uppercase tracking-wider mb-3">Trending Tags</h2>
        <div className="flex flex-wrap gap-2">
          {TRENDING_TAGS.map((tag, i) => (
            <motion.div key={tag} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.02 }}>
              <Link href={`/feed?tag=${tag}`}>
                <span className="px-3 py-1 rounded-full bg-void-surface border border-void-border text-xs font-mono text-void-muted hover:text-void-purple hover:border-void-purple/30 transition-colors cursor-pointer">
                  #{tag}
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Trending Posts */}
          <Section title="Trending Posts" icon={TrendingUp} href="/feed" color="text-void-purple">
            {loading ? <Skeletons n={3} h="h-16" /> : data?.trendingPosts.length === 0 ? (
              <EmptyState icon={Terminal} text="No posts yet" action={{ href: "/post/new", label: "Create first post" }} />
            ) : data?.trendingPosts.map(post => (
              <Link key={post.id} href={`/post/${post.id}`}>
                <div className="flex items-start gap-3 p-3 rounded-xl hover:bg-void-surface transition-colors group">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-mono text-void-text group-hover:text-void-purple transition-colors truncate">
                      {post.title ?? post.content?.slice(0, 80)}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] font-mono text-void-muted">@{post.author?.username}</span>
                      <span className="text-[10px] font-mono text-void-muted">·</span>
                      <span className="text-[10px] font-mono text-void-muted">{post._count?.reactions ?? 0} reactions</span>
                    </div>
                  </div>
                  <Badge variant="secondary" className="text-[9px] flex-shrink-0">{post.type}</Badge>
                </div>
              </Link>
            ))}
          </Section>

          {/* Top Questions */}
          <Section title="Top Questions" icon={BookOpen} href="/knowledge" color="text-void-cyan">
            {loading ? <Skeletons n={3} h="h-14" /> : data?.topQuestions.length === 0 ? (
              <EmptyState icon={BookOpen} text="No questions yet" action={{ href: "/knowledge/ask", label: "Ask first question" }} />
            ) : data?.topQuestions.map(q => (
              <Link key={q.id} href={`/knowledge/${q.id}`}>
                <div className="flex items-start gap-3 p-3 rounded-xl hover:bg-void-surface transition-colors group">
                  <div className={cn(
                    "flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center border",
                    q.answers?.some((a: any) => a.isAccepted)
                      ? "bg-void-green/10 border-void-green/20 text-void-green"
                      : "bg-void-surface border-void-border text-void-muted"
                  )}>
                    {q.answers?.some((a: any) => a.isAccepted)
                      ? <CheckCircle2 className="w-3.5 h-3.5" />
                      : <MessageSquare className="w-3.5 h-3.5" />
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-mono text-void-text group-hover:text-void-cyan transition-colors line-clamp-1">{q.title}</p>
                    <p className="text-[10px] font-mono text-void-muted mt-0.5">{q._count?.answers ?? 0} answers · {q.views ?? 0} views</p>
                  </div>
                </div>
              </Link>
            ))}
          </Section>

          {/* Open Bounties */}
          <Section title="Open Bounties" icon={Zap} href="/bounties" color="text-void-yellow">
            {loading ? <Skeletons n={3} h="h-14" /> : data?.openBounties.length === 0 ? (
              <EmptyState icon={Zap} text="No open bounties" action={{ href: "/bounties/new", label: "Post a bounty" }} />
            ) : data?.openBounties.map(b => (
              <Link key={b.id} href={`/bounties/${b.id}`}>
                <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-void-surface transition-colors group">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-mono text-void-text group-hover:text-void-yellow transition-colors truncate">{b.title}</p>
                    <p className="text-[10px] font-mono text-void-muted mt-0.5">{b._count?.submissions ?? 0} submissions</p>
                  </div>
                  <span className="text-sm font-mono font-bold text-void-green flex-shrink-0">
                    ${b.reward}
                  </span>
                </div>
              </Link>
            ))}
          </Section>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {/* Top Builders */}
          <Section title="Top Builders" icon={Users} href="/leaderboard" color="text-void-purple">
            {loading ? <Skeletons n={4} h="h-10" /> : data?.topUsers.length === 0 ? (
              <EmptyState icon={Users} text="No users yet" />
            ) : data?.topUsers.map((user: any, i: number) => {
              const repLevel = user.reputation?.level ?? "NEWCOMER";
              const repColor = REPUTATION_COLORS[repLevel];
              return (
                <Link key={user.id} href={`/profile/${user.username}`}>
                  <div className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-void-surface transition-colors">
                    <span className="text-xs font-mono text-void-muted w-4 text-right">{i + 1}</span>
                    <Avatar className="w-7 h-7">
                      <AvatarImage src={user.image ?? ""} />
                      <AvatarFallback className="text-[9px]">{getInitials(user.name ?? user.username)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-mono text-void-text truncate">@{user.username}</p>
                    </div>
                    <span className="text-[9px] font-mono" style={{ color: repColor }}>{repLevel}</span>
                  </div>
                </Link>
              );
            })}
          </Section>

          {/* Active Guilds */}
          <Section title="Active Guilds" icon={Users} href="/guilds" color="text-void-cyan">
            {loading ? <Skeletons n={4} h="h-10" /> : data?.activeGuilds.length === 0 ? (
              <EmptyState icon={Users} text="No guilds yet" action={{ href: "/guilds/new", label: "Create a guild" }} />
            ) : data?.activeGuilds.map((guild: any) => (
              <Link key={guild.id} href={`/guilds/${guild.slug}`}>
                <div className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-void-surface transition-colors">
                  <div className="w-7 h-7 rounded-lg bg-void-purple/10 border border-void-purple/20 flex items-center justify-center flex-shrink-0">
                    <Users className="w-3.5 h-3.5 text-void-purple" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-mono text-void-text truncate">{guild.name}</p>
                    <p className="text-[9px] font-mono text-void-muted">{guild._count?.members ?? 0} members</p>
                  </div>
                </div>
              </Link>
            ))}
          </Section>

          {/* Hot Listings */}
          <Section title="Hot Listings" icon={Package} href="/marketplace" color="text-void-green">
            {loading ? <Skeletons n={3} h="h-12" /> : data?.hotListings.length === 0 ? (
              <EmptyState icon={Package} text="No listings yet" action={{ href: "/marketplace/new", label: "List something" }} />
            ) : data?.hotListings.map((listing: any) => (
              <Link key={listing.id} href={`/marketplace/${listing.id}`}>
                <div className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-void-surface transition-colors">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-mono text-void-text truncate">{listing.title}</p>
                    <p className="text-[9px] font-mono text-void-muted">{listing.category}</p>
                  </div>
                  {listing.price && (
                    <span className="text-xs font-mono text-void-green flex-shrink-0">${listing.price}</span>
                  )}
                </div>
              </Link>
            ))}
          </Section>
        </div>
      </div>
    </div>
  );
}

function Section({
  title, icon: Icon, href, color, children,
}: {
  title: string; icon: React.ElementType; href: string; color: string; children: React.ReactNode;
}) {
  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Icon className={cn("w-4 h-4", color)} />
          <h2 className="text-sm font-mono font-bold text-void-text">{title}</h2>
        </div>
        <Link href={href} className="text-[10px] font-mono text-void-muted hover:text-void-text transition-colors flex items-center gap-1">
          See all <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
      <div className="space-y-0.5">{children}</div>
    </Card>
  );
}

function Skeletons({ n, h }: { n: number; h: string }) {
  return (
    <>
      {Array.from({ length: n }).map((_, i) => (
        <div key={i} className={cn("rounded-lg bg-void-surface animate-pulse", h)} />
      ))}
    </>
  );
}

function EmptyState({ icon: Icon, text, action }: { icon: React.ElementType; text: string; action?: { href: string; label: string } }) {
  return (
    <div className="text-center py-6">
      <Icon className="w-8 h-8 text-void-muted mx-auto mb-2" />
      <p className="text-xs font-mono text-void-muted">{text}</p>
      {action && (
        <Link href={action.href} className="text-xs font-mono text-void-purple hover:underline mt-1 inline-block">
          {action.label} →
        </Link>
      )}
    </div>
  );
}
