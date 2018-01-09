webpackJsonp([0],{

/***/ 10:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["d"] = resizeChart;
/* harmony export (immutable) */ __webpack_exports__["a"] = addDataToChart;
/* harmony export (immutable) */ __webpack_exports__["c"] = removeDataFromChart;
/* harmony export (immutable) */ __webpack_exports__["b"] = initialize;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__datePickerLogic_js__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__websocketLogic_js__ = __webpack_require__(8);


var Chart = __webpack_require__(11)

Chart.defaults.LineWithLine = Chart.defaults.line;

Chart.controllers.LineWithLine = Chart.controllers.line.extend({
    // Implements vertical line on chart hover
    draw: function (ease) {
        Chart.controllers.line.prototype.draw.call(this, ease);

        if (this.chart.tooltip._active && this.chart.tooltip._active.length) {
            var activePoint = this.chart.tooltip._active[0],
                ctx = this.chart.ctx,
                x = activePoint.tooltipPosition().x,
                topY = this.chart.scales['y-axis-0'].top,
                bottomY = this.chart.scales['y-axis-0'].bottom;

            // draw line
            ctx.save();
            ctx.beginPath();
            ctx.moveTo(x, topY);
            ctx.lineTo(x, bottomY);
            ctx.lineWidth = 1;
            ctx.strokeStyle = '#BDF';
            ctx.stroke();
            ctx.restore();
        }
    }
})

function buildCustomLegend(chart) {
    var html = '';
    chart.legend.legendItems.forEach(i => {
        html += `<div class="legendColor" style="background-color:${i.fillStyle};"></div>`;
        html += `<p class="legendText">${i.text}</p>`;
        html += `<span class="removeStock" onclick="requestRemoveStock('${i.text}')">x</span>`; // PROBPLEMMMMMMMMMM
    })
    return html;
}
// Forward calls to global to avoid managing event listeners on dynamic html
window.requestRemoveStock = __WEBPACK_IMPORTED_MODULE_1__websocketLogic_js__["c" /* requestRemoveStock */];

function buildNewDataset(data, labels) {
    // Check if array
    if (data.length) {
        return data.map(parseData);
    } else {
        return parseData(data)
    }

    function parseData(item) {
        var color = checkoutColor();
        var datapoints = item.dataset;
        return {
            label: item.stock,
            spanGaps: true,
            lineTension: 0,
            borderWidth: 1,
            pointRadius: 0,
            pointStyle: 'rectRot',
            backgroundColor: color,
            borderColor: color,
            data: labels.map(i => {
                if (datapoints[0] && i == datapoints[0].date.substring(0, 10)) {
                    return datapoints.shift().close;
                } else {
                    return null
                }
            }),
            fill: false
        }
    }
}
function createXAxis(startDate, endDate) {
    // calculate every day between start and end
    startDate = startDate.split('-');
    startDate[1]--;
    endDate = endDate.split('-');
    endDate[1]--;

    startDate = new Date(...startDate);
    endDate = new Date(...endDate);
    var datesBetweenStartEnd = [];
    while (startDate <= endDate) {
        datesBetweenStartEnd.push(__WEBPACK_IMPORTED_MODULE_0__datePickerLogic_js__["b" /* toString */](startDate));
        startDate.setDate(startDate.getDate() + 1)
    }
    return datesBetweenStartEnd;
}

// Exports
function resizeChart(newData) {
    resetColors();
    stockChart.data.labels = createXAxis(newData.startDate, newData.endDate);
    stockChart.data.datasets = buildNewDataset(newData.stocksFound, stockChart.data.labels);
    __WEBPACK_IMPORTED_MODULE_0__datePickerLogic_js__["a" /* setPikadayDate */](newData.startDate, newData.endDate);
    stockChart.update();
}
function addDataToChart(data) {
    stockChart.data.datasets.push(buildNewDataset(data, stockChart.data.labels))
    stockChart.update();
    updateLegend(stockChart)
}
function removeDataFromChart(stockID) {
    for (var j = stockChart.data.datasets.length - 1; j >= 0; j--) {
        if (stockChart.data.datasets[j].label == stockID) {
            releaseColor(stockChart.data.datasets[j].backgroundColor)
            stockChart.data.datasets.splice(j, 1);
        }
    }
    stockChart.update();
    updateLegend(stockChart);
}

// Colors
function resetColors() {
    niceColors = [
        'rgb(130, 50, 60)',
        'rgb(0, 99, 132)',
        'rgb(100, 200, 100)',
        'rgb(230, 230, 0)',
        'rgb( 0, 150, 230)',
        'rgb(255, 199, 132)',
        'rgb(230, 0, 232)',
        'rgb(140, 250, 150)',
        'rgb(50, 250, 250)',
        'rgb(250, 0, 0)'
    ]
}
function releaseColor(color) {
    niceColors.push(color);
}
function checkoutColor() {
    return niceColors.pop();
}

// Modify DOM
function updateLegend(chart) {
    document.getElementById('legend').innerHTML = chart.generateLegend();
}

var niceColors = [];
var stockChart;
function initialize() {
    console.log('initializing')
    resetColors();

    var ctx = document.getElementById('mainChart').getContext('2d');
    var labels = createXAxis(demiacleVars.startDate, demiacleVars.endDate)
    stockChart = new Chart(ctx, {
        type: 'LineWithLine',
        data: {
            labels: labels,
            datasets: buildNewDataset(demiacleVars.stocks, labels)
        },
        options: {
            legendCallback: buildCustomLegend,
            responsive: false,
            legend: {
                display: false
            },
            tooltips: {
                intersect: false,
                mode: 'index'
            },
            hover: {
                intersect: false,
                mode: 'index'
            },
            scales: {
                yAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: 'Closing shares'
                    },
                    ticks: {
                        beginAtZero: true
                    }
                }],
                xAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: 'Date'
                    },
                    ticks: {
                        maxTicksLimit: 14
                    }
                }]
            }
        }
    });

    __WEBPACK_IMPORTED_MODULE_0__datePickerLogic_js__["a" /* setPikadayDate */](demiacleVars.startDate, demiacleVars.endDate);
    updateLegend(stockChart)
    stockChart.update();
}

/***/ }),

/***/ 233:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__datePickerLogic_js__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__websocketLogic_js__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__initializeChart_js__ = __webpack_require__(10);




__WEBPACK_IMPORTED_MODULE_2__initializeChart_js__["b" /* initialize */]();

/***/ }),

/***/ 8:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["c"] = requestRemoveStock;
/* harmony export (immutable) */ __webpack_exports__["a"] = requestDateEnd;
/* harmony export (immutable) */ __webpack_exports__["b"] = requestDateStart;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__initializeChart_js__ = __webpack_require__(10);


var ws = new WebSocket( 'ws://' + demiacleVars.url );
ws.onmessage = function (event) {
    var response = JSON.parse(event.data)
    console.log(response)
    if (response.type == 'remove') {
        __WEBPACK_IMPORTED_MODULE_0__initializeChart_js__["c" /* removeDataFromChart */](response.message);
    }
    if (response.type == 'add') {
        __WEBPACK_IMPORTED_MODULE_0__initializeChart_js__["a" /* addDataToChart */](response.message)
    }
    if (response.type == 'fail') {
        alert(response.message)
    }
    if (response.type == 'reset') {
        __WEBPACK_IMPORTED_MODULE_0__initializeChart_js__["d" /* resizeChart */]( response.message );
    }
    unlockSubmit();
};
ws.onclose = function (){
    alert( 'You have lost the connection to the server, please reload' )
    lockSubmit();
};
// Exports
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

// Modify DOM
function lockSubmit() {
    document.getElementById('submit').disabled = true;
}
function unlockSubmit() {
    document.getElementById('submit').disabled = false;
}
document.getElementById('nasdaqForm').addEventListener('submit', event => {
    event.preventDefault();
    requestAddStock(document.getElementById('nasdaqQuery').value)
});

/***/ }),

/***/ 9:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["b"] = toString;
/* unused harmony export changeDateStart */
/* unused harmony export changeDateEnd */
/* harmony export (immutable) */ __webpack_exports__["a"] = setPikadayDate;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__websocketLogic_js__ = __webpack_require__(8);

var Pikaday = __webpack_require__(131)

function toString (date) {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${year}-${pad(month)}-${pad(day)}`
}
function parse (dateString) {
    const parts = dateString.split('-');
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1] - 1, 10);
    const year = parseInt(parts[1], 10);
    return new Date(year, pad(month), pad(day));
}
function pad( num ){
    var needsZero = 2 - num.toString().length;
    if( needsZero ){
        num = '0' + num;
    }
    return num
}
function changeDateStart () {
    var newDate = this._d;
    newDate = `${newDate.getFullYear()}-${pad(newDate.getMonth()+1)}-${pad(newDate.getDate())}`;
    __WEBPACK_IMPORTED_MODULE_0__websocketLogic_js__["b" /* requestDateStart */]( newDate );
}
function changeDateEnd () {
    var newDate = this._d;
    newDate = `${newDate.getFullYear()}-${pad(newDate.getMonth()+1)}-${pad(newDate.getDate())}`;
    __WEBPACK_IMPORTED_MODULE_0__websocketLogic_js__["a" /* requestDateEnd */]( newDate );
}
var pickerStart = new Pikaday({ 
    field: document.getElementById('datePickerStart'),
    format: 'YYYY-MM-DD',
    toString,
    parse,
    onSelect: changeDateStart
 })
var pickerEnd = new Pikaday({ 
    field: document.getElementById('datePickerEnd'),
    format: 'YYYY-MM-DD',
    toString,
    parse,
    onSelect: changeDateEnd
 })
function setPikadayDate( start, end ){
    function fixMonth( date ) {
        date = date.split("-");
        date[1] = parseInt(date[1]) - 1; 
        return new Date( ...date );
    }
    pickerStart.setDate( fixMonth( start ), true )
    pickerEnd.setDate( fixMonth( end ), true )
}


/***/ })

},[233]);