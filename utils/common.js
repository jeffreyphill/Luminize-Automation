//Math Funtions
//add
export function plus(a,b) {
    return a + b
}

//multiply
export function product (a, b) 
{
    return a*b
}

//String funtions
//replace space with hyphen - for url

export function spaceReplace(input){
	return input.replace(/ /g,"-").toLowerCase;
}

export function slashAndSplit (urlText){
    var parts = urlText.split("/");
    return parts[parts.length - 1].toLowerCase; // Or parts.pop();
}



export function urlContains(str1, str2) {
    let string1 = str1.toLowerCase();
    let string2 =str2.toLowerCase()

    if (string1.includes(string2)) {
        return true;
    } else {
        return false;
    }

}
//next function
export async function elementNameIsVisible(myPage, myName){
    let i = 0;
    await myPage.waitForTimeout(10000);
    do {
//        if (page.locator("\'#"+ myName + "\'").isVisible()) 
            console.log('you are in the elementIsVisible function');
        if (myPage.locator('#'+ myName).isVisible()) 
        {
            console.log(myName + ' element is visible');
            i = 25;
            return true;
        } else {
            await myPage.waitForTimeout(1000);
        }
    
    } while(i<25);
    return false

}
export function clickElement(name){



    return true;
}

export async function junkStuff(foo, bar) {
//this is a function of code I did not want to throw away
 let i = 0;
  //wait two seconds
  await page.waitForTimeout(2000);
  do {
    //test for element visibility
    //const notHome = page.locator('#Home').isVisible();
    if (page.locator('#Sign Out').isVisible()) 
      {
         console.log("Home link is visible");
         i = 10;
        

      } else {
         await page.waitForTimeout(2000);
          console.log('iteration: ' + i)
         i++;
      }
    
  } while (i < 10);

  //Wait for Advertising element to appear
      if(await expect(page.getByText('Settings')).toBeVisible())
    {
      await page.locator.getByText('Settings').click()
            console.log(page.url());
    } else {

  console.log('error');
  //find out how to end script
  }
//TRYING TO FIND WAYS TO GET BRAND LIST
//page.locator('span.myClass').getByText('truncate font-medium').click(); 
// page.getByRole('button').nth(1).click();
//page.locator('span.status', { hasText: 'truncate font-medium' }).click();
//page.getByRole('combobox').click();
//await page.getByRole('button').nth(1).click();
//wait until the proper header exists
//await expect(page.getByRole('heading', {name: 'Subscribe & Save', exact: true})).toBeVisible({timeout: 10000});



}