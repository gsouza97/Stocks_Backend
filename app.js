const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const stocksRoutes = require("./routes/stock-routes");
const HttpError = require("./models/http-error");

const app = express();

app.use(bodyParser.json());

// Requisição
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");

  next();
});

// Rotas
app.use("/api/stocks/", stocksRoutes);

// Erro padrão para rotas não suportadas
app.use((req, res, next) => {
  const error = new HttpError("Could not find this route", 404);
  return next(error);
});

// Erro em requisições que tem um erro atrelado a ela
app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || "An unknown error has occurred." });
});

mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@stocks.dm4lc.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`
  )
  .then(() => {
    app.listen(4000);
  })
  .catch((err) => {
    console.log(err);
  });
