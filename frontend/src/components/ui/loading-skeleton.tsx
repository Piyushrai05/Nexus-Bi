"use client";

import React from "react";
import { cn } from "@/lib/utils";

export function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-surface-elevated/80 border border-border/40",
        className
      )}
      {...props}
    />
  );
}

export function KPISkeleton() {
  return (
    <div className="p-5 rounded-xl border border-border bg-surface space-y-3.5">
      <div className="flex items-center justify-between">
        <Skeleton className="h-3.5 w-24" />
        <Skeleton className="h-4 w-4 rounded-full" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-8 w-36" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-16 rounded-full" />
          <Skeleton className="h-3 w-28" />
        </div>
      </div>
      <Skeleton className="h-9 w-full rounded-lg" />
    </div>
  );
}

export function ChartSkeleton({ height = "h-72" }: { height?: string }) {
  return (
    <div className="p-5 rounded-xl border border-border bg-surface space-y-4">
      <div className="flex items-center justify-between">
        <div className="space-y-1.5">
          <Skeleton className="h-4 w-36" />
          <Skeleton className="h-3 w-48" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-7 w-20 rounded-lg" />
          <Skeleton className="h-7 w-7 rounded-lg" />
        </div>
      </div>
      <div className={cn("w-full rounded-lg flex items-end gap-2 p-4", height)}>
        <Skeleton className="h-1/3 flex-1" />
        <Skeleton className="h-1/2 flex-1" />
        <Skeleton className="h-2/3 flex-1" />
        <Skeleton className="h-4/5 flex-1" />
        <Skeleton className="h-3/5 flex-1" />
        <Skeleton className="h-3/4 flex-1" />
        <Skeleton className="h-full flex-1" />
        <Skeleton className="h-2/3 flex-1" />
      </div>
    </div>
  );
}

export function TableSkeleton({ rows = 5, cols = 4 }: { rows?: number; cols?: number }) {
  return (
    <div className="rounded-xl border border-border bg-surface overflow-hidden">
      <div className="p-4 border-b border-border flex items-center justify-between">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-7 w-24 rounded-lg" />
      </div>
      <div className="p-4 space-y-3">
        {/* Header */}
        <div className="grid grid-cols-4 gap-4 pb-2 border-b border-border/60">
          {Array.from({ length: cols }).map((_, i) => (
            <Skeleton key={i} className="h-3.5 w-full max-w-[100px]" />
          ))}
        </div>
        {/* Rows */}
        {Array.from({ length: rows }).map((_, r) => (
          <div key={r} className="grid grid-cols-4 gap-4 py-2">
            {Array.from({ length: cols }).map((_, c) => (
              <Skeleton key={c} className="h-4 w-full" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export function InsightSkeleton() {
  return (
    <div className="p-5 rounded-xl border border-border bg-surface-elevated space-y-3 relative overflow-hidden">
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-28 rounded-full" />
        <Skeleton className="h-3 w-16" />
      </div>
      <Skeleton className="h-5 w-4/5" />
      <Skeleton className="h-3.5 w-full" />
      <Skeleton className="h-3.5 w-3/4" />
      <div className="pt-2 flex items-center justify-between">
        <Skeleton className="h-6 w-24 rounded-lg" />
        <Skeleton className="h-6 w-28 rounded-lg" />
      </div>
    </div>
  );
}
