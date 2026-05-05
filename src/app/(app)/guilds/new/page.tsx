"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/hooks/use-session";
import { Users, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

const TECH_OPTIONS = [
  "Rust", "Go", "TypeScript", "JavaScript", "Python", "Java", "C++",
  "Kotlin", "Swift", "Elixir", "Haskell", "WebAssembly", "Kubernetes",
  "Docker", "AWS", "GCP", "PostgreSQL", "Redis", "GraphQL", "ML/AI",
];

export default function NewGuildPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const { toast } = useToast();
  const [form, setForm] = useState({
    name: "",
    description: "",
    visibility: "PUBLIC" as "PUBLIC" | "PRIVATE" | "INVITE_ONLY",
  });
  const [techStack, setTechStack] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const toggleTech = (tech: string) => {
    setTechStack(prev =>
      prev.includes(tech) ? prev.filter(t => t !== tech) : [...prev, tech]
    );
  };

  const handleSubmit = async () => {
    if (!session) {
      toast({ title: "Sign in to create a guild", variant: "destructive" });
      return;
    }
    if (!form.name.trim()) {
      toast({ title: "Guild name is required", variant: "destructive" });
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/guilds", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, techStack }),
      });
      if (!res.ok) throw new Error("Failed");
      const data = await res.json();
      toast({ title: `Guild "${data.name}" created!` });
      router.push(`/guilds/${data.slug}`);
    } catch {
      toast({ title: "Failed to create guild", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 rounded-lg bg-void-purple/10 border border-void-purple/20 flex items-center justify-center">
          <Users className="w-4 h-4 text-void-purple" />
        </div>
        <div>
          <h1 className="text-xl font-black font-mono text-void-text">Create a Guild</h1>
          <p className="text-xs font-mono text-void-muted">Build a community around your tech stack</p>
        </div>
      </div>

      <div className="space-y-4">
        <Card className="p-5">
          <label className="text-xs font-mono text-void-muted mb-2 block">
            Guild Name <span className="text-red-400">*</span>
          </label>
          <Input
            value={form.name}
            onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
            placeholder="e.g. Rust Builders, TypeScript Wizards"
            className="font-mono"
            maxLength={50}
          />
        </Card>

        <Card className="p-5">
          <label className="text-xs font-mono text-void-muted mb-2 block">Description</label>
          <textarea
            value={form.description}
            onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
            placeholder="What is this guild about? Who should join?"
            rows={4}
            className="w-full bg-void-surface border border-void-border rounded-xl p-4 text-sm font-mono text-void-text placeholder:text-void-muted resize-none outline-none focus:ring-1 focus:ring-void-purple focus:border-void-purple transition-colors"
            maxLength={500}
          />
        </Card>

        <Card className="p-5">
          <label className="text-xs font-mono text-void-muted mb-3 block">Visibility</label>
          <div className="grid grid-cols-3 gap-2">
            {(["PUBLIC", "PRIVATE", "INVITE_ONLY"] as const).map(v => (
              <button
                key={v}
                onClick={() => setForm(p => ({ ...p, visibility: v }))}
                className={cn(
                  "p-3 rounded-xl border text-xs font-mono transition-all text-center",
                  form.visibility === v
                    ? "bg-void-purple/10 border-void-purple/30 text-void-purple"
                    : "bg-void-surface border-void-border text-void-muted hover:border-void-border/80"
                )}
              >
                {v.replace("_", " ")}
              </button>
            ))}
          </div>
        </Card>

        <Card className="p-5">
          <label className="text-xs font-mono text-void-muted mb-3 block">Tech Stack</label>
          <div className="flex flex-wrap gap-2">
            {TECH_OPTIONS.map(tech => (
              <button
                key={tech}
                onClick={() => toggleTech(tech)}
                className={cn(
                  "px-2.5 py-1 rounded-md text-xs font-mono transition-all",
                  techStack.includes(tech)
                    ? "bg-void-purple/10 text-void-purple border border-void-purple/20"
                    : "bg-void-surface text-void-muted border border-void-border hover:border-void-border/80"
                )}
              >
                {tech}
              </button>
            ))}
          </div>
        </Card>

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => router.back()} className="font-mono">
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!form.name.trim() || submitting}
            loading={submitting}
            className="font-mono gap-1.5"
          >
            <Users className="w-3.5 h-3.5" />
            Create Guild
          </Button>
        </div>
      </div>
    </div>
  );
}
