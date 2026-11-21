"use client";

import React, { useState } from "react";
import { CheckSquare, Info, ShieldCheck, Sparkles, Filter } from "lucide-react";
import {
  RecommendationCard,
  DecisionPriority,
  DecisionStatus,
  DecisionOwner,
} from "@/components/ui/recommendation-card";
import { useEvidenceStore } from "@/stores/evidence-store";

export interface RecommendationItem {
  id: string;
  title: string;
  business_problem: string;
  evidence_summary: string;
  expected_impact?: string;
  confidence_tier: "high" | "medium" | "low";
  priority: string;
  suggested_owner: string;
  status: string;
  is_synthetic_demo?: boolean;
}

interface RecommendationCenterProps {
  recommendations: RecommendationItem[];
  isLoading?: boolean;
}

export function RecommendationCenter({
  recommendations,
  isLoading = false,
}: RecommendationCenterProps) {
  const { openEvidence } = useEvidenceStore();
  const [localStatuses, setLocalStatuses] = useState<Record<string, DecisionStatus>>({});
  const [filterPriority, setFilterPriority] = useState<string>("all");

  const handleStatusChange = (id: string, newStatus: DecisionStatus) => {
    setLocalStatuses((prev) => ({
      ...prev,
      [id]: newStatus,
    }));
  };

  const parsePriority = (p: string): DecisionPriority => {
    if (p.includes("P1") || p.includes("Critical")) return "P1";
    if (p.includes("P2") || p.includes("High")) return "P2";
    if (p.includes("P3") || p.includes("Medium")) return "P3";
    return "P2";
  };

  const parseOwner = (ownerStr: string): DecisionOwner => {
    const parts = ownerStr.split(" - ");
    if (parts.length > 1) {
      return { name: parts[0], role: parts[1] };
    }
    return { name: ownerStr, role: "Executive Owner" };
  };

  const filteredRecs = recommendations.filter((r) => {
    if (filterPriority === "all") return true;
    return r.priority.includes(filterPriority);
  });

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-foreground flex items-center gap-2">
              <CheckSquare className="w-4 h-4 text-emerald-400" />
              <span>Recommended Next Actions (Executive Decision Center)</span>
            </h2>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-mono font-semibold">
              Actionable Governance
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Prescriptive, evidence-backed operational decisions with financial impact estimates and ownership tracking.
          </p>
        </div>

        {/* Priority Filter */}
        <div className="flex items-center gap-1.5 bg-surface p-1 rounded-lg border border-border text-xs">
          <Filter className="w-3.5 h-3.5 text-muted-foreground ml-1.5" />
          <button
            type="button"
            onClick={() => setFilterPriority("all")}
            className={`px-2.5 py-1 rounded text-xs transition-colors ${
              filterPriority === "all"
                ? "bg-surface-elevated text-foreground font-semibold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            All ({recommendations.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterPriority("P1")}
            className={`px-2.5 py-1 rounded text-xs transition-colors ${
              filterPriority === "P1"
                ? "bg-rose-500/10 text-rose-400 font-semibold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            P1 Critical
          </button>
          <button
            type="button"
            onClick={() => setFilterPriority("P2")}
            className={`px-2.5 py-1 rounded text-xs transition-colors ${
              filterPriority === "P2"
                ? "bg-amber-500/10 text-amber-400 font-semibold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            P2 High
          </button>
        </div>
      </div>

      {/* Grid of Decision Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredRecs.map((rec) => {
          const currentStatus = localStatuses[rec.id] || "pending";
          const priority = parsePriority(rec.priority);
          const owner = parseOwner(rec.suggested_owner);

          return (
            <RecommendationCard
              key={rec.id}
              id={rec.id}
              title={rec.title}
              businessProblem={rec.business_problem}
              supportingEvidence={rec.evidence_summary}
              suggestedAction={`Execute recommended workflow via ${rec.suggested_owner}.`}
              expectedImpact={rec.expected_impact || "Quantifiable variance mitigation."}
              priority={priority}
              confidence={rec.confidence_tier}
              confidenceReason="Generated from verified multi-dimensional DuckDB root-cause analysis."
              owner={owner}
              deadline="Within 7 business days"
              initialStatus={currentStatus}
              onStatusChange={handleStatusChange}
            />
          );
        })}
      </div>

      {/* Governance & UI State Notice */}
      <div className="p-3 rounded-lg bg-surface-elevated/40 border border-border text-[11px] text-muted-foreground flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Info className="w-3.5 h-3.5 text-primary shrink-0" />
          <span>
            <strong>Local Demo Session State:</strong> Status changes (Pending, Approved, In Progress, Completed) update local UI governance state. Real-world ERP or warehouse mutations require operational integration.
          </span>
        </div>
        <span className="font-mono text-[10px] text-emerald-400 hidden sm:inline">
          Human-in-the-Loop Safe
        </span>
      </div>
    </div>
  );
}
