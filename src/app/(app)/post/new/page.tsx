"use client";

import React, { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import {
  Terminal,
  Code2,
  Rocket,
  Zap,
  HelpCircle,
  Eye,
  Send,
  Image,
  Tag,
  Clock,
  X,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

// Lazy load Monaco editor
const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
  loading: () => (
    <div className="h-64 bg-void-surface rounded-lg border border-void-border flex items-center justify-center">
      <span className="text-void-muted font-mono text-sm">Loading editor...</span>
    </div>
  ),
});

type PostType = "THREAD" | "SNIPPET" | "DROP" | "BOUNTY" | "QUESTION";

const POST_TYPES: {
  type: PostType;
  label: string;
  icon: React.ElementType;
  description: string;
  color: string;
}[] = [
  {
    type: "THREAD",
    label: "Thread",
    icon: Terminal,
    description: "Long-form technical writing",
    color: "text-void-purple",
  },
  {
    type: "SNIPPET",
    label: "Snippet",
    icon: Code2,
    description: "Share a piece of code",
    color: "text-void-cyan",
  },
  {
    type: "DROP",
    label: "Drop",
    icon: Rocket,
    description: "Just launched something",
    color: "text-void-green",
  },
  {
    type: "BOUNTY",
    label: "Bounty",
    icon: Zap,
    description: "Post a problem + reward",
    color: "text-void-yellow",
  },
  {
    type: "QUESTION",
    label: "Question",
    icon: HelpCircle,
    description: "Ask the community",
    color: "text-void-muted",
  },
];

const LANGUAGES = [
  "typescript", "javascript", "python", "rust", "go", "java", "c", "cpp",
  "csharp", "ruby", "php", "swift", "kotlin", "scala", "haskell", "elixir",
  "bash", "sql", "yaml", "json", "dockerfile", "terraform", "markdown",
];

export default function NewPostPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [postType, setPostType] = useState<PostType>("THREAD");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [codeSnippet, setCodeSnippet] = useState("");
  const [language, setLanguage] = useState("typescript");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [preview, setPreview] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const addTag = useCallback(() => {
    const tag = tagInput.trim().toLowerCase().replace(/[^a-z0-9-]/g, "");
    if (tag && !tags.includes(tag) && tags.length < 5) {
      setTags((prev) => [...prev, tag]);
      setTagInput("");
    }
  }, [tagInput, tags]);

  const removeTag = (tag: string) => {
    setTags((prev) => prev.filter((t) => t !== tag));
  };

  const handleSubmit = async () => {
    if (!content.trim()) {
      toast({ title: "Content is required", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: postType,
          title: title || undefined,
          content,
          codeSnippet: postType === "SNIPPET" ? codeSnippet : undefined,
          language: postType === "SNIPPET" ? language : undefined,
          tags,
          isDarkMode,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? "Failed to post");
      }

      const post = await res.json();
      toast({ title: "Posted successfully!", variant: "success" });
      router.push(`/post/${post.id}`);
    } catch (err: any) {
      toast({ title: err.message ?? "Failed to post", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-black font-mono text-void-text">
          New Post
        </h1>
        <p className="text-sm font-mono text-void-muted">
          Share something with the community
        </p>
      </div>

      {/* Post type selector */}
      <div className="grid grid-cols-5 gap-2 mb-6">
        {POST_TYPES.map(({ type, label, icon: Icon, description, color }) => (
          <button
            key={type}
            onClick={() => setPostType(type)}
            className={cn(
              "flex flex-col items-center gap-1.5 p-3 rounded-xl border transition-all duration-150",
              postType === type
                ? "bg-void-surface border-void-border shadow-sm"
                : "border-transparent hover:border-void-border hover:bg-void-surface/50"
            )}
          >
            <Icon className={cn("w-5 h-5", color)} />
            <span className="text-xs font-mono text-void-text">{label}</span>
          </button>
        ))}
      </div>

      {/* Dark mode toggle */}
      <div className="flex items-center gap-3 mb-6 p-3 rounded-xl border border-void-border bg-void-surface">
        <div className="flex-1">
          <p className="text-sm font-mono text-void-text">Post anonymously</p>
          <p className="text-xs font-mono text-void-muted">
            🖤 Your identity will be hidden. A random handle will be assigned.
          </p>
        </div>
        <button
          onClick={() => setIsDarkMode((p) => !p)}
          className={cn(
            "relative w-10 h-5 rounded-full transition-colors duration-200",
            isDarkMode ? "bg-void-purple" : "bg-void-border"
          )}
        >
          <span
            className={cn(
              "absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform duration-200",
              isDarkMode ? "translate-x-5" : "translate-x-0.5"
            )}
          />
        </button>
      </div>

      {/* Editor */}
      <Card className="p-6 mb-4">
        {/* Title (optional for some types) */}
        {(postType === "THREAD" ||
          postType === "DROP" ||
          postType === "BOUNTY" ||
          postType === "QUESTION") && (
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={
              postType === "QUESTION"
                ? "What's your question?"
                : postType === "BOUNTY"
                ? "Describe the problem..."
                : "Title (optional)"
            }
            className="mb-4 text-base font-bold border-0 border-b border-void-border rounded-none px-0 focus-visible:ring-0 bg-transparent"
          />
        )}

        {/* Content editor */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono text-void-muted">
              {preview ? "Preview" : "Write (Markdown supported)"}
            </span>
            <button
              onClick={() => setPreview((p) => !p)}
              className="flex items-center gap-1.5 text-xs font-mono text-void-muted hover:text-void-text transition-colors"
            >
              <Eye className="w-3.5 h-3.5" />
              {preview ? "Edit" : "Preview"}
            </button>
          </div>

          {preview ? (
            <div className="min-h-[200px] prose-void text-sm">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {content || "*Nothing to preview*"}
              </ReactMarkdown>
            </div>
          ) : (
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={
                postType === "SNIPPET"
                  ? "Describe what this snippet does..."
                  : postType === "BOUNTY"
                  ? "Describe the problem in detail. What have you tried? What's the expected behavior?"
                  : "Write your post... (Markdown supported)"
              }
              className="min-h-[200px] resize-none border-0 focus-visible:ring-0 bg-transparent px-0 text-sm"
            />
          )}
        </div>

        {/* Code snippet editor for SNIPPET type */}
        {postType === "SNIPPET" && (
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono text-void-muted">Code</span>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="text-xs font-mono bg-void-surface border border-void-border rounded-md px-2 py-1 text-void-muted focus:outline-none focus:ring-1 focus:ring-void-purple"
              >
                {LANGUAGES.map((lang) => (
                  <option key={lang} value={lang}>
                    {lang}
                  </option>
                ))}
              </select>
            </div>
            <div className="rounded-lg overflow-hidden border border-void-border">
              <MonacoEditor
                height="300px"
                language={language}
                value={codeSnippet}
                onChange={(val) => setCodeSnippet(val ?? "")}
                theme="vs-dark"
                options={{
                  minimap: { enabled: false },
                  fontSize: 13,
                  fontFamily: "'JetBrains Mono', monospace",
                  lineNumbers: "on",
                  scrollBeyondLastLine: false,
                  wordWrap: "on",
                  padding: { top: 12, bottom: 12 },
                  renderLineHighlight: "none",
                  overviewRulerLanes: 0,
                }}
              />
            </div>
          </div>
        )}

        {/* Tags */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Tag className="w-3.5 h-3.5 text-void-muted" />
            <span className="text-xs font-mono text-void-muted">
              Tags ({tags.length}/5)
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5 mb-2">
            {tags.map((tag) => (
              <Badge key={tag} variant="default" className="gap-1">
                #{tag}
                <button
                  onClick={() => removeTag(tag)}
                  className="hover:text-red-400 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))}
          </div>
          {tags.length < 5 && (
            <div className="flex gap-2">
              <Input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === ",") {
                    e.preventDefault();
                    addTag();
                  }
                }}
                placeholder="Add tag (press Enter)"
                className="text-xs h-7"
              />
              <Button
                size="sm"
                variant="outline"
                onClick={addTag}
                className="h-7 text-xs font-mono"
              >
                Add
              </Button>
            </div>
          )}
        </div>
      </Card>

      {/* Submit */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="font-mono"
        >
          Cancel
        </Button>
        <div className="flex items-center gap-2">
          {isDarkMode && (
            <span className="text-xs font-mono text-void-purple">
              🖤 Posting anonymously
            </span>
          )}
          <Button
            onClick={handleSubmit}
            loading={loading}
            className="font-mono gap-1.5"
          >
            <Send className="w-3.5 h-3.5" />
            Publish
          </Button>
        </div>
      </div>
    </div>
  );
}
