# Security Policy

`third-party-risk-evidence-ledger` ships both an offline analyzer and a synthetic public dashboard surface. It reads JSON exports from vendor-review and evidence snapshots (or synthetic data) and emits structured findings, route JSON, and prerendered HTML. No live contract storage, no remote fetch of customer vendor records, and no execution of user-supplied code is included.

## Reporting

- [Open a security advisory](https://github.com/mizcausevic-dev/third-party-risk-evidence-ledger/security/advisories/new)
- Or create a private report through the GitHub Security tab if enabled

## Scope and posture

- The public dashboard is a static proof surface, not a live bridge into a production GRC, procurement, or vendor-management system.
- Do not place real contracts, questionnaires, customer documents, or production review exports in this repository.
- Sample data and screenshots are synthetic and meant only to demonstrate operator-surface behavior.
