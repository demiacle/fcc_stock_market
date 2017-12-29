
var WebSocket = require('ws');

function demiacleWebSocket( server ) {
    const wss = new WebSocket.Server({ server })
    wss.on('connection', (ws) => {
        console.log('Client connected')
        ws.on('message', (data) => {
            var request = JSON.parse(data)
            if (request.type == 'remove') {
                console.log('removing :' + request.stockID)
                // remove from localStorage
                // send updates to other clients
            }
            if (request.type == 'add') {
                console.log('adding :' + request.stockID)
                // add to localStorage
                // send updates to other clients
            }
        })
        ws.on('close', () => { 'Client disconnected' })
        ws.on('error', () => { console.log('error, disconnecting') })
    })
}

module.exports = demiacleWebSocket;