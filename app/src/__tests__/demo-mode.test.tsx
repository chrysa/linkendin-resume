import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, renderHook, waitFor } from '@testing-library/react';

// The demo flag is read through a single helper so tests can toggle it
// deterministically without touching import.meta.env.
const isDemoMode = vi.fn<() => boolean>();
vi.mock('@/utils/demoMode', () => ({ isDemoMode: () => isDemoMode() }));

import { DemoBanner } from '@/components/ui/DemoBanner';
import { useGitHubRepos } from '@/hooks/useGitHubRepos';
import { DEMO_REPOS } from '@/data/demoRepos';

describe('demo mode', () => {
  beforeEach(() => {
    isDemoMode.mockReset();
  });

  describe('DemoBanner', () => {
    it('renders an amber status banner when demo mode is on', () => {
      isDemoMode.mockReturnValue(true);
      render(<DemoBanner />);

      const banner = screen.getByTestId('demo-banner');
      expect(banner).toBeInTheDocument();
      expect(banner).toHaveAttribute('role', 'status');
      expect(banner).toHaveTextContent(/no real credentials/i);
    });

    it('renders nothing when demo mode is off', () => {
      isDemoMode.mockReturnValue(false);
      const { container } = render(<DemoBanner />);

      expect(screen.queryByTestId('demo-banner')).not.toBeInTheDocument();
      expect(container).toBeEmptyDOMElement();
    });
  });

  describe('useGitHubRepos', () => {
    it('serves inline fixtures and never fetches when demo mode is on', async () => {
      isDemoMode.mockReturnValue(true);
      const fetchSpy = vi.spyOn(globalThis, 'fetch');

      const { result } = renderHook(() => useGitHubRepos({ owner: 'chrysa' }));

      await waitFor(() => expect(result.current.loading).toBe(false));

      expect(fetchSpy).not.toHaveBeenCalled();
      expect(result.current.error).toBeNull();
      expect(result.current.repos.length).toBeGreaterThan(0);
      expect(result.current.repos.map((r) => r.id)).toEqual(DEMO_REPOS.map((r) => r.id));

      fetchSpy.mockRestore();
    });

    it('respects perPage when slicing fixtures', async () => {
      isDemoMode.mockReturnValue(true);
      const { result } = renderHook(() => useGitHubRepos({ owner: 'chrysa', perPage: 2 }));

      await waitFor(() => expect(result.current.loading).toBe(false));
      expect(result.current.repos).toHaveLength(2);
    });
  });
});
