import { useState, useEffect } from 'react';

export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  language: string | null;
  pushed_at: string;
  topics: string[];
  archived: boolean;
}

interface UseGitHubReposOptions {
  owner: string;
  perPage?: number;
}

interface UseGitHubReposResult {
  repos: GitHubRepo[];
  loading: boolean;
  error: string | null;
}

export function useGitHubRepos({ owner, perPage = 12 }: UseGitHubReposOptions): UseGitHubReposResult {
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!owner || owner === 'votre-username') {
      setLoading(false);
      return;
    }

    const controller = new AbortController();

    async function fetchRepos() {
      try {
        const url = `https://api.github.com/users/${encodeURIComponent(owner)}/repos?type=public&sort=pushed&per_page=${perPage}`;
        const res = await fetch(url, {
          signal: controller.signal,
          headers: { Accept: 'application/vnd.github+json' },
        });

        if (!res.ok) throw new Error(`GitHub API ${res.status}`);

        const data: GitHubRepo[] = await res.json();
        setRepos(data.filter((r) => !r.archived));
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          setError((err as Error).message);
        }
      } finally {
        setLoading(false);
      }
    }

    fetchRepos();
    return () => controller.abort();
  }, [owner, perPage]);

  return { repos, loading, error };
}
