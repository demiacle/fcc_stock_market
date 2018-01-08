var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var demiacleWebSocket = require('./server/demiacleWebSocket.server.js');
var localStorage = require('node-localstorage').LocalStorage;
var index = require('./routes/index');

var app = express();

var dotenv = require('dotenv')
dotenv.load();

// Load local storage
localStorage = new localStorage('localStorage')
if( localStorage.getItem('trackingStock') === null ){
  var defaults = {
    stocks: ['FB', 'AAPL', 'AMZN', 'TWTR', 'GOOGL'],
    endDate: '2017-11-30'
  }
  localStorage.setItem('trackingStock', JSON.stringify( defaults ) )
}
// Middleware to pass local storage to router
function passLocalStorage( req, res, next) {
  res.locals.localStorage = JSON.parse( localStorage.getItem("trackingStock") );
  next(); 
}

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', passLocalStorage, index );

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.startWebsocket = (server)=>{ demiacleWebSocket(server, localStorage) };

module.exports = app;