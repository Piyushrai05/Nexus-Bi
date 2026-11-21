"use client";

import React from "react";
import {
  Sparkles,
  TrendingUp,
  AlertTriangle,
  Compass,
  ArrowRight,
  ShieldCheck,
  CheckSquare,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ConfidenceChip, ConfidenceTier } from "./confidence-chip";
import { useEvidenceStore } from "@/stores/evidence-store";
import { createEvidenceFromCatalog } from "@/lib/semantic-layer";
import { EvidencePayload } from "@/types/evidence";

export type InsightImpact =
  | "positive_opportunity"
  | "negative_risk"
  | "neutral_observation"
  | "important_trend";

export interface InsightCardProps {
  id?: string;
  title: string;
  explanation: React.ReactNode;
  supportingEvidence: string;
  impact?: InsightImpact;
  confidence?: ConfidenceTier;
  confidenceReason?: string;
  relatedKpi?: string;
  timestamp?: string;
  evidence?: EvidencePayload;
  onCreateDecision?: () => void;
  className?: string;
}

const IMPACT_CONFIG: Record<
  InsightImpact,
  {
    label: string;
    badgeClass: string;
    icon: React.ElementType;
  }
> = {
  positive_opportunity: {
    label: "Growth Opportunity",
    badgeClass: "bg-success/10 text-success border-success/30",
    icon: TrendingUp,
  },
  negative_risk: {
    label: "Business Risk",
    badgeClass: "bg-danger/10 text-danger border-danger/30",
    icon: AlertTriangle,
  },
  neutral_observation: {
    label: "Market Observation",
    badgeClass: "bg-info/10 text-info border-info/30",
    icon: Compass,
  },
  important_trend: {
    label: "Strategic Trend",
    badgeClass: "bg-primary/10 text-primary border-primary/30",
    icon: Sparkles,
  },
};

export function InsightCard({
  id,
  title,
  explanation,
  supportingEvidence,
  impact = "important_trend",
  confidence = "high",
  confidenceReason,
  relatedKpi,
  timestamp = "Computed just now",
  evidence,
  onCreateDecision,
  className,
}: InsightCardProps) {
  const { openEvidence } = useEvidenceStore();
  const impactInfo = IMPACT_CONFIG[impact] || IMPACT_CONFIG.important_trend;
  const ImpactIcon = impactInfo.icon;

  const handleOpenEvidence = () => {
    const payload =
      evidence ||
      createEvidenceFromCatalog(relatedKpi || "net_revenue", {
        metricLabel: title,
        definition: supportingEvidence,
        confidence,
        confidenceReason,
      });
    openEvidence(payload);
  };

  return (
    <div
      className={cn(
        "p-5 rounded-xl border border-border bg-surface-elevated ai-glow-border flex flex-col justify-between space-y-3 relative overflow-hidden transition-all duration-200 hover:shadow-xs",
        className
      )}
    >
      {/* Top Header: AI Badge, Impact & Confidence */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-primary/15 text-ai-accent text-[11px] font-mono font-semibold border border-primary/20">
            <Sparkles className="w-3 h-3 text-ai-accent" aria-hidden="true" />
            <span>AI Analyst Insight</span>
          </span>

          <span
            className={cn(
              "inline-flex items-center gap-1 px-2 py-0.5 rounded-md border text-[11px] font-medium font-mono",
              impactInfo.badgeClass
            )}
          >
            <ImpactIcon className="w-3 h-3" />
            <span>{impactInfo.label}</span>
          </span>
        </div>

        <ConfidenceChip level={confidence} reason={confidenceReason} />
      </div>

      {/* Main Insight Title & Explanation */}
      <div className="space-y-1.5">
        <h4 className="text-sm font-semibold text-foreground tracking-tight">
          {title}
        </h4>
        <div className="text-xs text-foreground/90 leading-relaxed font-normal">
          {explanation}
        </div>
      </div>

      {/* Supporting Evidence Bar (Non-negotiable AI Trust Rule) */}
      <div className="p-2.5 rounded-lg bg-surface border border-border/80 flex items-start gap-2 text-xs">
        <ShieldCheck className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
        <div className="flex-1 text-[11px] text-muted-foreground leading-normal">
          <span className="font-semibold text-foreground">Verified Evidence: </span>
          {supportingEvidence}
        </div>
      </div>

      {/* Actions & Metadata Footer */}
      <div className="pt-2 border-t border-border/60 flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-3">
          <button
            onClick={handleOpenEvidence}
            className="text-xs text-primary hover:text-ai-accent font-semibold flex items-center gap-1 transition-colors"
          >
            <span>Show Evidence</span>
            <ArrowRight className="w-3 h-3" />
          </button>

          {onCreateDecision && (
            <button
              onClick={onCreateDecision}
              className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors font-medium"
            >
              <CheckSquare className="w-3 h-3 text-success" />
              <span>Create Decision</span>
            </button>
          )}
        </div>

        <span className="text-[10px] font-mono text-muted-foreground">
          {timestamp}
        </span>
      </div>
    </div>
  );
}
