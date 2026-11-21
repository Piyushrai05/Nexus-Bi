"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Building2,
  Database,
  BarChart3,
  Layers,
  Share2,
  ShieldCheck,
  Zap,
  UploadCloud,
  Lock,
  ChevronRight,
  Clock,
} from "lucide-react";
import { TrustBadge } from "@/components/ui/trust-badge";
import { ThemeToggle } from "@/components/layout/theme-toggle";

interface OnboardingState {
  goal: string;
  orgName: string;
  industry: string;
  companySize: string;
  role: string;
  objective: string;
  dataSource: "nexusmart" | "upload" | "warehouse";
}

const GOALS = [
  {
    id: "unified",
    title: "Unified Business + Social Intelligence",
    desc: "Connect revenue metrics directly with marketing campaign performance and audience sentiment.",
    icon: Layers,
    badge: "Most Popular",
  },
  {
    id: "marketing_roas",
    title: "Social Media & Marketing ROI",
    desc: "Expose vanity metric traps, compare cross-channel ROAS, and optimize ad budget allocation.",
    icon: Share2,
    badge: "Marketing Teams",
  },
  {
    id: "root_cause",
    title: "Root-Cause & Anomaly Investigation",
    desc: "Diagnose unexpected revenue dips or margin erosions automatically down to SKU and region.",
    icon: Zap,
    badge: "Analytics Lead",
  },
  {
    id: "executive_kpi",
    title: "Executive KPI & Horizon Forecasting",
    desc: "High-level command center with 30-day confidence bands and auditable daily AI executive briefings.",
    icon: BarChart3,
    badge: "C-Suite",
  },
  {
    id: "data_trust",
    title: "5D Data Quality & Governance Audit",
    desc: "Audit completeness, uniqueness, validity, consistency, and freshness before reporting.",
    icon: ShieldCheck,
    badge: "Data Engineering",
  },
];

const INDUSTRIES = [
  "E-Commerce & Omnichannel Retail",
  "SaaS & Enterprise Software",
  "FinTech & Financial Services",
  "Consumer Packaged Goods (CPG)",
  "Digital Media & Marketing Agency",
  "Healthcare & Life Sciences",
];

const SIZES = [
  "1 – 25 employees (Early Stage)",
  "26 – 100 employees (Growth)",
  "101 – 500 employees (Mid-Market)",
  "500+ employees (Enterprise)",
];

const ROLES = [
  "Chief Executive / C-Suite Officer",
  "VP / Director of Analytics & BI",
  "Head of Marketing / Growth",
  "Senior Analytics Engineer / Data Lead",
  "Product / Commercial Manager",
];

export function OnboardingWizard() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [formData, setFormData] = useState<OnboardingState>({
    goal: "unified",
    orgName: "NexusMart Retail Group",
    industry: "E-Commerce & Omnichannel Retail",
    companySize: "101 – 500 employees (Mid-Market)",
    role: "VP / Director of Analytics & BI",
    objective: "Diagnose regional margin drops and stop budget waste on low-ROAS social ads.",
    dataSource: "nexusmart",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleNext = () => {
    if (step < 3) {
      setStep((step + 1) as 1 | 2 | 3);
    } else {
      finishOnboarding();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep((step - 1) as 1 | 2 | 3);
    }
  };

  const finishOnboarding = () => {
    setIsSubmitting(true);
    if (typeof window !== "undefined") {
      localStorage.setItem("nexus_onboarding_profile", JSON.stringify(formData));
    }
    setTimeout(() => {
      // Redirect to Data Hub or Dashboard based on selected data source
      router.push("/data");
    }, 700);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-between">
      {/* Top Header */}
      <header className="border-b border-border/80 bg-surface/50 backdrop-blur-md px-4 sm:px-8 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 font-extrabold text-foreground tracking-tight">
          <div className="w-8 h-8 rounded-lg bg-primary/20 border border-primary/40 flex items-center justify-center text-primary font-black">
            N
          </div>
          <span className="text-base font-bold">NEXUS BI</span>
        </Link>

        {/* Stepper Indicator */}
        <div className="hidden sm:flex items-center gap-2 text-xs font-mono">
          <span
            className={`px-2.5 py-1 rounded-md border ${
              step === 1
                ? "bg-primary/10 border-primary text-primary font-semibold"
                : "bg-surface border-border text-muted-foreground"
            }`}
          >
            1. Analysis Goal
          </span>
          <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/40" />
          <span
            className={`px-2.5 py-1 rounded-md border ${
              step === 2
                ? "bg-primary/10 border-primary text-primary font-semibold"
                : "bg-surface border-border text-muted-foreground"
            }`}
          >
            2. Organization Profile
          </span>
          <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/40" />
          <span
            className={`px-2.5 py-1 rounded-md border ${
              step === 3
                ? "bg-primary/10 border-primary text-primary font-semibold"
                : "bg-surface border-border text-muted-foreground"
            }`}
          >
            3. Data Source
          </span>
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link
            href="/data"
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            Skip to Demo
          </Link>
        </div>
      </header>

      {/* Main Form Container */}
      <div className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12 flex flex-col justify-center">
        {/* Step Progress Line */}
        <div className="w-full bg-surface-elevated h-1 rounded-full mb-8 overflow-hidden">
          <div
            className="bg-primary h-full transition-all duration-300 ease-out"
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>

        {/* STEP 1: Analysis Goal */}
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary">
                <Sparkles className="w-3.5 h-3.5 text-ai-accent" />
                <span>STEP 1 OF 3</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                What is your primary analytical objective?
              </h1>
              <p className="text-sm text-muted-foreground">
                Select your key focus area. NEXUS BI will customize your semantic metrics, anomaly thresholds, and AI briefing alerts.
              </p>
            </div>

            <div className="space-y-3 pt-2">
              {GOALS.map((g) => {
                const Icon = g.icon;
                const isSelected = formData.goal === g.id;
                return (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, goal: g.id })}
                    className={`w-full p-4 rounded-xl border text-left flex items-start gap-4 transition-all duration-150 ${
                      isSelected
                        ? "bg-primary/5 border-primary shadow-xs ring-1 ring-primary/20"
                        : "bg-surface border-border hover:bg-surface-elevated hover:border-border-focus"
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 border ${
                        isSelected
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-surface-elevated text-muted-foreground border-border"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="font-semibold text-sm text-foreground">
                          {g.title}
                        </span>
                        <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded bg-surface-elevated border border-border text-muted-foreground">
                          {g.badge}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {g.desc}
                      </p>
                    </div>
                    <div className="shrink-0 pt-0.5">
                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                          isSelected
                            ? "border-primary bg-primary"
                            : "border-muted-foreground/40"
                        }`}
                      >
                        {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 2: Organization Profile */}
        {step === 2 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary">
                <Building2 className="w-3.5 h-3.5 text-ai-accent" />
                <span>STEP 2 OF 3</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                Tell us about your organization
              </h1>
              <p className="text-sm text-muted-foreground">
                This helps NEXUS BI calibrate benchmark industry metrics, seasonality trends, and cohort definitions.
              </p>
            </div>

            <div className="space-y-4 pt-2">
              {/* Org Name */}
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5">
                  Organization / Company Name
                </label>
                <input
                  type="text"
                  value={formData.orgName}
                  onChange={(e) => setFormData({ ...formData, orgName: e.target.value })}
                  placeholder="e.g. Acme Corp or NexusMart"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-surface border border-border text-foreground text-sm focus:outline-none focus:border-primary transition-colors"
                />
              </div>

              {/* Industry & Size Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1.5">
                    Industry Sector
                  </label>
                  <select
                    value={formData.industry}
                    onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-lg bg-surface border border-border text-foreground text-sm focus:outline-none focus:border-primary transition-colors"
                  >
                    {INDUSTRIES.map((ind) => (
                      <option key={ind} value={ind}>
                        {ind}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1.5">
                    Company Size
                  </label>
                  <select
                    value={formData.companySize}
                    onChange={(e) => setFormData({ ...formData, companySize: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-lg bg-surface border border-border text-foreground text-sm focus:outline-none focus:border-primary transition-colors"
                  >
                    {SIZES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Role */}
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5">
                  Your Primary Role
                </label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-lg bg-surface border border-border text-foreground text-sm focus:outline-none focus:border-primary transition-colors"
                >
                  {ROLES.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>

              {/* Key Objective */}
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5">
                  Primary Decision Challenge (Optional)
                </label>
                <textarea
                  rows={2}
                  value={formData.objective}
                  onChange={(e) => setFormData({ ...formData, objective: e.target.value })}
                  placeholder="e.g. Understand why Q3 marketing spend rose while organic conversion slowed..."
                  className="w-full px-3.5 py-2 rounded-lg bg-surface border border-border text-foreground text-sm focus:outline-none focus:border-primary transition-colors"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: Data Connection */}
        {step === 3 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary">
                <Database className="w-3.5 h-3.5 text-ai-accent" />
                <span>STEP 3 OF 3</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                How would you like to initialize your data?
              </h1>
              <p className="text-sm text-muted-foreground">
                Choose the synthetic NexusMart demo dataset for an immediate walk-through, or upload your own files.
              </p>
            </div>

            <div className="space-y-4 pt-2">
              {/* Option A: NexusMart Demo (Recommended) */}
              <button
                type="button"
                onClick={() => setFormData({ ...formData, dataSource: "nexusmart" })}
                className={`w-full p-5 rounded-xl border text-left flex items-start gap-4 transition-all duration-150 ${
                  formData.dataSource === "nexusmart"
                    ? "bg-primary/5 border-primary shadow-xs ring-1 ring-primary/20"
                    : "bg-surface border-border hover:bg-surface-elevated hover:border-border-focus"
                }`}
              >
                <div
                  className={`w-11 h-11 rounded-lg flex items-center justify-center shrink-0 border ${
                    formData.dataSource === "nexusmart"
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-surface-elevated text-muted-foreground border-border"
                  }`}
                >
                  <Sparkles className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-sm text-foreground">
                      Explore NexusMart Synthetic Environment
                    </span>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      Recommended
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed mb-2">
                    Instant access to 10,000+ realistic retail transactions, 5 social campaigns, customer sentiment traces, and pre-seeded root-cause scenarios.
                  </p>
                  <div className="flex items-center gap-3 text-[11px] font-mono text-muted-foreground">
                    <span className="text-ai-accent">7 Ready Datasets</span>
                    <span>·</span>
                    <span>No wait or ingestion needed</span>
                  </div>
                </div>
                <div className="shrink-0 pt-0.5">
                  <div
                    className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                      formData.dataSource === "nexusmart"
                        ? "border-primary bg-primary"
                        : "border-muted-foreground/40"
                    }`}
                  >
                    {formData.dataSource === "nexusmart" && (
                      <div className="w-1.5 h-1.5 rounded-full bg-white" />
                    )}
                  </div>
                </div>
              </button>

              {/* Option B: Custom Upload */}
              <button
                type="button"
                onClick={() => setFormData({ ...formData, dataSource: "upload" })}
                className={`w-full p-5 rounded-xl border text-left flex items-start gap-4 transition-all duration-150 ${
                  formData.dataSource === "upload"
                    ? "bg-primary/5 border-primary shadow-xs ring-1 ring-primary/20"
                    : "bg-surface border-border hover:bg-surface-elevated hover:border-border-focus"
                }`}
              >
                <div
                  className={`w-11 h-11 rounded-lg flex items-center justify-center shrink-0 border ${
                    formData.dataSource === "upload"
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-surface-elevated text-muted-foreground border-border"
                  }`}
                >
                  <UploadCloud className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-sm text-foreground">
                      Upload Custom CSV or Parquet Files
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Upload your raw data into our local DuckDB engine. The 5D Data Trust engine will audit completeness, uniqueness, and outliers.
                  </p>
                </div>
                <div className="shrink-0 pt-0.5">
                  <div
                    className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                      formData.dataSource === "upload"
                        ? "border-primary bg-primary"
                        : "border-muted-foreground/40"
                    }`}
                  >
                    {formData.dataSource === "upload" && (
                      <div className="w-1.5 h-1.5 rounded-full bg-white" />
                    )}
                  </div>
                </div>
              </button>

              {/* Option C: Warehouse Connect (Coming Soon) */}
              <div className="w-full p-5 rounded-xl border border-border/50 bg-surface/40 opacity-70 flex items-start gap-4 cursor-not-allowed">
                <div className="w-11 h-11 rounded-lg bg-surface-elevated border border-border flex items-center justify-center shrink-0 text-muted-foreground">
                  <Lock className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-sm text-foreground">
                      Connect Enterprise Data Warehouse
                    </span>
                    <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded bg-surface-elevated border border-border text-muted-foreground">
                      v1.1 Release
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Direct read-only connectors for Snowflake, Databricks, PostgreSQL, and Google BigQuery with automated schema sync.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Actions */}
        <div className="pt-8 mt-6 border-t border-border flex items-center justify-between">
          {step > 1 ? (
            <button
              type="button"
              onClick={handleBack}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold text-foreground hover:bg-surface-elevated border border-border transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          ) : (
            <Link
              href="/"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Cancel
            </Link>
          )}

          <button
            type="button"
            onClick={handleNext}
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg text-xs font-semibold bg-primary hover:bg-primary-hover text-primary-foreground shadow-xs transition-colors disabled:opacity-60"
          >
            {isSubmitting ? (
              <span>Preparing Workspace...</span>
            ) : step === 3 ? (
              <>
                <span>Launch Workspace</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-300" />
              </>
            ) : (
              <>
                <span>Continue</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Footer Note */}
      <footer className="border-t border-border/60 py-3 text-center text-xs text-muted-foreground">
        NEXUS BI Evaluation Setup · Local DuckDB Execution · Zero Cloud Telemetry Leak
      </footer>
    </div>
  );
}
