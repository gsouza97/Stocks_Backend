const express = require("express");

const stocksControllers = require("../controllers/stocks-controller");

const router = express.Router();

router.get("/", stocksControllers.getStocks);
router.post("/", stocksControllers.addStock);

module.exports = router;
