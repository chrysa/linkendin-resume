# Design — linkendin-resume (cv-online)

This frontend follows the chrysa **Neon Brutalist** design system:
[`shared-standards/docs/DESIGN-SYSTEM.md`](https://github.com/chrysa/shared-standards/blob/main/docs/DESIGN-SYSTEM.md).

## Aesthetic

Loud structure, flat fills, one acid accent. Radius `0`, 2px FG-colored borders
(white on dark / black on light), hard offset shadows (`4px 4px 0`), **no
gradients, no glow**, mono-forward type.

## Per-app accent

**Acid yellow** — `#ffe600` (dark) · `#e0c400` (light, darker variant for fill
contrast). Used only as **fill blocks** with `--accent-ink` (`#0e0e10`) text,
never as acid text on the background. Distinct from every other campaign hue
(lime/cyan/violet/orange/magenta/azure).

## Type

- Display / body: **Space Grotesk** (`--font-sans`)
- Mono (labels, dates, tech tags, metrics): **JetBrains Mono** (`--font-mono`)

Loaded via Google Fonts in `app/index.html`.

## Tokens

The single source of truth is `app/src/styles/tokens.css`. Every other
stylesheet (`globals`, `components`, `sections`, `modal`, `animations`,
`responsive`) reads its CSS custom properties, so re-theming happens in one
place.

## Theme mechanism (preserved)

- `data-theme="dark" | "light"` on `<html>`, set by the FOUC guard in
  `index.html` from `localStorage['theme']` and `prefers-color-scheme`, managed
  at runtime by `useTheme` / `ThemeProvider`.
- **Accessibility datasets** are preserved and still drive token overrides:
  `data-high-contrast`, `data-dyslexia`, `data-reduced-motion`.

## Constraints honoured

- WCAG 2.1 AA in both themes; yellow accent fills carry `#0e0e10` ink.
- All test selectors (`data-testid`, roles, aria-labels, ids/classes queried by
  Vitest + Playwright) are unchanged — this was a restyle only.
- Content remains data-driven from `app/cv.json`; no component logic changed.
