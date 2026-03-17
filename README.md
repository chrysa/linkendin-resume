<div align="center">

# CV Online — Portfolio Persuasif

**Un CV qui se démarque. Dark theme · One-page · Animations · Contact GitHub Issues.**

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white&style=flat-square)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white&style=flat-square)](https://typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-7-646CFF?logo=vite&logoColor=white&style=flat-square)](https://vitejs.dev)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-12-FF0055?logo=framer&logoColor=white&style=flat-square)](https://www.framer.com/motion)
[![Docker](https://img.shields.io/badge/Docker-ready-2496ED?logo=docker&logoColor=white&style=flat-square)](https://hub.docker.com)
[![CI](https://github.com/chrysa/resume/actions/workflows/ci.yml/badge.svg)](https://github.com/chrysa/resume/actions/workflows/ci.yml)
[![Licence MIT](https://img.shields.io/badge/Licence-MIT-green?style=flat-square)](LICENSE)

[Demo live →](https://resume.chrysa.dev) · [Signaler un bug](../../issues) · [Proposer une amélioration](../../issues/new)

</div>

---

## Pourquoi ce projet ?

Les CV en ligne classiques ressemblent à des PDF en ligne. Ce projet prend le contre-pied :

| CV classique | Ce projet |
|---|---|
| Blanc, institutionnel | Dark theme, identité forte |
| Liste de tâches | Résultats chiffrés, impact visible |
| Navigation statique | Animations au scroll, micro-interactions |
| Formulaire email → spam | Contact via GitHub Issues — traçable |
| Source de données dispersée | Données centralisées dans `src/data/profile.ts` |

L'objectif : appliquer les **principes de persuasion de Cialdini** (autorité, preuve sociale, réciprocité) dans le design d'un portfolio.

---

## Stack

| Couche | Technologie |
|---|---|
| Framework | React 19 + Vite 7 |
| Langage | TypeScript 5.9 (strict) |
| Animations | Framer Motion 12 |
| Validation | Zod 3 |
| Style | CSS custom properties (100% vanilla, zéro framework) |
| Tests | Vitest + Testing Library |
| Hébergement | Vercel (recommandé) |

---

## Démarrage rapide

### Prérequis

- Node.js ≥ 20 · npm ≥ 10 · Python ≥ 3.13 (pre-commit)
- Docker ≥ 26 + Docker Compose ≥ 2.27 (optionnel)

### Installation

```bash
git clone https://github.com/chrysa/resume.git
cd resume
make install
make pre-commit-install  # installe les hooks git
```

### Configuration

```bash
cp .env.example .env
```

Éditez `.env` avec vos valeurs :

```env
APP_PORT=3000
APP_DOMAIN=resume.chrysa.dev
VITE_GITHUB_OWNER=chrysa
VITE_GITHUB_REPO=contact
```

> Le système de contact génère un lien pré-rempli vers GitHub Issues. Le visiteur doit être connecté à GitHub. Aucun token côté client.

### Développement local

```bash
make dev          # Vite dev server → http://localhost:3000
make test         # Tests unitaires
make ci           # lint + type-check + test + build
```

### Développement via Docker

```bash
make docker-dev   # docker compose up --watch (hot-reload, override.yml auto-appliqué)
```

---

## Docker

Le projet fournit trois stages dans [`docker/Dockerfile`](docker/Dockerfile) :

| Stage  | Base              | Usage                        |
|--------|-------------------|------------------------------|
| `dev`  | node:24-alpine    | Vite dev server              |
| `build`| node:24-alpine    | Compilation TypeScript/Vite  |
| `prod` | node:24-alpine    | `serve -s dist` (statique)   |

La configuration Docker Compose est découpée en couches :

| Fichier                      | Rôle                                          |
|------------------------------|-----------------------------------------------|
| `docker-compose.yml`         | Base commune (healthcheck, image)             |
| `docker-compose.override.yml`| Dev — hot-reload, volumes bind (auto-appliqué)|
| `docker-compose.prod.yml`    | Prod — labels Traefik, restart               |

```bash
# Dev
make docker-dev

# Prod (sur le serveur)
make docker-prod
# équivalent à :
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

---

## CI/CD

| Workflow      | Déclencheur        | Étapes                                            |
|---------------|--------------------|---------------------------------------------------|
| `ci.yml`      | push/PR main+dev   | pre-commit · lint · type-check · test · build · docker build check |
| `cd.yml`      | push main          | Build + push GHCR · deploy SSH                   |

### Secrets requis dans GitHub

| Secret           | Description                                   |
|------------------|-----------------------------------------------|
| `DEPLOY_HOST`    | IP ou hostname du serveur                    |
| `DEPLOY_USER`    | Utilisateur SSH                              |
| `DEPLOY_SSH_KEY` | Clé privée SSH (Ed25519 recommandé)          |

### Dependabot

Mises à jour automatiques configurées pour : `npm`, `github-actions`, `docker`, `pre-commit`.

---

## Déploiement sur le serveur (Traefik)

Sur le serveur, cloner le repo et lancer :

```bash
git clone https://github.com/chrysa/resume.git /srv/resume
cd /srv/resume
cp .env.example .env  # éditer APP_DOMAIN, IMAGE_TAG
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

Traefik détecte automatiquement les labels et génère le certificat Let's Encrypt.

---

## Personnalisation

Toutes les données du CV sont centralisées dans **un seul fichier** :

```
src/data/profile.ts
```

Modifiez-y :

- `PROFILE` — vos infos, expériences, formations, compétences
- `METRICS` — vos 4 métriques d'impact (les chiffres qui impressionnent)
- `PROJECTS` — vos projets mis en avant
- `SKILLS` — votre stack avec niveaux (1→5)
- `AVAILABILITY` — votre badge de disponibilité

### Variables de design

Tout le design system est dans `src/styles/tokens.css` :

```css
--clr-accent-1: #7c3aed;   /* Couleur principale */
--clr-accent-2: #06b6d4;   /* Couleur secondaire */
```

Changez ces deux valeurs pour adapter l'identité visuelle en 30 secondes.

---

## Structure du projet

```
src/
├── data/
│   └── profile.ts          ← Toutes vos données CV ici
├── components/
│   ├── cv/
│   │   ├── Hero.tsx          Hero + badge disponibilité
│   │   ├── ImpactMetrics.tsx 4 métriques chiffrées
│   │   ├── ExperienceTimeline.tsx
│   │   ├── SkillsCloud.tsx   Stack interactif (hover = niveau)
│   │   ├── ProjectsGrid.tsx  Projets avec impact
│   │   ├── EducationSection.tsx
│   │   ├── ContactSection.tsx CTA final
│   │   └── Navbar.tsx        Sticky, apparaît au scroll
│   └── contact/
│       └── ContactModal.tsx  Formulaire → GitHub Issue
├── pages/
│   └── CVPage.tsx
├── styles/
│   ├── tokens.css            Design tokens
│   ├── globals.css           Reset + utilitaires
│   ├── sections.css          Styles par section
│   ├── modal.css
│   └── responsive.css        Breakpoints + print
└── types/
    ├── linkedin.d.ts
    └── github.d.ts
```

---

## Scripts disponibles

```bash
make dev            # Dev server (port 3000)
make build          # Build production
make lint           # ESLint
make type-check     # Vérification TypeScript
make test           # Tests unitaires (Vitest)
make test-coverage  # Coverage
make ci             # Tous les checks CI en local
make docker-dev     # Dev container avec hot-reload
make docker-prod    # Stack prod (base + prod overrides)
make help           # Liste toutes les commandes
```

---

## Déploiement sur le serveur

Voir la section [CI/CD](#cicd) ci-dessus.

---

## Principes UX/Persuasion appliqués

- **Autorité** — chiffres d'impact bien visibles, logos d'entreprises connues
- **Preuve sociale** — projets GitHub avec étoiles, témoignages
- **Rareté** — badge "Disponible dès X" dynamique en hero
- **Réciprocité** — projets open source accessibles directement
- **Sympathie** — ton personnel, photo, ton à la 1ère personne
- **Cohérence** — timeline narrative avec progression logique

---

## Contribuer

1. Fork
2. `git checkout -b feat/ma-feature`
3. `git commit -m 'feat: description'`
4. `git push origin feat/ma-feature`
5. Ouvrez une Pull Request

---

## Licence

MIT — Libre d'utilisation, de modification et de distribution.

---

<div align="center">

Fait avec React & ☕ · [⭐ Stargazez si utile](../../stargazers)

</div>
