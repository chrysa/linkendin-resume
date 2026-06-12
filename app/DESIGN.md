# Design — linkendin-resume (cv-online)

This frontend follows the chrysa **Editorial** design persona:
[`shared-standards/docs/DESIGN-SYSTEM.md §1 Editorial`](https://github.com/chrysa/shared-standards/blob/main/docs/DESIGN-SYSTEM.md)
and accent-restraint rules from `§4 Accent`.

## Persona

`data-persona="editorial"` is set on `<html>` in `app/index.html`.

Editorial reads as an elegant, readable résumé piece. The differentiator is
the Fraunces serif for all display headings combined with Inter for body text
— that contrast signals "crafted document" rather than "generic web app".
Spacing is generous, cards are softly rounded, and the warm amber accent is
used sparingly: one primary CTA fill, amber text for links and section kickers,
never large acid fill blocks.

## Accent

**Warm amber** — dark theme `#f0a830` / light theme `#b45309` (darker for
contrast on white). Used only as:

- `background` on the **one primary CTA** button (`.btn--primary`) and the
  Ask Me trigger / send button.
- `color` on links, section eyebrows (`.section__label`), dates, metric values,
  and the `--clr-accent-text` token.
- Never as a large fill block filling headers, badges, nav logos, or filter tabs.

## Typography

- **Display / headings**: `Fraunces` (serif, optical sizes) — `--font-display`.
  Applied to: hero name, section titles, card titles, exp/edu/modal titles,
  metric values, contact section title, projects sub-titles.
- **Body / UI**: `Inter` — `--font-sans`. Applied to body text, nav links,
  buttons, labels, form fields.
- **Mono / data**: `JetBrains Mono` — `--font-mono`. Applied to dates, section
  eyebrow kickers, tech tags, metric sub-labels, terminal.

Loaded via Google Fonts in `app/index.html`.

## Tokens

The single source of truth is `app/src/styles/tokens.css`. Every other
stylesheet (`globals`, `components`, `sections`, `modal`, `animations`,
`responsive`) reads its CSS custom properties, so re-theming happens in one
place.

Key Editorial token values:

- `--radius-sm: 8px` / `--radius-md: 10px` / `--radius-lg: 14px` / `--radius-full: 9999px`
- `--shadow-card: 0 4px 24px rgb(0 0 0 / 0.18)` (soft blurred, no hard offset)
- `--border-weight: 1px` (hairline — never 2px FG-colored)
- `--transition: 0.22s ease` (calm motion)

## Theme mechanism (preserved)

- `data-theme="dark" | "light"` on `<html>`, set by the FOUC guard in
  `index.html` from `localStorage['theme']` and `prefers-color-scheme`, managed
  at runtime by `useTheme` / `ThemeProvider`.
- **Accessibility datasets** are preserved and still drive token overrides:
  - `data-high-contrast` — increases contrast on borders and text
  - `data-dyslexia` — switches `--font-sans` to OpenDyslexic
  - `data-reduced-motion` — collapses all animation/transition durations to 0.01ms

## Constraints honoured

- WCAG 2.1 AA in both themes; amber on dark `#f0a830` / `#0e0e10` meets 7:1.
  Amber on light `#b45309` on `#fafafa` meets 4.8:1 (AA).
- All test selectors (`data-testid`, roles, aria-labels, ids/classes queried by
  Vitest + Playwright) are unchanged — this was a restyle only.
- Content remains data-driven from `app/cv.json`; no component logic changed.
- Skip-nav, i18n, and keyboard navigation are unaffected.
