var WebSocket = require('ws');
var queryStockMarket = require('./queryStockMarket.server.js')
var wss;

function demiacleWebSocket( server, localStorage ) {
    wss = new WebSocket.Server({ server })
    // Only allow one add/remove request at a time
    var isLocked = false;
    wss.on('connection', (ws) => {
        console.log('Client connected')
        ws.isAlive = true; 
        ws.on('pong', () => {
            ws.isAlive = true;
        })
        ws.on('message', async (data) => {
            if( isLocked ){
                sendError( ws, 'Sever busy, try again' );
                return;
            } 
            isLocked = true;
            var request = JSON.parse(data)
            if (request.type == 'remove') {
                removeStock( localStorage, request.stockID.toUpperCase(), wss, ws )
                isLocked = false;
            }
            if (request.type == 'add') {
                await addStock( localStorage, request.stockID.toUpperCase(), wss, ws )
                isLocked = false;
            }
            if (request.type == 'endDate' && isValid( request.date ) ) {
                await updateDateAndBroadcast( wss, ws, localStorage, request.type, request.date );
                isLocked = false;
            }
            if (request.type == 'startDate' && isValid( request.date )) {
                await updateDateAndBroadcast( wss, ws, localStorage, request.type, request.date );
                isLocked = false;
            }
        })
        ws.on('close', () => { 'Client disconnected' })
        ws.on('error', () => { console.log('error, disconnecting') })
    })

    // Check connection every 30 seconds
    const pingpong = setInterval( function() {
        wss.clients.forEach( ws => {
            if( ws.isAlive === false ){
                console.log( 'terminating lost websocket connection')
                return ws.terminate();
            }

            ws.isAlive = false;
            ws.ping('', false, true )
        })
    }, 30000 )
}

function isValid( date ){
    if( date.length == 10 && date.match( /\d{4}-\d{2}-\d{2}/ ).length == 1 ) {
        return true
    } else {
        sendError( ws, 'Incorrect date format' );
        return false
    }
}

async function updateDateAndBroadcast( wss, ws, localStorage, dateType, date ){
    console.log(`updating ${dateType}: ${date}` )
    var trackingStock = JSON.parse(localStorage.getItem('trackingStock'))
    trackingStock[ dateType ] = date;
    var startingYear = parseInt( trackingStock.startDate.split('-')[0] )
    var endingYear = parseInt( trackingStock.endDate.split('-')[0] )
    if( startingYear - endingYear > 0 ) {
        sendError( ws, 'Starting date must be earlier than ending date' );
        return;
    }
    localStorage.setItem('trackingStock', JSON.stringify( trackingStock ) )
    var stocksFound = await queryStockMarket(trackingStock.stocks, trackingStock.startDate, trackingStock.endDate);
    broadcast(wss.clients, 'reset', { stocksFound, startDate: trackingStock.startDate, endDate: trackingStock.endDate } )
}

function removeStock( localStorage, stockID, wss, ws ){
    console.log('removing :' + stockID) 
    var trackingStock = JSON.parse(localStorage.getItem('trackingStock'))
    if( trackingStock.stocks.length < 2 ) {
        sendError( ws, 'At least one stock must be tracked at all times!' )
        return;
    }
    for (var i = trackingStock.stocks.length - 1; i >= 0; i--) {
        if (trackingStock.stocks[i].includes(stockID)) {
            trackingStock.stocks.splice(i, 1)
            localStorage.setItem('trackingStock', JSON.stringify(trackingStock))
            broadcast( wss.clients,'remove', stockID )
            break;
        }
    }
}

async function addStock( localStorage, stockID, wss, ws ){
    var trackingStock = JSON.parse(localStorage.getItem('trackingStock'))
    if( trackingStock.stocks.length > 9 ){
        sendError( ws, 'A maximum of 10 stocks may be tracked at a time' )
        return;
    }
    if( trackingStock.stocks.includes( stockID ) ){
        sendError( ws, `${stockID} is already being tracked`)
        return;
    }
    console.log('adding :' + stockID)
    var stockFound = await queryStockMarket( [stockID], trackingStock.startDate, trackingStock.endDate );
    if( stockFound[0].dataset.length > 0 ){
        trackingStock.stocks.push(stockID)
        localStorage.setItem('trackingStock', JSON.stringify(trackingStock))
        broadcast( wss.clients, 'add', stockFound[0] )
    } else {
        sendError( ws, `Stock ${stockID} not found or doesn't exist` )
    }
}

function broadcast( clients, type, message ){
    clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({ type: type, message: message }))
        }
    })
}

function sendError( ws, message ){
    ws.send(JSON.stringify( { type: 'fail', message: message } ) )
}

module.exports = demiacleWebSocket;