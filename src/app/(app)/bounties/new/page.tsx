"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/hooks/use-session";
import { Zap, Plus, X, Send, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

export default function NewBountyPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const { toast } = useToast();
  const [form, setForm] = useState({
    title: "",
    description: "",
    reward: "",
    currency: "USD",
    expiresAt: "",
  });
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const addTag = () => {
    const t = tagInput.trim().toLowerCase();
    if (t && !tags.includes(t) && tags.length < 5) {
      setTags(prev => [...prev, t]);
      setTagInput("");
    }
  };

  const handleSubmit = async () => {
    if (!session) {
      toast({ title: "Sign in to post a bounty", variant: "destructive" });
      return;
    }
    if (!form.title.trim() || !form.description.trim() || !form.reward) {
      toast({ title: "Title, description, and reward are required", variant: "destructive" });
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/bounties", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title,
          description: form.description,
          reward: parseFloat(form.reward),
          currency: form.currency,
          tags,
          expiresAt: form.expiresAt || undefined,
        }),
      });
      if (!res.ok) throw new Error("Failed");
      const data = await res.json();
      toast({ title: "Bounty posted!" });
      router.push(`/bounties/${data.id}`);
    } catch {
      toast({ title: "Failed to post bounty", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 rounded-lg bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center">
          <Zap className="w-4 h-4 text-yellow-500" />
        </div>
        <div>
          <h1 className="text-xl font-black font-mono text-void-text">Post a Bounty</h1>
          <p className="text-xs font-mono text-void-muted">Offer a reward for solving your problem</p>
        </div>
      </div>

      <div className="space-y-4">
        <Card className="p-5">
          <label className="text-xs font-mono text-void-muted mb-2 block">
            Title <span className="text-red-400">*</span>
          </label>
          <Input
            value={form.title}
            onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
            placeholder="What do you need solved?"
            className="font-mono"
          />
        </Card>

        <Card className="p-5">
          <label className="text-xs font-mono text-void-muted mb-2 block">
            Description <span className="text-red-400">*</span>
          </label>
          <textarea
            value={form.description}
            onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
            placeholder="Describe the problem in detail. Include requirements, acceptance criteria, and any relevant context..."
            rows={8}
            className="w-full bg-void-surface border border-void-border rounded-xl p-4 text-sm font-mono text-void-text placeholder:text-void-muted resize-none outline-none focus:ring-1 focus:ring-void-purple focus:border-void-purple transition-colors"
          />
          <p className="text-[10px] font-mono text-void-muted mt-1.5">Markdown supported</p>
        </Card>

        <Card className="p-5">
          <label className="text-xs font-mono text-void-muted mb-2 block">
            Reward <span className="text-red-400">*</span>
          </label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-void-muted" />
              <Input
                type="number"
                min="1"
                value={form.reward}
                onChange={e => setForm(p => ({ ...p, reward: e.target.value }))}
                placeholder="0"
                className="pl-9 font-mono"
              />
            </div>
            <select
              value={form.currency}
              onChange={e => setForm(p => ({ ...p, currency: e.target.value }))}
              className="px-3 py-2 rounded-xl border border-void-border bg-void-surface text-void-text font-mono text-sm outline-none focus:ring-1 focus:ring-void-purple"
            >
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="GBP">GBP</option>
            </select>
          </div>
          <p className="text-[10px] font-mono text-void-muted mt-1.5">
            Reward is held in escrow until you accept a submission
          </p>
        </Card>

        <Card className="p-5">
          <label className="text-xs font-mono text-void-muted mb-2 block">
            Tags (up to 5)
          </label>
          <div className="flex gap-2 mb-3">
            <Input
              value={tagInput}
              onChange={e => setTagInput(e.target.value)}
              onKeyDown={e => {
                if (e.key === "Enter" || e.key === ",") {
                  e.preventDefault();
                  addTag();
                }
              }}
              placeholder="Add a tag..."
              className="font-mono flex-1"
              disabled={tags.length >= 5}
            />
            <Button variant="outline" size="sm" onClick={addTag} disabled={!tagInput.trim() || tags.length >= 5} className="font-mono">
              <Plus className="w-3.5 h-3.5" />
            </Button>
          </div>
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {tags.map(tag => (
                <span key={tag} className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-xs font-mono text-yellow-500">
                  #{tag}
                  <button onClick={() => setTags(prev => prev.filter(t => t !== tag))} className="hover:text-red-400 transition-colors">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </Card>

        <Card className="p-5">
          <label className="text-xs font-mono text-void-muted mb-2 block">
            Expiry date (optional)
          </label>
          <Input
            type="datetime-local"
            value={form.expiresAt}
            onChange={e => setForm(p => ({ ...p, expiresAt: e.target.value }))}
            className="font-mono"
          />
        </Card>

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => router.back()} className="font-mono">
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!form.title.trim() || !form.description.trim() || !form.reward || submitting}
            loading={submitting}
            className="font-mono gap-1.5"
          >
            <Zap className="w-3.5 h-3.5" />
            Post Bounty
          </Button>
        </div>
      </div>
    </div>
  );
}
