const puppeteer = require("puppeteer");
/* 

First scrap and screenshot to google

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    devtools: true,
  });
  const page = await browser.newPage();
  await page.goto("https://www.google.com.br");

  await page.type('input[class="gLFyf gsfi"', "G1", { delay: 100 });
  await page.keyboard.press("Enter");
  await page.waitForNavigation();

  await page.screenshot({ path: "google.png" });

  //await browser.close();

  debugger;
})();

*/

/* 1. Gerando um pdf de uma pagina 
(async () => {
  const browser = await puppeteer.launch({ headless: true });

  const page = await browser.newPage();

  await page.goto("http://learnscraping.com");

  await page.pdf({
    path: "./page.pdf",
    format: "A4",
  });
  await page.close();
})();
*/

/* 2. Adquirindo a URL e TITLE da página 

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto("https://learnscraping.com");

  let title = await page.title();
  console.log(`O título da página é: ${title}`);

  let url = await page.url();
  console.log(`A url da página é: ${url}`);

  await browser.close();
})();

*/

/* 3. Emulando um mobile 
(async () => {
  const devices = require("puppeteer/DeviceDescriptors");
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.emulate(devices["Pixel 2"]);

  await page.goto("https://learnscraping.com");

  await page.waitForNavigation();
  await browser.close();
})();
*/
