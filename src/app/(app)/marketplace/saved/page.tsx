"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Bookmark, Package, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn, formatCurrency, formatDate, getInitials, REPUTATION_COLORS } from "@/lib/utils";

const TYPE_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  FOR_SALE:      { label: "For Sale",  color: "text-void-green",  bg: "bg-void-green/10" },
  FOR_RENT:      { label: "For Rent",  color: "text-void-cyan",   bg: "bg-void-cyan/10" },
  FOR_BORROW:    { label: "Borrow",    color: "text-void-purple", bg: "bg-void-purple/10" },
  OPEN_TO_TRADE: { label: "Trade",     color: "text-yellow-400",  bg: "bg-yellow-500/10" },
};

interface SavedListing {
  createdAt: string;
  listing: {
    id: string;
    title: string;
    description: string;
    category: string;
    type: string;
    price?: number;
    hourlyRate?: number;
    currency: string;
    status: string;
    seller: { id: string; username: string; name?: string; image?: string; reputation?: { score: number; level: string } };
    images: { url: string }[];
  };
}

export default function SavedListingsPage() {
  const [saved, setSaved] = useState<SavedListing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/marketplace/saved")
      .then(r => r.json())
      .then(d => setSaved(d.saved ?? []))
      .catch(() => setSaved([]))
      .finally(() => setLoading(false));
  }, []);

  const handleUnsave = async (listingId: string) => {
    try {
      await fetch(`/api/marketplace/listings/${listingId}/save`, { method: "DELETE" });
      setSaved(prev => prev.filter(s => s.listing.id !== listingId));
    } catch {}
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black font-mono text-void-text">Saved Listings</h1>
          <p className="text-sm font-mono text-void-muted">Items you bookmarked</p>
        </div>
        <Link href="/marketplace">
          <Button size="sm" variant="outline" className="font-mono gap-1.5">
            <Package className="w-3.5 h-3.5" />
            Browse marketplace
          </Button>
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-40 bg-void-surface rounded-xl animate-pulse" />
          ))}
        </div>
      ) : saved.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-16 h-16 rounded-2xl bg-void-surface border border-void-border flex items-center justify-center mx-auto mb-4">
            <Bookmark className="w-8 h-8 text-void-muted" />
          </div>
          <p className="text-void-text font-mono font-bold mb-1">No saved listings</p>
          <p className="text-void-muted font-mono text-sm mb-6">Bookmark listings to find them later.</p>
          <Link href="/marketplace">
            <Button className="font-mono gap-1.5">
              <Plus className="w-4 h-4" />
              Browse marketplace
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {saved.map(({ listing, createdAt }, i) => {
            const typeConfig = TYPE_CONFIG[listing.type] ?? TYPE_CONFIG.FOR_SALE;
            const repLevel = listing.seller.reputation?.level ?? "NEWCOMER";
            const repColor = REPUTATION_COLORS[repLevel];

            const priceDisplay = () => {
              if (listing.type === "FOR_BORROW") return "Free";
              if (listing.type === "OPEN_TO_TRADE") return "Trade";
              if (listing.type === "FOR_RENT" && listing.hourlyRate) return `${formatCurrency(listing.hourlyRate, listing.currency)}/hr`;
              if (listing.price) return formatCurrency(listing.price, listing.currency);
              return "Contact";
            };

            return (
              <motion.div
                key={listing.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Card className="overflow-hidden group hover:border-void-purple/30 transition-all">
                  <div className="relative h-32 bg-void-surface border-b border-void-border">
                    {listing.images[0] ? (
                      <img src={listing.images[0].url} alt={listing.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package className="w-8 h-8 text-void-muted/20" />
                      </div>
                    )}
                    <div className="absolute top-2 left-2">
                      <span className={cn("text-[10px] font-mono font-bold px-2 py-0.5 rounded-full", typeConfig.bg, typeConfig.color)}>
                        {typeConfig.label}
                      </span>
                    </div>
                    <button
                      onClick={() => handleUnsave(listing.id)}
                      className="absolute top-2 right-2 p-1.5 rounded-lg bg-void-bg/80 backdrop-blur-sm border border-void-border text-void-purple hover:text-red-400 transition-colors"
                      title="Remove from saved"
                    >
                      <Bookmark className="w-3.5 h-3.5 fill-current" />
                    </button>
                  </div>
                  <Link href={`/marketplace/${listing.id}`} className="block p-4">
                    <h3 className="text-sm font-bold text-void-text mb-1 line-clamp-1 group-hover:text-void-purple transition-colors">
                      {listing.title}
                    </h3>
                    <p className="text-xs text-void-muted line-clamp-2 mb-3">{listing.description}</p>
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
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
