// Third-party risk operator surface for evidence and review posture.
//
// Inputs reflect synthetic exports or captured snapshots for:
//   - vendor assurance posture and review ownership
//   - evidence gaps, exceptions, and renewal workflows

export type VendorStatus = "HEALTHY" | "DEGRADED";
export type EvidenceStatus = "ACTIVE" | "RESOLVED";
export type RiskSeverity = "high" | "medium" | "low" | "info";
export type EvidenceKind = "Questionnaire" | "Control" | "Exception" | "Review" | "Incident" | string;
export type RiskDomain = "SECURITY" | "PRIVACY" | "RESILIENCE" | "COMPLIANCE" | "ACCESS" | "SUBPROCESSOR" | string;

export interface ThirdPartyProfile {
  id: string;
  vendor: string;
  scope: string;
  status: VendorStatus;
  domains: RiskDomain[];
  owner: string;
  workflowHealthy: boolean;
}

export interface EvidenceGap {
  id: string;
  category: string;
  title: string;
  scope: string;
  severity: RiskSeverity;
  status: EvidenceStatus;
  evidenceKind: EvidenceKind;
  asset: string;
  principal?: string;
  domain?: RiskDomain;
  createdAt: string;
  updatedAt?: string;
  owner?: string;
  note?: string;
}

export interface VendorRiskExport {
  vendors?: ThirdPartyProfile[];
  gaps?: EvidenceGap[];
}

export type EvidenceCode =
  | "no-healthy-vendor"
  | "evidence-gap"
  | "access-gap"
  | "resilience-gap"
  | "privacy-gap"
  | "workflow-gap"
  | "high-severity-unassigned"
  | "stale-active-gap";

export interface Finding {
  code: EvidenceCode;
  severity: RiskSeverity;
  message: string;
  subject: string;
  subjectName?: string;
  scope?: string;
  principal?: string;
  owner?: string;
}

export interface CoverageReport {
  generatedAt: string;
  vendors: number;
  healthyVendors: number;
  gaps: number;
  detectionsByStatus: Record<EvidenceStatus, number>;
  highSeverityGaps: number;
  workflowGaps: number;
  staleGaps: number;
  findingsList: Finding[];
  ok: boolean;
}

export interface CoverageOptions {
  now?: string;
  staleDetectionAfterHours?: number;
}
