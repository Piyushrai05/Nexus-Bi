"use client";

import React from "react";
import Link from "next/link";
import {
  ArrowRight,
  TrendingUp,
  BarChart3,
  Database,
  CheckCircle2,
  ShieldCheck,
  Cpu,
  Layers,
  ArrowUpRight,
  Sparkles,
} from "lucide-react";
import { TrustBadge } from "@/components/ui/trust-badge";
import { ConfidenceChip } from "@/components/ui/confidence-chip";

export function LandingHero() {
  return (
    <section className="relative pt-16 pb-24 md:pt-24 md:pb-32 overflow-hidden">
      {/* Executive Slate Background Pattern & Ambient Lighting */}
      <div className="absolute inset-0 bg-grid-pattern bg-vignette opacity-60 pointer-events-none -z-10" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-blue-600/[0.08] rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="absolute top-1/3 right-1/4 w-[400px] h-[250px] bg-cyan-500/[0.05] rounded-full blur-[120px] pointer-events-none -z-10" />

      <div className="max-w-5xl mx-auto text-center space-y-6 px-4">
        {/* Enterprise Status Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/80 border border-slate-700/80 text-xs font-mono text-slate-300 shadow-sm backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-blue-400 font-semibold">NEXUS BI v1.0</span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-300">Executive Decision Intelligence</span>
        </div>

        {/* Hero Headline */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-[1.12] max-w-4xl mx-auto">
          From Business Data to <br />
          <span className="ai-gradient-text">Better Decisions.</span>
        </h1>

        {/* Supporting Proposition */}
        <p className="text-base sm:text-lg md:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed font-normal">
          Connect your business telemetry and social signals into one workspace. Discover{" "}
          <strong className="text-white font-semibold">what happened</strong>, understand{" "}
          <strong className="text-white font-semibold">why</strong>, predict{" "}
          <strong className="text-white font-semibold">what&apos;s next</strong>, and take action with certified evidence.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <Link
            href="/dashboard"
            className="btn-primary-glow h-12 px-7 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition-all duration-200 flex items-center gap-2 shadow-lg shadow-blue-600/30 active:scale-95"
          >
            <span>Open Command Center</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            href="/data"
            className="h-12 px-6 rounded-xl bg-slate-900/80 border border-slate-700 hover:border-slate-600 text-slate-200 font-medium text-sm hover:bg-slate-800 transition-all duration-200 flex items-center gap-2.5 backdrop-blur-sm"
          >
            <Database className="w-4 h-4 text-blue-400" />
            <span>Explore Telemetry Data</span>
          </Link>
        </div>

        {/* Trust Guarantee Strip */}
        <div className="pt-4 flex flex-wrap items-center justify-center gap-7 text-xs text-slate-400 font-mono">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>DuckDB In-Memory Engine</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Zero-Hallucination SQL Guardrails</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Auditable Evidence Citations</span>
          </div>
        </div>

        {/* Interactive Hero Visual Preview (Executive Command Deck) */}
        <div className="mt-12 p-4 sm:p-6 rounded-2xl border border-slate-800 bg-slate-950/80 shadow-2xl backdrop-blur-xl relative overflow-hidden text-left max-w-4xl mx-auto enterprise-card">
          {/* Mock Console Header */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-5">
            <div className="flex items-center gap-2.5">
              <span className="w-3 h-3 rounded-full bg-rose-500/80" />
              <span className="w-3 h-3 rounded-full bg-amber-500/80" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
              <span className="ml-3 text-xs font-mono text-slate-400 hidden sm:inline">
                nexus-bi.enterprise // executive-command-deck
              </span>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="px-2.5 py-1 rounded text-[11px] font-mono bg-blue-950/60 border border-blue-800/60 text-blue-300 font-semibold">
                LIVE DUCKDB SQL
              </div>
              <TrustBadge status="verified" score={98} />
            </div>
          </div>

          {/* Metric Highlights Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
            <div className="p-4 rounded-xl border border-slate-800/90 bg-slate-900/60">
              <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400">Net Revenue (YTD)</div>
              <div className="text-2xl font-bold font-mono text-white mt-1 tabular-nums">$484,713.26</div>
              <div className="flex items-center gap-1 text-[11px] font-mono text-emerald-400 mt-1 font-semibold">
                <ArrowUpRight className="w-3.5 h-3.5" />
                <span>+14.2% vs target</span>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-slate-800/90 bg-slate-900/60">
              <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400">Gross Margin</div>
              <div className="text-2xl font-bold font-mono text-white mt-1 tabular-nums">41.8%</div>
              <div className="flex items-center gap-1 text-[11px] font-mono text-cyan-400 mt-1">
                <span>Healthy operational band</span>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-slate-800/90 bg-slate-900/60">
              <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400">Blended ROAS</div>
              <div className="text-2xl font-bold font-mono text-white mt-1 tabular-nums">4.12x</div>
              <div className="flex items-center gap-1 text-[11px] font-mono text-emerald-400 mt-1 font-semibold">
                <ArrowUpRight className="w-3.5 h-3.5" />
                <span>Organic lift indexed</span>
              </div>
            </div>
          </div>

          {/* High-Tech Executive Financial Graph */}
          <div className="h-44 sm:h-52 rounded-xl border border-slate-800 bg-slate-900/40 p-4 flex flex-col justify-between relative overflow-hidden">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-3.5 h-3.5 text-blue-400" />
                <span className="text-white font-medium">Omnichannel Sales vs Predictive Trajectory</span>
              </div>
              <span className="text-slate-500">95% Confidence Interval</span>
            </div>

            {/* Stylized Modern Executive SVG Graph Line */}
            <div className="relative w-full h-24 my-auto">
              <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 400 80">
                <defs>
                  <linearGradient id="execBlueGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.30" />
                    <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                <path
                  d="M0,60 Q40,50 80,55 T160,35 T240,40 T320,15 T400,20 L400,80 L0,80 Z"
                  fill="url(#execBlueGrad)"
                />
                <path
                  d="M0,60 Q40,50 80,55 T160,35 T240,40 T320,15 T400,20"
                  fill="none"
                  stroke="#3B82F6"
                  strokeWidth="2.5"
                />
                {/* Data Nodes */}
                <circle cx="80" cy="55" r="3" fill="#60A5FA" />
                <circle cx="160" cy="35" r="3" fill="#60A5FA" />
                <circle cx="240" cy="40" r="3" fill="#60A5FA" />
                <circle cx="320" cy="15" r="3" fill="#60A5FA" />
                <circle cx="400" cy="20" r="4" fill="#38BDF8" className="animate-pulse" />
              </svg>
            </div>

            <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 border-t border-slate-800/80 pt-2">
              <span>Q1-2024 (Baseline Ledger)</span>
              <span>Q2-2024</span>
              <span>Q3-2024</span>
              <span className="text-blue-400 font-medium">Forward Forecast Horizon</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
