import { ConfidenceLevel, EvidencePayload } from "./evidence";

export interface KPIData {
  id: string;
  label: string;
  value: number;
  valueFormatted: string;
  delta: number;
  deltaFormatted: string;
  isPositiveGood: boolean; // e.g. true for revenue, false for churn/cost
  periodLabel: string;
  sparkline: number[];
  targetValue?: number;
  evidence: EvidencePayload;
}

export interface MetricDefinition {
  id: string;
  name: string;
  category: "finance" | "sales" | "marketing" | "customer" | "social";
  definition: string;
  formula: string;
  unit: "currency" | "percent" | "number" | "ratio";
  isPositiveGood: boolean;
  defaultSql: string;
}
