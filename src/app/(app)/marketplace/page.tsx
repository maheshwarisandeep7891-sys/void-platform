"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Search, Plus, Package, Cpu, Globe, Code2,
  Database, Zap, Shield, Star, Clock, TrendingUp,
  Bookmark, ChevronRight, Filter, SlidersHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn, formatCurrency, formatDate, getInitials, REPUTATION_COLORS } from "@/lib/utils";

const CATEGORIES = [
  { id: "all",       label: "All",          icon: Package },
  { id: "saas",      label: "SaaS Seats",   icon: Globe },
  { id: "api",       label: "API Credits",  icon: Zap },
  { id: "licenses",  label: "Licenses",     icon: Shield },
  { id: "projects",  label: "Projects",     icon: Code2 },
  { id: "gpu",       label: "GPU Access",   icon: Cpu },
  { id: "datasets",  label: "Datasets",     icon: Database },
];

const TYPE_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  FOR_SALE:      { label: "For Sale",  color: "text-void-green",  bg: "bg-void-green/10" },
  FOR_RENT:      { label: "For Rent",  color: "text-void-cyan",   bg: "bg-void-cyan/10" },
  FOR_BORROW:    { label: "Borrow",    color: "text-void-purple", bg: "bg-void-purple/10" },
  OPEN_TO_TRADE: { label: "Trade",     color: "text-yellow-400",  bg: "bg-yellow-500/10" },
};

interface Listing {
  id: string;
  title: string;
  description: string;
  category: string;
  type: string;
  price?: number;
  hourlyRate?: number;
  dailyRate?: number;
  currency: string;
  techStack: string[];
  views: number;
  createdAt: string;
  seller: { id: string; username: string; name?: string; image?: string; reputation?: { score: number; level: string } };
  images: { url: string }[];
  tags: { tag: { name: string; slug: string } }[];
  _count: { transactions: number };
}

export default function MarketplacePage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("all");
  const [listingType, setListingType] = useState("all");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest");

  const fetchListings = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        sort,
        ...(category !== "all" && { category }),
        ...(listingType !== "all" && { type: listingType }),
        ...(search && { search }),
      });
      const res = await fetch(`/api/marketplace/listings?${params}`);
      if (!res.ok) throw new Error("Failed");
      const data = await res.json();
      setListings(data.listings ?? []);
    } catch {
      setListings([]);
    } finally {
      setLoading(false);
    }
  }, [category, listingType, search, sort]);

  useEffect(() => {
    const timer = setTimeout(fetchListings, search ? 300 : 0);
    return () => clearTimeout(timer);
  }, [fetchListings]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black font-mono text-void-text tracking-tight">Marketplace</h1>
          <p className="text-xs font-mono text-void-muted mt-0.5">Buy, sell, rent, and trade developer tools</p>
        </div>
        <Link href="/marketplace/new">
          <Button size="sm" className="gap-1.5 font-mono">
            <Plus className="w-3.5 h-3.5" />
            List Item
          </Button>
        </Link>
      </div>

      {/* Search */}
      <div className="relative mb-5">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-void-muted" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search tools, APIs, domains, projects..."
          className="w-full pl-11 pr-4 py-3 rounded-xl border border-void-border bg-void-surface text-void-text placeholder:text-void-muted font-mono text-sm focus:outline-none focus:ring-2 focus:ring-void-purple/50 focus:border-void-purple transition-all"
        />
      </div>

      {/* Category filters */}
      <div className="flex gap-2 overflow-x-auto pb-3 mb-4">
        {CATEGORIES.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setCategory(id)}
            className={cn(
              "flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-mono whitespace-nowrap transition-all flex-shrink-0 border",
              category === id
                ? "bg-void-purple text-void-bg border-void-purple font-bold"
                : "bg-void-surface text-void-muted border-void-border hover:text-void-text hover:border-void-purple/30"
            )}
          >
            <Icon className="w-3.5 h-3.5" />
            {label}
          </button>
        ))}
      </div>

      {/* Type + Sort */}
      <div className="flex items-center gap-3 mb-6">
        <div className="flex gap-1.5 flex-1 overflow-x-auto">
          {[
            { id: "all", label: "All Types" },
            { id: "FOR_SALE", label: "For Sale" },
            { id: "FOR_RENT", label: "For Rent" },
            { id: "FOR_BORROW", label: "Borrow" },
            { id: "OPEN_TO_TRADE", label: "Trade" },
          ].map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setListingType(id)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-mono whitespace-nowrap transition-all",
                listingType === id
                  ? "bg-void-surface text-void-text border border-void-border"
                  : "text-void-muted hover:text-void-text"
              )}
            >
              {label}
            </button>
          ))}
        </div>
        <select
          value={sort}
          onChange={e => setSort(e.target.value)}
          className="px-3 py-1.5 rounded-lg text-xs font-mono bg-void-surface border border-void-border text-void-muted focus:outline-none focus:ring-1 focus:ring-void-purple flex-shrink-0"
        >
          <option value="newest">Newest</option>
          <option value="popular">Popular</option>
          <option value="price_asc">Price ↑</option>
          <option value="price_desc">Price ↓</option>
        </select>
      </div>

      {/* Listings grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <AnimatePresence mode="popLayout">
          {loading
            ? Array.from({ length: 8 }).map((_, i) => (
                <motion.div
                  key={`sk-${i}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.04 }}
                  className="rounded-xl border border-void-border bg-void-card overflow-hidden"
                >
                  <div className="h-36 bg-void-surface animate-pulse" />
                  <div className="p-4 space-y-2">
                    <div className="h-4 bg-void-surface rounded animate-pulse" />
                    <div className="h-3 w-2/3 bg-void-surface rounded animate-pulse" />
                    <div className="h-5 w-1/3 bg-void-surface rounded animate-pulse mt-3" />
                  </div>
                </motion.div>
              ))
            : listings.length === 0
            ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="col-span-full text-center py-20"
              >
                <Package className="w-12 h-12 text-void-muted mx-auto mb-4" />
                <p className="text-void-text font-mono font-bold mb-1">No listings found</p>
                <p className="text-void-muted font-mono text-sm mb-6">Be the first to list something.</p>
                <Link href="/marketplace/new">
                  <Button className="font-mono gap-1.5">
                    <Plus className="w-4 h-4" />
                    List something
                  </Button>
                </Link>
              </motion.div>
            )
            : listings.map((listing, i) => (
                <motion.div
                  key={listing.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(i * 0.04, 0.3) }}
                  layout
                >
                  <ListingCard listing={listing} />
                </motion.div>
              ))
          }
        </AnimatePresence>
      </div>
    </div>
  );
}

function ListingCard({ listing }: { listing: Listing }) {
  const [saved, setSaved] = useState(false);
  const typeConfig = TYPE_CONFIG[listing.type] ?? TYPE_CONFIG.FOR_SALE;
  const repLevel = listing.seller.reputation?.level ?? "NEWCOMER";
  const repColor = REPUTATION_COLORS[repLevel];

  const priceDisplay = () => {
    if (listing.type === "FOR_BORROW") return "Free";
    if (listing.type === "OPEN_TO_TRADE") return "Trade";
    if (listing.type === "FOR_RENT" && listing.hourlyRate) return `${formatCurrency(listing.hourlyRate, listing.currency)}/hr`;
    if (listing.type === "FOR_RENT" && listing.dailyRate) return `${formatCurrency(listing.dailyRate, listing.currency)}/day`;
    if (listing.price) return formatCurrency(listing.price, listing.currency);
    return "Contact";
  };

  return (
    <Card hover className="overflow-hidden group flex flex-col">
      {/* Image / placeholder */}
      <div className="relative h-36 bg-void-surface border-b border-void-border overflow-hidden">
        {listing.images[0] ? (
          <img src={listing.images[0].url} alt={listing.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package className="w-10 h-10 text-void-muted/20" />
          </div>
        )}
        {/* Type badge */}
        <div className="absolute top-2 left-2">
          <span className={cn("text-[10px] font-mono font-bold px-2 py-0.5 rounded-full", typeConfig.bg, typeConfig.color)}>
            {typeConfig.label}
          </span>
        </div>
        {/* Save button */}
        <button
          onClick={e => { e.preventDefault(); setSaved(p => !p); }}
          className={cn(
            "absolute top-2 right-2 p-1.5 rounded-lg bg-void-bg/80 backdrop-blur-sm border border-void-border transition-all opacity-0 group-hover:opacity-100",
            saved ? "text-void-purple" : "text-void-muted hover:text-void-text"
          )}
        >
          <Bookmark className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Content */}
      <Link href={`/marketplace/${listing.id}`} className="flex flex-col flex-1 p-4">
        <h3 className="text-sm font-bold text-void-text mb-1 line-clamp-2 group-hover:text-void-purple transition-colors leading-snug">
          {listing.title}
        </h3>
        <p className="text-xs text-void-muted line-clamp-2 mb-3 flex-1 leading-relaxed">
          {listing.description}
        </p>

        {/* Tech stack */}
        {listing.techStack.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {listing.techStack.slice(0, 3).map(tech => (
              <span key={tech} className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-void-surface border border-void-border text-void-muted">
                {tech}
              </span>
            ))}
            {listing.techStack.length > 3 && (
              <span className="text-[9px] font-mono text-void-muted">+{listing.techStack.length - 3}</span>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Avatar className="w-5 h-5">
              <AvatarImage src={listing.seller.image ?? ""} />
              <AvatarFallback className="text-[8px]">{getInitials(listing.seller.name ?? listing.seller.username)}</AvatarFallback>
            </Avatar>
            <span className="text-[10px] font-mono text-void-muted">@{listing.seller.username}</span>
          </div>
          <span className={cn("text-sm font-black font-mono tabular-nums", typeConfig.color)}>
            {priceDisplay()}
          </span>
        </div>
      </Link>
    </Card>
  );
}
