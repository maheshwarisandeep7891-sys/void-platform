"use client";

import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { motion } from "framer-motion";
import { GitBranch, Mail, Code2, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [loading, setLoading] = useState<string | null>(null);

  const handleGitBranch = async () => {
    setLoading("GitBranch");
    await signIn("GitBranch", { callbackUrl: "/feed" });
  };

  const handleGoogle = async () => {
    setLoading("google");
    await signIn("google", { callbackUrl: "/feed" });
  };

  const handleEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading("email");
    const result = await signIn("resend", {
      email,
      redirect: false,
      callbackUrl: "/feed",
    });
    setLoading(null);
    if (result?.ok) setEmailSent(true);
  };

  return (
    <div className="min-h-screen bg-void-bg flex items-center justify-center px-4 grid-bg">
      {/* Background orbs */}
      <div className="absolute top-1/3 left-1/3 w-64 h-64 bg-void-purple/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/3 right-1/3 w-64 h-64 bg-void-cyan/5 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-void-purple flex items-center justify-center glow-purple">
              <Code2 className="w-5 h-5 text-void-bg" />
            </div>
            <span className="text-2xl font-black tracking-tighter text-void-text font-mono">
              VOID
            </span>
          </Link>
          <p className="text-void-muted text-sm font-mono mt-3">
            The internet&apos;s home for people who actually build things.
          </p>
        </div>

        {/* Card */}
        <div className="bg-void-card border border-void-border rounded-2xl p-8 shadow-2xl shadow-black/50">
          {emailSent ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-4"
            >
              <div className="w-12 h-12 rounded-full bg-void-green/10 border border-void-green/20 flex items-center justify-center mx-auto mb-4">
                <Mail className="w-6 h-6 text-void-green" />
              </div>
              <h2 className="text-lg font-bold text-void-text font-mono mb-2">
                Check your email
              </h2>
              <p className="text-void-muted text-sm">
                We sent a magic link to{" "}
                <span className="text-void-text font-mono">{email}</span>
              </p>
              <p className="text-void-muted text-xs mt-2">
                Link expires in 10 minutes.
              </p>
              <button
                onClick={() => setEmailSent(false)}
                className="mt-4 text-xs font-mono text-void-purple hover:underline"
              >
                Use a different email
              </button>
            </motion.div>
          ) : (
            <>
              <h1 className="text-xl font-bold text-void-text font-mono mb-6">
                Sign in to VOID
              </h1>

              {/* OAuth buttons */}
              <div className="space-y-3 mb-6">
                <Button
                  onClick={handleGitBranch}
                  loading={loading === "GitBranch"}
                  className="w-full font-mono gap-2 bg-[#24292e] hover:bg-[#2f363d] text-white border border-[#444d56]"
                >
                  <GitBranch className="w-4 h-4" />
                  Continue with GitBranch
                </Button>
                <Button
                  onClick={handleGoogle}
                  loading={loading === "google"}
                  variant="outline"
                  className="w-full font-mono gap-2"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Continue with Google
                </Button>
              </div>

              {/* Divider */}
              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-void-border" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-void-card px-3 text-void-muted font-mono">
                    or continue with email
                  </span>
                </div>
              </div>

              {/* Email form */}
              <form onSubmit={handleEmail} className="space-y-3">
                <Input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full"
                />
                <Button
                  type="submit"
                  loading={loading === "email"}
                  variant="outline"
                  className="w-full font-mono gap-2"
                >
                  <Mail className="w-4 h-4" />
                  Send magic link
                </Button>
              </form>

              <p className="text-xs font-mono text-void-muted text-center mt-6">
                By signing in, you agree to our{" "}
                <Link href="/terms" className="text-void-purple hover:underline">
                  Terms
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="text-void-purple hover:underline">
                  Privacy Policy
                </Link>
                .
              </p>
            </>
          )}
        </div>

        {/* Back to home */}
        <div className="text-center mt-6">
          <Link
            href="/"
            className="text-xs font-mono text-void-muted hover:text-void-text transition-colors"
          >
            ← Back to VOID
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

