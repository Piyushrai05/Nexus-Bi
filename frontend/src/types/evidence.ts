export type ConfidenceLevel = "high" | "medium" | "low" | "insufficient_evidence";

export interface EvidencePayload {
  metricId: string;
  metricLabel: string;
  valueFormatted: string;
  deltaFormatted?: string;
  periodLabel?: string;
  definition: string;
  formula: string;
  sql?: string;
  method?: string;
  assumptions: string[];
  confidence: ConfidenceLevel;
  confidenceReason: string;
  computedAt: string;
  sampleRows?: Array<Record<string, any>>;
  dataLineage?: {
    sourceTable: string;
    rowCount: number;
    lastSynced: string;
    filtersApplied: string[];
  };
}
