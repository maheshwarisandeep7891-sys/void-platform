"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AlertCircle, Code2 } from "lucide-react";

const ERROR_MESSAGES: Record<string, string> = {
  Configuration: "Auth is not configured correctly. Check environment variables.",
  invalid_state: "Security check failed. Please try signing in again.",
  missing_params: "Missing OAuth parameters. Please try again.",
  no_email: "Could not get your email from GitHub. Make sure your GitHub email is public or verified.",
  OAuthCallback: "GitHub returned an error. Please try again.",
  AccessDenied: "You denied access. Please try again.",
  Default: "An error occurred during sign in. Please try again.",
};

function ErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error") ?? "Default";
  const message = ERROR_MESSAGES[error] ?? `${error} — ${ERROR_MESSAGES.Default}`;

  return (
    <div className="bg-void-card border border-red-500/20 rounded-2xl p-8">
      <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-4">
        <AlertCircle className="w-6 h-6 text-red-400" />
      </div>
      <h1 className="text-lg font-bold text-void-text font-mono mb-2 text-center">
        Sign in failed
      </h1>
      <p className="text-void-muted text-sm text-center mb-2">{message}</p>
      <p className="text-void-muted/50 text-xs text-center font-mono mb-6">
        Error code: {error}
      </p>
      <Link
        href="/auth/signin"
        className="block w-full text-center px-4 py-2.5 rounded-lg bg-void-purple text-void-bg font-mono text-sm font-bold hover:bg-void-purple/90 transition-colors"
      >
        Try again
      </Link>
    </div>
  );
}

export default function AuthErrorPage() {
  return (
    <div className="min-h-screen bg-void-bg flex items-center justify-center px-4 grid-bg">
      <div className="w-full max-w-md text-center">
        <Link href="/" className="inline-flex items-center gap-2 mb-8">
          <div className="w-8 h-8 rounded-lg bg-void-purple flex items-center justify-center">
            <Code2 className="w-4 h-4 text-void-bg" />
          </div>
          <span className="text-xl font-black tracking-tighter text-void-text font-mono">VOID</span>
        </Link>
        <Suspense fallback={<div className="h-48 bg-void-surface rounded-2xl animate-pulse" />}>
          <ErrorContent />
        </Suspense>
      </div>
    </div>
  );
}
