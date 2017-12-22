var express = require('express');
var router = express.Router();
var queryStockMarket = require('../server/queryStockMarket.server.js')

/* GET home page. */
router.get('/', function(req, res, next) {
  queryStockMarket();
  res.render('index', { title: 'Express' });
});


module.exports = router;
