"use client";

import React, { useState } from "react";
import {
  Bot,
  User,
  Sparkles,
  Copy,
  Check,
  ShieldCheck,
  ArrowRight,
  Database,
  Layers,
  AlertCircle,
  Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ConfidenceChip, ConfidenceTier } from "./confidence-chip";
import { useEvidenceStore } from "@/stores/evidence-store";
import { createEvidenceFromCatalog } from "@/lib/semantic-layer";
import { EvidencePayload } from "@/types/evidence";

export type MessageRole = "user" | "assistant" | "system";

export interface ChatMessageProps {
  id?: string;
  role: MessageRole;
  content: string;
  timestamp?: string;
  isLoading?: boolean;
  loadingStep?: string; // e.g. "Reading schema → Running analysis → Validating numbers"
  isError?: boolean;
  errorMessage?: string;
  sqlSnippet?: string;
  facts?: string[];
  assumptions?: string[];
  confidence?: ConfidenceTier;
  confidenceReason?: string;
  evidence?: EvidencePayload;
  followUpChips?: string[];
  onSelectFollowUp?: (prompt: string) => void;
  chartAttachment?: React.ReactNode;
  className?: string;
}

export function ChatMessage({
  id,
  role,
  content,
  timestamp = "Just now",
  isLoading = false,
  loadingStep = "Reading schema → Executing verified SQL...",
  isError = false,
  errorMessage,
  sqlSnippet,
  facts,
  assumptions,
  confidence = "high",
  confidenceReason,
  evidence,
  followUpChips,
  onSelectFollowUp,
  chartAttachment,
  className,
}: ChatMessageProps) {
  const { openEvidence } = useEvidenceStore();
  const [copiedSql, setCopiedSql] = useState(false);
  const [showSql, setShowSql] = useState(false);

  const isUser = role === "user";

  const handleCopySql = () => {
    if (sqlSnippet) {
      navigator.clipboard.writeText(sqlSnippet);
      setCopiedSql(true);
      setTimeout(() => setCopiedSql(false), 2000);
    }
  };

  const handleOpenEvidence = () => {
    const payload =
      evidence ||
      createEvidenceFromCatalog("net_revenue", {
        metricLabel: "AI Query Result",
        definition: content,
        sql: sqlSnippet,
        assumptions: assumptions || ["Grounded execution on local verified schema"],
        confidence,
        confidenceReason,
      });
    openEvidence(payload);
  };

  return (
    <div
      className={cn(
        "flex gap-3 py-3 animate-in fade-in duration-150",
        isUser ? "justify-end" : "justify-start",
        className
      )}
    >
      {/* AI Avatar */}
      {!isUser && (
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-ai-accent flex items-center justify-center shrink-0 shadow-sm text-white mt-0.5">
          <Bot className="w-4 h-4" />
        </div>
      )}

      {/* Message Container */}
      <div
        className={cn(
          "max-w-2xl rounded-2xl p-4 space-y-3",
          isUser
            ? "bg-primary text-white rounded-tr-xs"
            : "bg-surface border border-border rounded-tl-xs shadow-xs"
        )}
      >
        {/* Top Header for Assistant */}
        {!isUser && (
          <div className="flex items-center justify-between gap-3 border-b border-border/60 pb-2 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-foreground flex items-center gap-1.5 font-mono">
                <Sparkles className="w-3.5 h-3.5 text-ai-accent" />
                NEXUS AI Analyst
              </span>
              <span className="text-[10px] font-mono text-muted-foreground">
                {timestamp}
              </span>
            </div>

            {confidence && !isLoading && !isError && (
              <ConfidenceChip level={confidence} reason={confidenceReason} />
            )}
          </div>
        )}

        {/* Loading "Thinking" State */}
        {isLoading ? (
          <div className="space-y-2 py-2">
            <div className="flex items-center gap-2 text-xs font-mono text-ai-accent">
              <span className="w-2 h-2 rounded-full bg-ai-accent animate-ping" />
              <span>{loadingStep}</span>
            </div>
            <div className="h-2 w-48 bg-surface-elevated rounded-full overflow-hidden">
              <div className="h-full bg-ai-accent w-2/3 animate-pulse" />
            </div>
          </div>
        ) : isError ? (
          /* Error State */
          <div className="p-3 rounded-lg bg-danger/10 border border-danger/30 text-xs text-danger space-y-1">
            <div className="flex items-center gap-1.5 font-semibold">
              <AlertCircle className="w-4 h-4" />
              <span>Analytical Query Execution Failed</span>
            </div>
            <p className="text-[11px] text-muted-foreground">{errorMessage}</p>
          </div>
        ) : (
          /* Standard Body Content */
          <div className="text-xs leading-relaxed space-y-2 text-foreground/90">
            <p className="whitespace-pre-line">{content}</p>
          </div>
        )}

        {/* Chart Attachment if provided */}
        {chartAttachment && !isLoading && (
          <div className="p-3 rounded-xl bg-surface-elevated border border-border/80 my-2">
            {chartAttachment}
          </div>
        )}

        {/* Facts vs Assumptions Breakdown (Non-negotiable AI Trust Rule) */}
        {!isUser && !isLoading && !isError && (facts?.length || assumptions?.length) ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-border/60 text-[11px]">
            {facts && facts.length > 0 && (
              <div className="p-2.5 rounded-lg bg-surface-elevated border border-border/80 space-y-1">
                <span className="font-semibold text-foreground uppercase tracking-wider font-mono text-[10px] flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-success" />
                  Verified Facts (Computed)
                </span>
                <ul className="space-y-0.5 text-muted-foreground list-disc list-inside">
                  {facts.map((f, i) => (
                    <li key={i}>{f}</li>
                  ))}
                </ul>
              </div>
            )}

            {assumptions && assumptions.length > 0 && (
              <div className="p-2.5 rounded-lg bg-surface-elevated border border-border/80 space-y-1">
                <span className="font-semibold text-foreground uppercase tracking-wider font-mono text-[10px] flex items-center gap-1">
                  <Layers className="w-3 h-3 text-warning" />
                  Assumptions &amp; Context
                </span>
                <ul className="space-y-0.5 text-muted-foreground list-disc list-inside">
                  {assumptions.map((a, i) => (
                    <li key={i}>{a}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ) : null}

        {/* Collapsible SQL Query Snippet */}
        {sqlSnippet && !isUser && !isLoading && (
          <div className="pt-1">
            <div className="flex items-center justify-between text-[11px]">
              <button
                onClick={() => setShowSql(!showSql)}
                className="text-primary hover:text-ai-accent font-mono flex items-center gap-1"
              >
                <Database className="w-3 h-3" />
                <span>{showSql ? "Hide Executed SQL" : "Show Executed DuckDB SQL"}</span>
              </button>

              <button
                onClick={handleOpenEvidence}
                className="text-muted-foreground hover:text-foreground flex items-center gap-1 text-[11px] font-medium"
              >
                <ShieldCheck className="w-3 h-3 text-primary" />
                <span>Audit Lineage</span>
              </button>
            </div>

            {showSql && (
              <div className="mt-2 p-2.5 rounded-lg bg-surface-elevated border border-border relative">
                <div className="flex items-center justify-between pb-1 border-b border-border/60 mb-1 text-[10px] font-mono text-muted-foreground">
                  <span>DUCKDB SQL (READ-ONLY)</span>
                  <button
                    onClick={handleCopySql}
                    className="flex items-center gap-1 text-primary hover:text-foreground"
                  >
                    {copiedSql ? (
                      <>
                        <Check className="w-3 h-3 text-success" /> Copied
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" /> Copy
                      </>
                    )}
                  </button>
                </div>
                <pre className="text-[10px] font-mono text-foreground overflow-x-auto leading-relaxed">
                  {sqlSnippet}
                </pre>
              </div>
            )}
          </div>
        )}

        {/* Follow-up Suggestion Chips */}
        {followUpChips && followUpChips.length > 0 && !isLoading && (
          <div className="pt-2 border-t border-border/60 space-y-1.5">
            <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">
              Suggested Follow-ups:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {followUpChips.map((chip, idx) => (
                <button
                  key={idx}
                  onClick={() => onSelectFollowUp && onSelectFollowUp(chip)}
                  className="px-2.5 py-1 rounded-full bg-surface-elevated hover:bg-surface-muted border border-border text-[11px] text-foreground font-medium transition-colors flex items-center gap-1"
                >
                  <span>{chip}</span>
                  <ArrowRight className="w-2.5 h-2.5 text-primary" />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* User Avatar */}
      {isUser && (
        <div className="w-8 h-8 rounded-lg bg-primary/20 text-primary border border-primary/30 flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold font-mono">
          <User className="w-4 h-4" />
        </div>
      )}
    </div>
  );
}
