"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { Sidebar } from "./sidebar";
import { Topbar } from "./topbar";
import { CommandPalette } from "./command-palette";
import { EvidenceDrawer } from "./evidence-drawer";
import { AuthModal } from "@/components/auth/auth-modal";
import { useShellStore } from "@/stores/shell-store";
import { cn } from "@/lib/utils";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { presenterMode, guidedTourActive, tourStep, nextTourStep, exitGuidedTour } =
    useShellStore();

  const isPublicPage = pathname === "/" || pathname === "/onboarding";

  const tourSteps = [
    {
      title: "Step 1: Data Trust & Profiling",
      desc: "NEXUS BI audits the raw dataset, computing an auditable Data Quality Score (94/100) before any metric is displayed.",
    },
    {
      title: "Step 2: AI Daily Brief",
      desc: "In 5 seconds, executives understand the 3 most critical business shifts with full query traceability.",
    },
    {
      title: "Step 3: Anomaly & Root-Cause Waterfall",
      desc: "Instead of staring at a revenue dip, NEXUS decomposes the change into exact regional & SKU contributors.",
    },
    {
      title: "Step 4: Business ↔ Social Impact ⭐",
      desc: "Our signature engine links marketing sentiment shifts directly to top-line Shopify/Stripe revenue.",
    },
    {
      title: "Step 5: Closed-Loop Decision Center",
      desc: "Human-in-the-loop governance: turn AI insights into approved operational actions.",
    },
  ];

  if (isPublicPage) {
    return (
      <div
        className={cn(
          "min-h-screen bg-background text-foreground flex flex-col antialiased",
          presenterMode && "text-base scale-[1.03] origin-top transition-transform"
        )}
      >
        <main className="flex-1 w-full">{children}</main>
        {/* Global Modals & Drawers */}
        <CommandPalette />
        <EvidenceDrawer />
        <AuthModal />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "min-h-screen bg-background text-foreground flex antialiased",
        presenterMode && "text-base scale-[1.03] origin-top transition-transform"
      )}
    >
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar />

        
        {/* Guided Tour Banner if active */}
        {guidedTourActive && (
          <div className="bg-gradient-to-r from-primary to-ai-accent text-white px-4 py-2.5 flex items-center justify-between text-xs font-medium shadow-md">
            <div className="flex items-center gap-3">
              <span className="bg-white/20 px-2 py-0.5 rounded font-mono font-bold text-[11px]">
                {tourSteps[tourStep - 1]?.title || "Guided Tour"}
              </span>
              <p className="hidden md:inline">
                {tourSteps[tourStep - 1]?.desc}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {tourStep < tourSteps.length ? (
                <button
                  onClick={nextTourStep}
                  className="px-2.5 py-1 bg-white text-primary rounded font-bold hover:bg-white/90 text-xs transition-colors"
                >
                  Next Step ({tourStep}/{tourSteps.length})
                </button>
              ) : (
                <button
                  onClick={exitGuidedTour}
                  className="px-2.5 py-1 bg-white text-primary rounded font-bold hover:bg-white/90 text-xs transition-colors"
                >
                  Complete Tour
                </button>
              )}
              <button
                onClick={exitGuidedTour}
                className="text-white/80 hover:text-white text-xs px-2"
              >
                Exit
              </button>
            </div>
          </div>
        )}

        <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-[1440px] w-full mx-auto">
          {children}
        </main>
      </div>

      {/* Global Modals & Drawers */}
      <CommandPalette />
      <EvidenceDrawer />
      <AuthModal />
    </div>
  );
}
