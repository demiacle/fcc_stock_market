var toString = (date, format) => {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${year}-${month}-${day}`
}
var parse = (dateString, format) => {
    const parts = dateString.split('-');
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1] - 1, 10);
    const year = parseInt(parts[1], 10);
    return new Date(year, month, day);
}
var pickerStart = new Pikaday({ field: document.getElementById('datePickerStart'), format: 'YYYY-M-D', toString, parse })
var pickerEnd = new Pikaday({ field: document.getElementById('datePickerEnd'), format: 'YYYY-M-D', toString, parse })
pickerStart.setDate(startDate)
pickerEnd.setDate(endDate)