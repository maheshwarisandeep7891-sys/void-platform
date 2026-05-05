"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowLeft,
  Package,
  Clock,
  Shield,
  Star,
  Users,
  ExternalLink,
  Bookmark,
  Share2,
  AlertCircle,
  CheckCircle2,
  DollarSign,
  Calendar,
} from "lucide-react";
import { useSession } from "@/hooks/use-session";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  cn,
  formatCurrency,
  formatDate,
  getInitials,
  REPUTATION_COLORS,
} from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface Listing {
  id: string;
  title: string;
  description: string;
  category: string;
  type: string;
  price?: number;
  hourlyRate?: number;
  dailyRate?: number;
  weeklyRate?: number;
  monthlyRate?: number;
  currency: string;
  techStack: string[];
  uptimeSLA?: number;
  views: number;
  createdAt: string;
  seller: {
    id: string;
    username: string;
    name?: string;
    image?: string;
    reputation?: { score: number; level: string };
    _count?: { listings: number };
  };
  images: { url: string; alt?: string }[];
  tags: { tag: { name: string; slug: string } }[];
  _count: { transactions: number };
}

const TYPE_LABELS: Record<string, string> = {
  FOR_SALE: "For Sale",
  FOR_RENT: "For Rent",
  FOR_BORROW: "Free Borrow",
  OPEN_TO_TRADE: "Open to Trade",
};

const TYPE_COLORS: Record<string, string> = {
  FOR_SALE: "text-void-green",
  FOR_RENT: "text-void-cyan",
  FOR_BORROW: "text-void-purple",
  OPEN_TO_TRADE: "text-void-yellow",
};

export default function ListingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const { toast } = useToast();
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);
  const [rentalDays, setRentalDays] = useState(1);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch(`/api/marketplace/listings/${params.id}`)
      .then((r) => r.json())
      .then(setListing)
      .catch(() => setListing(null))
      .finally(() => setLoading(false));
  }, [params.id]);

  const handleSave = async () => {
    if (!session) { toast({ title: "Sign in to save listings", variant: "destructive" }); return; }
    try {
      if (saved) {
        await fetch(`/api/marketplace/listings/${params.id}/save`, { method: "DELETE" });
        setSaved(false);
        toast({ title: "Removed from saved" });
      } else {
        await fetch(`/api/marketplace/listings/${params.id}/save`, { method: "POST" });
        setSaved(true);
        toast({ title: "Saved to your list!" });
      }
    } catch {
      toast({ title: "Failed to save", variant: "destructive" });
    }
  };

  const handlePurchase = async () => {
    if (!session) {
      router.push("/auth/signin");
      return;
    }
    setPurchasing(true);
    try {
      const res = await fetch("/api/marketplace/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          listingId: listing!.id,
          rentalDays: listing!.type === "FOR_RENT" ? rentalDays : undefined,
        }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? "Purchase failed");
      }
      const data = await res.json();
      toast({
        title: data.isFree ? "Claimed successfully!" : "Purchase initiated!",
        description: data.isFree
          ? "The item is now yours."
          : "Funds held in escrow. Awaiting delivery.",
        variant: "success",
      });
      router.push(`/marketplace/transactions/${data.transactionId}`);
    } catch (err: any) {
      toast({ title: err.message, variant: "destructive" });
    } finally {
      setPurchasing(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-6">
        <div className="h-8 w-32 bg-void-surface rounded animate-pulse mb-6" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div className="h-64 bg-void-surface rounded-xl animate-pulse" />
            <div className="h-48 bg-void-surface rounded-xl animate-pulse" />
          </div>
          <div className="h-64 bg-void-surface rounded-xl animate-pulse" />
        </div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 text-center">
        <Package className="w-12 h-12 text-void-muted mx-auto mb-4" />
        <p className="text-void-muted font-mono">Listing not found.</p>
        <Link href="/marketplace" className="mt-4 inline-block">
          <Button variant="outline" className="font-mono mt-4">
            Back to marketplace
          </Button>
        </Link>
      </div>
    );
  }

  const repLevel = listing.seller.reputation?.level ?? "NEWCOMER";
  const repColor = REPUTATION_COLORS[repLevel];
  const isOwnListing = session?.user?.id === listing.seller.id;

  const priceDisplay = () => {
    if (listing.type === "FOR_BORROW") return "Free";
    if (listing.type === "OPEN_TO_TRADE") return "Trade";
    if (listing.type === "FOR_RENT") {
      const parts = [];
      if (listing.hourlyRate) parts.push(`${formatCurrency(listing.hourlyRate, listing.currency)}/hr`);
      if (listing.dailyRate) parts.push(`${formatCurrency(listing.dailyRate, listing.currency)}/day`);
      if (listing.weeklyRate) parts.push(`${formatCurrency(listing.weeklyRate, listing.currency)}/wk`);
      if (listing.monthlyRate) parts.push(`${formatCurrency(listing.monthlyRate, listing.currency)}/mo`);
      return parts.join(" · ") || "Contact";
    }
    return listing.price ? formatCurrency(listing.price, listing.currency) : "Contact";
  };

  const totalRentalPrice = () => {
    if (listing.type !== "FOR_RENT") return null;
    if (rentalDays >= 30 && listing.monthlyRate)
      return listing.monthlyRate * Math.ceil(rentalDays / 30);
    if (rentalDays >= 7 && listing.weeklyRate)
      return listing.weeklyRate * Math.ceil(rentalDays / 7);
    if (listing.dailyRate) return listing.dailyRate * rentalDays;
    if (listing.hourlyRate) return listing.hourlyRate * rentalDays * 24;
    return null;
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      {/* Back */}
      <Link
        href="/marketplace"
        className="inline-flex items-center gap-1.5 text-sm font-mono text-void-muted hover:text-void-text transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to marketplace
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-5">
          {/* Images */}
          {listing.images.length > 0 ? (
            <div className="rounded-xl overflow-hidden border border-void-border bg-void-surface h-64">
              <img
                src={listing.images[0].url}
                alt={listing.images[0].alt ?? listing.title}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="rounded-xl border border-void-border bg-void-surface h-48 flex items-center justify-center">
              <Package className="w-16 h-16 text-void-muted/30" />
            </div>
          )}

          {/* Title + type */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className={cn("text-xs font-mono font-bold", TYPE_COLORS[listing.type])}>
                {TYPE_LABELS[listing.type]}
              </span>
              <span className="text-void-muted text-xs font-mono">·</span>
              <span className="text-xs font-mono text-void-muted capitalize">
                {listing.category}
              </span>
            </div>
            <h1 className="text-2xl font-black text-void-text mb-2">{listing.title}</h1>
            <div className="flex items-center gap-3 text-xs font-mono text-void-muted">
              <span>{listing.views} views</span>
              <span>·</span>
              <span>{listing._count.transactions} sales</span>
              <span>·</span>
              <span>Listed {formatDate(listing.createdAt)}</span>
            </div>
          </div>

          {/* Description */}
          <Card className="p-5">
            <h3 className="text-sm font-mono font-bold text-void-text mb-3">Description</h3>
            <div className="prose-void text-sm whitespace-pre-wrap">
              {listing.description}
            </div>
          </Card>

          {/* Tech stack */}
          {listing.techStack.length > 0 && (
            <Card className="p-5">
              <h3 className="text-sm font-mono font-bold text-void-text mb-3">Tech Stack</h3>
              <div className="flex flex-wrap gap-2">
                {listing.techStack.map((tech) => (
                  <span
                    key={tech}
                    className="px-2.5 py-1 rounded-md bg-void-surface border border-void-border text-xs font-mono text-void-muted"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </Card>
          )}

          {/* SLA */}
          {listing.uptimeSLA && (
            <Card className="p-5 border-void-green/20 bg-void-green/5">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-void-green" />
                <span className="text-sm font-mono font-bold text-void-green">
                  {listing.uptimeSLA}% Uptime SLA
                </span>
              </div>
              <p className="text-xs font-mono text-void-muted mt-1">
                Auto-refund if uptime drops below SLA during rental period.
              </p>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Price + Buy */}
          <Card className="p-5">
            <div className="mb-4">
              <div className={cn("text-2xl font-black font-mono tabular-nums", TYPE_COLORS[listing.type])}>
                {priceDisplay()}
              </div>
              {listing.type === "FOR_RENT" && (
                <p className="text-xs font-mono text-void-muted mt-1">
                  Rental pricing
                </p>
              )}
            </div>

            {/* Rental days selector */}
            {listing.type === "FOR_RENT" && (
              <div className="mb-4">
                <label className="text-xs font-mono text-void-muted mb-1.5 block">
                  Rental duration (days)
                </label>
                <input
                  type="number"
                  min={1}
                  max={365}
                  value={rentalDays}
                  onChange={(e) => setRentalDays(parseInt(e.target.value) || 1)}
                  className="w-full px-3 py-2 rounded-lg border border-void-border bg-void-surface text-void-text font-mono text-sm focus:outline-none focus:ring-1 focus:ring-void-purple"
                />
                {totalRentalPrice() !== null && (
                  <p className="text-xs font-mono text-void-green mt-1">
                    Total: {formatCurrency(totalRentalPrice()!, listing.currency)}
                  </p>
                )}
              </div>
            )}

            {isOwnListing ? (
              <Button variant="outline" className="w-full font-mono" disabled>
                Your listing
              </Button>
            ) : (
              <Button
                onClick={handlePurchase}
                loading={purchasing}
                className="w-full font-mono gap-2"
              >
                {listing.type === "FOR_BORROW"
                  ? "Claim for free"
                  : listing.type === "OPEN_TO_TRADE"
                  ? "Make a trade offer"
                  : listing.type === "FOR_RENT"
                  ? "Rent now"
                  : "Buy now"}
              </Button>
            )}

            {/* Escrow notice */}
            {listing.type !== "FOR_BORROW" && listing.type !== "OPEN_TO_TRADE" && (
              <div className="mt-3 flex items-start gap-2 p-2.5 rounded-lg bg-void-surface border border-void-border">
                <Shield className="w-3.5 h-3.5 text-void-green flex-shrink-0 mt-0.5" />
                <p className="text-[10px] font-mono text-void-muted leading-relaxed">
                  Protected by VOID Escrow. Funds held until you confirm delivery.
                  Auto-refund if seller disappears for 7 days.
                </p>
              </div>
            )}
          </Card>

          {/* Seller info */}
          <Card className="p-5">
            <h3 className="text-xs font-mono font-bold text-void-muted uppercase tracking-wider mb-3">
              Seller
            </h3>
            <Link href={`/profile/${listing.seller.username}`} className="flex items-center gap-3 group">
              <Avatar className="w-10 h-10">
                <AvatarImage src={listing.seller.image ?? ""} />
                <AvatarFallback>
                  {getInitials(listing.seller.name ?? listing.seller.username)}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-mono font-bold text-void-text group-hover:text-void-purple transition-colors">
                  @{listing.seller.username}
                </p>
                <span
                  className="text-[10px] font-mono"
                  style={{ color: repColor }}
                >
                  {repLevel}
                </span>
              </div>
            </Link>
          </Card>

          {/* Tags */}
          {listing.tags.length > 0 && (
            <Card className="p-5">
              <h3 className="text-xs font-mono font-bold text-void-muted uppercase tracking-wider mb-3">
                Tags
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {listing.tags.map(({ tag }) => (
                  <Badge key={tag.slug} variant="secondary" className="text-[10px]">
                    #{tag.name}
                  </Badge>
                ))}
              </div>
            </Card>
          )}

          {/* Actions */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleSave}
              className={cn("flex-1 font-mono gap-1.5", saved && "text-void-purple border-void-purple/30")}
            >
              <Bookmark className={cn("w-3.5 h-3.5", saved && "fill-current")} />
              {saved ? "Saved" : "Save"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => { navigator.clipboard.writeText(window.location.href); toast({ title: "Link copied!" }); }}
              className="flex-1 font-mono gap-1.5"
            >
              <Share2 className="w-3.5 h-3.5" />
              Share
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
