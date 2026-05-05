"use client";

import React from "react";
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts";

function KeyboardShortcutsProvider() {
  useKeyboardShortcuts();
  return null;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      <KeyboardShortcutsProvider />
      {children}
    </>
  );
}
