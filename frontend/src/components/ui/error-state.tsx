"use client";

import React, { useState } from "react";
import { AlertTriangle, RotateCcw, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ErrorStateProps {
  title?: string;
  message: string;
  technicalDetails?: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({
  title = "Computation Error",
  message,
  technicalDetails,
  onRetry,
  className,
}: ErrorStateProps) {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div
      className={cn(
        "p-6 rounded-xl border border-danger/30 bg-danger/5 flex flex-col items-center justify-center text-center space-y-4 max-w-lg mx-auto my-6",
        className
      )}
      role="alert"
    >
      <div className="w-10 h-10 rounded-full bg-danger/10 text-danger flex items-center justify-center border border-danger/20">
        <AlertTriangle className="w-5 h-5" aria-hidden="true" />
      </div>

      <div className="space-y-1">
        <h3 className="text-sm font-semibold text-danger">{title}</h3>
        <p className="text-xs text-muted-foreground leading-relaxed">
          {message}
        </p>
      </div>

      <div className="flex flex-col items-center gap-2 pt-1 w-full">
        {onRetry && (
          <button
            onClick={onRetry}
            className="px-3.5 py-1.5 rounded-lg bg-surface-elevated border border-border text-xs font-semibold text-foreground hover:border-primary/40 transition-colors flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5 text-primary" />
            <span>Retry Calculation</span>
          </button>
        )}

        {technicalDetails && (
          <div className="w-full text-left pt-2">
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="text-[11px] text-muted-foreground hover:text-foreground flex items-center gap-1 font-mono mx-auto"
            >
              <span>{showDetails ? "Hide Error Trace" : "View Technical Stacktrace"}</span>
              {showDetails ? (
                <ChevronUp className="w-3 h-3" />
              ) : (
                <ChevronDown className="w-3 h-3" />
              )}
            </button>
            {showDetails && (
              <pre className="mt-2 p-3 rounded-lg bg-surface border border-border text-[10px] font-mono text-danger/90 overflow-x-auto leading-relaxed max-h-36">
                {technicalDetails}
              </pre>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
