import * as datePicker from './datePickerLogic.js'
import * as ws from './websocketLogic.js'
var Chart = require('chart.js')

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
        html += `<span class="removeStock" onclick="requestRemoveStock('${i.text}')">x</span>`; // PROBPLEMMMMMMMMMM
    })
    return html;
}
// Forward calls to global to avoid managing event listeners on dynamic html
window.requestRemoveStock = ws.requestRemoveStock;

function buildNewDataset(data, labels) {
    // Check if array
    if( data.length ){
        return data.map( parseData );
    } else {
        return parseData( data )
    }

    function parseData( item ){
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
                if( datapoints[0] && i == datapoints[0].date.substring( 0, 10) ){
                    return datapoints.shift().close;
                } else {
                    return null
                }
            }),
            fill: false
        }
    }
}
function createXAxis( startDate, endDate ){
    // calculate every day between start and end
    startDate = startDate.split('-');
    startDate[1]--;
    endDate = endDate.split('-');
    endDate[1]--;

    startDate = new Date( ...startDate );
    endDate = new Date( ...endDate );
    var datesBetweenStartEnd = [];
    while( startDate <= endDate ){
        datesBetweenStartEnd.push( datePicker.toString( startDate ) );
        startDate.setDate( startDate.getDate() + 1 )
    }
    return datesBetweenStartEnd;
}

// Exports
export function resizeChart( newData ) {
    resetColors();
    stockChart.data.labels = createXAxis( newData.startDate, newData.endDate );
    stockChart.data.datasets = buildNewDataset( newData.stocksFound, stockChart.data.labels );
    datePicker.setPikadayDate( newData.startDate, newData.endDate);
    stockChart.update();
}
export function addDataToChart(data) {
    stockChart.data.datasets.push(buildNewDataset(data))
    stockChart.update();
    updateLegend(stockChart)
}
export function removeDataFromChart(stockID) {
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

var niceColors = [];
var stockChart;
export function initialize(){
    console.log( 'initializing')
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
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    });

    datePicker.setPikadayDate(demiacleVars.startDate, demiacleVars.endDate);
    updateLegend(stockChart)
    stockChart.update();
}