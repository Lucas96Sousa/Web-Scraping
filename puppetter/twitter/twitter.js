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
        )
          ? document.querySelector(
              'div[class="css-1dbjc4n r-1awozwy r-18u37iz r-dnmrzs"]'
            ).textContent
          : false,

        description: document.querySelector(
          'div [data-testid="UserDescription"]'
        )
          ? document.querySelector('div [data-testid="UserDescription"]')
              .textContent
          : false,
        followers: document.querySelector('a[href="/PokeDolar/followers"]')
          ? document.querySelector('a[href="/PokeDolar/followers"]').textContent
              .textContent
          : false,
        following: document.querySelector('a[href="/PokeDolar/following"]')
          ? document.querySelector('a[href="/PokeDolar/following"]').textContent
          : false,
        location: document.querySelector(
          'div[data-testid="UserProfileHeader_Items"]'
        )
          ? document
              .querySelector('div[data-testid="UserProfileHeader_Items"]')
              .textContent.slice(0, 26)
          : false,
        link: document.querySelector('a[target="_blank"')
          ? document.querySelector('a[target="_blank"').textContent
          : false,

        tweetCount: document.querySelector(
          "div.css-1dbjc4n.r-16y2uox.r-1wbh5a2.r-1pi2tsx.r-1777fci > div > div"
        )
          ? document.querySelector(
              "div.css-1dbjc4n.r-16y2uox.r-1wbh5a2.r-1pi2tsx.r-1777fci > div > div"
            ).textContent
          : false,

        register: document.querySelector(
          " div > div:nth-child(1) > div > div:nth-child(4) > div > span"
        )
          ? document.querySelector(
              " div > div:nth-child(1) > div > div:nth-child(4) > div > span"
            ).textContent
          : false,
      };
    });

    return details;
  },

  getTweets: async (username, count = 50) => {
    let url = await page.url();

    if (url != USERNAME_URL(username)) {
      await page.goto(USERNAME_URL(username));

      await page.waitFor('article[role="article"]');

      let tweetsArray = await page.$$('article[role="article"]');
      let lastTweetsArrayLenght = 0;
      let tweets = [];
      while (tweetsArray.length < count) {
        if (lastTweetsArrayLenght == tweetsArray.length) break;
        await page.evaluate(`window.scrollTo(0, document.body.scrollHeight)`);
        await page.waitFor(3000);

        tweetsArray = await page.$$('article[role="article"]');

        if (lastTweetsArrayLenght == tweetsArray.length) break;

        lastTweetsArrayLenght = tweetsArray.length;
      }

      for (let tweetElement of tweetsArray) {
        let tweet = await tweetElement.$eval(
          'div[lang="pt"]',
          element => element.textContent
        );

        let postedDate = await tweetElement.$eval(
          "time[datetime]",
          element => element.textContent
        );

        let commitsCount = await tweetElement.$eval(
          'div[data-testid="reply"]',
          element => element.textContent
        );

        let repliesCount = await tweetElement.$eval(
          'div[data-testid="retweet"]',
          element => element.textContent
        );

        let likesCount = await tweetElement.$eval(
          'div[data-testid="like"]',
          element => element.textContent
        );

        tweets.push({
          tweet,
          postedDate,
          commitsCount,
          repliesCount,
          likesCount,
        });
      }

      tweets.slice(0, count);

      return tweets;
    }
  },

  end: async () => {
    await browser.close();
  },
};

module.exports = twitter;
