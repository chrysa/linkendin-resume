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

---

## D-0002 — Adopt Neon Brutalist design system (yellow accent)

- **Date:** 2026-06-12
- **Status:** Accepted
- **Context:** linkendin-resume's turn in the 17-repo design campaign rolling out
  the shared-standards Neon Brutalist system. The prior look was soft (violet→cyan
  gradient accent, glow shadows, rounded) — the opposite of the chosen DNA.
- **Decision:** Rewrote the token layer in `app/src/styles/tokens.css` and swept
  the consuming stylesheets to the brutalist contract — flat single acid accent
  (no gradient), `--radius 0`, 2px FG-colored borders, hard `4px 4px 0` shadows
  (no blur/glow), Space Grotesk + JetBrains Mono. Per-app accent assigned as
  **acid yellow** `#ffe600` (dark) / `#e0c400` (light), distinct from all other
  campaign hues; used as fill blocks with `#0e0e10` ink.
- **Consequences:** The `html[data-theme]` mechanism, the FOUC guard
  (`localStorage['theme']`), and the `data-high-contrast` / `data-dyslexia` /
  `data-reduced-motion` accessibility datasets are all preserved. All Vitest +
  Playwright test selectors are unchanged; `cv.json` and component logic untouched.
  See `app/DESIGN.md`.
