"use client";

import React, { useEffect, useState } from "react";
import { Database, Plus, RefreshCw, Sparkles, ShieldCheck } from "lucide-react";
import { apiClient } from "@/lib/api-client";
import { DataHubOverview } from "@/components/data-hub/data-hub-overview";
import { OneClickDemoBanner } from "@/components/data-hub/one-click-demo-banner";
import { DatasetCatalog, DatasetItem } from "@/components/data-hub/dataset-catalog";
import { UploadZone } from "@/components/data-hub/upload-zone";

export default function DataHubPage() {
  const [datasets, setDatasets] = useState<DatasetItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"catalog" | "upload">("catalog");

  const loadDatasets = async () => {
    setLoading(true);
    try {
      const res = await apiClient.getDatasets();
      setDatasets(res.data as DatasetItem[]);
    } catch {
      // Fallback already handled in apiClient
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDatasets();
  }, []);

  const totalRows = datasets.reduce((acc, d) => acc + (d.row_count || 0), 0);
  const avgTrust =
    datasets.length > 0
      ? datasets.reduce((acc, d) => acc + (d.data_quality_score || 0), 0) / datasets.length
      : 89.5;
  const verifiedCount = datasets.filter((d) => (d.data_quality_score || 0) >= 90).length;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-border/60">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Intelligent Data Hub
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[11px] font-mono font-semibold">
              DuckDB Catalog
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Universal ingestion, DuckDB in-memory tables, and 5-dimension continuous data trust governance.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={loadDatasets}
            className="p-2 rounded-lg bg-surface border border-border text-muted-foreground hover:text-foreground transition-colors"
            title="Refresh Catalog"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-primary" : ""}`} />
          </button>
          <button
            type="button"
            onClick={() => setActiveTab(activeTab === "upload" ? "catalog" : "upload")}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold bg-primary hover:bg-primary-hover text-primary-foreground shadow-xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{activeTab === "upload" ? "View Catalog" : "Ingest Dataset"}</span>
          </button>
        </div>
      </div>

      {/* Overview Stat Cards */}
      <DataHubOverview
        totalDatasets={datasets.length}
        totalRows={totalRows}
        avgTrustScore={avgTrust}
        verifiedCount={verifiedCount}
      />

      {/* NexusMart Highlight Banner */}
      <OneClickDemoBanner />

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-border">
        <button
          type="button"
          onClick={() => setActiveTab("catalog")}
          className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === "catalog"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <Database className="w-3.5 h-3.5" />
          <span>Active Datasets ({datasets.length})</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("upload")}
          className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === "upload"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Upload New File</span>
        </button>
      </div>

      {/* Tab Panels */}
      {activeTab === "catalog" ? (
        <DatasetCatalog datasets={datasets} />
      ) : (
        <UploadZone
          onUploadSuccess={() => {
            loadDatasets();
            setActiveTab("catalog");
          }}
        />
      )}
    </div>
  );
}
