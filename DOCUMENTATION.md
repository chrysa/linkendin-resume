# 📄 Resume — Technical Documentation

> **Repo:** [github.com/chrysa/resume](https://github.com/chrysa/resume) · **Live:** [resume.chrysa.dev](https://resume.chrysa.dev)
> **Stack:** React 19 · Vite 7 · TypeScript 5.9 · Framer Motion 12 · i18next · Docker

---

## 📌 Overview

This is a **persuasion-first online CV** — not an institutional PDF replica, but an interactive one-page experience designed to trigger emotion and action.

The design applies **Cialdini's principles of influence**:

| Principle | Implementation |
| --- | --- |
| **Authority** | Large impact metrics ("×3 perf", "+40% conversion"), company names |
| **Social proof** | Projects shipped count, GitHub stars, visible open-source work |
| **Reciprocity** | Public projects and code freely available |
| **Scarcity / Urgency** | Dynamic "Available from May 2026" badge in the hero |
| **Consistency** | Narrative timeline — each role shows a logical career progression |
| **Liking** | Personal photo, first-person tone, subtle easter eggs |

### Page structure

```
Hero          →  Identity + tagline + availability badge + CTA
Impact        →  3–4 animated key metrics (countUp)
Experience    →  Scroll-animated vertical timeline with tech badges
Stack         →  Filterable skill cloud (hover = level + linked projects)
Projects      →  3D tilt cards with links, tech tags, impact statement
Education     →  Minimal
Contact       →  Final CTA + GitHub Issues OR WhatsApp direct link
```

---

## ⚙️ Tech Stack

| Layer | Technology | Version | Notes |
| --- | --- | --- | --- |
| UI Framework | React | 19 | Strict mode, hooks only |
| Build tool | Vite | 7 | Dev server port 3000, `@/` → `src/` alias |
| Language | TypeScript | 5.9 | strict mode |
| Animations | Framer Motion | 12 | useInView, useScroll, useSpring, AnimatePresence |
| i18n | i18next + react-i18next | — | FR (default) + EN, localStorage persistence |
| Form validation | Zod | 3 | Contact form |
| CSS | Custom properties | — | 100% vanilla CSS, dark/light via `[data-theme]` |
| Icons | Bootstrap Icons | — | CSS font |
| Linting | ESLint + Prettier | — | Enforced by pre-commit |
| Tests | Vitest | — | `vitest.config.ts` |

---

## 🗂️ Data Architecture

### Single source of truth: `cv.json`

`cv.json` (at the project root) is the **only file you need to edit** to update your CV. It is read statically at build time — no external API, no database.

```
cv.json
├── basics
│   ├── firstName, lastName, headline, summary
│   ├── photoUrl, location, linkedinUrl
│   ├── availability  →  { available, label, label_en, type }
│   └── contact       →  { whatsapp?, whatsappPrefill, whatsappPrefill_en }
├── metrics[]         →  { value, label, label_en, sublabel, sublabel_en }
├── experience[]      →  { title, title_en, company, location, dates,
│                          description, description_en, technologies[] }
├── education[]       →  { school, degree, degree_en, fieldOfStudy,
│                          fieldOfStudy_en, startYear, endYear }
├── skills[]          →  { name, level (1–5), category }
└── projects[]        →  { title, title_en, description, description_en,
                           url?, githubUrl?, technologies[], impact, impact_en, stars? }
```

### Data layer: `src/data/profile.ts`

Getter functions that read `cv.json` and apply language and profile filters:

| Export | Signature | Used by |
| --- | --- | --- |
| `getProfile` | `(lang, filter?) → LinkedInProfile` | Hero, ExperienceTimeline |
| `getAvailability` | `(lang) → { available, label, type }` | Hero (badge) |
| `getMetrics` | `(lang) → MetricItem[]` | ImpactMetrics |
| `getProjects` | `(lang, filter?) → Project[]` | ProjectsGrid |
| `getSkills` | `(filter?) → Skill[]` | SkillsCloud |
| `getExperiencesForTech` | `(techName, lang) → string[]` | SkillsCloud (tooltip) |
| `GITHUB_CONFIG` | constant | ContactModal (issues URL) |
| `CONTACT_CONFIG` | `{ whatsapp, whatsappPrefill(lang) }` | ContactModal (WhatsApp) |

---

## 🎭 Multi-Profile System

Send a targeted CV to a recruiter with a single URL — no data duplication.

### How it works

```
URL: /?profile=<slug>
         ↓
ProfileContext  (reads URLSearchParams on load)
         ↓
PROFILES[slug]  →  { filter: { skillCategories, experienceIndices, projectIndices } }
         ↓
getProfile(lang, filter) / getSkills(filter) / getProjects(lang, filter)
         ↓
Hero · ExperienceTimeline · SkillsCloud · ProjectsGrid  (all filtered automatically)
```

### Built-in profiles (`src/data/profiles.ts`)

| Slug | URL | Content |
| --- | --- | --- |
| `default` | `/` | Full CV — all sections |
| `freelance` | `/?profile=freelance` | Frontend + Backend + Tools stack, Freelance tagline |
| `backend` | `/?profile=backend` | Backend + DevOps stack, Backend architect tagline |
| `fullstack` | `/?profile=fullstack` | All categories, Full Stack tagline |

### Add a custom profile

1. Add an entry to `src/data/profiles.ts`:

```typescript
myprofile: {
  slug: 'myprofile',
  label: 'My Profile',
  label_en: 'My Profile',
  hero: {
    tagline: 'Mon tagline personnalisé',
    tagline_en: 'My custom tagline',
  },
  filter: {
    skillCategories: ['frontend', 'tools'],
    experienceIndices: [0, 2],   // indices into cv.json.experience
    projectIndices: [1],          // indices into cv.json.projects
  },
},
```

2. Done. `/?profile=myprofile` works immediately — no other changes needed.

---

## 📬 Contact Channels

### GitHub Issues (always available)

The contact form builds a pre-filled GitHub Issues URL:

```
https://github.com/<VITE_GITHUB_OWNER>/<VITE_GITHUB_REPO>/issues/new
  ?title=[Contact] <subject>
  &body=**From:** <name>%0A%0A<message>
  &labels=contact
```

The visitor clicks the link and submits the issue themselves (GitHub login required). **No GitHub token needed on the server** — the app is fully static.

Configure via `.env`:

```env
VITE_GITHUB_OWNER=your-username
VITE_GITHUB_REPO=contact
```

### WhatsApp (optional)

Enable by filling in `cv.json → basics → contact → whatsapp` with an international number (`+336...`). Leave empty to hide the WhatsApp tab entirely.

Generated link:

```
https://wa.me/<number_without_+>?text=<whatsappPrefill URL-encoded>
```

### ContactModal behaviour

- If WhatsApp is configured → two tabs appear (GitHub / WhatsApp)
- If WhatsApp is empty → modal shows GitHub form only
- Client-side Zod validation: name ≥ 2 chars, subject ≥ 5, message 20–2000
- On GitHub submit → success state with "Open on GitHub" button

---

## 🌍 Internationalisation

| Item | Value |
| --- | --- |
| Library | i18next + react-i18next |
| Languages | French (default), English |
| Persistence | `localStorage` key `i18nextLng` |
| UI strings | `src/i18n/fr.ts` / `src/i18n/en.ts` |
| Type contract | `src/i18n/types.ts` → `Translations` interface |
| Bootstrap | `src/i18n/setup.ts` imported in `main.tsx` |

Data in `cv.json` uses `_en` suffix fields for bilingual content (e.g. `title` / `title_en`, `description` / `description_en`).

---

## 🎨 Theme

| Item | Value |
| --- | --- |
| Default | Dark |
| Toggle | `useTheme()` hook in `src/hooks/useTheme.tsx` |
| Storage | `localStorage` key `theme` |
| Anti-flicker | Inline script in `index.html` runs before React — applies `data-theme` on `<html>` immediately |

The anti-flicker script:

```html
<script>
  (function () {
    var t = localStorage.getItem('theme');
    var d = window.matchMedia('(prefers-color-scheme: dark)').matches;
    document.documentElement.setAttribute('data-theme', t || (d ? 'dark' : 'light'));
  })();
</script>
```

---

## 🚀 Getting Started

### 1 — Fill in your CV data

Edit `cv.json` at the project root. Replace all placeholder values.

Place your photo at `public/assets/photo.jpg`.

### 2 — Configure environment

```bash
cp .env.example .env
```

```env
VITE_GITHUB_OWNER=your-github-username
VITE_GITHUB_REPO=contact          # repo where contact issues will be created
APP_DOMAIN=resume.yourdomain.com
```

### 3 — Run locally

```bash
npm install
npm run dev    # http://localhost:3000
```

### Available commands

```bash
make dev           # npm run dev (Vite dev server)
make build         # npm run build (production build)
make lint          # pre-commit run --all-files
make test          # vitest run
make docker-dev    # docker compose up --build  (dev container)
make docker-prod   # docker compose with Traefik (production)
```

---

## 🐳 Docker

### Dockerfile — 3 stages (`docker/Dockerfile`)

| Stage | Base image | Output | Used for |
| --- | --- | --- | --- |
| `dev` | node:24-alpine3.21 | Vite dev server on port 3000 | Local dev via docker compose |
| `build` | node:24-alpine3.21 | `dist/` static files | Build artifact (CI intermediate) |
| `prod` | node:24-alpine3.21 + serve | Served static files | Production container |

### Single `docker-compose.yml` with profiles

A single compose file drives all environments. The active profile is set via `COMPOSE_PROFILES` in `.env`:

| Profile | Service | What it does |
| --- | --- | --- |
| `dev` | `resume` | Builds from source, Hot-reload file watching, binds port |
| `prod` | `resume-prod` | Pulls pre-built GHCR image, Traefik labels, `restart: unless-stopped` |

`.env.example`:
```env
COMPOSE_PROFILES=dev   # change to prod on the server
```

No `-f` flags needed — `docker compose up` reads the profile from the environment automatically.

### Commands

```bash
make docker-dev    # COMPOSE_PROFILES=dev  docker compose up --watch
make docker-prod   # COMPOSE_PROFILES=prod docker compose up -d
make docker-down   # docker compose down
make docker-clean  # docker compose down -v --rmi local
```

### Production deploy

On the server, `.env` has `COMPOSE_PROFILES=prod`. The CD pipeline runs:

```bash
COMPOSE_PROFILES=prod docker compose pull
COMPOSE_PROFILES=prod docker compose up -d --remove-orphans
```

Traefik handles TLS (Let's Encrypt) and HTTP → HTTPS redirect automatically via labels.

---

## 🔄 CI / CD

### CI pipeline (`.github/workflows/ci.yml`)

Triggered on every push and pull request:

1. `pre-commit run --all-files` — lint, gitleaks, prettier, csslint, eslint, actionlint
2. `tsc --noEmit` — type-check
3. `vitest run` — unit tests
4. `vite build` — production build check
5. `docker build` — Dockerfile smoke test

### CD pipeline (`.github/workflows/cd.yml`)

Triggered on push to `main`:

1. Build Docker image + push to GHCR (`ghcr.io/chrysa/resume`)
2. SSH into server → `docker compose pull` + `up -d` (base + prod layers)

### Dependabot (`.github/dependabot.yml`)

Automatic weekly PRs (every Monday) for:

- `npm` — Node.js dependencies
- `github-actions` — CI/CD actions versions
- `docker` — Dockerfile base image versions
- `pre-commit` — hook revisions

---

## 🗃️ File Structure

```
resume/
├── cv.json                          ← SINGLE SOURCE OF TRUTH — edit this
├── index.html                       ← Anti-flicker script + Google Fonts Inter
├── .env.example                     ← Environment variables template
├── Makefile                         ← dev / build / lint / test / docker targets
│
├── src/
│   ├── main.tsx                     ← Bootstrap: i18n init + React root
│   ├── App.tsx                      ← ThemeProvider > ProfileProvider > CVPage
│   │
│   ├── pages/
│   │   └── CVPage.tsx               ← One-page layout + ScrollProgress/Cursor/FloatingCTA
│   │
│   ├── components/
│   │   ├── cv/
│   │   │   ├── Hero.tsx             ← Parallax hero + profile tagline override
│   │   │   ├── ImpactMetrics.tsx    ← Animated countUp metrics
│   │   │   ├── ExperienceTimeline.tsx  ← Scroll-animated vertical timeline
│   │   │   ├── SkillsCloud.tsx      ← Filterable skill pills + hover tooltip
│   │   │   ├── ProjectsGrid.tsx     ← 3D tilt project cards
│   │   │   ├── EducationSection.tsx
│   │   │   ├── ContactSection.tsx   ← Final CTA section
│   │   │   └── Navbar.tsx           ← Sticky (appears on scroll), lang + theme toggle
│   │   ├── contact/
│   │   │   └── ContactModal.tsx     ← GitHub Issues / WhatsApp modal
│   │   └── ui/
│   │       ├── CustomCursor.tsx     ← Custom cursor (desktop only, hidden on touch)
│   │       ├── ScrollProgress.tsx   ← Top-of-page progress bar
│   │       └── FloatingCTA.tsx      ← Floating contact button (visible after 70% scroll)
│   │
│   ├── contexts/
│   │   └── ProfileContext.tsx       ← Reads ?profile= URL param, provides CvProfile
│   │
│   ├── data/
│   │   ├── profile.ts               ← Getters for cv.json + GITHUB_CONFIG + CONTACT_CONFIG
│   │   └── profiles.ts              ← PROFILES map (default / freelance / backend / fullstack)
│   │
│   ├── hooks/
│   │   ├── useTheme.tsx             ← ThemeProvider + useTheme() → { theme, toggle }
│   │   └── useCountUp.ts            ← Animated number count-up for metrics
│   │
│   ├── i18n/
│   │   ├── fr.ts                    ← French translations
│   │   ├── en.ts                    ← English translations
│   │   ├── types.ts                 ← Translations interface (TypeScript contract)
│   │   └── setup.ts                 ← i18next initialisation
│   │
│   ├── styles/
│   │   ├── tokens.css               ← CSS custom properties (colours, spacing, typography)
│   │   ├── globals.css              ← Reset, base styles, utilities
│   │   ├── components.css           ← Buttons, badges, tags, spinner
│   │   ├── sections.css             ← Hero, timeline, skills, projects, education, contact
│   │   ├── modal.css                ← Modal, form, tabs, WhatsApp panel
│   │   ├── animations.css           ← Custom cursor, scroll progress, floating CTA, tooltip
│   │   └── responsive.css           ← Mobile breakpoints
│   │
│   ├── types/
│   │   ├── index.ts                 ← MetricItem, Project, Skill
│   │   ├── linkedin.d.ts            ← LinkedInProfile, Position, Education
│   │   ├── github.d.ts              ← ContactFormData
│   │   └── profile.d.ts             ← CvProfile, CvProfileFilter
│   │
│   └── utils/
│       └── animations.ts            ← Framer Motion variants (fadeUp, stagger, scaleIn…)
│
├── docker/
│   └── Dockerfile                   ← 3-stage: dev / build / prod
├── docker-compose.yml               ← Base layer
├── docker-compose.override.yml      ← Dev layer (auto-applied)
├── docker-compose.prod.yml          ← Prod layer (Traefik)
│
└── .github/
    ├── workflows/
    │   ├── ci.yml                   ← Lint → type-check → test → build → docker check
    │   └── cd.yml                   ← Build + push to GHCR → SSH deploy
    └── dependabot.yml               ← npm + actions + docker + pre-commit (weekly)
```

---

## 🔒 Security

| Risk | Mitigation |
| --- | --- |
| Secrets in Vite bundle | Only `VITE_GITHUB_OWNER/REPO` are exposed (non-sensitive) |
| XSS via cv.json | All data rendered by React (auto-escaped), never via `innerHTML` |
| GitHub Issue URL injection | `encodeURIComponent()` applied to title and body |
| WhatsApp link injection | `encodeURIComponent()` on prefill text; number is hardcoded in `cv.json` |
| Secrets committed to git | gitleaks runs on every commit via pre-commit |
| Vulnerable dependencies | Dependabot weekly PRs + `npm audit` in CI |

---

## 📦 Environment Variables

```env
# ─── App ──────────────────────────────────────────────────────────────────
APP_PORT=3000
APP_DOMAIN=resume.chrysa.dev

# ─── Docker image ─────────────────────────────────────────────────────────
IMAGE=ghcr.io/chrysa/resume
IMAGE_TAG=latest

# ─── GitHub Issues (contact) ──────────────────────────────────────────────
VITE_GITHUB_OWNER=chrysa
VITE_GITHUB_REPO=contact

# ─── Optional ─────────────────────────────────────────────────────────────
# VITE_RATE_LIMIT_MAX=3
```

> All `VITE_*` variables are embedded into the static bundle by Vite. **Never put secrets here.**

---

## 🔗 Links

| Resource | URL |
| --- | --- |
| Repository | [github.com/chrysa/resume](https://github.com/chrysa/resume) |
| Live site | [resume.chrysa.dev](https://resume.chrysa.dev) |
| Issues / contact | [github.com/chrysa/resume/issues](https://github.com/chrysa/resume/issues) |
| GHCR image | `ghcr.io/chrysa/resume:latest` |
