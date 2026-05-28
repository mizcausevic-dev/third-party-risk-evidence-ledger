// SPDX-License-Identifier: AGPL-3.0-or-later

import express from "express";
import { fileURLToPath } from "node:url";

import {
  evidenceGaps,
  payload,
  reviewPosture,
  summary,
  vendorLane,
  verification
} from "./services/thirdPartyRiskEvidenceLedgerService.js";
import {
  renderDocs,
  renderEvidenceGaps,
  renderOverview,
  renderReviewPosture,
  renderValidation,
  renderVendorLane,
} from "./services/render.js";

const app = express();
const port = Number(process.env.PORT ?? 5520);
const host = process.env.HOST || "0.0.0.0";

app.get("/", (_req, res) => res.type("html").send(renderOverview()));
app.get("/vendor-lane", (_req, res) => res.type("html").send(renderVendorLane()));
app.get("/evidence-gaps", (_req, res) => res.type("html").send(renderEvidenceGaps()));
app.get("/review-posture", (_req, res) => res.type("html").send(renderReviewPosture()));
app.get("/verification", (_req, res) => res.type("html").send(renderValidation()));
app.get("/docs", (_req, res) => res.type("html").send(renderDocs()));

app.get("/api/dashboard/summary", (_req, res) => res.json(summary()));
app.get("/api/vendor-lane", (_req, res) => res.json(vendorLane()));
app.get("/api/evidence-gaps", (_req, res) => res.json(evidenceGaps()));
app.get("/api/review-posture", (_req, res) => res.json(reviewPosture()));
app.get("/api/verification", (_req, res) => res.json(verification()));
app.get("/api/sample", (_req, res) => res.json(payload()));

const currentFile = fileURLToPath(import.meta.url);
const invokedDirectly = process.argv[1] !== undefined && currentFile === process.argv[1];

if (invokedDirectly) {
  app.listen(port, host, () => {
    console.log(`Third-Party Risk Evidence Ledger listening on http://${host}:${port}`);
  });
}

export default app;
