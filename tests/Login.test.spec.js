//Global Variable Definitions
//const { chromium } = require('playwright'); 
//const { test, expect} = require ('@playwright/test');
const { test, expect } = require('../fixtures/fixtures.js');
const baseURL = 'https://test.auth.overwatch.luminize.com';


// Configure all tests in this file to run serially
test.describe.configure({ mode: 'serial' });
let context;
let page;

//wait function
function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

//Open one single context and use the same page
test.beforeAll(async ({ browser }) => {
// Create a single browser context for all tests
context = await browser.newContext();
//page = await context.newPage();
});

test("Navigate to Overwatch", async ({page}) => {
    await page.goto(baseURL);
    await expect(page.getByText('Access Dashboard')).toBeVisible({timeout: 10000});
    //example: await expect(page.getByRole('heading', {name: 'Settings'})).toBeVisible({timeout: 20000});
})

test("Bad Credentials", async ({page}) => {
    await page.goto(baseURL);
    await page.locator('#username').fill('testing@test1.com');
    await page.locator('#password').fill('Overw@tch');

    //Click on Login Button
    await page.getByText('Access Dashboard').click(); //Click the Login button

    // let's pause
    await wait(5000);

    //get a parameter of the error icon
    //const badCredential =   page.getByText('Wrong email or password', {exact: false});
    //page.locator('//span[contains(@id,"error-element-password")]');
    //console.log(badCredential.allTextContents());

    //Expect error message and Icon
    await Promise.all([
        expect(page.locator('//span[contains(@class,"ulp-input-error-icon")]').nth(0)).toBeVisible(),
        expect(page.locator('//span[contains(@class,"ulp-input-error-icon")]').nth(1)).toBeVisible()
    ]);

}
)

//test("Successful Login", async ({loggedInPage}) => {
//Good login
    //await page.goto(baseURL);

    //we know we are at the login page with a good email 
    //await page.locator('#username').fill('jeff@mail2cowboy.com');
    //await page.fill('#password','Ov3rw@tch');
    
    //Click on Login Button
  //  await page.getByText('Access Dashboard').click(); //Click the Login button

    //Assert that Watchtower is available
    //await expect(page.getByRole('link', { name: 'ASIN Watchtower' })).toBeVisible({timeout: 15000});

//}
//)

test("Home Page", async ({loggedInPage}) => {
    await page.locator('button[data-sidebar="menu-button"]').click();
   console.log("url: "+ page.url());

})