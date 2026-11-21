"use client";

import React, { useState, useRef, useEffect } from "react";
import { useAuthStore } from "@/stores/auth-store";
import {
  User,
  LogOut,
  Building2,
  ShieldCheck,
  ChevronDown,
  Sparkles,
  Cloud,
  Settings,
} from "lucide-react";

export function UserMenu() {
  const { user, profile, logout, openAuthModal, initAuthListener } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const unsub = initAuthListener();
    return () => unsub();
  }, [initAuthListener]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!user) {
    return (
      <button
        onClick={() => openAuthModal("login")}
        className="h-8 px-3 rounded-lg bg-primary hover:bg-primary/90 text-white font-medium text-xs flex items-center gap-1.5 transition-colors shadow-xs"
      >
        <Sparkles className="w-3.5 h-3.5 text-ai-accent" />
        <span>Sign In</span>
      </button>
    );
  }

  const initials = profile?.displayName
    ? profile.displayName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : user.email?.slice(0, 2).toUpperCase() || "US";

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="h-8 px-2 rounded-lg bg-surface-elevated border border-border hover:border-primary/40 flex items-center gap-2 transition-colors"
      >
        {profile?.photoURL ? (
          <img
            src={profile.photoURL}
            alt={profile.displayName || "User"}
            className="w-5 h-5 rounded-full object-cover"
          />
        ) : (
          <div className="w-5 h-5 rounded-full bg-primary/20 border border-primary/40 text-primary font-bold text-[10px] flex items-center justify-center">
            {initials}
          </div>
        )}
        <span className="text-xs font-semibold text-foreground max-w-[100px] truncate hidden sm:inline">
          {profile?.displayName || user.email?.split("@")[0]}
        </span>
        <ChevronDown className="w-3 h-3 text-muted-foreground" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 rounded-xl bg-surface-elevated/95 backdrop-blur-xl border border-border shadow-xl p-2 z-50 text-xs space-y-2 animate-in fade-in slide-in-from-top-1 duration-150">
          {/* User Details */}
          <div className="p-2 border-b border-border/80 space-y-1">
            <div className="font-bold text-foreground truncate">
              {profile?.displayName || "Executive Leader"}
            </div>
            <div className="text-[11px] text-muted-foreground truncate font-mono">
              {user.email}
            </div>
            <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mt-1">
              <Cloud className="w-3 h-3" />
              <span>Firebase Cloud Auth</span>
            </div>
          </div>

          {/* Active Workspace */}
          <div className="p-2 bg-surface rounded-lg border border-border/60 space-y-1">
            <div className="flex items-center justify-between text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
              <span>Active Workspace</span>
              <span className="text-primary font-bold">Admin</span>
            </div>
            <div className="flex items-center gap-1.5 text-foreground font-semibold">
              <Building2 className="w-3.5 h-3.5 text-primary shrink-0" />
              <span className="truncate">{profile?.activeWorkspaceName}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-0.5 pt-1">
            <button
              onClick={() => {
                setIsOpen(false);
                logout();
              }}
              className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-danger hover:bg-danger/10 transition-colors text-xs font-medium"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
