import * as chart from './initializeChart.js'
console.log( 'loading ws')
export default function websocketLogic(){
    var ws = new WebSocket('ws://localhost:8080'); // TODO change to pug variable of webiste 
ws.onmessage = function (event) {
    var response = JSON.parse(event.data)
    console.log(response)
    if (response.type == 'remove') {
        chart.removeDataFromChart(response.message);
    }
    if (response.type == 'add') {
        chart.addDataToChart(response.message)
    }
    if (response.type == 'fail') {
        alert(response.message)
    }
    if (response.type == 'reset') {
        chart.resizeChart( response.message );
    }
    unlockSubmit();
};
ws.onclose = function (event ){
    alert( 'You have lost the connection to the server, please reload' )
    lockSubmit();
};
function requestAddStock(stockID) {
    console.log(stockID)
    ws.send(JSON.stringify({
        type: 'add',
        stockID: stockID
    }));
    lockSubmit();
}
function requestRemoveStock(stockID) {
    ws.send(JSON.stringify({
        type: 'remove',
        stockID: stockID
    }));
    lockSubmit();
}
function requestDateEnd (date){
    ws.send(JSON.stringify({
        type: 'endDate',
        date
    }));
}
function requestDateStart (date){
    ws.send(JSON.stringify({
        type: 'startDate',
        date
    }));
}
}

// Modify DOM
function lockSubmit() {
    document.getElementById('submit').disabled = true;
}
function unlockSubmit() {
    document.getElementById('submit').disabled = false;
}
document.getElementById('nasdaqForm').addEventListener('submit', event => {
    event.preventDefault();
    requestAddStock(document.getElementById('nasdaqQury').value)
});