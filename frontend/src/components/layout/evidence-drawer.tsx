"use client";

import React, { useState } from "react";
import {
  X,
  Copy,
  Check,
  ShieldCheck,
  AlertCircle,
  Database,
  Calendar,
  Layers,
  ArrowRight,
  Info,
} from "lucide-react";
import { useEvidenceStore } from "@/stores/evidence-store";
import { cn } from "@/lib/utils";

export function EvidenceDrawer() {
  const { isOpen, activePayload, closeEvidence } = useEvidenceStore();
  const [copied, setCopied] = useState(false);

  if (!isOpen || !activePayload) return null;

  const copySql = () => {
    if (activePayload.sql) {
      navigator.clipboard.writeText(activePayload.sql);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const confidenceBadge = {
    high: {
      color: "bg-success/10 text-success border-success/20",
      label: "High Confidence",
      icon: ShieldCheck,
    },
    medium: {
      color: "bg-warning/10 text-warning border-warning/20",
      label: "Medium Confidence",
      icon: AlertCircle,
    },
    low: {
      color: "bg-danger/10 text-danger border-danger/20",
      label: "Low Confidence",
      icon: AlertCircle,
    },
    insufficient_evidence: {
      color: "bg-muted text-muted-foreground border-border",
      label: "Insufficient Evidence",
      icon: AlertCircle,
    },
  }[activePayload.confidence || "high"] || {
    color: "bg-success/10 text-success border-success/20",
    label: "High Confidence",
    icon: ShieldCheck,
  };

  const ConfIcon = confidenceBadge.icon;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-background/60 backdrop-blur-xs flex justify-end transition-opacity animate-in fade-in duration-200">
      {/* Backdrop overlay */}
      <div className="flex-1" onClick={closeEvidence} />

      {/* Drawer Surface */}
      <div className="w-full max-w-lg md:max-w-xl bg-surface border-l border-border h-full flex flex-col shadow-2xl relative animate-in slide-in-from-right duration-250 select-text">
        {/* Header */}
        <div className="p-4 border-b border-border flex items-center justify-between bg-surface-elevated">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold">
              <ShieldCheck className="w-4 h-4 text-primary" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-sm text-foreground">
                  Evidence & Traceability
                </h3>
                <span
                  className={cn(
                    "text-[10px] font-mono px-2 py-0.5 rounded-full border flex items-center gap-1 font-semibold",
                    confidenceBadge.color
                  )}
                >
                  <ConfIcon className="w-3 h-3" />
                  {confidenceBadge.label}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                Audit trail for &quot;{activePayload.metricLabel}&quot;
              </p>
            </div>
          </div>
          <button
            onClick={closeEvidence}
            aria-label="Close drawer"
            className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-surface transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {/* Hero Metric Summary */}
          <div className="p-4 rounded-xl bg-surface-elevated border border-border flex items-center justify-between">
            <div>
              <span className="text-xs text-muted-foreground uppercase font-mono tracking-wider font-semibold">
                {activePayload.metricLabel}
              </span>
              <div className="text-3xl font-bold font-mono text-foreground tracking-tight mt-0.5">
                {activePayload.valueFormatted}
              </div>
              {activePayload.deltaFormatted && (
                <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1.5 font-medium">
                  <span className="text-primary font-semibold font-mono">
                    {activePayload.deltaFormatted}
                  </span>
                  <span>{activePayload.periodLabel}</span>
                </div>
              )}
            </div>
            <div className="text-right">
              <div className="text-[10px] text-muted-foreground font-mono">
                COMPUTED AT
              </div>
              <div className="text-xs font-mono text-foreground mt-0.5">
                {new Date(activePayload.computedAt).toLocaleTimeString()} UTC
              </div>
            </div>
          </div>

          {/* Metric Definition & Mathematical Formula */}
          <div className="space-y-3">
            <div>
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider font-mono flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-primary" />
                Plain-English Definition
              </h4>
              <p className="text-xs text-foreground mt-1 leading-relaxed bg-surface-elevated/50 p-2.5 rounded-lg border border-border">
                {activePayload.definition}
              </p>
            </div>

            <div>
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider font-mono flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-primary" />
                Mathematical Formula
              </h4>
              <code className="text-xs font-mono text-ai-accent block mt-1 bg-surface-elevated p-2.5 rounded-lg border border-border">
                {activePayload.formula}
              </code>
            </div>
          </div>

          {/* Executed SQL Query / Method */}
          {activePayload.sql && (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider font-mono flex items-center gap-1.5">
                  <Database className="w-3.5 h-3.5 text-primary" />
                  Deterministic SQL (DuckDB Engine)
                </h4>
                <button
                  onClick={copySql}
                  className="text-xs text-primary hover:text-foreground flex items-center gap-1 transition-colors font-medium"
                >
                  {copied ? (
                    <>
                      <Check className="w-3 h-3 text-success" /> Copied
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" /> Copy SQL
                    </>
                  )}
                </button>
              </div>
              <pre className="p-3 rounded-lg bg-surface-elevated border border-border text-[11px] font-mono text-foreground overflow-x-auto leading-relaxed">
                {activePayload.sql}
              </pre>
            </div>
          )}

          {/* Sample Source Data Records */}
          {activePayload.sampleRows && activePayload.sampleRows.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider font-mono flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-primary" />
                Raw Source Records ({activePayload.sampleRows.length} sample rows)
              </h4>
              <div className="border border-border rounded-lg overflow-x-auto bg-surface-elevated">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-surface-muted text-muted-foreground border-b border-border">
                    <tr>
                      {Object.keys(activePayload.sampleRows[0]).map((key) => (
                        <th key={key} className="px-2.5 py-1.5 font-semibold">
                          {key}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {activePayload.sampleRows.map((row, idx) => (
                      <tr key={idx} className="hover:bg-surface/50">
                        {Object.values(row).map((val, cIdx) => (
                          <td key={cIdx} className="px-2.5 py-1.5 text-foreground truncate max-w-[120px]">
                            {String(val)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Assumptions & Integrity Guardrails */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider font-mono flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-primary" />
              Calculated Assumptions &amp; Scope
            </h4>
            <ul className="space-y-1.5">
              {activePayload.assumptions.map((item, idx) => (
                <li
                  key={idx}
                  className="text-xs text-muted-foreground flex items-start gap-2 bg-surface-elevated/40 p-2 rounded-md border border-border/60"
                >
                  <span className="text-primary font-bold mt-0.5">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Confidence Rationale */}
          <div className="p-3.5 rounded-lg bg-primary/5 border border-primary/20 space-y-1">
            <div className="text-xs font-semibold text-primary flex items-center gap-1.5">
              <ConfIcon className="w-3.5 h-3.5" />
              Why Confidence is {activePayload.confidence.toUpperCase()}:
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {activePayload.confidenceReason}
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-border bg-surface-elevated flex items-center justify-between">
          <div className="text-[11px] text-muted-foreground font-mono">
            Lineage: orders_master.parquet (142,850 rows)
          </div>
          <button
            onClick={closeEvidence}
            className="px-3.5 py-1.5 rounded-lg bg-primary text-white text-xs font-semibold hover:bg-primary/90 transition-colors shadow-xs"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
