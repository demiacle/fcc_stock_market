var express = require('express');
var router = express.Router();
var queryStockMarket = require('../server/queryStockMarket.server.js')


/* GET home page. */
router.get('/', async function(req, res, next) {
  console.log( res.locals.localStorage )
  var trackingStocks = res.locals.localStorage
  var results = await queryStockMarket( trackingStocks.stocks, trackingStocks.startDate, trackingStocks.endDate );
  console.log( results )
  res.render('index', { stocks: JSON.stringify( results ) } );
});

module.exports = router;
