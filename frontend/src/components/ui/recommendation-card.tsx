"use client";

import React, { useState } from "react";
import {
  CheckCircle2,
  XCircle,
  PlayCircle,
  ShieldCheck,
  User,
  Clock,
  ArrowUpRight,
  AlertCircle,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ConfidenceChip, ConfidenceTier } from "./confidence-chip";
import { useEvidenceStore } from "@/stores/evidence-store";
import { createEvidenceFromCatalog } from "@/lib/semantic-layer";
import { EvidencePayload } from "@/types/evidence";

export type DecisionPriority = "P0" | "P1" | "P2" | "P3";
export type DecisionStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "in_progress"
  | "completed";

export interface DecisionOwner {
  name: string;
  role: string;
  avatar?: string;
}

export interface RecommendationCardProps {
  id: string;
  title: string;
  businessProblem: string;
  supportingEvidence: string;
  suggestedAction: string;
  expectedImpact: string;
  priority?: DecisionPriority;
  confidence?: ConfidenceTier;
  confidenceReason?: string;
  owner: DecisionOwner;
  deadline?: string;
  initialStatus?: DecisionStatus;
  evidence?: EvidencePayload;
  onStatusChange?: (id: string, newStatus: DecisionStatus) => void;
  className?: string;
}

const PRIORITY_CONFIG: Record<
  DecisionPriority,
  { label: string; badgeClass: string }
> = {
  P0: { label: "P0 Critical", badgeClass: "bg-danger/15 text-danger border-danger/30 font-bold" },
  P1: { label: "P1 High", badgeClass: "bg-warning/15 text-warning border-warning/30 font-semibold" },
  P2: { label: "P2 Medium", badgeClass: "bg-info/10 text-info border-info/20" },
  P3: { label: "P3 Low", badgeClass: "bg-muted text-muted-foreground border-border" },
};

const STATUS_CONFIG: Record<
  DecisionStatus,
  { label: string; badgeClass: string; icon: React.ElementType }
> = {
  pending: {
    label: "Pending Review",
    badgeClass: "bg-warning/10 text-warning border-warning/20",
    icon: Clock,
  },
  approved: {
    label: "Approved",
    badgeClass: "bg-success/15 text-success border-success/30 font-semibold",
    icon: CheckCircle2,
  },
  rejected: {
    label: "Rejected",
    badgeClass: "bg-danger/10 text-danger border-danger/20",
    icon: XCircle,
  },
  in_progress: {
    label: "In Progress",
    badgeClass: "bg-primary/15 text-primary border-primary/30",
    icon: PlayCircle,
  },
  completed: {
    label: "Impact Verified",
    badgeClass: "bg-success/20 text-success border-success/40 font-bold",
    icon: ShieldCheck,
  },
};

export function RecommendationCard({
  id,
  title,
  businessProblem,
  supportingEvidence,
  suggestedAction,
  expectedImpact,
  priority = "P1",
  confidence = "high",
  confidenceReason,
  owner,
  deadline = "Within 7 days",
  initialStatus = "pending",
  evidence,
  onStatusChange,
  className,
}: RecommendationCardProps) {
  const { openEvidence } = useEvidenceStore();
  const [status, setStatus] = useState<DecisionStatus>(initialStatus);
  const [showConfirmApprove, setShowConfirmApprove] = useState(false);
  const [showRejectReason, setShowRejectReason] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  const priorityInfo = PRIORITY_CONFIG[priority];
  const statusInfo = STATUS_CONFIG[status];
  const StatusIcon = statusInfo.icon;

  const handleUpdateStatus = (newStatus: DecisionStatus) => {
    setStatus(newStatus);
    if (onStatusChange) {
      onStatusChange(id, newStatus);
    }
  };

  const handleApprove = () => {
    handleUpdateStatus("approved");
    setShowConfirmApprove(false);
  };

  const handleReject = () => {
    handleUpdateStatus("rejected");
    setShowRejectReason(false);
  };

  const handleOpenEvidence = () => {
    const payload =
      evidence ||
      createEvidenceFromCatalog("net_revenue", {
        metricLabel: title,
        definition: businessProblem,
        assumptions: [suggestedAction, `Projected ROI: ${expectedImpact}`],
        confidence,
        confidenceReason,
      });
    openEvidence(payload);
  };

  return (
    <div
      className={cn(
        "p-5 rounded-xl border border-border bg-surface flex flex-col justify-between space-y-4 transition-all duration-200 hover:border-border/80 shadow-xs",
        className
      )}
    >
      {/* Top Header: Priority, Status, Confidence */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "text-[10px] font-mono px-2 py-0.5 rounded border uppercase",
              priorityInfo.badgeClass
            )}
          >
            {priorityInfo.label}
          </span>

          <span
            className={cn(
              "inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded-full border",
              statusInfo.badgeClass
            )}
          >
            <StatusIcon className="w-3 h-3" />
            <span>{statusInfo.label}</span>
          </span>
        </div>

        <ConfidenceChip level={confidence} reason={confidenceReason} />
      </div>

      {/* Main Title & Problem */}
      <div className="space-y-1.5">
        <h4 className="text-sm font-semibold text-foreground tracking-tight">
          {title}
        </h4>
        <p className="text-xs text-muted-foreground leading-relaxed">
          <strong className="text-foreground">Problem: </strong>
          {businessProblem}
        </p>
      </div>

      {/* Suggested Action Box */}
      <div className="p-3 rounded-lg bg-surface-elevated border border-border space-y-2">
        <div className="text-xs text-foreground font-medium leading-relaxed">
          <span className="text-primary font-semibold font-mono">Suggested Action: </span>
          {suggestedAction}
        </div>
        <div className="flex items-center justify-between pt-1 border-t border-border/60 text-xs">
          <span className="text-[11px] font-mono text-muted-foreground">Expected Impact:</span>
          <span className="font-mono font-bold text-success bg-success/10 px-2 py-0.5 rounded border border-success/20">
            {expectedImpact}
          </span>
        </div>
      </div>

      {/* Supporting Evidence Bar */}
      <div className="flex items-center justify-between text-xs text-muted-foreground bg-surface/50 p-2 rounded-md border border-border/60">
        <span className="truncate pr-2">Evidence: {supportingEvidence}</span>
        <button
          onClick={handleOpenEvidence}
          className="text-primary hover:text-ai-accent font-semibold shrink-0 flex items-center gap-0.5"
        >
          <span>Audit</span>
          <ArrowUpRight className="w-3 h-3" />
        </button>
      </div>

      {/* Owner & Governance Actions */}
      <div className="pt-2 border-t border-border/60 flex items-center justify-between flex-wrap gap-3">
        {/* Responsible Person */}
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-[10px] font-bold font-mono uppercase">
            {owner.avatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={owner.avatar} alt={owner.name} className="w-6 h-6 rounded-full" />
            ) : (
              owner.name.slice(0, 2)
            )}
          </div>
          <div className="flex flex-col text-[11px]">
            <span className="font-medium text-foreground leading-tight">{owner.name}</span>
            <span className="text-[9px] text-muted-foreground">{owner.role} · {deadline}</span>
          </div>
        </div>

        {/* Human-in-the-Loop Decision Buttons */}
        <div className="flex items-center gap-1.5">
          {status === "pending" && (
            <>
              <button
                onClick={() => setShowConfirmApprove(true)}
                className="px-2.5 py-1 rounded-md bg-success/15 hover:bg-success/25 text-success text-xs font-semibold border border-success/30 transition-colors flex items-center gap-1"
              >
                <CheckCircle2 className="w-3 h-3" />
                <span>Approve</span>
              </button>
              <button
                onClick={() => setShowRejectReason(true)}
                className="px-2.5 py-1 rounded-md bg-surface-elevated hover:bg-danger/10 text-muted-foreground hover:text-danger text-xs font-medium border border-border transition-colors"
              >
                Reject
              </button>
            </>
          )}

          {status === "approved" && (
            <button
              onClick={() => handleUpdateStatus("in_progress")}
              className="px-2.5 py-1 rounded-md bg-primary/15 hover:bg-primary/25 text-primary text-xs font-semibold border border-primary/30 transition-colors flex items-center gap-1"
            >
              <PlayCircle className="w-3 h-3" />
              <span>Start Execution</span>
            </button>
          )}

          {status === "in_progress" && (
            <button
              onClick={() => handleUpdateStatus("completed")}
              className="px-2.5 py-1 rounded-md bg-success/20 hover:bg-success/30 text-success text-xs font-bold border border-success/40 transition-colors flex items-center gap-1"
            >
              <ShieldCheck className="w-3 h-3" />
              <span>Verify Outcome</span>
            </button>
          )}

          {status === "rejected" && (
            <button
              onClick={() => handleUpdateStatus("pending")}
              className="px-2 py-0.5 rounded text-[11px] text-muted-foreground hover:text-foreground underline transition-colors"
            >
              Reopen
            </button>
          )}

          {status === "completed" && (
            <span className="text-[11px] font-mono text-success font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Verified
            </span>
          )}
        </div>
      </div>

      {/* Human-in-the-Loop Confirmation Modal / Prompt */}
      {showConfirmApprove && (
        <div className="p-3 rounded-lg bg-surface-elevated border border-success/30 space-y-2 animate-in fade-in duration-150">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-success">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>Confirm Operational Approval</span>
          </div>
          <p className="text-[11px] text-muted-foreground">
            Per governance policy, approving this decision authorizes operational reallocation of budget and resources. Proceed?
          </p>
          <div className="flex items-center justify-end gap-2 pt-1">
            <button
              onClick={() => setShowConfirmApprove(false)}
              className="px-2 py-1 text-[11px] text-muted-foreground hover:text-foreground"
            >
              Cancel
            </button>
            <button
              onClick={handleApprove}
              className="px-3 py-1 rounded bg-success text-white text-[11px] font-bold hover:bg-success/90"
            >
              Authorize Action
            </button>
          </div>
        </div>
      )}

      {/* Reject Reason Prompt */}
      {showRejectReason && (
        <div className="p-3 rounded-lg bg-surface-elevated border border-danger/30 space-y-2 animate-in fade-in duration-150">
          <div className="text-xs font-semibold text-danger">State Rejection Rationale (Optional)</div>
          <input
            type="text"
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            placeholder="e.g., Marketing budget frozen until Q1 audit..."
            className="w-full text-xs bg-surface border border-border rounded p-1.5 text-foreground placeholder:text-muted-foreground outline-hidden"
          />
          <div className="flex items-center justify-end gap-2 pt-1">
            <button
              onClick={() => setShowRejectReason(false)}
              className="px-2 py-1 text-[11px] text-muted-foreground hover:text-foreground"
            >
              Cancel
            </button>
            <button
              onClick={handleReject}
              className="px-3 py-1 rounded bg-danger text-white text-[11px] font-bold hover:bg-danger/90"
            >
              Confirm Rejection
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
