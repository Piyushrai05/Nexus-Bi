"use client";

import React from "react";
import { Database, ShieldCheck, HardDrive, Clock, CheckCircle2, AlertTriangle } from "lucide-react";
import { TrustBadge } from "@/components/ui/trust-badge";

interface OverviewProps {
  totalDatasets: number;
  totalRows: number;
  avgTrustScore: number;
  verifiedCount: number;
}

export function DataHubOverview({
  totalDatasets = 4,
  totalRows = 5089,
  avgTrustScore = 89.5,
  verifiedCount = 3,
}: Partial<OverviewProps>) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total Datasets */}
      <div className="p-5 rounded-xl bg-surface border border-border flex items-center justify-between">
        <div className="space-y-1">
          <span className="text-xs font-medium text-muted-foreground">Connected Datasets</span>
          <div className="text-2xl font-bold font-mono text-foreground">{totalDatasets}</div>
          <span className="text-[11px] font-mono text-ai-accent">Parquet &amp; DuckDB In-Memory</span>
        </div>
        <div className="w-10 h-10 rounded-lg bg-surface-elevated border border-border flex items-center justify-center text-primary">
          <Database className="w-5 h-5" />
        </div>
      </div>

      {/* Total Rows */}
      <div className="p-5 rounded-xl bg-surface border border-border flex items-center justify-between">
        <div className="space-y-1">
          <span className="text-xs font-medium text-muted-foreground">Total Ingested Records</span>
          <div className="text-2xl font-bold font-mono text-foreground">
            {totalRows.toLocaleString()}
          </div>
          <span className="text-[11px] font-mono text-emerald-400">Zero Ingestion Latency</span>
        </div>
        <div className="w-10 h-10 rounded-lg bg-surface-elevated border border-border flex items-center justify-center text-emerald-400">
          <HardDrive className="w-5 h-5" />
        </div>
      </div>

      {/* Average Data Trust Score */}
      <div className="p-5 rounded-xl bg-surface border border-border flex items-center justify-between">
        <div className="space-y-1">
          <span className="text-xs font-medium text-muted-foreground">Average Trust Score</span>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold font-mono text-foreground">
              {avgTrustScore.toFixed(1)}
            </span>
            <span className="text-xs text-muted-foreground font-mono">/ 100</span>
          </div>
          <div className="flex items-center gap-1.5 pt-0.5">
            <TrustBadge status={avgTrustScore >= 90 ? "verified" : "warning"} />
          </div>
        </div>
        <div className="w-10 h-10 rounded-lg bg-surface-elevated border border-border flex items-center justify-center text-ai-accent">
          <ShieldCheck className="w-5 h-5" />
        </div>
      </div>

      {/* Verification Status */}
      <div className="p-5 rounded-xl bg-surface border border-border flex items-center justify-between">
        <div className="space-y-1">
          <span className="text-xs font-medium text-muted-foreground">Verification Health</span>
          <div className="text-2xl font-bold font-mono text-emerald-400">
            {verifiedCount} / {totalDatasets} Verified
          </div>
          <span className="text-[11px] font-mono text-amber-400">
            {totalDatasets - verifiedCount} Requires Remediation
          </span>
        </div>
        <div className="w-10 h-10 rounded-lg bg-surface-elevated border border-border flex items-center justify-center text-amber-400">
          <AlertTriangle className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
}
