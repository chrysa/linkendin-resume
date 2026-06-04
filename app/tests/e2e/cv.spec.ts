import { expect, test } from '@playwright/test';

/**
 * E2E suite for the cv-online single-page CV.
 * Satisfies CODE_MANIFEST §6.4 / ADR D-0002.
 *
 * The navbar (.navbar) only mounts after window.scrollY > 60, so any test
 * that drives navbar controls scrolls first to reveal it.
 */

const SECTION_TESTIDS = [
  'hero',
  'impact-metrics',
  'experience-timeline',
  'skills-cloud',
  'projects-grid',
  'education-section',
  'contact-section',
] as const;

/** Scroll down to reveal the scroll-gated navbar, then wait for it. */
async function revealNavbar(page: import('@playwright/test').Page) {
  await page.mouse.wheel(0, 800);
  const navbar = page.locator('nav.navbar');
  await expect(navbar).toBeVisible();
  return navbar;
}

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#main-content')).toBeVisible();
});

test('renders the main content landmark and all 7 sections', async ({ page }) => {
  await expect(page.locator('#main-content')).toBeVisible();
  for (const id of SECTION_TESTIDS) {
    await expect(page.getByTestId(id)).toBeVisible();
  }
});

test('footer exposes the source link to the GitHub repository', async ({ page }) => {
  const source = page.locator('footer.footer a.footer__source');
  await expect(source).toBeVisible();
  await expect(source).toHaveAttribute('href', 'https://github.com/chrysa/linkendin-resume');
});

test('document html element carries a lang attribute', async ({ page }) => {
  const lang = await page.locator('html').getAttribute('lang');
  expect(lang, 'html[lang] must be set by useDocumentMeta').toBeTruthy();
  expect(lang).toMatch(/^(en|fr)/);
});

test('contact modal opens from the navbar and closes on Escape', async ({ page }) => {
  const navbar = await revealNavbar(page);

  // The navbar Contact button is the primary CTA.
  await navbar.getByRole('button', { name: /contact/i }).click();

  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();

  await page.keyboard.press('Escape');
  // Modal unmounts on close (AnimatePresence).
  await expect(page.getByRole('dialog')).toHaveCount(0);
});

test('theme toggle flips documentElement data-theme', async ({ page }) => {
  await revealNavbar(page);

  const before = await page.evaluate(() => document.documentElement.dataset.theme ?? '');
  await page.locator('button.theme-toggle').click();

  await expect.poll(async () => page.evaluate(() => document.documentElement.dataset.theme ?? '')).not.toBe(before);

  const after = await page.evaluate(() => document.documentElement.dataset.theme ?? '');
  expect(['dark', 'light']).toContain(after);
});

test('language switch flips the html lang attribute', async ({ page }) => {
  const navbar = await revealNavbar(page);

  const langBefore = await page.locator('html').getAttribute('lang');

  // The language toggle in the navbar advertises the target language.
  await navbar.getByRole('button', { name: /Switch to English|Passer en français/ }).click();

  await expect.poll(async () => page.locator('html').getAttribute('lang')).not.toBe(langBefore);
});
