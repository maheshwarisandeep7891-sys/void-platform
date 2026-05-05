"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft, Users, Globe, Lock, UserPlus, UserMinus,
  Crown, Shield, Settings, Calendar,
} from "lucide-react";
import { useSession } from "@/hooks/use-session";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn, formatDate, formatNumber, getInitials, REPUTATION_COLORS } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface GuildMember {
  userId: string;
  role: string;
  joinedAt: string;
  user: {
    id: string;
    username: string;
    name?: string;
    image?: string;
    reputation?: { score: number; level: string };
  };
}

interface Guild {
  id: string;
  name: string;
  slug: string;
  description?: string;
  avatar?: string;
  banner?: string;
  visibility: string;
  techStack: string[];
  createdAt: string;
  members: GuildMember[];
  _count: { members: number };
  isMember: boolean;
}

export default function GuildDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const { toast } = useToast();
  const [guild, setGuild] = useState<Guild | null>(null);
  const [loading, setLoading] = useState(true);
  const [joinLoading, setJoinLoading] = useState(false);

  const slug = params.slug as string;

  useEffect(() => {
    const fetchGuild = async () => {
      try {
        const res = await fetch(`/api/guilds/${slug}`);
        if (!res.ok) throw new Error("Not found");
        const data = await res.json();
        setGuild(data);
      } catch {
        setGuild(null);
      } finally {
        setLoading(false);
      }
    };
    fetchGuild();
  }, [slug]);

  const handleJoin = async () => {
    if (!session) {
      toast({ title: "Sign in to join guilds", variant: "destructive" });
      return;
    }
    setJoinLoading(true);
    try {
      const res = await fetch(`/api/guilds/${slug}/join`, { method: "POST" });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? "Failed");
      }
      const data = await res.json();
      setGuild(prev => prev ? {
        ...prev,
        isMember: data.joined,
        _count: {
          members: data.joined ? prev._count.members + 1 : prev._count.members - 1,
        },
      } : prev);
      toast({ title: data.joined ? `Joined ${guild?.name}!` : `Left ${guild?.name}` });
    } catch (err: any) {
      toast({ title: err.message ?? "Failed to update membership", variant: "destructive" });
    } finally {
      setJoinLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-6 space-y-4">
        <div className="h-8 w-32 bg-void-surface rounded animate-pulse" />
        <div className="h-48 bg-void-surface rounded-xl animate-pulse" />
      </div>
    );
  }

  if (!guild) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <p className="text-void-muted font-mono">Guild not found.</p>
        <Button onClick={() => router.push("/guilds")} variant="outline" className="font-mono mt-4 gap-1.5">
          <ArrowLeft className="w-4 h-4" />
          Back to Guilds
        </Button>
      </div>
    );
  }

  const admins = guild.members.filter(m => m.role === "ADMIN");
  const regularMembers = guild.members.filter(m => m.role !== "ADMIN");
  const currentMember = guild.members.find(m => m.userId === session?.user?.id);
  const isAdmin = currentMember?.role === "ADMIN";

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-1.5 text-sm font-mono text-void-muted hover:text-void-text transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Guilds
      </button>

      {/* Banner */}
      <div
        className="h-40 rounded-xl overflow-hidden mb-0 relative"
        style={{
          background: guild.banner
            ? `url(${guild.banner}) center/cover`
            : `linear-gradient(135deg, #1a0a2e 0%, #0a0a1f 50%, #0a1a2e 100%)`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-void-bg/80" />
        <div className="absolute inset-0 grid-bg opacity-20" />
      </div>

      {/* Header */}
      <div className="relative px-2 pb-4">
        <div className="flex items-end justify-between -mt-10 mb-4">
          <div className="flex items-center gap-4">
            {guild.avatar ? (
              <img
                src={guild.avatar}
                alt={guild.name}
                className="w-20 h-20 rounded-2xl border-4 border-void-bg object-cover"
              />
            ) : (
              <div className="w-20 h-20 rounded-2xl border-4 border-void-bg bg-void-purple/10 border-void-purple/20 flex items-center justify-center">
                <Users className="w-8 h-8 text-void-purple" />
              </div>
            )}
          </div>
          <div className="flex items-center gap-2 pb-1">
            {isAdmin && (
              <Button variant="outline" size="sm" className="font-mono gap-1.5">
                <Settings className="w-3.5 h-3.5" />
                Manage
              </Button>
            )}
            {guild.visibility !== "INVITE_ONLY" && (
              <Button
                size="sm"
                variant={guild.isMember ? "outline" : "default"}
                onClick={handleJoin}
                loading={joinLoading}
                className="font-mono gap-1.5"
              >
                {guild.isMember ? (
                  <>
                    <UserMinus className="w-3.5 h-3.5" />
                    Leave
                  </>
                ) : (
                  <>
                    <UserPlus className="w-3.5 h-3.5" />
                    Join Guild
                  </>
                )}
              </Button>
            )}
          </div>
        </div>

        <div className="mb-3">
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-black text-void-text">{guild.name}</h1>
            {guild.visibility === "PRIVATE" ? (
              <Lock className="w-4 h-4 text-void-muted" />
            ) : (
              <Globe className="w-4 h-4 text-void-muted" />
            )}
          </div>
          <div className="flex items-center gap-3 text-xs font-mono text-void-muted">
            <span className="flex items-center gap-1">
              <Users className="w-3 h-3" />
              {formatNumber(guild._count.members)} members
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              Founded {formatDate(guild.createdAt)}
            </span>
          </div>
        </div>

        {guild.description && (
          <p className="text-void-muted text-sm leading-relaxed mb-4 max-w-2xl">
            {guild.description}
          </p>
        )}

        {guild.techStack.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {guild.techStack.map(tech => (
              <span
                key={tech}
                className="px-2 py-0.5 rounded-md bg-void-surface border border-void-border text-xs font-mono text-void-muted"
              >
                {tech}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Members */}
      <div className="space-y-6">
        {admins.length > 0 && (
          <div>
            <h2 className="text-sm font-mono font-bold text-void-muted uppercase tracking-wider mb-3">
              Admins
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {admins.map(member => (
                <MemberCard key={member.userId} member={member} />
              ))}
            </div>
          </div>
        )}

        {regularMembers.length > 0 && (
          <div>
            <h2 className="text-sm font-mono font-bold text-void-muted uppercase tracking-wider mb-3">
              Members ({regularMembers.length})
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {regularMembers.map(member => (
                <MemberCard key={member.userId} member={member} />
              ))}
            </div>
          </div>
        )}

        {guild.members.length === 0 && (
          <div className="text-center py-12 rounded-xl border border-void-border bg-void-surface/30">
            <Users className="w-10 h-10 text-void-muted mx-auto mb-3" />
            <p className="text-void-muted font-mono text-sm">No members yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function MemberCard({ member }: { member: GuildMember }) {
  const repLevel = member.user.reputation?.level ?? "NEWCOMER";
  const repColor = REPUTATION_COLORS[repLevel];

  return (
    <Link href={`/profile/${member.user.username}`}>
      <Card className="p-4 flex items-center gap-3 hover:border-void-purple/30 transition-all group">
        <Avatar className="w-10 h-10">
          <AvatarImage src={member.user.image ?? ""} />
          <AvatarFallback className="text-sm">
            {getInitials(member.user.name ?? member.user.username)}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-mono font-bold text-void-text group-hover:text-void-purple transition-colors truncate">
              @{member.user.username}
            </span>
            {member.role === "ADMIN" && (
              <Crown className="w-3 h-3 text-yellow-500 flex-shrink-0" />
            )}
          </div>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span
              className="text-[9px] font-mono px-1.5 py-0.5 rounded border"
              style={{ color: repColor, borderColor: `${repColor}25`, backgroundColor: `${repColor}10` }}
            >
              {repLevel}
            </span>
            <span className="text-[10px] font-mono text-void-muted">
              Joined {formatDate(member.joinedAt)}
            </span>
          </div>
        </div>
      </Card>
    </Link>
  );
}
