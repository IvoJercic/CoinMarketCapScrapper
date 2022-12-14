import express from "express";
import autoScroll from "./autoScroll.js";
import scrapeData from "./scrapeData.js";
import puppeteer from "puppeteer";
import chromium from "chrome-aws-lambda";

const app = express();
let globals = null;

app.get("/", async (req, res) => {
  try {
    if (!globals) {
      let jsonData = undefined;
      const siteUrl = "https://coinmarketcap.com/all/views/all/";
      const browser = await puppeteer.launch({
        args: [...chromium.args, "--hide-scrollbars", "--disable-web-security"],
        defaultViewport: chromium.defaultViewport,
        executablePath: await chromium.executablePath,
        headless: false,
        ignoreHTTPSErrors: true,
      });
      const page = await browser.newPage();
      await page.goto(siteUrl);

      await autoScroll(page);

      const pageData = await page.evaluate(() => {
        return {
          html: document.documentElement.innerHTML,
        };
      });

      jsonData = scrapeData(pageData.html);
      globals = jsonData;
      await browser.close();
      res.json(jsonData);
    } else {
      res.json(globals);
    }
  } catch (e) {
    console.log(e);
    res.json(null);
  }
});

app.listen("3000", () => {
  console.log("SERVER IS LISTENING ON PORT 3000");
});
