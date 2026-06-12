# Design — linkendin-resume (cv-online)

This frontend follows the chrysa design system, **Editorial persona**:
[`shared-standards/docs/DESIGN-SYSTEM.md`](https://github.com/chrysa/shared-standards/blob/main/docs/DESIGN-SYSTEM.md)
§1 (Editorial). See [ADR 0002](https://github.com/chrysa/shared-standards/blob/main/docs/adr/0002-design-personas.md)
for why the previous uniform "Neon Brutalist" look was superseded — a résumé is a
reading surface, not a dashboard, so it gets the Editorial persona.

## Aesthetic

Editorial: serif display type, readable sans body in normal case, generous
spacing, soft rounded corners, soft blurred depth, calm motion. The accent is used
**sparingly** (links, key figures, one CTA, the eyebrow), never as large acid
fill blocks.

## Per-app accent

**Warm amber** — `#f0a830` (dark) · `#b4690e` (light, darker variant for legibility
on warm paper). Legible as text on the background (~8:1 dark / ~5:1 light), so it
is used as link/eyebrow/figure colour as well as on the single primary CTA (where
`--accent-ink` text sits on the amber fill). Distinct from every other app hue.

## Type

- Display (name, section titles, modal titles): **Fraunces** serif (`--font-display`)
- Body / nav / UI: **Inter** (`--font-sans`), normal case
- Data only (dates, metrics, stars, counts, terminal): **JetBrains Mono** (`--font-mono`)

Loaded via Google Fonts in `app/index.html`.

## Persona axes (vs. the shared frame)

| Axis     | Value                                                                        |
| -------- | ---------------------------------------------------------------------------- |
| Radius   | `8 / 12 / 18px` (`--radius-sm/md/lg`); `9999px` for circles                  |
| Depth    | soft blurred shadow (`--shadow-card: 0 6px 28px`); no hard offset            |
| Border   | `1px` hairline (`--clr-border`, warm neutral)                                |
| Motion   | calm `0.22s` ease; hover = soft lift (`translateY(-3px)`), no diagonal press |
| Surfaces | warm near-black (dark) / warm paper (light)                                  |

## Tokens

The single source of truth is `app/src/styles/tokens.css`. Every other stylesheet
(`globals`, `components`, `sections`, `modal`, `animations`, `responsive`) reads
its CSS custom properties, so re-theming happens in one place. The Editorial
brand layer (serif headings, de-filled eyebrow/logo/badge, soft corners) is an
appended block at the end of `globals.css`.

## Theme mechanism (preserved)

- `data-theme="dark" | "light"` on `<html>`, set by the FOUC guard in `index.html`
  from `localStorage['theme']` and `prefers-color-scheme`, managed at runtime by
  `useTheme` / `ThemeProvider`.
- **Accessibility datasets** still drive token overrides: `data-high-contrast`,
  `data-dyslexia`, `data-reduced-motion`.

## Constraints honoured

- WCAG 2.1 AA in both themes; amber CTA fills carry `--accent-ink`; amber-as-text
  meets AA on both backgrounds.
- Body text is sans in normal case; mono is reserved for data — no uppercase-mono
  paragraphs.
- All test selectors (`data-testid`, roles, aria-labels, ids/classes queried by
  Vitest + Playwright) are unchanged — this was a restyle only.
- Content remains data-driven from `app/cv.json`; no component logic changed.
