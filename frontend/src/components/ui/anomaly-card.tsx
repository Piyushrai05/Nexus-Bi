"use client";

import React from "react";
import {
  AlertTriangle,
  ArrowRight,
  TrendingDown,
  TrendingUp,
  ShieldAlert,
  Search,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ConfidenceChip, ConfidenceTier } from "./confidence-chip";
import { useEvidenceStore } from "@/stores/evidence-store";
import { createEvidenceFromCatalog } from "@/lib/semantic-layer";
import { EvidencePayload } from "@/types/evidence";

export type AnomalySeverity = "critical" | "high" | "medium" | "low";

export interface AnomalyCardProps {
  id?: string;
  title: string;
  metric: string;
  expectedValue: string;
  actualValue: string;
  deviationPercent: number; // e.g. -24.8 or +18.2
  severity: AnomalySeverity;
  isUnfavorable?: boolean; // default true for anomalies
  detectedAt?: string;
  contributingFactors: string[];
  confidence?: ConfidenceTier;
  confidenceReason?: string;
  evidence?: EvidencePayload;
  onInvestigate?: () => void;
  className?: string;
}

const SEVERITY_CONFIG: Record<
  AnomalySeverity,
  {
    label: string;
    badgeClass: string;
    borderClass: string;
  }
> = {
  critical: {
    label: "Critical Anomaly",
    badgeClass: "bg-danger/15 text-danger border-danger/30 font-bold",
    borderClass: "border-l-4 border-l-danger",
  },
  high: {
    label: "High Severity",
    badgeClass: "bg-danger/10 text-danger border-danger/20",
    borderClass: "border-l-4 border-l-danger/80",
  },
  medium: {
    label: "Medium Severity",
    badgeClass: "bg-warning/10 text-warning border-warning/20",
    borderClass: "border-l-4 border-l-warning",
  },
  low: {
    label: "Low Deviation",
    badgeClass: "bg-info/10 text-info border-info/20",
    borderClass: "border-l-4 border-l-info",
  },
};

export function AnomalyCard({
  id,
  title,
  metric,
  expectedValue,
  actualValue,
  deviationPercent,
  severity = "high",
  isUnfavorable = true,
  detectedAt = "Detected today, 08:30 UTC",
  contributingFactors,
  confidence = "high",
  confidenceReason,
  evidence,
  onInvestigate,
  className,
}: AnomalyCardProps) {
  const { openEvidence } = useEvidenceStore();
  const severityInfo = SEVERITY_CONFIG[severity] || SEVERITY_CONFIG.medium;

  const handleOpenEvidence = () => {
    if (onInvestigate) {
      onInvestigate();
      return;
    }
    const payload =
      evidence ||
      createEvidenceFromCatalog(metric.toLowerCase().replace(/\s+/g, "_"), {
        metricLabel: `${metric} Anomaly`,
        valueFormatted: actualValue,
        deltaFormatted: `${deviationPercent > 0 ? "+" : ""}${deviationPercent.toFixed(1)}% deviation`,
        definition: `Observed metric deviated from the statistical baseline (${expectedValue}) by ${deviationPercent.toFixed(1)}%.`,
        assumptions: contributingFactors,
        confidence,
        confidenceReason,
      });
    openEvidence(payload);
  };

  const isUp = deviationPercent > 0;
  const TrendIcon = isUp ? TrendingUp : TrendingDown;

  return (
    <div
      className={cn(
        "p-5 rounded-xl border border-border bg-surface flex flex-col justify-between space-y-4 transition-all duration-200 hover:border-border/80 shadow-xs",
        severityInfo.borderClass,
        className
      )}
    >
      {/* Top Header */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md border text-[11px] font-mono",
              severityInfo.badgeClass
            )}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>{severityInfo.label}</span>
          </span>
          <span className="text-xs font-semibold text-foreground/80 font-mono">
            {metric}
          </span>
        </div>

        <ConfidenceChip level={confidence} reason={confidenceReason} />
      </div>

      {/* Anomaly Headline & Value Comparison Grid */}
      <div className="space-y-2">
        <h4 className="text-sm font-semibold text-foreground tracking-tight">
          {title}
        </h4>

        <div className="grid grid-cols-3 gap-2 p-3 rounded-lg bg-surface-elevated border border-border text-center font-mono">
          <div>
            <div className="text-[10px] text-muted-foreground uppercase">Expected</div>
            <div className="text-xs font-semibold text-foreground mt-0.5">
              {expectedValue}
            </div>
          </div>
          <div>
            <div className="text-[10px] text-muted-foreground uppercase">Actual</div>
            <div className="text-xs font-bold text-foreground mt-0.5">
              {actualValue}
            </div>
          </div>
          <div>
            <div className="text-[10px] text-muted-foreground uppercase">Deviation</div>
            <div
              className={cn(
                "text-xs font-bold mt-0.5 flex items-center justify-center gap-1",
                isUnfavorable ? "text-danger" : "text-success"
              )}
            >
              <TrendIcon className="w-3 h-3" />
              <span>
                {deviationPercent > 0 ? "+" : ""}
                {deviationPercent.toFixed(1)}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Possible Contributing Factors */}
      {contributingFactors.length > 0 && (
        <div className="space-y-1.5">
          <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider font-mono">
            Possible Contributing Factors (Decomposition):
          </span>
          <ul className="space-y-1">
            {contributingFactors.map((factor, idx) => (
              <li
                key={idx}
                className="text-xs text-muted-foreground flex items-start gap-2 bg-surface-elevated/40 p-1.5 rounded-md border border-border/50"
              >
                <span className="text-primary font-bold mt-0.5">•</span>
                <span className="text-foreground/90">{factor}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Footer Actions */}
      <div className="pt-2 border-t border-border/60 flex items-center justify-between text-xs">
        <span className="text-[11px] font-mono text-muted-foreground">
          {detectedAt}
        </span>

        <button
          onClick={handleOpenEvidence}
          className="px-3 py-1 rounded-lg bg-surface-elevated border border-border text-xs font-semibold text-primary hover:text-foreground hover:border-primary/40 transition-colors flex items-center gap-1.5"
        >
          <Search className="w-3 h-3 text-primary" />
          <span>Investigate Root Cause</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
}
