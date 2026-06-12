# linkendin-resume — Design System

> Visual identity and token reference for the CV / portfolio app.
> Conforms to `shared-standards/docs/UX-UI-GUIDELINES.md` and the `ui-ux` skill.

## Relationship to the chrysa design system

This is a **light-pass** repo in the portfolio design campaign. It was already
polished, so it **keeps its own gradient identity** rather than adopting the Neon
Brutalist DNA — this document formalises the existing system and the change set
was limited to English-only comment compliance + this doc.

## Identity

**Personal portfolio / CV.** A deep dark canvas (light theme available) with a
single **violet → cyan gradient** as the signature accent — used for emphasis
text (`.gradient-text`), primary buttons, and focus. Calm surfaces, one expressive
gradient.

## Tokens (`src/styles/tokens.css`)

CSS custom properties, theme-switched via `[data-theme]`. Every role exists in
both themes.

- **Colors** — `--clr-bg` / `--clr-bg-2` / `--clr-bg-card(-hover)`, `--clr-border(-hover)`.
- **Accent** — `--clr-accent-1` (violet `#7c3aed`) → `--clr-accent-2` (cyan `#06b6d4`),
  composed into `--gradient` / `--gradient-text`. `--clr-accent-text` is the
  higher-contrast accent for text (documented **6.6:1** dark / **10.5:1 AAA** light).
- **Text** — `--clr-text` / `-2` / `-3`, with inline WCAG ratios (≥ 4.6:1).
- **Type** — Inter (sans) + JetBrains Mono. Spacing/radii/shadow/transition scales.

## Theming & accessibility (a first-class feature)

Beyond light/dark, the app exposes **runtime accessibility modes** (see
`components/ui/AccessibilityPanel.tsx`) via `data-*` attributes on the root:

- `data-high-contrast='true'` — pure-black surfaces, white text, stronger borders.
- `data-dyslexia='true'` — switches the sans family to OpenDyslexic.
- `data-reduced-motion='true'` — kills animations/transitions (also honours the
  `prefers-reduced-motion` media query).
- `--a11y-font-offset` — user-adjustable base font size.

Baseline a11y (`src/styles/globals.css`):

- Visible focus everywhere: `:focus-visible` 2px accent outline + offset.
- **Skip nav** link, revealed on focus.
- Touch targets ≥ 44px (theme toggle, buttons).
- Documented contrast ratios meeting WCAG 2.1 AA (AAA for accent text in light).

## Components

CV sections in `src/components/cv/` (`Hero`, `ExperienceTimeline`, `ProjectsGrid`,
`SkillsCloud`, `ImpactMetrics`, `EducationSection`, `ContactSection`, `Navbar`),
plus `ui/` (`ThemeToggle`, `AccessibilityPanel`) and a `ContactModal`. Buttons:
`.btn--primary` (gradient) / `.btn--ghost`, with `--sm/--lg/--full` sizes.

## i18n

FR + EN catalogs under `src/i18n/` (the only intentionally non-English source —
locale data, not comments).
