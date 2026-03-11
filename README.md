# Luminize Overwatch -- Playwright Automation

End-to-end test suite for the [Luminize Overwatch](https://test.auth.overwatch.luminize.com) dashboard, built with [Playwright](https://playwright.dev/).

---

## Quick Start

```bash
# 1. Install dependencies (includes Playwright + browsers)
npm install
npx playwright install

# 2. Create your .env file from the template
cp .env.example .env
# Then edit .env and fill in your Overwatch credentials.

# 3. Run the tests
npm test               # all browsers
npm run test:chromium  # Chromium only (fastest)
npm run test:headed    # watch the browser in real-time
npm run test:debug     # step-through debugger
npm run test:ui        # interactive UI mode

# 4. View the HTML report after a run
npm run report
```

---

## Project Structure

```
Luminize-Automation/
├── .env.example             # Template for environment variables
├── .gitignore
├── package.json
├── playwright.config.js     # Playwright configuration (baseURL, browsers, etc.)
│
├── tests/                   # Test files picked up by the runner (*.spec.js)
│   └── login.spec.js        # Login flow + sidebar navigation tests
│
├── utils/                   # Shared helper functions imported by tests
│   ├── common.js            # String/URL/math utilities
│   └── page_navigation.js   # Click, navigate, and inspect page helpers
│
└── scratch/                 # Experimental scripts (NOT run by the test runner)
    ├── initial-test.js
    ├── function-test.js
    └── strings.js
```

**Why the `scratch/` folder?** Files ending in `.spec.js` inside `tests/` are
automatically executed by Playwright. The experimental scripts don't use
`test()` blocks and would fail if the runner tried to execute them, so they've
been moved out. Feel free to keep experimenting there.

---

## How Playwright Tests Work (Crash Course)

### The Test Runner vs. Standalone Scripts

The original `Login.spec.js` launched a browser manually:

```js
// OLD approach -- standalone script
const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  // ...
})();
```

The Playwright **Test Runner** handles all of that for you:

```js
// NEW approach -- Playwright Test
import { test, expect } from '@playwright/test';

test('my test', async ({ page }) => {
  // `page` is provided automatically -- no launch/close needed.
  await page.goto('/');
  await expect(page).toHaveTitle(/Overwatch/);
});
```

Benefits of the test runner:
- Automatic browser lifecycle (launch, new context, close).
- Parallel execution across browsers and test files.
- Built-in HTML reporter, trace viewer, and screenshot-on-failure.
- `baseURL` in config so you write `page.goto('/')` instead of the full URL.

### Auto-Waiting (stop using `waitForTimeout`!)

Playwright **automatically waits** for elements before interacting:

```js
// Playwright waits for the button to be visible & enabled before clicking.
await page.getByRole('button', { name: 'Submit' }).click();

// expect() retries the assertion until it passes (up to the timeout).
await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
```

Hard waits (`page.waitForTimeout(3000)`) should be an absolute last resort.
They slow down tests and make them flaky -- if the app is faster than the
wait, you waste time; if it's slower, the test breaks.

### Locator Strategy (best to worst)

| Priority | Strategy | Example |
| -------- | -------- | ------- |
| 1 | Role + name | `page.getByRole('button', { name: 'Login' })` |
| 2 | Label / placeholder | `page.getByLabel('Email')` |
| 3 | Test ID | `page.getByTestId('submit-btn')` |
| 4 | CSS selector | `page.locator('.btn-primary')` |
| 5 | XPath | `page.locator('xpath=//div[2]/span')` |

Prefer **role-based** locators -- they mirror how users perceive the page and
are resilient to HTML structure changes. Avoid absolute XPath like
`xpath=/html/body/div[2]/div/div[2]` because any DOM change breaks it.

---

## Key Concepts Demonstrated in This Project

### Environment Variables for Secrets

Credentials live in a `.env` file (git-ignored) instead of hardcoded in tests:

```js
const USERNAME = process.env.OW_USERNAME || '';
```

### Serial Tests with Shared State

`test.describe.serial` runs tests in order and shares a single browser page.
This is useful for login flows where later tests depend on being authenticated:

```js
test.describe.serial('Login flow', () => {
  let page;
  test.beforeAll(async ({ browser }) => { page = await browser.newPage(); });
  test.afterAll(async () => { await page.close(); });

  test('login', async () => { /* ... */ });
  test('navigate to settings', async () => { /* depends on login */ });
});
```

### Reusable Utility Functions

Common actions are extracted into `utils/` so tests stay readable:

```js
import { clickLink } from '../utils/page_navigation.js';

test('go to Settings', async () => {
  await clickLink(page, 'Settings');
  await expect(page.getByRole('heading', { name: 'Settings' })).toBeVisible();
});
```

---

## Bugs Fixed in This Refactor

| File | Bug | Fix |
| ---- | --- | --- |
| `utils/common.js` | `.toLowerCase` missing `()` -- returns the function itself, not the lowercased string | Changed to `.toLowerCase()` |
| `utils/common.js` | `elementNameIsVisible` never `await`s `isVisible()`, so the `if` always gets a truthy Promise | Replaced polling loop with `locator.waitFor()` |
| `utils/common.js` | `junkStuff` references global `page` that doesn't exist | Removed dead code |
| `utils/page_navigation.js` | Every function uses `waitForTimeout` hard sleeps | Replaced with `waitForLoadState('networkidle')` or removed entirely |
| `Login.spec.js` | Uses `require()` to import ESM `export` functions -- module mismatch | Converted to proper ESM `import` syntax |
| `Login.spec.js` | Hardcoded Windows Chrome path | Removed -- Playwright bundles its own browsers |
| `Login.spec.js` | Hardcoded credentials | Moved to `.env` environment variables |
| `Login.spec.js` | Not a Playwright Test -- can't benefit from runner features | Rewritten with `test()` blocks |

---

## Next Steps & Ideas

- **Add more test files** -- e.g. `brand-switching.spec.js`, `administration.spec.js`.
- **Authentication state reuse** -- use `storageState` to save cookies after login so other test files don't need to log in again. See: https://playwright.dev/docs/auth
- **Page Object Model (POM)** -- as the suite grows, extract page-specific locators and actions into classes. See: https://playwright.dev/docs/pom
- **CI integration** -- run tests on every push with GitHub Actions. Playwright has an official Action: https://playwright.dev/docs/ci-intro
- **Visual regression testing** -- use `expect(page).toHaveScreenshot()` to catch unintended UI changes.
- **API testing** -- Playwright can also test REST APIs directly with `request` fixtures, useful for setting up test data.

---

## Useful Commands

```bash
npx playwright test --headed                    # Watch tests run in the browser
npx playwright test --project=chromium          # Run in Chromium only
npx playwright test --debug                     # Step-through debugger
npx playwright test --ui                        # Interactive UI mode
npx playwright test tests/login.spec.js         # Run a specific test file
npx playwright test -g "should navigate"        # Run tests matching a pattern
npx playwright show-report                      # Open the HTML report
npx playwright codegen https://example.com      # Record actions -> generate code
```

## Resources

- [Playwright Documentation](https://playwright.dev/docs/intro)
- [Playwright Best Practices](https://playwright.dev/docs/best-practices)
- [Locators Guide](https://playwright.dev/docs/locators)
- [Assertions Reference](https://playwright.dev/docs/test-assertions)
- [Authentication Guide](https://playwright.dev/docs/auth)
- [Page Object Model](https://playwright.dev/docs/pom)
- [Trace Viewer](https://playwright.dev/docs/trace-viewer-intro)
