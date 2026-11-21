"use client";

import React from "react";
import {
  Database,
  ShieldCheck,
  LineChart,
  TrendingUp,
  Search,
  CheckCircle2,
  Zap,
} from "lucide-react";

const STEPS = [
  {
    step: "01",
    label: "CONNECT",
    title: "Instant Ingestion",
    description: "Plug in CSVs, Parquet files, or analytical schemas with automated type inference and embedded DuckDB storage.",
    icon: Database,
  },
  {
    step: "02",
    label: "AUDIT",
    title: "5D Data Trust Scoring",
    description: "Automated scan for duplicates, nulls, statistical outliers, and corrupted timestamps before any analysis runs.",
    icon: ShieldCheck,
  },
  {
    step: "03",
    label: "UNIFY",
    title: "Semantic Metric Layer",
    description: "Align core revenue, CAC, LTV, ROAS, and sentiment across business units with mathematically certified definitions.",
    icon: LineChart,
  },
  {
    step: "04",
    label: "PREDICT",
    title: "Forecasting & Anomalies",
    description: "Statistically sound horizon projections with dynamic confidence intervals, isolating unexpected variance spikes.",
    icon: TrendingUp,
  },
  {
    step: "05",
    label: "PROVE",
    title: "Evidence Drawer Custody",
    description: "Every single metric links directly to SQL queries, raw records, sample tables, and transparent formulas.",
    icon: Search,
  },
  {
    step: "06",
    label: "ACT",
    title: "Decision & Simulation",
    description: "Prescriptive recommendations with simulated EBITDA impact, priority scoring, and closed-loop execution tracking.",
    icon: Zap,
  },
];

export function LandingWorkflow() {
  return (
    <section id="workflow" className="py-24 md:py-32 bg-slate-950/40 border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-950/60 border border-blue-800/60 text-xs font-mono text-blue-300 font-semibold">
            <span>CLOSED-LOOP DECISION ARCHITECTURE</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            From Raw Telemetry to <br />
            <span className="ai-gradient-text">High-Confidence Action.</span>
          </h2>
          <p className="text-base text-slate-300 leading-relaxed max-w-2xl mx-auto">
            Eliminate conflicting reports and boardroom guesswork. An unbroken chain of evidence from source rows to strategy.
          </p>
        </div>

        {/* 6 Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative">
          {STEPS.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={idx}
                className="relative p-7 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between enterprise-card"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <span className="text-3xl font-black font-mono text-slate-700">
                      {step.step}
                    </span>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-blue-300 bg-blue-950/80 px-2.5 py-1 rounded-md border border-blue-800/50">
                      {step.label}
                    </span>
                  </div>

                  <div className="w-11 h-11 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center justify-center text-blue-400 mb-4">
                    <Icon className="w-5 h-5" />
                  </div>

                  <h3 className="text-lg font-bold text-white mb-2 tracking-tight">
                    {step.title}
                  </h3>

                  <p className="text-sm text-slate-300 leading-relaxed font-normal">
                    {step.description}
                  </p>
                </div>

                <div className="pt-4 mt-6 border-t border-slate-800/80 flex items-center gap-2 text-xs font-mono text-slate-400">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Phase {step.step} Verified</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
