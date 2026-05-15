# 📄 Resume — Technical Documentation

> **Repo:** [github.com/chrysa/linkendin-resume](https://github.com/chrysa/linkendin-resume) · **Live:** [resume.chrysa.dev](https://resume.chrysa.dev)
> **Stack:** React 19 · Vite 8 · TypeScript 5.9 · Framer Motion 12 · i18next · Docker

---

## 📌 Overview

This is a **persuasion-first online CV** — not an institutional PDF replica, but an interactive one-page experience designed to trigger emotion and action.

The design applies **Cialdini's principles of influence**:

| Principle | Implementation |
| --- | --- |
| **Authority** | Large impact metrics ("×3 perf", "+40% conversion"), company names, live GitHub graph |
| **Social proof** | Projects shipped count, GitHub stars, visible open-source work |
| **Reciprocity** | Public projects and code freely available |
| **Scarcity / Urgency** | Dynamic "Available from May 2026" badge in the hero |
| **Consistency** | Narrative timeline — each role shows a logical career progression |
| **Liking** | Personal photo, first-person tone, easter eggs, Ask Me widget |

### Page structure

```
Hero          →  Identity + tagline + glitch headline + availability badge + lang/GitHub CTAs
Impact        →  3 animated key metrics (countUp)
Experience    →  Scroll-animated vertical timeline with tech badges
Stack         →  Filterable skill cloud (hover = level + linked projects)
Projects      →  Static 3D tilt cards + live GitHub repos + contribution graph
Education     →  Minimal
Contact       →  Final CTA + GitHub Issues OR WhatsApp direct link

Overlays (always mounted, conditionally visible):
  AccessibilityPanel   →  Font size · High contrast · Dyslexia font · Reduced motion
  AskMeWidget          →  Floating chat button powered by cv.json
  CommandPalette       →  ⌘K / Ctrl+K — navigation + actions + appearance
  TerminalEasterEgg    →  Backtick ` — macOS terminal with 9 CV commands
```

---

## ⚙️ Tech Stack

| Layer | Technology | Version | Notes |
| --- | --- | --- | --- |
| UI Framework | React | 19 | Strict mode, hooks only |
| Build tool | Vite | 8 | Dev server port 3000, `@/` → `src/` alias |
| Language | TypeScript | 5.9 | strict mode |
| Animations | Framer Motion | 12 | useInView, useScroll, useSpring, AnimatePresence |
| i18n | i18next + react-i18next | — | FR (default) + EN, localStorage persistence |
| Form validation | Zod | 3 | Contact form |
| CSS | Custom properties | — | 100% vanilla CSS, dark/light via `[data-theme]` |
| Icons | Bootstrap Icons | — | CSS font |
| Linting | ESLint + Prettier | — | Enforced by pre-commit |
| Tests | Vitest | — | `vitest.config.ts` — 116 tests |

---

## 🗂️ Data Architecture

### Single source of truth: `cv.json`

`cv.json` (at the project root) is the **only file you need to edit** to update your CV. It is read statically at build time — no external API, no database.

```
cv.json
├── basics
│   ├── firstName, lastName, headline, summary
│   ├── photoUrl, location, linkedinUrl, githubUrl   ← githubUrl added
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

> `basics.githubUrl` drives the GitHub button in the Hero section. When present, a GitHub icon link appears next to the lang toggle.

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

## 🪟 Interactive Overlays

Four overlay components are always mounted in `CVPage.tsx` and render conditionally based on user interaction.

---

### Terminal Easter Egg (`TerminalEasterEgg.tsx`)

| Property | Value |
| --- | --- |
| Trigger | Backtick `` ` `` (not when focus is in an input/textarea) |
| Close | `Escape` or typing `exit` |
| Style | macOS-style window — red/yellow/green traffic-light buttons |

Available commands:

| Command | Output |
| --- | --- |
| `whoami` | Name + current role |
| `help` | Lists all commands |
| `git log` | Last 5 "commits" pulled from experience |
| `ls projects` | Project titles |
| `cat cv.json` | Formatted JSON extract of basics |
| `skills` | Top skills list |
| `contact` | Opens the contact modal |
| `clear` | Clears terminal output |
| `exit` | Closes the terminal |

Supports command history via ArrowUp/ArrowDown.

---

### Command Palette (`CommandPalette.tsx`)

| Property | Value |
| --- | --- |
| Trigger | `⌘K` (macOS) or `Ctrl+K` (Windows/Linux) |
| Close | `Escape` |
| Props | `{ onContactClick: () => void }` |

Command groups:

| Group | Commands |
| --- | --- |
| Navigation | Scroll to Hero, Metrics, Experience, Skills, Projects, Contact |
| Actions | Open contact modal, Open LinkedIn, Open GitHub, Print / save PDF |
| Appearance | Switch to FR / EN, Switch to Dark / Light theme |

Fuzzy filtering on label + group + keywords. Keyboard navigation via ArrowUp / ArrowDown / Enter.

---

### Accessibility Panel (`AccessibilityPanel.tsx`)

| Property | Value |
| --- | --- |
| Trigger | `♿` button fixed at bottom-right (above Ask Me) |
| Storage | `localStorage` key `a11y-prefs` |

Preferences interface:

```typescript
interface A11yPrefs {
  fontSize: number;       // -2 to +4 steps, applied as --a11y-font-offset on <html>
  highContrast: boolean;  // sets data-high-contrast="true" on <html>
  dyslexiaFont: boolean;  // sets data-dyslexia="true" on <html>
  reducedMotion: boolean; // sets data-reduced-motion="true" on <html>
}
```

CSS dataset hooks in `tokens.css`:

```css
[data-high-contrast='true'] { /* white-on-black palette overrides */ }
[data-dyslexia='true']      { --font-sans: 'OpenDyslexic', sans-serif; }
[data-reduced-motion='true'] { /* removes all transitions/animations */ }
```

Global font scale in `globals.css`:

```css
body { font-size: calc(1rem + var(--a11y-font-offset, 0px)); }
```

---

### Ask Me Widget (`AskMeWidget.tsx`)

| Property | Value |
| --- | --- |
| Trigger | `✦` gradient button fixed at bottom-right |
| Close | Click button again |
| Knowledge base | `cv.json` (loaded at build time — no external API) |

The widget is a **rule-based responder** — no LLM, no API key. It matches the user's message against regex categories and returns a formatted answer:

| Category | Regex trigger keywords |
| --- | --- |
| Experience | `expérience`, `experience`, `ans`, `years` |
| Skills | `compétence`, `skill`, `techno`, `stack` |
| Projects | `projet`, `project` |
| Availability | `disponible`, `available`, `freelance` |
| Location | `lieu`, `location`, `remote`, `ville` |
| Education | `formation`, `diplôme`, `education`, `degree` |
| Contact | `contact`, `email`, `recrut` |

Simulates a typing delay (600–1000 ms) with an animated three-dot indicator.

---

## 🐙 Live GitHub Repos (`useGitHubRepos.ts`)

`ProjectsGrid` renders a second grid of live GitHub repos alongside the static `cv.json` project cards.

**Hook signature:**

```typescript
function useGitHubRepos(owner: string): {
  repos: GitHubRepo[];
  loading: boolean;
  error: string | null;
}
```

**Endpoint:** `https://api.github.com/users/${owner}/repos?type=public&sort=pushed&per_page=12`

- Filters archived repos (`archived: false`)
- Uses `AbortController` for cleanup on unmount
- Owner is read from `VITE_GITHUB_OWNER` env variable

**GitHub contribution graph** is embedded as an `<img>` from `https://ghchart.rshah.org/${owner}` (public, no token required).

---

## ✨ Role Glitch Cycling (Hero)

`GlitchHeadline` is an inline sub-component in `Hero.tsx`. Every 5 seconds it:

1. Fades out the current headline via `AnimatePresence`
2. Applies a `@keyframes glitch` CSS animation on entry
3. Cycles to the next headline from the list

The list is derived from the `basics.headline` field in `cv.json`.

---

## 🖨️ Print / PDF Mode

Triggered by:
- Clicking the printer icon in the Navbar
- Selecting "Print / PDF" in the Command Palette (⌘K)

Both call `globalThis.print()`.

The `@media print` block in `components.css` hides all interactive elements:

```css
@media print {
  .navbar, .a11y-panel, .terminal, .palette,
  .askme-widget, .floating-cta, .scroll-progress { display: none !important; }
  /* clean A4-friendly layout for remaining content */
}
```

---

## 📬 Contact Channels

### GitHub Issues (always available)

The contact form builds a pre-filled GitHub Issues URL:

```
https://github.com/<VITE_GITHUB_OWNER>/<VITE_GITHUB_REPO>/issues/new
  ?title=[Contact] <subject>
  &body=**From:** <name>%0A%0A<message>
  &labels=contact,<auto-detected-label>
```

**Smart label detection** — the contact message is analysed at the moment of submission. A secondary label is appended based on the content:

| Detected content | Label added |
| --- | --- |
| `freelance`, `mission`, `contrat` | `freelance` |
| `CDI`, `CDD`, `poste`, `offre`, `emploi` | `job-offer` |
| `collaboration`, `partenariat`, `associé` | `collaboration` |
| `bug`, `erreur`, `problème` | `bug` |
| `question`, `renseignement`, `info` | `question` |
| *(no match)* | no secondary label |

No GitHub token needed — the app is fully static.

### WhatsApp (optional)

Enable by filling `cv.json → basics → contact → whatsapp` with an international number (`+336…`). Leave empty to hide the WhatsApp tab entirely.

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

Data in `cv.json` uses `_en` suffix fields for bilingual content (e.g. `title` / `title_en`).

### New i18n key groups (added in v1.1)

| Key group | Purpose |
| --- | --- |
| `a11y.*` | Accessibility panel labels (fontSize, highContrast, dyslexia, reducedMotion) |
| `palette.*` | Command palette placeholder + group headers |
| `askme.*` | Ask Me widget title, placeholder, typing indicator |
| `sections.projects.liveTitle` | Heading for live GitHub repos subsection |
| `sections.projects.contributionGraph` | Alt text for contribution graph image |

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
│   │   └── CVPage.tsx               ← One-page layout + all overlays registered here
│   │
│   ├── components/
│   │   ├── cv/
│   │   │   ├── Hero.tsx             ← Parallax hero + glitch headline + GitHub/lang buttons
│   │   │   ├── ImpactMetrics.tsx    ← Animated countUp metrics
│   │   │   ├── ExperienceTimeline.tsx  ← Scroll-animated vertical timeline
│   │   │   ├── SkillsCloud.tsx      ← Filterable skill pills + hover tooltip
│   │   │   ├── ProjectsGrid.tsx     ← Static 3D tilt cards + live GitHub repos + graph
│   │   │   ├── EducationSection.tsx
│   │   │   ├── ContactSection.tsx   ← Final CTA section
│   │   │   └── Navbar.tsx           ← Sticky, lang + theme + print button
│   │   ├── contact/
│   │   │   └── ContactModal.tsx     ← GitHub Issues (smart labels) / WhatsApp modal
│   │   └── ui/
│   │       ├── CustomCursor.tsx     ← Custom cursor (desktop only)
│   │       ├── ScrollProgress.tsx   ← Top-of-page progress bar
│   │       ├── FloatingCTA.tsx      ← Floating contact button (after 70% scroll)
│   │       ├── AccessibilityPanel.tsx  ← NEW: font size / contrast / dyslexia / motion
│   │       ├── TerminalEasterEgg.tsx   ← NEW: backtick-triggered macOS terminal
│   │       ├── CommandPalette.tsx      ← NEW: ⌘K palette (nav/actions/appearance)
│   │       └── AskMeWidget.tsx         ← NEW: rule-based CV chat assistant
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
│   │   ├── useCountUp.ts            ← Animated number count-up for metrics
│   │   └── useGitHubRepos.ts        ← NEW: fetch public repos from GitHub API
│   │
│   ├── i18n/
│   │   ├── fr.ts                    ← French translations (a11y/palette/askme added)
│   │   ├── en.ts                    ← English translations (a11y/palette/askme added)
│   │   ├── types.ts                 ← Translations interface (TypeScript contract)
│   │   └── setup.ts                 ← i18next initialisation
│   │
│   ├── styles/
│   │   ├── tokens.css               ← CSS custom properties + a11y dataset overrides
│   │   ├── globals.css              ← Reset, base styles, a11y font offset
│   │   ├── components.css           ← Buttons, badges + all new components CSS + @media print
│   │   ├── sections.css             ← Hero, timeline, skills, projects, education, contact
│   │   ├── modal.css                ← Modal, form, tabs, WhatsApp panel
│   │   ├── animations.css           ← Cursor, scroll progress, floating CTA, tooltip
│   │   └── responsive.css           ← Mobile breakpoints
│   │
│   ├── types/
│   │   ├── index.ts                 ← MetricItem, Project, Skill
│   │   ├── linkedin.d.ts            ← LinkedInProfile (githubUrl added), Position, Education
│   │   ├── github.d.ts              ← ContactFormData, GitHubRepo
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
