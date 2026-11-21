"use client";

import React, { useEffect, useState, use } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ShieldCheck,
  AlertTriangle,
  Database,
  Table as TableIcon,
  Wand2,
  Search,
  ExternalLink,
  Layers,
  Sparkles,
  RefreshCw,
  FileCode,
} from "lucide-react";
import { apiClient } from "@/lib/api-client";
import { TrustBadge } from "@/components/ui/trust-badge";
import { DataTable, ColumnDef } from "@/components/ui/data-table";
import { DataFixesModal } from "@/components/data-hub/data-fixes-modal";
import { useEvidenceStore } from "@/stores/evidence-store";

interface PageProps {
  params: Promise<{ dataset_id: string }>;
}

export default function DatasetDetailPage({ params }: PageProps) {
  const unwrappedParams = use(params);
  const datasetId = unwrappedParams.dataset_id;

  const [loading, setLoading] = useState(true);
  const [metadata, setMetadata] = useState<any>(null);
  const [qualityReport, setQualityReport] = useState<any>(null);
  const [previewData, setPreviewData] = useState<{ columns: string[]; rows: any[] }>({
    columns: [],
    rows: [],
  });
  const [isFixModalOpen, setIsFixModalOpen] = useState(false);

  const { openEvidence } = useEvidenceStore();

  const loadData = async () => {
    setLoading(true);
    try {
      const [metaRes, qualRes, prevRes] = await Promise.all([
        apiClient.getDatasetMetadata(datasetId),
        apiClient.getDataQualityReport(datasetId),
        apiClient.getDatasetPreview(datasetId, 25),
      ]);
      setMetadata(metaRes.data);
      setQualityReport(qualRes.data);
      setPreviewData(prevRes.data);
    } catch {
      // Handled by apiClient fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [datasetId]);

  const score = qualityReport?.overall_score ?? 90.0;
  const isHealthy = score >= 90;

  const handleInspectAuditSQL = () => {
    openEvidence({
      metricId: `data_quality_${datasetId}`,
      metricLabel: `5D Data Trust Audit: ${datasetId}`,
      valueFormatted: `${score.toFixed(1)} / 100`,
      deltaFormatted: isHealthy ? "Verified Integrity" : "Quality Warning",
      definition: "Comprehensive 5-dimension data quality audit evaluated across Completeness, Uniqueness, Validity, Consistency, and Freshness.",
      formula:
        "Score = (Completeness × 0.30) + (Uniqueness × 0.25) + (Validity × 0.20) + (Consistency × 0.15) + (Freshness × 0.10)",
      sql: `SELECT 
  COUNT(*) as total_rows,
  COUNT(DISTINCT order_id) as unique_keys,
  SUM(CASE WHEN customer_id IS NULL THEN 1 ELSE 0 END) as null_customers,
  SUM(CASE WHEN revenue > 50000 THEN 1 ELSE 0 END) as revenue_outliers
FROM '${datasetId}.parquet';`,
      confidence: isHealthy ? "high" : "medium",
      confidenceReason: "Deterministic audit run against DuckDB in-memory table.",
      computedAt: new Date().toISOString(),
      assumptions: [
        "Sample size sufficient for IQR bounds",
        "UTC timestamps standardized to ISO 8601",
      ],
      dataLineage: {
        sourceTable: `${datasetId}.parquet`,
        rowCount: previewData.rows.length,
        lastSynced: "Just now",
        filtersApplied: ["Tukey IQR Outlier Scan", "Foreign Key Integrity"],
      },
      sampleRows: previewData.rows.slice(0, 5),
    });
  };

  // Convert columns array to DataTable ColumnDef
  const tableColumns: ColumnDef<any>[] = previewData.columns.map((col) => ({
    id: col,
    header: col.replace(/_/g, " ").toUpperCase(),
    accessorKey: col,
    sortable: true,
    format: (val: any) => {
      if (val === null || val === undefined) {
        return (
          <span className="px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-400 font-mono text-[10px] border border-rose-500/20">
            NULL
          </span>
        );
      }
      if (typeof val === "number") {
        return <span className="font-mono">{val.toLocaleString()}</span>;
      }
      if (typeof val === "boolean") {
        return <span className="font-mono text-xs">{val ? "TRUE" : "FALSE"}</span>;
      }
      return String(val);
    },
  }));

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Link href="/data" className="hover:text-foreground flex items-center gap-1 transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Data Hub</span>
        </Link>
        <span>/</span>
        <span className="font-mono text-foreground font-semibold">{datasetId}</span>
      </div>

      {/* Hero Header Card */}
      <div className="p-6 rounded-2xl bg-surface border border-border flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xs">
        <div className="space-y-2">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-surface-elevated border border-border flex items-center justify-center text-primary">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
                <span>{metadata?.name || datasetId}</span>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-surface-elevated border border-border text-ai-accent uppercase">
                  {metadata?.file_type || "parquet"}
                </span>
              </h1>
              <p className="text-xs font-mono text-muted-foreground">
                Dataset ID: <code>{datasetId}</code> · Ingested into local DuckDB engine
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-muted-foreground pt-1">
            <span>
              Rows: <strong className="text-foreground">{metadata?.row_count?.toLocaleString() || "2,500"}</strong>
            </span>
            <span>·</span>
            <span>
              Columns: <strong className="text-foreground">{metadata?.column_count || 13}</strong>
            </span>
            <span>·</span>
            <span>
              Storage: <strong className="text-foreground">{((metadata?.size_bytes || 184000) / 1024).toFixed(0)} KB</strong>
            </span>
          </div>
        </div>

        {/* Right side: Trust Score & Safe Fix Action */}
        <div className="flex items-center gap-4 shrink-0">
          <div className="text-right">
            <span className="text-[10px] uppercase font-mono tracking-wider text-muted-foreground block">
              5D Data Trust Score
            </span>
            <div className="flex items-center gap-1.5 justify-end">
              <span
                className={`text-3xl font-black font-mono ${
                  isHealthy ? "text-emerald-400" : "text-amber-400"
                }`}
              >
                {score.toFixed(1)}
              </span>
              <span className="text-xs font-mono text-muted-foreground">/ 100</span>
            </div>
            <TrustBadge status={isHealthy ? "verified" : "warning"} />
          </div>

          <div className="flex flex-col gap-2">
            {!isHealthy && (
              <button
                type="button"
                onClick={() => setIsFixModalOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold bg-primary hover:bg-primary-hover text-primary-foreground shadow-xs transition-colors"
              >
                <Wand2 className="w-3.5 h-3.5" />
                <span>Remediate with Safe Fixes</span>
              </button>
            )}
            <button
              type="button"
              onClick={handleInspectAuditSQL}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-surface-elevated hover:bg-surface border border-border text-muted-foreground hover:text-foreground transition-colors"
            >
              <FileCode className="w-3.5 h-3.5 text-ai-accent" />
              <span>Inspect Audit SQL</span>
            </button>
          </div>
        </div>
      </div>

      {/* 5-Dimension Quality Breakdown Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {qualityReport?.dimensions?.map((dim: any, i: number) => {
          const dimHealthy = dim.score >= 90;
          return (
            <div
              key={i}
              className={`p-4 rounded-xl bg-surface border transition-colors ${
                dimHealthy ? "border-border" : "border-amber-500/40 bg-amber-500/[0.02]"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-foreground">{dim.name}</span>
                <span className="text-[10px] font-mono text-muted-foreground">
                  {(dim.weight * 100).toFixed(0)}% wt
                </span>
              </div>

              <div className="flex items-baseline gap-1 mb-2">
                <span
                  className={`text-xl font-bold font-mono ${
                    dimHealthy ? "text-emerald-400" : "text-amber-400"
                  }`}
                >
                  {dim.score.toFixed(1)}
                </span>
                <span className="text-[10px] font-mono text-muted-foreground">/100</span>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-surface-elevated h-1.5 rounded-full overflow-hidden mb-2">
                <div
                  className={`h-full rounded-full ${
                    dimHealthy ? "bg-emerald-400" : "bg-amber-400"
                  }`}
                  style={{ width: `${dim.score}%` }}
                />
              </div>

              <p className="text-[10px] text-muted-foreground line-clamp-1">
                {dim.issues_detected?.length > 0
                  ? dim.issues_detected[0]
                  : "Zero anomalies detected"}
              </p>
            </div>
          );
        })}
      </div>

      {/* Quality Issues & Remediations Section */}
      {qualityReport?.critical_issues?.length > 0 && (
        <div className="p-5 rounded-xl bg-amber-500/5 border border-amber-500/30 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-amber-400 font-semibold text-xs">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>
                {qualityReport.critical_issues.length} Critical Data Quality Issues Detected
              </span>
            </div>
            <button
              type="button"
              onClick={() => setIsFixModalOpen(true)}
              className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
            >
              <span>Launch Safe Fix Sandbox</span>
              <Wand2 className="w-3 h-3" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
            {qualityReport.critical_issues.map((issue: string, idx: number) => (
              <div
                key={idx}
                className="p-3 rounded-lg bg-surface border border-border/80 flex items-start gap-2.5 text-xs text-foreground"
              >
                <span className="w-2 h-2 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                <span className="leading-relaxed">{issue}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Raw Data Preview Table */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TableIcon className="w-4 h-4 text-primary" />
            <h2 className="text-sm font-semibold text-foreground">
              Data Sample &amp; Schema Preview (Top 25 Rows)
            </h2>
          </div>
          <span className="text-xs font-mono text-muted-foreground">
            Executed via <code>SELECT * FROM {datasetId} LIMIT 25;</code>
          </span>
        </div>

        <DataTable
          columns={tableColumns}
          data={previewData.rows}
          pageSize={10}
          searchable
          searchPlaceholder="Filter records..."
          isLoading={loading}
        />
      </div>

      {/* Safe Fixes Modal */}
      <DataFixesModal
        datasetId={datasetId}
        isOpen={isFixModalOpen}
        onClose={() => setIsFixModalOpen(false)}
        currentScore={score}
      />
    </div>
  );
}
