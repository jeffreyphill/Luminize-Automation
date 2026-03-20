// playwright.config.js
const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  reporter: [
    ['list'],                     // Console output
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['json', { outputFile: 'report.json' }],
    ['junit', { outputFile: 'results.xml' }],
    //['allure-playwright']         // If using Allure
  ],

  use: {
    headless: false,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure'
  },

  projects: [
    {
      name: 'chrome-native',
      use: {
        ...devices['Desktop Chrome'],
        browserName: 'chromium',

        // IMPORTANT: disable Playwright's built‑in Chrome/Chromium
        channel: undefined,

        // Windows 11 default Chrome installation path
        executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
      },
    },
  ],
});
