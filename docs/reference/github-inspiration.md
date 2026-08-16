# Deep-dive: `chrysa/linkendin-resume`

**Purpose (1 phrase):** A React 19 + Vite + TypeScript single-page "persuasive online CV" — dark theme, scroll animations (Framer Motion), FR/EN i18n, a `cv.json` single source of truth, a serverless contact flow that opens pre-filled GitHub Issues, plus developer easter eggs (⌘K command palette, terminal, AI ask-me widget).

**Nature:** This is a **frontend product**, not an internal library. There is a rich OSS ecosystem of directly comparable projects (JSON Resume, developer-portfolio builders, command-palette / terminal components), so the teardown below gives 5 concrete references rather than forcing 10. All patterns are UI/data-shape patterns; the load-bearing reusable ideas are (a) adopting the JSON Resume schema for `cv.json`, (b) using a battle-tested command-palette component instead of a hand-rolled one, and (c) the serverless "contact via GitHub Issues" pattern (which is largely original here — no strong external reference).

Live data captured 2026-08-15 via GitHub web (REST API was rate-limited).

---

## jsonresume/jsonresume.org (JSON Resume schema)

- **owner/repo:** `jsonresume/jsonresume.org` (schema now lives in `packages/schema`; legacy `jsonresume/resume-schema` + npm `@jsonresume/schema` v1.2.1 still valid)
- **stars:** ~298 (monorepo; the standard itself has far wider adoption — thousands of downstream resume.json files and dozens of themes)
- **activity:** actively maintained, 1,514+ commits on master, open PRs/issues
- **language:** TypeScript
- **licence:** **MIT** — copiable / adoptable freely
- **pattern file/module:** `packages/schema/schema.json` — the canonical JSON Schema (`basics`, `work`, `volunteer`, `education`, `awards`, `skills`, `languages`, `interests`, `references`, `projects`)
- **mechanism:** A community standard shape for a résumé as one JSON document, with an npm validator (`.validate(resume, cb)`). Adopting it makes `app/cv.json` interoperable with the whole JSON Resume theme/exporter/registry ecosystem instead of a bespoke shape.
- **snippet (portable — align `cv.json` `basics` to the standard field names):**
  ```jsonc
  {
    "basics": {
      "name": "Anthony Gréau",
      "label": "Python Backend Engineer",   // JSON Resume uses "label", not "headline"
      "image": "/assets/photo.jpg",          // "image", not "photoUrl"
      "email": "…",
      "summary": "…",
      "location": { "city": "Paris", "region": "Île-de-France" },
      "profiles": [
        { "network": "LinkedIn", "url": "https://www.linkedin.com/in/anthonygreau" },
        { "network": "GitHub",   "url": "https://github.com/chrysa" }
      ]
    },
    "work": [{ "name": "…", "position": "…", "startDate": "…", "highlights": ["…"] }]
  }
  ```
- **integration steps:**
  1. `npm i -D @jsonresume/schema` in `app/`.
  2. Rename current bespoke fields (`firstName`/`lastName`→`name`, `headline`→`label`, `photoUrl`→`image`, flat `linkedinUrl`/`githubUrl`→`basics.profiles[]`). Keep the `_en` locale suffixes as a documented extension (JSON Resume has no native i18n).
  3. Add a Vitest test that runs the official `validate()` over `cv.json` in CI — turns "single source of truth" into an enforced contract.
  4. Optionally generate a PDF/other themes for free via the registry.
- **gotchas:** The standard has **no multilingual support** — your `summary`/`summary_en` dual-locale trick is non-standard, so the validator will accept extra keys but downstream themes will ignore `_en`. Field names differ from the current `cv.json` (biggest churn: `basics`). Don't over-fit: adopt the shape, keep your own renderer.

---

## pacocoursey/cmdk (⌘K command palette)

- **owner/repo:** `pacocoursey/cmdk`
- **stars:** ~12.9k
- **activity:** maintained, 156 commits, active issues/PRs
- **language:** TypeScript
- **licence:** **MIT** — copiable
- **pattern file/module:** `cmdk` package — `<Command>`, `<Command.Input>`, `<Command.List>`, `<Command.Item>`; unstyled, accessible combobox with built-in fuzzy filter + keyboard nav.
- **mechanism:** Headless React component that owns filtering, ARIA roles, and arrow/enter navigation. Replaces a hand-rolled palette (the README advertises a custom ⌘K palette) with a maintained, screen-reader-correct one — directly relevant to the a11y panel this project already ships.
- **snippet (portable):**
  ```tsx
  import { Command } from 'cmdk';
  export function Palette({ open, actions }: { open: boolean; actions: Action[] }) {
    return (
      <Command.Dialog open={open} label="Command Menu">
        <Command.Input placeholder="Type a command…" />
        <Command.List>
          <Command.Empty>No results.</Command.Empty>
          {actions.map(a => (
            <Command.Item key={a.id} onSelect={a.run}>{a.label}</Command.Item>
          ))}
        </Command.List>
      </Command.Dialog>
    );
  }
  ```
- **integration steps:**
  1. `npm i cmdk` in `app/`.
  2. Replace the bespoke palette component; feed it the existing action list (navigate section, toggle theme, switch FR/EN, print PDF).
  3. Style via the `[cmdk-*]` data-attribute selectors using existing CSS custom properties (project is 100% vanilla CSS — cmdk is unstyled, so no framework conflict).
  4. Keep the `⌘K`/`Ctrl+K` shortcut wiring; delegate filtering/keyboard to cmdk.
- **gotchas:** cmdk ships zero styles — you must supply all CSS (fits this project's vanilla-CSS choice). Radix-free but expects a portal/dialog; ensure it respects the reduced-motion setting from the accessibility panel.

---

## arifszn/gitprofile (GitHub-driven portfolio generator)

- **owner/repo:** `arifszn/gitprofile`
- **stars:** ~2.3k
- **activity:** actively maintained, 1,103+ commits
- **language:** TypeScript (React + Vite)
- **licence:** **MIT** — copiable
- **pattern file/module:** `src/components/` GitHub cards + the repo-fetch layer (fetches public repos by username, ranks/filters, renders skeletons). Config-driven via `gitprofile.config.ts`.
- **mechanism:** Given a GitHub username it calls the public REST API (no token) to list repos, sort by stars/updated, exclude forks, and render cards with skeleton loading + rate-limit handling. This is exactly the `useGitHubRepos` hook this project describes — gitprofile is the reference implementation of that flow, including the caching/rate-limit gotchas.
- **snippet (portable — the ranking/filter core):**
  ```ts
  const res = await fetch(
    `https://api.github.com/users/${username}/repos?sort=updated&per_page=100`,
  );
  const repos = (await res.json())
    .filter((r: Repo) => !r.fork && !exclude.includes(r.name))
    .sort((a: Repo, b: Repo) => b.stargazers_count - a.stargazers_count)
    .slice(0, 8);
  ```
- **integration steps:**
  1. Compare gitprofile's fetch layer against this project's `useGitHubRepos`; adopt its unauthenticated rate-limit fallback (60 req/h/IP → cache in `localStorage` with a TTL, show cached on 403).
  2. Reuse its "exclude forks / pin by config" idea to drive which repos surface per `?profile=` variant.
  3. Borrow its skeleton-card markup pattern.
- **gotchas:** Unauthenticated GitHub API is **60 requests/hour per IP** — without caching, a shared office/CDN IP will hit 403 fast (I hit exactly this rate limit during this deep-dive). gitprofile solves it with client-side caching; port that, don't just copy the fetch.

---

## m4tt72/terminal (terminal-style site — easter-egg reference)

- **owner/repo:** `m4tt72/terminal`
- **stars:** ~1.6k
- **activity:** maintained
- **language:** TypeScript (Svelte 4 + Tailwind)
- **licence:** **MIT** — copiable (but Svelte, so **re-implement the pattern**, not the code, for a React app)
- **pattern file/module:** command dispatcher — a `commands` record mapping name → handler (`help`, `whoami`, `theme`, `ls`, …) with history + autocomplete.
- **mechanism:** A single command-registry object drives the whole interactive terminal; input is parsed to `argv`, matched against the registry, output pushed to a scrollback array. This is the clean pattern for the project's `` ` `` terminal easter egg (9 commands: `whoami`, `git log`, `ls projects`, `cat cv.json`…).
- **snippet (portable pattern, re-expressed in TS/React):**
  ```ts
  type Cmd = (args: string[]) => string;
  const commands: Record<string, Cmd> = {
    whoami: () => cv.basics.name,
    'cat':  (a) => a[0] === 'cv.json' ? JSON.stringify(cv, null, 2) : `no such file`,
    help:   () => Object.keys(commands).join('  '),
  };
  const run = (line: string) => {
    const [name, ...args] = line.trim().split(/\s+/);
    return (commands[name] ?? (() => `command not found: ${name}`))(args);
  };
  ```
- **integration steps:**
  1. Refactor the easter-egg terminal to a single `commands` registry keyed by name (kills the if/else chain, keeps ruff/eslint complexity low — aligns with the workspace `C901`/`PLR0912` thresholds).
  2. Drive `cat cv.json`, `skills`, `ls projects` directly off the same `cv.json` object → stays consistent with the "single source of truth" claim.
  3. Add history (up/down) + tab-complete over `Object.keys(commands)`.
- **gotchas:** Its coverage claim ("85%+") maps neatly onto this workspace's ≥85% coverage floor — a registry pattern is far easier to unit-test than a switch. Don't import the Svelte code; it's a different framework — take the shape only.

---

## welolvedevs/react-ultimate-resume  ⚠️ COPYLEFT — REIMPLEMENT ONLY

- **owner/repo:** `welovedevs/react-ultimate-resume`
- **stars:** ~2.1k
- **activity:** 1,324 commits on `develop`; older/less active
- **language:** JavaScript/TypeScript (React)
- **licence:** **AGPL-3.0** — 🚩 **strong copyleft / network copyleft. DO NOT copy code.** AGPL would force this MIT project to relicense and disclose source to all network users. Use only as *conceptual* inspiration.
- **pattern file/module:** its JSON-Resume-driven card sections + skills visualization (React components reading a JSON Resume document).
- **mechanism:** Renders a full résumé UI directly from a JSON Resume object with animated skill/career sections — proof that the JSON Resume schema (see first entry) is sufficient to drive a rich animated UI, which is the exact bet this project makes with `cv.json` + Framer Motion.
- **snippet:** *intentionally omitted* — AGPL. Re-derive independently from the MIT JSON Resume schema instead.
- **integration steps:** Treat as a moodboard for which résumé sections animate well. Build your own components from the MIT `@jsonresume/schema` shape; never lift AGPL source.
- **gotchas:** 🚩 AGPL-3.0 is incompatible with this repo's MIT LICENSE. Copying even a component would legally taint the whole project. Look, learn the idea, write fresh.

---

## Licence summary

| Source | Licence | Verdict |
|---|---|---|
| jsonresume/jsonresume.org (schema) | MIT | ✅ copiable / adopt |
| pacocoursey/cmdk | MIT | ✅ copiable |
| arifszn/gitprofile | MIT | ✅ copiable |
| m4tt72/terminal | MIT | ✅ copiable (Svelte → reimplement in React) |
| welovedevs/react-ultimate-resume | **AGPL-3.0** | 🚩 REIMPLEMENT ONLY — do not copy |

**Copyleft/restrictive:** `welovedevs/react-ultimate-resume` (AGPL-3.0). All others permissive (MIT).

**Note on the "contact via GitHub Issues" flow:** No strong OSS reference exists — the serverless pre-filled-issue + regex-inferred-labels approach in `ContactModal.tsx` is largely original and is arguably this repo's most distinctive, portable idea (worth extracting as its own snippet/gist for reuse across the chrysa portfolio).
