# resume — Copilot Instructions

## Project Overview

Personal interactive resume built with **SvelteKit + TypeScript**.
CI/CD via GitHub Actions composite actions from `chrysa/github-actions@v1`.

## Stack

- **Frontend**: SvelteKit, TypeScript, Vite, Vitest, ESLint
- **Styling**: CSS modules / Tailwind
- **containerization**: Docker (multi-stage build)
- **Versioning**: GitVersion (semver), git-cliff (CHANGELOG)
- **Quality**: pre-commit, ruff (if Python scripts), SonarCloud

## Key Constraints

- All code in `app/` — TypeScript strict mode
- **No `console.log`** in production code
- **All functions must have explicit return types**
- Tests must pass before commit (`vitest`)
- SonarCloud: `chrysa_linkendin-resume` project

## CI Workflow

| Job | Uses |
|---|---|
| `pre-commit` | `actions/checkout@v4`, `actions/setup-python@v5` |
| `version` | `chrysa/github-actions/gitversion@v1` |
| `lint` | `actions/setup-node@v4`, `npm run lint`, `npm run type-check` |
| `test` | `npm run test:coverage` |
| `build` | `npm run build` |
| `sonar` | `SonarSource/sonarqube-scan-action@v5` |

## Development Workflow

1. Branch from `main` (feature/*, fix/*, chore/*)
2. Run `pre-commit run --all-files` before pushing
3. PRs require all CI jobs to pass
