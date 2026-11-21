"use client";

import React from "react";
import {
  TrendingUp,
  TrendingDown,
  Info,
  ShieldCheck,
  Minus,
} from "lucide-react";
import { cn, formatCurrency, formatPercent, formatCompactNumber } from "@/lib/utils";
import { useEvidenceStore } from "@/stores/evidence-store";
import { createEvidenceFromCatalog } from "@/lib/semantic-layer";
import { KPISkeleton } from "./loading-skeleton";
import { EvidencePayload } from "@/types/evidence";

export type MetricType = "currency" | "percent" | "integer" | "decimal" | "ratio";
export type MetricPolarity = "up-is-good" | "down-is-good" | "neutral";

export interface KPICardProps {
  id?: string;
  title: string;
  value: number;
  type?: MetricType;
  currency?: string;
  previousValue?: number;
  delta?: number; // e.g. +14.2 or -8.5
  polarity?: MetricPolarity; // default "up-is-good"
  periodLabel?: string; // e.g. "vs prev 30d"
  description?: string;
  sparkline?: number[];
  targetValue?: number;
  evidence?: EvidencePayload;
  isLoading?: boolean;
  className?: string;
}

export function KPICard({
  id,
  title,
  value,
  type = "currency",
  currency = "USD",
  delta,
  polarity = "up-is-good",
  periodLabel = "vs prev 30d",
  description,
  sparkline,
  targetValue,
  evidence,
  isLoading = false,
  className,
}: KPICardProps) {
  const { openEvidence } = useEvidenceStore();

  if (isLoading) {
    return <KPISkeleton />;
  }

  // Format value
  const formattedValue = (() => {
    switch (type) {
      case "currency":
        return formatCurrency(value, currency, false);
      case "percent":
        return formatPercent(value, false);
      case "ratio":
        return `${value.toFixed(2)}x`;
      case "decimal":
        return value.toFixed(2);
      case "integer":
      default:
        return formatCompactNumber(value);
    }
  })();

  // Determine delta direction & polarity coloring
  const hasDelta = delta !== undefined && delta !== null && !isNaN(delta);
  const deltaIsUp = hasDelta && delta > 0;
  const deltaIsZero = hasDelta && Math.abs(delta) < 0.001;

  // Polarity evaluation:
  // if up-is-good: up = positive (success), down = negative (danger)
  // if down-is-good (churn, cost): up = negative (danger), down = positive (success)
  // if neutral: muted
  let isFavorable = true;
  if (polarity === "up-is-good") {
    isFavorable = deltaIsUp;
  } else if (polarity === "down-is-good") {
    isFavorable = !deltaIsUp;
  }

  const deltaColorClass = deltaIsZero
    ? "text-muted-foreground bg-surface-muted"
    : isFavorable
    ? "text-success bg-success/10 border-success/20"
    : "text-danger bg-danger/10 border-danger/20";

  const DeltaIcon = deltaIsZero
    ? Minus
    : deltaIsUp
    ? TrendingUp
    : TrendingDown;

  const handleOpenEvidence = (e: React.MouseEvent) => {
    e.stopPropagation();
    const payload =
      evidence ||
      createEvidenceFromCatalog(id || title.toLowerCase().replace(/\s+/g, "_"), {
        metricLabel: title,
        valueFormatted: formattedValue,
        deltaFormatted: hasDelta ? `${delta > 0 ? "+" : ""}${delta.toFixed(1)}%` : undefined,
        periodLabel,
      });
    openEvidence(payload);
  };

  // Sparkline coordinates for mini SVG
  const renderSparkline = () => {
    if (!sparkline || sparkline.length < 2) return null;
    const min = Math.min(...sparkline);
    const max = Math.max(...sparkline);
    const range = max - min || 1;
    const width = 120;
    const height = 28;

    const points = sparkline
      .map((val, idx) => {
        const x = (idx / (sparkline.length - 1)) * width;
        const y = height - ((val - min) / range) * (height - 4) - 2;
        return `${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(" ");

    return (
      <svg
        className="w-full h-7 overflow-visible opacity-80"
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <polyline
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={cn(isFavorable ? "text-success" : "text-danger")}
          points={points}
        />
      </svg>
    );
  };

  // Target progress if specified
  const progressPercent = targetValue
    ? Math.min(100, Math.max(0, (value / targetValue) * 100))
    : null;

  return (
    <div
      className={cn(
        "p-5 rounded-2xl border border-slate-800 bg-slate-900/60 hover:border-slate-700 hover:bg-slate-900/80 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/40 transition-all duration-200 flex flex-col justify-between group relative select-none",
        className
      )}
    >
      {/* Top: Title & Info / Evidence Trigger */}
      <div className="flex items-center justify-between gap-2">
        <span
          className="text-xs font-medium text-muted-foreground tracking-tight truncate cursor-help"
          title={description || title}
        >
          {title}
        </span>
        <button
          onClick={handleOpenEvidence}
          className="text-muted-foreground hover:text-primary transition-colors p-1 rounded-md hover:bg-surface-elevated"
          title="Open Audit Trail &amp; Evidence Drawer"
          aria-label={`View evidence for ${title}`}
        >
          <Info className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Middle: Hero Value & Delta */}
      <div className="my-2.5 space-y-1.5">
        <div className="text-3xl font-semibold font-mono tracking-tight text-foreground tabular-nums">
          {formattedValue}
        </div>

        {hasDelta && (
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={cn(
                "inline-flex items-center gap-1 text-[11px] font-mono font-semibold px-1.5 py-0.5 rounded border",
                deltaColorClass
              )}
            >
              <DeltaIcon className="w-3 h-3 shrink-0" aria-hidden="true" />
              <span>
                {delta > 0 ? "+" : ""}
                {delta.toFixed(1)}%
              </span>
            </span>
            <span className="text-[11px] text-muted-foreground font-medium">
              {periodLabel}
            </span>
          </div>
        )}
      </div>

      {/* Optional Sparkline */}
      {sparkline && <div className="mt-1 pt-1">{renderSparkline()}</div>}

      {/* Optional Target Progress */}
      {progressPercent !== null && targetValue && (
        <div className="mt-2 pt-2 border-t border-border/60 space-y-1">
          <div className="flex items-center justify-between text-[10px] font-mono text-muted-foreground">
            <span>Target: {formatCurrency(targetValue, currency, true)}</span>
            <span>{progressPercent.toFixed(0)}%</span>
          </div>
          <div className="w-full h-1.5 bg-surface-elevated rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
