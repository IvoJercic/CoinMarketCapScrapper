import { load } from "cheerio";

const scrapeData = (pageHtml, symbol = null) => {
  const keys = [
    "rank",
    "name",
    "symbol",
    "marketCap",
    "price",
    "circulatingSupply",
    "volume",
    "1h",
    "24h",
    "7d",
  ];
  const coinDictionary = {};
  const selector = " table > tbody > tr";

  const $ = load(pageHtml);
  $(selector).each((parentIndex, parentElem) => {
    const coinObject = {};
    let keyIndex = 0;
    $(parentElem)
      .children()
      .each((childIndex, childElem) => {
        let tdValue = $(childElem).text();
        //Name
        if (keyIndex === 1) {
          tdValue = $("a", $(childElem).html()).attr("title");
          coinObject["logo"] = $("img", $(childElem).html()).attr("src");
        }
        //Market cap
        if (keyIndex === 3) {
          tdValue = tdValue.split("$")[2];
        }
        //Price
        if (keyIndex === 4) {
          tdValue = tdValue.split("$")[1];
        }
        //Cirrculating supply
        if (keyIndex === 5) {
          tdValue = tdValue.split(" ")[0];
        }
        //Volume
        if (keyIndex === 6) {
          tdValue = tdValue.split("$")[1];
        }
        //Percentage
        if (keyIndex > 6) {
          tdValue = tdValue.split("%")[0];
        }
        if (tdValue) {
          coinObject[keys[keyIndex]] = tdValue;
          keyIndex++;
        }
      });

    if (symbol) {
      if (coinObject["symbol"] == symbol.toUpperCase()) {
        coinDictionary[coinObject["symbol"]] = coinObject;
      }
    } else {
      coinDictionary[coinObject["symbol"]] = coinObject;
    }
  });
  return coinDictionary;
};
export default scrapeData;
