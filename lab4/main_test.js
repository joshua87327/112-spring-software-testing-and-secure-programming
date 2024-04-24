const puppeteer = require('puppeteer');

(async () => {
    // Launch the browser and open a new blank page
    // const browser = await puppeteer.launch({headless:false, executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'});
    const browser = await puppeteer.launch();
  
    const page = await browser.newPage();

    // Navigate the page to a URL
    await page.goto('https://pptr.dev/');

    // Set screen size
    await page.setViewport({width: 1080, height: 1024});

    // Wait and click on first result
    const button = await page.waitForSelector('.DocSearch-Button', {visible: true});
    await button.click();

    // Type into search box
    const input = await page.waitForSelector('#docsearch-input', {visible: true});
    await input.type('chipi chipi chapa chapa');
    await new Promise(resolve => setTimeout(resolve, 1000));

    //identify element with id
    const selector = await page.waitForSelector('#docsearch-item-5');
    const handle = await selector.$$('a');
    const propertyHandles = await Promise.all(handle.map(h => h.getProperty('href')));
    const targetHref = await Promise.all(propertyHandles.map(h => h.jsonValue()));
    // console.log(targetHref);
    await page.goto(targetHref[0]);

    // Extracting a single element using a CSS selector
    const element = await page.$('h1'); // Example selector: h1

    // Extracting and logging the text content of the element
    const elementText = await page.evaluate(element => element.textContent, element);
    console.log(elementText);

    await browser.close();
})();