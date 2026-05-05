"use client";

import React, { useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, X, Image as ImageIcon, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  onRemove?: () => void;
  category?: "avatars" | "banners" | "posts" | "listings" | "attachments";
  className?: string;
  aspectRatio?: "square" | "banner" | "free";
  placeholder?: string;
}

export function ImageUpload({
  value,
  onChange,
  onRemove,
  category = "posts",
  className,
  aspectRatio = "free",
  placeholder = "Click or drag to upload image",
}: ImageUploadProps) {
  const { toast } = useToast();
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const upload = useCallback(async (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast({ title: "Only image files are allowed", variant: "destructive" });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast({ title: "Image must be under 5MB", variant: "destructive" });
      return;
    }

    setUploading(true);
    try {
      // Get presigned URL
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          filename: file.name,
          contentType: file.type,
          category,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        // If R2 not configured, use a placeholder URL for demo
        if (err.error?.includes("not configured") || res.status === 500) {
          // Fallback: use object URL for preview (won't persist)
          const objectUrl = URL.createObjectURL(file);
          onChange(objectUrl);
          toast({ title: "Image preview ready (upload service not configured)" });
          return;
        }
        throw new Error(err.error ?? "Upload failed");
      }

      const { uploadUrl, publicUrl } = await res.json();

      // Upload directly to R2
      const uploadRes = await fetch(uploadUrl, {
        method: "PUT",
        body: file,
        headers: { "Content-Type": file.type },
      });

      if (!uploadRes.ok) throw new Error("Upload to storage failed");

      onChange(publicUrl);
      toast({ title: "Image uploaded!" });
    } catch (err: any) {
      toast({ title: err.message ?? "Upload failed", variant: "destructive" });
    } finally {
      setUploading(false);
    }
  }, [category, onChange, toast]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) upload(file);
  }, [upload]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) upload(file);
    e.target.value = "";
  };

  const aspectClass = {
    square: "aspect-square",
    banner: "aspect-[3/1]",
    free: "min-h-[120px]",
  }[aspectRatio];

  return (
    <div className={cn("relative", className)}>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleChange}
        className="hidden"
      />

      {value ? (
        <div className={cn("relative rounded-xl overflow-hidden border border-void-border", aspectClass)}>
          <img
            src={value}
            alt="Upload preview"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <button
              onClick={() => inputRef.current?.click()}
              className="p-2 rounded-lg bg-void-bg/80 text-void-text hover:bg-void-bg transition-colors"
            >
              <Upload className="w-4 h-4" />
            </button>
            {onRemove && (
              <button
                onClick={onRemove}
                className="p-2 rounded-lg bg-red-500/80 text-white hover:bg-red-500 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          disabled={uploading}
          className={cn(
            "w-full rounded-xl border-2 border-dashed transition-all flex flex-col items-center justify-center gap-2 p-6",
            aspectClass,
            dragOver
              ? "border-void-purple bg-void-purple/5"
              : "border-void-border hover:border-void-purple/50 hover:bg-void-surface/50",
            uploading && "opacity-50 cursor-not-allowed"
          )}
        >
          {uploading ? (
            <Loader2 className="w-6 h-6 text-void-muted animate-spin" />
          ) : (
            <ImageIcon className="w-6 h-6 text-void-muted" />
          )}
          <span className="text-xs font-mono text-void-muted text-center">
            {uploading ? "Uploading..." : placeholder}
          </span>
          <span className="text-[10px] font-mono text-void-muted/60">
            JPG, PNG, GIF, WebP · Max 5MB
          </span>
        </button>
      )}
    </div>
  );
}
