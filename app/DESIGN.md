# linkendin-resume — Design (Brand Theme)

> Conforms to the chrysa Brand-Themes Design System
> (`shared-standards/docs/DESIGN-SYSTEM.md`). No persona — this app is its own brand.

## Brand brief

See `BRAND-BRIEF.md`. Summary: an **engineering logbook / technical monograph** —
the bound field notebook of a systems engineer. Mood: precise / crafted /
quiet-authority. Authority comes from the work being documented, not decorated:
a measured margin, numbered entries, hairline rules, and a monospaced data voice.

## Contract conformance

- Imports `contract.css` (semantic token names + a11y floor): **yes** —
  `@import './contract.css';` at the top of `app/src/styles/tokens.css`.
- `@chrysa/ui` class/behavior contract honored (if used): **n/a** — this app ships
  its own components and CSS; it has no `@chrysa/ui` dependency. The brand is
  applied by defining the semantic contract tokens with brand values and aliasing
  the app's local `--clr-*` token names to them, so existing components inherit the
  brand with no markup churn.
- WCAG AA verified both themes: **yes** — contrast ratios computed against the
  WCAG 2.1 relative-luminance formula (see ratios below). All checked pairs ≥ 4.5:1.

## Theme tokens

Single source of truth: `app/src/styles/tokens.css`. It imports the semantic
registry from `contract.css`, sets the brand values for both `:root`/dark and
`[data-theme='light']`, then aliases every local `--clr-*` / component token to a
semantic one. Every other stylesheet reads these custom properties unchanged.

**Palette**

| Token          | Dark                      | Light                 |
| -------------- | ------------------------- | --------------------- |
| `--bg`         | `#0e0e10` (graphite page) | `#fafafa` (paper)     |
| `--surface`    | `#18181b`                 | `#ffffff`             |
| `--fg`         | `#fafafa`                 | `#0e0e10`             |
| `--muted`      | `#a1a1aa`                 | `#52525b`             |
| `--border`     | `#2e2e33`                 | `#d4d4d8`             |
| `--accent`     | `#3bd6c6` (signal teal)   | `#0e7c70` (deep teal) |
| `--accent-ink` | `#0e0e10`                 | `#ffffff`             |

**Shape & depth:** squarer/flatter — `--radius-sm 4px` / `--radius-md 6px` /
`--radius-lg 8px`, `9999px` only for true circles; `--border-weight 1px` hairlines
used as actual rules; near-flat `--shadow: 0 1px 0` edge instead of a soft blur.

**Type:** display **Spectral** (`--font-display`, replaces Fraunces — a sober
reference-manual serif), body **Inter** (`--font-body`/`--font-sans`), data
**JetBrains Mono** (`--font-mono`). Loaded via Google Fonts in `app/index.html`.

**Motion:** calm — `--motion: 180ms` linear/ease-out, no spring/bounce.

**AA contrast ratios (verified):**

| Pair                              | Dark    | Light   |
| --------------------------------- | ------- | ------- |
| `--fg` on `--bg`                  | 18.48:1 | 18.48:1 |
| `--muted` on `--bg`               | 7.52:1  | 7.41:1  |
| `--accent-ink` on `--accent` fill | 10.67:1 | 5.08:1  |
| `--accent` as text on `--bg`      | 10.67:1 | 4.86:1  |

All ≥ 4.5:1 (normal text). The demo banner (`--accent-ink` on `--warning`) is
11.55:1 dark / 5.02:1 light. The terminal easter-egg keeps authentic ANSI colours
(amber 8.81:1, cyan 7.79:1 on its own `#0d1117` window) — legible and intentional.

## Signature element

The **monospaced index-rail / logbook spine** — a slim vertical column down the
reserved left margin of each numbered section, carrying zero-padded entry numbers
(`[01]`, `[02]`…), a 1px structural hairline spine, a terminal-prompt section
marker (`▸ §`), and an accent registration tick aligned to each section head.

It is drawn entirely in CSS (`app/src/styles/sections.css`): a `logbook` counter
reset on `<main>` and incremented per `main > .section`, with the number + prompt
glyph rendered via `.container::after` and the spine via `.container::before`. No
JS, no markup change. It is token-driven (`--rail-width`, `--rail-tick`,
`--rail-num`, `--rail-prompt`, `--rail-prompt-glyph`, `--font-mono`), reduced-motion
safe (structural, never animation-dependent), and print-safe (a print override in
`responsive.css` renders the numbering in ink and tightens the margin). On mobile
(≤ 600px) the number column collapses to a thin accent tick to reclaim width.

## Information architecture

- **Primary view:** a single, generously-margined readable column — the monograph
  page — with the index-rail in the reserved left margin and content to its right.
- **Central object:** the candidate (Anthony) — hero name + headline + one-line
  summary, presented as the title page / colophon of the monograph.
- **Primary action:** Contact / open a GitHub issue — the one accent-filled CTA;
  CV print/download stays a quiet secondary.
- **Density:** comfortable-but-information-dense — generous vertical rhythm and
  margin, but each entry is compact and metadata-rich (mono dates, tech tags,
  numbers) so a skimming reader extracts signal fast.
- **Print fidelity:** the printed/PDF CV is a first-class surface (recruiters read it
  offline). Skill proficiency is encoded as dots + a hover tooltip on screen; on paper
  there is no hover, so print inks the active dots (signal-teal washes out in grayscale)
  and reveals the tier word inline (`.skill-pill__level-print`). No screen change.
- **Why this serves the job (not a generic stat-cards + table shell):** a technical
  decision-maker decides in under a minute whether this is a senior systems
  engineer worth talking to. The logbook spine, ruled grid, and mono data voice
  signal "a precise engineer made this" before a word is read; the numbered entries
  let a skimmer jump and the typeset measure rewards a closer read — authority by
  documentation, not by decoration.
