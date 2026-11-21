"use client";

import React, { useState, useEffect } from "react";
import {
  CheckSquare,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ArrowRight,
  Filter,
  DollarSign,
  Info,
} from "lucide-react";
import { apiClient } from "@/lib/api-client";
import { useEvidenceStore } from "@/stores/evidence-store";
import { TrustBadge } from "@/components/ui/trust-badge";
import {
  RecommendationCenter,
  RecommendationItem,
} from "@/components/dashboard/recommendation-center";

export default function DecisionsPage() {
  const [recommendations, setRecommendations] = useState<RecommendationItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRecs = async () => {
      setIsLoading(true);
      try {
        const res = await apiClient.getDashboardRecommendations();
        setRecommendations(res.data as RecommendationItem[]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRecs();
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-12">
      {/* 1. Header Banner */}
      <div className="space-y-4 pb-2 border-b border-border/80">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-surface-elevated border border-border text-foreground font-medium">
              <CheckSquare className="w-3.5 h-3.5 text-primary" />
              <span className="font-semibold">Module:</span>
              <span>Executive Decision Intelligence Center</span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-primary/10 border border-primary/20 text-primary font-mono text-[11px] font-semibold">
              <Sparkles className="w-3 h-3 text-ai-accent" />
              <span>ACTIONABLE DECISIONS</span>
            </div>
          </div>
          <div className="flex items-center gap-3 text-muted-foreground font-mono text-[11px]">
            <span>Pending Decisions: <strong className="text-foreground">5 Actions</strong></span>
            <span>·</span>
            <span>Quantified Impact: <strong className="text-emerald-400">+$15,100 Direct</strong></span>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2.5">
              <span>Decision Intelligence & Action Hub</span>
              <TrustBadge status="verified" />
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              Transform passive telemetry into proactive decisions. Review evidence-backed operational interventions with auditable ROI math.
            </p>
          </div>
        </div>
      </div>

      {/* 2. Recommendation Center */}
      <RecommendationCenter recommendations={recommendations} />
    </div>
  );
}