# DECISIONS — linkendin-resume

> Repository-local ADRs (Architectural Decision Records). Numbering: D-XXXX.
> Any deviation from [CODE_MANIFEST.md](../../shared-standards/CODE_MANIFEST.md) must be documented here.
> No active deviation → this project follows all chrysa global standards.

---

## D-0001 — Adherence to chrysa global standards

**Date**: 2026-05-25
**Status**: accepted

This project follows all conventions defined in `CODE_MANIFEST.md` (chrysa portfolio standards).
No active deviation is in effect. Any future deviation must be added as a new ADR entry below.

---

## Adopt chrysa canonical CI/process workflows and pre-commit baseline

- **Date:** 2026-06-07
- **Status:** Accepted
- **Context:** Repo configuration drifted from the chrysa standard (OPS-190).
- **Decision:** Adopt the canonical hygiene files, GitHub process workflows,
  and the Full pre-commit baseline defined in `chrysa/shared-standards`
  (EXECUTION_STANDARD section 8/14, ADR 0001).
- **Consequences:** CI job contract (pre-commit/lint/test/sonar) and branch
  protection align across the ecosystem; per-repo tuning stays in this file.
