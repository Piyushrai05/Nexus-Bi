"use client";

import React, { useState, useEffect } from "react";
import {
  Share2,
  Sparkles,
  TrendingUp,
  AlertCircle,
  Eye,
  MousePointer,
  Heart,
  DollarSign,
  BarChart3,
  Layers,
} from "lucide-react";
import { apiClient } from "@/lib/api-client";
import { useEvidenceStore } from "@/stores/evidence-store";
import { TrustBadge } from "@/components/ui/trust-badge";
import {
  SocialPerformance,
  SocialOverviewData,
  CampaignItem,
  ContentStats,
} from "@/components/dashboard/social-performance";

export default function SocialPage() {
  const { openEvidence } = useEvidenceStore();
  const [socialOverview, setSocialOverview] = useState<SocialOverviewData>({
    total_impressions: 1480000,
    total_reach: 1180000,
    total_engagements: 68400,
    engagement_rate: 4.62,
    total_clicks: 28400,
    attributed_revenue: 384000.0,
    blended_roas: 3.42,
  });
  const [campaigns, setCampaigns] = useState<CampaignItem[]>([]);
  const [contentStats, setContentStats] = useState<ContentStats[]>([]);
  const [sentiment, setSentiment] = useState<any>({
    positive_percentage: 68.4,
    neutral_percentage: 23.2,
    negative_percentage: 8.4,
    net_sentiment_score: 60.0,
  });

  useEffect(() => {
    const fetchData = async () => {
      const [ovRes, campRes, contentRes, sentRes] = await Promise.all([
        apiClient.getSocialOverview(),
        apiClient.getCampaigns(),
        apiClient.getContentPerformance(),
        apiClient.getSentiment(),
      ]);
      setSocialOverview(ovRes.data as SocialOverviewData);
      setCampaigns(campRes.data as CampaignItem[]);
      setContentStats(contentRes.data as ContentStats[]);
      setSentiment(sentRes.data);
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-12">
      {/* 1. Header Banner */}
      <div className="space-y-4 pb-2 border-b border-border/80">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-surface-elevated border border-border text-foreground font-medium">
              <Share2 className="w-3.5 h-3.5 text-primary" />
              <span className="font-semibold">Module:</span>
              <span>Social Media Intelligence & Attribution</span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-primary/10 border border-primary/20 text-primary font-mono text-[11px] font-semibold">
              <Sparkles className="w-3 h-3 text-ai-accent" />
              <span>MULTICHANNEL ATTRIBUTION</span>
            </div>
          </div>
          <div className="flex items-center gap-3 text-muted-foreground font-mono text-[11px]">
            <span>Blended ROAS: <strong className="text-emerald-400">4.23x</strong></span>
            <span>·</span>
            <span>Net Sentiment: <strong className="text-emerald-400">+60.0</strong></span>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2.5">
              <span>Social Media Intelligence & Campaign ROI</span>
              <TrustBadge status="verified" />
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              Connect external social engagement, sentiment, and campaign ad spend directly to commercial checkout transactions.
            </p>
          </div>
        </div>
      </div>

      {/* 2. Sentiment Distribution Card */}
      <div className="bg-surface rounded-xl border border-border p-5 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-border mb-4">
          <div>
            <h3 className="text-sm font-bold text-foreground">Natural Language Brand Sentiment Analysis</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Derived from 1,250 analyzed customer comments and mentions across Instagram, LinkedIn, and TikTok.
            </p>
          </div>
          <span className="px-2.5 py-1 rounded-full text-xs font-mono font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            +60 Net Sentiment
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-surface-elevated p-3 rounded-lg border border-border">
            <span className="text-xs text-muted-foreground">Positive Sentiment</span>
            <div className="text-xl font-bold text-emerald-400 mt-1">{sentiment.positive_percentage}%</div>
            <div className="w-full bg-surface rounded-full h-1.5 mt-2">
              <div className="bg-emerald-400 h-full rounded-full" style={{ width: `${sentiment.positive_percentage}%` }} />
            </div>
          </div>
          <div className="bg-surface-elevated p-3 rounded-lg border border-border">
            <span className="text-xs text-muted-foreground">Neutral Sentiment</span>
            <div className="text-xl font-bold text-muted-foreground mt-1">{sentiment.neutral_percentage}%</div>
            <div className="w-full bg-surface rounded-full h-1.5 mt-2">
              <div className="bg-muted-foreground h-full rounded-full" style={{ width: `${sentiment.neutral_percentage}%` }} />
            </div>
          </div>
          <div className="bg-surface-elevated p-3 rounded-lg border border-border">
            <span className="text-xs text-muted-foreground">Negative Sentiment</span>
            <div className="text-xl font-bold text-danger mt-1">{sentiment.negative_percentage}%</div>
            <div className="w-full bg-surface rounded-full h-1.5 mt-2">
              <div className="bg-danger h-full rounded-full" style={{ width: `${sentiment.negative_percentage}%` }} />
            </div>
          </div>
        </div>
      </div>

      {/* 3. Social Performance Dashboard Component */}
      <SocialPerformance
        overview={socialOverview}
        campaigns={campaigns}
        contentStats={contentStats}
      />
    </div>
  );
}