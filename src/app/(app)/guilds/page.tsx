"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Users, Plus, Lock, Globe, Search, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn, formatNumber } from "@/lib/utils";

interface Guild {
  id: string;
  name: string;
  slug: string;
  description?: string;
  avatar?: string;
  visibility: string;
  techStack: string[];
  _count: { members: number };
}

export default function GuildsPage() {
  const [guilds, setGuilds] = useState<Guild[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchGuilds = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams({ ...(search && { search }) });
        const res = await fetch(`/api/guilds?${params}`);
        if (!res.ok) throw new Error("Failed");
        const data = await res.json();
        setGuilds(data.guilds ?? []);
      } catch {
        setGuilds([]);
      } finally {
        setLoading(false);
      }
    };
    const timer = setTimeout(fetchGuilds, search ? 300 : 0);
    return () => clearTimeout(timer);
  }, [search]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black font-mono text-void-text">Guilds</h1>
          <p className="text-sm font-mono text-void-muted">
            Communities organized by tech stack
          </p>
        </div>
        <Link href="/guilds/new">
          <Button size="sm" className="gap-1.5 font-mono">
            <Plus className="w-3.5 h-3.5" />
            Create Guild
          </Button>
        </Link>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-void-muted" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search guilds..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-void-border bg-void-surface text-void-text placeholder:text-void-muted font-mono text-sm focus:outline-none focus:ring-1 focus:ring-void-purple transition-colors"
        />
      </div>

      {/* Guilds grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-40 bg-void-surface rounded-xl animate-pulse" />
            ))
          : guilds.length === 0
          ? (
            <div className="col-span-3 text-center py-16">
              <Users className="w-12 h-12 text-void-muted mx-auto mb-4" />
              <p className="text-void-muted font-mono">No guilds found.</p>
            </div>
          )
          : guilds.map((guild, i) => (
              <motion.div
                key={guild.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <GuildCard guild={guild} />
              </motion.div>
            ))}
      </div>
    </div>
  );
}

function GuildCard({ guild }: { guild: Guild }) {
  return (
    <Link href={`/guilds/${guild.slug}`}>
      <Card hover className="p-5 h-full flex flex-col group">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            {guild.avatar ? (
              <img
                src={guild.avatar}
                alt={guild.name}
                className="w-10 h-10 rounded-xl object-cover"
              />
            ) : (
              <div className="w-10 h-10 rounded-xl bg-void-purple/10 border border-void-purple/20 flex items-center justify-center">
                <Users className="w-5 h-5 text-void-purple" />
              </div>
            )}
            <div>
              <h3 className="text-sm font-bold text-void-text group-hover:text-void-purple transition-colors">
                {guild.name}
              </h3>
              <div className="flex items-center gap-1.5 mt-0.5">
                {guild.visibility === "PRIVATE" ? (
                  <Lock className="w-3 h-3 text-void-muted" />
                ) : (
                  <Globe className="w-3 h-3 text-void-muted" />
                )}
                <span className="text-[10px] font-mono text-void-muted">
                  {formatNumber(guild._count.members)} members
                </span>
              </div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-void-muted opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>

        {guild.description && (
          <p className="text-xs text-void-muted line-clamp-2 mb-3 flex-1">
            {guild.description}
          </p>
        )}

        {guild.techStack.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {guild.techStack.slice(0, 4).map((tech) => (
              <span
                key={tech}
                className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-void-surface border border-void-border text-void-muted"
              >
                {tech}
              </span>
            ))}
          </div>
        )}
      </Card>
    </Link>
  );
}
