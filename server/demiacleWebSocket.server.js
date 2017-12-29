var WebSocket = require('ws');
var queryStockMarket = require('./queryStockMarket.server.js')

function demiacleWebSocket( server, localStorage ) {
    const wss = new WebSocket.Server({ server })
    wss.on('connection', (ws) => {
        console.log('Client connected')
        ws.on('message', (data) => {
            var request = JSON.parse(data)
            if (request.type == 'remove') {
                removeStock( localStorage, request.stockID.toUpperCase(), ws )
            }
            if (request.type == 'add') {
                addStock( localStorage, request.stockID.toUpperCase(), ws )
            }
        })
        ws.on('close', () => { 'Client disconnected' })
        ws.on('error', () => { console.log('error, disconnecting') })
    })
}

function removeStock( localStorage, stockID, ws ){
    console.log('removing :' + stockID) 
    var trackingStock = JSON.parse(localStorage.getItem('trackingStock'))
    if( trackingStock.stocks.length < 2 ) {
        ws.send(JSON.stringify( { type: 'fail', messege: `At least one stock must be tracked at all times!` } ) )
        return;
    }
    for (var i = trackingStock.stocks.length - 1; i >= 0; i--) {
        if (trackingStock.stocks[i].includes(stockID)) {
            trackingStock.stocks.splice(i, 1)
            localStorage.setItem('trackingStock', JSON.stringify(trackingStock))
            ws.send(JSON.stringify({ type: 'remove', stockID: stockID }))
            break;
        }
    }
}

async function addStock( localStorage, stockID, ws ){
    console.log('adding :' + stockID)
    var trackingStock = JSON.parse(localStorage.getItem('trackingStock'))
    if( trackingStock.stocks.length > 9 ){
        ws.send( JSON.stringify({ type: 'fail', messege: 'A maximum of 10 stocks may be tracked at a time' } ) )
        return;
    }

    var stockFound = await queryStockMarket( [stockID], trackingStock.startDate, trackingStock.endDate );
    if( stockFound[0].dataset.length > 0 ){
        trackingStock.stocks.push(stockID)
        localStorage.setItem('trackingStock', JSON.stringify(trackingStock))
        ws.send(JSON.stringify({ type: 'add', data: stockFound[0] }))
    } else {
        ws.send(JSON.stringify( { type: 'fail', messege: `Stock ${stockID} not found or doesn't exist` } ) )
    }
}

module.exports = demiacleWebSocket;