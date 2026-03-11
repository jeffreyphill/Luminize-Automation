/**
 * common.js -- General-purpose utility functions for string manipulation,
 * URL inspection, and basic math. These are imported into test files as needed.
 *
 * Usage (inside a Playwright test file):
 *   import { spaceReplace, urlContains } from '../utils/common.js';
 */

// ──────────────────────────────────────────────
//  Math helpers (kept for learning / experimentation)
// ──────────────────────────────────────────────

export function plus(a, b) {
  return a + b;
}

export function product(a, b) {
  return a * b;
}

// ──────────────────────────────────────────────
//  String / URL helpers
// ──────────────────────────────────────────────

/**
 * Replace every space in `input` with a hyphen and lowercase the result.
 * Useful for comparing URL slugs to human-readable page names.
 *
 * Example: spaceReplace("ASIN Watchtower") => "asin-watchtower"
 *
 * NOTE: The original code was missing () on .toLowerCase -- it is a method
 * call, not a property access.
 */
export function spaceReplace(input) {
  return input.replace(/ /g, '-').toLowerCase();
}

/**
 * Return the last path segment of a URL string, lowercased.
 *
 * Example: slashAndSplit("https://app.com/brands/solo/settings") => "settings"
 */
export function slashAndSplit(urlText) {
  const parts = urlText.split('/');
  return parts[parts.length - 1].toLowerCase();
}

/**
 * Case-insensitive check: does `str1` contain `str2`?
 */
export function urlContains(str1, str2) {
  return str1.toLowerCase().includes(str2.toLowerCase());
}

/**
 * Wait for an element selected by `#name` to become visible.
 *
 * Prefer Playwright's built-in `expect(locator).toBeVisible({ timeout })`
 * over manual polling loops -- it handles retry logic automatically and
 * produces clear error messages on failure.
 *
 * @param {import('@playwright/test').Page} page
 * @param {string} name  - The element's ID (without the '#' prefix).
 * @param {number} [timeoutMs=25000] - Maximum time to wait.
 * @returns {Promise<boolean>} true if visible within the timeout, false otherwise.
 */
export async function elementNameIsVisible(page, name, timeoutMs = 25000) {
  try {
    await page.locator(`#${name}`).waitFor({ state: 'visible', timeout: timeoutMs });
    return true;
  } catch {
    return false;
  }
}
