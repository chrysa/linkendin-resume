---
name: documentation-map
description: "Procedure: Documentation map. Use when this procedure is needed."
---

Root docs (start here):

- `README.md` — features, quickstart, deploy, customization.
- `ARCHITECTURE.md` — stack, layout, entrypoints, real build/test commands (authoritative on versions).
- `REQUIREMENTS.md` — REQ-PROD / REQ-TECH matrix with evidence pointers.
- `TESTING.md` — Vitest + Playwright commands, quality gate, coverage.
- `SECURITY.md` — static-site threat surface + secrets-scan result (no HIGH/CRITICAL).
- `DECISIONS.md` — repo ADRs (D-0001..D-0003, design-system evolution).
- `REVIEW.md` — documentation-pass findings, contradictions, and doc debt.
- `DOCUMENTATION.md` / `context.md` — setup/customization guide and editorial notes.
- Generated (do not hand-edit): `context.md`, `llms-full.txt`, `handover.md`, `guideline-report.html`.

> Note: this CLAUDE.md's own "Tech stack" table lags `app/package.json`
> (Vite 8 / TS ~7 / Framer Motion 13 are installed). See `REVIEW.md` C-1.
