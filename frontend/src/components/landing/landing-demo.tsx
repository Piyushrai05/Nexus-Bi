"use client";

import React from "react";
import Link from "next/link";
import {
  ArrowRight,
  ShoppingBag,
  TrendingDown,
  Megaphone,
  AlertTriangle,
  CheckCircle2,
  Database,
} from "lucide-react";
import { TrustBadge } from "@/components/ui/trust-badge";
import { ConfidenceChip } from "@/components/ui/confidence-chip";

export function LandingDemo() {
  return (
    <section id="demo" className="py-24 md:py-32 border-t border-slate-800/80 relative bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Context & Overview */}
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-950/60 border border-blue-800/60 text-xs font-mono text-blue-300 font-semibold">
              <ShoppingBag className="w-3.5 h-3.5 text-blue-400" />
              <span>SYNTHETIC TELEMETRY SUITE</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Test Drive With <br />
              <span className="ai-gradient-text">NexusMart Telemetry.</span>
            </h2>

            <p className="text-base text-slate-300 leading-relaxed font-normal">
              Experience the power of NEXUS BI immediately with NexusMart, our high-fidelity omnichannel retail dataset. Featuring over 10,000 transactions, 5 marketing campaigns, and real-world executive dilemmas.
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-1 shrink-0" />
                <span className="text-sm text-slate-300">
                  Pre-configured with 7 relational datasets across sales, inventory, campaigns, and sentiment.
                </span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-1 shrink-0" />
                <span className="text-sm text-slate-300">
                  Embedded root causes ready for automated causal diagnostic discovery.
                </span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-1 shrink-0" />
                <span className="text-sm text-slate-300">
                  Full DuckDB in-memory analytics engine with sub-10ms query execution.
                </span>
              </div>
            </div>

            <div className="pt-4 flex flex-wrap gap-4">
              <Link
                href="/dashboard"
                className="btn-primary-glow inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition-all duration-200 shadow-md shadow-blue-600/30 active:scale-95"
              >
                <span>Launch Interactive Demo</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/data"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-900 border border-slate-700 hover:border-slate-600 text-slate-200 font-medium text-sm transition-all duration-200"
              >
                <span>Browse Datasets</span>
              </Link>
            </div>
          </div>

          {/* Right Column: Planted Diagnostic Stories */}
          <div className="lg:col-span-7 space-y-4">
            {/* Story 1 */}
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 enterprise-card">
              <div className="flex items-center justify-between mb-2.5">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-rose-950/60 border border-rose-800/60 flex items-center justify-center text-rose-400">
                    <TrendingDown className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-bold text-white tracking-tight">
                    Diagnosis: West Region Electronics Deficit (-18.5%)
                  </span>
                </div>
                <ConfidenceChip level="high" score={94} />
              </div>
              <p className="text-xs text-slate-300 leading-relaxed font-normal">
                West revenue dropped sharply mid-quarter. Instead of manual spreadsheet slicing, NEXUS BI automatically decomposes the anomaly to 3 audio SKUs facing regional warehouse stockouts.
              </p>
              <div className="mt-3.5 flex items-center gap-3 text-[11px] font-mono text-slate-400 border-t border-slate-800 pt-3">
                <span className="text-rose-400 font-semibold">Variance: -$48,200</span>
                <span>·</span>
                <span className="text-blue-400">Root Cause: 0 Inventory on 3 SKUs</span>
              </div>
            </div>

            {/* Story 2 */}
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 enterprise-card">
              <div className="flex items-center justify-between mb-2.5">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-950/60 border border-amber-800/60 flex items-center justify-center text-amber-400">
                    <Megaphone className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-bold text-white tracking-tight">
                    Diagnosis: Influencer Campaign Vanity Trap
                  </span>
                </div>
                <ConfidenceChip level="high" score={91} />
              </div>
              <p className="text-xs text-slate-300 leading-relaxed font-normal">
                Q2 influencer campaign generated 2.4M impressions and +42% buzz, but ledger attribution reveals a disappointing 0.82x ROAS with 91% one-time discount seekers who never repurchased.
              </p>
              <div className="mt-3.5 flex items-center gap-3 text-[11px] font-mono text-slate-400 border-t border-slate-800 pt-3">
                <span className="text-amber-400 font-semibold">Net ROAS: 0.82x (Bleeding)</span>
                <span>·</span>
                <span className="text-blue-400">Action: Shift \$24k to Retargeting</span>
              </div>
            </div>

            {/* Story 3 */}
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 enterprise-card">
              <div className="flex items-center justify-between mb-2.5">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-950/60 border border-emerald-800/60 flex items-center justify-center text-emerald-400">
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-bold text-white tracking-tight">
                    Diagnosis: Data Pipeline Freshness & Duplicate Audit
                  </span>
                </div>
                <ConfidenceChip level="high" score={97} />
              </div>
              <p className="text-xs text-slate-300 leading-relaxed font-normal">
                Continuous 5D auditing caught 42 duplicate transaction IDs in POS ingest batch 104, preventing a \$31,400 double-counting error before quarterly board presentation.
              </p>
              <div className="mt-3.5 flex items-center gap-3 text-[11px] font-mono text-slate-400 border-t border-slate-800 pt-3">
                <span className="text-emerald-400 font-semibold">Integrity Score: 98.4/100</span>
                <span>·</span>
                <span className="text-blue-400">Audit Status: Automatically Flagged</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
