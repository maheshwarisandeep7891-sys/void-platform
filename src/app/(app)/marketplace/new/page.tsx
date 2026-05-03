"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Package,
  DollarSign,
  Tag,
  Image,
  X,
  Plus,
  Send,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

const CATEGORIES = [
  "SaaS Seats", "API Credits", "Software Licenses", "Domain Names",
  "Side Projects", "Browser Extensions", "Datasets", "CLI Tools",
  "GPU Access", "Templates", "Digital Services", "Other",
];

const LISTING_TYPES = [
  { id: "FOR_SALE", label: "For Sale", description: "One-time purchase" },
  { id: "FOR_RENT", label: "For Rent", description: "Hourly/daily/weekly/monthly" },
  { id: "FOR_BORROW", label: "For Borrow", description: "Free, with return commitment" },
  { id: "OPEN_TO_TRADE", label: "Trade", description: "Swap for something of equal value" },
];

const TECH_OPTIONS = [
  "Rust", "Go", "TypeScript", "Python", "Node.js", "React", "Next.js",
  "PostgreSQL", "Redis", "Docker", "Kubernetes", "AWS", "GCP", "Cloudflare",
  "OpenAI", "Anthropic", "CUDA", "Linux", "macOS", "Windows",
];

export default function NewListingPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    type: "FOR_SALE",
    price: "",
    hourlyRate: "",
    dailyRate: "",
    weeklyRate: "",
    monthlyRate: "",
    currency: "USD",
    techStack: [] as string[],
    tags: [] as string[],
    uptimeSLA: "",
  });
  const [tagInput, setTagInput] = useState("");

  const update = (key: string, value: any) =>
    setForm((p) => ({ ...p, [key]: value }));

  const addTag = () => {
    const tag = tagInput.trim().toLowerCase().replace(/[^a-z0-9-]/g, "");
    if (tag && !form.tags.includes(tag) && form.tags.length < 5) {
      update("tags", [...form.tags, tag]);
      setTagInput("");
    }
  };

  const toggleTech = (tech: string) => {
    update(
      "techStack",
      form.techStack.includes(tech)
        ? form.techStack.filter((t) => t !== tech)
        : [...form.techStack, tech]
    );
  };

  const handleSubmit = async () => {
    if (!form.title || !form.description || !form.category) {
      toast({ title: "Please fill in all required fields", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      const payload: any = {
        title: form.title,
        description: form.description,
        category: form.category,
        type: form.type,
        currency: form.currency,
        techStack: form.techStack,
        tags: form.tags,
      };

      if (form.type === "FOR_SALE" && form.price) {
        payload.price = parseFloat(form.price);
      }
      if (form.type === "FOR_RENT") {
        if (form.hourlyRate) payload.hourlyRate = parseFloat(form.hourlyRate);
        if (form.dailyRate) payload.dailyRate = parseFloat(form.dailyRate);
        if (form.weeklyRate) payload.weeklyRate = parseFloat(form.weeklyRate);
        if (form.monthlyRate) payload.monthlyRate = parseFloat(form.monthlyRate);
      }
      if (form.uptimeSLA) payload.uptimeSLA = parseFloat(form.uptimeSLA);

      const res = await fetch("/api/marketplace/listings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? "Failed to create listing");
      }

      const listing = await res.json();
      toast({ title: "Listing created!", variant: "success" });
      router.push(`/marketplace/${listing.id}`);
    } catch (err: any) {
      toast({ title: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-black font-mono text-void-text">New Listing</h1>
        <p className="text-sm font-mono text-void-muted">List something on the marketplace</p>
      </div>

      <div className="space-y-5">
        {/* Listing type */}
        <Card className="p-5">
          <h3 className="text-sm font-mono font-bold text-void-text mb-3">Listing Type *</h3>
          <div className="grid grid-cols-2 gap-2">
            {LISTING_TYPES.map(({ id, label, description }) => (
              <button
                key={id}
                onClick={() => update("type", id)}
                className={cn(
                  "p-3 rounded-xl border text-left transition-all",
                  form.type === id
                    ? "border-void-purple/40 bg-void-purple/5"
                    : "border-void-border hover:border-void-border/80"
                )}
              >
                <p className="text-sm font-mono font-bold text-void-text">{label}</p>
                <p className="text-xs font-mono text-void-muted mt-0.5">{description}</p>
              </button>
            ))}
          </div>
        </Card>

        {/* Basic info */}
        <Card className="p-5">
          <h3 className="text-sm font-mono font-bold text-void-text mb-4">Details *</h3>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-mono text-void-muted mb-1.5 block">Title *</label>
              <Input
                value={form.title}
                onChange={(e) => update("title", e.target.value)}
                placeholder="e.g. Unused GitHub Copilot seat (3 months)"
                maxLength={200}
              />
            </div>
            <div>
              <label className="text-xs font-mono text-void-muted mb-1.5 block">Description *</label>
              <Textarea
                value={form.description}
                onChange={(e) => update("description", e.target.value)}
                placeholder="Describe what you're listing in detail..."
                className="min-h-[120px]"
              />
            </div>
            <div>
              <label className="text-xs font-mono text-void-muted mb-1.5 block">Category *</label>
              <select
                value={form.category}
                onChange={(e) => update("category", e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-void-border bg-void-surface text-void-text font-mono text-sm focus:outline-none focus:ring-1 focus:ring-void-purple"
              >
                <option value="">Select category...</option>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>
        </Card>

        {/* Pricing */}
        {(form.type === "FOR_SALE" || form.type === "FOR_RENT") && (
          <Card className="p-5">
            <h3 className="text-sm font-mono font-bold text-void-text mb-4">Pricing</h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-mono text-void-muted mb-1.5 block">Currency</label>
                <select
                  value={form.currency}
                  onChange={(e) => update("currency", e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-void-border bg-void-surface text-void-text font-mono text-sm focus:outline-none focus:ring-1 focus:ring-void-purple"
                >
                  {["USD", "EUR", "GBP", "CAD", "AUD"].map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              {form.type === "FOR_SALE" && (
                <div>
                  <label className="text-xs font-mono text-void-muted mb-1.5 block">Price</label>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.price}
                    onChange={(e) => update("price", e.target.value)}
                    placeholder="0.00"
                  />
                </div>
              )}

              {form.type === "FOR_RENT" && (
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { key: "hourlyRate", label: "Hourly rate" },
                    { key: "dailyRate", label: "Daily rate" },
                    { key: "weeklyRate", label: "Weekly rate" },
                    { key: "monthlyRate", label: "Monthly rate" },
                  ].map(({ key, label }) => (
                    <div key={key}>
                      <label className="text-xs font-mono text-void-muted mb-1.5 block">{label}</label>
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        value={(form as any)[key]}
                        onChange={(e) => update(key, e.target.value)}
                        placeholder="0.00"
                      />
                    </div>
                  ))}
                </div>
              )}

              {form.type === "FOR_RENT" && (
                <div>
                  <label className="text-xs font-mono text-void-muted mb-1.5 block">
                    Uptime SLA % (optional)
                  </label>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    value={form.uptimeSLA}
                    onChange={(e) => update("uptimeSLA", e.target.value)}
                    placeholder="99.9"
                  />
                  <p className="text-xs font-mono text-void-muted mt-1">
                    Auto-refund if uptime drops below this during rental.
                  </p>
                </div>
              )}
            </div>
          </Card>
        )}

        {/* Tech stack */}
        <Card className="p-5">
          <h3 className="text-sm font-mono font-bold text-void-text mb-3">Tech Stack</h3>
          <div className="flex flex-wrap gap-2">
            {TECH_OPTIONS.map((tech) => (
              <button
                key={tech}
                onClick={() => toggleTech(tech)}
                className={cn(
                  "px-2.5 py-1 rounded-md text-xs font-mono transition-all",
                  form.techStack.includes(tech)
                    ? "bg-void-purple/10 text-void-purple border border-void-purple/20"
                    : "bg-void-surface text-void-muted border border-void-border hover:border-void-border/80"
                )}
              >
                {tech}
              </button>
            ))}
          </div>
        </Card>

        {/* Tags */}
        <Card className="p-5">
          <h3 className="text-sm font-mono font-bold text-void-text mb-3">
            Tags ({form.tags.length}/5)
          </h3>
          <div className="flex flex-wrap gap-1.5 mb-3">
            {form.tags.map((tag) => (
              <Badge key={tag} variant="default" className="gap-1">
                #{tag}
                <button onClick={() => update("tags", form.tags.filter((t) => t !== tag))}>
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))}
          </div>
          {form.tags.length < 5 && (
            <div className="flex gap-2">
              <Input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" || e.key === ",") { e.preventDefault(); addTag(); } }}
                placeholder="Add tag (press Enter)"
                className="text-xs h-7"
              />
              <Button size="sm" variant="outline" onClick={addTag} className="h-7 text-xs font-mono">Add</Button>
            </div>
          )}
        </Card>

        {/* Escrow notice */}
        <div className="flex items-start gap-2 p-3 rounded-xl border border-void-border bg-void-surface">
          <Info className="w-4 h-4 text-void-cyan flex-shrink-0 mt-0.5" />
          <p className="text-xs font-mono text-void-muted leading-relaxed">
            VOID uses internal escrow. Buyers pay into escrow, funds release to you when they confirm delivery.
            Platform takes 7% fee. No external payment setup required.
          </p>
        </div>

        {/* Submit */}
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={() => router.back()} className="font-mono">Cancel</Button>
          <Button onClick={handleSubmit} loading={loading} className="font-mono gap-1.5">
            <Send className="w-3.5 h-3.5" />
            Publish Listing
          </Button>
        </div>
      </div>
    </div>
  );
}
