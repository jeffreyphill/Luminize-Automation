// Overwatch Login script
// in future we will migrate to a async login function
//Confidential Property of Luminize
//Date: 02-27-2026

//Global Variable Definitions
const { chromium } = require('playwright'); 
const { expect } = require ('@playwright/test');
const { elementNameIsVisible, spaceReplace, slashAndSplit } = require ('../utils/common.js');
const{ clickTextElement, goToSleep, elementByRole } = require ('../utils/page_navigation.js');
 

//LOGIN With Chrome
(async () => {  
  // Replace with YOUR Chrome path  
    const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';  
    const browser = await chromium.launch({  
      headless: false,  
      executablePath: chromePath // Key: Use installed Chrome  
  });  
 //open Overwatch Test URL
  const page = await browser.newPage();  
  await page.goto('https://test.auth.overwatch.luminize.com');  

  //Hard Timeout
  await goToSleep(page, 1000);
  
  //Wait for element

  //Test case - expect title to have Overwatch
  //console.log('Page title:', await page.title());  
  await expect (page).toHaveTitle(/Overwatch/);
  console.log('Page title contains Overwatch'); 


  // ***Main Login Screen***
  //short wait
   await goToSleep(page, 100);
  //wait for element to appear
  await page.fill('#username','jeff@test.com');
  //await page.click("[id='username']");
   await goToSleep(page, 500);
  await page.fill('#password','xxxxxxxxxx');
  //  await page.waitForTimeout(100);
  await page.getByText('Access Dashboard').click(); //testing
  console.log("Login Clicked...");
  // *** End Login ***

  // *** Overwatch Splashscreen
  await goToSleep(page, 1000);   
  //type spacebar at splashscreen
  await page.keyboard.press('Space'); 

  // ********** Wait for Home Element **************
  const pageElement =  page.getByLabel('breadcrumb').getByRole('link', { name: 'Home' });
  //Assert: Home sidebar option must be viewable
  await expect (pageElement).toBeVisible({timeout: 25000}); //long time out in this case

  //click on Settings sibdebar navigation
await page.getByRole('link', { name: 'Settings' }).click();

//Assertion: Setting Page will have Header called *Settings*
await expect(page.getByRole('heading', {name: 'Settings'})).toBeVisible({timeout: 10000});

//Another example, does URL include the text *settings*
  //URL should contain the word settings
  if (page.url().includes('settings')) {
        console.log("assertion matches");
    } else {
        console.log("assertion fails");
    }

// ********* Click on ASIN Watchtower Sidebar Link
await page.getByRole('link', { name: 'ASIN Watchtower' }).click();

//wait until the proper header exists
await expect(page.getByRole('heading', {name: 'ASIN Watchtower'})).toBeVisible({timeout: 10000});

// ********* Click on Advertising Sidebar Link
await elementByRole(page, 'link', 'Advertising' ); //using reusable function

//wait until the proper header exists
await expect(page.getByRole('heading', {name: 'Advertising'})).toBeVisible({timeout: 10000});

// ********* Click on Buy Box Sidebar Link
await elementByRole(page, 'link', 'Buy Box' ); //using reusable function

//wait until the proper header exists
await expect(page.getByRole('heading', {name: 'Buy Box Monitor'})).toBeVisible({timeout: 10000});

// ********* Click on Customer Analytics Sidebar Link
await elementByRole(page, 'link', 'Customer Analytics' ); //using reusable function

//wait until the proper header exists
await expect(page.getByRole('heading', {name: 'Customer Analytics'})).toBeVisible({timeout: 10000});

// ********* Click on Subscribe & Save Sidebar Link
await page.getByRole('link', { name: 'Subscribe and Save' }).click();

//wait until the proper header exists
await expect(page.getByRole('heading', {name: 'Subscribe & Save', exact: true})).toBeVisible({timeout: 10000});

// ********* Click on Administration Sidebar Link (admin role only)
//await elementByRole(page, 'link', 'Administration'); //using reusable function

//wait until the proper header exists
//await expect(page.getByRole('heading', {name: 'Administration'})).toBeVisible({timeout: 10000});

// this took way too long to figure out 
//click on the Brand Toggle
await page.locator('button[data-sidebar="menu-button"]').click();
//await the searchbox
await page.getByLabel('Suggestions').isVisible();
console.log("found Brand listbox");

// ************ from Noodling

if ( page.locator('xpath=/html/body/div[2]/div/div[2]/div[2]/div/div').isVisible()) {
console.log('Element is visible,continuing with script...');
} else {
console.log('Element not found or hidden.');
}

//const testElement = page.locator()

const  brandElements = page.locator('xpath=/html/body/div[2]/div/div[2]/div[2]/div/div').locator('[data-value="SOLO"]');
console.log(brandElements.locator('//preceding-sibling::[1]').innerText) ;



// ********* end noodling





// Click on another brand
await page.locator('xpath=/html/body/div[2]/div/div[2]/div[2]/div/div').locator('[data-value="SOLO"]').click();

//Check URL 
await expect(page).toHaveURL(/.*\/solo\/.*/, { timeout: 25000 });


//Toggle sidebar
await page.getByRole('button', { name: 'Toggle Sidebar' }).click();
//state now is minimized

// Click Home - first item with div text - mr-2
//await page.locator('div').filter({ hasText: 'mr-2'}).nth(1).click();
await page.locator('(//span[@class="mr-2"])[2]').click();

//pause
goToSleep(page, 1000);

//Toggle again
await page.getByRole('button', { name: 'Toggle Sidebar' }).click();
//await page.reload();
//console.log('current url: ' + page.url());
console.log('last line of code');

})();  