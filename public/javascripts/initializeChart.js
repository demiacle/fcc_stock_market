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
// '!{variable}' renders a pug unescaped string
//var stocks = JSON.parse('!{stocks}')
var xAxis = stocks[0].dataset.map(i => {
    return i.date.substring(0, 10);
});
var niceColors = [
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
];
var startDate = xAxis[0];
var endDate = xAxis[xAxis.length - 1];

var datasets = stocks.map(buildNewDataset);
console.log(datasets)
function buildNewDataset(data) {
    var color = getNewColor();
    return {
        label: data.stock,
        lineTension: 0,
        borderWidth: 1,
        pointRadius: 0,
        pointStyle: 'rectRot',
        backgroundColor: color,
        borderColor: color,
        data: data.dataset.map(i => { return i.close }),
        fill: false
    }
}
function getNewColor() {
    return niceColors.pop();
}
function releaseColor(color) {
    niceColors.push(color);
}
var chart;
function initializeChart(data) {
    var ctx = document.getElementById('mainChart').getContext('2d');
    chart = new Chart(ctx, {
        type: 'LineWithLine',
        data: {
            labels: xAxis, // x axis
            datasets: datasets
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

    updateLegend(chart)
}

function updateLegend(chart) {
    document.getElementById('legend').innerHTML = chart.generateLegend();
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
initializeChart();

function addDataToChart(data) {
    chart.data.datasets.push(buildNewDataset(data, chart.data.datasets.length))
    chart.update();
    updateLegend(chart)
}

function removeDataFromChart(stockID) {
    for (var j = chart.data.datasets.length - 1; j >= 0; j--) {
        if (chart.data.datasets[j].label == stockID) {
            releaseColor(chart.data.datasets[j].backgroundColor)
            chart.data.datasets.splice(j, 1);
        }
    }
    chart.update();
    updateLegend(chart);
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
function zoomChart(){
    console.log(chart)
}

document.getElementById('mainChart').onclick = function(evt){
    var activePoints = chart.getElementsAtEvent(evt);
    console.log(activePoints)
    // => activePoints is an array of points on the canvas that are at the same position as the click event.
};