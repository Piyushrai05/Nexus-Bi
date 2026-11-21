"use client";

import React from "react";
import Link from "next/link";
import {
  Calendar,
  Search,
  Sparkles,
  Database,
  SlidersHorizontal,
  Presentation,
  Compass,
} from "lucide-react";
import { UserMenu } from "@/components/auth/user-menu";
import { useShellStore } from "@/stores/shell-store";
import {
  useGlobalFilterStore,
  DATE_RANGE_PRESETS,
} from "@/stores/global-filter-store";
import { cn } from "@/lib/utils";

export function Topbar() {
  const {
    toggleCommandPalette,
    presenterMode,
    togglePresenterMode,
    guidedTourActive,
    startGuidedTour,
    exitGuidedTour,
  } = useShellStore();

  const {
    selectedRange,
    setSelectedRange,
    comparePrevious,
    toggleComparePrevious,
    activeDrilldown,
    clearDrilldown,
  } = useGlobalFilterStore();

  return (
    <header className="h-14 border-b border-border bg-surface/90 backdrop-blur-md px-4 flex items-center justify-between sticky top-0 z-20">
      {/* Left: Breadcrumbs + Data Source Pill */}
      <div className="flex items-center gap-3">
        <Link
          href="/data-hub"
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-surface-elevated border border-border text-foreground hover:border-primary/40 transition-colors"
          title="Source: Pre-loaded Demo Dataset (NexusMart)"
        >
          <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
          <Database className="w-3.5 h-3.5 text-muted-foreground" />
          <span className="font-semibold">NexusMart</span>
          <span className="text-muted-foreground font-mono text-[10px]">
            · fresh 2m ago
          </span>
        </Link>

        {activeDrilldown && (
          <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-primary/10 border border-primary/20 text-primary text-xs font-mono">
            <span>
              Filtered: {activeDrilldown.field} = &quot;{activeDrilldown.value}&quot;
            </span>
            <button
              onClick={clearDrilldown}
              className="ml-1 hover:text-foreground font-bold"
              title="Clear drilldown filter"
            >
              ×
            </button>
          </div>
        )}
      </div>

      {/* Right: Controls & Global Actions */}
      <div className="flex items-center gap-2">
        {/* Date Range Selector */}
        <div className="flex items-center bg-surface-elevated border border-border rounded-lg p-0.5 text-xs">
          <div className="flex items-center px-2 text-muted-foreground gap-1 border-r border-border">
            <Calendar className="w-3.5 h-3.5" />
            <span className="text-[11px] font-medium hidden sm:inline">Range</span>
          </div>
          {DATE_RANGE_PRESETS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => setSelectedRange(preset)}
              className={cn(
                "px-2 py-1 rounded text-xs font-medium transition-colors",
                selectedRange.id === preset.id
                  ? "bg-blue-600 text-white font-semibold shadow-xs"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/60"
              )}
            >
              {preset.label.replace("Last ", "")}
            </button>
          ))}
          <button
            onClick={toggleComparePrevious}
            className={cn(
              "ml-1 px-2 py-1 rounded text-[11px] font-medium border-l border-border transition-colors hidden md:inline-flex items-center gap-1",
              comparePrevious
                ? "text-blue-400 font-semibold"
                : "text-slate-400 hover:text-white"
            )}
            title="Toggle period-over-period comparison"
          >
            <SlidersHorizontal className="w-3 h-3" />
            vs Prev
          </button>
        </div>

        {/* Guided Tour Trigger */}
        <button
          onClick={guidedTourActive ? exitGuidedTour : startGuidedTour}
          className={cn(
            "h-8 px-2.5 rounded-lg border text-xs font-medium transition-colors hidden lg:flex items-center gap-1.5",
            guidedTourActive
              ? "bg-primary text-white border-primary"
              : "border-border bg-surface-elevated text-muted-foreground hover:text-foreground"
          )}
          title="Interactive Pitch & Judge Walkthrough Tour"
        >
          <Compass className="w-3.5 h-3.5" />
          <span className="hidden xl:inline">Tour</span>
        </button>

        {/* Presenter Mode Toggle (Hotkey P) */}
        <button
          onClick={togglePresenterMode}
          className={cn(
            "h-8 w-8 rounded-lg border text-xs font-medium transition-colors hidden sm:flex items-center justify-center",
            presenterMode
              ? "bg-warning/20 border-warning text-warning"
              : "border-border bg-surface-elevated text-muted-foreground hover:text-foreground"
          )}
          title="Presenter Mode (Press 'P' to toggle large projector view)"
        >
          <Presentation className="w-3.5 h-3.5" />
        </button>

        {/* Command Palette Trigger (Cmd+K / Ctrl+K) */}
        <button
          onClick={toggleCommandPalette}
          className="h-8 px-2.5 rounded-lg border border-border bg-surface-elevated text-muted-foreground hover:text-foreground hover:border-border/80 flex items-center gap-2 text-xs transition-colors"
          title="Search metrics, commands, and navigate"
        >
          <Search className="w-3.5 h-3.5" />
          <span className="hidden md:inline">Quick Jump</span>
          <kbd className="px-1.5 py-0.5 rounded bg-surface border border-border font-mono text-[10px] text-muted-foreground">
            ⌘K
          </kbd>
        </button>

        {/* Ask AI Button with Signature Nexus Glow */}
        <Link
          href="/analyst"
          className="h-8 px-3 rounded-lg text-xs font-semibold text-white bg-gradient-to-r from-primary to-ai-accent hover:opacity-95 transition-opacity flex items-center gap-1.5 ai-glow-subtle shrink-0 hidden sm:flex"
        >
          <Sparkles className="w-3.5 h-3.5 text-white" />
          <span>Ask AI</span>
        </Link>

        {/* Firebase Authentication & User Menu */}
        <UserMenu />
      </div>
    </header>
  );
}
