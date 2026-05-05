"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "@/hooks/use-session";
import { motion } from "framer-motion";
import {
  User,
  Bell,
  Shield,
  CreditCard,
  Code2,
  Save,
  Upload,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { ImageUpload } from "@/components/ui/image-upload";
import { cn, getInitials } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

const TECH_STACK_OPTIONS = [
  "Rust", "Go", "TypeScript", "JavaScript", "Python", "Java", "C++", "C",
  "Kotlin", "Swift", "Ruby", "PHP", "Elixir", "Haskell", "Scala", "Zig",
  "WebAssembly", "Kubernetes", "Docker", "Terraform", "AWS", "GCP", "Azure",
  "PostgreSQL", "Redis", "MongoDB", "GraphQL", "gRPC", "Kafka", "CUDA",
];

export default function SettingsPage() {
  const { data: session, update } = useSession();
  const { toast } = useToast();
  const user = session?.user as any;

  const [profile, setProfile] = useState({
    name: "",
    bio: "",
    githubUrl: "",
    websiteUrl: "",
    twitterUrl: "",
    techStack: [] as string[],
    openToHire: false,
    openToCollaborate: false,
    openToMentor: false,
    openToTrade: false,
    image: "",
    bannerImage: "",
  });
  const [loading, setLoading] = useState(false);
  const [techInput, setTechInput] = useState("");

  useEffect(() => {
    if (!user?.id) return;
    fetch(`/api/users/${user.username}`)
      .then((r) => r.json())
      .then((data) => {
        setProfile({
          name: data.name ?? "",
          bio: data.bio ?? "",
          githubUrl: data.githubUrl ?? "",
          websiteUrl: data.websiteUrl ?? "",
          twitterUrl: data.twitterUrl ?? "",
          techStack: data.techStack ?? [],
          openToHire: data.openToHire ?? false,
          openToCollaborate: data.openToCollaborate ?? false,
          openToMentor: data.openToMentor ?? false,
          openToTrade: data.openToTrade ?? false,
          image: data.image ?? "",
          bannerImage: data.bannerImage ?? "",
        });
      })
      .catch(() => {});
  }, [user?.id, user?.username]);

  const handleSave = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/users/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });
      if (!res.ok) throw new Error("Failed to save");
      await update();
      toast({ title: "Profile updated!", variant: "success" });
    } catch {
      toast({ title: "Failed to save profile", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const toggleTech = (tech: string) => {
    setProfile((prev) => ({
      ...prev,
      techStack: prev.techStack.includes(tech)
        ? prev.techStack.filter((t) => t !== tech)
        : [...prev.techStack, tech],
    }));
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-black font-mono text-void-text">Settings</h1>
        <p className="text-sm font-mono text-void-muted">
          Manage your account and preferences
        </p>
      </div>

      <Tabs defaultValue="profile">
        <TabsList className="mb-6">
          <TabsTrigger value="profile" className="font-mono text-xs gap-1.5">
            <User className="w-3.5 h-3.5" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="notifications" className="font-mono text-xs gap-1.5">
            <Bell className="w-3.5 h-3.5" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="security" className="font-mono text-xs gap-1.5">
            <Shield className="w-3.5 h-3.5" />
            Security
          </TabsTrigger>
          <TabsTrigger value="billing" className="font-mono text-xs gap-1.5">
            <CreditCard className="w-3.5 h-3.5" />
            Billing
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <div className="space-y-6">
            {/* Avatar */}
            <Card className="p-6">
              <h3 className="text-sm font-mono font-bold text-void-text mb-4">
                Profile Picture
              </h3>
              <div className="flex items-center gap-4">
                <Avatar className="w-16 h-16">
                  <AvatarImage src={user?.image ?? ""} />
                  <AvatarFallback className="text-xl">
                    {getInitials(user?.name ?? user?.username ?? "?")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <ImageUpload
                    value={profile.image}
                    onChange={(url) => setProfile(p => ({ ...p, image: url }))}
                    category="avatars"
                    aspectRatio="square"
                    placeholder="Upload profile photo"
                    className="max-w-xs"
                  />
                </div>
              </div>
            </Card>

            {/* Banner */}
            <Card className="p-6">
              <h3 className="text-sm font-mono font-bold text-void-text mb-4">
                Banner Image
              </h3>
              <ImageUpload
                value={profile.bannerImage}
                onChange={(url) => setProfile(p => ({ ...p, bannerImage: url }))}
                onRemove={() => setProfile(p => ({ ...p, bannerImage: "" }))}
                category="banners"
                aspectRatio="banner"
                placeholder="Upload banner image"
              />
            </Card>

            {/* Basic info */}
            <Card className="p-6">
              <h3 className="text-sm font-mono font-bold text-void-text mb-4">
                Basic Information
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-mono text-void-muted mb-1.5 block">
                    Display Name
                  </label>
                  <Input
                    value={profile.name}
                    onChange={(e) =>
                      setProfile((p) => ({ ...p, name: e.target.value }))
                    }
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="text-xs font-mono text-void-muted mb-1.5 block">
                    Username
                  </label>
                  <Input
                    value={user?.username ?? ""}
                    disabled
                    className="opacity-50"
                  />
                  <p className="text-xs font-mono text-void-muted mt-1">
                    Username cannot be changed
                  </p>
                </div>
                <div>
                  <label className="text-xs font-mono text-void-muted mb-1.5 block">
                    Bio
                  </label>
                  <Textarea
                    value={profile.bio}
                    onChange={(e) =>
                      setProfile((p) => ({ ...p, bio: e.target.value }))
                    }
                    placeholder="Tell the community about yourself..."
                    className="min-h-[100px]"
                  />
                </div>
              </div>
            </Card>

            {/* Social links */}
            <Card className="p-6">
              <h3 className="text-sm font-mono font-bold text-void-text mb-4">
                Social Links
              </h3>
              <div className="space-y-3">
                {[
                  { key: "githubUrl", label: "GitHub URL", placeholder: "https://github.com/username" },
                  { key: "websiteUrl", label: "Website", placeholder: "https://yoursite.com" },
                  { key: "twitterUrl", label: "Twitter / X", placeholder: "https://twitter.com/username" },
                ].map(({ key, label, placeholder }) => (
                  <div key={key}>
                    <label className="text-xs font-mono text-void-muted mb-1.5 block">
                      {label}
                    </label>
                    <Input
                      value={(profile as any)[key]}
                      onChange={(e) =>
                        setProfile((p) => ({ ...p, [key]: e.target.value }))
                      }
                      placeholder={placeholder}
                    />
                  </div>
                ))}
              </div>
            </Card>

            {/* Tech stack */}
            <Card className="p-6">
              <h3 className="text-sm font-mono font-bold text-void-text mb-4">
                Tech Stack
              </h3>
              <div className="flex flex-wrap gap-2 mb-4">
                {TECH_STACK_OPTIONS.map((tech) => (
                  <button
                    key={tech}
                    onClick={() => toggleTech(tech)}
                    className={cn(
                      "px-2.5 py-1 rounded-md text-xs font-mono transition-all",
                      profile.techStack.includes(tech)
                        ? "bg-void-purple/10 text-void-purple border border-void-purple/20"
                        : "bg-void-surface text-void-muted border border-void-border hover:border-void-border/80"
                    )}
                  >
                    {tech}
                  </button>
                ))}
              </div>
            </Card>

            {/* Availability */}
            <Card className="p-6">
              <h3 className="text-sm font-mono font-bold text-void-text mb-4">
                Open To
              </h3>
              <div className="space-y-3">
                {[
                  { key: "openToHire", label: "Hire", description: "Open to job opportunities" },
                  { key: "openToCollaborate", label: "Collaborate", description: "Open to project collaboration" },
                  { key: "openToMentor", label: "Mentor", description: "Available to mentor others" },
                  { key: "openToTrade", label: "Trade", description: "Open to tool/service trades" },
                ].map(({ key, label, description }) => (
                  <div key={key} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-mono text-void-text">{label}</p>
                      <p className="text-xs font-mono text-void-muted">{description}</p>
                    </div>
                    <button
                      onClick={() =>
                        setProfile((p) => ({ ...p, [key]: !(p as any)[key] }))
                      }
                      className={cn(
                        "relative w-10 h-5 rounded-full transition-colors duration-200",
                        (profile as any)[key] ? "bg-void-purple" : "bg-void-border"
                      )}
                    >
                      <span
                        className={cn(
                          "absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform duration-200",
                          (profile as any)[key] ? "translate-x-5" : "translate-x-0.5"
                        )}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </Card>

            <div className="flex justify-end">
              <Button onClick={handleSave} loading={loading} className="font-mono gap-1.5">
                <Save className="w-3.5 h-3.5" />
                Save Changes
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="notifications">
          <Card className="p-6">
            <h3 className="text-sm font-mono font-bold text-void-text mb-4">
              Notification Preferences
            </h3>
            <div className="space-y-4">
              {[
                { label: "New followers", description: "When someone follows you" },
                { label: "Post reactions", description: "When someone reacts to your post" },
                { label: "Comments", description: "When someone comments on your post" },
                { label: "Mentions", description: "When someone mentions you" },
                { label: "Bounty submissions", description: "When someone submits to your bounty" },
                { label: "Transaction updates", description: "Marketplace transaction updates" },
                { label: "Reputation milestones", description: "When you level up" },
              ].map(({ label, description }) => (
                <div key={label} className="flex items-center justify-between py-2 border-b border-void-border last:border-0">
                  <div>
                    <p className="text-sm font-mono text-void-text">{label}</p>
                    <p className="text-xs font-mono text-void-muted">{description}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <label className="text-xs font-mono text-void-muted">Email</label>
                    <input type="checkbox" defaultChecked className="accent-void-purple" />
                    <label className="text-xs font-mono text-void-muted">Push</label>
                    <input type="checkbox" className="accent-void-purple" />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card className="p-6">
            <h3 className="text-sm font-mono font-bold text-void-text mb-4">
              Connected Accounts
            </h3>
            <div className="space-y-3">
              {[
                { provider: "GitHub", connected: true },
                { provider: "Google", connected: false },
              ].map(({ provider, connected }) => (
                <div key={provider} className="flex items-center justify-between p-3 rounded-lg bg-void-surface border border-void-border">
                  <span className="text-sm font-mono text-void-text">{provider}</span>
                  <Badge variant={connected ? "green" : "secondary"}>
                    {connected ? "Connected" : "Not connected"}
                  </Badge>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="billing">
          <Card className="p-6">
            <h3 className="text-sm font-mono font-bold text-void-text mb-2">
              Seller Account
            </h3>
            <p className="text-sm text-void-muted mb-4">
              Set up Stripe Connect to sell on the marketplace and receive payouts.
            </p>
            <Button asChild className="font-mono gap-1.5">
              <a href="/settings/seller">
                <CreditCard className="w-3.5 h-3.5" />
                Set up seller account
              </a>
            </Button>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

