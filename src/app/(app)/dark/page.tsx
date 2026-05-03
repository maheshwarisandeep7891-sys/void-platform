"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Moon, Shield, Eye, EyeOff, ArrowRight, Terminal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export default function DarkModePage() {
  const { data: session } = useSession();
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [handle, setHandle] = useState<string | null>(null);

  const enableDarkMode = async () => {
    if (!session) {
      router.push("/auth/signin");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/dark-mode", { method: "POST" });
      if (!res.ok) throw new Error("Failed");
      const data = await res.json();
      setHandle(data.handle);
      // Store in sessionStorage (not localStorage — cleared on tab close)
      sessionStorage.setItem("darkModeSessionId", data.sessionId);
      sessionStorage.setItem("darkHandle", data.handle);
      toast({ title: `🖤 Dark mode enabled — you are ${data.handle}`, variant: "success" });
    } catch {
      toast({ title: "Failed to enable dark mode", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <div className="w-16 h-16 rounded-2xl bg-void-purple/10 border border-void-purple/20 flex items-center justify-center mx-auto mb-6">
          <Moon className="w-8 h-8 text-void-purple" />
        </div>
        <h1 className="text-4xl font-black font-mono text-void-text mb-3">
          🖤 Dark Mode
        </h1>
        <p className="text-void-muted text-lg">
          Go completely anonymous. One click.
        </p>
      </motion.div>

      {handle ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-2xl border border-void-purple/30 bg-void-purple/5 p-8 text-center"
        >
          <div className="text-5xl mb-4">🖤</div>
          <h2 className="text-2xl font-black font-mono text-void-purple mb-2">
            {handle}
          </h2>
          <p className="text-void-muted mb-6">
            You are now completely anonymous. Your real identity is hidden.
          </p>
          <div className="flex gap-3 justify-center">
            <Button onClick={() => router.push("/feed")} className="font-mono gap-1.5">
              <Terminal className="w-4 h-4" />
              Browse feed anonymously
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push("/post/new")}
              className="font-mono gap-1.5"
            >
              Post anonymously
            </Button>
          </div>
        </motion.div>
      ) : (
        <div className="space-y-6">
          {/* Features */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              {
                icon: EyeOff,
                title: "Zero identity",
                description: "Random handle every session. No link to your real account. Ever.",
              },
              {
                icon: Shield,
                title: "Cryptographically isolated",
                description: "Platform stores no connection between your real account and dark mode sessions.",
              },
              {
                icon: Moon,
                title: "Ask anything",
                description: "Ask beginner questions. Post controversial opinions. No reputation damage.",
              },
              {
                icon: Terminal,
                title: "Full platform access",
                description: "Browse, post, ask questions, submit bounties — all anonymously.",
              },
            ].map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="p-4 rounded-xl border border-void-border bg-void-card"
              >
                <Icon className="w-5 h-5 text-void-purple mb-2" />
                <h3 className="text-sm font-mono font-bold text-void-text mb-1">{title}</h3>
                <p className="text-xs text-void-muted">{description}</p>
              </div>
            ))}
          </div>

          {/* Important note */}
          <div className="p-4 rounded-xl border border-void-border bg-void-surface">
            <p className="text-xs font-mono text-void-muted">
              <span className="text-void-text font-bold">Note:</span> Dark Mode is a privacy feature, not the dark web. 
              All content is still subject to community guidelines. 
              Posts are labeled with 🖤 so the community knows they&apos;re anonymous.
            </p>
          </div>

          <Button
            onClick={enableDarkMode}
            loading={loading}
            size="lg"
            className="w-full font-mono gap-2 text-base"
          >
            <Moon className="w-5 h-5" />
            Enable Dark Mode
            <ArrowRight className="w-4 h-4 ml-auto" />
          </Button>

          <p className="text-center text-xs font-mono text-void-muted">
            Keyboard shortcut: <kbd className="bg-void-surface border border-void-border px-1.5 py-0.5 rounded text-void-text">⌘⇧D</kbd>
          </p>
        </div>
      )}
    </div>
  );
}
