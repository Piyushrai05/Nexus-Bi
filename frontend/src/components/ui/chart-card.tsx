"use client";

import React, { useState } from "react";
import {
  Sparkles,
  ShieldCheck,
  Download,
  Maximize2,
  Minimize2,
  Calendar,
  Layers,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ChartSkeleton } from "./loading-skeleton";
import { EmptyState } from "./empty-state";
import { ErrorState } from "./error-state";
import { useEvidenceStore } from "@/stores/evidence-store";
import { createEvidenceFromCatalog } from "@/lib/semantic-layer";
import { EvidencePayload } from "@/types/evidence";

export type TimeGranularity = "day" | "week" | "month";

export interface ChartCardProps {
  id?: string;
  title: string;
  subtitle?: string;
  periodLabel?: string;
  granularity?: TimeGranularity;
  onGranularityChange?: (g: TimeGranularity) => void;
  evidence?: EvidencePayload;
  onExplainWithAi?: () => void;
  onExportCsv?: () => void;
  isLoading?: boolean;
  isError?: boolean;
  errorMessage?: string;
  isEmpty?: boolean;
  emptyMessage?: string;
  height?: string; // e.g. "h-72" or "h-80"
  className?: string;
  children: React.ReactNode;
}

export function ChartCard({
  id,
  title,
  subtitle,
  periodLabel = "Last 30 Days",
  granularity = "day",
  onGranularityChange,
  evidence,
  onExplainWithAi,
  onExportCsv,
  isLoading = false,
  isError = false,
  errorMessage = "Unable to compute visualization series from telemetry.",
  isEmpty = false,
  emptyMessage = "No observations available for the selected filters.",
  height = "h-72",
  className,
  children,
}: ChartCardProps) {
  const { openEvidence } = useEvidenceStore();
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleOpenEvidence = () => {
    const payload =
      evidence ||
      createEvidenceFromCatalog(id || "net_revenue", {
        metricLabel: title,
        periodLabel,
      });
    openEvidence(payload);
  };

  return (
    <div
      className={cn(
        "p-5 rounded-xl border border-border bg-surface transition-all duration-200 flex flex-col justify-between space-y-4",
        isFullscreen && "fixed inset-4 z-50 bg-surface shadow-2xl p-6 overflow-auto",
        className
      )}
    >
      {/* Top Header: Title, Period, Granularity & Action Toolbar */}
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-foreground tracking-tight">
              {title}
            </h3>
            {periodLabel && (
              <span className="text-[10px] font-mono text-muted-foreground flex items-center gap-1 bg-surface-elevated px-2 py-0.5 rounded border border-border">
                <Calendar className="w-2.5 h-2.5" />
                {periodLabel}
              </span>
            )}
          </div>
          {subtitle && (
            <p className="text-xs text-muted-foreground leading-normal">
              {subtitle}
            </p>
          )}
        </div>

        {/* Toolbar Controls */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {/* Granularity Switcher: Day / Week / Month */}
          {onGranularityChange && (
            <div className="flex items-center bg-surface-elevated border border-border rounded-lg p-0.5 text-xs font-mono">
              {(["day", "week", "month"] as TimeGranularity[]).map((g) => (
                <button
                  key={g}
                  onClick={() => onGranularityChange(g)}
                  className={cn(
                    "px-2 py-0.5 rounded text-[11px] font-medium transition-colors uppercase",
                    granularity === g
                      ? "bg-blue-600 text-white font-bold shadow-xs"
                      : "text-slate-400 hover:text-white hover:bg-slate-800"
                  )}
                >
                  {g[0]}
                </button>
              ))}
            </div>
          )}

          {/* Audit Evidence Button */}
          <button
            onClick={handleOpenEvidence}
            className="h-7 px-2 rounded-lg bg-surface-elevated border border-border text-xs font-medium text-slate-300 hover:text-white hover:border-slate-700 transition-colors flex items-center gap-1"
            title="Inspect underlying DuckDB SQL and data lineage"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
            <span className="hidden sm:inline text-[11px]">Audit</span>
          </button>

          {/* Explain with AI Button */}
          {onExplainWithAi && (
            <button
              onClick={onExplainWithAi}
              className="h-7 px-2.5 rounded-lg bg-blue-600/10 border border-blue-500/20 text-blue-400 text-xs font-semibold hover:bg-blue-600/20 transition-colors flex items-center gap-1"
              title="Generate automated AI synthesis of this chart"
            >
              <Sparkles className="w-3 h-3 text-blue-400" />
              <span className="text-[11px]">Explain</span>
            </button>
          )}

          {/* Export CSV */}
          {onExportCsv && (
            <button
              onClick={onExportCsv}
              className="h-7 w-7 rounded-lg bg-surface-elevated border border-border text-muted-foreground hover:text-foreground flex items-center justify-center transition-colors"
              title="Download Series CSV"
            >
              <Download className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Fullscreen Toggle */}
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="h-7 w-7 rounded-lg bg-surface-elevated border border-border text-muted-foreground hover:text-foreground flex items-center justify-center transition-colors"
            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen View"}
          >
            {isFullscreen ? (
              <Minimize2 className="w-3.5 h-3.5" />
            ) : (
              <Maximize2 className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      </div>

      {/* Main Chart Content Area */}
      <div className={cn("w-full relative flex items-center justify-center", isFullscreen ? "h-[75vh]" : height)}>
        {isLoading ? (
          <ChartSkeleton height={isFullscreen ? "h-[70vh]" : height} />
        ) : isError ? (
          <ErrorState message={errorMessage} />
        ) : isEmpty ? (
          <EmptyState
            title="No Data Points Found"
            description={emptyMessage}
            icon={Layers}
          />
        ) : (
          <div className="w-full h-full">{children}</div>
        )}
      </div>
    </div>
  );
}
