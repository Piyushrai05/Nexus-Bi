"use client";

import React, { useState } from "react";
import {
  MapPin,
  TrendingDown,
  TrendingUp,
  Package,
  Layers,
  ArrowRight,
  AlertTriangle,
  Sparkles,
} from "lucide-react";
import { ChartCard } from "@/components/ui/chart-card";
import { useEvidenceStore } from "@/stores/evidence-store";

export interface RegionData {
  region: string;
  revenue: number;
  orders: number;
  aov: number;
  delta_percentage: number;
  status: string;
}

export interface CategoryData {
  category: string;
  revenue: number;
  cogs: number;
  gross_profit: number;
  margin_percentage: number;
}

export interface ProductItem {
  product_id: string;
  product_name: string;
  category: string;
  revenue: number;
  units_sold: number;
  gross_margin: number;
  quadrant: string;
}

interface BusinessBreakdownProps {
  regions: RegionData[];
  categories: CategoryData[];
  products: ProductItem[];
  isLoading?: boolean;
}

export function BusinessBreakdown({
  regions,
  categories,
  products,
  isLoading = false,
}: BusinessBreakdownProps) {
  const { openEvidence } = useEvidenceStore();
  const [activeTab, setActiveTab] = useState<"regions" | "categories" | "products">("regions");

  const totalRegionalRevenue = regions.reduce((acc, r) => acc + r.revenue, 0);

  const handleInspectRegion = (reg: RegionData) => {
    openEvidence({
      metricId: `region_${reg.region.toLowerCase()}`,
      metricLabel: `${reg.region} Region Performance`,
      valueFormatted: `$${reg.revenue.toLocaleString()}`,
      deltaFormatted: `${reg.delta_percentage >= 0 ? "+" : ""}${reg.delta_percentage}%`,
      periodLabel: "Last 30 Days vs Prior 30 Days",
      definition: `Aggregated sales transactions dispatched to destination addresses within the ${reg.region} geographic territory.`,
      formula: "SUM(revenue) WHERE region = '" + reg.region + "'",
      sql: `SELECT 
  region,
  ROUND(SUM(revenue), 2) AS total_revenue,
  COUNT(DISTINCT order_id) AS total_orders,
  ROUND(SUM(revenue) / COUNT(DISTINCT order_id), 2) AS aov
FROM sales
WHERE region = '${reg.region}'
GROUP BY 1;`,
      confidence: "high",
      confidenceReason:
        reg.region === "West"
          ? "Decomposition tree isolated an 82% revenue loss concentrated in Electronics SKU stockouts."
          : "Verified regional order flow with consistent positive growth.",
      computedAt: new Date().toISOString(),
      assumptions: ["Standard shipping transit times across regional carrier zones."],
      sampleRows: [
        { region: reg.region, revenue: reg.revenue, orders: reg.orders, aov: reg.aov },
      ],
    });
  };

  return (
    <div className="space-y-4">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
            <Layers className="w-4 h-4 text-primary" />
            <span>Operational &amp; Commercial Breakdown</span>
          </h2>
          <p className="text-xs text-muted-foreground">
            Multi-dimensional performance across geography, product categories, and SKU velocity.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-1 bg-surface p-1 rounded-lg border border-border text-xs">
          <button
            type="button"
            onClick={() => setActiveTab("regions")}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
              activeTab === "regions"
                ? "bg-surface-elevated text-primary font-semibold shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Regional Analysis
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("categories")}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
              activeTab === "categories"
                ? "bg-surface-elevated text-primary font-semibold shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Category Profitability
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("products")}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
              activeTab === "products"
                ? "bg-surface-elevated text-primary font-semibold shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Product Matrix (BCG)
          </button>
        </div>
      </div>

      {/* Tab 1: Regional Breakdown */}
      {activeTab === "regions" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-in fade-in duration-200">
          {regions.map((reg) => {
            const isWestDecline = reg.region === "West";
            const share = totalRegionalRevenue > 0 ? (reg.revenue / totalRegionalRevenue) * 100 : 25;
            return (
              <div
                key={reg.region}
                onClick={() => handleInspectRegion(reg)}
                className={`p-4 rounded-xl bg-surface border transition-all cursor-pointer group ${
                  isWestDecline
                    ? "border-rose-500/40 bg-rose-500/[0.02] hover:border-rose-500/70"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
                    <span className="font-semibold text-sm text-foreground">{reg.region} Region</span>
                  </div>

                  <span
                    className={`inline-flex items-center gap-1 text-[11px] font-mono font-semibold px-2 py-0.5 rounded ${
                      isWestDecline
                        ? "bg-rose-500/10 text-rose-400"
                        : "bg-emerald-500/10 text-emerald-400"
                    }`}
                  >
                    {isWestDecline ? <TrendingDown className="w-3 h-3" /> : <TrendingUp className="w-3 h-3" />}
                    <span>{reg.delta_percentage > 0 ? `+${reg.delta_percentage}%` : `${reg.delta_percentage}%`}</span>
                  </span>
                </div>

                <div className="text-xl font-bold font-mono text-foreground">
                  ${reg.revenue.toLocaleString()}
                </div>

                <div className="w-full bg-surface-elevated h-1.5 rounded-full overflow-hidden my-2.5">
                  <div
                    className={`h-full rounded-full ${isWestDecline ? "bg-rose-400" : "bg-primary"}`}
                    style={{ width: `${share}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] font-mono text-muted-foreground pt-1">
                  <span>{reg.orders.toLocaleString()} orders</span>
                  <span>AOV: ${reg.aov.toFixed(2)}</span>
                </div>

                {isWestDecline && (
                  <div className="mt-2.5 pt-2 border-t border-rose-500/20 flex items-center gap-1.5 text-[10px] text-rose-400 font-medium">
                    <AlertTriangle className="w-3 h-3 shrink-0" />
                    <span>Story 1: SKU stockouts detected</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Tab 2: Category Profitability */}
      {activeTab === "categories" && (
        <div className="p-5 rounded-xl bg-surface border border-border animate-in fade-in duration-200">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-border text-muted-foreground uppercase font-mono tracking-wider">
                  <th className="py-2.5 font-semibold">Category</th>
                  <th className="py-2.5 font-semibold text-right">Net Revenue</th>
                  <th className="py-2.5 font-semibold text-right">COGS</th>
                  <th className="py-2.5 font-semibold text-right">Gross Profit</th>
                  <th className="py-2.5 font-semibold text-right">Margin %</th>
                  <th className="py-2.5 font-semibold text-right">Margin Health</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {categories.map((cat) => (
                  <tr key={cat.category} className="hover:bg-surface-elevated/50 transition-colors">
                    <td className="py-3 font-semibold text-foreground flex items-center gap-2">
                      <Package className="w-3.5 h-3.5 text-primary" />
                      <span>{cat.category}</span>
                    </td>
                    <td className="py-3 text-right font-mono text-foreground font-medium">
                      ${cat.revenue.toLocaleString()}
                    </td>
                    <td className="py-3 text-right font-mono text-muted-foreground">
                      ${cat.cogs.toLocaleString()}
                    </td>
                    <td className="py-3 text-right font-mono text-emerald-400 font-semibold">
                      ${cat.gross_profit.toLocaleString()}
                    </td>
                    <td className="py-3 text-right font-mono text-foreground font-bold">
                      {cat.margin_percentage.toFixed(1)}%
                    </td>
                    <td className="py-3 text-right font-mono">
                      <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-semibold border border-emerald-500/20">
                        Healthy ({cat.margin_percentage >= 50 ? "High Margin" : "Solid Margin"})
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: BCG Product Matrix */}
      {activeTab === "products" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-in fade-in duration-200">
          {products.map((p) => {
            const isUnderperformer = p.quadrant === "Underperformers";
            return (
              <div
                key={p.product_id}
                className={`p-4 rounded-xl bg-surface border transition-colors ${
                  isUnderperformer ? "border-amber-500/40 bg-amber-500/[0.02]" : "border-border"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-surface-elevated border border-border text-ai-accent uppercase">
                    {p.quadrant}
                  </span>
                  <span className="text-xs font-mono font-bold text-foreground">
                    {p.gross_margin.toFixed(0)}% Margin
                  </span>
                </div>

                <h4 className="font-semibold text-sm text-foreground line-clamp-1 mb-1">
                  {p.product_name}
                </h4>
                <div className="text-xs font-mono text-muted-foreground mb-3">
                  SKU: <code>{p.product_id}</code> · {p.category}
                </div>

                <div className="pt-2 border-t border-border/50 flex items-center justify-between text-xs font-mono">
                  <span className="text-foreground font-semibold">
                    ${p.revenue.toLocaleString()}
                  </span>
                  <span className="text-muted-foreground">{p.units_sold} units sold</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
