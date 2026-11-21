"use client";

import React, { useState } from "react";
import {
  Calendar,
  ChevronDown,
  RefreshCw,
  Download,
  ShieldCheck,
  Building2,
  Sparkles,
  Layers,
  ArrowRight,
  SlidersHorizontal,
} from "lucide-react";
import {
  useGlobalFilterStore,
  DATE_RANGE_PRESETS,
  DateRangeOption,
} from "@/stores/global-filter-store";
import { TrustBadge } from "@/components/ui/trust-badge";

interface ExecutiveHeaderProps {
  onRefresh: () => Promise<void> | void;
  isRefreshing: boolean;
  lastUpdated: string;
  onExportCsv: () => void;
  datasetTrustScore?: number;
  isBackendLive?: boolean;
}

export function ExecutiveHeader({
  onRefresh,
  isRefreshing,
  lastUpdated,
  onExportCsv,
  datasetTrustScore = 96.5,
  isBackendLive = false,
}: ExecutiveHeaderProps) {
  const {
    selectedRange,
    setSelectedRange,
    comparePrevious,
    toggleComparePrevious,
    selectedRegion,
    setSelectedRegion,
  } = useGlobalFilterStore();

  const [dateDropdownOpen, setDateDropdownOpen] = useState(false);
  const [regionDropdownOpen, setRegionDropdownOpen] = useState(false);

  const REGIONS = ["All Regions", "East", "Central", "West", "South"];

  return (
    <div className="space-y-4 pb-2 border-b border-border/80">
      {/* Top Banner: Synthetic Demo Indicator & Workspace Status */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-surface-elevated border border-border text-foreground font-medium">
            <Building2 className="w-3.5 h-3.5 text-primary" />
            <span className="font-semibold">Workspace:</span>
            <span>NexusMart Omnichannel Group</span>
          </div>

          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-primary/10 border border-primary/20 text-primary font-mono text-[11px] font-semibold">
            <Sparkles className="w-3 h-3 text-ai-accent" />
            <span>DEMO MODE — SYNTHETIC DATA</span>
          </div>
        </div>

        {/* Data Source & Refresh Status */}
        <div className="flex items-center gap-3 text-muted-foreground font-mono text-[11px]">
          <div className="flex items-center gap-1.5">
            {isBackendLive ? (
              <>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-foreground font-medium">DuckDB Live Ledger</span>
              </>
            ) : (
              <>
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                <span className="text-amber-400 font-medium">Demo Mode (Verified Cache)</span>
              </>
            )}
          </div>
          <span>·</span>
          <span>Trust: <strong className="text-emerald-400">{datasetTrustScore.toFixed(1)}/100</strong></span>
          <span>·</span>
          <span>Refreshed: {lastUpdated}</span>
        </div>
      </div>

      {/* Main Title & Action Bar */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2.5">
            <span>Executive Command Center</span>
            <TrustBadge status={datasetTrustScore >= 90 ? "verified" : "warning"} />
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Understand performance. Detect what changed. Decide what to do next with verifiable telemetry.
          </p>
        </div>

        {/* Global Controls: Date Range, Region, Compare, Refresh, Export */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Region Filter */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setRegionDropdownOpen(!regionDropdownOpen);
                setDateDropdownOpen(false);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-surface border border-border text-xs font-medium text-foreground hover:bg-surface-elevated transition-colors"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-muted-foreground" />
              <span>{selectedRegion}</span>
              <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
            </button>

            {regionDropdownOpen && (
              <div className="absolute left-0 mt-1.5 w-40 rounded-lg bg-surface border border-border shadow-xl py-1 z-30 animate-in fade-in duration-150">
                {REGIONS.map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => {
                      setSelectedRegion(r);
                      setRegionDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 text-xs transition-colors ${
                      selectedRegion === r
                        ? "bg-primary/10 text-primary font-semibold"
                        : "text-foreground hover:bg-surface-elevated"
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Date Range Selector */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setDateDropdownOpen(!dateDropdownOpen);
                setRegionDropdownOpen(false);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-surface border border-border text-xs font-medium text-foreground hover:bg-surface-elevated transition-colors"
            >
              <Calendar className="w-3.5 h-3.5 text-ai-accent" />
              <span>{selectedRange.label}</span>
              <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
            </button>

            {dateDropdownOpen && (
              <div className="absolute left-0 mt-1.5 w-48 rounded-lg bg-surface border border-border shadow-xl py-1 z-30 animate-in fade-in duration-150">
                {DATE_RANGE_PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => {
                      setSelectedRange(preset);
                      setDateDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 text-xs transition-colors ${
                      selectedRange.id === preset.id
                        ? "bg-primary/10 text-primary font-semibold"
                        : "text-foreground hover:bg-surface-elevated"
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Compare Previous Period Toggle */}
          <button
            type="button"
            onClick={toggleComparePrevious}
            className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border text-xs font-medium transition-colors ${
              comparePrevious
                ? "bg-primary/10 border-primary/30 text-primary font-semibold"
                : "bg-surface border-border text-muted-foreground hover:text-foreground hover:bg-surface-elevated"
            }`}
          >
            <span>Compare vs Prior</span>
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                comparePrevious ? "bg-primary" : "bg-muted-foreground/40"
              }`}
            />
          </button>

          {/* Refresh Action */}
          <button
            type="button"
            onClick={onRefresh}
            disabled={isRefreshing}
            className="p-2 rounded-lg bg-surface border border-border text-muted-foreground hover:text-foreground hover:bg-surface-elevated transition-colors disabled:opacity-50"
            title="Refresh Ledger Telemetry"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin text-primary" : ""}`} />
          </button>

          {/* Working CSV Export Button */}
          <button
            type="button"
            onClick={onExportCsv}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold bg-surface-elevated hover:bg-surface border border-border text-foreground transition-colors shadow-xs"
            title="Export Dashboard Summary as CSV"
          >
            <Download className="w-3.5 h-3.5 text-ai-accent" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>
    </div>
  );
}
