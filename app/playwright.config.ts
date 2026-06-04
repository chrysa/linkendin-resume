import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright E2E configuration for the cv-online app.
 *
 * The app is served through Vite preview, which honours the `base`
 * ('/linkendin-resume/') from vite.config.ts. The webServer builds and
 * previews the app directly (vite build && vite preview) to avoid coupling
 * the E2E run to the `tsc` step of `npm run build`.
 */
const PORT = 4173;
const BASE_PATH = '/linkendin-resume/';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? [['list'], ['html', { open: 'never' }]] : 'list',
  use: {
    baseURL: `http://localhost:${PORT}${BASE_PATH}`,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: `npx vite build && npx vite preview --port ${PORT} --strictPort`,
    url: `http://localhost:${PORT}${BASE_PATH}`,
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
});
