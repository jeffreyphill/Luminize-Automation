//Fixture
//import { test as baseTest } from '@playwright/test';
const base = require ('@playwright/test');
const baseURL = 'https://test.auth.overwatch.luminize.com/';

const test = base.extend({
  loggedInPage: async ({ page }, use) => 
    {
    //navigate and log in
    await page.goto('https://test.auth.overwatch.luminize.com/');
    console.log("AuthURL: " + page.url());
    await page.locator('#username').fill('jeff@mail2cowboy.com');
    await page.locator('#password').fill('test@123');
//    await page.fill('#password','test@123');
        //Click on Login Button
    await page.getByText('Access Dashboard').click(); //Click the Login button

    //Assert that Watchtower is available (or find another key)
    await expect(page.getByRole('link', { name: 'ASIN Watchtower' })).toBeVisible({timeout: 15000});
    console.log('Fixture login complete');
    await use(page);
    // Teardown logic, if any
    console.log('teardown');
  }
});
module.exports = { test, expect: base.expect };