"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/hooks/use-session";
import { Rocket, Calendar, Users, Link as LinkIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

export default function NewHackathonPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const { toast } = useToast();
  const [form, setForm] = useState({
    name: "",
    description: "",
    startAt: "",
    endAt: "",
    repoUrl: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!session) {
      toast({ title: "Sign in to create a hackathon room", variant: "destructive" });
      return;
    }
    if (!form.name || !form.startAt || !form.endAt) {
      toast({ title: "Name, start and end time are required", variant: "destructive" });
      return;
    }
    if (new Date(form.endAt) <= new Date(form.startAt)) {
      toast({ title: "End time must be after start time", variant: "destructive" });
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/hackathons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          description: form.description || undefined,
          startAt: new Date(form.startAt).toISOString(),
          endAt: new Date(form.endAt).toISOString(),
          repoUrl: form.repoUrl || undefined,
        }),
      });
      if (!res.ok) throw new Error("Failed");
      const data = await res.json();
      toast({ title: "Hackathon room created!" });
      router.push(`/hackathons/${data.id}`);
    } catch {
      toast({ title: "Failed to create room", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 rounded-lg bg-void-green/10 border border-void-green/20 flex items-center justify-center">
          <Rocket className="w-4 h-4 text-void-green" />
        </div>
        <div>
          <h1 className="text-xl font-black font-mono text-void-text">Create Hackathon Room</h1>
          <p className="text-xs font-mono text-void-muted">48-72 hour team workspace</p>
        </div>
      </div>

      <div className="space-y-4">
        <Card className="p-5">
          <label className="text-xs font-mono text-void-muted mb-2 block">Room Name <span className="text-red-400">*</span></label>
          <Input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="e.g. Build a CLI tool in 48h" className="font-mono" />
        </Card>

        <Card className="p-5">
          <label className="text-xs font-mono text-void-muted mb-2 block">Description</label>
          <textarea
            value={form.description}
            onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
            placeholder="What are you building? What's the goal?"
            rows={4}
            className="w-full bg-void-surface border border-void-border rounded-xl p-4 text-sm font-mono text-void-text placeholder:text-void-muted resize-none outline-none focus:ring-1 focus:ring-void-purple focus:border-void-purple transition-colors"
          />
        </Card>

        <Card className="p-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-mono text-void-muted mb-2 block flex items-center gap-1">
                <Calendar className="w-3 h-3" /> Start Time <span className="text-red-400">*</span>
              </label>
              <Input type="datetime-local" value={form.startAt} onChange={e => setForm(p => ({ ...p, startAt: e.target.value }))} className="font-mono" />
            </div>
            <div>
              <label className="text-xs font-mono text-void-muted mb-2 block flex items-center gap-1">
                <Calendar className="w-3 h-3" /> End Time <span className="text-red-400">*</span>
              </label>
              <Input type="datetime-local" value={form.endAt} onChange={e => setForm(p => ({ ...p, endAt: e.target.value }))} className="font-mono" />
            </div>
          </div>
        </Card>

        <Card className="p-5">
          <label className="text-xs font-mono text-void-muted mb-2 block flex items-center gap-1">
            <LinkIcon className="w-3 h-3" /> Repository URL (optional)
          </label>
          <Input value={form.repoUrl} onChange={e => setForm(p => ({ ...p, repoUrl: e.target.value }))} placeholder="https://github.com/..." className="font-mono" />
        </Card>

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => router.back()} className="font-mono">Cancel</Button>
          <Button onClick={handleSubmit} disabled={!form.name || !form.startAt || !form.endAt || submitting} loading={submitting} className="font-mono gap-1.5">
            <Rocket className="w-3.5 h-3.5" />
            Create Room
          </Button>
        </div>
      </div>
    </div>
  );
}
