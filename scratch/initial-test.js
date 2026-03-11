// chrome-script.js  
const { chromium } = require('playwright');  
 
(async () => {  
  // Replace with YOUR Chrome path  
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';  
 
  const browser = await chromium.launch({  
    headless: false,  
    executablePath: chromePath // Key: Use installed Chrome  
  });  
 
  const page = await browser.newPage();  
  await page.goto('https://example.com');  
  console.log('Page title:', await page.title());  
 
  // Optional: Log browser version to confirm  
  const version = await browser.version();  
  console.log('Using browser:', version);  
  await page.waitForTimeout(5000);
  await page.goto('https://test.auth.overwatch.luminize.com');  
  //await browser.close();  
})();  
