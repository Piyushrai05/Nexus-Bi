"use client";

import React from "react";
import Link from "next/link";
import { Sparkles, ArrowRight, CheckCircle2, ShieldAlert } from "lucide-react";

export function OneClickDemoBanner() {
  return (
    <div className="relative overflow-hidden rounded-xl border border-primary/30 bg-gradient-to-r from-primary/10 via-surface to-ai-accent/10 p-5">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-primary/20 text-primary text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-ai-accent" />
            <span>NexusMart Omnichannel Retail Demo Loaded</span>
          </div>
          <h3 className="text-base font-bold text-foreground">
            Explore 7 Clean &amp; Corrupted Datasets with Planted Scenarios
          </h3>
          <p className="text-xs text-muted-foreground max-w-2xl">
            Compare <span className="font-mono text-emerald-400">sales.parquet (96.5 Trust Score)</span> with{" "}
            <span className="font-mono text-amber-400">imperfect_sales.parquet (68.4 Trust Score)</span> to see the 5D Trust Engine isolate duplicate rows, negative discounts, and extreme outliers.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Link
            href="/data/imperfect_sales"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold bg-surface-elevated hover:bg-surface border border-border text-foreground transition-colors"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
            <span>Audit Imperfect Data</span>
          </Link>
          <Link
            href="/data/sales"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold bg-primary hover:bg-primary-hover text-primary-foreground shadow-xs transition-colors"
          >
            <span>Inspect Clean Sales</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
