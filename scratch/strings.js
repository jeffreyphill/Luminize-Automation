const name1 = 'foobar';
const name2 = "\'#"
const name3 = name2 + name1+"\'";
console.log(name3);

// stuff I removed:
//const lastChild = page.locator('div[cmdk-group-items][role="group"] > :last-child');
// *** Get list of brands
const childDivsLocator = brands.locator('div');
const brandCount = await childDivsLocator.count();
// define Array
const brandArray = [];
//verify that we have the right locator
//console.log('brands locator count = ' + await childDivsLocator.count());
for (let i = 0; i < brandCount; i++) {
    const text = await childDivsLocator.nth(i).textContent();
    brandArray.push(text)   ;
    console.log(brandArray[i]);
  }
