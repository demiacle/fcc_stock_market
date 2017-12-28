var express = require('express');
var router = express.Router();
var stockMarket = require('../server/queryStockMarket.server.js')


/* GET home page. */
router.get('/', async function(req, res, next) {
  var results = await stockMarket.queryDefault();
  console.log( results )
  res.render('index', { stocks: JSON.stringify( results ) } );
});

router.get('/addData/:data', function(req, res) {
  res.send('add some new data')
})


module.exports = router;
