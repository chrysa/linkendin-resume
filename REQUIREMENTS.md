# REQUIREMENTS — linkendin-resume

> Requirements reconstructed from repository evidence (README, ARCHITECTURE.md, code
> layout). `IMPLEMENTED` is asserted **only** where a concrete file/feature verifies it.
> Where a feature is described but not code-verified in this pass, status is `DESCRIBED`.
> Tags: **FACT / INFERENCE / UNKNOWN**.

## Product requirements (REQ-PROD)

| ID | Requirement | Status | Evidence |
|---|---|---|---|
| REQ-PROD-001 | Present a persuasive, single-page, dark-themed animated online CV | IMPLEMENTED | `app/src/App.tsx`, `cv/*` components, README |
| REQ-PROD-002 | All CV content driven from a single source of truth (`cv.json`) | IMPLEMENTED | `app/cv.json`, README "single source of truth" |
| REQ-PROD-003 | Contact via GitHub Issues (no backend email form) | IMPLEMENTED | `components/contact/ContactModal.tsx`, README |
| REQ-PROD-004 | Smart contact labels (regex → freelance/job-offer/…) applied to the issue | DESCRIBED | README feature table; label logic file not enumerated here |
| REQ-PROD-005 | List the owner's public GitHub repositories as social proof | IMPLEMENTED | `hooks/useGitHubRepos.ts`, `components/cv/ProjectsGrid.tsx` |
| REQ-PROD-006 | Multi-profile URLs (`/?profile=backend`) filter skills/experience/projects | IMPLEMENTED | `contexts/ProfileContext.tsx`, `data/profiles.ts`, `__tests__/profiles.test.ts` |
| REQ-PROD-007 | Internationalization English + French | IMPLEMENTED | i18next stack (ARCHITECTURE.md), `app/src/i18n/` (en/fr) |
| REQ-PROD-008 | Accessibility: high-contrast, dyslexia, reduced-motion modes | IMPLEMENTED | `components/ui/AccessibilityPanel.tsx`, `data-*` datasets (DECISIONS D-0002/D-0003) |
| REQ-PROD-009 | Terminal easter egg (backtick key, ~9 commands) | IMPLEMENTED | `components/ui/TerminalEasterEgg.tsx`, README |
| REQ-PROD-010 | "AI Ask Me" widget answering from `cv.json` | DESCRIBED | `components/ui/AskMeWidget.tsx`; runtime LLM behaviour UNKNOWN (see SECURITY.md §3) |
| REQ-PROD-011 | Command palette / scroll progress / floating CTA / custom cursor UX | IMPLEMENTED | `components/ui/CommandPalette.tsx`, `ScrollProgress.tsx`, `FloatingCTA.tsx`, `CustomCursor.tsx` |
| REQ-PROD-012 | Demo mode serving inline fixtures (offline, no live API) | IMPLEMENTED | `utils/demoMode.ts`, `data/demoRepos.ts`, `components/ui/DemoBanner.tsx` |
| REQ-PROD-013 | Impact metrics section (3–4 numbers) | IMPLEMENTED | `components/cv/ImpactMetrics.tsx`, `hooks/useCountUp.ts` |

## Technical requirements (REQ-TECH)

| ID | Requirement | Status | Evidence |
|---|---|---|---|
| REQ-TECH-001 | React 19 + TypeScript (strict) SPA | IMPLEMENTED | `app/package.json` (react ^19.3.0, typescript ~7.0.2), `tsconfig.json` |
| REQ-TECH-002 | Vite build to static `dist/` | IMPLEMENTED | `app/vite.config.ts`, `build` script `tsc && vite build`, `app/dist/` present |
| REQ-TECH-003 | Data fetching via TanStack Query 5 | IMPLEMENTED | `app/package.json` (@tanstack/react-query ^5.x), `hooks/useGitHubRepos.ts` |
| REQ-TECH-004 | Animations via Framer Motion | IMPLEMENTED | `app/package.json` (framer-motion ^13.2.0) |
| REQ-TECH-005 | Routing via react-router-dom 7 | IMPLEMENTED | `app/package.json` (react-router-dom ^7.x) |
| REQ-TECH-006 | Unit tests (Vitest) + E2E (Playwright) | IMPLEMENTED | see TESTING.md |
| REQ-TECH-007 | Multi-stage Docker (dev + prod), compose | IMPLEMENTED | `docker/Dockerfile`, `docker-compose.yml` |
| REQ-TECH-008 | CI: pre-commit → lint → typecheck → test → build → SonarCloud | IMPLEMENTED | `.github/workflows/ci.yml`, `sonar-project.properties` |
| REQ-TECH-009 | CD: GitVersion tag → GHCR image → SSH deploy | DESCRIBED | `.github/workflows/cd.yml`, `GitVersion.yml`, README (not executed here) |
| REQ-TECH-010 | Config via environment (`VITE_*`, no hardcoded servers) | IMPLEMENTED | `.env.example`, `app/.env` (keys only) |
| REQ-TECH-011 | Generated context files (llms-full.txt, context.md, handover.md) | IMPLEMENTED | `scripts/gen_context_files.py`, generated banners in files |
| REQ-TECH-012 | JS/TS package manager is `pnpm` (standard) | PARTIAL / CONTRADICTED | `pnpm-lock.yaml` present **and** `package-lock.json` present — see REVIEW.md |

## Non-functional (INFERENCE)

- **Static-first / offline-capable**: demo mode + static hosting → resilient to backend
  outage (there is no backend). **[INFERENCE]**
- **SEO/meta**: `useDocumentMeta` hook, `public/robots.txt`, `sitemap.xml`, `CNAME`
  (custom domain `resume.chrysa.dev`). **[FACT]**
- **Accessibility target**: WCAG 2.1 AA per chrysa `ui-ux` / `accessibility` skills and
  a11y datasets. Conformance level not independently audited in this pass. **[UNKNOWN]**

## Requirements NOT applicable (recorded)

- Backend API contract, database schema, migrations, server auth/SSO, observability
  agents: **N/A** — no backend in this repo (ARCHITECTURE.md). The chrysa standards that
  assume a backend (LDAP/SSO, server-side validation, DB migrations) do not bind here.
