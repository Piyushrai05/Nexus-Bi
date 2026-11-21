"use client";

import React from "react";
import { AlertTriangle, Sparkles, ShieldAlert, ArrowRight, Layers } from "lucide-react";
import { AnomalyCard } from "@/components/ui/anomaly-card";
import { InsightCard } from "@/components/ui/insight-card";
import { useEvidenceStore } from "@/stores/evidence-store";

export interface DashboardInsight {
  id: string;
  title: string;
  metric: string;
  timeframe: string;
  severity: "critical" | "warning" | "info";
  change_magnitude: string;
  summary: string;
  evidence_detail: string;
  contributing_factors: string[];
  confidence_tier: "high" | "medium" | "low";
  recommended_investigation: string;
  is_synthetic_demo?: boolean;
}

interface AttentionCenterProps {
  insights: DashboardInsight[];
  isLoading?: boolean;
}

export function AttentionCenter({ insights, isLoading = false }: AttentionCenterProps) {
  const { openEvidence } = useEvidenceStore();

  const handleInvestigateWest = () => {
    openEvidence({
      metricId: "west_electronics_decline",
      metricLabel: "West Region Electronics Revenue Dip (-18.5%)",
      valueFormatted: "$36,700.00 / day",
      deltaFormatted: "-18.5% vs $45,000 baseline",
      periodLabel: "Last 14 Days (Nov 09 – Nov 16)",
      definition:
        "Multi-dimensional waterfall decomposition isolating root cause drivers behind the regional sales dip.",
      formula: "Observed Revenue - Baseline Revenue = Factor Mix Effects + Fulfillment Effects",
      sql: `SELECT 
  category,
  sku,
  SUM(revenue) AS current_rev,
  AVG(units_in_stock) AS avg_stock,
  SUM(CASE WHEN is_returned THEN 1 ELSE 0 END) AS refund_count
FROM sales
WHERE region = 'West' AND order_date BETWEEN '2026-11-09' AND '2026-11-16'
GROUP BY 1, 2
ORDER BY current_rev ASC;`,
      confidence: "high",
      confidenceReason:
        "Decomposition confirms 82% of aggregate decline was concentrated in flagship Electronics SKUs with zero inventory logged.",
      computedAt: new Date().toISOString(),
      assumptions: [
        "Unfulfilled checkout attempts due to out-of-stock SKUs calculated from cart abandonment logs",
        "Carrier delay refunds isolated via delivery SLA timestamp breaches",
      ],
      sampleRows: [
        { sku: "SKU-AUD-01", name: "Studio Headphones", stock: 0, revenue_impact: -4200.0 },
        { sku: "SKU-AUD-02", name: "Wireless Earbuds", stock: 0, revenue_impact: -2600.0 },
        { factor: "Carrier Transit Backlog", refunds: 14, revenue_impact: -1500.0 },
      ],
    });
  };

  const handleInvestigateInstagram = () => {
    openEvidence({
      metricId: "instagram_roas_trap",
      metricLabel: "Instagram Campaign Vanity Metric Trap",
      valueFormatted: "1.54x ROAS",
      deltaFormatted: "Spend: $14,500 | Attributed: $22,400",
      periodLabel: "Campaign Wave 1 (Instagram)",
      definition: "Attributed revenue divided by direct advertising spend across UTM-tagged channels.",
      formula: "Attributed Revenue ($22,400) / Direct Ad Spend ($14,500) = 1.54x",
      sql: `SELECT 
  platform,
  impressions,
  clicks,
  conversions,
  spend,
  attributed_revenue,
  ROUND(attributed_revenue / spend, 2) AS roas,
  ROUND(spend / NULLIF(conversions, 0), 2) AS cac
FROM campaigns
WHERE campaign_id = 'CAMP-001';`,
      confidence: "high",
      confidenceReason:
        "High engagement rate (8.2%) accompanied by low purchase conversion rate (1.68%), resulting in suboptimal $46.77 CAC.",
      computedAt: new Date().toISOString(),
      assumptions: ["Attribution window: 7-day click, 1-day view"],
      sampleRows: [
        { campaign: "CAMP-001", impressions: 580000, clicks: 18500, conversions: 310, roas: 1.54 },
      ],
    });
  };

  const handleInvestigateDataQuality = () => {
    openEvidence({
      metricId: "data_quality_imperfect_sales",
      metricLabel: "5D Data Trust Warning: imperfect_sales.parquet",
      valueFormatted: "68.4 / 100",
      deltaFormatted: "-28.1 pts vs Clean Sales (96.5)",
      periodLabel: "Current Ingestion Snapshot",
      definition:
        "Weighted score across Completeness (30%), Uniqueness (25%), Validity (20%), Consistency (15%), Freshness (10%).",
      formula:
        "Score = (Completeness × 0.30) + (Uniqueness × 0.25) + (Validity × 0.20) + (Consistency × 0.15) + (Freshness × 0.10)",
      sql: `SELECT 
  COUNT(*) as total_rows,
  COUNT(DISTINCT order_id) as unique_keys,
  SUM(CASE WHEN customer_id IS NULL THEN 1 ELSE 0 END) as null_customers,
  SUM(CASE WHEN revenue > 50000 THEN 1 ELSE 0 END) as revenue_outliers
FROM 'imperfect_sales.parquet';`,
      confidence: "high",
      confidenceReason:
        "Identified 25 duplicate rows, 40 null customer IDs, and 5 extreme price outliers ($999,999).",
      computedAt: new Date().toISOString(),
      assumptions: ["Tukey IQR boundary set at 5x interquartile range ceiling"],
      sampleRows: [
        { issue: "Duplicate row order_id ORD-9481", occurrences: 2 },
        { issue: "Null customer_id in checkout", occurrences: 40 },
        { issue: "Extreme outlier unit_price $999,999", occurrences: 5 },
      ],
    });
  };

  return (
    <div className="space-y-4">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-foreground flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <span>What Needs Your Attention?</span>
            <span className="px-2 py-0.5 rounded-full bg-surface-elevated border border-border text-[10px] font-mono text-muted-foreground">
              3 Verified Findings
            </span>
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Statistical deviations and market anomalies requiring executive awareness or remediation.
          </p>
        </div>

        <span className="text-[11px] font-mono text-ai-accent hidden sm:inline-block">
          Evidence-Backed &amp; Traceable
        </span>
      </div>

      {/* Grid of Anomalies & Insights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Finding 1: West Region Decline */}
        <AnomalyCard
          title="West Region Electronics Revenue Dip (-18.5%)"
          metric="Net Revenue (West Region)"
          expectedValue="$45,000 / day"
          actualValue="$36,700 / day"
          deviationPercent={-18.5}
          severity="critical"
          isUnfavorable={true}
          detectedAt="Nov 16, 2026"
          contributingFactors={[
            "SKU stockout in Studio Headphones & Earbuds (-$6,800 impact, 82% share)",
            "14 carrier delay refund chargebacks (-$1,500 impact, 18% share)",
          ]}
          confidence="high"
          confidenceReason="Direct correlation with zero warehouse stock logs across 2 flagship SKUs."
          onInvestigate={handleInvestigateWest}
        />

        {/* Finding 2: Instagram Vanity Metric Trap */}
        <AnomalyCard
          title="The Instagram Vanity Metric Trap (1.54x ROAS)"
          metric="Marketing ROAS vs Engagement"
          expectedValue="3.50x target"
          actualValue="1.54x actual"
          deviationPercent={-56.0}
          severity="high"
          isUnfavorable={true}
          detectedAt="Nov 18, 2026"
          contributingFactors={[
            "High surface reach (580k views, 8.2% engagement) failed on purchase completion",
            "LinkedIn B2B counterpart achieved 4.80x ROAS with 5.83% conversion rate",
          ]}
          confidence="high"
          confidenceReason="Attribution analysis shows high impression volume with sub-par $46.77 CAC."
          onInvestigate={handleInvestigateInstagram}
        />

        {/* Finding 3: Data Quality Warning */}
        <AnomalyCard
          title="Data Quality Advisory: Uncleaned Sales Dump"
          metric="5D Data Trust Score"
          expectedValue="95.0+ verified"
          actualValue="68.4 score"
          deviationPercent={-28.0}
          severity="medium"
          isUnfavorable={true}
          detectedAt="Ingestion Audit"
          contributingFactors={[
            "25 duplicate transaction rows detected in imperfect_sales.parquet",
            "40 null customer IDs and 5 severe price outliers ($999,999)",
          ]}
          confidence="high"
          confidenceReason="Audit completed across Completeness, Uniqueness, and Validity dimensions."
          onInvestigate={handleInvestigateDataQuality}
        />
      </div>
    </div>
  );
}
