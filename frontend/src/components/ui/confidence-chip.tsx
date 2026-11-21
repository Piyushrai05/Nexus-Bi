"use client";

import React from "react";
import { ShieldCheck, AlertCircle, HelpCircle, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

export type ConfidenceTier = "high" | "medium" | "low" | "insufficient_evidence";

export interface ConfidenceChipProps {
  level: ConfidenceTier;
  reason?: string;
  score?: number; // optional 0-100 score
  className?: string;
  showIcon?: boolean;
}

export const CONFIDENCE_CONFIG: Record<
  ConfidenceTier,
  {
    label: string;
    badgeClass: string;
    icon: React.ElementType;
    defaultReason: string;
  }
> = {
  high: {
    label: "High Confidence",
    badgeClass: "bg-success/10 text-success border-success/20",
    icon: ShieldCheck,
    defaultReason:
      "Direct transactional record matching across primary ledgers with >=99% completeness and verified deterministic joins.",
  },
  medium: {
    label: "Medium Confidence",
    badgeClass: "bg-warning/10 text-warning border-warning/20",
    icon: AlertCircle,
    defaultReason:
      "Calculated from aggregate channel telemetry with partial attribution or seasonal trend estimation.",
  },
  low: {
    label: "Low Confidence",
    badgeClass: "bg-danger/10 text-danger border-danger/20",
    icon: AlertTriangle,
    defaultReason:
      "Inferred pattern with high variance, unverified external proxies, or missing baseline observations.",
  },
  insufficient_evidence: {
    label: "Insufficient Evidence",
    badgeClass: "bg-muted text-muted-foreground border-border",
    icon: HelpCircle,
    defaultReason:
      "Sample size below statistical threshold (<30 observations). Data is insufficient to draw an audited conclusion.",
  },
};

export function ConfidenceChip({
  level,
  reason,
  score,
  className,
  showIcon = true,
}: ConfidenceChipProps) {
  const config = CONFIDENCE_CONFIG[level] || CONFIDENCE_CONFIG.medium;
  const Icon = config.icon;
  const tooltipText = reason || config.defaultReason;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border text-[11px] font-mono font-medium transition-colors cursor-help select-none",
        config.badgeClass,
        className
      )}
      title={tooltipText}
      role="status"
      aria-label={`${config.label}: ${tooltipText}`}
    >
      {showIcon && <Icon className="w-3 h-3 shrink-0" aria-hidden="true" />}
      <span>{config.label}</span>
      {score !== undefined && (
        <span className="opacity-80 font-semibold">({score}%)</span>
      )}
    </span>
  );
}
