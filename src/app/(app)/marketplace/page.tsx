"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Search,
  Filter,
  Plus,
  Star,
  Clock,
  Tag,
  Package,
  Cpu,
  Globe,
  Code2,
  Database,
  Zap,
  Shield,
  ChevronDown,
  SlidersHorizontal,
  Bookmark,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  cn,
  formatCurrency,
  formatDate,
  getInitials,
  REPUTATION_COLORS,
} from "@/lib/utils";

const CATEGORIES = [
  { id: "all", label: "All", icon: Package },
  { id: "saas", label: "SaaS Seats", icon: Globe },
  { id: "api-credits", label: "API Credits", icon: Zap },
  { id: "licenses", label: "Licenses", icon: Shield },
  { id: "domains", label: "Domains", icon: Globe },
  { id: "projects", label: "Side Projects", icon: Code2 },
  { id: "gpu", label: "GPU Access", icon: Cpu },
  { id: "datasets", label: "Datasets", icon: Database },
  { id: "templates", label: "Templates", icon: Package },
  { id: "services", label: "Services", icon: Star },
];

const LISTING_TYPES = [
  { id: "all", label: "All Types" },
  { id: "FOR_SALE", label: "For Sale" },
  { id: "FOR_RENT", label: "For Rent" },
  { id: "FOR_BORROW", label: "For Borrow" },
  { id: "OPEN_TO_TRADE", label: "Trade" },
];

const TYPE_COLORS: Record<string, string> = {
  FOR_SALE: "text-void-green",
  FOR_RENT: "text-void-cyan",
  FOR_BORROW: "text-void-purple",
  OPEN_TO_TRADE: "text-void-yellow",
};

const TYPE_LABELS: Record<string, string> = {
  FOR_SALE: "For Sale",
  FOR_RENT: "For Rent",
  FOR_BORROW: "Borrow",
  OPEN_TO_TRADE: "Trade",
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
  seller: {
    id: string;
    username: string;
    name?: string;
    image?: string;
    reputation?: { score: number; level: string };
  };
  images: { url: string; alt?: string }[];
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
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchListings = useCallback(
    async (reset = false) => {
      try {
        setLoading(true);
        const currentPage = reset ? 1 : page;
        const params = new URLSearchParams({
          page: currentPage.toString(),
          sort,
          ...(category !== "all" && { category }),
          ...(listingType !== "all" && { type: listingType }),
          ...(search && { search }),
        });

        const res = await fetch(`/api/marketplace/listings?${params}`);
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();

        if (reset) {
          setListings(data.listings);
          setPage(2);
        } else {
          setListings((prev) => [...prev, ...data.listings]);
          setPage((p) => p + 1);
        }
        setHasMore(data.hasMore);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    },
    [category, listingType, search, sort, page]
  );

  useEffect(() => {
    const timer = setTimeout(() => fetchListings(true), search ? 300 : 0);
    return () => clearTimeout(timer);
  }, [category, listingType, search, sort]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black font-mono text-void-text">
            Marketplace
          </h1>
          <p className="text-sm font-mono text-void-muted">
            Buy, sell, rent, and trade developer tools
          </p>
        </div>
        <Link href="/marketplace/new">
          <Button size="sm" className="gap-1.5 font-mono">
            <Plus className="w-3.5 h-3.5" />
            List Item
          </Button>
        </Link>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-void-muted" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search tools, APIs, domains, projects..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-void-border bg-void-surface text-void-text placeholder:text-void-muted font-mono text-sm focus:outline-none focus:ring-1 focus:ring-void-purple focus:border-void-purple transition-colors"
        />
      </div>

      {/* Category filters */}
      <div className="flex gap-2 overflow-x-auto pb-3 mb-4">
        {CATEGORIES.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setCategory(id)}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono whitespace-nowrap transition-all flex-shrink-0",
              category === id
                ? "bg-void-purple/10 text-void-purple border border-void-purple/20"
                : "bg-void-surface text-void-muted border border-void-border hover:text-void-text hover:border-void-border/80"
            )}
          >
            <Icon className="w-3.5 h-3.5" />
            {label}
          </button>
        ))}
      </div>

      {/* Type + Sort filters */}
      <div className="flex items-center gap-3 mb-6">
        <div className="flex gap-1.5">
          {LISTING_TYPES.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setListingType(id)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-mono transition-all",
                listingType === id
                  ? "bg-void-surface text-void-text border border-void-border"
                  : "text-void-muted hover:text-void-text"
              )}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="flex-1" />
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="px-3 py-1.5 rounded-lg text-xs font-mono bg-void-surface border border-void-border text-void-muted focus:outline-none focus:ring-1 focus:ring-void-purple"
        >
          <option value="newest">Newest</option>
          <option value="popular">Most Popular</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
        </select>
      </div>

      {/* Listings grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <AnimatePresence mode="popLayout">
          {loading && listings.length === 0
            ? Array.from({ length: 8 }).map((_, i) => (
                <motion.div
                  key={`skeleton-${i}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="rounded-xl border border-void-border bg-void-card p-4 space-y-3"
                >
                  <div className="w-full h-32 bg-void-surface rounded-lg animate-pulse" />
                  <div className="w-3/4 h-4 bg-void-surface rounded animate-pulse" />
                  <div className="w-1/2 h-3 bg-void-surface rounded animate-pulse" />
                  <div className="w-1/4 h-5 bg-void-surface rounded animate-pulse" />
                </motion.div>
              ))
            : listings.map((listing, i) => (
                <motion.div
                  key={listing.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                >
                  <ListingCard listing={listing} />
                </motion.div>
              ))}
        </AnimatePresence>
      </div>

      {listings.length === 0 && !loading && (
        <div className="text-center py-16">
          <Package className="w-12 h-12 text-void-muted mx-auto mb-4" />
          <p className="text-void-muted font-mono">No listings found.</p>
          <Link href="/marketplace/new" className="mt-4 inline-block">
            <Button size="sm" className="font-mono gap-1.5 mt-4">
              <Plus className="w-3.5 h-3.5" />
              List something
            </Button>
          </Link>
        </div>
      )}

      {hasMore && listings.length > 0 && (
        <div className="flex justify-center mt-8">
          <Button
            variant="outline"
            onClick={() => fetchListings()}
            loading={loading}
            className="font-mono gap-2"
          >
            <ChevronDown className="w-4 h-4" />
            Load more
          </Button>
        </div>
      )}
    </div>
  );
}

function ListingCard({ listing }: { listing: Listing }) {
  const [saved, setSaved] = useState(false);
  const repLevel = listing.seller.reputation?.level ?? "NEWCOMER";
  const repColor = REPUTATION_COLORS[repLevel];

  const priceDisplay = () => {
    if (listing.type === "FOR_BORROW") return "Free (borrow)";
    if (listing.type === "OPEN_TO_TRADE") return "Trade";
    if (listing.type === "FOR_RENT") {
      if (listing.hourlyRate) return `${formatCurrency(listing.hourlyRate, listing.currency)}/hr`;
      if (listing.dailyRate) return `${formatCurrency(listing.dailyRate, listing.currency)}/day`;
    }
    if (listing.price) return formatCurrency(listing.price, listing.currency);
    return "Contact";
  };

  return (
    <Card hover className="overflow-hidden group flex flex-col">
      {/* Image */}
      <div className="relative h-36 bg-void-surface border-b border-void-border overflow-hidden">
        {listing.images[0] ? (
          <img
            src={listing.images[0].url}
            alt={listing.images[0].alt ?? listing.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package className="w-10 h-10 text-void-muted/30" />
          </div>
        )}
        {/* Type badge */}
        <div className="absolute top-2 left-2">
          <span
            className={cn(
              "text-[10px] font-mono px-2 py-0.5 rounded-md bg-void-bg/80 backdrop-blur-sm border border-void-border",
              TYPE_COLORS[listing.type]
            )}
          >
            {TYPE_LABELS[listing.type]}
          </span>
        </div>
        {/* Save button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            setSaved((p) => !p);
          }}
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
        <h3 className="text-sm font-bold text-void-text mb-1 line-clamp-2 group-hover:text-void-purple transition-colors">
          {listing.title}
        </h3>
        <p className="text-xs text-void-muted line-clamp-2 mb-3 flex-1">
          {listing.description}
        </p>

        {/* Tech stack */}
        {listing.techStack.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {listing.techStack.slice(0, 3).map((tech) => (
              <span
                key={tech}
                className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-void-surface border border-void-border text-void-muted"
              >
                {tech}
              </span>
            ))}
            {listing.techStack.length > 3 && (
              <span className="text-[10px] font-mono text-void-muted">
                +{listing.techStack.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Avatar className="w-5 h-5">
              <AvatarImage src={listing.seller.image ?? ""} />
              <AvatarFallback className="text-[8px]">
                {getInitials(listing.seller.name ?? listing.seller.username)}
              </AvatarFallback>
            </Avatar>
            <span className="text-[10px] font-mono text-void-muted">
              @{listing.seller.username}
            </span>
          </div>
          <span className="text-sm font-mono font-bold text-void-text tabular-nums">
            {priceDisplay()}
          </span>
        </div>
      </Link>
    </Card>
  );
}
