"use client";

import React from "react";

// No NextAuth SessionProvider needed — we use our own session hook
export function Providers({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
