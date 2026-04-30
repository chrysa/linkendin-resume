# linkendin-resume — Claude context

## What does this project do?

Persuasive online CV / personal resume website. Dark-themed, one-page, animated React app that stands out visually from traditional static PDF-style CVs. Contact is handled by redirecting visitors to GitHub Issues (no backend email form). Live at **resume.chrysa.dev**.


## Language Rules

- Language: English — all code, comments, documentation, instructions, and configuration files must be in English.
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

<!-- gitnexus:start -->
# GitNexus — Code Intelligence

This project is indexed by GitNexus as **linkendin-resume** (402 symbols, 511 relationships, 9 execution flows). Use the GitNexus MCP tools to understand code, assess impact, and navigate safely.

> If any GitNexus tool warns the index is stale, run `npx gitnexus analyze` in terminal first.

## Always Do

- **MUST run impact analysis before editing any symbol.** Before modifying a function, class, or method, run `gitnexus_impact({target: "symbolName", direction: "upstream"})` and report the blast radius (direct callers, affected processes, risk level) to the user.
- **MUST run `gitnexus_detect_changes()` before committing** to verify your changes only affect expected symbols and execution flows.
- **MUST warn the user** if impact analysis returns HIGH or CRITICAL risk before proceeding with edits.
- When exploring unfamiliar code, use `gitnexus_query({query: "concept"})` to find execution flows instead of grepping. It returns process-grouped results ranked by relevance.
- When you need full context on a specific symbol — callers, callees, which execution flows it participates in — use `gitnexus_context({name: "symbolName"})`.

## Never Do

- NEVER edit a function, class, or method without first running `gitnexus_impact` on it.
- NEVER ignore HIGH or CRITICAL risk warnings from impact analysis.
- NEVER rename symbols with find-and-replace — use `gitnexus_rename` which understands the call graph.
- NEVER commit changes without running `gitnexus_detect_changes()` to check affected scope.

## Resources

| Resource | Use for |
|----------|---------|
| `gitnexus://repo/linkendin-resume/context` | Codebase overview, check index freshness |
| `gitnexus://repo/linkendin-resume/clusters` | All functional areas |
| `gitnexus://repo/linkendin-resume/processes` | All execution flows |
| `gitnexus://repo/linkendin-resume/process/{name}` | Step-by-step execution trace |

## CLI

| Task | Read this skill file |
|------|---------------------|
| Understand architecture / "How does X work?" | `.claude/skills/gitnexus/gitnexus-exploring/SKILL.md` |
| Blast radius / "What breaks if I change X?" | `.claude/skills/gitnexus/gitnexus-impact-analysis/SKILL.md` |
| Trace bugs / "Why is X failing?" | `.claude/skills/gitnexus/gitnexus-debugging/SKILL.md` |
| Rename / extract / split / refactor | `.claude/skills/gitnexus/gitnexus-refactoring/SKILL.md` |
| Tools, resources, schema reference | `.claude/skills/gitnexus/gitnexus-guide/SKILL.md` |
| Index, status, clean, wiki CLI commands | `.claude/skills/gitnexus/gitnexus-cli/SKILL.md` |

<!-- gitnexus:end -->
