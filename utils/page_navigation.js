//Hard Wait
export async function goToSleep(pageElement, secs){

    await pageElement.waitForTimeout(secs);

} 

//check if element is visible wit 25 second wait
export async function elementNameIsVisible(myPage, myName){
//In this function we wait up to 25 seconds prior to returning false
//we check every 1 second to verify if the expected page is visible
//once visible, we return True    
    let i = 0;
    await myPage.waitForTimeout(1000);
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

//click on the page element by ID Text
export async function clickTextElement(pageElement, elementText){
    console.log('id= ' + '#'+ elementText);
    await pageElement.locator('#'+ elementText).click();

}

//Click element By Id Name
export async function clickElement(pageElement, elementName){
    console.log('id= ' + '#'+ elementName);
    await pageElement.locator('#'+ elementName).click();
    console.log('id= ' + '***'+ elementName);
    await pageElement.waitForTimeout(1000);
}

//Click on element By Role with name
export async function elementByRole(pageElement, roleType, roleName){
   // console.log('id= ' + '#'+ elementName);
    await pageElement.getByRole(roleType, {name: roleName}).click();
    //console.log('name: ' + roleName);
    await pageElement.waitForTimeout(2000);
    console.log('return: ' + pageElement.url());
}

//Click on LINK element
export async function clickLink(pageElement, roleName){
    await pageElement.getByRole('link', { name: roleName }).click();
    //console.log('name: ' + roleName);
    await pageElement.waitForTimeout(2000);
    //await pageElement.reload();
    console.log('return: ' + pageElement.url());
}

//find last leaf of URL Tree
 export async function urlLastLeaf(pageElement){
 const pageURL = await pageElement.url();
 console.log(pageURL);
 await pageElement.waitForTimeout(1000);
 return pageURL.slice(pageURL.lastIndexOf("/") + 1);
 }

 //array of text from DIV tag parent with DIV children
 export async function arrayDivFromDiv(pageRef){
    const childDivsLocator = pageRef.locator('div');
    const itemCount = await childDivsLocator.count();
    // define Array
    const outArray = [];
    //populate Array
    for (let i = 0; i < itemCount; i++) {
        const text = await childDivsLocator.nth(i).textContent();
        outArray.push(text)   ;
        console.log(outArray[i]);
    }    
    return outArray
 }