// SPDX-License-Identifier: AGPL-3.0-or-later

import { describe, expect, test } from "vitest";

import { evidenceGaps, payload, reviewPosture, summary, validation, vendorLane } from "./thirdPartyRiskEvidenceLedgerService.js";

describe("thirdPartyRiskEvidenceLedgerService", () => {
  test("summary reflects the sample vendor posture", () => {
    const metrics = summary();
    expect(metrics.vendors).toBe(2);
    expect(metrics.healthyVendors).toBe(1);
    expect(metrics.gaps).toBe(6);
  });

  test("lane and review payloads stay populated", () => {
    expect(vendorLane().length).toBe(4);
    expect(evidenceGaps().length).toBeGreaterThan(0);
    expect(reviewPosture().length).toBe(4);
    expect(payload().sample).toBeDefined();
  });

  test("verification stays honest about synthetic vendor-risk posture", () => {
    expect(validation().join(" ")).toContain("synthetic");
    expect(validation().join(" ")).toContain("third-party risk");
  });
});
