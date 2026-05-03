"use client";

import React from "react";
import Link from "next/link";
import { Mail, Code2 } from "lucide-react";

export default function VerifyPage() {
  return (
    <div className="min-h-screen bg-void-bg flex items-center justify-center px-4 grid-bg">
      <div className="w-full max-w-md text-center">
        <Link href="/" className="inline-flex items-center gap-2 mb-8">
          <div className="w-8 h-8 rounded-lg bg-void-purple flex items-center justify-center">
            <Code2 className="w-4 h-4 text-void-bg" />
          </div>
          <span className="text-xl font-black tracking-tighter text-void-text font-mono">VOID</span>
        </Link>

        <div className="bg-void-card border border-void-border rounded-2xl p-8">
          <div className="w-12 h-12 rounded-full bg-void-green/10 border border-void-green/20 flex items-center justify-center mx-auto mb-4">
            <Mail className="w-6 h-6 text-void-green" />
          </div>
          <h1 className="text-lg font-bold text-void-text font-mono mb-2">Check your email</h1>
          <p className="text-void-muted text-sm">
            A sign-in link has been sent to your email address. Click the link to sign in.
          </p>
          <p className="text-void-muted/60 text-xs font-mono mt-3">
            Link expires in 10 minutes. Check your spam folder if you don&apos;t see it.
          </p>
        </div>
      </div>
    </div>
  );
}
