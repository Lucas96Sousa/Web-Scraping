const puppeteer = require("puppeteer");
require("dotenv").config();

const twitter = require("./twitter");

(async () => {
  const USERNAME = process.env.USER;
  const PASSWORD = process.env.PASSWORD;

  await twitter.initialize();

  await twitter.login(USERNAME, PASSWORD);

  let detail = await twitter.getUser("rodrigueslilla");

  // await twitter.postTweet("Teste do bot 2");

  debugger;
})();
