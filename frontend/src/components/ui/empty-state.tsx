"use client";

import React from "react";
import { FolderOpen } from "lucide-react";
import { cn } from "@/lib/utils";

export interface EmptyStateProps {
  icon?: React.ElementType;
  title: string;
  description: string;
  primaryAction?: {
    label: string;
    onClick: () => void;
    icon?: React.ElementType;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export function EmptyState({
  icon: Icon = FolderOpen,
  title,
  description,
  primaryAction,
  secondaryAction,
  className,
}: EmptyStateProps) {
  const PrimaryIcon = primaryAction?.icon;

  return (
    <div
      className={cn(
        "p-8 rounded-xl border border-dashed border-border bg-surface/50 flex flex-col items-center justify-center text-center space-y-4 max-w-md mx-auto my-6",
        className
      )}
    >
      <div className="w-12 h-12 rounded-xl bg-surface-elevated border border-border flex items-center justify-center text-muted-foreground shadow-xs">
        <Icon className="w-6 h-6" aria-hidden="true" />
      </div>

      <div className="space-y-1.5">
        <h3 className="text-sm font-semibold text-foreground tracking-tight">
          {title}
        </h3>
        <p className="text-xs text-muted-foreground leading-relaxed max-w-sm">
          {description}
        </p>
      </div>

      {(primaryAction || secondaryAction) && (
        <div className="flex items-center gap-3 pt-2">
          {primaryAction && (
            <button
              onClick={primaryAction.onClick}
              className="px-3.5 py-1.5 rounded-lg bg-primary text-white text-xs font-semibold hover:bg-primary/90 transition-colors flex items-center gap-1.5 shadow-xs"
            >
              {PrimaryIcon && <PrimaryIcon className="w-3.5 h-3.5" />}
              <span>{primaryAction.label}</span>
            </button>
          )}

          {secondaryAction && (
            <button
              onClick={secondaryAction.onClick}
              className="px-3.5 py-1.5 rounded-lg bg-surface-elevated border border-border text-xs font-medium text-foreground hover:bg-surface-muted transition-colors"
            >
              {secondaryAction.label}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
