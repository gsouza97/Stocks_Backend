const axios = require("axios");
const HttpError = require("../models/http-error");

const API_KEY = process.env.API_KEY;

async function getPrice(ticker) {
  const response = await axios.get(
    `https://api.hgbrasil.com/finance/stock_price?key=${API_KEY}&symbol=${ticker}`
  );

  const data = response.data;

  if (!data) {
    const error = new HttpError(
      "Could not find a stock for the specified ticker",
      422
    );
    throw error;
  }

  const price = data["results"][`${ticker}`]["price"];
  console.log(price);
  return price;
}

module.exports = getPrice;
