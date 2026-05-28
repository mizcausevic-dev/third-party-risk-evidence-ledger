// SPDX-License-Identifier: AGPL-3.0-or-later

import { describe, expect, test } from "vitest";

import { renderDocs, renderEvidenceGaps, renderOverview } from "./render.js";

describe("render", () => {
  test("overview includes vendor-risk framing", () => {
    expect(renderOverview()).toContain("Third-Party Risk Evidence Ledger");
    expect(renderOverview()).toContain("vendor risk");
  });

  test("docs and gap routes use the new route and CLI names", () => {
    expect(renderDocs()).toContain("/vendor-lane");
    expect(renderDocs()).toContain("third-party-risk-ledger");
    expect(renderEvidenceGaps()).toContain("Evidence Gaps");
  });
});
