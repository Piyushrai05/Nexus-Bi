"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Command } from "cmdk";
import {
  LayoutDashboard,
  Database,
  BarChart3,
  TrendingUp,
  AlertTriangle,
  Share2,
  Zap,
  Bot,
  CheckSquare,
  Palette,
  Sun,
  Moon,
  Presentation,
  Compass,
  RotateCcw,
  Sparkles,
  HelpCircle,
} from "lucide-react";
import { useTheme } from "next-themes";
import { useShellStore } from "@/stores/shell-store";
import { useGlobalFilterStore } from "@/stores/global-filter-store";

export function CommandPalette() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const {
    commandPaletteOpen,
    setCommandPaletteOpen,
    togglePresenterMode,
    startGuidedTour,
  } = useShellStore();
  const { clearDrilldown } = useGlobalFilterStore();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || e.key === "/") {
        e.preventDefault();
        setCommandPaletteOpen(!commandPaletteOpen);
      }
      if (e.key === "p" && !["INPUT", "TEXTAREA"].includes((e.target as HTMLElement)?.tagName)) {
        e.preventDefault();
        togglePresenterMode();
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [commandPaletteOpen, setCommandPaletteOpen, togglePresenterMode]);

  if (!commandPaletteOpen) return null;

  const runCommand = (command: () => void) => {
    command();
    setCommandPaletteOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-background/70 backdrop-blur-xs flex items-start justify-center pt-20 p-4 animate-in fade-in duration-150">
      <div
        className="fixed inset-0 -z-10"
        onClick={() => setCommandPaletteOpen(false)}
      />
      <div className="w-full max-w-xl bg-surface border border-border rounded-xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150">
        <Command className="w-full flex flex-col focus:outline-hidden">
          <div className="flex items-center px-3 border-b border-border bg-surface-elevated">
            <Sparkles className="w-4 h-4 text-primary shrink-0 mr-2" />
            <Command.Input
              placeholder="Type a command, ask AI, or jump to page... (⌘K)"
              className="w-full py-3 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-hidden font-medium"
            />
            <kbd className="px-1.5 py-0.5 rounded bg-surface border border-border font-mono text-[10px] text-muted-foreground">
              ESC
            </kbd>
          </div>

          <Command.List className="max-h-80 overflow-y-auto p-2 space-y-2 text-xs">
            <Command.Empty className="py-6 text-center text-muted-foreground">
              No matching commands or insights found.
            </Command.Empty>

            {/* AI Analytical Prompts */}
            <Command.Group
              heading="AI Analytical Queries"
              className="px-2 py-1.5 text-[10px] font-semibold text-ai-accent uppercase font-mono tracking-wider"
            >
              <Command.Item
                onSelect={() =>
                  runCommand(() =>
                    router.push("/analyst?q=Why did revenue decline in the last 30 days?")
                  )
                }
                className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-foreground hover:bg-surface-elevated cursor-pointer"
              >
                <Bot className="w-4 h-4 text-ai-accent" />
                <span className="flex-1 font-medium">Why did revenue decline in the last 30 days?</span>
                <span className="text-[10px] text-muted-foreground font-mono">Ask AI</span>
              </Command.Item>
              <Command.Item
                onSelect={() =>
                  runCommand(() =>
                    router.push("/analyst?q=Which marketing campaign drove the highest net ROAS?")
                  )
                }
                className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-foreground hover:bg-surface-elevated cursor-pointer"
              >
                <Bot className="w-4 h-4 text-ai-accent" />
                <span className="flex-1 font-medium">Which marketing campaign drove the highest net ROAS?</span>
                <span className="text-[10px] text-muted-foreground font-mono">Ask AI</span>
              </Command.Item>
            </Command.Group>

            {/* Pages Navigation */}
            <Command.Group
              heading="Navigation"
              className="px-2 py-1.5 text-[10px] font-semibold text-muted-foreground uppercase font-mono tracking-wider"
            >
              <Command.Item
                onSelect={() => runCommand(() => router.push("/"))}
                className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-foreground hover:bg-surface-elevated cursor-pointer"
              >
                <LayoutDashboard className="w-4 h-4 text-primary" />
                <span>Command Center</span>
              </Command.Item>
              <Command.Item
                onSelect={() => runCommand(() => router.push("/impact"))}
                className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-foreground hover:bg-surface-elevated cursor-pointer"
              >
                <Zap className="w-4 h-4 text-primary" />
                <span className="flex-1">Business ↔ Social Impact</span>
                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-primary/20 text-primary">Signature</span>
              </Command.Item>
              <Command.Item
                onSelect={() => runCommand(() => router.push("/dashboard"))}
                className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-foreground hover:bg-surface-elevated cursor-pointer"
              >
                <BarChart3 className="w-4 h-4 text-primary" />
                <span>Business Dashboard</span>
              </Command.Item>
              <Command.Item
                onSelect={() => runCommand(() => router.push("/anomalies"))}
                className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-foreground hover:bg-surface-elevated cursor-pointer"
              >
                <AlertTriangle className="w-4 h-4 text-warning" />
                <span>Anomalies &amp; Root Cause Waterfall</span>
              </Command.Item>
              <Command.Item
                onSelect={() => runCommand(() => router.push("/social"))}
                className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-foreground hover:bg-surface-elevated cursor-pointer"
              >
                <Share2 className="w-4 h-4 text-primary" />
                <span>Social Media Intelligence</span>
              </Command.Item>
              <Command.Item
                onSelect={() => runCommand(() => router.push("/decisions"))}
                className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-foreground hover:bg-surface-elevated cursor-pointer"
              >
                <CheckSquare className="w-4 h-4 text-success" />
                <span>Decision Intelligence Center</span>
              </Command.Item>
              <Command.Item
                onSelect={() => runCommand(() => router.push("/data-hub"))}
                className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-foreground hover:bg-surface-elevated cursor-pointer"
              >
                <Database className="w-4 h-4 text-primary" />
                <span>Data Hub &amp; Quality Scoring</span>
              </Command.Item>
              <Command.Item
                onSelect={() => runCommand(() => router.push("/design"))}
                className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-foreground hover:bg-surface-elevated cursor-pointer"
              >
                <Palette className="w-4 h-4 text-primary" />
                <span>Design System &amp; Component Gallery</span>
              </Command.Item>
            </Command.Group>

            {/* Actions & Utilities */}
            <Command.Group
              heading="Actions &amp; Settings"
              className="px-2 py-1.5 text-[10px] font-semibold text-muted-foreground uppercase font-mono tracking-wider"
            >
              <Command.Item
                onSelect={() =>
                  runCommand(() => setTheme(theme === "dark" ? "light" : "dark"))
                }
                className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-foreground hover:bg-surface-elevated cursor-pointer"
              >
                {theme === "dark" ? (
                  <Sun className="w-4 h-4 text-warning" />
                ) : (
                  <Moon className="w-4 h-4 text-primary" />
                )}
                <span>Toggle Light / Dark Theme</span>
              </Command.Item>
              <Command.Item
                onSelect={() => runCommand(() => togglePresenterMode())}
                className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-foreground hover:bg-surface-elevated cursor-pointer"
              >
                <Presentation className="w-4 h-4 text-warning" />
                <span className="flex-1">Toggle Presenter Mode</span>
                <kbd className="px-1.5 py-0.5 rounded bg-surface border border-border font-mono text-[10px] text-muted-foreground">
                  P
                </kbd>
              </Command.Item>
              <Command.Item
                onSelect={() => runCommand(() => startGuidedTour())}
                className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-foreground hover:bg-surface-elevated cursor-pointer"
              >
                <Compass className="w-4 h-4 text-primary" />
                <span>Start Guided Tour for Judges</span>
              </Command.Item>
              <Command.Item
                onSelect={() => runCommand(() => clearDrilldown())}
                className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-foreground hover:bg-surface-elevated cursor-pointer"
              >
                <RotateCcw className="w-4 h-4 text-muted-foreground" />
                <span>Clear All Active Dashboard Filters</span>
              </Command.Item>
            </Command.Group>
          </Command.List>

          <div className="px-3 py-2 border-t border-border bg-surface-elevated flex items-center justify-between text-[11px] text-muted-foreground font-mono">
            <span>Navigate: ↑↓ · Select: ↵ · Close: ESC</span>
            <span>NEXUS BI v1.0</span>
          </div>
        </Command>
      </div>
    </div>
  );
}
