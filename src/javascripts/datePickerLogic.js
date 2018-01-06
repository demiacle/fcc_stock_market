import * as websocketLogic from './websocketLogic.js';
var Pikaday = require('pikaday')

export function toString (date) {
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
export function changeDateStart () {
    var newDate = this._d;
    newDate = `${newDate.getFullYear()}-${pad(newDate.getMonth()+1)}-${pad(newDate.getDate())}`;
    websocketLogic.requestDateStart( newDate );
}
export function changeDateEnd () {
    var newDate = this._d;
    newDate = `${newDate.getFullYear()}-${pad(newDate.getMonth()+1)}-${pad(newDate.getDate())}`;
    websocketLogic.requestDateEnd( newDate );
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
export function setPikadayDate( start, end ){
    function fixMonth( date ) {
        date = date.split("-");
        date[1] = parseInt(date[1]) - 1; 
        return new Date( ...date );
    }
    pickerStart.setDate( fixMonth( start ), true )
    pickerEnd.setDate( fixMonth( end ), true )
}
