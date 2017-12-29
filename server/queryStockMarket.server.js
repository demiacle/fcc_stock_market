var googleFinance = require('google-finance')

function queryStockMarket( query, from, to ){
    request = {
        symbols: query,
        from: from,
        to: to
    }
    return getStocks( request );
}

function getStocks( request ){
    return new Promise(resolve => {
        googleFinance.historical(request, function (err, quotes) {
            if (err)
                console.log(err)

            var parsedQuotes = [];
            for (let key of Object.keys(quotes)) {
                parsedQuotes.push({ stock: key.replace( /NASDAQ\:|NYSE\:/, ''), dataset: quotes[key] })
            }

            resolve(parsedQuotes)
        })
    })
}

module.exports = queryStockMarket;