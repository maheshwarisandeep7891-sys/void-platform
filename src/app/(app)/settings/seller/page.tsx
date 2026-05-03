"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import {
  Store,
  CheckCircle2,
  DollarSign,
  Package,
  TrendingUp,
  Clock,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn, formatCurrency, formatDate } from "@/lib/utils";

interface SellerStats {
  totalSales: number;
  totalRevenue: number;
  activeListings: number;
  pendingPayouts: number;
  transactions: Array<{
    id: string;
    amount: number;
    sellerPayout: number;
    status: string;
    createdAt: string;
    listing: { title: string };
    buyer: { username: string };
  }>;
}

export default function SellerDashboardPage() {
  const { data: session } = useSession();
  const [stats, setStats] = useState<SellerStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/marketplace/seller/stats")
      .then((r) => r.json())
      .then(setStats)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-black font-mono text-void-text">
          Seller Dashboard
        </h1>
        <p className="text-sm font-mono text-void-muted">
          Manage your listings and track earnings
        </p>
      </div>

      {/* How it works */}
      <Card className="p-5 mb-6 border-void-green/20 bg-void-green/5">
        <div className="flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-void-green flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-sm font-mono font-bold text-void-text mb-1">
              VOID Internal Escrow System
            </h3>
            <p className="text-xs font-mono text-void-muted leading-relaxed">
              No external payment processor needed. VOID holds funds in escrow
              until the buyer confirms delivery. Platform takes 7% fee.
              Payouts are tracked internally and settled weekly.
            </p>
          </div>
        </div>
      </Card>

      {/* Stats */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-24 bg-void-surface rounded-xl animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            {
              label: "Total Sales",
              value: stats?.totalSales ?? 0,
              icon: Package,
              color: "text-void-purple",
            },
            {
              label: "Total Revenue",
              value: formatCurrency(stats?.totalRevenue ?? 0),
              icon: DollarSign,
              color: "text-void-green",
            },
            {
              label: "Active Listings",
              value: stats?.activeListings ?? 0,
              icon: Store,
              color: "text-void-cyan",
            },
            {
              label: "Pending Payout",
              value: formatCurrency(stats?.pendingPayouts ?? 0),
              icon: Clock,
              color: "text-void-yellow",
            },
          ].map(({ label, value, icon: Icon, color }) => (
            <Card key={label} className="p-4">
              <Icon className={cn("w-5 h-5 mb-2", color)} />
              <div className="text-xl font-black font-mono text-void-text tabular-nums">
                {value}
              </div>
              <div className="text-xs font-mono text-void-muted mt-0.5">{label}</div>
            </Card>
          ))}
        </div>
      )}

      {/* Recent transactions */}
      <Card className="p-5">
        <h3 className="text-sm font-mono font-bold text-void-text mb-4">
          Recent Transactions
        </h3>
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-12 bg-void-surface rounded-lg animate-pulse" />
            ))}
          </div>
        ) : !stats?.transactions?.length ? (
          <div className="text-center py-8">
            <TrendingUp className="w-8 h-8 text-void-muted mx-auto mb-2" />
            <p className="text-void-muted font-mono text-sm">No transactions yet.</p>
            <p className="text-void-muted/60 font-mono text-xs mt-1">
              List something on the marketplace to start selling.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {stats.transactions.map((tx) => (
              <div
                key={tx.id}
                className="flex items-center justify-between p-3 rounded-lg bg-void-surface border border-void-border"
              >
                <div>
                  <p className="text-sm font-mono text-void-text">
                    {tx.listing.title}
                  </p>
                  <p className="text-xs font-mono text-void-muted">
                    @{tx.buyer.username} · {formatDate(tx.createdAt)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-mono font-bold text-void-green tabular-nums">
                    +{formatCurrency(tx.sellerPayout)}
                  </p>
                  <Badge
                    variant={
                      tx.status === "COMPLETED"
                        ? "green"
                        : tx.status === "IN_ESCROW"
                        ? "cyan"
                        : tx.status === "DISPUTED"
                        ? "red"
                        : "secondary"
                    }
                    className="text-[10px]"
                  >
                    {tx.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
