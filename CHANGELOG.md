# Changelog

## v1.0.0-prod — 2026-05-28
- Production hardening pass on Codex's v0.1-shipped scaffold. Confirmed CI + Pages workflow green on `main` at HEAD before tagging `v1.0-prod`.
- Codex's v2-era scaffold already carries the `## Production status` block, `## Part of the Kinetic Gain Suite` SEO footer, `Monetization ladder` with honest tier wording, and KGE `/embedded` tie-back — confirmed unchanged, no narrative edits.
- Added `vendor.kineticgain.com` to `procurement-pulse-engine/universe.csv` per the v2 "every deploy enters universe" rule.
- No `src/`, README narrative, docs, or screenshot edits — squad doctrine v1.1 respects the v0.1-shipped operator-surface as Codex shipped it.

## 0.1.0 - 2026-05-28

- Shipped `third-party-risk-evidence-ledger` as a public vendor-risk operator surface for evidence health, review gaps, renewal blockers, and approval sequencing.
- Added prerendered GitHub Pages packaging for `vendor.kineticgain.com` with `CNAME`, `robots.txt`, `sitemap.xml`, and OG/meta injection at deploy time.
- Added a reusable offline analyzer plus CLI for synthetic vendor profiles, evidence gaps, and review packets.
- Positioned the repo as a reusable governance primitive that composes cleanly with contract, reporting, privacy, procurement, and security proof without turning into a generic GRC page.
