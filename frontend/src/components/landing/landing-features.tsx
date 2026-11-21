"use client";

import React from "react";
import {
  Layers,
  Share2,
  Cpu,
  TrendingUp,
  ShieldCheck,
  CheckSquare,
  ArrowUpRight,
} from "lucide-react";
import { TrustBadge } from "@/components/ui/trust-badge";

const FEATURES = [
  {
    icon: Layers,
    title: "Unified Business Telemetry",
    category: "Semantic Engine",
    description:
      "Ingest sales, revenue, COGS, customer churn, and inventory with a unified semantic schema. No scattered silos or conflicting spreadsheet formulas.",
    metrics: "25+ Standard Metrics",
    iconColor: "text-blue-400 bg-blue-950/60 border-blue-800/60",
  },
  {
    icon: Share2,
    title: "Multichannel Attribution",
    category: "Marketing ROI",
    description:
      "Correlate campaign spend, organic sentiment, engagement rate, and CAC directly with ledger revenue. Detect vanity metric traps before budgets bleed.",
    metrics: "Cross-Platform ROAS",
    iconColor: "text-cyan-400 bg-cyan-950/60 border-cyan-800/60",
  },
  {
    icon: Cpu,
    title: "Auditable Decision AI",
    category: "Intelligence",
    description:
      "Ask complex business questions in natural language. Every answer includes verifiable DuckDB SQL queries, formula breakdowns, and Evidence Drawer citations.",
    metrics: "Zero-Hallucination Guardrails",
    iconColor: "text-indigo-400 bg-indigo-950/60 border-indigo-800/60",
  },
  {
    icon: TrendingUp,
    title: "Decomposition & Root-Cause",
    category: "Causal Analytics",
    description:
      "Automated decomposition trees pinpoint the exact SKU, channel, or geography causing metric drops. Dynamic confidence intervals reflect uncertainty honestly.",
    metrics: "30-Day Forward Horizons",
    iconColor: "text-emerald-400 bg-emerald-950/60 border-emerald-800/60",
  },
  {
    icon: ShieldCheck,
    title: "5-Dimension Data Trust",
    category: "Integrity Engine",
    description:
      "Continuously audit completeness, uniqueness, validity, consistency, and freshness. Never make high-stakes executive decisions on dirty data.",
    metrics: "Automated Trust Scoring",
    iconColor: "text-amber-400 bg-amber-950/60 border-amber-800/60",
  },
  {
    icon: CheckSquare,
    title: "Closed-Loop Action Center",
    category: "Executive Strategy",
    description:
      "Transform passive analytical charts into concrete recommendations with estimated EBITDA impact, confidence ratings, and tracked outcomes.",
    metrics: "Impact Simulation Engine",
    iconColor: "text-blue-400 bg-blue-950/60 border-blue-800/60",
  },
];

export function LandingFeatures() {
  return (
    <section id="features" className="py-24 md:py-32 border-t border-slate-800/80 relative bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-950/60 border border-blue-800/60 text-xs font-mono text-blue-300 font-semibold">
            <span>ENTERPRISE ARCHITECTURE</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Engineered for Proof, <br />
            <span className="ai-gradient-text">Not Just Pretty Charts.</span>
          </h2>
          <p className="text-base text-slate-300 leading-relaxed max-w-2xl mx-auto">
            NEXUS BI unifies in-memory analytical speed, automated root-cause discovery, and zero-hallucination statistical governance.
          </p>
        </div>

        {/* 6 Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <div
                key={i}
                className="group relative p-7 rounded-2xl bg-slate-900/60 border border-slate-800 enterprise-card flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className={`w-11 h-11 rounded-xl border flex items-center justify-center transition-all duration-200 ${feature.iconColor}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 bg-slate-800/80 px-2.5 py-1 rounded-full border border-slate-700/60">
                      {feature.category}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white mb-2.5 tracking-tight group-hover:text-blue-400 transition-colors">
                    {feature.title}
                  </h3>

                  <p className="text-sm text-slate-300 leading-relaxed font-normal">
                    {feature.description}
                  </p>
                </div>

                <div className="pt-5 mt-6 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono">
                  <span className="text-blue-400 font-medium">{feature.metrics}</span>
                  <TrustBadge status="verified" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
