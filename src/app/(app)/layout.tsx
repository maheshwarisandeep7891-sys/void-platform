import React from "react";
import { Navbar } from "@/components/layout/navbar";
import { Sidebar } from "@/components/layout/sidebar";
import { MobileNav } from "@/components/layout/mobile-nav";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen mesh-bg">
      <Navbar />
      <div className="flex pt-14">
        <Sidebar />
        <main className="flex-1 lg:ml-56 min-h-[calc(100vh-3.5rem)] pb-16 md:pb-0">
          {children}
        </main>
      </div>
      <MobileNav />
    </div>
  );
}
