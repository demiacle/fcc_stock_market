var ws = new WebSocket('ws://localhost:8080'); // TODO change to pug variable of webiste 
ws.onmessage = function (event) {
    // TODO implement lock submit button to stop multiple requests cleanly
    var response = JSON.parse(event.data)
    console.log(response)
    if (response.type == 'remove') {
        removeDataFromChart(response.message);
    }
    if (response.type == 'add') {
        addDataToChart(response.message)
    }
    if (response.type == 'fail') {
        // TODO place into a nice html element
        alert(response.message)
    }
};
ws.onclose = function (event ){
    alert( 'You have lost the connection to the server, please reload' )
};