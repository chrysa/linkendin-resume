# TESTING — linkendin-resume

> How this repository is tested, with **verified commands and file evidence**.
> Tags: **FACT** (present/verifiable in repo), **INFERENCE**, **UNKNOWN**.

## Test stack (FACT)

| Layer | Tool | Config | Evidence |
|---|---|---|---|
| Unit / component | **Vitest 5** + Testing Library (jsdom) | `app/vitest.config.ts` | `app/package.json` devDeps, `app/src/__tests__/` |
| End-to-end | **Playwright** (`@playwright/test` 1.63) | `app/playwright.config.ts` | `app/tests/` (E2E specs) |
| Coverage | `@vitest/coverage-v8` | via `vitest --coverage` | `app/coverage/` output present |
| Lint (quality gate) | ESLint 10, Prettier | `app/eslint.config.js` | `app/package.json` scripts |
| Type check | `tsc --noEmit` | `app/tsconfig.json` | `app/package.json` `type-check` |

Note: the chrysa global standard mandates "Vitest + Testing Library + MSW" for frontend
tests. Vitest + Testing Library are **confirmed present**. Whether **MSW** (mock service
worker, for stubbing the GitHub API) is wired in is **UNKNOWN** from this pass — the app
also has a demo-mode fixture path (`data/demoRepos.ts`) that can substitute for network
mocking. **[UNKNOWN / INFERENCE]**

## Unit / component tests (FACT)

Present under `app/src/__tests__/`:

- `components-ui.test.tsx` — UI component suite
- `components-cv.test.tsx` — CV section components
- `contact-modal.test.tsx` — contact modal behaviour
- `profiles.test.ts` — multi-profile data logic
- `useDocumentMeta.test.ts`, `useCountUp.test.ts` — hooks
- `animations.test.ts` — animation helpers
- `setup.ts` — test bootstrap (jsdom / Testing Library setup)

## E2E tests (FACT)

Playwright specs live in `app/tests/` with `app/playwright.config.ts`. Exact scenarios
were not enumerated in this pass. **[FACT that they exist; scenario detail UNKNOWN]**

## Commands (verified against `app/package.json` scripts / ARCHITECTURE.md)

From `app/`:

```bash
npm run test           # vitest --run           (unit/component, one-shot)
npm run test:coverage  # vitest --coverage --run (coverage report → app/coverage/)
npm run test:e2e       # playwright test         (E2E)
npm run lint           # eslint src
npm run type-check     # tsc --noEmit
npm run build          # tsc && vite build       (build must pass = compile gate)
```

Container / CI-oriented (root `Makefile` + `makefiles/tests.Makefile`):

```bash
make test          # unit tests
make docker-test   # run tests inside Docker (CI-compatible; uses Dockerfile.test)
make ci            # type-check + lint + test + build
make typecheck
make format        # Prettier
```

> These commands are transcribed from `ARCHITECTURE.md` and `app/package.json`; they were
> **not executed** during this documentation pass (docs-only task). Treat "passes" claims
> as **UNKNOWN** until run. **[FACT: commands exist. UNKNOWN: current pass/fail.]**

## Quality gate (FACT)

- CI runs pre-commit, lint, type-check, test, build, then **SonarCloud** analysis
  (README CI table; `.github/workflows/ci.yml`, `quality-gate-check.yml`).
- SonarCloud project key: `chrysa_linkendin-resume` (README badges: coverage, reliability,
  security, quality-gate).
- A Python `scripts/quality_gate.py` enforces additional repo-level gates (invoked via
  Make/CI). **[FACT]**

## Coverage (FACT / UNKNOWN)

- Coverage tooling is `@vitest/coverage-v8`; an `app/coverage/` (with `lcov.info`,
  HTML report) is present in the tree — a coverage run has been produced at least once.
  **[FACT]**
- The **current coverage percentage** is surfaced by the SonarCloud badge, not pinned in
  this repo's docs. **[UNKNOWN here — see the live badge in README.]**

## What is not tested here (INFERENCE)

- No backend/integration DB tests — there is no backend (by design).
- Real GitHub API responses are not asserted against a live endpoint in unit tests;
  demo fixtures (`data/demoRepos.ts`) provide deterministic data. **[INFERENCE]**
