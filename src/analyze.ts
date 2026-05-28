import type {
  CoverageOptions,
  CoverageReport,
  EvidenceGap,
  EvidenceStatus,
  Finding,
  ThirdPartyProfile,
  VendorRiskExport
} from "./types.js";

const HOUR_MS = 3_600_000;

function emptyStatusCounts(): Record<EvidenceStatus, number> {
  return {
    ACTIVE: 0,
    RESOLVED: 0
  };
}

function lastUpdatedAt(gap: EvidenceGap): Date {
  return new Date(gap.updatedAt ?? gap.createdAt);
}

function vendorHasDomain(vendor: ThirdPartyProfile, domain: string): boolean {
  return vendor.domains.includes(domain);
}

export function analyze(input: VendorRiskExport, opts: CoverageOptions = {}): CoverageReport {
  const now = opts.now ? new Date(opts.now) : new Date();
  const staleAfter = (opts.staleDetectionAfterHours ?? 96) * HOUR_MS;

  const vendors = input.vendors ?? [];
  const gaps = input.gaps ?? [];
  const findingsList: Finding[] = [];
  const detectionsByStatus = emptyStatusCounts();

  const healthyVendors = vendors.filter((vendor) => vendor.status === "HEALTHY");
  const activeGaps = gaps.filter((gap) => gap.status === "ACTIVE");
  const highSeverityGaps = activeGaps.filter((gap) => gap.severity === "high");
  const workflowGaps = vendors.filter((vendor) => vendor.status === "DEGRADED" || !vendor.workflowHealthy).length;

  if (healthyVendors.length === 0) {
    findingsList.push({
      code: "no-healthy-vendor",
      severity: "high",
      message: "No third-party profile is in a healthy evidence posture for the captured review scope.",
      subject: "vendors"
    });
  }

  for (const vendor of vendors) {
    if (vendor.status === "DEGRADED") {
      findingsList.push({
        code: "evidence-gap",
        severity: "medium",
        message: `${vendor.vendor} is degraded in ${vendor.scope} and is missing enough current evidence for sign-off.`,
        subject: vendor.id,
        subjectName: vendor.vendor,
        scope: vendor.scope,
        owner: vendor.owner
      });
    }

    if (vendor.status === "HEALTHY" && !vendorHasDomain(vendor, "ACCESS")) {
      findingsList.push({
        code: "access-gap",
        severity: "medium",
        message: `${vendor.vendor} is missing access-control evidence for provisioning, privileged roles, or offboarding posture.`,
        subject: vendor.id,
        subjectName: vendor.vendor,
        scope: vendor.scope,
        owner: vendor.owner
      });
    }

    if (vendor.status === "HEALTHY" && !vendorHasDomain(vendor, "RESILIENCE")) {
      findingsList.push({
        code: "resilience-gap",
        severity: "medium",
        message: `${vendor.vendor} is missing resilience evidence for uptime commitments, backups, or incident recovery posture.`,
        subject: vendor.id,
        subjectName: vendor.vendor,
        scope: vendor.scope,
        owner: vendor.owner
      });
    }

    if (!vendor.workflowHealthy) {
      findingsList.push({
        code: "workflow-gap",
        severity: "medium",
        message: `${vendor.vendor} is missing a healthy review workflow for renewal, exception handling, or sign-off sequencing.`,
        subject: vendor.id,
        subjectName: vendor.vendor,
        scope: vendor.scope,
        owner: vendor.owner
      });
    }
  }

  for (const gap of gaps) {
    detectionsByStatus[gap.status] += 1;

    if (gap.status !== "ACTIVE") {
      continue;
    }

    if (gap.domain === "ACCESS") {
      findingsList.push({
        code: "access-gap",
        severity: gap.severity,
        message: `Access evidence around "${gap.asset}" still needs confirmation before procurement can call posture healthy.`,
        subject: gap.id,
        subjectName: gap.asset,
        scope: gap.scope,
        principal: gap.principal,
        owner: gap.owner
      });
    }

    if (gap.domain === "RESILIENCE") {
      findingsList.push({
        code: "resilience-gap",
        severity: gap.severity,
        message: `Resilience evidence for "${gap.asset}" remains incomplete and needs a tighter recovery and testing trail.`,
        subject: gap.id,
        subjectName: gap.asset,
        scope: gap.scope,
        owner: gap.owner
      });
    }

    if (gap.domain === "PRIVACY" || gap.domain === "COMPLIANCE" || gap.domain === "SUBPROCESSOR") {
      findingsList.push({
        code: "privacy-gap",
        severity: gap.severity,
        message: `Privacy, compliance, or subprocesser evidence for "${gap.asset}" remains incomplete and may block approval.`,
        subject: gap.id,
        subjectName: gap.asset,
        scope: gap.scope,
        owner: gap.owner
      });
    }

    if (gap.evidenceKind === "Review" || gap.evidenceKind === "Exception" || gap.evidenceKind === "Incident") {
      findingsList.push({
        code: "workflow-gap",
        severity: gap.severity,
        message: `Review workflow around "${gap.asset}" is still missing enough evidence for decision confidence.`,
        subject: gap.id,
        subjectName: gap.asset,
        scope: gap.scope,
        owner: gap.owner
      });
    }

    if (!gap.owner && gap.severity === "high") {
      findingsList.push({
        code: "high-severity-unassigned",
        severity: "medium",
        message: `High-severity gap "${gap.title}" still has no assigned owner.`,
        subject: gap.id,
        subjectName: gap.asset,
        scope: gap.scope
      });
    }

    if (now.getTime() - lastUpdatedAt(gap).getTime() > staleAfter) {
      findingsList.push({
        code: "stale-active-gap",
        severity: "medium",
        message: `Gap "${gap.title}" has remained active since ${lastUpdatedAt(gap).toISOString().slice(0, 16)}Z.`,
        subject: gap.id,
        subjectName: gap.asset,
        scope: gap.scope,
        owner: gap.owner
      });
    }
  }

  const staleGaps = activeGaps.filter((gap) => now.getTime() - lastUpdatedAt(gap).getTime() > staleAfter).length;

  return {
    generatedAt: now.toISOString(),
    vendors: vendors.length,
    healthyVendors: healthyVendors.length,
    gaps: gaps.length,
    detectionsByStatus,
    highSeverityGaps: highSeverityGaps.length,
    workflowGaps,
    staleGaps,
    findingsList,
    ok: !findingsList.some((finding) => finding.severity === "high")
  };
}
