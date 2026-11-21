"use client";

import React from "react";
import {
  ShieldCheck,
  AlertTriangle,
  HelpCircle,
  Clock,
  FileQuestion,
  XCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type TrustStatus =
  | "verified"
  | "warning"
  | "unverified"
  | "stale"
  | "incomplete"
  | "failed_validation";

export interface TrustBadgeProps {
  status: TrustStatus;
  score?: number; // 0-100
  lastUpdated?: string;
  source?: string;
  detail?: string;
  className?: string;
  showDetails?: boolean;
}

const TRUST_CONFIG: Record<
  TrustStatus,
  {
    label: string;
    badgeClass: string;
    icon: React.ElementType;
    defaultDetail: string;
  }
> = {
  verified: {
    label: "Verified & Governed",
    badgeClass: "bg-success/10 text-success border-success/30",
    icon: ShieldCheck,
    defaultDetail: "Passed schema validation, zero null primary keys, and reconciled against bank records.",
  },
  warning: {
    label: "Data Quality Warning",
    badgeClass: "bg-warning/10 text-warning border-warning/30",
    icon: AlertTriangle,
    defaultDetail: "Mild schema drift or 2.1% missing optional attributes detected.",
  },
  unverified: {
    label: "Unverified Import",
    badgeClass: "bg-muted text-muted-foreground border-border",
    icon: HelpCircle,
    defaultDetail: "Uploaded dataset without verified primary key constraints or lineage checksum.",
  },
  stale: {
    label: "Stale Telemetry",
    badgeClass: "bg-warning/10 text-warning border-warning/30",
    icon: Clock,
    defaultDetail: "Source pipeline has not reported new records in >24 hours.",
  },
  incomplete: {
    label: "Incomplete Schema",
    badgeClass: "bg-warning/10 text-warning border-warning/30",
    icon: FileQuestion,
    defaultDetail: "Missing required dimensional columns (e.g., regional breakdown or cost data).",
  },
  failed_validation: {
    label: "Failed Validation",
    badgeClass: "bg-danger/10 text-danger border-danger/30",
    icon: XCircle,
    defaultDetail: "Severe schema mismatch, corrupted timestamps, or collision in unique identifiers.",
  },
};

export function TrustBadge({
  status,
  score,
  lastUpdated,
  source,
  detail,
  className,
  showDetails = false,
}: TrustBadgeProps) {
  const config = TRUST_CONFIG[status] || TRUST_CONFIG.unverified;
  const Icon = config.icon;
  const tooltipText = detail || config.defaultDetail;

  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 px-2.5 py-1 rounded-lg border text-xs font-medium select-none transition-colors",
        config.badgeClass,
        className
      )}
      title={`${config.label} — ${tooltipText}`}
      role="status"
    >
      <Icon className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
      <div className="flex items-center gap-1.5">
        <span className="font-semibold">{config.label}</span>
        {score !== undefined && (
          <span className="font-mono text-[11px] opacity-90 font-bold px-1 rounded bg-black/10 dark:bg-white/10">
            {score}/100
          </span>
        )}
      </div>

      {showDetails && (source || lastUpdated) && (
        <span className="text-[10px] text-muted-foreground font-mono border-l border-current/20 pl-1.5 ml-0.5">
          {source && <span>{source}</span>}
          {source && lastUpdated && <span> · </span>}
          {lastUpdated && <span>{lastUpdated}</span>}
        </span>
      )}
    </div>
  );
}
