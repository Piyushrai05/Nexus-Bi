/**
 * Utility function to generate and download a clean CSV summary of the Executive Dashboard.
 */

export interface ExportDataPayload {
  organization: string;
  dateRange: string;
  region: string;
  refreshedAt: string;
  kpis: Array<{ name: string; value: string; delta: string; status: string }>;
  regionalBreakdown: Array<{ region: string; revenue: number; orders: number; aov: number; delta: number }>;
  campaigns: Array<{ id: string; name: string; platform: string; spend: number; revenue: number; roas: number; status: string }>;
  recommendations: Array<{ id: string; title: string; priority: string; owner: string; impact: string }>;
}

export function downloadDashboardCsv(payload: ExportDataPayload) {
  const lines: string[] = [];

  // Header metadata
  lines.push("NEXUS BI — EXECUTIVE DASHBOARD SUMMARY");
  lines.push(`Organization,${escapeCsv(payload.organization)}`);
  lines.push(`Date Range,${escapeCsv(payload.dateRange)}`);
  lines.push(`Region Filter,${escapeCsv(payload.region)}`);
  lines.push(`Generated At,${escapeCsv(payload.refreshedAt)}`);
  lines.push("");

  // 1. Core KPIs
  lines.push("--- CORE TELEMETRY KPIS ---");
  lines.push("Metric Name,Current Value,Delta / Period Change,Polarity / Status");
  payload.kpis.forEach((k) => {
    lines.push(`${escapeCsv(k.name)},${escapeCsv(k.value)},${escapeCsv(k.delta)},${escapeCsv(k.status)}`);
  });
  lines.push("");

  // 2. Regional Breakdown
  lines.push("--- REGIONAL PERFORMANCE BREAKDOWN ---");
  lines.push("Region,Net Revenue,Total Orders,Average Order Value,Period Delta %");
  payload.regionalBreakdown.forEach((r) => {
    lines.push(`${escapeCsv(r.region)},$${r.revenue.toFixed(2)},${r.orders},$${r.aov.toFixed(2)},${r.delta}%`);
  });
  lines.push("");

  // 3. Marketing Campaigns
  lines.push("--- MULTICHANNEL MARKETING CAMPAIGNS ---");
  lines.push("Campaign ID,Campaign Name,Platform,Ad Spend,Attributed Revenue,ROAS,Commercial Status");
  payload.campaigns.forEach((c) => {
    lines.push(
      `${escapeCsv(c.id)},${escapeCsv(c.name)},${escapeCsv(c.platform)},$${c.spend.toFixed(2)},$${c.revenue.toFixed(2)},${c.roas.toFixed(2)}x,${escapeCsv(c.status)}`
    );
  });
  lines.push("");

  // 4. Recommendations
  lines.push("--- EXECUTIVE DECISION ACTIONS ---");
  lines.push("Decision ID,Title,Priority,Suggested Owner,Expected Impact");
  payload.recommendations.forEach((rec) => {
    lines.push(
      `${escapeCsv(rec.id)},${escapeCsv(rec.title)},${escapeCsv(rec.priority)},${escapeCsv(rec.owner)},${escapeCsv(rec.impact)}`
    );
  });

  const csvContent = lines.join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute(
    "download",
    `nexus_bi_executive_summary_${new Date().toISOString().slice(0, 10)}.csv`
  );
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function escapeCsv(val: unknown): string {
  if (val === null || val === undefined) return '""';
  const str = String(val).replace(/"/g, '""');
  return `"${str}"`;
}
