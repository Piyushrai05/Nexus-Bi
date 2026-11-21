"use client";

import React, { useState } from "react";
import {
  Share2,
  TrendingUp,
  Megaphone,
  Eye,
  MousePointer,
  DollarSign,
  AlertTriangle,
  CheckCircle2,
  Layers,
  ArrowRight,
  Info,
} from "lucide-react";
import { useEvidenceStore } from "@/stores/evidence-store";

export interface SocialOverviewData {
  total_impressions: number;
  total_reach: number;
  total_engagements: number;
  engagement_rate: number;
  total_clicks: number;
  attributed_revenue: number;
  blended_roas: number;
}

export interface CampaignItem {
  campaign_id: string;
  campaign_name: string;
  platform: string;
  spend: number;
  impressions: number;
  clicks: number;
  ctr: number;
  conversions: number;
  conversion_rate: number;
  attributed_revenue: number;
  roas: number;
  status: string;
}

export interface ContentStats {
  content_type: string;
  post_count: number;
  total_impressions: number;
  total_engagements: number;
  avg_engagement_rate: number;
  clicks: number;
}

interface SocialPerformanceProps {
  overview: SocialOverviewData;
  campaigns: CampaignItem[];
  contentStats: ContentStats[];
  isLoading?: boolean;
}

export function SocialPerformance({
  overview,
  campaigns,
  contentStats,
  isLoading = false,
}: SocialPerformanceProps) {
  const { openEvidence } = useEvidenceStore();
  const [selectedView, setSelectedView] = useState<"campaigns" | "content">("campaigns");

  const handleInspectCampaign = (c: CampaignItem) => {
    openEvidence({
      metricId: `campaign_${c.campaign_id.toLowerCase()}`,
      metricLabel: `Campaign Audit: ${c.campaign_name}`,
      valueFormatted: `${c.roas.toFixed(2)}x ROAS`,
      deltaFormatted: `Spend: $${c.spend.toLocaleString()} | Attributed: $${c.attributed_revenue.toLocaleString()}`,
      periodLabel: `Platform: ${c.platform}`,
      definition:
        "Return on ad spend calculated by joining UTM campaign tags from checkout transactions against ad platform spend telemetry.",
      formula: "Attributed Revenue / Direct Ad Spend",
      sql: `SELECT 
  campaign_id,
  campaign_name,
  platform,
  spend,
  impressions,
  clicks,
  conversions,
  attributed_revenue,
  ROUND(attributed_revenue / NULLIF(spend, 0), 2) AS roas
FROM campaigns
WHERE campaign_id = '${c.campaign_id}';`,
      confidence: "high",
      confidenceReason:
        c.campaign_id === "CAMP-001"
          ? "Vanity metric trap: High surface engagement (8.2%) did not translate into purchase volume (only 1.54x ROAS)."
          : "Verified commercial conversion: High commercial intent cohort yielded 4.80x ROAS.",
      computedAt: new Date().toISOString(),
      assumptions: [
        "First-touch and last-touch attribution reconciled via UTM parameters",
        "Synthetic demo values specifically modeled to highlight the vanity metric trap",
      ],
      sampleRows: [
        {
          campaign_id: c.campaign_id,
          spend: c.spend,
          impressions: c.impressions,
          clicks: c.clicks,
          conversions: c.conversions,
          attributed_revenue: c.attributed_revenue,
          roas: c.roas,
        },
      ],
    });
  };

  return (
    <div className="p-6 rounded-2xl bg-surface border border-border space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-border/80">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-foreground flex items-center gap-2">
              <Share2 className="w-4 h-4 text-ai-accent" />
              <span>Unified Social &amp; Marketing Intelligence</span>
            </h2>
            <span className="px-2 py-0.5 rounded-full bg-ai-accent/10 border border-ai-accent/30 text-ai-accent text-[10px] font-mono font-semibold">
              Signature Engine
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Connecting external social engagement signals to verified ledger revenue. Exposes vanity metric traps.
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-1 bg-surface-elevated p-1 rounded-lg border border-border text-xs">
          <button
            type="button"
            onClick={() => setSelectedView("campaigns")}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
              selectedView === "campaigns"
                ? "bg-surface text-primary font-semibold shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Campaigns (ROAS)
          </button>
          <button
            type="button"
            onClick={() => setSelectedView("content")}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
              selectedView === "content"
                ? "bg-surface text-primary font-semibold shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Content Performance
          </button>
        </div>
      </div>

      {/* Top 4 Telemetry Highlights */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-3.5 rounded-xl bg-surface-elevated border border-border">
          <span className="text-[11px] text-muted-foreground block mb-1">Total Impressions</span>
          <span className="text-lg font-bold font-mono text-foreground">
            {overview.total_impressions.toLocaleString()}
          </span>
          <span className="block text-[10px] text-ai-accent font-mono mt-0.5">
            Reach: {overview.total_reach.toLocaleString()}
          </span>
        </div>

        <div className="p-3.5 rounded-xl bg-surface-elevated border border-border">
          <span className="text-[11px] text-muted-foreground block mb-1">Blended Engagement Rate</span>
          <span className="text-lg font-bold font-mono text-foreground">
            {overview.engagement_rate.toFixed(2)}%
          </span>
          <span className="block text-[10px] text-muted-foreground font-mono mt-0.5">
            {overview.total_engagements.toLocaleString()} total engagements
          </span>
        </div>

        <div className="p-3.5 rounded-xl bg-surface-elevated border border-border">
          <span className="text-[11px] text-muted-foreground block mb-1">Attributed Revenue</span>
          <span className="text-lg font-bold font-mono text-emerald-400">
            ${overview.attributed_revenue.toLocaleString()}
          </span>
          <span className="block text-[10px] text-muted-foreground font-mono mt-0.5">
            Clicks: {overview.total_clicks.toLocaleString()}
          </span>
        </div>

        <div className="p-3.5 rounded-xl bg-surface-elevated border border-border">
          <span className="text-[11px] text-muted-foreground block mb-1">Blended ROAS (MER)</span>
          <span className="text-lg font-bold font-mono text-primary">
            {overview.blended_roas.toFixed(2)}x
          </span>
          <span className="block text-[10px] text-emerald-400 font-mono mt-0.5">
            Target: &gt; 3.50x
          </span>
        </div>
      </div>

      {/* View 1: Campaigns with Planted Story 2 Vanity Trap vs High ROAS */}
      {selectedView === "campaigns" && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {campaigns.map((c) => {
              const isVanity = c.campaign_id === "CAMP-001";
              const isHero = c.campaign_id === "CAMP-002";

              return (
                <div
                  key={c.campaign_id}
                  onClick={() => handleInspectCampaign(c)}
                  className={`p-4 rounded-xl bg-surface-elevated border cursor-pointer group transition-all ${
                    isVanity
                      ? "border-amber-500/40 bg-amber-500/[0.02] hover:border-amber-500/70"
                      : isHero
                      ? "border-emerald-500/40 bg-emerald-500/[0.02] hover:border-emerald-500/70"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors">
                          {c.campaign_name}
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-surface border border-border text-muted-foreground">
                          {c.platform}
                        </span>
                      </div>
                      <span className="text-[11px] font-mono text-muted-foreground">
                        ID: <code>{c.campaign_id}</code>
                      </span>
                    </div>

                    <div className="text-right">
                      <span
                        className={`text-xl font-bold font-mono ${
                          c.roas >= 3.5 ? "text-emerald-400" : "text-amber-400"
                        }`}
                      >
                        {c.roas.toFixed(2)}x ROAS
                      </span>
                      <span className="block text-[10px] font-mono text-muted-foreground">
                        Spend: ${c.spend.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 py-2.5 my-2 border-y border-border/50 text-[11px] font-mono">
                    <div>
                      <span className="text-muted-foreground block text-[10px]">Impressions</span>
                      <span className="text-foreground">{c.impressions.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block text-[10px]">Conv. Rate</span>
                      <span className="text-foreground">{c.conversion_rate.toFixed(2)}%</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block text-[10px]">Attributed Rev</span>
                      <span className="text-emerald-400 font-semibold">
                        ${c.attributed_revenue.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Status Badge & Planted Callout */}
                  <div className="flex items-center justify-between pt-1 text-xs">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[11px] font-semibold ${
                        isVanity
                          ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                          : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                      }`}
                    >
                      {isVanity && <AlertTriangle className="w-3 h-3" />}
                      {isHero && <CheckCircle2 className="w-3 h-3" />}
                      <span>{c.status}</span>
                    </span>

                    <span className="text-[11px] font-mono text-primary flex items-center gap-1 group-hover:underline">
                      <span>Inspect SQL Lineage</span>
                      <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* View 2: Content Performance */}
      {selectedView === "content" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-in fade-in duration-200">
          {contentStats.map((item) => (
            <div
              key={item.content_type}
              className="p-4 rounded-xl bg-surface-elevated border border-border space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold text-sm text-foreground">{item.content_type}</span>
                <span className="text-[10px] font-mono text-ai-accent">
                  {item.post_count} posts
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-bold font-mono text-foreground">
                  {item.avg_engagement_rate.toFixed(2)}%
                </span>
                <span className="text-[10px] text-muted-foreground font-mono">Avg Engagement</span>
              </div>
              <div className="text-[11px] font-mono text-muted-foreground pt-1 border-t border-border/40 flex justify-between">
                <span>{item.total_impressions.toLocaleString()} views</span>
                <span>{item.clicks.toLocaleString()} clicks</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Methodology Disclaimer */}
      <div className="p-3 rounded-lg bg-surface-elevated/40 border border-border/60 text-[11px] text-muted-foreground flex items-start gap-2.5">
        <Info className="w-4 h-4 text-ai-accent shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <span className="font-semibold text-foreground">Attribution Notice &amp; Causation Safeguard</span>
          <p>
            Attributed revenue is computed via first-touch and last-touch UTM parameter matching against transactional timestamps. High surface social engagement does not imply direct commercial causation; statistical significance is evaluated per channel.
          </p>
        </div>
      </div>
    </div>
  );
}
