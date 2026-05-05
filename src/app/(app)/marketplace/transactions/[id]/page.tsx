"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowLeft,
  Shield,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  Package,
  User,
  DollarSign,
} from "lucide-react";
import { useSession } from "@/hooks/use-session";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn, formatCurrency, formatDate, getInitials } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface Transaction {
  id: string;
  amount: number;
  platformFee: number;
  sellerPayout: number;
  currency: string;
  status: string;
  createdAt: string;
  completedAt?: string;
  autoRefundAt?: string;
  listing: { id: string; title: string; type: string; images: { url: string }[] };
  buyer: { id: string; username: string; image?: string };
  seller: { id: string; username: string; image?: string };
  escrow?: { heldAt: string; releasedAt?: string; refundedAt?: string };
}

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  PENDING: { label: "Pending", color: "text-void-muted", icon: Clock },
  IN_ESCROW: { label: "In Escrow", color: "text-void-cyan", icon: Shield },
  COMPLETED: { label: "Completed", color: "text-void-green", icon: CheckCircle2 },
  REFUNDED: { label: "Refunded", color: "text-void-muted", icon: XCircle },
  DISPUTED: { label: "Disputed", color: "text-void-yellow", icon: AlertTriangle },
  CANCELLED: { label: "Cancelled", color: "text-red-400", icon: XCircle },
};

export default function TransactionPage() {
  const params = useParams();
  const { data: session } = useSession();
  const { toast } = useToast();
  const [tx, setTx] = useState<Transaction | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/marketplace/transactions/${params.id}`)
      .then((r) => r.json())
      .then(setTx)
      .catch(() => setTx(null))
      .finally(() => setLoading(false));
  }, [params.id]);

  const handleAction = async (action: "release" | "refund" | "dispute") => {
    setActionLoading(action);
    try {
      const res = await fetch(`/api/marketplace/transactions/${params.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? "Action failed");
      }
      const data = await res.json();
      toast({ title: `Transaction ${action}d successfully`, variant: "success" });
      // Refresh
      const updated = await fetch(`/api/marketplace/transactions/${params.id}`).then((r) => r.json());
      setTx(updated);
    } catch (err: any) {
      toast({ title: err.message, variant: "destructive" });
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-6">
        <div className="h-64 bg-void-surface rounded-xl animate-pulse" />
      </div>
    );
  }

  if (!tx) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <p className="text-void-muted font-mono">Transaction not found.</p>
      </div>
    );
  }

  const isBuyer = session?.user?.id === tx.buyer.id;
  const isSeller = session?.user?.id === tx.seller.id;
  const statusConfig = STATUS_CONFIG[tx.status] ?? STATUS_CONFIG.PENDING;
  const StatusIcon = statusConfig.icon;

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <Link
        href="/marketplace"
        className="inline-flex items-center gap-1.5 text-sm font-mono text-void-muted hover:text-void-text transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to marketplace
      </Link>

      <div className="space-y-4">
        {/* Status header */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center",
                tx.status === "COMPLETED" ? "bg-void-green/10" :
                tx.status === "IN_ESCROW" ? "bg-void-cyan/10" :
                tx.status === "DISPUTED" ? "bg-void-yellow/10" : "bg-void-surface"
              )}>
                <StatusIcon className={cn("w-5 h-5", statusConfig.color)} />
              </div>
              <div>
                <h1 className="text-lg font-black font-mono text-void-text">
                  Transaction
                </h1>
                <p className="text-xs font-mono text-void-muted">{tx.id}</p>
              </div>
            </div>
            <Badge
              variant={
                tx.status === "COMPLETED" ? "green" :
                tx.status === "IN_ESCROW" ? "cyan" :
                tx.status === "DISPUTED" ? "yellow" : "secondary"
              }
            >
              {statusConfig.label}
            </Badge>
          </div>

          {/* Listing */}
          <Link href={`/marketplace/${tx.listing.id}`} className="flex items-center gap-3 p-3 rounded-lg bg-void-surface border border-void-border hover:border-void-purple/30 transition-colors mb-4">
            {tx.listing.images[0] ? (
              <img src={tx.listing.images[0].url} alt="" className="w-12 h-12 rounded-lg object-cover" />
            ) : (
              <div className="w-12 h-12 rounded-lg bg-void-border flex items-center justify-center">
                <Package className="w-6 h-6 text-void-muted" />
              </div>
            )}
            <div>
              <p className="text-sm font-mono font-bold text-void-text">{tx.listing.title}</p>
              <p className="text-xs font-mono text-void-muted">{tx.listing.type.replace(/_/g, " ")}</p>
            </div>
          </Link>

          {/* Amount breakdown */}
          <div className="space-y-2 p-3 rounded-lg bg-void-surface border border-void-border">
            <div className="flex justify-between text-sm font-mono">
              <span className="text-void-muted">Amount</span>
              <span className="text-void-text tabular-nums">{formatCurrency(tx.amount, tx.currency)}</span>
            </div>
            <div className="flex justify-between text-sm font-mono">
              <span className="text-void-muted">Platform fee (7%)</span>
              <span className="text-void-muted tabular-nums">-{formatCurrency(tx.platformFee, tx.currency)}</span>
            </div>
            <div className="flex justify-between text-sm font-mono border-t border-void-border pt-2">
              <span className="text-void-text font-bold">Seller receives</span>
              <span className="text-void-green font-bold tabular-nums">{formatCurrency(tx.sellerPayout, tx.currency)}</span>
            </div>
          </div>
        </Card>

        {/* Parties */}
        <Card className="p-5">
          <h3 className="text-xs font-mono font-bold text-void-muted uppercase tracking-wider mb-3">Parties</h3>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: "Buyer", user: tx.buyer, isYou: isBuyer },
              { label: "Seller", user: tx.seller, isYou: isSeller },
            ].map(({ label, user, isYou }) => (
              <div key={label} className="flex items-center gap-2">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={user.image ?? ""} />
                  <AvatarFallback className="text-xs">{getInitials(user.username)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-xs font-mono text-void-muted">{label}</p>
                  <Link href={`/profile/${user.username}`} className="text-sm font-mono text-void-text hover:text-void-purple transition-colors">
                    @{user.username} {isYou && <span className="text-void-muted">(you)</span>}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Timeline */}
        <Card className="p-5">
          <h3 className="text-xs font-mono font-bold text-void-muted uppercase tracking-wider mb-3">Timeline</h3>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono text-void-muted">
              <Clock className="w-3.5 h-3.5" />
              Created {formatDate(tx.createdAt)}
            </div>
            {tx.escrow?.heldAt && (
              <div className="flex items-center gap-2 text-xs font-mono text-void-cyan">
                <Shield className="w-3.5 h-3.5" />
                Funds in escrow {formatDate(tx.escrow.heldAt)}
              </div>
            )}
            {tx.completedAt && (
              <div className="flex items-center gap-2 text-xs font-mono text-void-green">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Completed {formatDate(tx.completedAt)}
              </div>
            )}
            {tx.autoRefundAt && tx.status === "IN_ESCROW" && (
              <div className="flex items-center gap-2 text-xs font-mono text-void-yellow">
                <AlertTriangle className="w-3.5 h-3.5" />
                Auto-refund if no action by {formatDate(tx.autoRefundAt)}
              </div>
            )}
          </div>
        </Card>

        {/* Actions */}
        {tx.status === "IN_ESCROW" && (
          <Card className="p-5">
            <h3 className="text-xs font-mono font-bold text-void-muted uppercase tracking-wider mb-3">Actions</h3>
            <div className="space-y-2">
              {isBuyer && (
                <>
                  <Button
                    onClick={() => handleAction("release")}
                    loading={actionLoading === "release"}
                    className="w-full font-mono gap-2"
                    variant="green"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Confirm delivery & release payment
                  </Button>
                  <Button
                    onClick={() => handleAction("refund")}
                    loading={actionLoading === "refund"}
                    variant="outline"
                    className="w-full font-mono gap-2"
                  >
                    <XCircle className="w-4 h-4" />
                    Request refund
                  </Button>
                </>
              )}
              <Button
                onClick={() => handleAction("dispute")}
                loading={actionLoading === "dispute"}
                variant="destructive"
                className="w-full font-mono gap-2"
              >
                <AlertTriangle className="w-4 h-4" />
                Open dispute
              </Button>
            </div>
          </Card>
        )}
        {/* Review — buyer can leave after completion */}
        {tx.status === "COMPLETED" && isBuyer && !(tx as any).review && (
          <ReviewForm transactionId={tx.id} onSubmit={() => {
            setTx(prev => prev ? { ...prev, review: { id: "done" } as any } : prev);
          }} />
        )}

        {(tx as any).review && (
          <Card className="p-5 border-void-green/20 bg-void-green/5">
            <div className="flex items-center gap-2 text-void-green text-sm font-mono">
              <CheckCircle2 className="w-4 h-4" />
              Review submitted — {(tx as any).review.rating}/5 stars
            </div>
            {(tx as any).review.comment && (
              <p className="text-xs text-void-muted mt-2">{(tx as any).review.comment}</p>
            )}
          </Card>
        )}
      </div>
    </div>
  );
}

function ReviewForm({ transactionId, onSubmit }: { transactionId: string; onSubmit: () => void }) {
  const { toast } = useToast();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/marketplace/transactions/${transactionId}/review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating, comment: comment || undefined }),
      });
      if (!res.ok) throw new Error("Failed");
      toast({ title: "Review submitted!" });
      onSubmit();
    } catch {
      toast({ title: "Failed to submit review", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-5">
      <h3 className="text-xs font-mono font-bold text-void-muted uppercase tracking-wider mb-3">Leave a Review</h3>
      <div className="flex gap-1 mb-3">
        {[1, 2, 3, 4, 5].map(star => (
          <button
            key={star}
            onClick={() => setRating(star)}
            className={cn("text-2xl transition-transform hover:scale-110", star <= rating ? "text-yellow-400" : "text-void-border")}
          >
            ★
          </button>
        ))}
      </div>
      <textarea
        value={comment}
        onChange={e => setComment(e.target.value)}
        placeholder="Optional comment..."
        rows={3}
        className="w-full bg-void-surface border border-void-border rounded-xl p-3 text-sm font-mono text-void-text placeholder:text-void-muted resize-none outline-none focus:ring-1 focus:ring-void-purple transition-colors mb-3"
      />
      <Button onClick={handleSubmit} loading={loading} size="sm" className="font-mono gap-1.5">
        Submit Review
      </Button>
    </Card>
  );
}
