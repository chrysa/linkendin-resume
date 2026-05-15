<div align="center">

# linkendin-resume — Persuasive Online CV

**A CV that stands out. Dark theme · One-page · Animations · Contact via GitHub Issues.**

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white&style=flat-square)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white&style=flat-square)](https://typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white&style=flat-square)](https://vitejs.dev)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-12-FF0055?logo=framer&logoColor=white&style=flat-square)](https://www.framer.com/motion)
[![Docker](https://img.shields.io/badge/Docker-ready-2496ED?logo=docker&logoColor=white&style=flat-square)](https://hub.docker.com)
[![CI](https://github.com/chrysa/linkendin-resume/actions/workflows/ci.yml/badge.svg)](https://github.com/chrysa/linkendin-resume/actions/workflows/ci.yml)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=chrysa_linkendin-resume&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=chrysa_linkendin-resume)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=chrysa_linkendin-resume&metric=coverage)](https://sonarcloud.io/summary/new_code?id=chrysa_linkendin-resume)
[![Reliability Rating](https://sonarcloud.io/api/project_badges/measure?project=chrysa_linkendin-resume&metric=reliability_rating)](https://sonarcloud.io/summary/new_code?id=chrysa_linkendin-resume)
[![Security Rating](https://sonarcloud.io/api/project_badges/measure?project=chrysa_linkendin-resume&metric=security_rating)](https://sonarcloud.io/summary/new_code?id=chrysa_linkendin-resume)
[![License: MIT](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

[Live demo →](https://resume.chrysa.dev) · [Report a bug](../../issues/new?template=bug_report.yml) · [Request a feature](../../issues/new?template=feature_request.yml)

</div>

---

## Why this project?

Traditional online CVs look like PDFs on a page. This project takes the opposite approach:

| Classic CV | This project |
|---|---|
| White, institutional | Dark theme, strong identity |
| Task list | Quantified results, visible impact |
| Static navigation | Scroll animations, micro-interactions |
| Email form → spam | Contact via GitHub Issues — traceable, smart labels |
| Scattered data sources | All data in `cv.json` — single source of truth |
| Monolingual | FR + EN toggle, persisted in localStorage |

The goal: apply **Cialdini's persuasion principles** (authority, social proof, reciprocity) to portfolio design.

---

## What makes this stand out

| Feature | How |
|---|---|
| **Terminal easter egg** | Press `` ` `` — a macOS-style terminal opens with 9 commands (`whoami`, `git log`, `ls projects`, `skills`, `cat cv.json`, …) |
| **Command palette** (⌘K / Ctrl+K) | VS Code-style palette — navigate sections, toggle theme, switch language, print PDF |
| **Accessibility panel** | Floating panel: font size (+/−4 steps), high contrast, dyslexia font, reduced motion — persisted per visitor |
| **AI Ask Me widget** | Chat button that answers questions about experience, skills, availability using `cv.json` as knowledge base |
| **Role glitch cycling** | Hero headline fades/glitches every 5 s — subtle animation that draws attention |
| **Print / PDF mode** | `@media print` hides all interactive chrome, clean A4 layout for `window.print()` |
| **Live GitHub repos** | `useGitHubRepos` hook fetches public repos + skeleton loading + GitHub contribution graph |
| **Smart contact labels** | Regex analysis of the contact message → auto-applies `freelance`, `job-offer`, `collaboration`, `bug`, `question` labels to the GitHub issue |
| **Multi-profile URLs** | `/?profile=backend` filters skills/experience/projects for a targeted recruiter send |

---

## Stack

| Layer | Technology |
|---|---|
| Framework | React 19 + Vite 8 |
| Language | TypeScript 5.9 (strict) |
| Animations | Framer Motion 12 |
| i18n | i18next + react-i18next (FR/EN) |
| Validation | Zod 3 |
| Styling | CSS custom properties (100% vanilla, zero framework) |
| Icons | Bootstrap Icons (CSS font) |
| Tests | Vitest + Testing Library (116 tests) |
| Hosting | Vercel (recommended) / Docker + Traefik |

---

## Quick start

### Prerequisites

- Node.js ≥ 20 · npm ≥ 10 · Python ≥ 3.14 (pre-commit)
- Docker ≥ 26 + Docker Compose ≥ 2.27 (optional)

### Installation

```bash
git clone https://github.com/chrysa/linkendin-resume.git
cd linkendin-resume
make install
make pre-commit-install  # install git hooks
```

### Configuration

```bash
cp .env.example .env
```

Edit `.env` with your values:

```env
APP_PORT=3000
APP_DOMAIN=resume.chrysa.dev
VITE_GITHUB_OWNER=your-github-username
VITE_GITHUB_REPO=contact
```

> The contact system generates a pre-filled link to GitHub Issues. Visitors must be logged into GitHub. No server token required — the app is fully static.

### Local development

```bash
make dev          # Vite dev server → http://localhost:3000
make test         # Unit tests (116 tests)
make ci           # lint + type-check + test + build
```

### Docker development

```bash
make watch        # docker compose up --watch (hot-reload)
```

---

## Keyboard shortcuts

| Shortcut | Action |
|---|---|
| `` ` `` | Open terminal easter egg |
| ⌘K / Ctrl+K | Open command palette |

---

## Docker

The project provides three stages in [`docker/Dockerfile`](docker/Dockerfile):

| Stage  | Base              | Usage                      |
|--------|-------------------|----------------------------|
| `dev`  | node:24-alpine    | Vite dev server            |
| `build`| node:24-alpine    | TypeScript/Vite compilation|
| `prod` | node:24-alpine    | `serve -s dist` (static)   |

---

## CI/CD

| Workflow  | Trigger            | Steps                                                        |
|-----------|--------------------|--------------------------------------------------------------|
| `ci.yml`  | push/PR main+dev   | pre-commit · lint · type-check · test · build · SonarCloud  |
| `cd.yml`  | push main + tags   | GitVersion · tag · GHCR push · SSH deploy                   |

### Required GitHub secrets

| Secret           | Description                       |
|------------------|-----------------------------------|
| `SONAR_TOKEN`    | SonarCloud token                  |
| `DEPLOY_HOST`    | Server IP or hostname             |
| `DEPLOY_USER`    | SSH user                          |
| `DEPLOY_SSH_KEY` | SSH private key (Ed25519)         |

### Dependabot

Automatic updates configured for: `npm`, `github-actions`, `docker`, `pre-commit`.

---

## Server deployment (Traefik)

```bash
git clone https://github.com/chrysa/linkendin-resume.git /srv/resume
cd /srv/resume
cp .env.example .env  # edit APP_DOMAIN
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

Traefik automatically picks up the labels and generates the Let's Encrypt certificate.

---

## Customization

### CV data

All CV content lives in **`cv.json`** at the project root — it is the only file you need to edit:

```
cv.json
├── basics          → name, headline, photo, location, availability, githubUrl
├── metrics[]       → 3–4 impact numbers shown in the Impact section
├── experience[]    → timeline entries (bilingual via _en suffix)
├── education[]
├── skills[]        → name + level (1–5) + category
└── projects[]      → highlighted projects (static cards)
```

Place your photo at `public/assets/photo.jpg`.

### Design tokens

The entire design system lives in `src/styles/tokens.css`:

```css
--clr-accent-1: #7c3aed;   /* Primary colour */
--clr-accent-2: #06b6d4;   /* Secondary colour */
```

Change these two values to adapt the visual identity in 30 seconds.

### Accessibility tokens

Added automatically when the visitor uses the accessibility panel:

```css
[data-high-contrast='true']  { /* forced white-on-black palette */ }
[data-dyslexia='true']       { --font-sans: 'OpenDyslexic', … }
[data-reduced-motion='true'] { /* disables all animations */ }
```

---

## Project structure

```
app/src/
├── data/
│   ├── profile.ts          ← Getters for cv.json + GITHUB_CONFIG
│   └── profiles.ts         ← Multi-profile map (default/freelance/backend/fullstack)
├── components/
│   ├── cv/
│   │   ├── Hero.tsx              Hero + glitch headline + GitHub/lang buttons
│   │   ├── ImpactMetrics.tsx     Animated countUp metrics
│   │   ├── ExperienceTimeline.tsx
│   │   ├── SkillsCloud.tsx       Filterable skill cloud
│   │   ├── ProjectsGrid.tsx      Static cards + live GitHub repos + contribution graph
│   │   ├── EducationSection.tsx
│   │   ├── ContactSection.tsx    Final CTA
│   │   └── Navbar.tsx            Sticky, lang + theme + print button
│   ├── contact/
│   │   └── ContactModal.tsx      GitHub Issues (smart labels) / WhatsApp
│   └── ui/
│       ├── CustomCursor.tsx      Custom dot cursor (desktop only)
│       ├── ScrollProgress.tsx    Top progress bar
│       ├── FloatingCTA.tsx       Floating contact button (after 70% scroll)
│       ├── ThemeToggle.tsx
│       ├── AccessibilityPanel.tsx  ← NEW: a11y options panel
│       ├── TerminalEasterEgg.tsx   ← NEW: backtick terminal
│       ├── CommandPalette.tsx      ← NEW: ⌘K command palette
│       └── AskMeWidget.tsx         ← NEW: AI chat widget
├── hooks/
│   ├── useTheme.tsx
│   ├── useCountUp.ts
│   ├── useDocumentMeta.ts
│   └── useGitHubRepos.ts         ← NEW: live public repos from GitHub API
├── i18n/
│   ├── fr.ts / en.ts             ← UI strings (a11y, palette, askme keys added)
│   ├── types.ts                  ← Translations interface
│   └── setup.ts
└── styles/
    ├── tokens.css                Design tokens + a11y dataset overrides
    ├── globals.css               Reset + utilities + @a11y-font-offset
    ├── components.css            Buttons + all new components CSS
    ├── sections.css              Per-section styles
    ├── modal.css
    ├── animations.css            Cursor, progress bar, floating CTA
    └── responsive.css            Breakpoints
```

---

## Available commands

```bash
make dev            # Dev server (port 3000)
make build-prod     # Production build
make lint           # ESLint
make type-check     # TypeScript check
make test           # Unit tests (Vitest) — 116 tests
make test-coverage  # Coverage report
make ci             # All CI checks locally
make watch          # Dev container with hot-reload
make help           # List all commands
```

---

## Persuasion / UX principles applied

- **Authority** — visible impact numbers, well-known company logos, live GitHub contribution graph
- **Social proof** — GitHub projects with stars, public repos count
- **Scarcity** — dynamic "Available from X" badge in hero
- **Reciprocity** — open source projects accessible directly
- **Liking** — personal tone, photo, first-person voice, easter eggs
- **Consistency** — narrative timeline with logical progression

---

## Contributing

1. Fork the repo
2. `git checkout -b feat/my-feature`
3. `git commit -m 'feat: description'`
4. `git push origin feat/my-feature`
5. Open a Pull Request

---

## License

MIT — Free to use, modify and distribute.

---

<div align="center">

Built with React & ☕ · [⭐ Star if useful](../../stargazers)

</div>
