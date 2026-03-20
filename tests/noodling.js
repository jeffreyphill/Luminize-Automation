//Global Variable Definitions
//consider changing the name to Kickoff or something

const { chromium } = require('playwright'); 
const { expect } = require ('@playwright/test');
const {defineConfig } = require ('@playwright/test');

//const { elementNameIsVisible, spaceReplace, slashAndSplit } = require ('../utils/common.js');
const { arrayDivFromDiv, goToSleep } = require ('../utils/page_navigation.js');


//LOGIN With Chrome
(async () => {  
  // Replace with YOUR Chrome path  
    const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';  
    const browser = await chromium.launch
    ({  
      
      headless: false,  
      channel: undefined,
      executablePath: chromePath // Key: Use installed Chrome  
    }
  );

 //open Overwatch Test URL
  const page = await browser.newPage();  
  await page.goto('https://staging.overwatch.luminize.com');  

  //Wait for element
  //const pageTitle = await page.title();
  await expect(page).toHaveTitle(/Overwatch/);
  console.log('Page title:', page.title());  
 
  //short wait
   await goToSleep(page, 100);

  // ***Main Login Screen***
  //wait for element to appear
  await page.fill('#username','jeff@mail2cowboy.com');
  //await page.click("[id='username']");
   await goToSleep(page, 500);
  await page.fill('#password','Ov3rw@tch');
  //  await page.waitForTimeout(100);
  await page.getByText('Access Dashboard').click(); //testing
  console.log("Login Clicked...");
  // *** End Login ***

  // ********** Wait for Brand Selector Element **************
  
  const pageElement =  page.locator('button[data-sidebar="menu-button"]');
  //page.getByLabel('breadcrumb').getByRole('link', { name: 'Home' });
  //Assert: Home sidebar option must be viewable
  await expect (pageElement).toBeVisible({timeout: 25000}); //long time out in this case
        
 
// ********* find brand pulldown
// this took way too long to figure out 
//click on the Brand Toggle
await page.locator('button[data-sidebar="menu-button"]').click();
//await the searchbox
await page.getByLabel('Suggestions').isVisible();
console.log("found the Brand Search Box");

// get list of available brands as array

const brands = page.locator('div[cmdk-group-items][role="group"]');
const brandList = await arrayDivFromDiv(brands);
console.log ('Array of Brands: \n' + brandList);




})();  