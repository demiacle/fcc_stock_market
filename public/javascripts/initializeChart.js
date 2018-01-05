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

// TODO REMOVE ALL THESE GLOBALS
function buildNewDataset(data) {
    if( data.length ){
        return data.map( parseData );
    } else {
        return parseData( data )
    }

    function parseData( item ){
        var color = getNewColor();
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
var niceColors = [];
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
function getNewColor() {
    return niceColors.pop();
}
function releaseColor(color) {
    niceColors.push(color);
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
var stockChart;
function initializeChart( stocks ) {
    if( stockChart ){
        stockChart.destroy();
    }
    var ctx = document.getElementById('mainChart').getContext('2d');
    resetColors();
    stockChart = new Chart(ctx, {
        type: 'LineWithLine',
        data: {
            labels: createXAxis( startDate, endDate ),
            datasets: buildNewDataset( stocks )
        },
        // Configuration options go here
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

    var count = 0;
    setPickerDate(startDate, endDate);
    updateLegend(stockChart)
    stockChart.update();
}
function setPickerDate( start, end ){
    function fixMonth( date ) {
        date = date.split("-");
        date[1] = parseInt(date[1]) - 1; 
        return new Date( ...date );
    }

    pickerStart.setDate( fixMonth( start ), true )
    pickerEnd.setDate( fixMonth( end ), true )
}
function updateLegend(chart) {
    document.getElementById('legend').innerHTML = chart.generateLegend();
}
function resizeChart( newData ) {
    resetColors();
    stockChart.data.labels = createXAxis( newData.startDate, newData.endDate );
    stockChart.data.datasets = buildNewDataset( newData.stocksFound );
    setPickerDate( newData.startDate, newData.endDate);
    stockChart.update();
}
function buildCustomLegend(chart) {
    var html = '';
    chart.legend.legendItems.forEach(i => {
        html += `<div class="legendColor" style="background-color:${i.fillStyle};"></div>`;
        html += `<p class="legendText">${i.text}</p>`;
        html += `<span class="removeStock" onclick="requestRemoveStock('${i.text}')">x</span>`;
    })

    return html;
}
// from pug:
// var stocks = JSON.parse('!{stocks}')
initializeChart(stocks);

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
document.getElementById('nasdaqForm').addEventListener('submit', event => {
    event.preventDefault();
    requestAddStock(document.getElementById('nasdaqQuery').value)
});
function lockSubmit() {
    document.getElementById('submit').disabled = true;
}
function unlockSubmit() {
    document.getElementById('submit').disabled = false;
}
document.getElementById('mainChart').onclick = function(evt){
    var activePoints = stockChart.getElementsAtEvent(evt);
    console.log(activePoints)
    // => activePoints is an array of points on the canvas that are at the same position as the click event.
};