import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  evidenceGaps,
  payload,
  reviewPosture,
  summary,
  verification,
  vendorLane
} from "../src/services/thirdPartyRiskEvidenceLedgerService.js";
import {
  renderDocs,
  renderEvidenceGaps,
  renderOverview,
  renderReviewPosture,
  renderValidation,
  renderVendorLane
} from "../src/services/render.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outputDir = path.join(root, "site");

fs.rmSync(outputDir, { recursive: true, force: true });
fs.mkdirSync(outputDir, { recursive: true });
fs.mkdirSync(path.join(outputDir, "api", "dashboard"), { recursive: true });
fs.copyFileSync(path.join(root, "CNAME"), path.join(outputDir, "CNAME"));

const pages: Record<string, string> = {
  "index.html": renderOverview(),
  [path.join("vendor-lane", "index.html")]: renderVendorLane(),
  [path.join("evidence-gaps", "index.html")]: renderEvidenceGaps(),
  [path.join("review-posture", "index.html")]: renderReviewPosture(),
  [path.join("verification", "index.html")]: renderValidation(),
  [path.join("docs", "index.html")]: renderDocs()
};

for (const [relativePath, html] of Object.entries(pages)) {
  const fullPath = path.join(outputDir, relativePath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, html, "utf8");
}

const apiPayloads: Record<string, unknown> = {
  [path.join("api", "dashboard", "summary.json")]: summary(),
  [path.join("api", "vendor-lane.json")]: vendorLane(),
  [path.join("api", "evidence-gaps.json")]: evidenceGaps(),
  [path.join("api", "review-posture.json")]: reviewPosture(),
  [path.join("api", "verification.json")]: verification(),
  [path.join("api", "sample.json")]: payload()
};

for (const [relativePath, data] of Object.entries(apiPayloads)) {
  const fullPath = path.join(outputDir, relativePath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, JSON.stringify(data, null, 2), "utf8");
}
