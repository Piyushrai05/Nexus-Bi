"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Search,
  Filter,
  ArrowRight,
  Database,
  FileSpreadsheet,
  ShieldCheck,
  AlertTriangle,
  Clock,
  Sparkles,
} from "lucide-react";
import { TrustBadge } from "@/components/ui/trust-badge";

export interface DatasetItem {
  dataset_id: string;
  name: string;
  file_type: string;
  row_count: number;
  column_count: number;
  size_bytes: number;
  created_at: string;
  data_quality_score: number;
  is_demo?: boolean;
}

interface DatasetCatalogProps {
  datasets: DatasetItem[];
}

export function DatasetCatalog({ datasets }: DatasetCatalogProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "verified" | "warning">("all");

  const filtered = datasets.filter((ds) => {
    const matchesSearch =
      ds.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ds.dataset_id.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;
    if (statusFilter === "verified") return ds.data_quality_score >= 90;
    if (statusFilter === "warning") return ds.data_quality_score < 90;
    return true;
  });

  return (
    <div className="space-y-4">
      {/* Controls: Search and Filter Pills */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search datasets by name or ID..."
            className="w-full pl-9 pr-3.5 py-2 rounded-lg bg-surface border border-border text-foreground text-xs focus:outline-none focus:border-primary transition-colors"
          />
        </div>

        {/* Status Filters */}
        <div className="flex items-center gap-1.5 bg-surface p-1 rounded-lg border border-border">
          <button
            type="button"
            onClick={() => setStatusFilter("all")}
            className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
              statusFilter === "all"
                ? "bg-surface-elevated text-foreground shadow-xs font-semibold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            All ({datasets.length})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter("verified")}
            className={`px-3 py-1 rounded text-xs font-medium transition-colors flex items-center gap-1 ${
              statusFilter === "verified"
                ? "bg-emerald-500/10 text-emerald-400 font-semibold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <ShieldCheck className="w-3 h-3 text-emerald-400" />
            <span>Verified</span>
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter("warning")}
            className={`px-3 py-1 rounded text-xs font-medium transition-colors flex items-center gap-1 ${
              statusFilter === "warning"
                ? "bg-amber-500/10 text-amber-400 font-semibold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <AlertTriangle className="w-3 h-3 text-amber-400" />
            <span>Needs Audit</span>
          </button>
        </div>
      </div>

      {/* Catalog Grid / Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((ds) => {
          const isHealthy = ds.data_quality_score >= 90;
          return (
            <div
              key={ds.dataset_id}
              className={`p-5 rounded-xl bg-surface border transition-all duration-200 flex flex-col justify-between ${
                isHealthy
                  ? "border-border hover:border-primary/50"
                  : "border-amber-500/30 bg-amber-500/[0.02] hover:border-amber-500/60"
              }`}
            >
              <div>
                {/* Header Row */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm text-foreground">{ds.name}</span>
                      {ds.is_demo && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-surface-elevated border border-border text-ai-accent">
                          Demo
                        </span>
                      )}
                    </div>
                    <div className="text-xs font-mono text-muted-foreground">
                      ID: <code>{ds.dataset_id}</code>
                    </div>
                  </div>

                  {/* Trust Score Badge */}
                  <div className="text-right shrink-0">
                    <div className="flex items-center gap-1.5 justify-end">
                      <span
                        className={`text-lg font-black font-mono ${
                          isHealthy ? "text-emerald-400" : "text-amber-400"
                        }`}
                      >
                        {ds.data_quality_score.toFixed(1)}
                      </span>
                      <span className="text-[10px] font-mono text-muted-foreground">/100</span>
                    </div>
                    <TrustBadge status={isHealthy ? "verified" : "warning"} />
                  </div>
                </div>

                {/* Metadata Pill Stats */}
                <div className="grid grid-cols-3 gap-2 py-3 border-y border-border/50 text-xs">
                  <div>
                    <span className="text-[11px] text-muted-foreground block">Rows</span>
                    <span className="font-mono font-semibold text-foreground">
                      {ds.row_count.toLocaleString()}
                    </span>
                  </div>
                  <div>
                    <span className="text-[11px] text-muted-foreground block">Columns</span>
                    <span className="font-mono font-semibold text-foreground">
                      {ds.column_count} fields
                    </span>
                  </div>
                  <div>
                    <span className="text-[11px] text-muted-foreground block">Storage</span>
                    <span className="font-mono font-semibold text-foreground uppercase">
                      {ds.file_type}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Footer */}
              <div className="pt-4 mt-2 flex items-center justify-between">
                <span className="text-[11px] font-mono text-muted-foreground">
                  Embedded in DuckDB
                </span>

                <Link
                  href={`/data/${ds.dataset_id}`}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-surface-elevated hover:bg-surface border border-border text-foreground hover:border-primary/50 transition-colors"
                >
                  <span>Inspect Data Quality</span>
                  <ArrowRight className="w-3.5 h-3.5 text-primary" />
                </Link>
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="col-span-full p-8 text-center bg-surface rounded-xl border border-border text-muted-foreground text-sm">
            No datasets match the current filter criteria.
          </div>
        )}
      </div>
    </div>
  );
}
