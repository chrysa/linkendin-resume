# SECURITY — linkendin-resume

> Security posture of a **fully static, backend-less** single-page CV site.
> Tags: **FACT** (verified in repo), **INFERENCE** (reasoned from evidence),
> **UNKNOWN** (not determinable from the repo).
> This document is descriptive for the repository owner. It does **not** modify code.

## Threat surface (FACT)

`linkendin-resume` ships **no application backend, no database, and no server-side
secrets** (see `ARCHITECTURE.md` "Data & external dependencies"). It is a static SPA
served as compiled assets (`serve -s dist` / static hosting). This removes entire
classes of risk (SQL injection, server auth, session hijacking) by construction.

The remaining surfaces are:

| Surface | Nature | Evidence |
|---|---|---|
| GitHub REST API call | Unauthenticated public read of `users/{owner}/repos` | `app/src/hooks/useGitHubRepos.ts` (per ARCHITECTURE.md) |
| Contact flow | Visitor redirected to GitHub Issues (no form POST to us) | `app/src/components/contact/ContactModal.tsx`, README |
| `cv.json` | Public profile content shipped in the bundle | `app/cv.json` |
| Build-time env (`VITE_*`) | Inlined into the static bundle at build | `.env.example`, Vite convention |

## Secrets scan (FACT)

A scan of committed config was performed on the working tree.

- **Root `.env` and `app/.env` are git-ignored** — confirmed via `git check-ignore`
  (both return a match). They are **not** tracked in the repository.
- Their keys are non-sensitive configuration only: `COMPOSE_PROFILES`, `APP_PORT`,
  `APP_DOMAIN`, `IMAGE`, `IMAGE_TAG`, `VITE_GITHUB_OWNER`, `VITE_GITHUB_REPO`,
  `VITE_DEMO_MODE` (root) and `VITE_GITHUB_OWNER`, `VITE_GITHUB_REPO` (`app/`).
- **No secret, token, key, password, or credential was found** in tracked files during
  this documentation pass. `VITE_*` variables are, by Vite design, **public** (inlined
  into the client bundle) — this is expected and correct here, since the values are a
  GitHub username and repo name, not secrets. **[FACT]**

> **No HIGH/CRITICAL secret-exposure finding.** Nothing to flag to the owner for
> remediation from the secrets scan.

## CI/CD secrets (FACT — declared, not in repo)

Deployment relies on **GitHub Actions secrets**, which live in GitHub settings, not in
the tree. README declares: `SONAR_TOKEN`, `DEPLOY_HOST`, `DEPLOY_USER`, `DEPLOY_SSH_KEY`.
These are correctly kept out of the repository. **[FACT]**

## Automated controls present (FACT)

| Control | Where |
|---|---|
| Secret-scan workflow | `.github/workflows/secret-scan.yml` |
| Local secret-scanner hook | `.claude/hooks/secret-scanner.cjs` |
| `.env`-file guard hook | `.claude/hooks/check-no-env-files.cjs` |
| Pre-commit baseline | `.pre-commit-config.yaml` (chrysa canonical, per DECISIONS D-0001/D-0002 line) |
| SonarCloud security rating gate | `sonar-project.properties`, badges in README |
| `secret-scan` + `quality-gate-check` CI jobs | `.github/workflows/` |

The global chrysa standard ("Security scanning is a gate, not an afterthought") is
therefore satisfied for this repo. **[INFERENCE — from presence of the hooks/workflows above]**

## Residual considerations (INFERENCE)

These are **not vulnerabilities**, but items a reviewer of a static site should be aware
of. No code change is proposed here.

1. **Client-side trust boundary.** Everything shipped (`cv.json`, `VITE_*`, repo logic)
   is public by nature. Do not place anything confidential in `cv.json` or any `VITE_*`
   variable. **[FACT — Vite bundling behaviour]**
2. **Third-party call to `api.github.com`.** Unauthenticated GitHub API has rate limits
   (60 req/h/IP). A visitor hitting the limit degrades the "live repos" panel; demo mode
   (`VITE_DEMO_MODE`, `utils/demoMode.ts`) exists as the offline fallback. Not a security
   issue; an availability one. **[INFERENCE]**
3. **`AskMeWidget` / "AI Ask Me".** README describes an AI chat widget using `cv.json` as
   knowledge base. Whether it calls an external LLM endpoint at runtime and, if so, how any
   key is handled, is **UNKNOWN** from the docs read in this pass — worth the owner
   confirming it uses only bundled `cv.json` and no embedded credential. **[UNKNOWN]**

## Reporting

- Vulnerability disclosure template: `.github/ISSUE_TEMPLATE/security.md` (FACT).
- No `SECURITY.md` policy file with a disclosure contact existed before this pass;
  the ISSUE_TEMPLATE covers intake. **[FACT]**

## Definition of "secure enough" for this repo (INFERENCE)

Given a static, public résumé site with no user data and no backend, the security bar is:
no secrets in the bundle or tree (met), scanning gates active (met), and nothing
confidential placed in public build inputs (owner's ongoing responsibility).
