import type { GitHubRepo } from '@/hooks/useGitHubRepos';

/**
 * Realistic inline fixtures served by `useGitHubRepos` while demo mode is on.
 *
 * The shape matches exactly what the public GitHub REST API returns for
 * `GET /users/{owner}/repos`, so the live-repos grid renders identically to
 * production without any network call or credential.
 */
export const DEMO_REPOS: GitHubRepo[] = [
  {
    id: 901_001,
    name: 'portfolio-engine',
    full_name: 'demo-user/portfolio-engine',
    description: 'Headless content engine powering personal portfolios and CV sites.',
    html_url: 'https://github.com/demo-user/portfolio-engine',
    stargazers_count: 248,
    language: 'TypeScript',
    pushed_at: new Date(Date.now() - 2 * 86_400_000).toISOString(),
    topics: ['react', 'vite', 'portfolio'],
    archived: false,
  },
  {
    id: 901_002,
    name: 'flux-api',
    full_name: 'demo-user/flux-api',
    description: 'Async FastAPI service with SQLAlchemy 2.0 and end-to-end typing.',
    html_url: 'https://github.com/demo-user/flux-api',
    stargazers_count: 132,
    language: 'Python',
    pushed_at: new Date(Date.now() - 9 * 86_400_000).toISOString(),
    topics: ['fastapi', 'async', 'postgres'],
    archived: false,
  },
  {
    id: 901_003,
    name: 'design-tokens',
    full_name: 'demo-user/design-tokens',
    description: 'Accessible design-token system with dark mode and WCAG AA contrast.',
    html_url: 'https://github.com/demo-user/design-tokens',
    stargazers_count: 87,
    language: 'CSS',
    pushed_at: new Date(Date.now() - 21 * 86_400_000).toISOString(),
    topics: ['design-system', 'accessibility', 'tailwind'],
    archived: false,
  },
  {
    id: 901_004,
    name: 'agent-ops',
    full_name: 'demo-user/agent-ops',
    description: 'Observability and guardrails toolkit for long-lived LLM agents.',
    html_url: 'https://github.com/demo-user/agent-ops',
    stargazers_count: 56,
    language: 'Python',
    pushed_at: new Date(Date.now() - 45 * 86_400_000).toISOString(),
    topics: ['llm', 'observability', 'agents'],
    archived: false,
  },
  {
    id: 901_005,
    name: 'ci-templates',
    full_name: 'demo-user/ci-templates',
    description: 'Reusable GitHub Actions workflows for Python and TypeScript projects.',
    html_url: 'https://github.com/demo-user/ci-templates',
    stargazers_count: 41,
    language: 'YAML',
    pushed_at: new Date(Date.now() - 70 * 86_400_000).toISOString(),
    topics: ['github-actions', 'ci', 'devops'],
    archived: false,
  },
  {
    id: 901_006,
    name: 'edge-cache',
    full_name: 'demo-user/edge-cache',
    description: 'Tiny Redis-backed read-through cache with stale-while-revalidate.',
    html_url: 'https://github.com/demo-user/edge-cache',
    stargazers_count: 23,
    language: 'Go',
    pushed_at: new Date(Date.now() - 120 * 86_400_000).toISOString(),
    topics: ['redis', 'cache', 'performance'],
    archived: false,
  },
];
