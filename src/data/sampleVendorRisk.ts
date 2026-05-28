import type { VendorRiskExport } from "../types.js";

export const sampleVendorRiskPayload: VendorRiskExport = {
  vendors: [
    {
      id: "vendor-authmesh",
      vendor: "AuthMesh",
      scope: "Identity and workforce authentication",
      status: "HEALTHY",
      domains: ["ACCESS", "PRIVACY", "COMPLIANCE"],
      owner: "Security Governance",
      workflowHealthy: true
    },
    {
      id: "vendor-shipgrid",
      vendor: "ShipGrid",
      scope: "Fulfillment and routing orchestration",
      status: "DEGRADED",
      domains: ["RESILIENCE", "SUBPROCESSOR"],
      owner: "Vendor Risk Operations",
      workflowHealthy: false
    }
  ],
  gaps: [
    {
      id: "vr-001",
      category: "Access",
      title: "Privileged admin review evidence is missing final approval",
      scope: "Identity and workforce authentication",
      severity: "high",
      status: "ACTIVE",
      evidenceKind: "Review",
      asset: "Privileged admin review packet",
      principal: "global-admins@authmesh.example",
      domain: "ACCESS",
      createdAt: "2026-05-26T09:10:00Z",
      updatedAt: "2026-05-26T10:35:00Z",
      owner: "Identity Governance",
      note: "Reconcile role attestations before the next access review window."
    },
    {
      id: "vr-002",
      category: "Resilience",
      title: "Disaster recovery evidence is stale for routing platform",
      scope: "Fulfillment and routing orchestration",
      severity: "medium",
      status: "ACTIVE",
      evidenceKind: "Control",
      asset: "DR exercise packet",
      domain: "RESILIENCE",
      createdAt: "2026-05-25T20:15:00Z",
      updatedAt: "2026-05-25T21:00:00Z",
      owner: "Vendor Risk Operations",
      note: "Refresh tabletop and restore test records before renewal."
    },
    {
      id: "vr-003",
      category: "Privacy",
      title: "Subprocessor list and DPA appendix are not current",
      scope: "Fulfillment and routing orchestration",
      severity: "medium",
      status: "ACTIVE",
      evidenceKind: "Questionnaire",
      asset: "Privacy appendix packet",
      domain: "SUBPROCESSOR",
      createdAt: "2026-05-24T22:00:00Z",
      updatedAt: "2026-05-24T22:40:00Z",
      owner: "Privacy Operations",
      note: "Restore list accuracy and confirm data transfer posture."
    },
    {
      id: "vr-004",
      category: "Workflow",
      title: "Exception packet is incomplete for SLA carve-out approval",
      scope: "Fulfillment and routing orchestration",
      severity: "high",
      status: "ACTIVE",
      evidenceKind: "Exception",
      asset: "SLA carve-out exception",
      domain: "COMPLIANCE",
      createdAt: "2026-05-24T08:30:00Z",
      updatedAt: "2026-05-24T09:15:00Z",
      owner: "Procurement Governance",
      note: "Resolve exception drift before commercial renewal proceeds."
    },
    {
      id: "vr-005",
      category: "Compliance",
      title: "SOC packet remains open without final owner confirmation",
      scope: "Identity and workforce authentication",
      severity: "high",
      status: "ACTIVE",
      evidenceKind: "Incident",
      asset: "SOC evidence queue",
      domain: "COMPLIANCE",
      createdAt: "2026-05-23T12:00:00Z",
      updatedAt: "2026-05-23T12:20:00Z",
      note: "Evidence queue still lacks final ownership proof."
    },
    {
      id: "vr-006",
      category: "Access",
      title: "Legacy contractor role review was completed and closed",
      scope: "Identity and workforce authentication",
      severity: "low",
      status: "RESOLVED",
      evidenceKind: "Review",
      asset: "Contractor role review",
      principal: "contractor-ops@authmesh.example",
      domain: "ACCESS",
      createdAt: "2026-05-20T12:00:00Z",
      updatedAt: "2026-05-21T08:00:00Z",
      owner: "Identity Governance"
    }
  ]
};

export const vendorLanePackets = [
  {
    id: "access-lane",
    lane: "Access review lane",
    owner: "Identity Governance",
    focus: "Privileged access evidence, role attestations, and owner approval.",
    status: "red",
    note: "Access evidence still carries unresolved approval and owner pressure.",
    nextAction: "Reconcile privileged review evidence and role attestations before the next renewal window."
  },
  {
    id: "resilience-lane",
    lane: "Resilience evidence lane",
    owner: "Vendor Risk Operations",
    focus: "BCDR proof, incident history, and recovery testing completeness.",
    status: "yellow",
    note: "Resilience evidence is recoverable, but recovery proof is still stale.",
    nextAction: "Refresh disaster recovery evidence and verify restore testing."
  },
  {
    id: "privacy-lane",
    lane: "Privacy and subprocesser lane",
    owner: "Privacy Operations",
    focus: "DPA coverage, subprocesser mapping, and transfer posture.",
    status: "red",
    note: "Privacy evidence is incomplete and subprocesser posture is drifting.",
    nextAction: "Repair privacy appendix coverage and confirm subprocesser posture before sign-off."
  },
  {
    id: "workflow-lane",
    lane: "Review workflow lane",
    owner: "Procurement Governance",
    focus: "Exception routing, renewal sign-off, and escalation readiness.",
    status: "red",
    note: "Workflow drift and evidence ownership are still below the desired bar.",
    nextAction: "Repair exception sequencing and close the stale evidence queue."
  }
];

export const reviewPackets = [
  {
    packetId: "VR-11",
    lane: "Privileged access review packet",
    owner: "Identity Governance",
    completenessScore: 66,
    status: "red",
    blocker: "Privileged admin evidence is still missing final approver sign-off.",
    launchWindowHours: 12,
    decisionNote: "Do not wait for the weekly governance review before tightening privileged access evidence."
  },
  {
    packetId: "VR-18",
    lane: "Resilience evidence packet",
    owner: "Vendor Risk Operations",
    completenessScore: 82,
    status: "yellow",
    blocker: "Disaster recovery proof is partially refreshed, but exercise evidence is not complete yet.",
    launchWindowHours: 20,
    decisionNote: "Resilience posture can clear once the latest restore test evidence lands."
  },
  {
    packetId: "VR-24",
    lane: "Privacy appendix packet",
    owner: "Privacy Operations",
    completenessScore: 58,
    status: "red",
    blocker: "Subprocessor and DPA evidence is still inconsistent across the latest packet.",
    launchWindowHours: 16,
    decisionNote: "Hold renewal until privacy evidence is current and approval-safe."
  },
  {
    packetId: "VR-31",
    lane: "Exception sign-off packet",
    owner: "Procurement Governance",
    completenessScore: 73,
    status: "red",
    blocker: "Commercial exception workflow is unresolved in the review queue.",
    launchWindowHours: 8,
    decisionNote: "Repair exception approval flow before commercial commitments move forward."
  }
];
