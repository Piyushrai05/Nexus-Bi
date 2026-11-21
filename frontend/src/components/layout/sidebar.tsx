"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Database,
  BarChart3,
  TrendingUp,
  AlertTriangle,
  Share2,
  Sparkles,
  Bot,
  CheckSquare,
  Palette,
  Settings,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { useShellStore } from "@/stores/shell-store";
import { ThemeToggle } from "./theme-toggle";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  badge?: string;
  isAi?: boolean;
}

interface NavGroup {
  group: string;
  items: NavItem[];
}

const NAV_GROUPS: NavGroup[] = [
  {
    group: "OVERVIEW",
    items: [
      { label: "Landing Page", href: "/", icon: Sparkles },
      { label: "Command Center", href: "/dashboard", icon: LayoutDashboard },
    ],
  },
  {
    group: "BUSINESS",
    items: [
      { label: "Data Hub", href: "/data", icon: Database },
      { label: "Dashboard", href: "/dashboard", icon: BarChart3 },
      { label: "Forecasting", href: "/forecasting", icon: TrendingUp },
      { label: "Anomalies & Root Cause", href: "/anomalies", icon: AlertTriangle },
    ],
  },
  {
    group: "MARKETING",
    items: [
      { label: "Social Intelligence", href: "/social", icon: Share2 },
      { label: "Business ↔ Social Impact", href: "/impact", icon: Zap, badge: "Signature" },
    ],
  },
  {
    group: "AI & ACTION",
    items: [
      { label: "AI Analyst", href: "/analyst", icon: Bot, isAi: true },
      { label: "Decision Center", href: "/decisions", icon: CheckSquare },
    ],
  },
  {
    group: "DEVELOPER",
    items: [
      { label: "Design System", href: "/design", icon: Palette },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { sidebarCollapsed, toggleSidebar } = useShellStore();

  return (
    <aside
      className={cn(
        "h-screen sticky top-0 flex flex-col border-r border-border bg-surface select-none transition-all duration-250 z-30",
        sidebarCollapsed ? "w-16" : "w-60"
      )}
    >
      {/* Brand Header */}
      <div className="h-14 flex items-center px-4 border-b border-border justify-between">
        <Link href="/" className="flex items-center gap-2.5 overflow-hidden">
          <div className="w-8 h-8 rounded-lg bg-blue-600 text-white font-black flex items-center justify-center shrink-0 shadow-md shadow-blue-500/25 text-sm">
            N
          </div>
          {!sidebarCollapsed && (
            <div className="flex flex-col">
              <span className="font-bold text-sm tracking-tight text-white flex items-center gap-1.5">
                NEXUS <span className="text-blue-500">BI</span>
              </span>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider font-mono">
                Executive Platform
              </span>
            </div>
          )}
        </Link>
        <button
          onClick={toggleSidebar}
          aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="w-7 h-7 rounded-md flex items-center justify-center text-slate-400 hover:text-white hover:bg-surface-elevated transition-colors"
        >
          {sidebarCollapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto px-2 py-3 space-y-5">
        {NAV_GROUPS.map((group) => (
          <div key={group.group} className="space-y-1">
            {!sidebarCollapsed && (
              <h4 className="px-2 text-[10px] font-semibold text-slate-400 tracking-wider uppercase font-mono">
                {group.group}
              </h4>
            )}
            {group.items.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  title={sidebarCollapsed ? item.label : undefined}
                  className={cn(
                    "flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all group relative",
                    isActive
                      ? "bg-blue-600/10 text-blue-400 font-semibold shadow-xs border border-blue-500/20"
                      : "text-slate-400 hover:text-white hover:bg-surface-elevated"
                  )}
                >
                  <Icon
                    className={cn(
                      "w-4 h-4 shrink-0 transition-colors",
                      isActive
                        ? "text-blue-400"
                        : "text-slate-400 group-hover:text-white"
                    )}
                  />
                  {!sidebarCollapsed && (
                    <span className="truncate flex-1">{item.label}</span>
                  )}
                  {!sidebarCollapsed && item.badge && (
                    <span className="text-[9px] font-mono font-semibold px-1.5 py-0.5 rounded bg-blue-950/80 text-blue-300 border border-blue-800/60 tracking-wide">
                      {item.badge}
                    </span>
                  )}
                  {!sidebarCollapsed && item.isAi && (
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </div>

      {/* Footer Section */}
      <div className="p-3 border-t border-border space-y-2">
        {/* Data Trust Score Mini-Badge */}
        <Link
          href="/data-hub"
          className={cn(
            "flex items-center gap-2.5 p-2 rounded-lg bg-surface-elevated hover:bg-surface-muted transition-colors border border-border group",
            sidebarCollapsed ? "justify-center" : "justify-between"
          )}
          title="Data Trust Score: 94/100 (Optimal)"
        >
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-success shrink-0" />
            {!sidebarCollapsed && (
              <div className="flex flex-col">
                <span className="text-[11px] font-medium text-foreground leading-none">
                  Trust Score
                </span>
                <span className="text-[9px] text-muted-foreground">Governed</span>
              </div>
            )}
          </div>
          {!sidebarCollapsed && (
            <span className="text-xs font-mono font-bold text-success bg-success/10 px-1.5 py-0.5 rounded">
              94%
            </span>
          )}
        </Link>

        {/* User Profile & Theme Toggle */}
        <div
          className={cn(
            "flex items-center gap-2 pt-1",
            sidebarCollapsed ? "justify-center flex-col" : "justify-between"
          )}
        >
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-primary to-ai-accent flex items-center justify-center text-[10px] font-bold text-white uppercase">
              PB
            </div>
            {!sidebarCollapsed && (
              <div className="flex flex-col truncate">
                <span className="text-xs font-medium text-foreground truncate">
                  Piyush B.
                </span>
                <span className="text-[10px] text-muted-foreground truncate">
                  Founder Mode
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-1">
            <ThemeToggle />
            {!sidebarCollapsed && (
              <Link
                href="/settings"
                className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-surface-elevated transition-colors"
                title="Settings"
              >
                <Settings className="w-4 h-4" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}
