"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useSession } from "@/hooks/use-session";
import { BookOpen, Plus, X, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

export default function AskQuestionPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const { toast } = useToast();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
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
      toast({ title: "Sign in to ask a question", variant: "destructive" });
      return;
    }
    if (!title.trim() || !content.trim()) {
      toast({ title: "Title and content are required", variant: "destructive" });
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/knowledge/questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content, tags }),
      });
      if (!res.ok) throw new Error("Failed");
      const data = await res.json();
      toast({ title: "Question posted!" });
      router.push(`/knowledge/${data.id}`);
    } catch {
      toast({ title: "Failed to post question", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 rounded-lg bg-void-purple/10 border border-void-purple/20 flex items-center justify-center">
          <BookOpen className="w-4 h-4 text-void-purple" />
        </div>
        <div>
          <h1 className="text-xl font-black font-mono text-void-text">Ask a Question</h1>
          <p className="text-xs font-mono text-void-muted">Get help from the community</p>
        </div>
      </div>

      <div className="space-y-4">
        <Card className="p-5">
          <label className="text-xs font-mono text-void-muted mb-2 block">
            Question title <span className="text-red-400">*</span>
          </label>
          <Input
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="What's your question? Be specific."
            className="font-mono"
          />
          <p className="text-[10px] font-mono text-void-muted mt-1.5">
            {title.length}/300 characters
          </p>
        </Card>

        <Card className="p-5">
          <label className="text-xs font-mono text-void-muted mb-2 block">
            Details <span className="text-red-400">*</span>
          </label>
          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder="Describe your problem in detail. Include what you've tried, error messages, code snippets..."
            rows={10}
            className="w-full bg-void-surface border border-void-border rounded-xl p-4 text-sm font-mono text-void-text placeholder:text-void-muted resize-none outline-none focus:ring-1 focus:ring-void-purple focus:border-void-purple transition-colors"
          />
          <p className="text-[10px] font-mono text-void-muted mt-1.5">
            Markdown supported
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
            <Button
              variant="outline"
              size="sm"
              onClick={addTag}
              disabled={!tagInput.trim() || tags.length >= 5}
              className="font-mono"
            >
              <Plus className="w-3.5 h-3.5" />
            </Button>
          </div>
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {tags.map(tag => (
                <span
                  key={tag}
                  className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-void-purple/10 border border-void-purple/20 text-xs font-mono text-void-purple"
                >
                  #{tag}
                  <button
                    onClick={() => setTags(prev => prev.filter(t => t !== tag))}
                    className="hover:text-red-400 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </Card>

        <div className="flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="font-mono"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!title.trim() || !content.trim() || submitting}
            loading={submitting}
            className="font-mono gap-1.5"
          >
            <Send className="w-3.5 h-3.5" />
            Post Question
          </Button>
        </div>
      </div>
    </div>
  );
}
