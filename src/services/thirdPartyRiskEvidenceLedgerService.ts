// SPDX-License-Identifier: AGPL-3.0-or-later

import { analyze } from "../analyze.js";
import { reviewPackets, sampleVendorRiskPayload, vendorLanePackets } from "../data/sampleVendorRisk.js";
import type { Finding } from "../types.js";

const NOW = "2026-05-30T00:00:00Z";
const report = analyze(sampleVendorRiskPayload, {
  now: NOW,
  staleDetectionAfterHours: 72
});

function severityRank(finding: Finding): number {
  return finding.severity === "high"
    ? 0
    : finding.severity === "medium"
      ? 1
      : finding.severity === "low"
        ? 2
        : 3;
}

export function summary() {
  return {
    vendors: report.vendors,
    healthyVendors: report.healthyVendors,
    gaps: report.gaps,
    highSeverityGaps: report.highSeverityGaps,
    workflowGaps: report.workflowGaps,
    staleGaps: report.staleGaps,
    recommendation:
      "Restore stale evidence, close privileged access review gaps, repair privacy appendix drift, and stabilize renewal workflow before calling vendor posture healthy."
  };
}

export function vendorLane() {
  return vendorLanePackets.map((lane) => ({
    ...lane,
    relatedFindings: report.findingsList.filter((finding) => {
      if (lane.id === "access-lane") {
        return finding.code === "access-gap" || finding.code === "high-severity-unassigned";
      }
      if (lane.id === "resilience-lane") {
        return finding.code === "resilience-gap" || finding.code === "stale-active-gap";
      }
      if (lane.id === "privacy-lane") {
        return finding.code === "privacy-gap" || finding.code === "evidence-gap";
      }
      if (lane.id === "workflow-lane") {
        return finding.code === "workflow-gap" || finding.code === "stale-active-gap";
      }
      return false;
    }).length
  }));
}

export function evidenceGaps() {
  return [...report.findingsList]
    .sort((left, right) => severityRank(left) - severityRank(right))
    .map((finding) => ({
      ...finding,
      owner:
        finding.owner ??
        (finding.code === "access-gap"
          ? "Identity Governance"
          : finding.code === "resilience-gap"
            ? "Vendor Risk Operations"
            : finding.code === "privacy-gap"
              ? "Privacy Operations"
              : "Procurement Governance")
    }));
}

export function reviewPosture() {
  return reviewPackets;
}

export function verification() {
  return [
    "The dashboard is backed by a real offline vendor-risk analyzer and CLI, not static copy alone.",
    "Vendors and evidence gaps are synthetic sample data only; no live contracts, questionnaires, or customer submissions are published.",
    "The control plane keeps evidence coverage, renewal workflow, and review posture visible for vendor-risk stakeholders.",
    "This surface demonstrates third-party risk evidence operations, not a generic procurement keyword page.",
    "It complements claim routing, compliance ledgers, privacy posture, and security governance proof with a reusable vendor-review primitive."
  ];
}

export const validation = verification;

export function payload() {
  return {
    summary: summary(),
    vendorLane: vendorLane(),
    evidenceGaps: evidenceGaps(),
    reviewPosture: reviewPosture(),
    verification: verification(),
    sample: sampleVendorRiskPayload
  };
}
