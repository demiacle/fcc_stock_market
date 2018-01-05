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
            var pruneRatio = Math.max( 1, 200 / quotes.length );
            for (let key of Object.keys(quotes)) {
                // trim the datasets if they are huge
                var filteredData = quotes[key].reduce( pruneData, [] );
                // parse
                var responseObject = {
                    stock: key.replace(/NASDAQ\:|NYSE\:/, ''),
                    dataset: filteredData 
                }
                parsedQuotes.push( responseObject )
            }
            resolve(parsedQuotes)
        })
    })
}

// Reduce the amount of data per chart to between 150 and 300 entries to allow huge time spans
function pruneData( filteredData, item, index, quotes ){
    var pruneRatio = Math.max( 1, Math.floor( quotes.length / 150 ) )
    if( index % pruneRatio == 0 ) {
        filteredData.push( item )
    }
    return filteredData;
}

module.exports = queryStockMarket;