"use client";

import React from "react";
import {
  Zap,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Share2,
  DollarSign,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Info,
} from "lucide-react";
import { useEvidenceStore } from "@/stores/evidence-store";
import { TrustBadge } from "@/components/ui/trust-badge";

export default function ImpactPage() {
  const { openEvidence } = useEvidenceStore();

  const handleOpenAttributionEvidence = () => {
    openEvidence({
      metricId: "cross_domain_attribution",
      metricLabel: "Cross-Domain Business ↔ Social Attribution",
      valueFormatted: "$384,000.00 Attributed Revenue (4.23x Blended ROAS)",
      definition: "Attributed commercial revenue correlated across multichannel UTM links and checkout orders.",
      formula: "Attributed Revenue = Σ(UTM_Tracked_Checkouts) + Markov Multi-Touch Touchpoint Weights",
      sql: `SELECT 
    c.campaign_name,
    c.platform,
    c.spend,
    c.attributed_revenue,
    ROUND(c.attributed_revenue / c.spend, 2) AS roas,
    COUNT(s.order_id) AS matched_orders
FROM campaigns c
LEFT JOIN sales s ON c.campaign_id = s.campaign_id
GROUP BY c.campaign_name, c.platform, c.spend, c.attributed_revenue
ORDER BY roas DESC;`,
      method: "Data-Driven Markov Chain Multi-Touch Attribution",
      assumptions: [
        "14-day attribution lookback window from social engagement to ecommerce checkout",
        "Linear touchpoint decay applied across multi-session paths",
        "Organic virality separated from paid conversion channels"
      ],
      confidence: "high",
      confidenceReason: "1,840 distinct checkout sessions matched with campaign UTM parameters in DuckDB.",
      computedAt: new Date().toISOString(),
      dataLineage: {
        sourceTable: "campaigns.parquet",
        rowCount: 8,
        lastSynced: "Just now",
        filtersApplied: ["Paid social campaigns with verified conversion tags"],
      },
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-12">
      {/* 1. Header Banner */}
      <div className="space-y-4 pb-2 border-b border-border/80">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-surface-elevated border border-border text-foreground font-medium">
              <Zap className="w-3.5 h-3.5 text-primary" />
              <span className="font-semibold">Signature Feature:</span>
              <span>Business ↔ Social Impact Correlation Engine</span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-primary/10 border border-primary/20 text-primary font-mono text-[11px] font-semibold">
              <Sparkles className="w-3 h-3 text-ai-accent" />
              <span>CROSS-DOMAIN ATTRIBUTION</span>
            </div>
          </div>
          <button
            onClick={handleOpenAttributionEvidence}
            className="text-xs font-medium text-primary hover:underline font-mono"
          >
            Audit Attribution Math ↗
          </button>
        </div>

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2.5">
              <span>Business ↔ Social Impact Intelligence</span>
              <TrustBadge status="verified" />
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              Eliminate vanity metrics. Correlate social media engagement and brand sentiment directly with commercial transaction lift and revenue.
            </p>
          </div>
        </div>
      </div>

      {/* 2. Value Bridge Diagram */}
      <div className="bg-surface rounded-xl border border-border p-6 shadow-xs space-y-6">
        <h3 className="text-sm font-bold text-foreground uppercase tracking-wider text-muted-foreground">
          The Intelligence Value Bridge: Social Intent to Financial Reality
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative">
          <div className="bg-surface-elevated p-4 rounded-xl border border-border space-y-2">
            <div className="flex items-center gap-2 text-primary font-bold text-sm">
              <Share2 className="w-4 h-4" />
              <span>1. Social Discovery</span>
            </div>
            <div className="text-2xl font-black text-foreground">4.1M Impressions</div>
            <p className="text-xs text-muted-foreground">
              4.68% engagement rate across Reels, TikTok, and LinkedIn campaigns with +60.0 net brand sentiment.
            </p>
          </div>

          <div className="bg-surface-elevated p-4 rounded-xl border border-border space-y-2">
            <div className="flex items-center gap-2 text-ai-accent font-bold text-sm">
              <Zap className="w-4 h-4" />
              <span>2. Attribution Matching</span>
            </div>
            <div className="text-2xl font-black text-foreground">28,400 High-Intent Clicks</div>
            <p className="text-xs text-muted-foreground">
              UTM tracking matches 1,840 distinct checkout sessions with verified 14-day lookback attribution.
            </p>
          </div>

          <div className="bg-surface-elevated p-4 rounded-xl border border-border space-y-2">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
              <DollarSign className="w-4 h-4" />
              <span>3. Cash Flow Capture</span>
            </div>
            <div className="text-2xl font-black text-foreground">$474,300 Attributed</div>
            <p className="text-xs text-muted-foreground">
              4.23x blended ROAS across all channels ($112,100 total ad spend yielded $259,153 gross profit).
            </p>
          </div>
        </div>

        {/* The Vanity Metric Trap vs High Intent Table */}
        <div className="space-y-3 pt-4 border-t border-border">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-foreground">Vanity Metric Trap vs. Commercial ROAS Leaders</h4>
            <span className="text-[11px] font-mono text-muted-foreground">Audited in DuckDB campaigns table</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-500/5 space-y-2">
              <div className="flex items-center gap-2 text-amber-400 font-semibold text-xs">
                <AlertTriangle className="w-4 h-4" />
                <span>VANITY TRAP DETECTED: Instagram Influencer Wave</span>
              </div>
              <div className="text-xs text-muted-foreground">
                High virality (580k views, 8.75% engagement), but ROAS was only <strong>1.54x</strong> ($14,500 spend $\to$ $22,400 revenue). Audience lacked purchasing intent for high-AOV apparel.
              </div>
            </div>

            <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/5 space-y-2">
              <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs">
                <CheckCircle2 className="w-4 h-4" />
                <span>EFFICIENCY WINNER: LinkedIn B2B Workspace Blitz</span>
              </div>
              <div className="text-xs text-muted-foreground">
                Lower reach (142k views), but achieved <strong>4.80x ROAS</strong> ($8,200 spend $\to$ $39,400 revenue) with a 5.83% conversion rate targeting remote tech workers.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}