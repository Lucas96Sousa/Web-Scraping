const puppeteer = require("puppeteer");

const USERNAME = process.env.USER;
const PASSWORD = process.env.PASSWORD;


(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  await page.setViewport({
    width: 1346,
    height: 760,
  });

  await page.goto("https://www.instagram.com/");

  await page.waitFor('a[href="/accounts/login/?source=auth_switcher"]');
  await page.click('a[href="/accounts/login/?source=auth_switcher"]');
  await page.waitFor(500);

  await page.waitFor('input[name="username"]');

  await page.type('input[name="username"]', USERNAME, {
    delay: 100,
  });
  await page.type('input[name="password"]',PASSWORD, {
    delay: 100,
  });

  await page.click(
    "#react-root > section > main > div > article > div > div:nth-child(1) > div > form > div:nth-child(4) > button"
  );

  await page.waitForNavigation();

  debugger;

  //await browser.close();
})();
