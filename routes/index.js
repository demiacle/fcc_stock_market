var express = require('express');
var router = express.Router();
var stockMarket = require('../server/queryStockMarket.server.js')


/* GET home page. */
router.get('/', async function(req, res, next) {
  console.log( res.locals.localStorage )
  var results = await stockMarket.queryDefault();
  console.log( results )
  res.render('index', { stocks: JSON.stringify( results ) } );
});

module.exports = router;
