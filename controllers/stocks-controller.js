const HttpError = require("../models/http-error");
const Stock = require("../models/stock");

const getPrice = require("../utils/amount");
const getCompanyName = require("../utils/company-name");

const getStocks = async (req, res, next) => {
  let stocks;
  try {
    stocks = await Stock.find({}, "-__v");
  } catch (err) {
    return new HttpError("Fetching stocks failed. Please, try again later.");
  }
  res.json({ stocks: stocks });
};

const addStock = async (req, res, next) => {
  const { stock, quantity, dividends = 0 } = req.body;

  // Pega o preço na API
  let price;
  try {
    price = await getPrice(stock.toUpperCase());
  } catch (error) {
    return next(error);
  }

  // Pega o nome da companhia na API
  let companyName;
  try {
    companyName = await getCompanyName(stock.toUpperCase());
  } catch (error) {
    return next(error);
  }

  // Verifica se já existe a ação
  let stockResult;
  let existingStock;
  try {
    existingStock = await Stock.findOne({ ticker: stock.toUpperCase() });
  } catch (err) {
    error = new HttpError("Process failed. Please, try again later.", 500);
  }

  // Se já existir
  if (existingStock) {
    existingStock.quantity = existingStock.quantity + quantity;
    existingStock.amount = (existingStock.quantity * price).toFixed(2);
    existingStock.name = companyName;
    existingStock.price = price;
    existingStock.totalEarnings = existingStock.totalEarnings + dividends;
    stockResult = existingStock;
  } else {
    const newStock = new Stock({
      ticker: stock.toUpperCase(),
      company: companyName,
      quantity: quantity,
      price: price,
      amount: quantity * price,
      totalEarnings: dividends,
    });
    stockResult = newStock;
  }

  // Salva no banco de dados
  try {
    await stockResult.save();
  } catch (err) {
    error = new HttpError("Please, try again.", 500);
    return next(error);
  }

  res.status(200).json({ stock: stockResult });
};

exports.getStocks = getStocks;
exports.addStock = addStock;
