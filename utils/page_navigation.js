/**
 * page_navigation.js -- Reusable helpers for interacting with page elements.
 *
 * IMPORTANT PLAYWRIGHT CONCEPT -- Auto-waiting:
 *   Most Playwright actions (click, fill, etc.) automatically wait for the
 *   element to be visible and actionable. You rarely need explicit sleeps.
 *   Use `expect(locator).toBeVisible({ timeout })` when you need to assert
 *   visibility, and `locator.waitFor()` when you need to wait before acting.
 *
 *   Avoid `page.waitForTimeout()` (hard sleeps) -- they slow down tests and
 *   make them flaky. The helpers below have been updated to remove them.
 *
 * Usage:
 *   import { clickLink, elementByRole } from '../utils/page_navigation.js';
 */

/**
 * Click a sidebar or navigation link by its accessible name, then wait for
 * the network to settle (no pending requests for 500 ms).
 *
 * @param {import('@playwright/test').Page} page
 * @param {string} linkName - The visible / accessible name of the link.
 */
export async function clickLink(page, linkName) {
  await page.getByRole('link', { name: linkName }).click();
  await page.waitForLoadState('networkidle');
}

/**
 * Click an element by its ARIA role and accessible name, then wait for
 * network activity to settle.
 *
 * @param {import('@playwright/test').Page} page
 * @param {string} role - ARIA role (e.g. 'link', 'button', 'heading').
 * @param {string} name - Accessible name of the element.
 */
export async function elementByRole(page, role, name) {
  await page.getByRole(role, { name }).click();
  await page.waitForLoadState('networkidle');
}

/**
 * Click an element located by its CSS id.
 *
 * @param {import('@playwright/test').Page} page
 * @param {string} id - The element's id attribute (without '#').
 */
export async function clickElement(page, id) {
  await page.locator(`#${id}`).click();
}

/**
 * Click an element whose text content matches `text` (located by id selector).
 *
 * @param {import('@playwright/test').Page} page
 * @param {string} text - Text used to build the `#text` selector.
 */
export async function clickTextElement(page, text) {
  await page.locator(`#${text}`).click();
}

/**
 * Return the last segment of the current page URL.
 *
 * Example: if the URL is "https://app.com/brands/solo/settings",
 *          this returns "settings".
 *
 * @param {import('@playwright/test').Page} page
 * @returns {Promise<string>}
 */
export async function urlLastLeaf(page) {
  const url = page.url();
  return url.slice(url.lastIndexOf('/') + 1);
}

/**
 * Collect the text content of all direct `<div>` children of a parent locator
 * and return them as an array.
 *
 * @param {import('@playwright/test').Locator} parentLocator
 * @returns {Promise<string[]>}
 */
export async function arrayDivFromDiv(parentLocator) {
  const children = parentLocator.locator('div');
  const count = await children.count();
  const results = [];
  for (let i = 0; i < count; i++) {
    results.push(await children.nth(i).textContent());
  }
  return results;
}
