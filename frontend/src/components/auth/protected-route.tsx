"use client";

import React from "react";
import { useAuthStore } from "@/stores/auth-store";
import { Sparkles, Lock, ArrowRight } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  fallbackToDemo?: boolean;
}

export function ProtectedRoute({ children, fallbackToDemo = true }: ProtectedRouteProps) {
  const { user, isLoading, openAuthModal } = useAuthStore();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[300px] text-xs text-muted-foreground">
        <span>Authenticating with Firebase Cloud...</span>
      </div>
    );
  }

  // If user is logged in, render workspace directly
  if (user) {
    return <>{children}</>;
  }

  // If fallbackToDemo is true, render the child (e.g. seeded NexusMart demo) with a subtle cloud connection banner
  if (fallbackToDemo) {
    return (
      <div className="space-y-4">
        <div className="p-3 rounded-xl bg-surface-elevated border border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Lock className="w-4 h-4 text-primary" />
            <span>
              Viewing <strong>Seeded NexusMart Demo</strong>. Sign in with Google or Email to unlock private persistent cloud storage & custom datasets.
            </span>
          </div>
          <button
            onClick={() => openAuthModal("login")}
            className="px-3 py-1.5 rounded-lg bg-primary hover:bg-primary/90 text-white font-semibold text-xs shrink-0 flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-ai-accent" />
            <span>Connect Cloud Account</span>
          </button>
        </div>
        {children}
      </div>
    );
  }

  // Blocking view
  return (
    <div className="min-h-[450px] flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-surface-elevated border border-border rounded-2xl p-8 text-center space-y-4 shadow-xl">
        <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 text-primary mx-auto flex items-center justify-center">
          <Lock className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-foreground">Cloud Authentication Required</h2>
        <p className="text-xs text-muted-foreground leading-relaxed">
          This area contains private enterprise telemetry and requires a verified Firebase Cloud session.
        </p>
        <button
          onClick={() => openAuthModal("login")}
          className="w-full h-10 rounded-lg bg-primary hover:bg-primary/90 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-xs"
        >
          <span>Sign In / Register</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
