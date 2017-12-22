var googleFinance = require('google-finance')

function queryStockMarket(){
    googleFinance.historical({
        symbol: 'NASDAQ:AAPL',
        from: '2014-01-01',
        to: '2017-12-01'
    }, function( err, quotes ){
        console.log( quotes)
    })
}

module.exports = queryStockMarket;