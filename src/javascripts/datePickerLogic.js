import websocketLogic from './websocketLogic.js';

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
export function changeDateStart () {
    var newDate = this._d;
    websocketLogic.requestDateStart( `${newDate.getFullYear()}-${(newDate.getMonth()+1).pad()}-${newDate.getDate().pad()}` );
}
export function changeDateEnd ( test, test1, test2 ) {
    var newDate = this._d;
    websocketLogic.requestDateEnd( `${newDate.getFullYear()}-${(newDate.getMonth()+1).pad()}-${newDate.getDate().pad()}` );
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
export function setDate( start, end ){
    function fixMonth( date ) {
        date = date.split("-");
        date[1] = parseInt(date[1]) - 1; 
        return new Date( ...date );
    }

    pickerStart.setDate( fixMonth( start ), true )
    pickerEnd.setDate( fixMonth( end ), true )
}
