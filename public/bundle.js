/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 3);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export changeDateStart */
/* unused harmony export changeDateEnd */
/* harmony export (immutable) */ __webpack_exports__["a"] = setDate;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__websocketLogic_js__ = __webpack_require__(1);


console.log( 'loading datePicker')
// TODO Add pikaday npm dependency
function toString (date, format) {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${year}-${month.pad()}-${day.pad()}`
}
function parse (dateString, format) {
    const parts = dateString.split('-');
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1] - 1, 10);
    const year = parseInt(parts[1], 10);
    return new Date(year, month.pad(), day.pad());
}
// TODO remove from prototype and make into function
Number.prototype.pad = function(){
    var number = this;
    var needsZero = 2 - this.toString().length;
    if( needsZero ){
        number = '0' + number;
    }
    return number
}
function changeDateStart () {
    var newDate = this._d;
    __WEBPACK_IMPORTED_MODULE_0__websocketLogic_js__["a" /* default */].requestDateStart( `${newDate.getFullYear()}-${(newDate.getMonth()+1).pad()}-${newDate.getDate().pad()}` );
}
function changeDateEnd ( test, test1, test2 ) {
    var newDate = this._d;
    __WEBPACK_IMPORTED_MODULE_0__websocketLogic_js__["a" /* default */].requestDateEnd( `${newDate.getFullYear()}-${(newDate.getMonth()+1).pad()}-${newDate.getDate().pad()}` );
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
function setDate( start, end ){
    function fixMonth( date ) {
        date = date.split("-");
        date[1] = parseInt(date[1]) - 1; 
        return new Date( ...date );
    }

    pickerStart.setDate( fixMonth( start ), true )
    pickerEnd.setDate( fixMonth( end ), true )
}


/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = websocketLogic;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__initializeChart_js__ = __webpack_require__(2);

console.log( 'loading ws')
function websocketLogic(){
    var ws = new WebSocket('ws://localhost:8080'); // TODO change to pug variable of webiste 
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

/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["d"] = resizeChart;
/* harmony export (immutable) */ __webpack_exports__["a"] = addDataToChart;
/* harmony export (immutable) */ __webpack_exports__["c"] = removeDataFromChart;
/* harmony export (immutable) */ __webpack_exports__["b"] = initialize;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__datePickerLogic_js__ = __webpack_require__(0);


console.log( 'loading  chart')
// TODO add chart.js dependency

// Implements vertical line on chart hover
Chart.defaults.LineWithLine = Chart.defaults.line;
Chart.controllers.LineWithLine = Chart.controllers.line.extend({
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
});
function buildCustomLegend(chart) {
    var html = '';
    chart.legend.legendItems.forEach(i => {
        html += `<div class="legendColor" style="background-color:${i.fillStyle};"></div>`;
        html += `<p class="legendText">${i.text}</p>`;
        html += `<span class="removeStock" onclick="requestRemoveStock('${i.text}')">x</span>`;
    })
    return html;
}
function buildNewDataset(data) {
    // Check if array
    if( data.length ){
        return data.map( parseData );
    } else {
        return parseData( data )
    }

    function parseData( item ){
        var color = checkoutColor();
        return {
            label: item.stock,
            lineTension: 0,
            borderWidth: 1,
            pointRadius: 0,
            pointStyle: 'rectRot',
            backgroundColor: color,
            borderColor: color,
            data: item.dataset.map(i => { return i.close }),
            fill: false
        }
    }
}
function createXAxis( startDate, endDate ){
    // calculate every day between start and end
    var startDate = startDate.split('-');
    startDate[1]--;
    var endDate = endDate.split('-');
    endDate[1]--;

    startDate = new Date( ...startDate );
    endDate = new Date( ...endDate );
    var datesBetweenStartEnd = [];
    while( startDate < endDate ){
        datesBetweenStartEnd.push( toString( startDate ) );
        var test = startDate.getDate();
        startDate.setDate( startDate.getDate() + 1 )
    }
    return datesBetweenStartEnd;
}

// Exports
function resizeChart( newData ) {
    resetColors();
    stockChart.data.labels = createXAxis( newData.startDate, newData.endDate );
    stockChart.data.datasets = buildNewDataset( newData.stocksFound );
    __WEBPACK_IMPORTED_MODULE_0__datePickerLogic_js__["a" /* setDate */]( newData.startDate, newData.endDate);
    stockChart.update();
}
function addDataToChart(data) {
    stockChart.data.datasets.push(buildNewDataset(data))
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
function resetColors(){
    niceColors =  [
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
function checkoutColor(){
    return niceColors.pop();
}

// Modify DOM
function updateLegend(chart) {
    document.getElementById('legend').innerHTML = chart.generateLegend();
}

// remove global implementation?
var niceColors = [];
function initialize(){
    console.log( 'initializing')
    resetColors();

    var ctx = document.getElementById('mainChart').getContext('2d');
    var stockChart = new Chart(ctx, {
        type: 'LineWithLine',
        data: {
            labels: createXAxis(demiacleVars.startDate, demiacleVars.endDate),
            datasets: buildNewDataset(demiacleVars.stocks, niceColors)
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
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    });

    __WEBPACK_IMPORTED_MODULE_0__datePickerLogic_js__["a" /* setDate */](demiacleVars.startDate, demiacleVars.endDate);
    updateLegend(stockChart)
    stockChart.update();
}

/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__datePickerLogic_js__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__initializeChart_js__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__websocketLogic_js__ = __webpack_require__(1);




__WEBPACK_IMPORTED_MODULE_1__initializeChart_js__["b" /* initialize */]();

/***/ })
/******/ ]);