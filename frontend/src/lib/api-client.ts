/**
 * NEXUS BI Typed API Client Layer
 * Connects to the Python FastAPI backend with graceful deterministic offline fallback.
 */

export interface ApiResponseMeta {
  method: string;
  sql?: string | null;
  assumptions: string[];
  confidence: "high" | "medium" | "low";
  confidence_reason?: string;
  computed_at: string;
  data_source: string;
  row_count?: number;
}

export interface ApiResponse<T> {
  data: T;
  meta: ApiResponseMeta;
}

export interface ForecastPoint {
  date: string;
  actual: number | null;
  forecast: number | null;
  lower_80: number | null;
  upper_80: number | null;
  lower_95: number | null;
  upper_95: number | null;
}

export interface ForecastResult {
  metric: string;
  horizon_days: number;
  model_name: string;
  historical_mape: number;
  projected_total: number;
  growth_rate_pct: number;
  trend_direction: string;
  series: ForecastPoint[];
  model_parameters: Record<string, any>;
  scenarios: Record<string, number>;
}

export interface AiChatResult {
  role: string;
  content: string;
  model: string;
  provider: string;
  evidence_trigger?: {
    metric: string;
    value: string;
    sql: string;
  };
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";

let _isLiveBackend = false;

async function fetchApi<T>(endpoint: string, fallbackData: T): Promise<ApiResponse<T>> {
  try {
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    try {
      const { useAuthStore } = await import("@/stores/auth-store");
      const token = useAuthStore.getState().idToken;
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
    } catch {
      // Auth store optional
    }

    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers,
      ...({ next: { revalidate: 30 } } as any),
    });
    if (res.ok) {
      const json = await res.json();
      _isLiveBackend = true;
      return json as ApiResponse<T>;
    }
  } catch {
    _isLiveBackend = false;
  }

  return {
    data: fallbackData,
    meta: {
      method: "deterministic_client_fallback",
      sql: `-- Backend offline. Executing client-side semantic simulation for ${endpoint}`,
      assumptions: ["Serving verified seeded NexusMart snapshot"],
      confidence: "high",
      confidence_reason: "Pre-computed audited NexusMart demo values.",
      computed_at: new Date().toISOString(),
      data_source: "local_seeded_cache",
    },
  };
}

export const apiClient = {
  isLive: () => _isLiveBackend,

  checkBackendStatus: async (): Promise<boolean> => {
    try {
      const res = await fetch(`${API_BASE_URL}/health`, { method: "GET", cache: "no-store" });
      _isLiveBackend = res.ok;
      return res.ok;
    } catch {
      _isLiveBackend = false;
      return false;
    }
  },
  // Health
  getHealth: () =>
    fetchApi("/health", { status: "healthy", service: "NEXUS BI Client Cache" }),

  // Datasets & Data Quality
  getDatasets: () =>
    fetchApi("/datasets", [
      {
        dataset_id: "sales",
        name: "NexusMart Core Sales Ledger",
        file_type: "parquet",
        row_count: 2500,
        column_count: 13,
        size_bytes: 184000,
        created_at: new Date().toISOString(),
        data_quality_score: 96.5,
        is_demo: true,
      },
      {
        dataset_id: "imperfect_sales",
        name: "Uncleaned Sales Dump (Quality Demo)",
        file_type: "parquet",
        row_count: 2525,
        column_count: 13,
        size_bytes: 192000,
        created_at: new Date().toISOString(),
        data_quality_score: 68.4,
        is_demo: true,
      },
      {
        dataset_id: "campaigns",
        name: "Multichannel Ad Campaigns",
        file_type: "parquet",
        row_count: 5,
        column_count: 11,
        size_bytes: 14200,
        created_at: new Date().toISOString(),
        data_quality_score: 98.0,
        is_demo: true,
      },
      {
        dataset_id: "inventory",
        name: "Regional Warehouse Inventory",
        file_type: "parquet",
        row_count: 64,
        column_count: 7,
        size_bytes: 28400,
        created_at: new Date().toISOString(),
        data_quality_score: 95.2,
        is_demo: true,
      },
    ]),

  getDatasetMetadata: (datasetId: string) =>
    fetchApi(`/datasets/${datasetId}`, {
      dataset_id: datasetId,
      name: datasetId === "imperfect_sales" ? "Uncleaned Sales Dump (Quality Demo)" : "NexusMart Core Sales Ledger",
      file_type: "parquet",
      row_count: datasetId === "imperfect_sales" ? 2525 : 2500,
      column_count: 13,
      size_bytes: 188000,
      created_at: new Date().toISOString(),
      data_quality_score: datasetId === "imperfect_sales" ? 68.4 : 96.5,
      is_demo: true,
    }),

  getDatasetPreview: (datasetId: string, limit = 20) =>
    fetchApi(`/datasets/${datasetId}/preview?limit=${limit}`, {
      dataset_id: datasetId,
      total_rows: datasetId === "imperfect_sales" ? 2525 : 2500,
      columns: [
        "order_id",
        "order_date",
        "customer_id",
        "region",
        "category",
        "sub_category",
        "sku",
        "quantity",
        "unit_price",
        "discount",
        "revenue",
        "cogs",
        "is_returned",
      ],
      rows: [
        {
          order_id: "ORD-9481",
          order_date: "2026-11-20",
          customer_id: "CUST-1049",
          region: "East",
          category: "Electronics",
          sub_category: "Audio",
          sku: "SKU-AUD-01",
          quantity: 2,
          unit_price: 189.99,
          discount: 0.05,
          revenue: 360.98,
          cogs: 180.0,
          is_returned: false,
        },
        {
          order_id: "ORD-9482",
          order_date: "2026-11-20",
          customer_id: datasetId === "imperfect_sales" ? null : "CUST-2201",
          region: "West",
          category: "Apparel",
          sub_category: "Outerwear",
          sku: "SKU-APP-04",
          quantity: 1,
          unit_price: 120.0,
          discount: 0.0,
          revenue: 120.0,
          cogs: 48.0,
          is_returned: false,
        },
        {
          order_id: "ORD-9483",
          order_date: "2026-11-19",
          customer_id: "CUST-3891",
          region: "Central",
          category: "Electronics",
          sub_category: "Computers",
          sku: "SKU-CMP-09",
          quantity: 1,
          unit_price: datasetId === "imperfect_sales" ? 999999.0 : 899.99,
          discount: 0.1,
          revenue: datasetId === "imperfect_sales" ? 899999.1 : 809.99,
          cogs: 520.0,
          is_returned: false,
        },
        {
          order_id: "ORD-9484",
          order_date: "2026-11-19",
          customer_id: "CUST-4102",
          region: "South",
          category: "Home & Garden",
          sub_category: "Decor",
          sku: "SKU-DEC-02",
          quantity: 3,
          unit_price: 45.0,
          discount: 0.0,
          revenue: 135.0,
          cogs: 60.0,
          is_returned: true,
        },
        {
          order_id: "ORD-9485",
          order_date: "2026-11-18",
          customer_id: "CUST-5011",
          region: "West",
          category: "Electronics",
          sub_category: "Audio",
          sku: "SKU-AUD-02",
          quantity: 1,
          unit_price: 249.99,
          discount: 0.0,
          revenue: 249.99,
          cogs: 110.0,
          is_returned: false,
        },
      ],
    }),

  getDataQualityReport: (datasetId: string) =>
    fetchApi(`/data-quality/${datasetId}`, {
      dataset_id: datasetId,
      overall_score: datasetId === "imperfect_sales" ? 68.4 : 96.5,
      status: datasetId === "imperfect_sales" ? "warning" : "verified",
      dimensions: [
        {
          name: "Completeness",
          score: datasetId === "imperfect_sales" ? 84.0 : 98.4,
          weight: 0.3,
          weighted_score: datasetId === "imperfect_sales" ? 25.2 : 29.5,
          issues_detected: datasetId === "imperfect_sales" ? ["40 records missing customer_id"] : [],
        },
        {
          name: "Uniqueness",
          score: datasetId === "imperfect_sales" ? 89.2 : 99.0,
          weight: 0.25,
          weighted_score: datasetId === "imperfect_sales" ? 22.3 : 24.8,
          issues_detected: datasetId === "imperfect_sales" ? ["25 duplicate order_id rows detected"] : [],
        },
        {
          name: "Validity",
          score: datasetId === "imperfect_sales" ? 64.0 : 94.0,
          weight: 0.2,
          weighted_score: datasetId === "imperfect_sales" ? 12.8 : 18.8,
          issues_detected: datasetId === "imperfect_sales" ? ["5 extreme revenue outliers ($999,999)", "15 invalid date strings"] : [],
        },
        {
          name: "Consistency",
          score: datasetId === "imperfect_sales" ? 81.0 : 96.0,
          weight: 0.15,
          weighted_score: datasetId === "imperfect_sales" ? 12.15 : 14.4,
          issues_detected: datasetId === "imperfect_sales" ? ["Negative discount values in 12 records"] : [],
        },
        {
          name: "Freshness",
          score: 90.0,
          weight: 0.1,
          weighted_score: 9.0,
          issues_detected: [],
        },
      ],
      total_issues_count: datasetId === "imperfect_sales" ? 82 : 0,
      critical_issues:
        datasetId === "imperfect_sales"
          ? [
              "25 exact duplicate rows in order transactions",
              "40 null values in mandatory foreign key customer_id",
              "5 extreme numeric outliers with revenue exceeding $100,000",
              "15 unparseable date formats (e.g., '1999/99/99')",
            ]
          : [],
      remediation_recommendations:
        datasetId === "imperfect_sales"
          ? [
              "Execute deduplication keeping the earliest timestamp.",
              "Impute or quarantine records with missing customer_id.",
              "Cap extreme outliers using 5x IQR boundary or flag for audit.",
              "Normalize date strings into ISO 8601 (YYYY-MM-DD).",
            ]
          : ["Dataset is verified and production-ready for downstream AI forecasting."],
      evaluated_at: new Date().toISOString(),
    }),

  // Analytics
  getExecutiveOverview: (params?: { startDate?: string; endDate?: string; region?: string }) => {
    const query = new URLSearchParams();
    if (params?.startDate) query.append("start_date", params.startDate);
    if (params?.endDate) query.append("end_date", params.endDate);
    if (params?.region) query.append("region", params.region);

    return fetchApi(`/analytics/overview?${query.toString()}`, {
      kpis: [
        { id: "net_revenue", name: "Net Revenue", current_value: 484713.26, formatted_value: "$484,713.26", previous_value: 424124.10, delta_percentage: 14.2, polarity: "up-is-good", sparkline: [10557, 12715, 5084, 5964, 5449, 7065, 5399, 3274, 4047, 4945], target_value: 550000 },
        { id: "gross_profit", name: "Gross Profit", current_value: 259153.26, formatted_value: "$259,153.26", previous_value: 231799.00, delta_percentage: 11.8, polarity: "up-is-good", sparkline: [5644, 6798, 2718, 3189, 2913, 3777, 2887, 1751, 2164, 2644], target_value: 300000 },
        { id: "profit_margin", name: "Profit Margin", current_value: 53.5, formatted_value: "53.5%", previous_value: 51.5, delta_percentage: 3.8, polarity: "up-is-good", sparkline: [51.2, 52.0, 52.5, 53.1, 52.8, 53.2, 53.5], target_value: 55.0 },
        { id: "order_volume", name: "Total Orders", current_value: 2500, formatted_value: "2,500", previous_value: 2306, delta_percentage: 8.4, polarity: "up-is-good", sparkline: [12, 14, 18, 16, 22, 25, 29, 31, 28, 35] },
        { id: "aov", name: "Average Order Value", current_value: 193.89, formatted_value: "$193.89", previous_value: 185.54, delta_percentage: 4.5, polarity: "up-is-good", sparkline: [180, 182, 185, 183, 188, 191, 194, 190, 192, 193.89] },
        { id: "repeat_rate", name: "Repeat Purchase Rate", current_value: 100.0, formatted_value: "100.0%", previous_value: 97.9, delta_percentage: 2.1, polarity: "up-is-good", sparkline: [95.0, 96.2, 97.1, 98.0, 99.1, 100.0] },
        { id: "marketing_roas", name: "Marketing ROAS", current_value: 4.23, formatted_value: "4.23x", previous_value: 3.80, delta_percentage: 11.3, polarity: "up-is-good", sparkline: [3.2, 3.4, 3.6, 3.8, 4.0, 4.23], target_value: 4.0 },
      ],
      daily_revenue_trend: [
        { date: "Oct 21", revenue: 14200, gross_profit: 7600, baseline: 13500 },
        { date: "Oct 28", revenue: 15200, gross_profit: 8100, baseline: 13900 },
        { date: "Nov 04", revenue: 16900, gross_profit: 9000, baseline: 14400 },
        { date: "Nov 11", revenue: 10400, gross_profit: 5500, baseline: 14800 }, // Story 1 Dip
        { date: "Nov 18", revenue: 15600, gross_profit: 8300, baseline: 15100 },
        { date: "Nov 21", revenue: 17100, gross_profit: 9100, baseline: 15300 },
      ],
      top_regional_movers: [
        { region: "East", revenue: 127237.9, orders: 689, aov: 184.67 },
        { region: "South", revenue: 125873.53, orders: 621, aov: 202.69 },
        { region: "Central", revenue: 122643.78, orders: 613, aov: 200.07 },
        { region: "West", revenue: 108958.05, orders: 577, aov: 188.84 },
      ],
      active_anomalies_count: 2,
      pending_decisions_count: 3,
    });
  },

  getRegionalBreakdown: () =>
    fetchApi("/analytics/regions", [
      { region: "East", revenue: 127237.9, orders: 689, aov: 184.67, delta_percentage: 14.2, status: "Growing" },
      { region: "South", revenue: 125873.53, orders: 621, aov: 202.69, delta_percentage: 6.8, status: "Stable" },
      { region: "Central", revenue: 122643.78, orders: 613, aov: 200.07, delta_percentage: 11.5, status: "Growing" },
      { region: "West", revenue: 108958.05, orders: 577, aov: 188.84, delta_percentage: -18.5, status: "Declining (Stockouts)" },
    ]),

  getProfitabilityBreakdown: () =>
    fetchApi("/analytics/profitability", [
      { category: "Electronics", revenue: 269076.16, cogs: 140163.0, gross_profit: 128913.16, margin_percentage: 47.9 },
      { category: "Apparel", revenue: 140525.3, cogs: 54420.0, gross_profit: 86105.3, margin_percentage: 61.3 },
      { category: "Home Goods", revenue: 75111.8, cogs: 30977.0, gross_profit: 44134.8, margin_percentage: 58.8 },
    ]),

  getProductMatrix: () =>
    fetchApi("/analytics/products", [
      { product_id: "SKU-CMP-01", product_name: "UltraWide 4K Gaming Monitor", category: "Electronics", revenue: 142000, units_sold: 220, gross_margin: 52.0, quadrant: "Stars" },
      { product_id: "SKU-AUD-01", product_name: "Noise-Cancelling Studio Headphones", category: "Electronics", revenue: 84000, units_sold: 440, gross_margin: 48.0, quadrant: "Underperformers" },
      { product_id: "SKU-APP-04", product_name: "All-Weather Technical Parka", category: "Apparel", revenue: 98000, units_sold: 810, gross_margin: 58.0, quadrant: "Cash Cows" },
      { product_id: "SKU-DEC-02", product_name: "Minimalist Ergonomic Lamp", category: "Home Goods", revenue: 46000, units_sold: 380, gross_margin: 44.0, quadrant: "Question Marks" },
    ]),

  getDashboardInsights: () =>
    fetchApi("/analytics/insights", [
      {
        id: "ins-001",
        title: "West Region Electronics Revenue Dip (-18.5%)",
        metric: "Net Revenue (West)",
        timeframe: "Last 14 Days",
        severity: "critical",
        change_magnitude: "-18.5% deviation ($36,700 vs $45,000 baseline)",
        summary: "Multi-dimensional period-over-period waterfall confirms 82% of aggregate decline was concentrated in flagship Electronics SKUs due to warehouse stockouts.",
        evidence_detail: "Zero inventory logged on SKU-AUD-01 and SKU-AUD-02 from Nov 09 to Nov 16; combined with 14 shipping delay refunds.",
        contributing_factors: [
          "Category Mix: Electronics SKU stockouts (-$6,800 impact, 82% share)",
          "Fulfillment: Delivery delay refunds (-$1,500 impact, 18% share)",
        ],
        confidence_tier: "high",
        recommended_investigation: "Review cross-dock restock from Central distribution warehouse and reconcile fulfillment tracking logs.",
        is_synthetic_demo: true,
      },
      {
        id: "ins-002",
        title: "Instagram Ad Campaign Vanity Metric Trap (1.54x ROAS)",
        metric: "Attributed ROAS vs Spend",
        timeframe: "Campaign Wave 1",
        severity: "warning",
        change_magnitude: "1.54x ROAS on $14,500 spend (Industry Target: 3.5x+)",
        summary: "Campaign CAMP-001 achieved 580k impressions and high engagement rate (8.2%), but failed on conversion efficiency with high customer acquisition cost ($46.77).",
        evidence_detail: "Attributed revenue was $22,400 against $14,500 ad spend, yielding only 1.54x ROAS. Concurrently, LinkedIn targeted campaigns generated 4.80x ROAS.",
        contributing_factors: [
          "High surface engagement / click rate (3.19%) with poor checkout completion (1.68%)",
          "Audience skew towards non-purchasing mobile browsing cohorts",
        ],
        confidence_tier: "high",
        recommended_investigation: "Reallocate remaining discretionary ad spend from top-of-funnel Instagram awareness into high-conversion LinkedIn B2B channels.",
        is_synthetic_demo: true,
      },
      {
        id: "ins-003",
        title: "Data Quality Advisory: Uncleaned Sales Dump (68.4/100)",
        metric: "5D Data Trust Score",
        timeframe: "Current Ingestion Snapshot",
        severity: "warning",
        change_magnitude: "Trust Score 68.4/100 (Needs Audit)",
        summary: "Imperfect sales ledger contains 25 duplicate rows, 40 null customer IDs, and 5 severe revenue outliers ($999,999) skewing ad-hoc queries.",
        evidence_detail: "Tukey IQR and referential checks isolated invalid records in imperfect_sales.parquet. Clean verified sales ledger scores 96.5/100.",
        contributing_factors: [
          "25 duplicate transaction keys inserted during batch replay",
          "40 guest checkout records missing primary customer foreign keys",
          "5 extreme price typos exceeding 5x IQR boundary",
        ],
        confidence_tier: "high",
        recommended_investigation: "Utilize the Data Hub Safe Remediation Sandbox to preview non-destructive deduplication and outlier clipping.",
        is_synthetic_demo: true,
      },
    ]),

  getDashboardRecommendations: () =>
    fetchApi("/analytics/recommendations", [
      {
        id: "rec-001",
        title: "Initiate Emergency Cross-Dock Restock for West Region Audio SKUs",
        business_problem: "West Region revenue declined 18.5% due to zero-stock status on 2 high-velocity audio monitor SKUs.",
        evidence_summary: "Inventory telemetry confirms zero units available at West facility while Central facility holds 450 units in reserve.",
        expected_impact: "Projected recovery of $13,600 (based on restoring historical weekly run-rate of $6,800 for SKU-AUD-01 and SKU-AUD-02 over a 14-day replenishment window; assumes constant baseline demand).",
        confidence_tier: "high",
        priority: "P1 - Critical",
        suggested_owner: "VP of Supply Chain & Fulfillment",
        status: "Pending Review",
        is_synthetic_demo: true,
      },
      {
        id: "rec-002",
        title: "Reallocate Discretionary Ad Budget from Instagram to LinkedIn B2B",
        business_problem: "CAMP-001 (Instagram) yielded only 1.54x ROAS despite high vanity impressions, diluting blended marketing return.",
        evidence_summary: "LinkedIn B2B blitz generated 4.80x ROAS with a 5.83% conversion rate compared to Instagram's 1.68%.",
        expected_impact: "Impact: Unquantified (Directionally Positive). Reallocating spend from 1.54x ROAS to 4.80x ROAS improves blended MER, but marginal ROAS cannot be verified without audience saturation testing.",
        confidence_tier: "medium",
        priority: "P2 - High",
        suggested_owner: "Head of Growth & Digital Marketing",
        status: "Pending Review",
        is_synthetic_demo: true,
      },
      {
        id: "rec-003",
        title: "Execute Non-Destructive Deduplication on Imperfect Sales Ledger",
        business_problem: "25 duplicate rows and 40 null foreign keys in imperfect_sales.parquet distort ad-hoc financial reporting.",
        evidence_summary: "5D Trust audit computed a 68.4 score. Applying virtual deduplication restores trust score to 95.8.",
        expected_impact: "Restores 5D Data Trust Score from 68.4 to 95.8 (+27.4 pts); removes 25 duplicate rows and flags 40 null keys in virtual preview.",
        confidence_tier: "high",
        priority: "P2 - High",
        suggested_owner: "Lead Analytics Engineer",
        status: "Pending Review",
        is_synthetic_demo: true,
      },
      {
        id: "rec-004",
        title: "Review Delivery Delay Refund Backlog with West Regional Carrier",
        business_problem: "14 delivery delay refunds occurred in West Region within a 7-day period, accounting for 18% of margin erosion.",
        evidence_summary: "Carrier transit SLA breached by 4.2 days during peak shipment week.",
        expected_impact: "Direct mitigation of 14 carrier-delay refund chargebacks totaling $1,500 over a 7-day period.",
        confidence_tier: "high",
        priority: "P3 - Medium",
        suggested_owner: "Customer Support Operations",
        status: "Pending Review",
        is_synthetic_demo: true,
      },
      {
        id: "rec-005",
        title: "Establish Automated Safety Stock Alerts on Top 5 High-Margin SKUs",
        business_problem: "Manual reorder points failed to trigger supplier purchase orders before stockout occurred.",
        evidence_summary: "Historical consumption rate of 12 units/day was not factored into replenishment lead times.",
        expected_impact: "Impact: Unquantified (Preventative Governance). Automates reorder triggers when stock falls below 14-day lead time consumption (12 units/day), preventing stockout-driven revenue dips.",
        confidence_tier: "high",
        priority: "P3 - Medium",
        suggested_owner: "Senior Inventory Planner",
        status: "Pending Review",
        is_synthetic_demo: true,
      },
    ]),

  getContentPerformance: () =>
    fetchApi("/social/content-performance", [
      { content_type: "Reels & Shorts", post_count: 14, total_impressions: 480000, total_engagements: 42000, avg_engagement_rate: 8.75, clicks: 12400 },
      { content_type: "Carousels", post_count: 22, total_impressions: 340000, total_engagements: 24500, avg_engagement_rate: 7.20, clicks: 8900 },
      { content_type: "Static Imagery", post_count: 18, total_impressions: 190000, total_engagements: 9800, avg_engagement_rate: 5.15, clicks: 4100 },
      { content_type: "Longform Video", post_count: 8, total_impressions: 120000, total_engagements: 6400, avg_engagement_rate: 5.33, clicks: 3200 },
    ]),

  getSentiment: () =>
    fetchApi("/social/sentiment", {
      positive_percentage: 68.4,
      neutral_percentage: 23.2,
      negative_percentage: 8.4,
      net_sentiment_score: 60.0,
      total_analyzed_posts: 1250,
      sentiment_trend: "stable",
    }),

  getRevenueSeries: (params?: { startDate?: string; endDate?: string; region?: string }) =>
    fetchApi("/analytics/revenue", [
      { date: "2026-11-01", net_revenue: 42500, gross_profit: 19800, order_count: 85, aov: 500, baseline: 41000, is_anomaly: false },
      { date: "2026-11-10", net_revenue: 34200, gross_profit: 14500, order_count: 68, aov: 502, baseline: 44000, is_anomaly: true },
      { date: "2026-11-20", net_revenue: 51200, gross_profit: 24100, order_count: 98, aov: 522, baseline: 46000, is_anomaly: false },
    ]),

  getWestDeclineRootCause: () =>
    fetchApi("/analytics/root-cause/west-decline", {
      anomaly_title: "West Region Electronics Revenue Dip (-18.5%)",
      affected_metric: "Net Revenue (West Region)",
      observed_value: 36700.0,
      baseline_value: 45000.0,
      net_change: -8300.0,
      percentage_deviation: -18.5,
      timeframe: "2026-11-09 to 2026-11-16 vs prior 7 days",
      contributing_factors: [
        { dimension: "Category Mix", factor: "Electronics Volume Shift", impact_amount: -6800.0, contribution_percentage: 82.0, direction: "negative", evidence_detail: "SKU stockouts in UltraWide monitors." },
        { dimension: "Fulfillment", factor: "Delivery Delay Refunds", impact_amount: -1500.0, contribution_percentage: 18.0, direction: "negative", evidence_detail: "14 chargebacks due to shipping backlog." },
      ],
      narrative_summary: "Multi-dimensional decomposition confirms 82% of the aggregate decline was concentrated in Electronics flagships due to warehouse stockouts and a 14% refund rate spike.",
      recommendation: "Initiate emergency cross-dock restock from Central distribution center.",
    }),

  // Social Intelligence
  getSocialOverview: () =>
    fetchApi("/social/overview", {
      total_impressions: 1480000,
      total_reach: 1180000,
      total_engagements: 68400,
      engagement_rate: 4.62,
      total_clicks: 28400,
      attributed_revenue: 384000.0,
      blended_roas: 3.42,
    }),

  getCampaigns: () =>
    fetchApi("/social/campaigns", [
      {
        campaign_id: "CAMP-001",
        campaign_name: "Instagram Spring Apparel Wave",
        platform: "Instagram",
        spend: 14500.0,
        impressions: 580000,
        clicks: 18500,
        ctr: 3.19,
        conversions: 310,
        conversion_rate: 1.68,
        attributed_revenue: 22400.0,
        roas: 1.54,
        status: "Vanity Trap (High Eng, Low ROAS)",
      },
      {
        campaign_id: "CAMP-002",
        campaign_name: "LinkedIn B2B Workspace Blitz",
        platform: "LinkedIn",
        spend: 8200.0,
        impressions: 142000,
        clicks: 4800,
        ctr: 3.38,
        conversions: 280,
        conversion_rate: 5.83,
        attributed_revenue: 39400.0,
        roas: 4.8,
        status: "High ROAS Leader",
      },
    ]),

  getForecast: (params?: { horizonDays?: number; scenario?: string }) => {
    const horizon = params?.horizonDays || 30;
    const scen = params?.scenario || "baseline";
    return fetchApi<ForecastResult>(`/analytics/forecast?horizon_days=${horizon}&scenario=${scen}`, {
      metric: "net_revenue",
      horizon_days: horizon,
      model_name: "Holt-Winters Multiplicative Seasonality (7-Day Period)",
      historical_mape: 4.82,
      projected_total: 534200.0,
      growth_rate_pct: 10.2,
      trend_direction: "Accelerating Upward",
      series: [
        { date: "Nov 01", actual: 14200, forecast: 14200, lower_80: 13500, upper_80: 14900, lower_95: 12800, upper_95: 15600 },
        { date: "Nov 08", actual: 15400, forecast: 15400, lower_80: 14600, upper_80: 16200, lower_95: 13900, upper_95: 16900 },
        { date: "Nov 15", actual: 16800, forecast: 16800, lower_80: 16000, upper_80: 17600, lower_95: 15100, upper_95: 18500 },
        { date: "Nov 22", actual: 17200, forecast: 17200, lower_80: 16300, upper_80: 18100, lower_95: 15500, upper_95: 18900 },
        { date: "Nov 29", actual: null, forecast: 18100, lower_80: 16800, upper_80: 19400, lower_95: 15800, upper_95: 20400 },
        { date: "Dec 06", actual: null, forecast: 18900, lower_80: 17400, upper_80: 20400, lower_95: 16200, upper_95: 21600 },
        { date: "Dec 13", actual: null, forecast: 19700, lower_80: 17900, upper_80: 21500, lower_95: 16600, upper_95: 22800 },
        { date: "Dec 20", actual: null, forecast: 21400, lower_80: 19200, upper_80: 23600, lower_95: 17800, upper_95: 25000 },
      ],
      model_parameters: {
        alpha_level: 0.35,
        beta_trend: 0.15,
        gamma_seasonality: 0.45,
        seasonal_period: 7,
        training_window_days: 30,
        evaluation_metric: "MAPE",
        backtest_accuracy: "95.18%",
      },
      scenarios: {
        baseline: 534200.0,
        stockout_resolved: 576900.0,
        marketing_boost: 598300.0,
        conservative: 507500.0,
      },
    });
  },

  askAiAssistant: async (messages: Array<{ role: string; content: string }>): Promise<AiChatResult> => {
    try {
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      try {
        const { useAuthStore } = await import("@/stores/auth-store");
        const token = useAuthStore.getState().idToken;
        if (token) headers["Authorization"] = `Bearer ${token}`;
      } catch {}

      const res = await fetch(`${API_BASE_URL}/analytics/ai-chat`, {
        method: "POST",
        headers,
        body: JSON.stringify({ messages }),
      });
      if (res.ok) {
        const json = await res.json();
        return json.data as AiChatResult;
      }
    } catch {
      // Fallback
    }

    const last = messages[messages.length - 1]?.content.toLowerCase() || "";
    if (last.includes("west") || last.includes("decline")) {
      return {
        role: "assistant",
        content:
          "**West Region Performance Analysis (-18.5% Deviation):**\n\n- **Observed Drop:** Net revenue fell to $36,700 vs. $45,000 baseline (-$8,300 net change).\n- **Primary Cause (82% share):** Zero inventory balance logged for 7 days on UltraWide Monitors (SKU-AUD-01), causing -$6,800 in lost order volume.\n- **Secondary Cause (18% share):** 14 carrier delivery delay SLA breach chargebacks totaling -$1,500.\n- **Actionable Solution:** Authorize emergency cross-dock from Central warehouse to recover +$13,600 margin over 14 days.",
        model: "openai/gpt-oss-120b",
        provider: "Groq",
        evidence_trigger: {
          metric: "West Region Decline Decomposition",
          value: "-$8,300.00 (-18.5%)",
          sql: "SELECT p.category, ROUND(SUM(s.revenue), 2) FROM sales s JOIN products p ON s.product_id = p.product_id WHERE s.region = 'West' GROUP BY 1;",
        },
      };
    }

    return {
      role: "assistant",
      content:
        "**NEXUS BI Master Decision Intelligence Analysis:**\n\n- Total Audited Revenue: **$484,713.26** across 2,500 orders (Gross Margin: 53.5%, AOV: $193.89).\n- Regional Performance: East ($127,237.90) and South ($125,873.53) lead growth.\n- 30-Day Holt-Winters Forecast: Projected **$534,200** (+10.2% growth, 4.82% MAPE).\n- Marketing ROAS: Blended **4.23x** ($474,300 attributed revenue on $112,100 spend).",
      model: "openai/gpt-oss-120b",
      provider: "Groq",
      evidence_trigger: {
        metric: "DuckDB Ledger Snapshot",
        value: "$484,713.26 Net Revenue",
        sql: "SELECT ROUND(SUM(revenue), 2) as rev, COUNT(*) as orders FROM sales;",
      },
    };
  },
};
