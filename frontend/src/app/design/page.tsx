"use client";

import React, { useState } from "react";
import {
  Sparkles,
  ShieldCheck,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  ArrowRight,
  Database,
  BarChart2,
  CheckCircle2,
  Sliders,
  Layers,
  Bot,
  CheckSquare,
  HelpCircle,
  Clock,
  RotateCcw,
  Search,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import {
  KPICard,
  InsightCard,
  ConfidenceChip,
  TrustBadge,
  AnomalyCard,
  RecommendationCard,
  ChartCard,
  DataTable,
  ChatMessage,
  KPISkeleton,
  ChartSkeleton,
  TableSkeleton,
  InsightSkeleton,
  EmptyState,
  ErrorState,
  ColumnDef,
} from "@/components/ui";
import { useEvidenceStore } from "@/stores/evidence-store";
import { createEvidenceFromCatalog } from "@/lib/semantic-layer";

// --- Sample NexusMart Datasets ---

interface OrderRecord extends Record<string, unknown> {
  orderId: string;
  customer: string;
  category: string;
  region: string;
  items: number;
  total: number;
  status: "Completed" | "Pending" | "Refunded";
  date: string;
}

const SAMPLE_ORDERS: OrderRecord[] = [
  { orderId: "ORD-9481", customer: "Apex Tech Corp", category: "Electronics", region: "West", items: 4, total: 1240.0, status: "Completed", date: "2026-11-20" },
  { orderId: "ORD-9482", customer: "Sarah Jenkins", category: "Apparel", region: "East", items: 2, total: 148.5, status: "Completed", date: "2026-11-20" },
  { orderId: "ORD-9483", customer: "Horizon Media", category: "Electronics", region: "West", items: 1, total: 420.0, status: "Refunded", date: "2026-11-19" },
  { orderId: "ORD-9484", customer: "David Chen", category: "Home Goods", region: "Central", items: 3, total: 289.0, status: "Completed", date: "2026-11-19" },
  { orderId: "ORD-9485", customer: "Elena Rostova", category: "Apparel", region: "East", items: 5, total: 340.0, status: "Completed", date: "2026-11-19" },
  { orderId: "ORD-9486", customer: "Vanguard Retail", category: "Electronics", region: "South", items: 12, total: 4890.0, status: "Completed", date: "2026-11-18" },
  { orderId: "ORD-9487", customer: "Marcus Vance", category: "Apparel", region: "West", items: 1, total: 89.0, status: "Pending", date: "2026-11-18" },
  { orderId: "ORD-9488", customer: "Quantum Labs", category: "Electronics", region: "West", items: 6, total: 2150.0, status: "Refunded", date: "2026-11-17" },
  { orderId: "ORD-9489", customer: "Chloe Bennett", category: "Home Goods", region: "East", items: 2, total: 175.0, status: "Completed", date: "2026-11-17" },
  { orderId: "ORD-9490", customer: "Nordic Goods Inc", category: "Apparel", region: "Central", items: 8, total: 890.0, status: "Completed", date: "2026-11-16" },
];

const REVENUE_SERIES = [
  { date: "Oct 21", revenue: 42000, baseline: 40000, adSpend: 8200 },
  { date: "Oct 25", revenue: 44500, baseline: 41000, adSpend: 8400 },
  { date: "Oct 29", revenue: 48200, baseline: 42000, adSpend: 9100 },
  { date: "Nov 02", revenue: 51000, baseline: 43000, adSpend: 9800 },
  { date: "Nov 06", revenue: 47800, baseline: 43500, adSpend: 9200 },
  { date: "Nov 10", revenue: 41200, baseline: 44000, adSpend: 9400 }, // Drop occurs
  { date: "Nov 14", revenue: 38400, baseline: 45000, adSpend: 9500 }, // Trough
  { date: "Nov 18", revenue: 46100, baseline: 45500, adSpend: 10200 }, // Recovery
  { date: "Nov 21", revenue: 52400, baseline: 46000, adSpend: 11000 },
];

const SOCIAL_CAMPAIGN_SERIES = [
  { channel: "Instagram", engagements: 48200, clicks: 8400, conversionRate: 3.4 },
  { channel: "TikTok", engagements: 89400, clicks: 12100, conversionRate: 1.8 },
  { channel: "LinkedIn", engagements: 14200, clicks: 3900, conversionRate: 5.2 },
  { channel: "YouTube", engagements: 34100, clicks: 6100, conversionRate: 4.1 },
  { channel: "X / Twitter", engagements: 22800, clicks: 2900, conversionRate: 1.2 },
];

export default function DesignSystemPage() {
  const { openEvidence } = useEvidenceStore();
  const [activeTab, setActiveTab] = useState("all");
  const [chartGranularity, setChartGranularity] = useState<"day" | "week" | "month">("day");
  const [showInteractiveStates, setShowInteractiveStates] = useState(false);

  const handleTestEvidence = (metricId: string, val: string, delta: string) => {
    openEvidence(
      createEvidenceFromCatalog(metricId, {
        valueFormatted: val,
        deltaFormatted: delta,
      })
    );
  };

  const columns: ColumnDef<OrderRecord>[] = [
    { id: "orderId", header: "Order ID", accessorKey: "orderId", width: "120px" },
    { id: "customer", header: "Customer Name", accessorKey: "customer" },
    { id: "category", header: "Category", accessorKey: "category" },
    { id: "region", header: "Region", accessorKey: "region" },
    {
      id: "items",
      header: "Items",
      accessorKey: "items",
      align: "right",
      format: (val) => <span className="tabular-nums font-mono">{String(val)}</span>,
    },
    {
      id: "total",
      header: "Net Total",
      accessorKey: "total",
      align: "right",
      format: (val) => (
        <span className="font-mono font-semibold tabular-nums text-foreground">
          ${Number(val).toFixed(2)}
        </span>
      ),
    },
    {
      id: "status",
      header: "Status",
      accessorKey: "status",
      align: "center",
      format: (val) => {
        const s = String(val);
        const color =
          s === "Completed"
            ? "text-success bg-success/10 border-success/20"
            : s === "Refunded"
            ? "text-danger bg-danger/10 border-danger/20"
            : "text-warning bg-warning/10 border-warning/20";
        return (
          <span className={`inline-block px-2 py-0.5 rounded-full border text-[10px] font-mono font-medium ${color}`}>
            {s}
          </span>
        );
      },
    },
    { id: "date", header: "Date", accessorKey: "date", align: "right" },
  ];

  return (
    <div className="space-y-12 pb-24 animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="border-b border-border pb-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-semibold font-mono mb-2">
              Phase 2 Component Library &amp; Verification
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Design System Showcase &amp; Component Gallery
            </h1>
            <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
              Production-grade, reusable UI building blocks designed for high information density,
              non-negotiable data trust, and closed-loop decision intelligence.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowInteractiveStates(!showInteractiveStates)}
              className="px-3 py-1.5 rounded-lg bg-surface-elevated border border-border text-xs font-medium text-foreground hover:border-primary/40 transition-colors"
            >
              Toggle Skeleton &amp; Error States: {showInteractiveStates ? "ON" : "OFF"}
            </button>
            <button
              onClick={() => handleTestEvidence("net_revenue", "$1,248,500", "+14.2%")}
              className="px-3.5 py-1.5 rounded-lg bg-primary text-white text-xs font-semibold hover:bg-primary/90 transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Test Evidence Drawer</span>
            </button>
          </div>
        </div>
      </div>

      {/* SECTION 1: KPI CARDS (POLARITY-AWARE) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-foreground flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-primary" />
              1. KPI Cards (With Metric Polarity, Sparklines &amp; Targets)
            </h2>
            <p className="text-xs text-muted-foreground">
              Demonstrates revenue increasing (good/green), churn increasing (bad/red), CAC dropping (good/green), and social engagement.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Revenue UP -> Positive (Green) */}
          <KPICard
            id="net_revenue"
            title="Net Revenue"
            value={1248500}
            type="currency"
            delta={14.2}
            polarity="up-is-good"
            periodLabel="vs prev 30d"
            description="Net top-line revenue after deductions, discounts, and customer refunds."
            sparkline={[38, 42, 45, 41, 48, 52, 58, 62, 59, 68]}
            targetValue={1400000}
            isLoading={showInteractiveStates}
          />

          {/* Churn Rate UP -> Negative (Red despite delta > 0!) */}
          <KPICard
            id="churn_rate"
            title="Customer Churn Rate"
            value={4.8}
            type="percent"
            delta={1.2}
            polarity="down-is-good"
            periodLabel="vs prev 30d"
            description="Percentage of recurring subscription customers who canceled within the 30-day window."
            sparkline={[3.2, 3.4, 3.5, 3.8, 3.9, 4.1, 4.5, 4.8]}
            isLoading={showInteractiveStates}
          />

          {/* Blended CAC DOWN -> Positive (Green despite delta < 0!) */}
          <KPICard
            id="blended_cac"
            title="Blended CAC"
            value={42.8}
            type="currency"
            delta={-8.5}
            polarity="down-is-good"
            periodLabel="vs prev 30d"
            description="Fully loaded customer acquisition cost across Meta, Google, and TikTok spend."
            sparkline={[54, 52, 49, 48, 46, 45, 44, 42.8]}
            targetValue={40.0}
            isLoading={showInteractiveStates}
          />

          {/* Social Engagement Rate -> Ratio / Percentage */}
          <KPICard
            id="engagement_rate"
            title="Social Engagement Rate"
            value={4.65}
            type="percent"
            delta={0.8}
            polarity="up-is-good"
            periodLabel="vs prev 30d"
            description="Aggregate interactions (likes, shares, comments, saves) divided by impressions."
            sparkline={[3.8, 3.9, 4.1, 4.0, 4.3, 4.5, 4.65]}
            isLoading={showInteractiveStates}
          />
        </div>
      </section>

      {/* SECTION 2: INSIGHT CARDS (AI WITH SIGNATURE GLOW) */}
      <section className="space-y-4">
        <div>
          <h2 className="text-base font-semibold text-foreground flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-ai-accent" />
            2. AI Insight Cards (Grounded, Differentiated Impact &amp; Evidence)
          </h2>
          <p className="text-xs text-muted-foreground">
            Signature indigo-to-cyan border glow. Differentiates positive opportunities, negative business risks, and strategic trends.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Opportunity Insight */}
          <InsightCard
            title="Instagram Spring Campaign Drives +24% Surge in Apparel"
            impact="positive_opportunity"
            confidence="high"
            confidenceReason="Cross-correlation with Shopify inventory sales confirms 3.84x MER across 4,200 tracked orders."
            explanation={
              <span>
                Ad creative <strong>#SpringStyle2026</strong> generated an unprecedented <strong>3.84x blended ROAS</strong>. Apparel sales increased by <strong>$148,200</strong> in the East Region over the last 14 days.
              </span>
            }
            supportingEvidence="Direct UTM touchpoints matched against Shopify completed checkout IDs with 99.4% precision."
            relatedKpi="net_revenue"
            onCreateDecision={() => alert("Redirecting to Decision Center to draft budget expansion...")}
          />

          {/* Negative Risk Insight */}
          <InsightCard
            title="West Region Electronics SKU Stockouts Trigger 18.5% Revenue Dip"
            impact="negative_risk"
            confidence="high"
            confidenceReason="Warehouse supply logs show zero stock for 3 flagship monitors between Nov 10 and Nov 17."
            explanation={
              <span>
                Net sales in the <strong>West Region</strong> fell by <strong>-$38,400</strong>. Automated decomposition confirms that 84% of the loss stemmed from <strong>Electronics stockouts</strong>, exacerbated by a spike in return requests.
              </span>
            }
            supportingEvidence="Stripe refund ledger records show 42 chargeback requests citing shipping delay."
            relatedKpi="order_volume"
            onCreateDecision={() => alert("Drafting inventory reallocation decision card...")}
          />
        </div>
      </section>

      {/* SECTION 3: CONFIDENCE CHIPS & TRUST BADGES */}
      <section className="space-y-4">
        <div>
          <h2 className="text-base font-semibold text-foreground flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-primary" />
            3. Confidence Chips &amp; Data Trust Badges
          </h2>
          <p className="text-xs text-muted-foreground">
            Clear visual transparency: hover any chip to inspect the underlying statistical and governance rationale.
          </p>
        </div>

        <div className="p-5 rounded-xl border border-border bg-surface space-y-6">
          <div className="space-y-2">
            <span className="text-xs font-semibold text-muted-foreground uppercase font-mono tracking-wider">
              Confidence Tiers (Calculated, Not Fabricated):
            </span>
            <div className="flex flex-wrap items-center gap-3">
              <ConfidenceChip level="high" score={98} />
              <ConfidenceChip level="medium" score={76} />
              <ConfidenceChip level="low" score={42} />
              <ConfidenceChip level="insufficient_evidence" />
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-border/60">
            <span className="text-xs font-semibold text-muted-foreground uppercase font-mono tracking-wider">
              Data Trust &amp; Governance Statuses:
            </span>
            <div className="flex flex-wrap items-center gap-3">
              <TrustBadge status="verified" score={96} source="Postgres Core" lastUpdated="2m ago" showDetails />
              <TrustBadge status="warning" score={74} source="Meta Ads Sync" lastUpdated="1h ago" showDetails />
              <TrustBadge status="unverified" score={50} source="CSV Upload" lastUpdated="Just now" showDetails />
              <TrustBadge status="stale" score={62} source="X Developer API" lastUpdated="26h ago" showDetails />
              <TrustBadge status="incomplete" score={45} source="CRM Export" lastUpdated="3h ago" showDetails />
              <TrustBadge status="failed_validation" score={18} source="Legacy DB" lastUpdated="5m ago" showDetails />
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: ANOMALY CARDS */}
      <section className="space-y-4">
        <div>
          <h2 className="text-base font-semibold text-foreground flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-warning" />
            4. Anomaly Cards (Root-Cause Decomposition &amp; Severity)
          </h2>
          <p className="text-xs text-muted-foreground">
            Automated detection of deviations exceeding 2.58 standard deviations (p &lt; 0.01).
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AnomalyCard
            title="Unexpected Revenue Decline in West Region Electronics"
            metric="Net Revenue"
            expectedValue="$45,000 / day"
            actualValue="$38,400 / day"
            deviationPercent={-18.5}
            severity="critical"
            isUnfavorable={true}
            detectedAt="Detected Nov 14, 09:15 UTC"
            contributingFactors={[
              "West Region accounted for 82% of the aggregate national drop",
              "Top 3 Electronics SKUs suffered inventory depletion (stock = 0)",
              "Refund rate surged from 2.1% to 8.4% due to fulfillment delays",
            ]}
            confidence="high"
            confidenceReason="Audited against 1,420 regional Stripe transactions and warehouse WMS logs."
          />

          <AnomalyCard
            title="Spike in Brand Mentions with Negative Sentiment Shift"
            metric="Aspect Sentiment (Support)"
            expectedValue="+74 Net Sentiment"
            actualValue="-18 Net Sentiment"
            deviationPercent={-92.0}
            severity="high"
            isUnfavorable={true}
            detectedAt="Detected yesterday, 18:40 UTC"
            contributingFactors={[
              "TikTok creator video (1.2M views) highlighted broken zipper latch",
              "Customer support queue wait time increased from 4m to 48m",
              "Aspect-based NLP identified 'Support Response' as primary negative topic",
            ]}
            confidence="medium"
            confidenceReason="NLP entity extraction across 8,400 comments with 84% classification precision."
          />
        </div>
      </section>

      {/* SECTION 5: RECOMMENDATION CARDS (CLOSED-LOOP DECISION) */}
      <section className="space-y-4">
        <div>
          <h2 className="text-base font-semibold text-foreground flex items-center gap-2">
            <CheckSquare className="w-4 h-4 text-success" />
            5. Decision Recommendation Cards (Human-in-the-Loop Governance)
          </h2>
          <p className="text-xs text-muted-foreground">
            Turns passive data into audited actions. Try clicking &quot;Approve&quot; or &quot;Reject&quot; to test interactive status workflows.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <RecommendationCard
            id="DEC-01"
            title="Reallocate $15,000 Ad Budget to Instagram Spring Campaign"
            businessProblem="TikTok top-of-funnel ad spend is generating high views but poor 1.8% conversion, while Instagram Apparel ads are generating 3.84x ROAS and running out of daily budget."
            supportingEvidence="Econometric lead-lag model shows Instagram ROAS is 2.1x higher per dollar than TikTok with a 2-day conversion lag."
            suggestedAction="Reduce TikTok daily budget by 40% ($15,000) and shift directly into Instagram high-performing Apparel Ad Sets."
            expectedImpact="+$42,000 Net Projected Revenue"
            priority="P1"
            confidence="high"
            confidenceReason="Backtested against past 60 days of conversion attribution with 94% forecast reliability."
            owner={{ name: "Elena Rostova", role: "Growth Lead" }}
            deadline="Execute by Friday"
            initialStatus="pending"
          />

          <RecommendationCard
            id="DEC-02"
            title="Emergency Air-Freight Restock for West Region Electronics SKUs"
            businessProblem="3 flagship monitor SKUs are completely stocked out in the California fulfillment center, costing an estimated $8,200 in lost orders daily."
            supportingEvidence="Daily lost checkout rate jumped 14% on out-of-stock SKU product pages."
            suggestedAction="Authorize expedited air freight for 400 units from the Central depot to the West fulfillment hub."
            expectedImpact="+$32,800 Revenue Preservation"
            priority="P0"
            confidence="high"
            confidenceReason="Based on historical demand run-rate of 45 units/day at $180 average order value."
            owner={{ name: "Marcus Vance", role: "Operations VP" }}
            deadline="Execute within 24 hours"
            initialStatus="approved"
          />
        </div>
      </section>

      {/* SECTION 6: CHART CARDS (RECHARTS + TOOLBARS) */}
      <section className="space-y-4">
        <div>
          <h2 className="text-base font-semibold text-foreground flex items-center gap-2">
            <Layers className="w-4 h-4 text-primary" />
            6. Reusable Chart Cards (With Fullscreen, Range &amp; AI Explain)
          </h2>
          <p className="text-xs text-muted-foreground">
            Unified container supporting Line, Area, and Bar charts with interactive granularity controls.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Revenue Trend vs Baseline */}
          <ChartCard
            title="Net Revenue Trend vs. Statistical Baseline"
            subtitle="Daily net revenue tracking with historical anomaly window shaded"
            periodLabel="Last 30 Days"
            granularity={chartGranularity}
            onGranularityChange={setChartGranularity}
            onExplainWithAi={() =>
              alert("AI Analysis: Revenue experienced an 18.5% trough between Nov 10-14 before recovering.")
            }
            onExportCsv={() => alert("Exporting 30-day revenue CSV...")}
            isLoading={showInteractiveStates}
          >
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={REVENUE_SERIES} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="revenueGlow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366F1" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#6366F1" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#23262F" vertical={false} />
                <XAxis dataKey="date" stroke="#6B7080" fontSize={11} tickLine={false} />
                <YAxis stroke="#6B7080" fontSize={11} tickLine={false} tickFormatter={(v: any) => `$${v / 1000}k`} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#111318", borderColor: "#23262F", borderRadius: "8px", fontSize: "12px" }}
                  formatter={(value: any) => [`$${Number(value).toLocaleString()}`, "Revenue"]}
                />
                <Area type="monotone" dataKey="revenue" stroke="#6366F1" strokeWidth={2.5} fill="url(#revenueGlow)" name="Net Revenue" />
                <Line type="monotone" dataKey="baseline" stroke="#A0A4B0" strokeDasharray="4 4" strokeWidth={1.5} dot={false} name="Baseline" />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Social Channels Conversion */}
          <ChartCard
            title="Social Channel Conversion Performance"
            subtitle="Engagements vs Conversion Rate across integrated marketing channels"
            periodLabel="Campaign Wave 1"
            onExplainWithAi={() =>
              alert("AI Analysis: LinkedIn holds the highest conversion rate (5.2%) despite lower volume.")
            }
            isLoading={showInteractiveStates}
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={SOCIAL_CAMPAIGN_SERIES} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#23262F" vertical={false} />
                <XAxis dataKey="channel" stroke="#6B7080" fontSize={11} tickLine={false} />
                <YAxis stroke="#6B7080" fontSize={11} tickLine={false} tickFormatter={(v: any) => `${v / 1000}k`} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#111318", borderColor: "#23262F", borderRadius: "8px", fontSize: "12px" }}
                  formatter={(value: any) => [Number(value).toLocaleString(), "Engagements"]}
                />
                <Bar dataKey="engagements" fill="#22D3EE" radius={[4, 4, 0, 0]} name="Engagements" />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      </section>

      {/* SECTION 7: DATA TABLES */}
      <section className="space-y-4">
        <div>
          <h2 className="text-base font-semibold text-foreground flex items-center gap-2">
            <Database className="w-4 h-4 text-primary" />
            7. Data Table (Strict Generics, Sortable, Searchable &amp; Paginated)
          </h2>
          <p className="text-xs text-muted-foreground">
            Accessible table with real-time search, column sorting, pagination, and formatted deltas.
          </p>
        </div>

        <DataTable
          title="Recent NexusMart Orders Telemetry"
          subtitle="Direct source-of-truth transactional ledger with status tagging"
          columns={columns}
          data={SAMPLE_ORDERS}
          pageSize={5}
          searchPlaceholder="Search order ID, customer, region..."
          selectable
          isLoading={showInteractiveStates}
        />
      </section>

      {/* SECTION 8: CHAT MESSAGES (AI ANALYST CONVERSATION) */}
      <section className="space-y-4">
        <div>
          <h2 className="text-base font-semibold text-foreground flex items-center gap-2">
            <Bot className="w-4 h-4 text-ai-accent" />
            8. Chat Messages (AI Analyst Conversation Interface)
          </h2>
          <p className="text-xs text-muted-foreground">
            Complete with Facts vs Assumptions separation, DuckDB SQL inspector, and follow-up chips.
          </p>
        </div>

        <div className="p-5 rounded-xl border border-border bg-surface-elevated/50 space-y-4 max-w-3xl">
          {/* User Message */}
          <ChatMessage
            role="user"
            content="Why did net revenue in the West Region drop during the middle of the month?"
            timestamp="10:42 AM"
          />

          {/* AI Response Message */}
          <ChatMessage
            role="assistant"
            content="Based on deterministic SQL decomposition across the orders ledger, West Region net revenue dropped by -$38,400 (-18.5%) between Nov 10 and Nov 17. 

The primary cause was inventory stockouts in 3 top Electronics SKUs (UltraWide 34&quot; Monitors), which reduced daily order volume by 42%. Additionally, delayed delivery complaints triggered 14 customer refunds."
            timestamp="10:42 AM"
            confidence="high"
            confidenceReason="Validated against 142,850 rows in orders_master.parquet with zero schema collisions."
            facts={[
              "West Region sales dropped from $45,000/day to $38,400/day on Nov 10",
              "Inventory on SKUs MON-34A reached 0 units on Nov 09",
              "14 chargebacks were filed citing fulfillment delays",
            ]}
            assumptions={[
              "Assumed regional customer attribution based on billing zip codes",
              "Excluded pending uncaptured authorization holds",
            ]}
            sqlSnippet={`SELECT 
  DATE_TRUNC('day', order_date) AS date,
  region,
  category,
  SUM(subtotal - refund_amount) AS net_revenue
FROM orders_master
WHERE region = 'West' 
  AND order_date BETWEEN '2026-11-01' AND '2026-11-20'
GROUP BY 1, 2, 3
ORDER BY 1;`}
            followUpChips={[
              "What is the projected revenue recovery if restocked?",
              "Show me return rate by SKU category",
              "Draft an inventory restock decision",
            ]}
            onSelectFollowUp={(prompt) => alert(`Executing follow-up query: "${prompt}"`)}
          />

          {/* Loading "Thinking" State Message */}
          {showInteractiveStates && (
            <ChatMessage
              role="assistant"
              content=""
              isLoading={true}
              loadingStep="Reading schema → Executing verified DuckDB SQL → Validating numbers..."
            />
          )}
        </div>
      </section>

      {/* SECTION 9: LOADING, EMPTY & ERROR STATES */}
      <section className="space-y-4">
        <div>
          <h2 className="text-base font-semibold text-foreground flex items-center gap-2">
            <RotateCcw className="w-4 h-4 text-warning" />
            9. State Components (Loading Skeletons, Empty &amp; Error States)
          </h2>
          <p className="text-xs text-muted-foreground">
            Never a raw error or blank layout. Illustrated, informative, and actionable.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl border border-border bg-surface space-y-2">
            <span className="text-xs font-semibold text-muted-foreground uppercase font-mono">
              KPI Loading Skeleton
            </span>
            <KPISkeleton />
          </div>

          <div className="p-4 rounded-xl border border-border bg-surface space-y-2">
            <span className="text-xs font-semibold text-muted-foreground uppercase font-mono">
              Empty State Component
            </span>
            <EmptyState
              title="No Campaigns Active"
              description="Connect your Meta or TikTok accounts, or upload an ad spend CSV to track ROAS."
              primaryAction={{
                label: "Import Campaign CSV",
                onClick: () => alert("Opening CSV Uploader..."),
              }}
            />
          </div>

          <div className="p-4 rounded-xl border border-border bg-surface space-y-2">
            <span className="text-xs font-semibold text-muted-foreground uppercase font-mono">
              Error State with Trace
            </span>
            <ErrorState
              title="Schema Join Mismatch"
              message="The column 'customer_id' could not be joined with foreign key 'client_uuid'."
              technicalDetails="DuckDB Error: Binder Error: Table 'customers' does not have a column named 'customer_id' at line 4 column 12."
              onRetry={() => alert("Retrying schema resolution...")}
            />
          </div>
        </div>
      </section>
    </div>
  );
}
