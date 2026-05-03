"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Rocket, Plus, Clock, Users, ExternalLink, Timer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn, formatDate } from "@/lib/utils";

interface HackathonRoom {
  id: string;
  name: string;
  description?: string;
  startAt: string;
  endAt: string;
  isActive: boolean;
  repoUrl?: string;
  shipUrl?: string;
  _count: { members: number };
}

export default function HackathonsPage() {
  const [rooms, setRooms] = useState<HackathonRoom[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/hackathons")
      .then((r) => r.json())
      .then((d) => setRooms(d.rooms ?? []))
      .catch(() => setRooms([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black font-mono text-void-text">Hackathons</h1>
          <p className="text-sm font-mono text-void-muted">48-72 hour team workspaces</p>
        </div>
        <Link href="/hackathons/new">
          <Button size="sm" className="gap-1.5 font-mono">
            <Plus className="w-3.5 h-3.5" />
            Create Room
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-40 bg-void-surface rounded-xl animate-pulse" />
            ))
          : rooms.length === 0
          ? (
            <div className="col-span-2 text-center py-16">
              <Rocket className="w-12 h-12 text-void-muted mx-auto mb-4" />
              <p className="text-void-muted font-mono">No active hackathon rooms.</p>
              <Link href="/hackathons/new" className="mt-4 inline-block">
                <Button size="sm" className="font-mono gap-1.5 mt-4">
                  <Plus className="w-3.5 h-3.5" />
                  Create the first room
                </Button>
              </Link>
            </div>
          )
          : rooms.map((room, i) => (
              <motion.div
                key={room.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <HackathonCard room={room} />
              </motion.div>
            ))}
      </div>
    </div>
  );
}

function HackathonCard({ room }: { room: HackathonRoom }) {
  const now = new Date();
  const end = new Date(room.endAt);
  const start = new Date(room.startAt);
  const isLive = now >= start && now <= end;
  const timeLeft = end.getTime() - now.getTime();
  const hoursLeft = Math.max(0, Math.floor(timeLeft / (1000 * 60 * 60)));
  const minutesLeft = Math.max(0, Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60)));

  return (
    <Link href={`/hackathons/${room.id}`}>
      <Card hover className="p-5 group">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className={cn(
              "w-2 h-2 rounded-full",
              isLive ? "bg-void-green animate-pulse" : "bg-void-muted"
            )} />
            <Badge variant={isLive ? "green" : "secondary"} className="text-[10px]">
              {isLive ? "LIVE" : "UPCOMING"}
            </Badge>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-mono text-void-muted">
            <Users className="w-3.5 h-3.5" />
            {room._count.members}
          </div>
        </div>

        <h3 className="text-base font-bold text-void-text mb-1 group-hover:text-void-purple transition-colors">
          {room.name}
        </h3>
        {room.description && (
          <p className="text-sm text-void-muted line-clamp-2 mb-3">{room.description}</p>
        )}

        <div className="flex items-center gap-3 text-xs font-mono text-void-muted">
          {isLive ? (
            <span className="flex items-center gap-1 text-void-green">
              <Timer className="w-3.5 h-3.5" />
              {hoursLeft}h {minutesLeft}m left
            </span>
          ) : (
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              Starts {formatDate(room.startAt)}
            </span>
          )}
          {room.shipUrl && (
            <a
              href={room.shipUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-void-cyan hover:underline ml-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <ExternalLink className="w-3 h-3" />
              Shipped
            </a>
          )}
        </div>
      </Card>
    </Link>
  );
}
