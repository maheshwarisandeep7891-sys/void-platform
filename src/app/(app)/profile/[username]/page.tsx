"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  GitBranch,
  Globe,
  MapPin,
  Calendar,
  Star,
  Users,
  Package,
  BookOpen,
  Zap,
  Edit,
  ExternalLink,
  Trophy,
  Download,
  UserPlus,
  UserMinus,
  MessageSquare,
} from "lucide-react";
import { useSession } from "@/hooks/use-session";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import {
  cn,
  formatDate,
  formatNumber,
  getInitials,
  REPUTATION_COLORS,
  getProgressToNextLevel,
} from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface UserProfile {
  id: string;
  username: string;
  name?: string;
  image?: string;
  bannerImage?: string;
  bio?: string;
  GitBranchUrl?: string;
  websiteUrl?: string;
  GlobeUrl?: string;
  techStack: string[];
  openToHire: boolean;
  openToCollaborate: boolean;
  openToMentor: boolean;
  openToTrade: boolean;
  createdAt: string;
  reputation?: { score: number; level: string };
  _count: {
    posts: number;
    followers: number;
    following: number;
    listings: number;
  };
  isFollowing: boolean;
}

export default function ProfilePage() {
  const params = useParams();
  const username = params.username as string;
  const { data: session } = useSession();
  const { toast } = useToast();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [following, setFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);

  const isOwnProfile = session?.user?.username === username;

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`/api/users/${username}`);
        if (!res.ok) throw new Error("Not found");
        const data = await res.json();
        setProfile(data);
        setFollowing(data.isFollowing);
      } catch {
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [username]);

  const handleFollow = async () => {
    if (!session) {
      toast({ title: "Sign in to follow users", variant: "destructive" });
      return;
    }
    setFollowLoading(true);
    try {
      const res = await fetch(`/api/users/${username}/follow`, {
        method: "POST",
      });
      const data = await res.json();
      setFollowing(data.following);
      toast({
        title: data.following ? `Following @${username}` : `Unfollowed @${username}`,
      });
    } catch {
      toast({ title: "Failed to update follow", variant: "destructive" });
    } finally {
      setFollowLoading(false);
    }
  };

  const handleExportReputation = async () => {
    try {
      const res = await fetch(`/api/users/${username}/reputation/export`);
      const data = await res.json();
      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `void-reputation-${username}.json`;
      a.click();
    } catch {
      toast({ title: "Failed to export reputation", variant: "destructive" });
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="h-48 bg-void-surface rounded-xl animate-pulse mb-4" />
        <div className="flex gap-4">
          <div className="w-24 h-24 rounded-full bg-void-surface animate-pulse" />
          <div className="flex-1 space-y-3 pt-4">
            <div className="w-48 h-6 bg-void-surface rounded animate-pulse" />
            <div className="w-32 h-4 bg-void-surface rounded animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <p className="text-void-muted font-mono text-lg">User not found.</p>
        <Link href="/feed" className="mt-4 inline-block">
          <Button variant="outline" className="font-mono mt-4">
            Back to feed
          </Button>
        </Link>
      </div>
    );
  }

  const repLevel = profile.reputation?.level ?? "NEWCOMER";
  const repScore = profile.reputation?.score ?? 0;
  const repColor = REPUTATION_COLORS[repLevel];

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* Banner */}
      <div
        className="h-48 rounded-xl overflow-hidden mb-0 relative"
        style={{
          background: profile.bannerImage
            ? `url(${profile.bannerImage}) center/cover`
            : `linear-gradient(135deg, #1a0a2e 0%, #0a0a1f 50%, #0a1a2e 100%)`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-void-bg/80" />
        {/* Grid overlay */}
        <div className="absolute inset-0 grid-bg opacity-30" />
      </div>

      {/* Profile header */}
      <div className="relative px-4 pb-4">
        <div className="flex items-end justify-between -mt-12 mb-4">
          <div className="relative">
            <Avatar className="w-24 h-24 border-4 border-void-bg">
              <AvatarImage src={profile.image ?? ""} />
              <AvatarFallback className="text-2xl">
                {getInitials(profile.name ?? profile.username)}
              </AvatarFallback>
            </Avatar>
            {/* Reputation badge */}
            <div
              className="absolute -bottom-1 -right-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold border"
              style={{
                color: repColor,
                borderColor: `${repColor}40`,
                backgroundColor: `${repColor}15`,
              }}
            >
              {repLevel}
            </div>
          </div>

          <div className="flex items-center gap-2 pb-1">
            {isOwnProfile ? (
              <>
                <Link href="/settings">
                  <Button variant="outline" size="sm" className="font-mono gap-1.5">
                    <Edit className="w-3.5 h-3.5" />
                    Edit Profile
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleExportReputation}
                  className="font-mono gap-1.5"
                  title="Export reputation credential"
                >
                  <Download className="w-3.5 h-3.5" />
                </Button>
              </>
            ) : (
              <>
                <Link href={`/messages/${username}`}>
                  <Button variant="outline" size="sm" className="font-mono gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5" />
                    Message
                  </Button>
                </Link>
                <Button
                  size="sm"
                  onClick={handleFollow}
                  loading={followLoading}
                  variant={following ? "outline" : "default"}
                  className="font-mono gap-1.5"
                >
                  {following ? (
                    <>
                      <UserMinus className="w-3.5 h-3.5" />
                      Unfollow
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-3.5 h-3.5" />
                      Follow
                    </>
                  )}
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Name + username */}
        <div className="mb-3">
          <h1 className="text-2xl font-black text-void-text">
            {profile.name ?? profile.username}
          </h1>
          <p className="text-void-muted font-mono text-sm">@{profile.username}</p>
        </div>

        {/* Bio */}
        {profile.bio && (
          <p className="text-void-muted text-sm leading-relaxed mb-4 max-w-xl">
            {profile.bio}
          </p>
        )}

        {/* Links */}
        <div className="flex flex-wrap items-center gap-4 mb-4">
          {profile.GitBranchUrl && (
            <a
              href={profile.GitBranchUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs font-mono text-void-muted hover:text-void-text transition-colors"
            >
              <GitBranch className="w-3.5 h-3.5" />
              GitBranch
            </a>
          )}
          {profile.websiteUrl && (
            <a
              href={profile.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs font-mono text-void-muted hover:text-void-text transition-colors"
            >
              <Globe className="w-3.5 h-3.5" />
              Website
            </a>
          )}
          {profile.GlobeUrl && (
            <a
              href={profile.GlobeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs font-mono text-void-muted hover:text-void-text transition-colors"
            >
              <Globe className="w-3.5 h-3.5" />
              Globe
            </a>
          )}
          <span className="flex items-center gap-1.5 text-xs font-mono text-void-muted">
            <Calendar className="w-3.5 h-3.5" />
            Joined {formatDate(profile.createdAt)}
          </span>
        </div>

        {/* Open to badges */}
        <div className="flex flex-wrap gap-2 mb-4">
          {profile.openToHire && (
            <Badge variant="green" className="text-xs">
              Open to hire
            </Badge>
          )}
          {profile.openToCollaborate && (
            <Badge variant="cyan" className="text-xs">
              Open to collaborate
            </Badge>
          )}
          {profile.openToMentor && (
            <Badge variant="default" className="text-xs">
              Open to mentor
            </Badge>
          )}
          {profile.openToTrade && (
            <Badge variant="yellow" className="text-xs">
              Open to trade
            </Badge>
          )}
        </div>

        {/* Tech stack */}
        {profile.techStack.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {profile.techStack.map((tech) => (
              <span
                key={tech}
                className="px-2 py-0.5 rounded-md bg-void-surface border border-void-border text-xs font-mono text-void-muted"
              >
                {tech}
              </span>
            ))}
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {[
            { label: "Posts", value: profile._count.posts, icon: BookOpen },
            { label: "Followers", value: profile._count.followers, icon: Users },
            { label: "Following", value: profile._count.following, icon: Users },
            { label: "Listings", value: profile._count.listings, icon: Package },
          ].map(({ label, value, icon: Icon }) => (
            <div key={label} className="text-center p-3 rounded-lg bg-void-surface border border-void-border">
              <div className="text-xl font-black font-mono text-void-text tabular-nums">
                {formatNumber(value)}
              </div>
              <div className="text-xs font-mono text-void-muted mt-0.5">{label}</div>
            </div>
          ))}
        </div>

        {/* Reputation bar */}
        <div className="p-4 rounded-xl bg-void-surface border border-void-border mb-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Trophy className="w-4 h-4" style={{ color: repColor }} />
              <span className="text-sm font-mono font-bold" style={{ color: repColor }}>
                {repLevel}
              </span>
            </div>
            <span className="text-sm font-mono text-void-text tabular-nums">
              {formatNumber(repScore)} pts
            </span>
          </div>
          <div className="w-full h-1.5 bg-void-border rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${getProgressToNextLevel(repScore, repLevel as any)}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="h-full rounded-full"
              style={{ backgroundColor: repColor }}
            />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="posts" className="px-4">
        <TabsList className="mb-6">
          <TabsTrigger value="posts" className="font-mono text-xs">
            Posts
          </TabsTrigger>
          <TabsTrigger value="listings" className="font-mono text-xs">
            Listings
          </TabsTrigger>
          <TabsTrigger value="knowledge" className="font-mono text-xs">
            Knowledge
          </TabsTrigger>
          <TabsTrigger value="activity" className="font-mono text-xs">
            Activity
          </TabsTrigger>
        </TabsList>

        <TabsContent value="posts">
          <UserPosts username={username} />
        </TabsContent>
        <TabsContent value="listings">
          <UserListings username={username} />
        </TabsContent>
        <TabsContent value="knowledge">
          <UserKnowledge username={username} />
        </TabsContent>
        <TabsContent value="activity">
          <div className="text-center py-12 text-void-muted font-mono text-sm">
            Activity feed coming soon
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function UserPosts({ username }: { username: string }) {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/posts?author=${username}&page=1`)
      .then((r) => r.json())
      .then((d) => setPosts(d.posts ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [username]);

  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-24 bg-void-surface rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-12 text-void-muted font-mono text-sm">
        No posts yet.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {posts.map((post) => (
        <Link key={post.id} href={`/post/${post.id}`}>
          <Card hover className="p-4">
            <div className="flex items-start justify-between">
              <div>
                {post.title && (
                  <h3 className="text-sm font-bold text-void-text mb-1">
                    {post.title}
                  </h3>
                )}
                <p className="text-xs text-void-muted line-clamp-2">
                  {post.content.replace(/[#*`]/g, "").slice(0, 150)}
                </p>
              </div>
              <span className="text-[10px] font-mono text-void-muted ml-4 flex-shrink-0">
                {formatDate(post.createdAt)}
              </span>
            </div>
          </Card>
        </Link>
      ))}
    </div>
  );
}

function UserListings({ username }: { username: string }) {
  return (
    <div className="text-center py-12 text-void-muted font-mono text-sm">
      Listings will appear here.
    </div>
  );
}

function UserKnowledge({ username }: { username: string }) {
  return (
    <div className="text-center py-12 text-void-muted font-mono text-sm">
      Questions and answers will appear here.
    </div>
  );
}
