# Document de Conception Technique — CV en ligne

**Version :** 3.0  
**Date :** 17 mars 2026  
**Statut :** Production  
**Repo :** https://github.com/chrysa/resume  
**URL prod :** https://resume.chrysa.dev

---

## 0. Vision design — CV persuasif (UX/Persuasion-first)

> **Axiome :** Un CV institutionnel est lu. Un CV persuasif est **ressenti**. L'objectif n'est pas de lister des faits mais de déclencher une émotion et une action (prise de contact).

### 0.1 Principes de persuasion appliqués (Cialdini)

| Principe | Application concrète |
|---|---|
| **Autorité** | Métriques d'impact en gros (ex : "×3 perf", "+40 % conversion"), logos des entreprises |
| **Preuve sociale** | Nombre de projets livrés, stars GitHub, témoignages |
| **Réciprocité** | Projets open source visibles, contenu gratuit |
| **Rareté / Urgence** | Badge "Disponible dès mai 2026" dynamique en hero |
| **Cohérence** | Timeline narrative : chaque expérience montre une progression logique |
| **Sympathie** | Photo, ton personnel à la 1ère personne, easter eggs discrets |

### 0.2 Structure narrative one-page

```
[Hero]          → Identité + tagline + disponibilité + CTA
[Impact]        → 3-4 métriques clés animées (countUp)
[Expériences]   → Timeline verticale avec résultats et badges tech
[Stack]         → Nuage de compétences interactif (hover = niveau + projets)
[Projets]       → Cards 3D tilt + lien + tags + impact
[Formation]     → Minimaliste
[Contact]       → CTA final + GitHub Issues OU WhatsApp direct
```

---

## 1. Stack technique

| Couche | Technologie | Version | Notes |
|---|---|---|---|
| Framework UI | React | 19 | Mode strict, hooks |
| Build | Vite | 7 | Dev server port 3000, path alias `@/→src/` |
| Langage | TypeScript | 5.9 | strict mode, noUncheckedIndexedAccess |
| Animations | Framer Motion | 12 | useInView, useScroll, useSpring, AnimatePresence |
| i18n | i18next + react-i18next | — | FR (défaut) + EN, localStorage persistence |
| Validation | Zod | 3 | Formulaire de contact |
| CSS | Custom properties | — | 100% CSS vanilla, dark/light via `[data-theme]` |
| Icônes | Bootstrap Icons | — | Font CSS |
| Linting | ESLint + Prettier | — | pré-commit enforced |
| Tests | Vitest | — | config vitest.config.ts |

---

## 2. Architecture des données

### 2.1 Source de vérité unique : `cv.json` (racine)

`cv.json` est le seul fichier à modifier pour mettre à jour le CV. Il est lu statiquement au build. Aucune API externe, aucune base de données.

**Structure :**
```
cv.json
├── basics          → nom, headline, photo, lieu, linkedin, disponibilité, contact
│   └── contact     → whatsapp (optionnel), whatsappPrefill (FR+EN)
├── metrics[]       → métriques d'impact (value, label FR+EN, sublabel FR+EN)
├── experience[]    → expériences (title FR+EN, company, dates, description FR+EN, technologies[])
├── education[]     → formations (school, degree FR+EN, fieldOfStudy FR+EN, années)
├── skills[]        → compétences (name, level 1-5, category)
└── projects[]      → projets (title FR+EN, description FR+EN, url, githubUrl, technologies[], impact FR+EN, stars)
```

### 2.2 Couche data : `src/data/profile.ts`

Fonctions getter qui lisent `cv.json` et appliquent la langue et les filtres de profil :

| Export | Signature | Usage |
|---|---|---|
| `getProfile` | `(lang, filter?) → LinkedInProfile` | Hero, ExperienceTimeline |
| `getAvailability` | `(lang) → { available, label, type }` | Hero (badge) |
| `getMetrics` | `(lang) → MetricItem[]` | ImpactMetrics |
| `getProjects` | `(lang, filter?) → Project[]` | ProjectsGrid |
| `getSkills` | `(filter?) → Skill[]` | SkillsCloud |
| `getExperiencesForTech` | `(techName, lang) → string[]` | SkillsCloud (tooltip) |
| `GITHUB_CONFIG` | constante | ContactModal (issues URL) |
| `CONTACT_CONFIG` | `{ whatsapp, whatsappPrefill(lang) }` | ContactModal (WhatsApp) |

---

## 3. Système multi-profils

### 3.1 Architecture

Le system permet de générer des CVs ciblés (freelance, backend, fullstack...) sans dupliquer les données. Il suffit d'envoyer une URL avec le bon paramètre.

```
URL: /?profile=<slug>
         ↓
ProfileContext (lit URLSearchParams)
         ↓
PROFILES[slug] → { filter: { skillCategories, experienceIndices, projectIndices } }
         ↓
getProfile(lang, filter) / getSkills(filter) / getProjects(lang, filter)
         ↓
Composants React (Hero, ExperienceTimeline, SkillsCloud, ProjectsGrid)
```

### 3.2 Profils disponibles (`src/data/profiles.ts`)

| Slug | URL | Contenu |
|---|---|---|
| `default` | `/` | CV complet (toutes sections) |
| `freelance` | `/?profile=freelance` | Stack frontend+backend+tools, tagline Freelance |
| `backend` | `/?profile=backend` | Stack backend+devops, tagline Architecte backend |
| `fullstack` | `/?profile=fullstack` | Stack complète, tagline Full Stack |

### 3.3 Ajouter un profil

1. Ajouter une entrée dans `src/data/profiles.ts` :
```typescript
monprofil: {
  slug: 'monprofil',
  label: 'Mon Profil',
  hero: { tagline: 'Mon tagline custom' },
  filter: {
    skillCategories: ['frontend'],
    experienceIndices: [0, 2],     // indices dans cv.json.experience
    projectIndices: [1],           // indices dans cv.json.projects
  },
},
```
2. L'URL `/?profile=monprofil` suffit — aucun autre changement nécessaire.

---

## 4. Internationalisation (i18n)

- **Bibliothèque :** i18next + react-i18next
- **Langues :** FR (défaut), EN
- **Persistence :** `localStorage` (clé `i18nextLng`)
- **Fichiers :** `src/i18n/fr.ts`, `src/i18n/en.ts`
- **Types :** `src/i18n/types.ts` (interface `Translations`)
- **Setup :** `src/i18n/setup.ts` → importé dans `main.tsx` avant le render

Toutes les chaînes UI sont dans les fichiers i18n. Les données métier (`cv.json`) ont leurs propres champs `_en` pour la traduction.

---

## 5. Contact

### 5.1 Via GitHub Issues (toujours disponible)

Le formulaire construit une URL GitHub Issues pré-remplie :
```
https://github.com/<VITE_GITHUB_OWNER>/<VITE_GITHUB_REPO>/issues/new
  ?title=[Contact] <sujet>
  &body=**De :** <nom>\n\n<message>
  &labels=contact
```
Le visiteur clique sur le lien et crée l'issue lui-même (connexion GitHub requise). Le token GitHub n'est **jamais** nécessaire côté serveur.

### 5.2 Via WhatsApp (optionnel)

Activé en renseignant `cv.json.basics.contact.whatsapp` avec un numéro international (`+336...`). Si vide, l'onglet WhatsApp est masqué.

Le lien généré :
```
https://wa.me/<numéro_sans_+>?text=<whatsappPrefill URL-encoded>
```

### 5.3 ContactModal (`src/components/contact/ContactModal.tsx`)

- Deux onglets (GitHub / WhatsApp) si WhatsApp configuré
- Validation Zod côté client (senderName min 2, subject min 5, message min 20-2000)
- GitHub : succès = URL d'issue préparée + bouton "Ouvrir sur GitHub"
- WhatsApp : bouton direct vers wa.me

---

## 6. Thème

- **Défaut :** dark
- **Toggle :** via `useTheme()` hook (`src/hooks/useTheme.tsx`)
- **Storage :** `localStorage` clé `theme`
- **Anti-flicker :** script inline dans `index.html` avant React — lit localStorage et applique `data-theme` sur `<html>` immédiatement

```html
<script>
  (function(){
    var t = localStorage.getItem('theme');
    var d = window.matchMedia('(prefers-color-scheme: dark)').matches;
    document.documentElement.setAttribute('data-theme', t || (d ? 'dark' : 'light'));
  })();
</script>
```

---

## 7. Structure des fichiers

```
resume/
├── cv.json                         ← SOURCE DE VÉRITÉ (à remplir)
├── index.html                      ← anti-flicker script + Google Fonts Inter
├── src/
│   ├── main.tsx                    ← bootstrap: i18n + React root
│   ├── App.tsx                     ← ThemeProvider > ProfileProvider > CVPage
│   ├── pages/
│   │   └── CVPage.tsx              ← layout one-page + ScrollProgress/Cursor/FloatingCTA
│   ├── components/
│   │   ├── cv/
│   │   │   ├── Hero.tsx            ← hero parallax + profile tagline override
│   │   │   ├── ImpactMetrics.tsx   ← métriques animées (countUp)
│   │   │   ├── ExperienceTimeline.tsx ← timeline scroll-animée
│   │   │   ├── SkillsCloud.tsx     ← compétences filtrables + tooltip
│   │   │   ├── ProjectsGrid.tsx    ← cards 3D tilt
│   │   │   ├── EducationSection.tsx
│   │   │   ├── ContactSection.tsx  ← CTA final
│   │   │   └── Navbar.tsx          ← sticky (apparaît au scroll), langue, thème
│   │   ├── contact/
│   │   │   └── ContactModal.tsx    ← modal GitHub Issues / WhatsApp
│   │   └── ui/
│   │       ├── CustomCursor.tsx    ← curseur personnalisé (desktop uniquement)
│   │       ├── ScrollProgress.tsx  ← barre de progression haut de page
│   │       └── FloatingCTA.tsx     ← bouton contact flottant (scroll > 70%)
│   ├── contexts/
│   │   └── ProfileContext.tsx      ← lit ?profile= URL param
│   ├── data/
│   │   ├── profile.ts              ← getters cv.json + GITHUB_CONFIG + CONTACT_CONFIG
│   │   └── profiles.ts             ← PROFILES map (default/freelance/backend/fullstack)
│   ├── hooks/
│   │   ├── useTheme.tsx            ← ThemeProvider + useTheme()
│   │   └── useCountUp.ts           ← countUp animé pour les métriques
│   ├── i18n/
│   │   ├── fr.ts                   ← traductions françaises
│   │   ├── en.ts                   ← traductions anglaises
│   │   ├── types.ts                ← interface Translations
│   │   └── setup.ts                ← init i18next
│   ├── styles/
│   │   ├── tokens.css              ← variables CSS (couleurs, spacing, typo)
│   │   ├── globals.css             ← reset, base, utilitaires
│   │   ├── components.css          ← boutons, badges, tags, spinner
│   │   ├── sections.css            ← hero, timeline, skills, projects, education, contact
│   │   ├── modal.css               ← modal, formulaire, onglets, WhatsApp
│   │   ├── animations.css          ← cursor, scroll-progress, floating-cta, skill-tooltip
│   │   └── responsive.css          ← breakpoints mobile
│   ├── types/
│   │   ├── index.ts                ← MetricItem, Project, Skill
│   │   ├── linkedin.d.ts           ← LinkedInProfile, Position, Education
│   │   ├── github.d.ts             ← ContactFormData
│   │   └── profile.d.ts            ← CvProfile, CvProfileFilter
│   └── utils/
│       └── animations.ts           ← variants Framer Motion (fadeUp, stagger, scaleIn...)
├── docker/
│   └── Dockerfile                  ← 3 stages: dev / build / prod (serve)
├── docker-compose.yml              ← base (image, healthcheck)
├── docker-compose.override.yml     ← dev (build + watch + volumes) — auto-appliqué
├── docker-compose.prod.yml         ← prod (Traefik labels, restart)
├── .github/
│   ├── workflows/
│   │   ├── ci.yml                  ← pre-commit → lint → type-check → test → build → docker-check
│   │   └── cd.yml                  ← push main → GHCR build+push → SSH deploy
│   └── dependabot.yml              ← npm + github-actions + docker + pre-commit (lundi)
├── .pre-commit-config.yaml         ← chrysa/pre-commit-tools, prettier, csslint, eslint, gitleaks
├── Makefile                        ← targets: dev, build, docker-dev, docker-prod, lint, test
├── CHANGELOG.md
└── .env.example                    ← APP_PORT, APP_DOMAIN, IMAGE, VITE_GITHUB_OWNER/REPO
```

---

## 8. Variables d'environnement

```env
# App
APP_PORT=3000
APP_DOMAIN=resume.chrysa.dev

# Docker image
IMAGE=ghcr.io/chrysa/resume
IMAGE_TAG=latest

# GitHub Issues (contact)
VITE_GITHUB_OWNER=chrysa
VITE_GITHUB_REPO=contact

# Optionnel
# VITE_RATE_LIMIT_MAX=3
```

> **Note :** Toutes les variables `VITE_*` sont intégrées au bundle statique (Vite). Ne jamais y mettre de secrets.

---

## 9. Docker

### 9.1 Dockerfile 3-stage (`docker/Dockerfile`)

| Stage | Base | Output | Usage |
|---|---|---|---|
| `dev` | node:22-alpine | Vite dev server | `docker compose up` (override auto) |
| `build` | node:22-alpine | `dist/` | Intermédiaire CI |
| `prod` | node:22-alpine + serve | Fichiers statiques servis | `docker compose -f docker-compose.yml -f docker-compose.prod.yml up` |

### 9.2 Docker Compose 3 couches

- **`docker-compose.yml`** (base) — image, healthcheck. Ne pas utiliser seul.
- **`docker-compose.override.yml`** (dev) — `build:`, volumes, ports 3000:3000. Auto-appliqué par `docker compose up`.
- **`docker-compose.prod.yml`** (prod) — Traefik labels (TLS Let's Encrypt, HTTP→HTTPS redirect), `restart: unless-stopped`.

### 9.3 Commandes

```bash
make dev           # npm run dev (local)
make docker-dev    # docker compose up --build (override auto)
make docker-prod   # docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d
make build         # npm run build
make lint          # pre-commit run --all-files
make test          # vitest run
```

---

## 10. CI/CD

### 10.1 Pipeline CI (`.github/workflows/ci.yml`)

Déclenché sur chaque push/PR :
1. `pre-commit run --all-files` (lint, gitleaks, prettier, csslint, eslint)
2. `tsc --noEmit` (type-check)
3. `vitest run` (tests)
4. `vite build` (build check)
5. `docker build` (smoke test Dockerfile)

### 10.2 Pipeline CD (`.github/workflows/cd.yml`)

Déclenché sur push `main` :
1. Build image Docker + push sur GHCR (`ghcr.io/chrysa/resume`)
2. SSH sur le serveur → `docker compose pull` + `up -d` (base + prod)

### 10.3 Dependabot (`.github/dependabot.yml`)

Mises à jour automatiques chaque lundi pour :
- `npm` (dépendances Node)
- `github-actions` (actions CI/CD)
- `docker` (base images Dockerfile)
- `pre-commit` (hooks versions)

---

## 11. Sécurité

| Risque | Mitigation |
|---|---|
| Secrets dans le bundle Vite | Seules les vars `VITE_GITHUB_OWNER/REPO` sont exposées (non sensibles) |
| XSS via cv.json | Données affichées en React (auto-escape), jamais en innerHTML |
| Injection dans l'URL GitHub Issue | `encodeURIComponent()` sur title + body |
| Lien WhatsApp | `encodeURIComponent()` sur le prefill, numéro hardcodé dans cv.json |
| Secrets dans le code | gitleaks via pre-commit à chaque commit |
| Dépendances vulnérables | Dependabot weekly + npm audit dans CI |

---

## 12. Prise en main rapide

### Remplir le CV

1. Éditer `cv.json` à la racine (tous les champs `VOTRE_*`)
2. Placer une photo dans `public/assets/photo.jpg`
3. `npm run dev` → http://localhost:3000

### Créer un profil ciblé

Ajouter une entrée dans `src/data/profiles.ts` → accessible via `/?profile=<slug>`.

### Activer WhatsApp

Renseigner `cv.json > basics > contact > whatsapp` avec un numéro international.
Laisser vide pour masquer l'onglet WhatsApp dans le modal de contact.

### Déployer

```bash
cp .env.example .env        # remplir APP_DOMAIN, VITE_GITHUB_OWNER/REPO
make docker-prod            # ou : docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

