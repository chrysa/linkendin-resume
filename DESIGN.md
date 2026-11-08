# linkendin-resume — Design contract

> Contract for the one-page online CV in `app/`. Fleet rules live in the canon (*Design
> system*), the method in `shared-standards/docs/DESIGN-CONTRACT.md`. The brand theme (palette,
> type, signature element, IA rationale, contrast ratios) is specified in
> [app/DESIGN.md](app/DESIGN.md) and its brief in [app/BRAND-BRIEF.md](app/BRAND-BRIEF.md); they
> are not repeated here.
>
> Status: **[implemented]** links the code · **[decided]** names the decision · **[proposed]**
> is not agreed. This file documents the current site; it does not redesign it.

## 1. Surface and status

- **Surface:** public web site — React 19 + Vite single page, no backend. **[implemented]**
  ([app/src/pages/CVPage.tsx](app/src/pages/CVPage.tsx))
- **Lifecycle:** shipped (custom domain in [app/public/CNAME](app/public/CNAME)); fleet status
  `dev`, still evolving.
- **Detailed specs:** [app/DESIGN.md](app/DESIGN.md) (brand theme) ·
  [app/BRAND-BRIEF.md](app/BRAND-BRIEF.md) (brief, marked as a direction proposal).

## 2. Users, devices and priority tasks

| User | Context and device | Priority tasks |
| ---- | ------------------ | -------------- |
| Recruiter, CTO, prospective client | Desktop/laptop while sourcing; a mobile minority from a shared link; FR or EN; under a minute | 1. judge seniority and fit · 2. contact the candidate · 3. print or save the CV |

Primary action: **Contact** (one accent-filled CTA); print stays secondary. **[implemented]**

## 3. Journeys and navigation

- **J1 — Skim and contact:** hero → impact metrics → experience → skills → projects →
  education → contact; *Contact* opens a modal form validated with Zod; submit opens a
  pre-filled GitHub issue in a new tab. Failure: errors under each field, input kept.
  **[implemented]** ([ContactModal.tsx](app/src/components/contact/ContactModal.tsx))
- **J2 — Targeted send:** `/?profile=<slug>` filters skills, experience and projects.
  **[implemented]** ([ProfileContext.tsx](app/src/contexts/ProfileContext.tsx))
- **J3 — Power navigation:** ⌘K / Ctrl+K command palette (sections, theme, language, print);
  `` ` `` opens a terminal easter egg; an "Ask me" widget answers from `cv.json` locally.
  **[implemented]** ([CommandPalette.tsx](app/src/components/ui/CommandPalette.tsx),
  [TerminalEasterEgg.tsx](app/src/components/ui/TerminalEasterEgg.tsx),
  [AskMeWidget.tsx](app/src/components/ui/AskMeWidget.tsx))
- **Information architecture:** one scrolling page of seven numbered sections; the navbar
  appears after 60 px of scroll ([Navbar.tsx](app/src/components/cv/Navbar.tsx)); floating
  CTA and accessibility panel. Content comes from [app/cv.json](app/cv.json).
- **Density:** comfortable but data-dense — see [app/DESIGN.md](app/DESIGN.md).

## 4. Identity

"Engineering logbook" brand theme, own identity (no persona). **[implemented]**
([app/src/styles/tokens.css](app/src/styles/tokens.css)). Rationale and signature element:
[app/DESIGN.md](app/DESIGN.md). **Drift:** the latest ADR, D-0003 in
[DECISIONS.md](DECISIONS.md), records the Editorial persona (amber, Fraunces); no ADR records
the switch to the logbook theme, and the brief calls itself a proposal.

## 5. Tokens and components (owned elsewhere)

| Concern | Source of truth | Rules of use |
| ------- | --------------- | ------------ |
| Semantic contract | [app/src/styles/contract.css](app/src/styles/contract.css) | imported first by `tokens.css` |
| Colour, type, shape, motion values | [app/src/styles/tokens.css](app/src/styles/tokens.css) | brand values; local `--clr-*` names alias the contract |
| Layout and sections | [sections.css](app/src/styles/sections.css), [responsive.css](app/src/styles/responsive.css) | logbook rail; 600/900 px breakpoints; print sheet |
| Motion | [animations.css](app/src/styles/animations.css), [animations.ts](app/src/utils/animations.ts), `framer-motion` | calm ease-out, no spring |
| Components | [app/src/components/](app/src/components/) (`cv/`, `ui/`, `contact/`) | vanilla CSS classes; no `@chrysa/ui` |

- **Shared contract:** `contract.css` imported: yes. `@chrysa/ui`: not used. **[implemented]**

## 6. Interaction and states

- **Component states:** global `:focus-visible` outline in the accent
  ([globals.css](app/src/styles/globals.css)); error style on invalid inputs.
- **Action feedback:** contact success shows a `role="status"` panel with the issue link.
- **Forms:** visible labels; Zod errors under the field; input kept. Messages are hard-coded
  French and not linked with `aria-describedby` / `aria-invalid`.
- **Data states:**

  | State | Where it appears | Behaviour |
  | ----- | ---------------- | --------- |
  | Loading | live GitHub repos | six skeleton cards ([ProjectsGrid.tsx](app/src/components/cv/ProjectsGrid.tsx)) |
  | Empty | live GitHub repos | the sub-section is hidden |
  | Error | live GitHub repos | the sub-section is hidden silently; no message or retry |
  | Offline / unreachable | GitHub API | same as error; static content unaffected |
  | Stale / reconnect | — | not applicable: static content, one fetch on load |

- **Demo mode:** fixtures replace the GitHub call and a banner says so
  ([DemoBanner.tsx](app/src/components/ui/DemoBanner.tsx)). **[implemented]**
- **Motion:** sections fade in on scroll (`framer-motion`); hero headline cycles every 5 s with
  a 400 ms glitch ([Hero.tsx](app/src/components/cv/Hero.tsx)). CSS honours
  `prefers-reduced-motion` and the panel's `data-reduced-motion`; no `MotionConfig` or
  `useReducedMotion` gates the JS-driven animations.

## 7. Responsive and support conventions

Breakpoints at 600 and 900 px; the rail collapses to a tick on mobile; `@media print` renders
an A4 CV without interactive chrome. Custom cursor disabled on `hover: none` devices.
**[implemented]** ([responsive.css](app/src/styles/responsive.css),
[CustomCursor.tsx](app/src/components/ui/CustomCursor.tsx))

## 8. Accessibility

- **Target:** WCAG 2.1 AA. Contrast ratios are recorded in [app/DESIGN.md](app/DESIGN.md); not
  re-measured here.
- **Keyboard:** skip link ([app/index.html](app/index.html)); modal with focus trap and
  Escape; palette and terminal close on Escape.
- **Perception:** accessibility panel — font size, high contrast, dyslexia font, reduced motion,
  persisted in `localStorage` ([AccessibilityPanel.tsx](app/src/components/ui/AccessibilityPanel.tsx)).
- **Assistive technology:** `html lang` follows the language
  ([useDocumentMeta.ts](app/src/hooks/useDocumentMeta.ts)); dialogs carry `role="dialog"`.

## 9. Assets

| Asset | Source or generator | Author | Licence and attribution | Permitted use | Formats and variants | Location |
| ----- | ------------------- | ------ | ----------------------- | ------------- | -------------------- | -------- |
| Spectral, Inter, JetBrains Mono | Google Fonts CSS link | type designers | unknown in repo (no licence file recorded) | web site | remote WOFF2, hotlinked | [app/index.html](app/index.html) |
| OpenDyslexic | named in `tokens.css` only | — | unknown; not shipped | dyslexia mode | none: falls back to the system | — |
| Icons | `bootstrap-icons` (CSS font) | Bootstrap authors | MIT (`app/package-lock.json`) | UI icons | WOFF2 icon font | npm dependency |
| Screenshots | captured from the site | project | repository [LICENSE](LICENSE) (MIT) | README | PNG | [docs/screenshots/](docs/screenshots/) |

## 10. Acceptance criteria and evidence

- **Criteria:** J1 by keyboard only, with an invalid then a valid submit; Contact identifiable
  in the first viewport; no loss of content from 320 px to wide and in print; reduced motion
  stops every animation, JS-driven ones included; a GitHub API failure is stated, not hidden.
- **Existing checks:** Vitest + Testing Library in [app/src/__tests__/](app/src/__tests__/);
  Playwright smoke suite [app/tests/e2e/cv.spec.ts](app/tests/e2e/cv.spec.ts) on Desktop Chrome
  only (sections, lang, modal and Escape). No axe or mobile viewport run.
- **Evidence log:**

  | Date | Change | Checks run | Result | Not run, and why |
  | ---- | ------ | ---------- | ------ | ---------------- |
  | 2026-11-08 | contract written from the code | source review of `app/src` | gaps listed in §11 | no browser run: documentation-only change |

## 11. Open choices, known gaps and maintenance

- **Known gaps (from the code, 2026-11-08):** GitHub repo error hidden silently; JS animations
  not gated by reduced motion; contact errors hard-coded French and not announced; `/favicon.svg`
  linked in `index.html` but absent from `app/public/`; fonts hotlinked from a third-party CDN;
  OpenDyslexic not shipped; `react-toastify` declared but not mounted; README says
  Framer Motion 12, `package.json` pins 14.
- **Open choices [proposed]:** record the logbook theme in an ADR superseding D-0003, or bring
  the code back to D-0003; self-host fonts with recorded licences; add axe and a mobile viewport to the Playwright
  run.
- **Maintenance:** any change under `app/` updates this file or `app/DESIGN.md` in the same PR.
