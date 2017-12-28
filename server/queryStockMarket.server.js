var googleFinance = require('google-finance')

function queryStockMarket( query, from, to ){
    request = {
        symbols: [ query ],
        from: from,
        to: to
    }
    return getStocks( request );
}

function queryDefaultStockMarket(){
    var random = ['NASDAQ:FB', 'NASDAQ:AAPL', 'NASDAQ:AMZN', 'NYSE:TWTR'].reduce( (accumulator, i) => {
        if (Math.random() < 0.4)
            accumulator.push(i);
        return accumulator;
    }, [])

    random.push('NASDAQ:GOOGL'); // Always show google because we are using their api... THANKS GOOGLE!

    request = {
        symbols: random,
        from: '2016-12-01',
        to: '2017-12-01'
    }
    return getStocks( request )
}

function getStocks( resuest ){
    return new Promise(resolve => {
        googleFinance.historical(request, function (err, quotes) {
            if (err)
                console.log(err)

            var parsedQuotes = [];
            for (let key of Object.keys(quotes)) {
                parsedQuotes.push({ stock: key, dataset: quotes[key] })
            }

            resolve(parsedQuotes)
        })
    })
}

exports.query = queryStockMarket;
exports.queryDefault = queryDefaultStockMarket;