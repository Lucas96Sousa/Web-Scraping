const request = require("request-promise");
const fs = require("fs");
const cheerio = require("cheerio");

const URLS = [
  {
    url: "https://www.imdb.com/title/tt7286456/?ref_=fn_al_tt_1",
    id: "Joker",
  },
  {
    url: "https://www.imdb.com/title/tt0120689/?ref_=fn_al_tt_1",
    id: "A Espera de um Milagre",
  },
];

(async () => {
  let moviesData = [];

  for (let movie of URLS) {
    const response = await request({
      uri: movie.url,
      headers: {
        accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
        "accept-encoding": "gzip, deflate, br",
        "accept-language": "pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7",
        "cache-control": "max-age=0",
        cookie:
          "ubid-main=134-7501189-4168542; session-id=147-3966770-9782935; session-id-time=2082787201l; uu=BCYpR2QC3_tSrpeo93XbwFUtW1Z_fIj6QdkWW-c7_cM4PXTrR3nVKSCsklS6MfTVFOl_tJCsn2aY%0D%0A7cs7CSuil2EAgsPhHPEtokvozc468r3v4JsJtvQjd0D1If8mW4KMCTOaAFC_n6YgWYteECJDPzEZ%0D%0AuQ%0D%0A; session-token=ZefXO468g2jdijimZ3xkdWSQiMFlG4zn8iZwkek2zJPzhvpJisUrtux/FdFHBQdSdFMj+Es+9goUkRahxKUd0TFuhu6Ua/Zf9O+oHRKCjIeWAAuzmlGoIaNPqFdKA+/x96Pb75ItsySs7/xyZOdjG4aoNK66k0wXadXz80PdzKv56xOmCg9dGgm5Mh5iPfY6; adblk=adblk_yes; csm-hit=tb:YSXZ84KK27WN2EKENXTJ+b-8WVX8A1QRX5MS2MYX69S|1581379889744&t:1581379889744&adb:adblk_yes",
        referer: "https://www.imdb.com/find?q=+Joker&ref_=nv_sr_sm",
        "sec-fetch-mode": "navigate",
        "sec-fetch-site": "same-origin",
        "sec-fetch-user": "?1",
        "upgrade-insecure-requests": "1",
        "user-agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.130 Safari/537.36",
      },
      gzip: true,
    });

    let $ = cheerio.load(response);

    let title = $('div[class="title_wrapper"] > h1')
      .text()
      .trim();
    let rating = $('div[class="ratingValue"] > strong > span').text();
    let poster = $('div[class="poster"] > a > img').attr("src");
    let totalRatings = $('div[class="imdbRating"] > a >span').text();
    let releaseDate = $('a[title="See more release dates"]')
      .text()
      .trim();
    let popularity = $(
      "#title-overview-widget > div.plot_summary_wrapper > div.titleReviewBar > div:nth-child(5) > div.titleReviewBarSubItem > div:nth-child(2) > span"
    )
      .text()
      .trim();
    let genres = [];
    $('div[class="title_wrapper"]  a[href^="/search/title"]').each(
      (i, elem) => {
        let genre = $(elem).text();
        genres.push(genre);
      }
    );

    moviesData.push({
      title,
      rating,
      poster,
      totalRatings,
      releaseDate,
      popularity,
      genres,
    });

    let file = fs.createWriteStream(`${movie.id}.jpg`);

    await new Promise((resolve, reject) => {
      let stream = request({
        uri: poster,
        headers: {
          accept:
            "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
          "accept-encoding": "gzip, deflate, br",
          "accept-language": "pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7",
          "cache-control": "max-age=0",
          cookie:
            "ubid-main=134-7501189-4168542; session-id=147-3966770-9782935; session-id-time=2082787201l; uu=BCYpR2QC3_tSrpeo93XbwFUtW1Z_fIj6QdkWW-c7_cM4PXTrR3nVKSCsklS6MfTVFOl_tJCsn2aY%0D%0A7cs7CSuil2EAgsPhHPEtokvozc468r3v4JsJtvQjd0D1If8mW4KMCTOaAFC_n6YgWYteECJDPzEZ%0D%0AuQ%0D%0A; session-token=ZefXO468g2jdijimZ3xkdWSQiMFlG4zn8iZwkek2zJPzhvpJisUrtux/FdFHBQdSdFMj+Es+9goUkRahxKUd0TFuhu6Ua/Zf9O+oHRKCjIeWAAuzmlGoIaNPqFdKA+/x96Pb75ItsySs7/xyZOdjG4aoNK66k0wXadXz80PdzKv56xOmCg9dGgm5Mh5iPfY6; adblk=adblk_yes; csm-hit=tb:YSXZ84KK27WN2EKENXTJ+b-8WVX8A1QRX5MS2MYX69S|1581379889744&t:1581379889744&adb:adblk_yes",
          referer: "https://www.imdb.com/find?q=+Joker&ref_=nv_sr_sm",
          "sec-fetch-mode": "navigate",
          "sec-fetch-site": "same-origin",
          "sec-fetch-user": "?1",
          "upgrade-insecure-requests": "1",
          "user-agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.130 Safari/537.36",
        },
        gzip: true,
      })
        .pipe(file)
        .on("finish", () => {
          console.log(`${movie.id} has finished downloading the image`);
          resolve();
        })
        .on("error", error => {
          reject(error);
        });
    }).catch(error => {
      console.log(`${movie.id} has error on download`);
    });
  }

  //fs.writeFileSync("./data.json", JSON.stringify(moviesData), "utf-8");
  //console.log(moviesData);
})();
