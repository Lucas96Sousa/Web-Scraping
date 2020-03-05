const puppeteer = require("puppeteer");
require("dotenv").config();

const twitter = require("./twitter");

(async () => {
  const USERNAME = process.env.USER;
  const PASSWORD = process.env.PASSWORD;

  await twitter.initialize();

  await twitter.getTweets("PokeDolar", 50);

  // await twitter.login(USERNAME, PASSWORD);

  // let detail = await twitter.getUser("PokeDOlar");

  // await twitter.postTweet("Teste do bot 2");

  debugger;
})();
