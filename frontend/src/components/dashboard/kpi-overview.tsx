"use client";

import React from "react";
import { KPICard, MetricType, MetricPolarity } from "@/components/ui/kpi-card";
import { createEvidenceFromCatalog, METRIC_CATALOG } from "@/lib/semantic-layer";
import { useGlobalFilterStore } from "@/stores/global-filter-store";

export interface KpiData {
  id: string;
  name: string;
  current_value: number;
  formatted_value: string;
  previous_value?: number;
  delta_percentage?: number;
  polarity: string;
  sparkline?: number[];
  target_value?: number;
}

interface KpiOverviewProps {
  kpis: KpiData[];
  isLoading?: boolean;
}

export function KpiOverview({ kpis, isLoading = false }: KpiOverviewProps) {
  const { comparePrevious, selectedRange } = useGlobalFilterStore();

  // Map backend KPI id to frontend display config
  const KPI_CONFIG: Record<
    string,
    {
      title: string;
      type: MetricType;
      polarity: MetricPolarity;
      description: string;
    }
  > = {
    net_revenue: {
      title: "Net Revenue",
      type: "currency",
      polarity: "up-is-good",
      description: "Finalized revenue after returns, allowances, and applied checkout discounts.",
    },
    gross_profit: {
      title: "Gross Profit",
      type: "currency",
      polarity: "up-is-good",
      description: "Net revenue minus cost of goods sold (COGS) across all settled sales orders.",
    },
    profit_margin: {
      title: "Profit Margin",
      type: "percent",
      polarity: "up-is-good",
      description: "Gross margin expressed as a percentage of top-line revenue.",
    },
    order_volume: {
      title: "Total Orders",
      type: "integer",
      polarity: "up-is-good",
      description: "Total completed transactions across all regional distribution warehouses.",
    },
    aov: {
      title: "Average Order Value",
      type: "currency",
      polarity: "up-is-good",
      description: "Mean checkout order amount across completed purchases.",
    },
    repeat_rate: {
      title: "Repeat Purchase Rate",
      type: "percent",
      polarity: "up-is-good",
      description: "Percentage of customers who completed two or more lifetime transactions.",
    },
    marketing_roas: {
      title: "Marketing ROAS",
      type: "ratio",
      polarity: "up-is-good",
      description: "Blended return on advertising spend: Attributed Revenue divided by Total Ad Spend.",
    },
  };

  const periodText = comparePrevious ? `vs prior ${selectedRange.label}` : "Prior comparison off";

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-xs uppercase font-mono tracking-wider font-semibold text-muted-foreground">
          Core Financial &amp; Marketing Performance KPIs (7 Telemetry Streams)
        </h2>
        <span className="text-[11px] font-mono text-muted-foreground">
          Click any card to inspect SQL provenance &amp; mathematical lineage
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi) => {
          const cfg = KPI_CONFIG[kpi.id] || {
            title: kpi.name,
            type: "currency" as MetricType,
            polarity: (kpi.polarity as MetricPolarity) || "up-is-good",
            description: "Calculated operational metric from underlying system telemetry.",
          };

          const catalogMeta = METRIC_CATALOG[kpi.id];
          const evidencePayload = catalogMeta
            ? createEvidenceFromCatalog(kpi.id, {
                valueFormatted: kpi.formatted_value,
                deltaFormatted:
                  kpi.delta_percentage !== undefined
                    ? `${kpi.delta_percentage >= 0 ? "+" : ""}${kpi.delta_percentage}%`
                    : undefined,
                periodLabel: periodText,
              })
            : undefined;

          return (
            <KPICard
              key={kpi.id}
              id={kpi.id}
              title={cfg.title}
              value={kpi.current_value}
              type={cfg.type}
              previousValue={comparePrevious ? kpi.previous_value : undefined}
              delta={comparePrevious ? kpi.delta_percentage : undefined}
              polarity={cfg.polarity}
              periodLabel={comparePrevious ? periodText : "Comparison unavailable"}
              description={cfg.description}
              sparkline={kpi.sparkline}
              targetValue={kpi.target_value}
              evidence={evidencePayload}
              isLoading={isLoading}
            />
          );
        })}
      </div>
    </div>
  );
}
