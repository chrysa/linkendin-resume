# Architecture — linkendin-resume

> Grounded in the files present in this repository. Where the repo has no evidence for a
> topic, the section reads "N/A — not present in repo".

## Purpose

`linkendin-resume` (package name `cv-online`) is a persuasive, single-page online CV /
resume web application. It renders a dark-themed, animated one-page profile, lists public
GitHub repositories of the profile owner, and lets visitors get in touch via a contact
modal (GitHub Issues based). The app supports internationalization (English / French) and
a demo mode that serves inline fixtures instead of hitting the live GitHub API.

## Stack

- **Language / runtime**: TypeScript (`~7.0.2`), ES modules, browser SPA.
- **Framework**: React 19 (`react`, `react-dom`).
- **Build tool**: Vite 8 (`@vitejs/plugin-react`).
- **Routing**: `react-router-dom` 7.
- **Data / async**: `@tanstack/react-query` 5; native `fetch` to the GitHub REST API.
- **Animation**: `framer-motion` 13.
- **i18n**: `i18next`, `react-i18next`, `i18next-browser-languagedetector`.
- **UI extras**: `bootstrap-icons`, `react-toastify`.
- **Testing**: Vitest 5 + Testing Library (jsdom) for unit; Playwright for E2E.
- **Lint / format**: ESLint 10 (typescript-eslint, react plugins), Prettier.
- **Tooling scripts**: Python (`pyproject.toml`) drives `scripts/gen_context_files.py` and
  `scripts/quality_gate.py` (context-file generation and quality gates), not the app itself.
- **Container / deploy**: Docker (`docker/Dockerfile`, multi-stage dev/prod), `docker-compose.yml`;
  published image `ghcr.io/chrysa/resume`. CI via GitHub Actions; SonarCloud quality gate.

## Layout

- `app/` — the frontend application (own `package.json`, Vite/TS/Vitest/Playwright config).
  - `app/src/App.tsx`, `app/src/main.tsx` — root component and bootstrap.
  - `app/src/components/` — UI (`ui/`, `contact/`, and section components).
  - `app/src/pages/`, `app/src/hooks/`, `app/src/contexts/` — pages, hooks, React contexts
    (e.g. `ProfileContext.tsx`, `useTheme.tsx`, `useGitHubRepos.ts`).
  - `app/src/data/` — profile data (`profile.ts`, `profiles.ts`, `demoRepos.ts`).
  - `app/src/i18n/` — i18next setup and `en` / `fr` message catalogs.
  - `app/src/types/`, `app/src/utils/`, `app/src/styles/`, `app/src/__tests__/`, `app/tests/`.
  - `app/cv.json`, `app/DESIGN.md`, `app/BRAND-BRIEF.md`, `app/public/` (robots, sitemap, CNAME).
- `docker/` — `Dockerfile`. `makefiles/` — modular Make includes. `scripts/` — Python tooling.
- `standards/`, `docs/`, `graphify-out/` — standards, documentation, generated graph output.
- Root: `Makefile`, `docker-compose.yml`, `pyproject.toml`, `Dockerfile.test`,
  `.pre-commit-config.yaml`, `sonar-project.properties`, plus many context/meta docs
  (`README.md`, `CLAUDE.md`, `AGENTS.md`, `DOCUMENTATION.md`, `DECISIONS.md`, `context.md`).

## Entrypoints

- **Web app**: `app/index.html` → `app/src/main.tsx` → `app/src/App.tsx`.
- **Dev server**: `vite --port 3000` (npm `dev`); preview on `4173`.
- **Production build**: `tsc && vite build` (npm `build`), served as static assets (`app/dist/`).
- **Container**: `docker/Dockerfile` (dev `target: dev` hot-reload; prod stage) via `docker-compose.yml`.
- **Tooling**: `scripts/gen_context_files.py`, `scripts/quality_gate.py` (Python, run via Make/CI).

## Data & external dependencies

- **GitHub REST API** (external): `useGitHubRepos.ts` fetches
  `https://api.github.com/users/{owner}/repos?type=public&sort=pushed&per_page=…` (public,
  unauthenticated, `Accept: application/vnd.github+json`).
- **Contact**: contact modal producing GitHub Issue submissions (`types/github`, `ContactModal.tsx`).
- **Demo mode** (`utils/demoMode.ts`): serves inline fixtures (`data/demoRepos.ts`) and never
  calls the live GitHub API.
- **Local profile data**: static TS files under `app/src/data/` and `app/cv.json`.
- No database, no application backend server in this repo. `.env` / `.env.example` hold config.

## Build & test (real commands)

From `app/` (npm scripts):

```bash
npm run dev           # vite --port 3000
npm run build         # tsc && vite build
npm run preview       # vite preview --port 4173
npm run lint          # eslint src
npm run type-check    # tsc --noEmit
npm run test          # vitest --run
npm run test:coverage # vitest --coverage --run
npm run test:e2e      # playwright test
```

Container-oriented workflow (root `Makefile`, run `make help` for the full list):

```bash
make install       # install deps in container
make dev           # start dev server (hot-reload) and follow logs
make build-prod    # production build inside container
make typecheck     # TypeScript type check
make format        # Prettier
make test          # unit tests (see makefiles/tests.Makefile)
make docker-test   # run tests inside Docker (CI-compatible)
make ci            # type-check + lint + test + build
make build         # build dev docker image
make prod / prod-down
make pre-commit-install / make pre-commit
```

> Note: the app is JavaScript/TypeScript; the root `pyproject.toml` scopes Python only to the
> repo tooling scripts (context generation and quality gate), not to the application runtime.
