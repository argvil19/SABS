var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var expressSession = require('express-session');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var dbConfig = require('./dbconfig/config');
var passport = require('passport');
var flash = require('connect-flash');

mongoose.connect(dbConfig.db);

require('./passport_config/auth')(passport);

var routes = require('./routes/index');

var app = express();


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');


//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

app.use(expressSession({secret: 'mySecretKey'}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(function(req, res, next) {
  if (req.user) {
    req.toSend = {
      username:req.user.username,
      userLevel:req.user.userLevel
    };
  }
    return next();
});

require('./routes/index')(app, passport);

app.use(express.static(path.join(__dirname, 'public')));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
