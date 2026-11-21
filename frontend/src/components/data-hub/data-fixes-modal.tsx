"use client";

import React, { useState } from "react";
import {
  ShieldAlert,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  X,
  Layers,
  Wand2,
  Lock,
  RotateCcw,
} from "lucide-react";
import { TrustBadge } from "@/components/ui/trust-badge";

interface DataFixesModalProps {
  datasetId: string;
  isOpen: boolean;
  onClose: () => void;
  currentScore: number;
}

export function DataFixesModal({
  datasetId,
  isOpen,
  onClose,
  currentScore = 68.4,
}: DataFixesModalProps) {
  const [selectedFixes, setSelectedFixes] = useState<string[]>([
    "dedup",
    "nulls",
    "outliers",
    "dates",
  ]);
  const [simulated, setSimulated] = useState(false);

  if (!isOpen) return null;

  const toggleFix = (id: string) => {
    if (selectedFixes.includes(id)) {
      setSelectedFixes(selectedFixes.filter((f) => f !== id));
    } else {
      setSelectedFixes([...selectedFixes, id]);
    }
  };

  const projectedScore = Math.min(
    98.5,
    currentScore + selectedFixes.length * 6.8
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl rounded-2xl bg-surface border border-border shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-surface-elevated/40">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center text-primary">
              <Wand2 className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-foreground flex items-center gap-2">
                <span>Safe One-Click Remediation Sandbox</span>
                <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Non-Destructive
                </span>
              </h2>
              <p className="text-xs text-muted-foreground">
                Dataset: <code className="text-ai-accent">{datasetId}</code> · Previews transformations without modifying the raw source table.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-surface-elevated transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          {/* Non-Destructive Guarantee Banner */}
          <div className="p-3.5 rounded-xl bg-primary/5 border border-primary/20 flex items-start gap-3">
            <Lock className="w-4 h-4 text-primary shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <span className="font-semibold text-foreground text-xs">
                Zero Mutation Guarantee
              </span>
              <p className="text-muted-foreground text-[11px] leading-relaxed">
                Raw data remains completely immutable. Fixes generate a virtual cleaned view in DuckDB, allowing downstream predictive models to train safely without data loss.
              </p>
            </div>
          </div>

          {/* Remediation Selectors */}
          <div className="space-y-3">
            <h3 className="font-semibold text-foreground text-xs uppercase tracking-wider font-mono">
              Available Automated Fixes
            </h3>

            {/* Fix 1: Deduplication */}
            <label className="flex items-start gap-3 p-3.5 rounded-xl bg-surface-elevated/50 border border-border cursor-pointer hover:border-border-focus transition-colors">
              <input
                type="checkbox"
                checked={selectedFixes.includes("dedup")}
                onChange={() => toggleFix("dedup")}
                className="mt-0.5 rounded border-border text-primary focus:ring-primary"
              />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-foreground">Deduplicate Identical Order Transactions</span>
                  <span className="font-mono text-[11px] text-amber-400">25 duplicate rows</span>
                </div>
                <p className="text-muted-foreground text-[11px] mt-0.5">
                  Eliminates identical multi-inserted rows based on primary composite key (<code>order_id</code>, <code>order_date</code>), preserving the first occurrence.
                </p>
              </div>
            </label>

            {/* Fix 2: Impute Null Foreign Keys */}
            <label className="flex items-start gap-3 p-3.5 rounded-xl bg-surface-elevated/50 border border-border cursor-pointer hover:border-border-focus transition-colors">
              <input
                type="checkbox"
                checked={selectedFixes.includes("nulls")}
                onChange={() => toggleFix("nulls")}
                className="mt-0.5 rounded border-border text-primary focus:ring-primary"
              />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-foreground">Impute Missing Customer IDs</span>
                  <span className="font-mono text-[11px] text-amber-400">40 null values</span>
                </div>
                <p className="text-muted-foreground text-[11px] mt-0.5">
                  Substitutes null foreign keys with synthetic guest persona token <code>CUST-GUEST-ANON</code> to preserve order revenue in aggregate joins.
                </p>
              </div>
            </label>

            {/* Fix 3: Outlier Capping */}
            <label className="flex items-start gap-3 p-3.5 rounded-xl bg-surface-elevated/50 border border-border cursor-pointer hover:border-border-focus transition-colors">
              <input
                type="checkbox"
                checked={selectedFixes.includes("outliers")}
                onChange={() => toggleFix("outliers")}
                className="mt-0.5 rounded border-border text-primary focus:ring-primary"
              />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-foreground">Clip Severe Revenue Outliers (5x IQR Tukey)</span>
                  <span className="font-mono text-[11px] text-amber-400">5 corrupted entries</span>
                </div>
                <p className="text-muted-foreground text-[11px] mt-0.5">
                  Winsorizes extreme data-entry glitches (e.g. $999,999 transactions) to category median price ceiling.
                </p>
              </div>
            </label>

            {/* Fix 4: Date Standardization */}
            <label className="flex items-start gap-3 p-3.5 rounded-xl bg-surface-elevated/50 border border-border cursor-pointer hover:border-border-focus transition-colors">
              <input
                type="checkbox"
                checked={selectedFixes.includes("dates")}
                onChange={() => toggleFix("dates")}
                className="mt-0.5 rounded border-border text-primary focus:ring-primary"
              />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-foreground">Standardize Date Formats &amp; Timestamps</span>
                  <span className="font-mono text-[11px] text-amber-400">15 invalid dates</span>
                </div>
                <p className="text-muted-foreground text-[11px] mt-0.5">
                  Parses malformed dates (e.g. &apos;1999/99/99&apos;) and casts valid timestamps into ISO 8601 standard format.
                </p>
              </div>
            </label>
          </div>

          {/* Before & After Impact Projection */}
          <div className="p-4 rounded-xl bg-surface-elevated border border-border space-y-3">
            <h4 className="font-semibold text-foreground text-xs">
              Remediation Impact Simulation
            </h4>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-2.5 rounded-lg bg-surface border border-border">
                <span className="text-muted-foreground text-[10px] uppercase font-mono block">Current Score</span>
                <span className="text-lg font-bold font-mono text-amber-400">{currentScore.toFixed(1)}</span>
                <span className="block text-[10px] text-muted-foreground">Status: Warning</span>
              </div>
              <div className="p-2.5 rounded-lg bg-surface border border-border">
                <span className="text-muted-foreground text-[10px] uppercase font-mono block">Remediation Delta</span>
                <span className="text-lg font-bold font-mono text-emerald-400">
                  +{((projectedScore - currentScore)).toFixed(1)} pts
                </span>
                <span className="block text-[10px] text-muted-foreground">{selectedFixes.length} Fixes Selected</span>
              </div>
              <div className="p-2.5 rounded-lg bg-surface border border-border">
                <span className="text-muted-foreground text-[10px] uppercase font-mono block">Projected Score</span>
                <span className="text-lg font-bold font-mono text-primary">{projectedScore.toFixed(1)}</span>
                <span className="block text-[10px] text-emerald-400 font-semibold">Status: Verified</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-border flex items-center justify-between bg-surface-elevated/40">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-xs font-semibold text-muted-foreground hover:text-foreground border border-border transition-colors"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={() => {
              setSimulated(true);
              setTimeout(() => {
                onClose();
              }, 1000);
            }}
            disabled={selectedFixes.length === 0}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-lg text-xs font-semibold bg-primary hover:bg-primary-hover text-primary-foreground shadow-xs transition-colors disabled:opacity-50"
          >
            {simulated ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
                <span>Simulated View Created!</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                <span>Preview Virtual Cleaned View</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
