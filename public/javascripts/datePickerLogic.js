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
Number.prototype.pad = function(){
    var number = this;
    var needsZero = 2 - this.toString().length;
    if( needsZero ){
        number = '0' + number;
    }
    return number
}
function changeDateStart () {
    console.log(this)
    var newDate = this._d;
    console.log( `${newDate.getFullYear()}-${(newDate.getMonth()+1).pad()}-${newDate.getDate().pad()}` )
    requestDateStart( `${newDate.getFullYear()}-${(newDate.getMonth()+1).pad()}-${newDate.getDate().pad()}` );
}
function changeDateEnd ( test, test1, test2 ) {
    console.log(test)
    var newDate = this._d;
    console.log( `${newDate.getFullYear()}-${(newDate.getMonth()+1).pad()}-${newDate.getDate().pad()}` )
    requestDateEnd( `${newDate.getFullYear()}-${(newDate.getMonth()+1).pad()}-${newDate.getDate().pad()}` );
}
// SET DATE IS BUSTED
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
//pickerStart.setDate(startDate)
//pickerEnd.setDate(endDate)