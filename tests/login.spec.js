/**
 * login.spec.js -- End-to-end login & sidebar navigation tests for Overwatch.
 *
 * KEY DIFFERENCES from the original Login.spec.js:
 *
 *  1. Uses `test()` blocks so the Playwright Test runner manages browser
 *     lifecycle, parallelism, retries, and reporting automatically.
 *  2. Uses `baseURL` from playwright.config.js instead of a hardcoded URL.
 *  3. Reads credentials from environment variables (see .env.example).
 *  4. No manual `chromium.launch()` -- the runner provides `page` via fixtures.
 *  5. Replaces every `waitForTimeout` with proper auto-waiting or assertions.
 *  6. Each logical check is its own `test()` so failures are isolated and the
 *     HTML report shows exactly which step broke.
 */

import { test, expect } from '@playwright/test';
import { clickLink, elementByRole } from '../utils/page_navigation.js';

const USERNAME = process.env.OW_USERNAME || '';
const PASSWORD = process.env.OW_PASSWORD || '';

/**
 * `test.describe` groups related tests.  `test.describe.serial` ensures they
 * run in order and share state (one browser context) -- important here because
 * later tests depend on being logged in.
 */
test.describe.serial('Overwatch Login & Sidebar Navigation', () => {
  /** @type {import('@playwright/test').Page} */
  let page;

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
  });

  test.afterAll(async () => {
    await page.close();
  });

  // ── Login ────────────────────────────────────────────────────────

  test('should load the login page with "Overwatch" in the title', async () => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Overwatch/);
  });

  test('should log in and reach the home dashboard', async () => {
    await page.fill('#username', USERNAME);
    await page.fill('#password', PASSWORD);
    await page.getByText('Access Dashboard').click();

    // Dismiss splash screen
    await page.keyboard.press('Space');

    // Wait for the Home breadcrumb -- proves we're past the splash screen.
    const homeBreadcrumb = page.getByLabel('breadcrumb').getByRole('link', { name: 'Home' });
    await expect(homeBreadcrumb).toBeVisible({ timeout: 30_000 });
  });

  // ── Sidebar navigation (each page asserts its heading) ──────────

  test('should navigate to Settings', async () => {
    await clickLink(page, 'Settings');
    await expect(page.getByRole('heading', { name: 'Settings' })).toBeVisible({ timeout: 10_000 });
    expect(page.url()).toContain('settings');
  });

  test('should navigate to ASIN Watchtower', async () => {
    await clickLink(page, 'ASIN Watchtower');
    await expect(page.getByRole('heading', { name: 'ASIN Watchtower' })).toBeVisible({ timeout: 10_000 });
  });

  test('should navigate to Advertising', async () => {
    await elementByRole(page, 'link', 'Advertising');
    await expect(page.getByRole('heading', { name: 'Advertising' })).toBeVisible({ timeout: 10_000 });
  });

  test('should navigate to Buy Box', async () => {
    await elementByRole(page, 'link', 'Buy Box');
    await expect(page.getByRole('heading', { name: 'Buy Box Monitor' })).toBeVisible({ timeout: 10_000 });
  });

  test('should navigate to Customer Analytics', async () => {
    await elementByRole(page, 'link', 'Customer Analytics');
    await expect(page.getByRole('heading', { name: 'Customer Analytics' })).toBeVisible({ timeout: 10_000 });
  });

  test('should navigate to Subscribe & Save', async () => {
    await page.getByRole('link', { name: 'Subscribe and Save' }).click();
    await expect(
      page.getByRole('heading', { name: 'Subscribe & Save', exact: true })
    ).toBeVisible({ timeout: 10_000 });
  });

  // ── Brand switching ─────────────────────────────────────────────

  test('should switch brand to SOLO via the brand picker', async () => {
    await page.locator('button[data-sidebar="menu-button"]').click();
    await expect(page.getByLabel('Suggestions')).toBeVisible();

    await page.locator('[data-value="SOLO"]').click();
    await expect(page).toHaveURL(/.*\/solo\/.*/, { timeout: 25_000 });
  });

  // ── Sidebar toggle ─────────────────────────────────────────────

  test('should toggle the sidebar collapsed and expanded', async () => {
    const toggle = page.getByRole('button', { name: 'Toggle Sidebar' });
    await toggle.click();
    await toggle.click();
  });
});
