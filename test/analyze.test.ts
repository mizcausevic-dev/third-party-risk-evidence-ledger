import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

import { analyze } from "../src/analyze.js";
import { toMarkdown, toSummary } from "../src/format.js";
import type { VendorRiskExport } from "../src/types.js";

const here = fileURLToPath(new URL(".", import.meta.url));
const fixture = (name: string): VendorRiskExport =>
  JSON.parse(readFileSync(`${here}/../fixtures/${name}`, "utf8")) as VendorRiskExport;

const NOW = "2026-05-30T00:00:00Z";

describe("analyze", () => {
  it("counts vendors and gaps", () => {
    const report = analyze(fixture("vendor-risk.json"), { now: NOW });
    expect(report.vendors).toBe(2);
    expect(report.healthyVendors).toBe(1);
    expect(report.gaps).toBe(6);
  });

  it("flags missing healthy vendors as high", () => {
    const report = analyze({ vendors: [], gaps: [] }, { now: NOW });
    expect(report.findingsList.find((finding) => finding.code === "no-healthy-vendor")?.severity).toBe("high");
  });

  it("flags degraded evidence posture", () => {
    const report = analyze(fixture("vendor-risk.json"), { now: NOW });
    expect(report.findingsList.find((finding) => finding.code === "evidence-gap")?.scope).toBe("Fulfillment and routing orchestration");
  });

  it("flags access, resilience, privacy, and workflow gaps", () => {
    const report = analyze(fixture("vendor-risk.json"), { now: NOW });
    expect(report.findingsList.find((finding) => finding.code === "access-gap")).toBeDefined();
    expect(report.findingsList.find((finding) => finding.code === "resilience-gap")).toBeDefined();
    expect(report.findingsList.find((finding) => finding.code === "privacy-gap")).toBeDefined();
    expect(report.findingsList.find((finding) => finding.code === "workflow-gap")).toBeDefined();
  });

  it("flags stale active gaps", () => {
    const report = analyze(fixture("vendor-risk.json"), { now: NOW, staleDetectionAfterHours: 24 });
    expect(report.findingsList.find((finding) => finding.code === "stale-active-gap")).toBeDefined();
  });

  it("ok=true on a clean fixture", () => {
    const report = analyze(fixture("vendor-risk-clean.json"), { now: NOW });
    expect(report.ok).toBe(true);
    expect(report.findingsList.filter((finding) => finding.severity === "high")).toEqual([]);
  });
});

describe("formatters", () => {
  it("toMarkdown ranks high findings first", () => {
    const markdown = toMarkdown(analyze(fixture("vendor-risk.json"), { now: NOW }));
    expect(markdown).toContain("❌");
    expect(markdown.indexOf("🔴")).toBeLessThan(markdown.indexOf("🟠"));
  });

  it("toSummary emits a one-liner", () => {
    const summary = toSummary(analyze(fixture("vendor-risk.json"), { now: NOW }));
    expect(summary).toMatch(/vendors/);
    expect(summary).toMatch(/gaps/);
  });
});
