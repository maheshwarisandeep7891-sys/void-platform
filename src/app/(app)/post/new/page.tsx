"use client";

import React, { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import {
  Terminal, Code2, Rocket, Zap, HelpCircle,
  Eye, Send, Tag, X, Moon, ArrowLeft, Image as ImageIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ImageUpload } from "@/components/ui/image-upload";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Link from "next/link";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
  loading: () => (
    <div className="h-64 bg-void-surface rounded-xl border border-void-border flex items-center justify-center">
      <div className="flex items-center gap-2 text-void-muted font-mono text-sm">
        <div className="w-4 h-4 border-2 border-void-purple border-t-transparent rounded-full animate-spin" />
        Loading editor...
      </div>
    </div>
  ),
});

type PostType = "THREAD" | "SNIPPET" | "DROP" | "BOUNTY" | "QUESTION";

const POST_TYPES = [
  { type: "THREAD" as PostType,   icon: Terminal,   label: "Thread",   desc: "Long-form writing",    color: "text-void-purple", border: "border-void-purple/40", bg: "bg-void-purple/5" },
  { type: "SNIPPET" as PostType,  icon: Code2,      label: "Snippet",  desc: "Share code",           color: "text-void-cyan",   border: "border-void-cyan/40",   bg: "bg-void-cyan/5" },
  { type: "DROP" as PostType,     icon: Rocket,     label: "Drop",     desc: "Just shipped",         color: "text-void-green",  border: "border-void-green/40",  bg: "bg-void-green/5" },
  { type: "BOUNTY" as PostType,   icon: Zap,        label: "Bounty",   desc: "Post a problem",       color: "text-yellow-400",  border: "border-yellow-500/40",  bg: "bg-yellow-500/5" },
  { type: "QUESTION" as PostType, icon: HelpCircle, label: "Question", desc: "Ask the community",    color: "text-void-muted",  border: "border-void-border",    bg: "bg-void-surface" },
];

const LANGUAGES = [
  "typescript", "javascript", "python", "rust", "go", "java", "c", "cpp",
  "csharp", "ruby", "php", "swift", "kotlin", "zig", "bash", "sql",
  "yaml", "json", "dockerfile", "terraform", "markdown",
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
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const [images, setImages] = useState<string[]>([]);

  const addTag = useCallback(() => {
    const tag = tagInput.trim().toLowerCase().replace(/[^a-z0-9-]/g, "");
    if (tag && !tags.includes(tag) && tags.length < 5) {
      setTags(prev => [...prev, tag]);
      setTagInput("");
    }
  }, [tagInput, tags]);

  const handleSubmit = async () => {
    if (!content.trim()) {
      toast({ title: "Content is required", variant: "destructive" });
      return;
    }
    if (postType === "SNIPPET" && !codeSnippet.trim()) {
      toast({ title: "Code snippet is required for Snippet posts", variant: "destructive" });
      return;
    }

    // Read dark mode session from sessionStorage
    const darkSessionId = isDarkMode
      ? (typeof window !== "undefined" ? sessionStorage.getItem("darkModeSessionId") ?? undefined : undefined)
      : undefined;

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
          darkSessionId,
          images: images.length > 0 ? images : undefined,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? "Failed to post");
      }

      const post = await res.json();
      toast({ title: "Posted!", variant: "success" });
      router.push(`/post/${post.id}`);
    } catch (err: any) {
      toast({ title: err.message ?? "Failed to post", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const selectedType = POST_TYPES.find(t => t.type === postType)!;

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Link href="/feed" className="p-2 rounded-lg text-void-muted hover:text-void-text hover:bg-void-surface transition-all">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-xl font-black font-mono text-void-text">New Post</h1>
          <p className="text-xs font-mono text-void-muted">Share something with the community</p>
        </div>
      </div>

      {/* Post type selector */}
      <div className="grid grid-cols-5 gap-2 mb-6">
        {POST_TYPES.map(({ type, icon: Icon, label, desc, color, border, bg }) => (
          <motion.button
            key={type}
            onClick={() => setPostType(type)}
            whileTap={{ scale: 0.97 }}
            className={cn(
              "flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all duration-150",
              postType === type ? `${border} ${bg}` : "border-transparent hover:border-void-border hover:bg-void-surface/50"
            )}
          >
            <Icon className={cn("w-5 h-5", color)} />
            <span className={cn("text-xs font-mono font-bold", postType === type ? color : "text-void-muted")}>{label}</span>
            <span className="text-[9px] font-mono text-void-muted hidden sm:block text-center leading-tight">{desc}</span>
          </motion.button>
        ))}
      </div>

      {/* Anonymous toggle */}
      <div className="flex items-center justify-between p-4 rounded-xl border border-void-border bg-void-surface/50 mb-5">
        <div className="flex items-center gap-3">
          <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", isDarkMode ? "bg-void-purple/20" : "bg-void-surface")}>
            <Moon className={cn("w-4 h-4", isDarkMode ? "text-void-purple" : "text-void-muted")} />
          </div>
          <div>
            <p className="text-sm font-mono font-bold text-void-text">Post anonymously</p>
            <p className="text-xs font-mono text-void-muted">🖤 Random handle, zero trace</p>
          </div>
        </div>
        <button
          onClick={() => setIsDarkMode(p => !p)}
          className={cn(
            "relative w-11 h-6 rounded-full transition-colors duration-200",
            isDarkMode ? "bg-void-purple" : "bg-void-border"
          )}
        >
          <span className={cn(
            "absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-200",
            isDarkMode ? "translate-x-5.5" : "translate-x-0.5"
          )} />
        </button>
      </div>

      {/* Editor */}
      <div className="rounded-xl border border-void-border bg-void-card overflow-hidden mb-4">
        {/* Title */}
        {(postType === "THREAD" || postType === "DROP" || postType === "BOUNTY" || postType === "QUESTION") && (
          <div className="border-b border-void-border">
            <input
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder={
                postType === "QUESTION" ? "What's your question?" :
                postType === "BOUNTY" ? "Describe the problem..." :
                "Title (optional)"
              }
              className="w-full px-5 py-4 bg-transparent text-void-text font-bold text-lg placeholder:text-void-muted/50 focus:outline-none font-mono"
              maxLength={200}
            />
          </div>
        )}

        {/* Content area */}
        <div className="relative">
          <div className="flex items-center justify-between px-5 pt-3 pb-1">
            <span className="text-xs font-mono text-void-muted">
              {preview ? "Preview" : "Write (Markdown supported)"}
            </span>
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono text-void-muted tabular-nums">{charCount} chars</span>
              <button
                onClick={() => setPreview(p => !p)}
                className="flex items-center gap-1.5 text-xs font-mono text-void-muted hover:text-void-text transition-colors"
              >
                <Eye className="w-3.5 h-3.5" />
                {preview ? "Edit" : "Preview"}
              </button>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {preview ? (
              <motion.div
                key="preview"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="min-h-[200px] px-5 pb-5 prose-void text-sm"
              >
                {content ? (
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
                ) : (
                  <p className="text-void-muted italic">Nothing to preview</p>
                )}
              </motion.div>
            ) : (
              <motion.div key="editor" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <textarea
                  value={content}
                  onChange={e => { setContent(e.target.value); setCharCount(e.target.value.length); }}
                  placeholder={
                    postType === "SNIPPET" ? "Describe what this code does..." :
                    postType === "BOUNTY" ? "Describe the problem in detail. What have you tried? What's the expected behavior?" :
                    postType === "QUESTION" ? "Provide context. What have you already tried?" :
                    "Write your post... (Markdown supported)\n\n**Bold**, *italic*, `code`, ```code blocks```"
                  }
                  className="w-full min-h-[220px] px-5 pb-5 bg-transparent text-void-text placeholder:text-void-muted/40 font-mono text-sm resize-none focus:outline-none leading-relaxed"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Code editor for SNIPPET */}
        {postType === "SNIPPET" && (
          <div className="border-t border-void-border">
            <div className="flex items-center justify-between px-5 py-2.5 bg-void-surface/50">
              <div className="flex items-center gap-2">
                <Code2 className="w-3.5 h-3.5 text-void-cyan" />
                <span className="text-xs font-mono text-void-muted">Code</span>
              </div>
              <select
                value={language}
                onChange={e => setLanguage(e.target.value)}
                className="text-xs font-mono bg-void-surface border border-void-border rounded-lg px-2 py-1 text-void-muted focus:outline-none focus:ring-1 focus:ring-void-purple"
              >
                {LANGUAGES.map(lang => (
                  <option key={lang} value={lang}>{lang}</option>
                ))}
              </select>
            </div>
            <div className="border-t border-void-border">
              <MonacoEditor
                height="280px"
                language={language}
                value={codeSnippet}
                onChange={val => setCodeSnippet(val ?? "")}
                theme="vs-dark"
                options={{
                  minimap: { enabled: false },
                  fontSize: 13,
                  fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                  lineNumbers: "on",
                  scrollBeyondLastLine: false,
                  wordWrap: "on",
                  padding: { top: 16, bottom: 16 },
                  renderLineHighlight: "line",
                  overviewRulerLanes: 0,
                  scrollbar: { vertical: "hidden" },
                  suggest: { showKeywords: true },
                }}
              />
            </div>
          </div>
        )}

        {/* Image upload */}
        {postType !== "SNIPPET" && (
          <div className="border-t border-void-border px-5 py-4">
            <div className="flex items-center gap-2 mb-3">
              <ImageIcon className="w-3.5 h-3.5 text-void-muted" />
              <span className="text-xs font-mono text-void-muted">Images ({images.length}/4)</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {images.map((url, i) => (
                <div key={i} className="relative rounded-lg overflow-hidden border border-void-border aspect-video">
                  <img src={url} alt="" className="w-full h-full object-cover" />
                  <button
                    onClick={() => setImages(prev => prev.filter((_, j) => j !== i))}
                    className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-red-500/80 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
              {images.length < 4 && (
                <ImageUpload
                  onChange={(url) => setImages(prev => [...prev, url])}
                  category="posts"
                  aspectRatio="free"
                  placeholder="Add image"
                  className="aspect-video"
                />
              )}
            </div>
          </div>
        )}

        {/* Tags */}
        <div className="border-t border-void-border px-5 py-4">
          <div className="flex items-center gap-2 mb-2">
            <Tag className="w-3.5 h-3.5 text-void-muted" />
            <span className="text-xs font-mono text-void-muted">Tags ({tags.length}/5)</span>
          </div>
          <div className="flex flex-wrap gap-1.5 mb-2">
            {tags.map(tag => (
              <Badge key={tag} variant="default" className="gap-1 text-xs">
                #{tag}
                <button onClick={() => setTags(prev => prev.filter(t => t !== tag))} className="hover:text-red-400 transition-colors">
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))}
          </div>
          {tags.length < 5 && (
            <div className="flex gap-2">
              <Input
                value={tagInput}
                onChange={e => setTagInput(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter" || e.key === ",") { e.preventDefault(); addTag(); } }}
                placeholder="Add tag (press Enter)"
                className="h-8 text-xs"
              />
              <Button size="sm" variant="outline" onClick={addTag} className="h-8 text-xs font-mono px-3">
                Add
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Submit */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => router.back()} className="font-mono">
          Cancel
        </Button>
        <div className="flex items-center gap-3">
          {isDarkMode && (
            <span className="text-xs font-mono text-void-purple flex items-center gap-1">
              🖤 Posting anonymously
            </span>
          )}
          <Button
            onClick={handleSubmit}
            loading={loading}
            className="font-mono gap-1.5 px-6"
          >
            <Send className="w-3.5 h-3.5" />
            Publish
          </Button>
        </div>
      </div>
    </div>
  );
}
