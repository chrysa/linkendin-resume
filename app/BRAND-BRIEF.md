# linkendin-resume — Brand Brief

> Direction proposal — open to redirection by the owner before/after the pilot PR.

> The repeatable discovery that derives this app's identity from its job, not a genre.
> Fill all 6 prompts, then translate the answers into the design decisions at the bottom.

## 1. Job-to-be-done

A recruiter, CTO, or potential client lands here to decide, in under a minute, whether
Anthony Gréau is the senior backend/systems engineer they want to talk to — and to leave
with a way to reach him (contact / open an issue) without ever opening a PDF.

## 2. Audience

Technical decision-makers and their gatekeepers: engineering managers, CTOs, lead engineers,
and technical recruiters at scale-ups, research labs, and consultancies. They are literate in
software and infrastructure (they recognise "k3s", "GitOps", "1,000+ commits", "Solar Orbiter"
as signal, not noise), time-poor, and skim before they read. Primarily desktop/laptop during
sourcing, with a meaningful mobile minority reading a shared link on the move. FR + EN.

## 3. Three mood words

precise / crafted / quiet-authority

(Calm and deliberate over loud and animated. Every element looks measured, like it was placed
on a grid by someone who cares about correctness.)

## 4. Metaphor

An **engineering logbook / technical monograph** — the bound field notebook of a systems
engineer: a precise running record with a measured margin, numbered entries, hand-ruled
gridlines, and a quiet authority that comes from the work being documented, not decorated.

## 5. References (2-3)

- **The Manual / technical reference manuals (LaTeX `book` class, O'Reilly animal books):**
  borrow the disciplined measure, the generous margin reserved for marginalia/metadata, the
  sober display serif used with restraint, and the sense that the page is *typeset*, not laid out.
- **A well-kept terminal / `man` page:** borrow the monospaced data voice for dates, tech tags,
  and metadata, and one literal terminal-prompt marker (`▸ §`) that signals "an engineer made this".
- **Engineering field notebook (quadrille/grid paper):** borrow the faint rule-and-tick grid and
  the numbered-entry convention (experience entries read as logbook entries `[01] [02] …`).

## 6. Remembered for

A **monospaced index-rail running down the left edge of the page** — a slim vertical spine of
section numbers, tick marks, and a terminal-prompt section marker that the reader's eye tracks as
they scroll, like the spine/margin of a bound logbook. It is the one thing that makes this read as
a *deliberate engineering document* and not a generic dark résumé template.

---

## Derived decisions

- **Type:** display = **Spectral** (a sober, technical-feeling text serif with quiet authority —
  keeps the "typeset monograph" gravitas of the old Fraunces but reads as a *reference-manual*
  serif rather than a fashionable display face); body = **Inter** (kept — neutral, legible UI/body
  workhorse); data = **JetBrains Mono** (kept — the logbook/terminal voice for the index-rail,
  dates, tech tags, metric sub-labels, and entry numbers).
- **Color:** accent = **signal cyan/teal `#3bd6c6` (dark) / `#0e7c70` (light)** — a precise
  instrument-readout hue (oscilloscope trace, terminal status, satellite-telemetry green-cyan)
  that reads as "measured signal" rather than the warm, editorial-magazine amber it replaces; it
  fits *precise / quiet-authority* and ties to the space/mobility/infra story. surface mood =
  **cool neutral** (near-black graphite `#0e0e10` dark / paper `#fafafa` light — the page of the
  logbook, never warm).
- **Shape & depth:** radius = **tight `4px` (sm) / `6px` (md) / `8px` (lg)**, `9999px` only for
  true circles — squarer than Editorial's soft 10–14px, reading as drafted/ruled rather than
  pillowy. border = **crisp 1px hairlines in a structural border colour**, used as actual rules
  (the grid), with the index-rail drawn as a 1px tick column. shadow = **near-flat** — replace the
  soft 24px blur with a minimal `0 1px 0` hairline-edge + very faint elevation; depth comes from
  rules and the grid, not glow, so the page feels *printed*.
- **Motion personality:** **calm** — short (~160–200ms), linear/`ease-out`, no spring or bounce.
  signature transition = on scroll, each logbook entry's number + tick on the index-rail
  *ticks/registers in* (a 1px-precise fade + 2px settle), like a plotter advancing one line. Fully
  **reduced-motion-safe**: under `data-reduced-motion`/`prefers-reduced-motion` the rail and entries
  render in their final state with no movement — the signature is structural (drawn in CSS), not
  animation-dependent.
- **Signature element:** the **monospaced index-rail / logbook spine** — a slim fixed-measure
  vertical column running down the left of the content, carrying: zero-padded section/entry numbers
  (`[01] [02] …`), fine tick marks aligned to the baseline grid, and a **terminal-prompt section
  marker** (`▸ §` / `$`) at each section head. Token-driven (rail width, tick colour, prompt glyph
  all from `tokens.css`), drawn with borders + pseudo-elements so it survives reduced-motion and
  print. This is the memorable, non-generic device.
- **IA:** primary view = **a single, generously-margined readable column** (the monograph page),
  index-rail in the reserved left margin, content right of it. central object = **the candidate
  (Anthony)** — the hero name + headline + one-line summary, presented as the title page / colophon
  of the monograph. primary action = **Contact / open a GitHub issue** (the one accent-filled CTA;
  CV download/print as a quiet secondary), reachable from the hero and persistently from the rail.
  density = **comfortable-but-information-dense** — generous vertical rhythm and margin (it breathes
  like a typeset book), but each entry is compact and metadata-rich (mono dates, tech tags, numbers)
  so a skimming reader extracts signal fast.
