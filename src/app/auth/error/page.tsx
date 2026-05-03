"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AlertCircle, Code2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const ERROR_MESSAGES: Record<string, string> = {
  Configuration: "There is a problem with the server configuration.",
  AccessDenied: "You do not have permission to sign in.",
  Verification:
    "The sign-in link is no longer valid. It may have been used already or it may have expired.",
  Default: "An error occurred during sign in.",
};

function ErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error") ?? "Default";
  const message = ERROR_MESSAGES[error] ?? ERROR_MESSAGES.Default;

  return (
    <div className="bg-void-card border border-red-500/20 rounded-2xl p-8">
      <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-4">
        <AlertCircle className="w-6 h-6 text-red-400" />
      </div>
      <h1 className="text-lg font-bold text-void-text font-mono mb-2">
        Sign in failed
      </h1>
      <p className="text-void-muted text-sm mb-6">{message}</p>
      <Link href="/auth/signin">
        <Button className="font-mono w-full">Try again</Button>
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
          <span className="text-xl font-black tracking-tighter text-void-text font-mono">
            VOID
          </span>
        </Link>
        <Suspense
          fallback={
            <div className="bg-void-card border border-void-border rounded-2xl p-8">
              <div className="h-8 w-48 bg-void-surface rounded animate-pulse mx-auto" />
            </div>
          }
        >
          <ErrorContent />
        </Suspense>
      </div>
    </div>
  );
}
