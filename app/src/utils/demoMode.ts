/**
 * Demo mode flag.
 *
 * Driven by the `VITE_DEMO_MODE` build-time env var (off by default). When on,
 * every external-API read path serves realistic inline fixtures instead of
 * hitting real services (e.g. the public GitHub API), so the whole app is
 * explorable without any real credentials or network access.
 */
export function isDemoMode(): boolean {
  return import.meta.env.VITE_DEMO_MODE === 'true';
}
