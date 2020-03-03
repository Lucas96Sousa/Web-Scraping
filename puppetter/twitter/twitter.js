const puppeteer = require("puppeteer");
require("dotenv").config();

const BASE_URL = process.env.BASE_URL;
const LOGIN_URL = process.env.LOGIN_URL;
const HOME_URL = process.env.HOME_URL;
const USERNAME = process.env.USER;
const PASSWORD = process.env.PASSWORD;
const USERNAME_URL = username => `https://twitter.com/${username}`;

let browser = null;
let page = null;

const twitter = {
  initialize: async () => {
    browser = await puppeteer.launch({ headless: false });

    page = await browser.newPage();
    await page.setViewport({
      width: 1346,
      height: 760,
    });

    await page.goto(LOGIN_URL);
  },

  login: async (username, password) => {
    await page.goto(LOGIN_URL);

    await page.waitFor('input[name="session[username_or_email]"]');
    await page.type('input[name="session[username_or_email]"]', username, {
      delay: 30,
    });
    await page.type('input[name="session[password]"]', password, {
      delay: 25,
    });
    await page.click(
      "#react-root > div > div > div.css-1dbjc4n.r-1pi2tsx.r-13qz1uu.r-417010 > main > div > div > form > div > div:nth-child(8) > div > div"
    );
    await page.waitFor(
      'div[class="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"]'
    );
    await page.waitFor(1000);
  },

  postTweet: async message => {
    let url = await page.url();

    if (url != HOME_URL) {
      await page.goto(HOME_URL);
    }

    await page.waitFor('a[aria-label="Tweetar"]');
    await page.click('a[aria-label="Tweetar"]');
    await page.waitFor(200);
    await page.keyboard.type(message, { delay: 50 });
    await page.click(
      'div[class="css-18t94o4 css-1dbjc4n r-urgr8i r-42olwf r-sdzlij r-1phboty r-rs99b7 r-1w2pmg r-1n0xq6e r-1vuscfd r-1dhvaqw r-1fneopy r-o7ynqc r-6416eg r-lrvibr"]'
    );
  },

  getUser: async username => {
    let url = await page.url();

    if (url != USERNAME_URL(username)) {
      await page.goto(USERNAME_URL(username));
    }

    await page.waitFor('div[class="css-1dbjc4n r-1awozwy r-18u37iz r-dnmrzs"]');

    let details = await page.evaluate(() => {
      return {
        fullName: document.querySelector(
          'div[class="css-1dbjc4n r-1awozwy r-18u37iz r-dnmrzs"]'
        ).innerText,
        description: document.querySelector(
          'div [data-testid="UserDescription"]'
        ).innerText,
        followers: document.querySelector('div [class="css-1dbjc4n r-1joea0r"]')
          .innerText,
        following: document.querySelector('a[href="/rodrigueslilla/following"]')
          .innerText,
        location: document
          .querySelector('div[data-testid="UserProfileHeader_Items"]')
          .textContent.slice(0, 2),
        link: document.querySelector('a[target="_blank"').textContent,

        tweetCount: document.querySelector(
          "div.css-1dbjc4n.r-16y2uox.r-1wbh5a2.r-1pi2tsx.r-1777fci > div > div"
        ).textContent,

        register: document.querySelector(
          "div:nth-child(1) > div > div:nth-child(4) > div > span:nth-child(3)"
        ).textContent,
      };
    });

    return details;
  },

  end: async () => {
    await browser.close();
  },
};

module.exports = twitter;
