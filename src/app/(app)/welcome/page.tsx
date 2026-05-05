"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useSession } from "@/hooks/use-session";
import {
  Code2, Terminal, Store, BookOpen, Zap, Users,
  Moon, ArrowRight, Check, Trophy,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

const TECH_OPTIONS = [
  "Rust", "Go", "TypeScript", "JavaScript", "Python", "Java", "C++",
  "Kotlin", "Swift", "Elixir", "Haskell", "WebAssembly", "Kubernetes",
  "Docker", "AWS", "GCP", "PostgreSQL", "Redis", "GraphQL", "ML/AI",
  "Zig", "Terraform", "Linux", "React", "Next.js",
];

const INTERESTS = [
  { id: "feed", icon: Terminal, label: "Share code & ideas", color: "text-void-purple" },
  { id: "marketplace", icon: Store, label: "Buy & sell tools", color: "text-void-green" },
  { id: "knowledge", icon: BookOpen, label: "Ask & answer questions", color: "text-void-cyan" },
  { id: "bounties", icon: Zap, label: "Solve bounties", color: "text-yellow-400" },
  { id: "guilds", icon: Users, label: "Join communities", color: "text-void-purple" },
  { id: "dark", icon: Moon, label: "Post anonymously", color: "text-void-muted" },
];

export default function WelcomePage() {
  const { data: session, update } = useSession();
  const router = useRouter();
  const { toast } = useToast();
  const [step, setStep] = useState(0);
  const [techStack, setTechStack] = useState<string[]>([]);
  const [interests, setInterests] = useState<string[]>([]);
  const [bio, setBio] = useState("");
  const [saving, setSaving] = useState(false);

  const toggleTech = (t: string) => setTechStack(p => p.includes(t) ? p.filter(x => x !== t) : [...p, t]);
  const toggleInterest = (i: string) => setInterests(p => p.includes(i) ? p.filter(x => x !== i) : [...p, i]);

  const handleFinish = async () => {
    setSaving(true);
    try {
      await fetch("/api/users/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ techStack, bio: bio || undefined }),
      });
      await update();
      const dest = interests[0] ? `/${interests[0]}` : "/feed";
      router.push(dest);
    } catch {
      toast({ title: "Failed to save preferences", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const steps = [
    {
      title: `Welcome to VOID, @${session?.user?.username ?? "builder"}`,
      subtitle: "The internet's home for people who actually build things.",
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: Terminal, title: "Social Feed", desc: "Share code, threads, drops", color: "text-void-purple", bg: "bg-void-purple/10 border-void-purple/20" },
              { icon: Store, title: "Marketplace", desc: "Buy & sell dev tools", color: "text-void-green", bg: "bg-void-green/10 border-void-green/20" },
              { icon: BookOpen, title: "Knowledge", desc: "Q&A done right", color: "text-void-cyan", bg: "bg-void-cyan/10 border-void-cyan/20" },
              { icon: Moon, title: "Dark Mode", desc: "Go fully anonymous", color: "text-void-purple", bg: "bg-void-purple/10 border-void-purple/20" },
            ].map(({ icon: Icon, title, desc, color, bg }) => (
              <div key={title} className={cn("p-4 rounded-xl border", bg)}>
                <Icon className={cn("w-5 h-5 mb-2", color)} />
                <p className="text-sm font-mono font-bold text-void-text">{title}</p>
                <p className="text-xs text-void-muted mt-0.5">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      title: "What's your stack?",
      subtitle: "We'll personalize your feed based on your tech.",
      content: (
        <div className="flex flex-wrap gap-2">
          {TECH_OPTIONS.map(tech => (
            <button
              key={tech}
              onClick={() => toggleTech(tech)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-mono transition-all border",
                techStack.includes(tech)
                  ? "bg-void-purple/15 text-void-purple border-void-purple/30 font-bold"
                  : "bg-void-surface text-void-muted border-void-border hover:border-void-purple/30"
              )}
            >
              {techStack.includes(tech) && <Check className="w-3 h-3 inline mr-1" />}
              {tech}
            </button>
          ))}
        </div>
      ),
    },
    {
      title: "What brings you here?",
      subtitle: "Select everything that applies.",
      content: (
        <div className="grid grid-cols-2 gap-3">
          {INTERESTS.map(({ id, icon: Icon, label, color }) => (
            <button
              key={id}
              onClick={() => toggleInterest(id)}
              className={cn(
                "flex items-center gap-3 p-4 rounded-xl border text-left transition-all",
                interests.includes(id)
                  ? "border-void-purple/40 bg-void-purple/5"
                  : "border-void-border bg-void-surface hover:border-void-border/80"
              )}
            >
              <Icon className={cn("w-5 h-5 flex-shrink-0", color)} />
              <span className="text-sm font-mono text-void-text">{label}</span>
              {interests.includes(id) && <Check className="w-4 h-4 text-void-purple ml-auto" />}
            </button>
          ))}
        </div>
      ),
    },
    {
      title: "One last thing",
      subtitle: "Tell the community who you are.",
      content: (
        <div className="space-y-4">
          <div>
            <label className="text-xs font-mono text-void-muted mb-2 block">Bio (optional)</label>
            <textarea
              value={bio}
              onChange={e => setBio(e.target.value)}
              placeholder="Building things with code. Interested in performance, distributed systems, and shipping fast."
              rows={4}
              maxLength={500}
              className="w-full bg-void-surface border border-void-border rounded-xl p-4 text-sm font-mono text-void-text placeholder:text-void-muted resize-none outline-none focus:ring-1 focus:ring-void-purple transition-colors"
            />
            <p className="text-[10px] font-mono text-void-muted mt-1 text-right">{bio.length}/500</p>
          </div>
          <div className="p-4 rounded-xl border border-void-purple/20 bg-void-purple/5">
            <div className="flex items-center gap-2 mb-2">
              <Trophy className="w-4 h-4 text-void-purple" />
              <span className="text-sm font-mono font-bold text-void-purple">Reputation starts now</span>
            </div>
            <p className="text-xs text-void-muted">
              Every post, answer, and bounty you complete earns reputation points.
              Reach LEGEND status and export your credential to your resume.
            </p>
          </div>
        </div>
      ),
    },
  ];

  const currentStep = steps[step];

  return (
    <div className="min-h-screen bg-void-bg flex items-center justify-center px-4 grid-bg">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-void-purple/5 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        key={step}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.25 }}
        className="w-full max-w-lg relative z-10"
      >
        {/* Logo */}
        <div className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 rounded-lg bg-void-purple flex items-center justify-center">
            <Code2 className="w-4 h-4 text-void-bg" />
          </div>
          <span className="text-xl font-black tracking-tighter text-void-text font-mono">VOID</span>
        </div>

        {/* Progress */}
        <div className="flex gap-1.5 mb-8">
          {steps.map((_, i) => (
            <div
              key={i}
              className={cn(
                "h-1 rounded-full flex-1 transition-all duration-300",
                i <= step ? "bg-void-purple" : "bg-void-border"
              )}
            />
          ))}
        </div>

        <h1 className="text-2xl font-black font-mono text-void-text mb-2">{currentStep.title}</h1>
        <p className="text-sm font-mono text-void-muted mb-6">{currentStep.subtitle}</p>

        <div className="mb-8">{currentStep.content}</div>

        <div className="flex items-center justify-between">
          {step > 0 ? (
            <button
              onClick={() => setStep(p => p - 1)}
              className="text-sm font-mono text-void-muted hover:text-void-text transition-colors"
            >
              ← Back
            </button>
          ) : (
            <div />
          )}

          {step < steps.length - 1 ? (
            <Button onClick={() => setStep(p => p + 1)} className="font-mono gap-1.5">
              Continue
              <ArrowRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button onClick={handleFinish} loading={saving} className="font-mono gap-1.5">
              Enter VOID
              <ArrowRight className="w-4 h-4" />
            </Button>
          )}
        </div>
      </motion.div>
    </div>
  );
}
