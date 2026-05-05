"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft, Rocket, Users, Clock, Timer, ExternalLink,
  GitBranch, UserPlus, UserMinus, Crown, Calendar,
  CheckCircle2, Play, Square,
} from "lucide-react";
import { useSession } from "@/hooks/use-session";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn, formatDate, formatNumber, getInitials, REPUTATION_COLORS } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface HackathonMember {
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

interface HackathonRoom {
  id: string;
  name: string;
  description?: string;
  startAt: string;
  endAt: string;
  isActive: boolean;
  repoUrl?: string;
  shipUrl?: string;
  createdAt: string;
  members: HackathonMember[];
  _count: { members: number };
  isMember: boolean;
}

function useCountdown(endAt: string) {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const update = () => {
      const diff = new Date(endAt).getTime() - Date.now();
      if (diff <= 0) { setTimeLeft("Ended"); return; }
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setTimeLeft(`${h}h ${m}m ${s}s`);
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [endAt]);

  return timeLeft;
}

export default function HackathonDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const { toast } = useToast();
  const [room, setRoom] = useState<HackathonRoom | null>(null);
  const [loading, setLoading] = useState(true);
  const [joinLoading, setJoinLoading] = useState(false);

  const roomId = params.id as string;
  const countdown = useCountdown(room?.endAt ?? new Date().toISOString());

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const res = await fetch(`/api/hackathons/${roomId}`);
        if (!res.ok) throw new Error("Not found");
        const data = await res.json();
        setRoom(data);
      } catch {
        setRoom(null);
      } finally {
        setLoading(false);
      }
    };
    fetchRoom();
  }, [roomId]);

  const handleJoin = async () => {
    if (!session) {
      toast({ title: "Sign in to join", variant: "destructive" });
      return;
    }
    setJoinLoading(true);
    try {
      const res = await fetch(`/api/hackathons/${roomId}/join`, { method: "POST" });
      if (!res.ok) throw new Error("Failed");
      const data = await res.json();
      setRoom(prev => prev ? {
        ...prev,
        isMember: data.joined,
        _count: { members: data.joined ? prev._count.members + 1 : prev._count.members - 1 },
      } : prev);
      toast({ title: data.joined ? "Joined hackathon!" : "Left hackathon" });
    } catch {
      toast({ title: "Failed to update membership", variant: "destructive" });
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

  if (!room) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <p className="text-void-muted font-mono">Hackathon room not found.</p>
        <Button onClick={() => router.push("/hackathons")} variant="outline" className="font-mono mt-4 gap-1.5">
          <ArrowLeft className="w-4 h-4" /> Back to Hackathons
        </Button>
      </div>
    );
  }

  const now = new Date();
  const start = new Date(room.startAt);
  const end = new Date(room.endAt);
  const isLive = now >= start && now <= end;
  const isUpcoming = now < start;
  const isEnded = now > end;
  const currentMember = room.members.find(m => m.userId === session?.user?.id);
  const isLead = currentMember?.role === "LEAD";

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-1.5 text-sm font-mono text-void-muted hover:text-void-text transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" /> Hackathons
      </button>

      {/* Header card */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <Card className={cn("p-6 mb-6", isLive && "border-void-green/30 bg-void-green/5")}>
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center",
                isLive ? "bg-void-green/10 border border-void-green/20" : "bg-void-surface border border-void-border"
              )}>
                <Rocket className={cn("w-5 h-5", isLive ? "text-void-green" : "text-void-muted")} />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  {isLive && <span className="flex items-center gap-1 text-xs font-mono text-void-green"><span className="w-1.5 h-1.5 bg-void-green rounded-full animate-pulse" />LIVE</span>}
                  {isUpcoming && <Badge variant="secondary" className="text-[10px]">UPCOMING</Badge>}
                  {isEnded && <Badge variant="secondary" className="text-[10px]">ENDED</Badge>}
                </div>
                <h1 className="text-2xl font-black text-void-text">{room.name}</h1>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {!isEnded && (
                <Button
                  size="sm"
                  variant={room.isMember ? "outline" : "default"}
                  onClick={handleJoin}
                  loading={joinLoading}
                  className="font-mono gap-1.5"
                >
                  {room.isMember ? <><UserMinus className="w-3.5 h-3.5" />Leave</> : <><UserPlus className="w-3.5 h-3.5" />Join</>}
                </Button>
              )}
            </div>
          </div>

          {room.description && (
            <p className="text-void-muted text-sm leading-relaxed mb-4">{room.description}</p>
          )}

          {/* Timer */}
          {isLive && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-void-green/10 border border-void-green/20 mb-4">
              <Timer className="w-4 h-4 text-void-green" />
              <span className="text-sm font-mono font-bold text-void-green tabular-nums">{countdown} remaining</span>
            </div>
          )}

          {/* Meta */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "Members", value: formatNumber(room._count.members), icon: Users },
              { label: "Start", value: formatDate(room.startAt), icon: Play },
              { label: "End", value: formatDate(room.endAt), icon: Square },
              { label: "Duration", value: `${Math.round((end.getTime() - start.getTime()) / 3600000)}h`, icon: Clock },
            ].map(({ label, value, icon: Icon }) => (
              <div key={label} className="p-3 rounded-lg bg-void-surface border border-void-border text-center">
                <Icon className="w-4 h-4 text-void-muted mx-auto mb-1" />
                <div className="text-sm font-mono font-bold text-void-text">{value}</div>
                <div className="text-[10px] font-mono text-void-muted">{label}</div>
              </div>
            ))}
          </div>

          {/* Links */}
          {(room.repoUrl || room.shipUrl) && (
            <div className="flex gap-3 mt-4">
              {room.repoUrl && (
                <a href={room.repoUrl} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs font-mono text-void-cyan hover:underline">
                  <GitBranch className="w-3.5 h-3.5" /> Repository
                </a>
              )}
              {room.shipUrl && (
                <a href={room.shipUrl} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs font-mono text-void-green hover:underline">
                  <ExternalLink className="w-3.5 h-3.5" /> Shipped project
                </a>
              )}
            </div>
          )}
        </Card>
      </motion.div>

      {/* Members */}
      <div>
        <h2 className="text-sm font-mono font-bold text-void-muted uppercase tracking-wider mb-3">
          Team ({room._count.members})
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {room.members.map(member => {
            const repLevel = member.user.reputation?.level ?? "NEWCOMER";
            const repColor = REPUTATION_COLORS[repLevel];
            return (
              <Link key={member.userId} href={`/profile/${member.user.username}`}>
                <Card className="p-4 flex items-center gap-3 hover:border-void-purple/30 transition-all group">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={member.user.image ?? ""} />
                    <AvatarFallback className="text-sm">{getInitials(member.user.name ?? member.user.username)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-mono font-bold text-void-text group-hover:text-void-purple transition-colors truncate">
                        @{member.user.username}
                      </span>
                      {member.role === "LEAD" && <Crown className="w-3 h-3 text-yellow-500 flex-shrink-0" />}
                    </div>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded border" style={{ color: repColor, borderColor: `${repColor}25`, backgroundColor: `${repColor}10` }}>
                        {repLevel}
                      </span>
                      <span className="text-[10px] font-mono text-void-muted">Joined {formatDate(member.joinedAt)}</span>
                    </div>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>

        {room.members.length === 0 && (
          <div className="text-center py-12 rounded-xl border border-void-border bg-void-surface/30">
            <Users className="w-10 h-10 text-void-muted mx-auto mb-3" />
            <p className="text-void-muted font-mono text-sm">No members yet. Be the first to join!</p>
          </div>
        )}
      </div>
    </div>
  );
}
