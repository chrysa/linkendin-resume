# linkendin-resume — Claude context

> **Claude Code**: also read `.github/copilot-instructions.md` and `.github/instructions/*.instructions.md` for code specifications.

## What does this project do?

Persuasive online CV / personal resume website. Dark-themed, one-page, animated React app that stands out visually from traditional static PDF-style CVs. Contact is handled by redirecting visitors to GitHub Issues (no backend email form). Live at **resume.chrysa.dev**.

## Tech stack

| Layer | Tech |
|---|---|
| Framework | React 19 |
| Language | TypeScript 5.9 |
| Bundler | Vite 7 |
| Animations | Framer Motion 12 |
| CV data | `app/cv.json` (JSON schema for resume content) |
| Testing | Vitest + @testing-library/react |
| Linting | ESLint (flat config `eslint.config.js`) |
| Container | Docker |
| CI | GitHub Actions |
| Code quality | SonarCloud (`chrysa_linkendin-resume`) |
| Versioning | GitVersion |
| Pre-commit | pre-commit hooks |

## Repository structure

```
app/
  src/              React components + pages
  cv.json           Resume data (sections: experience, education, skills, etc.)
  index.html        Vite HTML entry point
  vite.config.ts
  vitest.config.ts
  eslint.config.js  ESLint flat config (ESM)
  tsconfig.json
  package.json
context.md          Content guidelines / editorial notes
DOCUMENTATION.md    Setup and customization guide
docker/             Dockerfile + compose config
docker-compose.yml
Makefile
GitVersion.yml
makefiles/          Modular Makefile includes
.pre-commit-config.yaml
```

## Development workflow

```bash
make dev           # docker-compose dev
make build         # production build
make pre-commit    # run pre-commit checks

# Inside app/
npm run dev        # Vite dev server
npm run build      # Vite production build
npm run test       # Vitest
npm run lint       # ESLint
```

## Key conventions

- Resume content lives entirely in `app/cv.json` — all text/data changes go here, not in components
- Contact section: links to GitHub Issues, not a form (no backend required)
- Animations: Framer Motion `motion.*` components, enter/exit transitions on scroll
- Dark theme: CSS custom properties, no theming library
- GitHub Issues templates: `bug_report.yml`, `feature_request.yml` in `.github/`

## Environment variables

- `VITE_BASE_URL` — base URL for meta tags and sitemap (default: `https://resume.chrysa.dev`)
- `VITE_GITHUB_ISSUES_URL` — link to GitHub Issues for the contact section

## Notes / known issues

- SonarCloud configured: project key `chrysa_linkendin-resume`, coverage badge active
- `cv.json` schema is informal — no JSON Schema validation yet
- Framer Motion 12 requires React 18+ — confirm compatibility with React 19
- `context.md` contains editorial notes on tone and positioning
- Live URL: https://resume.chrysa.dev
