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
- **Status:** Superseded by D-0003
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

---

## D-0003 — Adopt Editorial persona (supersedes brutalist D-0002; persona-migration pilot)

- **Date:** 2026-06-12
- **Status:** Accepted
- **Context:** linkendin-resume selected as the pilot for the chrysa persona
  migration to the Editorial system defined in `shared-standards/docs/DESIGN-SYSTEM.md
  §1 Editorial` and accent-restraint rules `§4`. The Neon Brutalist look (D-0002 —
  radius 0, 2px FG borders, hard offset shadows, acid fill blocks, mono-only type,
  Space Grotesk) was reversed in favour of a crafted, readable résumé aesthetic.
- **Decision:** Tokens updated to warm amber accent (`#f0a830` dark / `#b45309`
  light), Fraunces serif display + Inter body, soft `10px` radius, `0 4px 24px`
  blurred shadows, 1px hairline borders, calm 0.22s transitions. Swept all six
  consuming stylesheets (`globals`, `components`, `sections`, `modal`,
  `animations`, `responsive`) — serif headings, soft rounded cards/buttons,
  1px hairline borders, normal case labels, amber restrained to one CTA fill +
  amber-text links. Press-translate hover effects replaced by calm `translateY`
  lifts or `brightness` filters.
- **Consequences:** `data-theme` dark/light mechanism, FOUC guard, and the
  `data-high-contrast` / `data-dyslexia` / `data-reduced-motion` a11y datasets
  all preserved and working. All Vitest + Playwright test selectors (`data-testid`,
  `role`, `aria-*`) are unchanged. `cv.json` and component logic untouched. See
  `app/DESIGN.md`.
