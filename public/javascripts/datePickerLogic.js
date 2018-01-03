function toString (date, format) {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${year}-${month}-${day}`
}
function parse (dateString, format) {
    const parts = dateString.split('-');
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1] - 1, 10);
    const year = parseInt(parts[1], 10);
    return new Date(year, month, day);
}
function changeDateStart () {
    if( !this.hasLoaded ){
        this.hasLoaded = true;
        return;
    }
    console.log(this)
    var newDate = this._d;
    console.log( `${newDate.getFullYear()}-${newDate.getDate()}-${newDate.getMonth()+1}` )
    requestDateStart( `${newDate.getFullYear()}-${newDate.getDate()}-${newDate.getMonth()+1}` );
}
// TODO BUG IS STUCK IN LOOP reset is causing picker to pick which is causing another request
function changeDateEnd () {
    if( !this.hasLoaded ){
        this.hasLoaded = true;
        return;
    }
    var newDate = this._d;
    console.log( `${newDate.getFullYear()}-${newDate.getDate()}-${newDate.getMonth()+1}` )
    requestDateEnd( `${newDate.getFullYear()}-${newDate.getDate()}-${newDate.getMonth()+1}` );
}

var pickerStart = new Pikaday({ 
    field: document.getElementById('datePickerStart'),
    format: 'YYYY-M-D',
    toString,
    parse,
    onSelect: changeDateStart
 })
var pickerEnd = new Pikaday({ 
    field: document.getElementById('datePickerEnd'),
    format: 'YYYY-M-D',
    toString,
    parse,
    onSelect: changeDateEnd
 })
//pickerStart.setDate(startDate)
//pickerEnd.setDate(endDate)