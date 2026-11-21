"use client";

import React, { useEffect, useState, useCallback } from "react";
import { apiClient } from "@/lib/api-client";
import { useGlobalFilterStore } from "@/stores/global-filter-store";
import { ExecutiveHeader } from "@/components/dashboard/executive-header";
import { KpiOverview, KpiData } from "@/components/dashboard/kpi-overview";
import { RevenueProfitChart, TrendPoint } from "@/components/dashboard/revenue-profit-chart";
import {
  BusinessBreakdown,
  RegionData,
  CategoryData,
  ProductItem,
} from "@/components/dashboard/business-breakdown";
import {
  SocialPerformance,
  SocialOverviewData,
  CampaignItem,
  ContentStats,
} from "@/components/dashboard/social-performance";
import { AttentionCenter, DashboardInsight } from "@/components/dashboard/attention-center";
import {
  RecommendationCenter,
  RecommendationItem,
} from "@/components/dashboard/recommendation-center";
import { downloadDashboardCsv } from "@/lib/export-utils";
import { KPISkeleton, ChartSkeleton } from "@/components/ui/loading-skeleton";
import { ErrorState } from "@/components/ui/error-state";

export default function ExecutiveDashboardPage() {
  const { selectedRange, selectedRegion, comparePrevious } = useGlobalFilterStore();

  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>("Just now");

  // State slices
  const [kpis, setKpis] = useState<KpiData[]>([]);
  const [dailyTrend, setDailyTrend] = useState<TrendPoint[]>([]);
  const [regions, setRegions] = useState<RegionData[]>([]);
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [products, setProducts] = useState<ProductItem[]>([]);
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
  const [insights, setInsights] = useState<DashboardInsight[]>([]);
  const [recommendations, setRecommendations] = useState<RecommendationItem[]>([]);
  const [dataTrustScore, setDataTrustScore] = useState<number>(96.5);
  const [isBackendLive, setIsBackendLive] = useState<boolean>(false);

  const loadDashboardData = useCallback(async (isSilent = false) => {
    if (!isSilent) setIsLoading(true);
    else setIsRefreshing(true);
    setError(null);

    try {
      const [
        overviewRes,
        revenueRes,
        regionsRes,
        profitRes,
        productsRes,
        socialRes,
        campRes,
        contentRes,
        insightsRes,
        recsRes,
        datasetRes,
      ] = await Promise.all([
        apiClient.getExecutiveOverview({
          region: selectedRegion === "All Regions" ? undefined : selectedRegion,
        }),
        apiClient.getRevenueSeries({
          region: selectedRegion === "All Regions" ? undefined : selectedRegion,
        }),
        apiClient.getRegionalBreakdown(),
        apiClient.getProfitabilityBreakdown(),
        apiClient.getProductMatrix(),
        apiClient.getSocialOverview(),
        apiClient.getCampaigns(),
        apiClient.getContentPerformance(),
        apiClient.getDashboardInsights(),
        apiClient.getDashboardRecommendations(),
        apiClient.getDatasetMetadata("sales"),
      ]);

      setIsBackendLive(apiClient.isLive());

      setKpis((overviewRes.data as any).kpis || []);
      setDailyTrend(
        (overviewRes.data as any).daily_revenue_trend || (revenueRes.data as any) || []
      );
      setRegions(regionsRes.data as RegionData[]);
      setCategories(profitRes.data as CategoryData[]);
      setProducts(productsRes.data as ProductItem[]);
      setSocialOverview(socialRes.data as SocialOverviewData);
      setCampaigns(campRes.data as CampaignItem[]);
      setContentStats(contentRes.data as ContentStats[]);
      setInsights(insightsRes.data as DashboardInsight[]);
      setRecommendations(recsRes.data as RecommendationItem[]);
      setDataTrustScore(datasetRes.data?.data_quality_score || 96.5);

      const now = new Date();
      setLastUpdated(
        `${now.getHours().toString().padStart(2, "0")}:${now
          .getMinutes()
          .toString()
          .padStart(2, "0")}:${now.getSeconds().toString().padStart(2, "0")}`
      );
    } catch (err: any) {
      setError(err?.message || "Failed to load dashboard analytics from DuckDB backend.");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [selectedRegion]);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData, selectedRange, selectedRegion]);

  const handleExportCsv = () => {
    downloadDashboardCsv({
      organization: "NexusMart Omnichannel Group",
      dateRange: selectedRange.label,
      region: selectedRegion,
      refreshedAt: new Date().toISOString(),
      kpis: kpis.map((k) => ({
        name: k.name,
        value: k.formatted_value,
        delta: k.delta_percentage !== undefined ? `${k.delta_percentage}%` : "N/A",
        status: k.polarity,
      })),
      regionalBreakdown: regions.map((r) => ({
        region: r.region,
        revenue: r.revenue,
        orders: r.orders,
        aov: r.aov,
        delta: r.delta_percentage,
      })),
      campaigns: campaigns.map((c) => ({
        id: c.campaign_id,
        name: c.campaign_name,
        platform: c.platform,
        spend: c.spend,
        revenue: c.attributed_revenue,
        roas: c.roas,
        status: c.status,
      })),
      recommendations: recommendations.map((r) => ({
        id: r.id,
        title: r.title,
        priority: r.priority,
        owner: r.suggested_owner,
        impact: r.expected_impact || "N/A",
      })),
    });
  };

  if (error && kpis.length === 0) {
    return (
      <div className="py-12">
        <ErrorState
          title="Executive Dashboard Data Unavailable"
          message={error}
          onRetry={() => loadDashboardData()}
        />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-12">
      {/* 1. Executive Header & Controls */}
      <ExecutiveHeader
        onRefresh={() => loadDashboardData(true)}
        isRefreshing={isRefreshing}
        lastUpdated={lastUpdated}
        onExportCsv={handleExportCsv}
        datasetTrustScore={dataTrustScore}
        isBackendLive={isBackendLive}
      />

      {/* 2. KPI Overview (7 Primary Telemetry Streams) */}
      {isLoading && kpis.length === 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 7 }).map((_, i) => (
            <KPISkeleton key={i} />
          ))}
        </div>
      ) : (
        <KpiOverview kpis={kpis} isLoading={isLoading} />
      )}

      {/* 3. Primary Business Performance Trajectory (Revenue & Profit Area Chart) */}
      {isLoading && dailyTrend.length === 0 ? (
        <ChartSkeleton height="h-80" />
      ) : (
        <RevenueProfitChart data={dailyTrend} isLoading={isLoading} />
      )}

      {/* 4. Commercial & Regional Operational Breakdown */}
      <BusinessBreakdown
        regions={regions}
        categories={categories}
        products={products}
        isLoading={isLoading}
      />

      {/* 5. Unified Social & Marketing Intelligence (Vanity Trap Exposer) */}
      <SocialPerformance
        overview={socialOverview}
        campaigns={campaigns}
        contentStats={contentStats}
        isLoading={isLoading}
      />

      {/* 6. AI Insights & Business Anomalies (Attention Center) */}
      <AttentionCenter insights={insights} isLoading={isLoading} />

      {/* 7. Executive Decision Center (Actionable Recommendations) */}
      <RecommendationCenter recommendations={recommendations} isLoading={isLoading} />
    </div>
  );
}
