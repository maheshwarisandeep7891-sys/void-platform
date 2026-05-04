"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Code2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import Link from "next/link";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    // Email magic link not configured — show message
    setEmailSent(true);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-void-bg flex items-center justify-center px-4 grid-bg">
      <div className="absolute top-1/3 left-1/3 w-64 h-64 bg-void-purple/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/3 right-1/3 w-64 h-64 bg-void-cyan/5 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-void-purple flex items-center justify-center glow-purple">
              <Code2 className="w-5 h-5 text-void-bg" />
            </div>
            <span className="text-2xl font-black tracking-tighter text-void-text font-mono">VOID</span>
          </Link>
          <p className="text-void-muted text-sm font-mono mt-3">
            The internet&apos;s home for people who actually build things.
          </p>
        </div>

        <div className="bg-void-card border border-void-border rounded-2xl p-8 shadow-2xl shadow-black/50">
          {emailSent ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-4">
              <div className="w-12 h-12 rounded-full bg-void-green/10 border border-void-green/20 flex items-center justify-center mx-auto mb-4">
                <Mail className="w-6 h-6 text-void-green" />
              </div>
              <h2 className="text-lg font-bold text-void-text font-mono mb-2">Check your email</h2>
              <p className="text-void-muted text-sm">
                We sent a magic link to <span className="text-void-text font-mono">{email}</span>
              </p>
              <button onClick={() => setEmailSent(false)} className="mt-4 text-xs font-mono text-void-purple hover:underline">
                Use a different email
              </button>
            </motion.div>
          ) : (
            <>
              <h1 className="text-xl font-bold text-void-text font-mono mb-6">Sign in to VOID</h1>

              <div className="space-y-3 mb-6">
                {/* GitHub — direct server-side redirect, no client JS needed */}
                <a
                  href="/api/auth/signin?callbackUrl=%2Ffeed"
                  className="w-full flex items-center justify-center gap-2.5 px-4 py-2.5 rounded-lg font-mono text-sm font-medium bg-[#24292e] hover:bg-[#2f363d] text-white border border-[#444d56] transition-colors"
                >
                  <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
                  </svg>
                  Continue with GitHub
                </a>
              </div>

              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-void-border" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-void-card px-3 text-void-muted font-mono">or continue with email</span>
                </div>
              </div>

              <form onSubmit={handleEmail} className="space-y-3">
                <Input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-mono text-sm font-medium border border-void-border bg-transparent text-void-text hover:bg-void-surface transition-colors disabled:opacity-50"
                >
                  <Mail className="w-4 h-4" />
                  Send magic link
                </button>
              </form>

              <p className="text-xs font-mono text-void-muted text-center mt-6">
                By signing in, you agree to our{" "}
                <Link href="/terms" className="text-void-purple hover:underline">Terms</Link>{" "}
                and{" "}
                <Link href="/privacy" className="text-void-purple hover:underline">Privacy Policy</Link>.
              </p>
            </>
          )}
        </div>

        <div className="text-center mt-6">
          <Link href="/" className="text-xs font-mono text-void-muted hover:text-void-text transition-colors">
            ← Back to VOID
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
